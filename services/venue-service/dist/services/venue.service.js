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
exports.getAvailableVenues = exports.getAllVenues = exports.deleteVenue = exports.updateVenue = exports.getVenueById = exports.createVenue = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const axios_1 = __importDefault(require("axios"));
const orchestrate_shared_1 = require("orchestrate-shared");
const createVenue = (input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const venue = yield prisma_1.default.venue.create({
            data: {
                name: input.name,
                address: input.address,
                capacity: input.capacity,
            },
        });
        return venue;
    }
    catch (error) {
        throw new orchestrate_shared_1.ApiError(500, "Failed to create venue");
    }
});
exports.createVenue = createVenue;
const getVenueById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const venue = yield prisma_1.default.venue.findUnique({
            where: { id },
        });
        if (!venue) {
            throw new orchestrate_shared_1.ApiError(404, "Venue not found");
        }
        return venue;
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Failed to fetch venue");
    }
});
exports.getVenueById = getVenueById;
const updateVenue = (id, input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const venue = yield prisma_1.default.venue.update({
            where: { id },
            data: {
                name: input.name,
                address: input.address,
                capacity: input.capacity,
            },
        });
        return venue;
    }
    catch (error) {
        throw new orchestrate_shared_1.ApiError(500, "Failed to update venue");
    }
});
exports.updateVenue = updateVenue;
const deleteVenue = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // In microservices, we don't check events here
        // Event service should handle venue reference validation
        yield prisma_1.default.venue.delete({
            where: { id },
        });
        return { message: "Venue deleted successfully" };
    }
    catch (error) {
        if (error instanceof orchestrate_shared_1.ApiError)
            throw error;
        throw new orchestrate_shared_1.ApiError(500, "Failed to delete venue");
    }
});
exports.deleteVenue = deleteVenue;
const getAllVenues = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const venues = yield prisma_1.default.venue.findMany({
            orderBy: { createdAt: "desc" },
        });
        return venues;
    }
    catch (error) {
        throw new orchestrate_shared_1.ApiError(500, "Failed to fetch venues");
    }
});
exports.getAllVenues = getAllVenues;
const getAvailableVenues = (capacity, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const venues = yield prisma_1.default.venue.findMany({
            where: {
                capacity: {
                    gte: capacity,
                },
                status: "ACTIVE",
            },
            orderBy: { capacity: "asc" },
        });
        if (!date) {
            return venues;
        }
        try {
            const eventServiceUrl = process.env.EVENT_SERVICE_URL || "http://localhost:3002";
            const venueIds = venues.map((venue) => venue.id);
            const response = yield axios_1.default.post(`${eventServiceUrl}/venue-availability`, {
                venueIds,
                date,
            });
            const availableVenueIds = response.data.data.availableVenueIds;
            return venues.filter((venue) => availableVenueIds.includes(venue.id));
        }
        catch (error) {
            console.error("Failed to check venue availability with event service:", error);
            throw new orchestrate_shared_1.ApiError(500, "Failed to check venue availability");
        }
    }
    catch (error) {
        throw new orchestrate_shared_1.ApiError(500, "Failed to fetch available venues");
    }
});
exports.getAvailableVenues = getAvailableVenues;
//# sourceMappingURL=venue.service.js.map