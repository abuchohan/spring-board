import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'

export const authRouter = Router()

authRouter.get('/register', register)
authRouter.get('/login', login)
/**
 * TODO: Add Routes
 * 
    authRouter.get('/refresh-token')
    authRouter.get('/forgot-password')
    authRouter.get('/forgot-password/:token')
    authRouter.get('/me')
    authRouter.get('/logout')
 */

export default authRouter
