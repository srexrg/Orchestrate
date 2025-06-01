import { NextFunction, Response } from "express";
import ApiError from "../utils/ApiError";
import { AuthenticatedRequest } from "../interfaces/auth";
import { UserRole } from "@prisma/client";

export const checkRole = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new ApiError(401, "Unauthorized");
            }
            const hasRequiredRole = roles.some(role => 
                req.user!.roles.includes(role as UserRole)
            );

            if (!hasRequiredRole) {
                throw new ApiError(403, "Access denied. Insufficient permissions.");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}; 