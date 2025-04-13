import express from  'express'
import { login, logout, profile, register } from '../controller/user-controller.js';
import { isAuthenticated } from '../middleware/auth.js';
import { acceptRide } from '../../ride/controller/ride-controller.js';

const router = express.Router();

router.post('/register',register);
router.post('/login',login)
router.get('/logout',logout)
router.get('/profile',isAuthenticated,profile)
router.get('/accepted-ride',isAuthenticated,acceptRide)

export default router;