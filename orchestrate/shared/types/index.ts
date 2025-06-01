// Export utilities
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

// Export interfaces (add more as needed)
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
