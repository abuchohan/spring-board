import { type Request, type Response } from 'express'
import prisma from '../prisma/client.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { error } from 'console'

const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = 10

export async function register(req: Request, res: Response) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: 'Email and Password are required' })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            return res
                .status(409)
                .json({ error: 'This Email is already being used' })
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const user = await prisma.user.create({
            data: { email: email, password: hashedPassword },
            select: { id: true, email: true },
        })

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not set')
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: '1d',
        })

        return res.status(200).json({ user, token })
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Email and password required' })
        }

        const user = await prisma.user.findUnique({ where: { email: email } })
        if (!user) {
            return res.status(401).json({ error: 'Invalid Email' })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid Password' })
        }

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not set')
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({
            user: { id: user.id, email: user.email },
            token,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
