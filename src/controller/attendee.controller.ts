import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth';
import {
    registerAttendee,
    getEventAttendees,
    getUserEvents,
    cancelRegistration,
    checkRegistrationStatus
} from '../services/attendee.service';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

export const registerAttendeeHandler = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { eventId } = req.body;
        const userId = req.user?.id;

        if (!eventId || !userId) {
            throw new ApiError(400, "Missing required fields");
        }

        const registration = await registerAttendee({
            eventId,
            userId
        });

        return res.status(201).json(
            new ApiResponse(201, registration, "Successfully registered for event")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getEventAttendeesHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { eventId } = req.params;
        const attendees = await getEventAttendees(eventId);
        return res.status(200).json(
            new ApiResponse(200, attendees, "Event attendees retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getUserEventsHandler = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const events = await getUserEvents(userId);
        return res.status(200).json(
            new ApiResponse(200, events, "User events retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const cancelRegistrationHandler = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { eventId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        await cancelRegistration(eventId, userId);
        return res.status(200).json(
            new ApiResponse(200, null, "Registration cancelled successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const checkRegistrationStatusHandler = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { eventId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const status = await checkRegistrationStatus(eventId, userId);
        return res.status(200).json(
            new ApiResponse(200, status, "Registration status retrieved successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
}; 