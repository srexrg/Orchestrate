import prisma from "../utils/prisma";
import axios from "axios";
import {
  ApiError,
  RegisterAttendeeInput,
  AttendeeStatus,
} from "orchestrate-shared";

const generateTicketNumber = (): string => {
  return `TKT-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
};

const validateEvent = async (eventId: string): Promise<any> => {
  try {
    const eventServiceUrl =
      process.env.EVENT_SERVICE_URL || "http://event-service:3002";
    const response = await axios.get(
      `${eventServiceUrl}/${eventId}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new ApiError(404, "Event not found");
    }
    if (error.code === "ECONNREFUSED") {
      throw new ApiError(503, "Event service unavailable");
    }
    throw new ApiError(500, "Failed to validate event");
  }
};

const checkRegistrationAvailability = async (
  eventId: string
): Promise<boolean> => {
  try {
    const eventServiceUrl =
      process.env.EVENT_SERVICE_URL || "http://event-service:3002";
    const response = await axios.get(
      `${eventServiceUrl}/${eventId}/registration-availability`
    );
    return response.data.data.available;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new ApiError(404, "Event not found");
    }
    if (error.code === "ECONNREFUSED") {
      throw new ApiError(503, "Event service unavailable");
    }
    throw new ApiError(500, "Failed to check registration availability");
  }
};

export const registerAttendee = async (input: RegisterAttendeeInput) => {
  try {
    // Validate event exists and is active
    await validateEvent(input.eventId);

    // Check if event registration is still available
    const isAvailable = await checkRegistrationAvailability(input.eventId);
    if (!isAvailable) {
      throw new ApiError(400, "Event registration is full or closed");
    }

    const existingRegistration = await prisma.attendee.findFirst({
      where: {
        eventId: input.eventId,
        userId: input.userId,
      },
    });

    if (existingRegistration) {
      throw new ApiError(400, "User already registered for this event");
    }

    const registration = await prisma.attendee.create({
      data: {
        eventId: input.eventId,
        userId: input.userId,
        ticketNumber: generateTicketNumber(),
        status: AttendeeStatus.REGISTERED,
      },
    });

    return registration;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to register attendee");
  }
};

export const getEventAttendees = async (eventId: string) => {
  try {
    const attendees = await prisma.attendee.findMany({
      where: { eventId },
    });
    return attendees;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch event attendees");
  }
};

export const getUserEvents = async (userId: string) => {
  try {
    const registrations = await prisma.attendee.findMany({
      where: { userId },
    });
    return registrations;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch user registrations");
  }
};

export const cancelRegistration = async (eventId: string, userId: string) => {
  try {
    const registration = await prisma.attendee.findFirst({
      where: {
        eventId,
        userId,
      },
    });

    if (!registration) {
      throw new ApiError(404, "Registration not found");
    }

    await prisma.attendee.update({
      where: { id: registration.id },
      data: { status: AttendeeStatus.CANCELLED },
    });

    return { message: "Registration cancelled successfully" };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to cancel registration");
  }
};

export const checkRegistrationStatus = async (
  eventId: string,
  userId: string
) => {
  try {
    const registration = await prisma.attendee.findFirst({
      where: {
        eventId,
        userId,
      },
    });

    return {
      isRegistered: !!registration,
      registration,
    };
  } catch (error) {
    throw new ApiError(500, "Failed to check registration status");
  }
};

export const checkInAttendee = async (eventId: string, userId: string) => {
  try {
    const registration = await prisma.attendee.findFirst({
      where: {
        eventId,
        userId,
        status: AttendeeStatus.REGISTERED,
      },
    });

    if (!registration) {
      throw new ApiError(404, "Active registration not found");
    }

    const checkedInAttendee = await prisma.attendee.update({
      where: { id: registration.id },
      data: { status: AttendeeStatus.ATTENDED },
    });

    return checkedInAttendee;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to check in attendee");
  }
};

export const getAttendeeByTicket = async (ticketNumber: string) => {
  try {
    const attendee = await prisma.attendee.findUnique({
      where: { ticketNumber },
    });

    if (!attendee) {
      throw new ApiError(404, "Ticket not found");
    }

    return attendee;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch attendee by ticket");
  }
};

export const getRegistrationAvailability = async (eventId: string) => {
  try {
    // Validate event exists
    const event = await validateEvent(eventId);

    const isAvailable = await checkRegistrationAvailability(eventId);

    const currentRegistrations = await prisma.attendee.count({
      where: {
        eventId,
        status: {
          in: [AttendeeStatus.REGISTERED, AttendeeStatus.ATTENDED],
        },
      },
    });

    return {
      available: isAvailable,
      currentRegistrations,
      maxCapacity: event.maxAttendees || 0,
      remainingSpots: event.maxAttendees
        ? event.maxAttendees - currentRegistrations
        : null,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to check registration availability");
  }
};
