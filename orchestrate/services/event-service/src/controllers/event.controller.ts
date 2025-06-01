import { Request, Response } from "express";
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByOrganizer,
} from "../services/event.service";
import { ApiResponse, ApiError } from "@orchestrate/shared";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    email: string;
    name: string;
  };
}

export const createEventHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { title, description, date, venueId, capacity, price } = req.body;
    const organizerId = req.user?.id;

    if (
      !title ||
      !date ||
      !organizerId ||
      !venueId ||
      !description ||
      !capacity ||
      !price
    ) {
      throw new ApiError(400, "Missing required fields");
    }

    const event = await createEvent({
      title,
      description,
      date: new Date(date),
      venueId,
      organizerId,
      capacity: req.body.capacity,
      price: req.body.price,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, event, "Event created successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Internal Server Error");
  }
};

export const getEventByIdHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    return res
      .status(200)
      .json(new ApiResponse(200, event, "Event retrieved successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Internal Server Error");
  }
};

export const updateEventHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, description, date, venueId } = req.body;

    const event = await updateEvent(id, {
      title,
      description,
      date: date ? new Date(date) : undefined,
      venueId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, event, "Event updated successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Internal Server Error");
  }
};

export const deleteEventHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const result = await deleteEvent(id);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Event deleted successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Internal Server Error");
  }
};

export const getOrganizerEventsHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) {
      throw new ApiError(401, "Unauthorized");
    }

    const events = await getEventsByOrganizer(organizerId);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          events,
          "Organizer's events retrieved successfully"
        )
      );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Internal Server Error");
  }
};
