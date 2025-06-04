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
exports.checkRegistrationAvailabilityHandler = exports.checkRegistrationStatusHandler = exports.cancelRegistrationHandler = exports.getUserEventsHandler = exports.getEventAttendeesHandler = exports.registerAttendeeHandler = void 0;
const orchestrate_shared_1 = require("orchestrate-shared");
const attendee_service_1 = require("../services/attendee.service");
const registerAttendeeHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { eventId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!eventId || !userId) {
            throw new orchestrate_shared_1.ApiError(400, "Missing required fields");
        }
        const registration = yield (0, attendee_service_1.registerAttendee)({
            eventId,
            userId
        });
        return res.status(201).json(new orchestrate_shared_1.ApiResponse(201, registration, "Successfully registered for event"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.registerAttendeeHandler = registerAttendeeHandler;
const getEventAttendeesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const attendees = yield (0, attendee_service_1.getEventAttendees)(eventId);
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, attendees, "Event attendees retrieved successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.getEventAttendeesHandler = getEventAttendeesHandler;
const getUserEventsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new orchestrate_shared_1.ApiError(401, "Unauthorized");
        }
        const events = yield (0, attendee_service_1.getUserEvents)(userId);
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, events, "User events retrieved successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.getUserEventsHandler = getUserEventsHandler;
const cancelRegistrationHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { eventId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new orchestrate_shared_1.ApiError(401, "Unauthorized");
        }
        yield (0, attendee_service_1.cancelRegistration)(eventId, userId);
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, null, "Registration cancelled successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.cancelRegistrationHandler = cancelRegistrationHandler;
const checkRegistrationStatusHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { eventId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new orchestrate_shared_1.ApiError(401, "Unauthorized");
        }
        const status = yield (0, attendee_service_1.checkRegistrationStatus)(eventId, userId);
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, status, "Registration status retrieved successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.checkRegistrationStatusHandler = checkRegistrationStatusHandler;
const checkRegistrationAvailabilityHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const availability = yield (0, attendee_service_1.getRegistrationAvailability)(eventId);
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, availability, "Registration availability retrieved successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.checkRegistrationAvailabilityHandler = checkRegistrationAvailabilityHandler;
//# sourceMappingURL=attendee.controller.js.map