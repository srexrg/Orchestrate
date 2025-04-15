import { Event, Venue, Ticket, EventAttendee } from '@prisma/client';

export interface CreateEventInput {
    name: string;
    description?: string;
    date: Date;
    venueId?: string;
    organizerId: string;
}

export interface UpdateEventInput {
    name?: string;
    description?: string;
    date?: Date;
    venueId?: string;
}

export interface CreateVenueInput {
    name: string;
    address: string;
    capacity: number;
}

export interface CreateTicketInput {
    eventId: string;
    userId: string;
    ticketType: string;
    price: number;
}

export interface EventWithRelations extends Event {
    venue?: Venue;
    organizer: {
        id: string;
        name: string;
        email: string;
    };
    tickets?: Ticket[];
    attendees?: EventAttendee[];
} 