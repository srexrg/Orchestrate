import { Request, Response } from 'express';
import { register, login, refreshToken, logout } from '../services/auth.service';
import { ApiResponse, ApiError,AuthenticatedRequest } from 'orchestrate-shared';

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, name, roles } = req.body;
        console.log(req.body)

        if (!email || !password || !name) {
            return res.status(400).json(new ApiError(400, "Missing required fields"));
        }

        const { user, accessToken, refreshToken } = await register({
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
            .json(
                new ApiResponse(
                    201,
                    { user, accessToken },
                    "User registered successfully"
                )
            );
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(error);
        }
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(new ApiError(400, "Email and password are required"));
        }

        const result = await login({ email, password });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        return res
            .status(200)
            .cookie("accessToken", result.accessToken, options)
            .cookie("refreshToken", result.refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user: result.user, accessToken: result.accessToken },
                    "Login successful"
                )
            );
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(error);
        }
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

export const refreshTokenHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.refreshToken;
        
        if (!token) {
            return res.status(401).json(new ApiError(401, "No refresh token provided"));
        }

        const result = await refreshToken(token);
        
        return res.status(200).json(
            new ApiResponse(200, result, "Token refreshed successfully")
        );
    } catch (error) {
        console.error('Refresh token error:', error);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(error);
        }
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}

export const logoutUser = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        if (!req.user?.id) {
            return res.status(401).json(new ApiError(401, "User not authenticated"));
        }

        await logout(req.user.id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        console.error('Logout error:', error);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(error);
        }
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}