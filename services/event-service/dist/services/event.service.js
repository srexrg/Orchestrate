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
exports.getEventsByOrganizer = exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.createEvent = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const shared_1 = require("@orchestrate/shared");
const createEvent = (input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma_1.default.event.create({
            data: {
                title: input.title,
                description: input.description,
                date: input.date,
                venueId: input.venueId,
                organizerId: input.organizerId,
                capacity: input.capacity,
                price: input.price
            }
        });
        return event;
    }
    catch (error) {
        if (error instanceof shared_1.ApiError)
            throw error;
        throw new shared_1.ApiError(500, "Error creating event");
    }
});
exports.createEvent = createEvent;
const getEventById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma_1.default.event.findUnique({
            where: { id }
        });
        if (!event) {
            throw new shared_1.ApiError(404, "Event not found");
        }
        return event;
    }
    catch (error) {
        if (error instanceof shared_1.ApiError)
            throw error;
        throw new shared_1.ApiError(500, "Error fetching event");
    }
});
exports.getEventById = getEventById;
const updateEvent = (id, input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma_1.default.event.update({
            where: { id },
            data: input
        });
        return event;
    }
    catch (error) {
        if (error instanceof shared_1.ApiError)
            throw error;
        throw new shared_1.ApiError(500, "Error updating event");
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.event.delete({
            where: { id }
        });
        return { message: "Event deleted successfully" };
    }
    catch (error) {
        throw new shared_1.ApiError(500, "Error deleting event");
    }
});
exports.deleteEvent = deleteEvent;
const getEventsByOrganizer = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma_1.default.event.findMany({
            where: { organizerId }
        });
        return events;
    }
    catch (error) {
        throw new shared_1.ApiError(500, "Error fetching organizer's events");
    }
});
exports.getEventsByOrganizer = getEventsByOrganizer;
//# sourceMappingURL=event.service.js.map