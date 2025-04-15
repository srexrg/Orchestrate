import prisma from '../utils/prisma';
import ApiError from '../utils/ApiError';

export interface CreateVenueInput {
    name: string;
    address: string;
    capacity: number;
}

export interface UpdateVenueInput {
    name?: string;
    address?: string;
    capacity?: number;
}

export const createVenue = async (input: CreateVenueInput) => {
    try {
        const venue = await prisma.venue.create({
            data: {
                name: input.name,
                address: input.address,
                capacity: input.capacity
            }
        });
        return venue;
    } catch (error) {
        throw new ApiError(500, "Failed to create venue");
    }
};

export const getVenueById = async (id: string) => {
    try {
        const venue = await prisma.venue.findUnique({
            where: { id },
            include: {
                events: true
            }
        });

        if (!venue) {
            throw new ApiError(404, "Venue not found");
        }

        return venue;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Failed to fetch venue");
    }
};

export const updateVenue = async (id: string, input: UpdateVenueInput) => {
    try {
        const venue = await prisma.venue.update({
            where: { id },
            data: {
                name: input.name,
                address: input.address,
                capacity: input.capacity
            }
        });
        return venue;
    } catch (error) {
        throw new ApiError(500, "Failed to update venue");
    }
};

export const deleteVenue = async (id: string) => {
    try {

        const events = await prisma.event.findMany({
            where: { venueId: id }
        });

        if (events.length > 0) {
            throw new ApiError(400, "Cannot delete venue with associated events");
        }

        await prisma.venue.delete({
            where: { id }
        });
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Failed to delete venue");
    }
};

export const getAllVenues = async () => {
    try {
        const venues = await prisma.venue.findMany({
            include: {
                events: true
            }
        });
        return venues;
    } catch (error) {
        throw new ApiError(500, "Failed to fetch venues");
    }
};

export const getAvailableVenues = async (date: Date, capacity: number) => {
    try {
        const venues = await prisma.venue.findMany({
            where: {
                capacity: {
                    gte: capacity
                },
                events: {
                    none: {
                        date: date
                    }
                }
            }
        });
        return venues;
    } catch (error) {
        throw new ApiError(500, "Failed to fetch available venues");
    }
}; 