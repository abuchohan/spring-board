import { type Request, type Response } from 'express'
import prisma from '../prisma/client.js'

export async function getUser(req: Request, res: Response) {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ error: 'Id is required' })
        }

        const user = await prisma.user.findFirst({
            where: {
                id: id,
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

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany()

        if (!users) {
            return res.status(404).json({ error: 'No users not found' })
        }

        return res.status(200).json(users)
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
