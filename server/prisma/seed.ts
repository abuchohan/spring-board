import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import bcrypt from 'bcrypt'

async function main() {
    const hashed = await bcrypt.hash('hello123', 10)
    const user = await prisma.user.upsert({
        where: { email: 'hello@abu.com' },
        update: {},
        create: {
            email: 'hello@abu.com',
            password: hashed,
        },
    })
    console.log({ user })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
