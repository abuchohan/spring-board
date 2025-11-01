import { Router } from 'express'
import { usersRouter } from './users.router.js'
import authRouter from './auth.router.js'

const router = Router()

router.use('/users', usersRouter)
router.use('/auth', authRouter)

export default router
