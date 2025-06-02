import { Request } from 'express';

export class ApiError extends Error {
    statusCode: number;
    success: boolean;
    errors: any[];

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: any, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export interface CreateEventInput {
  title: string;           
  description: string;
  date: Date;
  venueId: string;
  organizerId: string;
  capacity: number;
  price: number;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: Date;
  venueId?: string;
  capacity?: number;
  price?: number;
}

export interface CreateTicketInput {
  eventId: string;
  userId: string;
  ticketType: string;
  price: number;
}

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

export enum VenueStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    MAINTENANCE = 'MAINTENANCE'
}


export enum UserRole {
  ATTENDEE = 'ATTENDEE',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN'
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: UserRole[];
    email: string;
    name: string;
  };
}