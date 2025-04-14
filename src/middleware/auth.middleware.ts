import { NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { AuthenticatedRequest } from "../interfaces/auth";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";


export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1]

        if (!token) {
            throw new ApiError(401, "Unauthorized")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                roles: true,
                email: true,
                name: true,
            }
        })

        if (!user) {
            throw new ApiError(401, "Invalid token")
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}
