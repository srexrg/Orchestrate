import prisma from "../utils/prisma";
import {
  ApiError,
  RegisterAttendeeInput,
  AttendeeStatus,
} from "@orchestrate/shared";

const generateTicketNumber = (): string => {
  return `TKT-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
};

export const registerAttendee = async (input: RegisterAttendeeInput) => {
  try {
    // In microservices, we don't validate event/user existence here
    // That validation should happen at the API Gateway or client level
    // We trust that valid eventId and userId are provided

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
