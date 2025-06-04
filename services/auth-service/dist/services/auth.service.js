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
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const orchestrate_shared_1 = require("orchestrate-shared");
const isValidRole = (role) => {
    return Object.values(client_1.UserRole).includes(role);
};
const generateTokens = (userId, roles) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = jsonwebtoken_1.default.sign({ userId, roles }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId, roles }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        yield prisma_1.default.user.update({
            data: { refreshToken },
            where: { id: userId }
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new orchestrate_shared_1.ApiError(500, "Error generating tokens");
    }
});
const register = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, name, roles }) {
    if (!roles.every(isValidRole)) {
        throw new orchestrate_shared_1.ApiError(400, "Invalid role provided");
    }
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        throw new orchestrate_shared_1.ApiError(409, "Email already registered");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            roles
        },
        select: {
            id: true,
            email: true,
            name: true,
            roles: true
        }
    });
    const { accessToken, refreshToken } = yield generateTokens(user.id, user.roles);
    return {
        user,
        accessToken,
        refreshToken
    };
});
exports.register = register;
const login = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new orchestrate_shared_1.ApiError(401, "Invalid credentials");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new orchestrate_shared_1.ApiError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken } = yield generateTokens(user.id, user.roles);
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles
        },
        accessToken,
        refreshToken
    };
});
exports.login = login;
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: decoded.userId,
                refreshToken
            },
            select: {
                id: true,
                email: true,
                name: true,
                roles: true
            }
        });
        if (!user) {
            throw new orchestrate_shared_1.ApiError(401, "Invalid refresh token");
        }
        const { accessToken, refreshToken: newRefreshToken } = yield generateTokens(user.id, user.roles);
        return {
            user,
            accessToken,
            refreshToken: newRefreshToken
        };
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new orchestrate_shared_1.ApiError(401, "Invalid refresh token");
        }
        throw error;
    }
});
exports.refreshToken = refreshToken;
const logout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        });
    }
    catch (error) {
        throw new orchestrate_shared_1.ApiError(500, "Error during logout");
    }
});
exports.logout = logout;
//# sourceMappingURL=auth.service.js.map