import express from 'express'
import { acceptRide, createRide } from '../controller/ride-controller.js';
import { isAuthenticated, isAuthenticatedCaptain } from '../middleware/auth.js';

const router = express.Router()

router.post('/create-ride',isAuthenticated,createRide);
router.put('/accept-ride',isAuthenticatedCaptain,acceptRide)

export default router