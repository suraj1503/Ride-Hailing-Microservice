import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoute from './routes/user-route.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { connectDB } from './db/db.js';
import { connectRBMQ, subscribeToQueue } from './service/rabbit-broker.js';
import {rideEventEmitter} from './controller/user-controller.js' 


dotenv.config();

const app = express();
(async () => {
    try {
        connectDB();
        await connectRBMQ();

        subscribeToQueue('accepted-ride', async (msg) => {
            const data = JSON.parse(msg);
            rideEventEmitter.emit('accepted-ride', data); // Emit event
        });

        console.log('Services initialized successfully');
    } catch (error) {
        console.error('Failed to initialize services:', error);
        process.exit(1); // Exit if services fail
    }
})();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRoute);

app.use(errorMiddleware);

export default app;