import express from 'express'
import { registerUser, loginUser, refreshTokenHandler, logoutUser } from '../controllers/auth.controller'
import { verifyToken } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshTokenHandler)
router.post('/logout', verifyToken, logoutUser)

export default router