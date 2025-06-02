import prisma from "../utils/prisma";
import axios from "axios";
import {
  CreateEventInput,
  UpdateEventInput,
  ApiError,
} from "orchestrate-shared";

// Helper function to check if venue exists and has sufficient capacity
const validateVenue = async (
  venueId: string,
  requiredCapacity: number
): Promise<boolean> => {
  try {
    // Get venue service URL from environment or use default
    const venueServiceUrl =
      process.env.VENUE_SERVICE_URL || "http://localhost:3003";

    // Make API call to venue service
    const response = await axios.get(`${venueServiceUrl}/${venueId}`);
    const venue = response.data.data;

    // Check if venue exists and has sufficient capacity
    if (!venue) {
      return false;
    }

    return venue.capacity >= requiredCapacity;
  } catch (error) {
    // If we can't reach venue service or venue doesn't exist
    return false;
  }
};

export const createEvent = async (input: CreateEventInput) => {
  try {
    // Validate that venue exists and has sufficient capacity
    if (input.venueId) {
      const venueIsValid = await validateVenue(input.venueId, input.capacity);

      if (!venueIsValid) {
        throw new ApiError(
          400,
          "Venue does not exist or has insufficient capacity"
        );
      }
    }

    const event = await prisma.event.create({
      data: {
        title: input.title,
        description: input.description,
        date: input.date,
        venueId: input.venueId,
        organizerId: input.organizerId,
        capacity: input.capacity,
        price: input.price,
      },
    });
    return event;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error creating event");
  }
};

export const getEventById = async (id: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    return event;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error fetching event");
  }
};

export const updateEvent = async (
  id: string,
  input: UpdateEventInput,
  organizerId: string
) => {
  try {
    // First check if event exists and user is the organizer
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      throw new ApiError(404, "Event not found");
    }

    if (existingEvent.organizerId !== organizerId) {
      throw new ApiError(403, "You don't have permission to update this event");
    }

    // If venue is being changed, validate new venue
    if (input.venueId && input.venueId !== existingEvent.venueId) {
      // Determine capacity to check - use new capacity if provided, otherwise use existing
      const capacityToCheck = input.capacity || existingEvent.capacity;
      const venueIsValid = await validateVenue(input.venueId, capacityToCheck);

      if (!venueIsValid) {
        throw new ApiError(
          400,
          "Selected venue does not exist or has insufficient capacity"
        );
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: input,
    });
    return event;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error updating event");
  }
};

export const deleteEvent = async (id: string, organizerId: string) => {
  try {
    // Check if event exists and user is the organizer
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      throw new ApiError(404, "Event not found");
    }

    if (existingEvent.organizerId !== organizerId) {
      throw new ApiError(403, "You don't have permission to delete this event");
    }

    // Check if event has attendees before deletion
    const attendeesCount = await prisma.eventAttendee.count({
      where: { eventId: id },
    });

    if (attendeesCount > 0) {
      throw new ApiError(
        400,
        "Cannot delete an event with registered attendees"
      );
    }

    await prisma.event.delete({
      where: { id },
    });
    return { message: "Event deleted successfully" };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error deleting event");
  }
};

export const getEventsByOrganizer = async (organizerId: string) => {
  try {
    const events = await prisma.event.findMany({
      where: { organizerId },
    });
    return events;
  } catch (error) {
    throw new ApiError(500, "Error fetching organizer's events");
  }
};

// Check venue availability for a given date
export const checkVenueAvailability = async (
  venueIds: string[],
  date: Date
) => {
  try {
    // Normalize the date to start of day to simplify comparison
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Find events that are taking place on the given day and using any of the specified venues
    const eventsOnDate = await prisma.event.findMany({
      where: {
        venueId: { in: venueIds },
        date: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000), // Add one day
        },
      },
      select: {
        id: true,
        venueId: true,
        date: true,
      },
    });

    const bookedVenueIds = new Set(eventsOnDate.map((event) => event.venueId));

    const availableVenueIds = venueIds.filter((id) => !bookedVenueIds.has(id));

    return {
      availableVenueIds,
      bookedVenueIds: Array.from(bookedVenueIds),
      date: targetDate,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error checking venue availability");
  }
};

export const getRegistrationAvailability = async (eventId: string) => {
  try {
    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // Check if event date has passed
    const now = new Date();
    if (event.date < now) {
      return {
        available: false,
        reason: "Event has already passed",
        currentRegistrations: 0,
        maxCapacity: event.capacity,
        remainingSpots: 0
      };
    }

    // Get current registration count from attendee service
    let currentRegistrations = 0;
    try {
      const attendeeServiceUrl = process.env.ATTENDEE_SERVICE_URL || "http://localhost:3002";
      const response = await axios.get(`${attendeeServiceUrl}/event/${eventId}`);
      currentRegistrations = response.data.data?.length || 0;
    } catch (error) {
      // If attendee service is unavailable, we can't get accurate count
      // but we can still allow registration if event is valid
      console.warn("Could not fetch attendee count from attendee service");
    }

    const remainingSpots = event.capacity - currentRegistrations;
    const available = remainingSpots > 0;

    return {
      available,
      reason: available ? "Registration open" : "Event is full",
      currentRegistrations,
      maxCapacity: event.capacity,
      remainingSpots: Math.max(0, remainingSpots)
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error checking registration availability");
  }
};
