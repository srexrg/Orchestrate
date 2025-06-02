import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest, ApiError, UserRole } from '@orchestrate/shared'

export const verifyToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.get('authorization')
        const token = authHeader?.split(' ')[1]
        
        if (!token) {
            throw new ApiError(401, "No token provided")
        }

        // Decode and verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string
            email: string
            name: string
            roles: UserRole[]
        }

        // In microservices, we trust the JWT token content
        // No need to query auth service database from event service
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            roles: decoded.roles
        }
        
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new ApiError(401, "Invalid token"))
        } else {
            next(error)
        }
    }
}
