import { Request, Response } from 'express';
import { register, login, refreshToken, logout } from '../services/auth.service';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { AuthenticatedRequest } from '../interfaces/auth';

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, name, roles } = req.body;

        if (!email || !password || !name) {
            throw new ApiError(400, "Missing required fields");
        }

        const { user, accessToken, refreshToken } = await register({
            email,
            password,
            name,
            roles: roles || ['ATTENDEE']
        });

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken, refreshToken },
                    "User registered successfully"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        const result = await login({ email, password });

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", result.accessToken, options)
            .cookie("refreshToken", result.refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user: result.user },
                    "Login successful"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
}

export const refreshTokenHandler = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new ApiError(401, "No refresh token provided");
        }

        const result = await refreshToken(token);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const logoutUser = async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    try {
        if (!req.user?.id) {
            throw new ApiError(401, "User not authenticated")
        }

        await logout(req.user.id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully"))
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message })
        } else {
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}