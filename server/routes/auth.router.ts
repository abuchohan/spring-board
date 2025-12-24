import { Router } from 'express'
import {
    register,
    login,
    logout,
    resetPassword,
    resetPasswordToken,
    validateResetToken,
    me,
} from '../controllers/auth.controller.js'
import { verifySession } from '../middleware/verifySession.middleware.js'

export const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/reset-password', resetPassword)
authRouter.get('/reset-password/:resetToken/validate', validateResetToken)
authRouter.post('/reset-password/:resetToken', resetPasswordToken)

authRouter.post('/logout', verifySession, logout)
authRouter.get('/me', verifySession, me)
