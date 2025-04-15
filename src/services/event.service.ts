import prisma from '../utils/prisma';
import { CreateEventInput, UpdateEventInput, CreateVenueInput, CreateTicketInput } from '../interfaces/event';
import ApiError from '../utils/ApiError';

const checkVenueExists = async (venueId: string) => {
    const venue = await prisma.venue.findUnique({
        where: { id: venueId }
    });
    return !!venue;
};

export const createEvent = async (input: CreateEventInput) => {
    try {

        if (input.venueId) {
            const venueExists = await checkVenueExists(input.venueId);
            if (!venueExists) {
                throw new ApiError(404, "Venue not found");
            }
        }

        const event = await prisma.event.create({
            data: {
                name: input.name,
                description: input.description,
                date: input.date,
                venueId: input.venueId,
                organizerId: input.organizerId
            },
            include: {
                venue: true,
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
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
            where: { id },
            include: {
                venue: true,
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                tickets: true,
                attendees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
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
        if (input.venueId) {
            const venueExists = await checkVenueExists(input.venueId);
            if (!venueExists) {
                throw new ApiError(404, "Venue not found");
            }
        }

        const event = await prisma.event.update({
            where: { id },
            data: input,
            include: {
                venue: true,
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
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

export const createVenue = async (input: CreateVenueInput) => {
    try {
        const venue = await prisma.venue.create({
            data: input
        });
        return venue;
    } catch (error) {
        throw new ApiError(500, "Error creating venue");
    }
};

export const createTicket = async (input: CreateTicketInput) => {
    try {
        const ticket = await prisma.ticket.create({
            data: input,
            include: {
                event: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        return ticket;
    } catch (error) {
        throw new ApiError(500, "Error creating ticket");
    }
};

export const getEventsByOrganizer = async (organizerId: string) => {
    try {
        const events = await prisma.event.findMany({
            where: { organizerId },
            include: {
                venue: true,
                tickets: true,
                attendees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        return events;
    } catch (error) {
        throw new ApiError(500, "Error fetching organizer's events");
    }
};
