import { Request } from 'express';
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
export declare enum VenueStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    MAINTENANCE = "MAINTENANCE"
}
export declare enum UserRole {
    ATTENDEE = "ATTENDEE",
    ORGANIZER = "ORGANIZER",
    ADMIN = "ADMIN"
}
export declare enum AttendeeStatus {
    REGISTERED = "REGISTERED",
    ATTENDED = "ATTENDED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export interface RegisterAttendeeInput {
    eventId: string;
    userId: string;
}
export interface AttendeeInfo {
    id: string;
    userId: string;
    eventId: string;
    status: AttendeeStatus;
    ticketNumber: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        roles: UserRole[];
        email: string;
        name: string;
    };
}
