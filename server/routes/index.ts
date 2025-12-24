import { Router } from 'express'
import { usersRouter } from './users.router.ts'
import { authRouter } from './auth.router.ts'
import { voiceNotesRouter } from './voice-notes.router.ts'
import { verifySession } from '../middleware/verifySession.middleware.ts'

const router = Router()

router.use('/users', usersRouter)
router.use('/auth', authRouter)
router.use('/voice-notes', verifySession, voiceNotesRouter)

export default router
