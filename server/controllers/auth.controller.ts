import { type Request, type Response } from 'express'
import prisma from '../prisma/client.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

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

        // !! Add some validation to the password. Also use this logic in password reset
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const user = await prisma.user.create({
            data: { email: email, password: hashedPassword },
            select: { id: true, email: true },
        })

        return res.status(200).json({ user })
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

        const sessionId = crypto.randomUUID()
        const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days

        const existingSession = await prisma.session.findFirst({
            where: {
                userId: user.id,
                expiresAt: { gt: new Date() },
            },
        })

        if (!existingSession) {
            await prisma.session.create({
                data: {
                    sessionId: sessionId,
                    userId: user.id,
                    expiresAt: expiresAt,
                },
            })

            res.cookie('session_id', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                expires: expiresAt,
            })

            return res.status(200).json({
                message: 'You have been logged in',
                user: { id: user.id, email: user.email },
                sessionId: sessionId,
            })
        }

        res.cookie('session_id', existingSession.sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: existingSession.expiresAt,
        })

        return res.status(200).json({
            message: 'You already have a session',
            user: { id: user.id, email: user.email },
            sessionId: existingSession.sessionId,
        })
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

export async function logout(req: Request, res: Response) {
    try {
        const { session } = req

        await prisma.session.delete({
            where: { sessionId: session!.sessionId },
        })

        res.clearCookie('session_id', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        })

        res.status(200).json({ message: 'you have been logged out' })
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error ' + err })
    }
}

export async function resetPassword(req: Request, res: Response) {
    try {
        const { email } = req.body

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        if (!email) {
            return res.status(400).json({ message: 'Email required' })
        }

        const user = await prisma.user.findUnique({ where: { email: email } })

        if (!user) {
            return res.status(401).json({ error: 'Invalid Email' })
        }

        const existingResetToken = await prisma.passwordReset.findFirst({
            where: {
                userId: user.id,
                used: false,
                expiresAt: { gt: new Date() },
            },
        })

        if (existingResetToken) {
            return res.status(401).json({
                message: 'you currently have a reset token',
                token: existingResetToken.token, // ⚠️ return this only in dev/testing, not prod
            })
        }

        const token = crypto.randomBytes(32).toString('hex')

        // !! I need more information on how to store a reset token.
        // const hashedToken = await bcrypt.hash(token, SALT_ROUNDS)

        await prisma.passwordReset.create({
            data: {
                expiresAt: expiresAt,
                token: token,
                userId: user.id,
            },
        })

        return res.status(200).json({
            token,
            // add reset unhashed token here. with a message to say it's been emailed -> ONLY FOR TESTING PURPOSES
            message: 'We have email you a password reset link',
        })
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

export async function resetPasswordToken(req: Request, res: Response) {
    try {
        const { token } = req.params
        const { password } = req.body

        console.log(req.params)

        if (!token) {
            return res
                .status(400)
                .json({ message: 'Please provide a reset token' })
        }

        if (!password) {
            return res
                .status(400)
                .json({ message: 'You must provide a password' })
        }

        const passwordReset = await prisma.passwordReset.findUnique({
            where: {
                token: token,
                used: false,
            },
        })

        // check the reset token hasnt expired and is a vlaid token

        if (!passwordReset) {
            return res.status(400).json({ message: 'Invalid Reset Token' })
        }

        if (passwordReset?.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Your Token has expired' })
        }

        // invalidate session when the password reset has been sucessful -> if there is one

        // delete all user sessions. if we found the passwordReset field
        await prisma.session.deleteMany({
            where: {
                userId: passwordReset?.userId,
            },
        })

        const newHashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        await prisma.user.update({
            where: {
                id: passwordReset?.userId,
            },
            data: {
                password: newHashedPassword,
            },
        })

        // set token to used and invalidate it -> make sure this token is only valid for 15 mins

        await prisma.passwordReset.update({
            where: { id: passwordReset.id },
            data: {
                used: true,
            },
        })

        return res.status(200).json({
            message: 'Your password has been reset',
        })
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

export async function me(req: Request, res: Response) {
    try {
        const { user, session } = req

        // when this route is called refresh session for another 3 days
        const newExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

        await prisma.session.update({
            where: {
                sessionId: session!.sessionId,
            },
            data: {
                expiresAt: newExpiresAt,
            },
            select: {
                expiresAt: true,
            },
        })

        res.status(200).json({
            user: {
                id: user?.id,
                email: user?.email,
            },
            message: 'Your session token has been refreshed',
            session: {
                oldSession: session!.expiresAt,
                newSession: newExpiresAt,
            },
        })
    } catch (err) {
        res.status(500).json({ message: 'There has been an internal error' })
    }
}
