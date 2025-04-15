import express from 'express'
import { registerUser, loginUser, refreshTokenHandler } from '../controller/auth.controller'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshTokenHandler)

export default router