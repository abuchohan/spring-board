import { Router } from 'express'
import { getUser, getUsers } from '../controllers/users.controller.js'
import { verifySession } from '../middleware/verifySession.middleware.js'

export const usersRouter = Router()

usersRouter.get('/user/:id', verifySession, getUser)
usersRouter.get('/', verifySession, getUsers)

export default usersRouter
