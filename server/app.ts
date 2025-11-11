import express from 'express'
import router from './routes/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

export const app = express()

/**
 * !! REMOVE FOR PROD
 */
app.use(
    cors({
        credentials: true,
    })
)

app.use(express.json())
app.use(cookieParser())
app.use('/api', router)

export default app
