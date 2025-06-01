import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth';
import {
    createVenue,
    getVenueById,
    updateVenue,
    deleteVenue,
    getAllVenues,
    getAvailableVenues
} from '../services/venue.service';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

export const createVenueHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, address, capacity } = req.body;

        if (!name || !address || !capacity) {
            throw new ApiError(400, "Missing required fields");
        }

        const venue = await createVenue({
            name,
            address,
            capacity
        });

        return res.status(201).json(
            new ApiResponse(201, venue, "Venue created successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getVenueByIdHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const venue = await getVenueById(id);
        return res.status(200).json(
            new ApiResponse(200, venue, "Venue retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const updateVenueHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, address, capacity } = req.body;

        const venue = await updateVenue(id, {
            name,
            address,
            capacity
        });

        return res.status(200).json(
            new ApiResponse(200, venue, "Venue updated successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const deleteVenueHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        await deleteVenue(id);
        return res.status(200).json(
            new ApiResponse(200, null, "Venue deleted successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getAllVenuesHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const venues = await getAllVenues();
        return res.status(200).json(
            new ApiResponse(200, venues, "Venues retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getAvailableVenuesHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { date, capacity } = req.query;

        if (!date || !capacity) {
            throw new ApiError(400, "Missing required query parameters");
        }

        const venues = await getAvailableVenues(
            new Date(date as string),
            parseInt(capacity as string)
        );

        return res.status(200).json(
            new ApiResponse(200, venues, "Available venues retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
}; 