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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizerEventsHandler = exports.deleteEventHandler = exports.updateEventHandler = exports.getEventByIdHandler = exports.createEventHandler = void 0;
const event_service_1 = require("../services/event.service");
const shared_1 = require("@orchestrate/shared");
const createEventHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, date, venueId, capacity, price } = req.body;
        const organizerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!title ||
            !date ||
            !organizerId ||
            !venueId ||
            !description ||
            !capacity ||
            !price) {
            throw new shared_1.ApiError(400, "Missing required fields");
        }
        const event = yield (0, event_service_1.createEvent)({
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
            .json(new shared_1.ApiResponse(201, event, "Event created successfully"));
    }
    catch (error) {
        if (error instanceof shared_1.ApiError)
            throw error;
        throw new shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.createEventHandler = createEventHandler;
const getEventByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const event = yield (0, event_service_1.getEventById)(id);
        return res
            .status(200)
            .json(new shared_1.ApiResponse(200, event, "Event retrieved successfully"));
    }
    catch (error) {
        if (error instanceof shared_1.ApiError)
            throw error;
        throw new shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.getEventByIdHandler = getEventByIdHandler;
const updateEventHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, date, venueId } = req.body;
        const event = yield (0, event_service_1.updateEvent)(id, {
            title,
            description,
            date: date ? new Date(date) : undefined,
            venueId,
        });
        return res
            .status(200)
            .json(new shared_1.ApiResponse(200, event, "Event updated successfully"));
    }
    catch (error) {
        if (error instanceof shared_1.ApiError)
            throw error;
        throw new shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.updateEventHandler = updateEventHandler;
const deleteEventHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, event_service_1.deleteEvent)(id);
        return res
            .status(200)
            .json(new shared_1.ApiResponse(200, result, "Event deleted successfully"));
    }
    catch (error) {
        if (error instanceof shared_1.ApiError)
            throw error;
        throw new shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.deleteEventHandler = deleteEventHandler;
const getOrganizerEventsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const organizerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!organizerId) {
            throw new shared_1.ApiError(401, "Unauthorized");
        }
        const events = yield (0, event_service_1.getEventsByOrganizer)(organizerId);
        return res
            .status(200)
            .json(new shared_1.ApiResponse(200, events, "Organizer's events retrieved successfully"));
    }
    catch (error) {
        if (error instanceof shared_1.ApiError)
            throw error;
        throw new shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.getOrganizerEventsHandler = getOrganizerEventsHandler;
//# sourceMappingURL=event.controller.js.map