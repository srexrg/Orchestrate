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
exports.getAvailableVenuesHandler = exports.getAllVenuesHandler = exports.deleteVenueHandler = exports.updateVenueHandler = exports.getVenueByIdHandler = exports.createVenueHandler = void 0;
const venue_service_1 = require("../services/venue.service");
const orchestrate_shared_1 = require("orchestrate-shared");
const createVenueHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, capacity } = req.body;
        if (!name || !address || !capacity) {
            throw new orchestrate_shared_1.ApiError(400, "Missing required fields");
        }
        const venue = yield (0, venue_service_1.createVenue)({
            name,
            address,
            capacity
        });
        return res.status(201).json(new orchestrate_shared_1.ApiResponse(201, venue, "Venue created successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.createVenueHandler = createVenueHandler;
const getVenueByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const venue = yield (0, venue_service_1.getVenueById)(id);
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, venue, "Venue retrieved successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.getVenueByIdHandler = getVenueByIdHandler;
const updateVenueHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, address, capacity } = req.body;
        const venue = yield (0, venue_service_1.updateVenue)(id, {
            name,
            address,
            capacity
        });
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, venue, "Venue updated successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.updateVenueHandler = updateVenueHandler;
const deleteVenueHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, venue_service_1.deleteVenue)(id);
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, null, "Venue deleted successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.deleteVenueHandler = deleteVenueHandler;
const getAllVenuesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const venues = yield (0, venue_service_1.getAllVenues)();
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, venues, "Venues retrieved successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.getAllVenuesHandler = getAllVenuesHandler;
const getAvailableVenuesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, capacity } = req.query;
        if (!capacity || !date) {
            throw new orchestrate_shared_1.ApiError(400, "Missing required capacity parameter");
        }
        const capacityValue = parseInt(capacity);
        const venues = yield (0, venue_service_1.getAvailableVenues)(capacityValue, new Date(date));
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, venues, "Available venues retrieved successfully"));
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Internal Server Error");
    }
});
exports.getAvailableVenuesHandler = getAvailableVenuesHandler;
//# sourceMappingURL=venue.controller.js.map