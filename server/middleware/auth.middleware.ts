import { type Request, type Response } from 'express'

export function authenticate(req: Request, res: Response) {
    const header = req.headers.authorization

    console.log(header)
}
