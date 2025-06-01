import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'
import ApiError from '../utils/ApiError'
import { AuthenticatedRequest } from '../interfaces/auth'
import { UserRole } from '@prisma/client'

export const verifyToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            throw new ApiError(401, "No token provided")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string
            roles: UserRole[]
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                roles: true
            }
        })

        if (!user) {
            throw new ApiError(401, "User not found")
        }

        if (!decoded.roles.every(role => user.roles.includes(role))) {
            throw new ApiError(401, "Invalid token")
        }

        req.user = user
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new ApiError(401, "Invalid token"))
        } else {
            next(error)
        }
    }
}
