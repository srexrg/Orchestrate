import prisma from "../utils/prisma";
import {
  CreateEventInput,
  UpdateEventInput,
  ApiError
} from "@orchestrate/shared";



export const createEvent = async (input: CreateEventInput) => {
  try {
    const event = await prisma.event.create({
      data: {
        title: input.title,         
        description: input.description,
        date: input.date,
        venueId: input.venueId,
        organizerId: input.organizerId,
        capacity: input.capacity,
        price: input.price
      }
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
      where: { id }
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

export const updateEvent = async (id: string, input: UpdateEventInput) => {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: input
    });
    return event;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error updating event");
  }
};

export const deleteEvent = async (id: string) => {
  try {
    await prisma.event.delete({
      where: { id }
    });
    return { message: "Event deleted successfully" };
  } catch (error) {
    throw new ApiError(500, "Error deleting event");
  }
};

export const getEventsByOrganizer = async (organizerId: string) => {
  try {
    const events = await prisma.event.findMany({
      where: { organizerId }
    });
    return events;
  } catch (error) {
    throw new ApiError(500, "Error fetching organizer's events");
  }
};
