import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()

import rideRoute from './routes/ride-route.js'
import {connectRBMQ} from './service/rabbit-broker.js'
import {connectDB} from './db/db.js'
import { errorMiddleware } from './middleware/error.js'

connectDB()
connectRBMQ();

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use('/',rideRoute)

app.use(errorMiddleware)

export default app