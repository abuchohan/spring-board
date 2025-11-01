import { Router } from 'express'
import { getUser } from '../controllers/users.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

export const usersRouter = Router()

usersRouter.get('user/:id', authenticate, getUser)

export default usersRouter
