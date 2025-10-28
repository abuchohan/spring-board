import { Router } from 'express'
import {
    register,
    login,
    // forgotPassword,
    // resetPassword,
} from '../controllers/auth.controller.js'

export const authRouter = Router()

authRouter.use('/register', register)
authRouter.use('/login', login)
// authRouter.use('/forgot-password', register)
// authRouter.use('/reset-password', register)

export default authRouter
