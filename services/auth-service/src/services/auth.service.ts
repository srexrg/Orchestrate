import prisma from '../utils/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserRole } from '@prisma/client'
import  {ApiError} from 'orchestrate-shared';



const isValidRole = (role: string): role is UserRole => {
    return Object.values(UserRole).includes(role as UserRole)
}

const generateTokens = async (userId: string, roles: UserRole[]) => {
    try {
        const accessToken = jwt.sign(
            { userId, roles },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        )

        const refreshToken = jwt.sign(
            { userId, roles },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '7d' }
        )

        await prisma.user.update({
            data: { refreshToken },
            where: { id: userId }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Error generating tokens")
    }
}

export const register = async ({
    email,
    password,
    name,
    roles
}: {
    email: string
    password: string
    name: string
    roles: string[]
}) => {
    if (!roles.every(isValidRole)) {
        throw new ApiError(400, "Invalid role provided")
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        throw new ApiError(409, "Email already registered")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
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
    })

    const { accessToken, refreshToken } = await generateTokens(user.id, user.roles as UserRole[])

    return {
        user,
        accessToken,
        refreshToken
    }
}

export const login = async ({
    email,
    password
}: {
    email: string
    password: string
}) => {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        throw new ApiError(401, "Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateTokens(user.id, user.roles as UserRole[])

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles
        },
        accessToken,
        refreshToken
    }
}

export const refreshToken = async (refreshToken: string) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
            userId: string
            roles: UserRole[]
        }

        const user = await prisma.user.findUnique({
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
        })

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }


        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user.id, user.roles as UserRole[])

        return {
            user,
            accessToken,
            refreshToken: newRefreshToken
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "Invalid refresh token")
        }
        throw error
    }
}

export const logout = async (userId: string) => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        })
    } catch (error) {
        throw new ApiError(500, "Error during logout")
    }
}