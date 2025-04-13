import express from  'express'
import { login, logout, profile, register,toggleAvailability, waitForRide } from '../controller/captain-controller.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/register',register);
router.post('/login',login)
router.get('/logout',logout)
router.get('/profile',isAuthenticated,profile)
router.patch('/toggle-availability',isAuthenticated,toggleAvailability);
router.get('/new-ride',isAuthenticated,waitForRide)

export default router;