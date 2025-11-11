import { Router } from 'express'
import { getUser } from '../controllers/users.controller.js'
import { verifySession } from '../middleware/verifySession.middleware.js'

export const usersRouter = Router()

usersRouter.get('/user/:id', verifySession, getUser)

export default usersRouter
