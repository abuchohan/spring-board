import { Router } from 'express'
import {
    register,
    login,
    logout,
    resetPassword,
    resetPasswordToken,
    me,
} from '../controllers/auth.controller.js'
import { verifySession } from '../middleware/verifySession.middleware.js'

export const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/reset-password', resetPassword)
authRouter.post('/reset-password/:token', resetPasswordToken)

authRouter.post('/logout', verifySession, logout)
authRouter.get('/me', verifySession, me)

export default authRouter
