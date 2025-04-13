import { USER_TOKEN } from "../constant/config.js";
import { User } from "../model/user-model.js";
import { subscribeToQueue } from "../service/rabbit-broker.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import ErrorHandler from "../utils/utility.js";
import { compare } from 'bcrypt'
import {EventEmitter} from 'events'

const rideEventEmitter= new EventEmitter()

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email })

        if (user) return next(new ErrorHandler('User already exits!', 401));

        const newUser = await User.create({
            name,
            email,
            password
        })

        sendToken(res, newUser, 200, `User created successfully`)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password")

        if (!user) return next(new ErrorHandler('Invalid credentials hah', 400));

        const isMatch = await compare(password, user.password)

        if (!isMatch) return next(new ErrorHandler('Invalid credentials', 400))

        sendToken(res, user, 200, `Welcome back ${user.name}`)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const logout = async (req, res, next) => {
    try {
        return res.status(200).cookie(USER_TOKEN, "", { ...cookieOptions, maxAge: 0 }).json({
            success: true,
            message: "Logged out successfully!"
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const profile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const acceptedRide = async (req, res, next) => {
    // Scoped listener for this request
    const timeout = setTimeout(() => {
        // Timeout after 30 seconds
        res.status(204).send();
    }, 30000);

    const handleEvent = (data) => {
        clearTimeout(timeout); // Cancel the timeout
        res.status(200).json(data); // Send the event data
    };

    rideEventEmitter.once('accepted-ride', handleEvent);

    req.on('close', () => {
        // Clean up listener if client disconnects
        clearTimeout(timeout);
        rideEventEmitter.removeListener('accepted-ride', handleEvent);
    });
};



export {
    register,
    login,
    logout,
    profile,
    acceptedRide,
    rideEventEmitter
}