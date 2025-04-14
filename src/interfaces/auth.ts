import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        roles: string[];
        email: string;
        name: string;
    };
}