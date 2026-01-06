import { Router } from 'express'
import { usersRouter } from './users.router.js'
import { authRouter } from './auth.router.js'
import { voiceNotesRouter } from './voice-notes.router.js'
import { verifySession } from '../middleware/verifySession.middleware.js'

const router = Router()

router.use('/users', usersRouter)
router.use('/auth', authRouter)
router.use('/voice-notes', verifySession, voiceNotesRouter)

export default router
