import express from 'express'
import router from './routes/index.js'
import cors from 'cors'

export const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)

export default app
