import prisma from "../utils/prisma";
import axios from "axios";
import {
  ApiError,
  CreateVenueInput,
  UpdateVenueInput,
} from "@orchestrate/shared";

export const createVenue = async (input: CreateVenueInput) => {
  try {
    const venue = await prisma.venue.create({
      data: {
        name: input.name,
        address: input.address,
        capacity: input.capacity,
      },
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
        capacity: input.capacity,
      },
    });
    return venue;
  } catch (error) {
    throw new ApiError(500, "Failed to update venue");
  }
};

export const deleteVenue = async (id: string) => {
  try {
    // In microservices, we don't check events here
    // Event service should handle venue reference validation
    await prisma.venue.delete({
      where: { id },
    });

    return { message: "Venue deleted successfully" };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to delete venue");
  }
};

export const getAllVenues = async () => {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: "desc" },
    });
    return venues;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch venues");
  }
};

export const getAvailableVenues = async (capacity: number, date?: Date) => {
  try {
    const venues = await prisma.venue.findMany({
      where: {
        capacity: {
          gte: capacity,
        },
        status: "ACTIVE",
      },
      orderBy: { capacity: "asc" },
    });

    if (!date) {
      return venues;
    }

    try {
      const eventServiceUrl =
        process.env.EVENT_SERVICE_URL || "http://localhost:3002";

      const venueIds = venues.map((venue) => venue.id);

      const response = await axios.post(
        `${eventServiceUrl}/venue-availability`,
        {
          venueIds,
          date,
        }
      );

      const availableVenueIds = response.data.data.availableVenueIds;

      return venues.filter((venue) => availableVenueIds.includes(venue.id));
    } catch (error) {
      console.error(
        "Failed to check venue availability with event service:",
        error
      );
      throw new ApiError(500, "Failed to check venue availability");
    }
  } catch (error) {
    throw new ApiError(500, "Failed to fetch available venues");
  }
};
