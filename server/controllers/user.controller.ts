import { type Request, type Response } from 'express'
import prisma from '../prisma/client.js'

export async function getUser(req: Request, res: Response) {
    try {
        const { username } = req.params

        if (!username) {
            return res.status(400).json({ error: 'Username is required' })
        }

        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
