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
exports.logoutUser = exports.refreshTokenHandler = exports.loginUser = exports.registerUser = void 0;
const auth_service_1 = require("../services/auth.service");
const orchestrate_shared_1 = require("orchestrate-shared");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, roles } = req.body;
        console.log(req.body);
        if (!email || !password || !name) {
            return res.status(400).json(new orchestrate_shared_1.ApiError(400, "Missing required fields"));
        }
        const { user, accessToken, refreshToken } = yield (0, auth_service_1.register)({
            email,
            password,
            name,
            roles: roles || ['ATTENDEE']
        });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };
        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new orchestrate_shared_1.ApiResponse(201, { user, accessToken }, "User registered successfully"));
    }
    catch (error) {
        console.error('Registration error:', error);
        if (error instanceof orchestrate_shared_1.ApiError) {
            return res.status(error.statusCode).json(error);
        }
        return res.status(500).json(new orchestrate_shared_1.ApiError(500, "Internal Server Error"));
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(new orchestrate_shared_1.ApiError(400, "Email and password are required"));
        }
        const result = yield (0, auth_service_1.login)({ email, password });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };
        return res
            .status(200)
            .cookie("accessToken", result.accessToken, options)
            .cookie("refreshToken", result.refreshToken, options)
            .json(new orchestrate_shared_1.ApiResponse(200, { user: result.user, accessToken: result.accessToken }, "Login successful"));
    }
    catch (error) {
        console.error('Login error:', error);
        if (error instanceof orchestrate_shared_1.ApiError) {
            return res.status(error.statusCode).json(error);
        }
        return res.status(500).json(new orchestrate_shared_1.ApiError(500, "Internal Server Error"));
    }
});
exports.loginUser = loginUser;
const refreshTokenHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json(new orchestrate_shared_1.ApiError(401, "No refresh token provided"));
        }
        const result = yield (0, auth_service_1.refreshToken)(token);
        return res.status(200).json(new orchestrate_shared_1.ApiResponse(200, result, "Token refreshed successfully"));
    }
    catch (error) {
        console.error('Refresh token error:', error);
        if (error instanceof orchestrate_shared_1.ApiError) {
            return res.status(error.statusCode).json(error);
        }
        return res.status(500).json(new orchestrate_shared_1.ApiError(500, "Internal Server Error"));
    }
});
exports.refreshTokenHandler = refreshTokenHandler;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json(new orchestrate_shared_1.ApiError(401, "User not authenticated"));
        }
        yield (0, auth_service_1.logout)(req.user.id);
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new orchestrate_shared_1.ApiResponse(200, {}, "User logged out successfully"));
    }
    catch (error) {
        console.error('Logout error:', error);
        if (error instanceof orchestrate_shared_1.ApiError) {
            return res.status(error.statusCode).json(error);
        }
        return res.status(500).json(new orchestrate_shared_1.ApiError(500, "Internal Server Error"));
    }
});
exports.logoutUser = logoutUser;
//# sourceMappingURL=auth.controller.js.map