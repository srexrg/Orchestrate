import { Request } from "express";
import { UserRole } from "@prisma/client";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        roles: UserRole[];
        email: string;
        name: string;
    };
}