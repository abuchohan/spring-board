import { NextFunction, type Request, type Response } from 'express'
import prisma from '../prisma/client.js'

export async function verifySession(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const sessionId = req.cookies.session_id

        if (!sessionId) {
            return res.status(401).json({ message: 'No session found' })
        }

        const currentSession = await prisma.session.findUnique({
            where: { sessionId: sessionId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatar: true,
                    },
                },
            },

            // ?? Something about this fetch feels off. I don't to be able to have the password in the request.
            // there is no type saftey if the res has got the password. Maybe something to look into
        })

        if (!currentSession) {
            return res
                .status(404)
                .json({ message: 'You do not have an active session' })
        }

        req.user = currentSession.user
        req.session = currentSession

        next()
    } catch (err) {
        res.status(500).json({ error: err })
    }
}
