import prisma from '../utils/prisma';
import ApiError from '../utils/ApiError';

export interface RegisterAttendeeInput {
    eventId: string;
    userId: string;
}

export const registerAttendee = async (input: RegisterAttendeeInput) => {
    try {
        
        const event = await prisma.event.findUnique({
            where: { id: input.eventId }
        });

        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        const user = await prisma.user.findUnique({
            where: { id: input.userId }
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        
        const existingRegistration = await prisma.eventAttendee.findFirst({
            where: {
                eventId: input.eventId,
                userId: input.userId
            }
        });

        if (existingRegistration) {
            throw new ApiError(400, "User already registered for this event");
        }

        const registration = await prisma.eventAttendee.create({
            data: {
                eventId: input.eventId,
                userId: input.userId
            },
            include: {
                event: true,
                user: true
            }
        });

        return registration;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Failed to register attendee");
    }
};

export const getEventAttendees = async (eventId: string) => {
    try {
        const attendees = await prisma.eventAttendee.findMany({
            where: { eventId },
            include: {
                user: true
            }
        });
        return attendees;
    } catch (error) {
        throw new ApiError(500, "Failed to fetch event attendees");
    }
};

export const getUserEvents = async (userId: string) => {
    try {
        const events = await prisma.eventAttendee.findMany({
            where: { userId },
            include: {
                event: {
                    include: {
                        venue: true,
                        organizer: true
                    }
                }
            }
        });
        return events;
    } catch (error) {
        throw new ApiError(500, "Failed to fetch user events");
    }
};

export const cancelRegistration = async (eventId: string, userId: string) => {
    try {
        const registration = await prisma.eventAttendee.findFirst({
            where: {
                eventId,
                userId
            }
        });

        if (!registration) {
            throw new ApiError(404, "Registration not found");
        }

        await prisma.eventAttendee.delete({
            where: { id: registration.id }
        });
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Failed to cancel registration");
    }
};

export const checkRegistrationStatus = async (eventId: string, userId: string) => {
    try {
        const registration = await prisma.eventAttendee.findFirst({
            where: {
                eventId,
                userId
            },
            include: {
                event: true
            }
        });

        return {
            isRegistered: !!registration,
            registration
        };
    } catch (error) {
        throw new ApiError(500, "Failed to check registration status");
    }
}; 