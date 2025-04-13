import express from 'express'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config();

import captainRoute from './routes/captain-route.js'
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { connectDB } from './db/db.js';
import {connectRBMQ, subscribeToQueue} from './service/rabbit-broker.js'

import {pendingRequest} from './controller/captain-controller.js'


const app = express();
(async () => {
    try {
        connectDB();
        await connectRBMQ();
        
        subscribeToQueue('new-ride', (message) => {
            const rideData = JSON.parse(message);
        
            pendingRequest.forEach((res) => {
                if (typeof res.json === 'function') {
                    res.json(rideData); // Send the data to the client
                } else {
                    console.error('Invalid res object in pendingRequest');
                }
            });
        
            // Clear the array after sending responses
            pendingRequest.length = 0;
        });
        
        console.log('Services initialized successfully');
    } catch (error) {
        console.error('Failed to initialize services:', error);
        process.exit(1); // Exit if services fail
    }
})();



app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use('/',captainRoute)

app.use(errorMiddleware)

export default app;