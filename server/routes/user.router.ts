import { Router } from 'express'
import { getUser } from '../controllers/user.controller.js'

export const userRouter = Router()

userRouter.use('/:username', getUser)

export default userRouter
