"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistrationAvailability = exports.getAttendeeByTicket = exports.checkInAttendee = exports.checkRegistrationStatus = exports.cancelRegistration = exports.getUserEvents = exports.getEventAttendees = exports.registerAttendee = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const axios_1 = __importDefault(require("axios"));
const orchestrate_shared_1 = require("orchestrate-shared");
const generateTicketNumber = () => {
    return `TKT-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
};
const validateEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const eventServiceUrl = process.env.EVENT_SERVICE_URL || "http://localhost:3001";
        const response = yield axios_1.default.get(`${eventServiceUrl}/api/events/${eventId}`);
        return response.data.data;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            throw new orchestrate_shared_1.ApiError(404, "Event not found");
        }
        if (error.code === "ECONNREFUSED") {
            throw new orchestrate_shared_1.ApiError(503, "Event service unavailable");
        }
        throw new orchestrate_shared_1.ApiError(500, "Failed to validate event");
    }
});
const checkRegistrationAvailability = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const eventServiceUrl = process.env.EVENT_SERVICE_URL || "http://localhost:3001";
        const response = yield axios_1.default.get(`${eventServiceUrl}/api/events/${eventId}/registration-availability`);
        return response.data.data.available;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            throw new orchestrate_shared_1.ApiError(404, "Event not found");
        }
        if (error.code === "ECONNREFUSED") {
            throw new orchestrate_shared_1.ApiError(503, "Event service unavailable");
        }
        throw new orchestrate_shared_1.ApiError(500, "Failed to check registration availability");
    }
});
const registerAttendee = (input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate event exists and is active
        yield validateEvent(input.eventId);
        // Check if event registration is still available
        const isAvailable = yield checkRegistrationAvailability(input.eventId);
        if (!isAvailable) {
            throw new orchestrate_shared_1.ApiError(400, "Event registration is full or closed");
        }
        const existingRegistration = yield prisma_1.default.attendee.findFirst({
            where: {
                eventId: input.eventId,
                userId: input.userId,
            },
        });
        if (existingRegistration) {
            throw new orchestrate_shared_1.ApiError(400, "User already registered for this event");
        }
        const registration = yield prisma_1.default.attendee.create({
            data: {
                eventId: input.eventId,
                userId: input.userId,
                ticketNumber: generateTicketNumber(),
                status: orchestrate_shared_1.AttendeeStatus.REGISTERED,
            },
        });
        return registration;
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Failed to register attendee");
    }
});
exports.registerAttendee = registerAttendee;
const getEventAttendees = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attendees = yield prisma_1.default.attendee.findMany({
            where: { eventId },
        });
        return attendees;
    }
    catch (error) {
        throw new orchestrate_shared_1.ApiError(500, "Failed to fetch event attendees");
    }
});
exports.getEventAttendees = getEventAttendees;
const getUserEvents = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registrations = yield prisma_1.default.attendee.findMany({
            where: { userId },
        });
        return registrations;
    }
    catch (error) {
        throw new orchestrate_shared_1.ApiError(500, "Failed to fetch user registrations");
    }
});
exports.getUserEvents = getUserEvents;
const cancelRegistration = (eventId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registration = yield prisma_1.default.attendee.findFirst({
            where: {
                eventId,
                userId,
            },
        });
        if (!registration) {
            throw new orchestrate_shared_1.ApiError(404, "Registration not found");
        }
        yield prisma_1.default.attendee.update({
            where: { id: registration.id },
            data: { status: orchestrate_shared_1.AttendeeStatus.CANCELLED },
        });
        return { message: "Registration cancelled successfully" };
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Failed to cancel registration");
    }
});
exports.cancelRegistration = cancelRegistration;
const checkRegistrationStatus = (eventId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registration = yield prisma_1.default.attendee.findFirst({
            where: {
                eventId,
                userId,
            },
        });
        return {
            isRegistered: !!registration,
            registration,
        };
    }
    catch (error) {
        throw new orchestrate_shared_1.ApiError(500, "Failed to check registration status");
    }
});
exports.checkRegistrationStatus = checkRegistrationStatus;
const checkInAttendee = (eventId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registration = yield prisma_1.default.attendee.findFirst({
            where: {
                eventId,
                userId,
                status: orchestrate_shared_1.AttendeeStatus.REGISTERED,
            },
        });
        if (!registration) {
            throw new orchestrate_shared_1.ApiError(404, "Active registration not found");
        }
        const checkedInAttendee = yield prisma_1.default.attendee.update({
            where: { id: registration.id },
            data: { status: orchestrate_shared_1.AttendeeStatus.ATTENDED },
        });
        return checkedInAttendee;
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Failed to check in attendee");
    }
});
exports.checkInAttendee = checkInAttendee;
const getAttendeeByTicket = (ticketNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attendee = yield prisma_1.default.attendee.findUnique({
            where: { ticketNumber },
        });
        if (!attendee) {
            throw new orchestrate_shared_1.ApiError(404, "Ticket not found");
        }
        return attendee;
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Failed to fetch attendee by ticket");
    }
});
exports.getAttendeeByTicket = getAttendeeByTicket;
const getRegistrationAvailability = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate event exists
        const event = yield validateEvent(eventId);
        const isAvailable = yield checkRegistrationAvailability(eventId);
        const currentRegistrations = yield prisma_1.default.attendee.count({
            where: {
                eventId,
                status: {
                    in: [orchestrate_shared_1.AttendeeStatus.REGISTERED, orchestrate_shared_1.AttendeeStatus.ATTENDED],
                },
            },
        });
        return {
            available: isAvailable,
            currentRegistrations,
            maxCapacity: event.maxAttendees || 0,
            remainingSpots: event.maxAttendees
                ? event.maxAttendees - currentRegistrations
                : null,
        };
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Failed to check registration availability");
    }
});
exports.getRegistrationAvailability = getRegistrationAvailability;
//# sourceMappingURL=attendee.service.js.map