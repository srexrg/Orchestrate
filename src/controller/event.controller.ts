import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth';
import {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    createVenue,
    createTicket,
    getEventsByOrganizer
} from '../services/event.service';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

export const createEventHandler = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { name, description, date, venueId } = req.body;
        const organizerId = req.user?.id;

        if (!name || !date || !organizerId) {
            throw new ApiError(400, "Missing required fields");
        }

        const event = await createEvent({
            name,
            description,
            date: new Date(date),
            venueId,
            organizerId
        });

        return res.status(201).json(
            new ApiResponse(201, event, "Event created successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getEventByIdHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const event = await getEventById(id);
        return res.status(200).json(
            new ApiResponse(200, event, "Event retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const updateEventHandler = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, description, date, venueId } = req.body;

        const event = await updateEvent(id, {
            name,
            description,
            date: date ? new Date(date) : undefined,
            venueId
        });

        return res.status(200).json(
            new ApiResponse(200, event, "Event updated successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const deleteEventHandler = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const result = await deleteEvent(id);
        return res.status(200).json(
            new ApiResponse(200, result, "Event deleted successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const createVenueHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, address, capacity } = req.body;

        if (!name || !address || !capacity) {
            throw new ApiError(400, "Missing required fields");
        }

        const venue = await createVenue({
            name,
            address,
            capacity: Number(capacity)
        });

        return res.status(201).json(
            new ApiResponse(201, venue, "Venue created successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const createTicketHandler = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { eventId, ticketType, price } = req.body;
        const userId = req.user?.id;

        if (!eventId || !ticketType || !price || !userId) {
            throw new ApiError(400, "Missing required fields");
        }

        const ticket = await createTicket({
            eventId,
            userId,
            ticketType,
            price: Number(price)
        });

        return res.status(201).json(
            new ApiResponse(201, ticket, "Ticket created successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getOrganizerEventsHandler = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const organizerId = req.user?.id;
        if (!organizerId) {
            throw new ApiError(401, "Unauthorized");
        }

        const events = await getEventsByOrganizer(organizerId);
        return res.status(200).json(
            new ApiResponse(200, events, "Organizer's events retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};
