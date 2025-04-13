import { compare } from 'bcrypt';
import { CAPTAIN_TOKEN } from "../constant/config.js";
import { Captain } from "../model/captain.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import ErrorHandler from "../utils/utility.js";

let pendingRequest = [];


const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const captain = await Captain.findOne({ email })

        if (captain) return next(new ErrorHandler('Captain already exits!', 401));

        const newCaptain = await Captain.create({
            name,
            email,
            password
        })

        sendToken(res, newCaptain, 200, `Captain created successfully`)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const captain = await Captain.findOne({ email }).select("+password")

        if (!captain) return next(new ErrorHandler('Invalid credentials hah', 400));

        const isMatch = await compare(password, captain.password)

        if (!isMatch) return next(new ErrorHandler('Invalid credentials', 400))
        sendToken(res, captain, 200, `Welcome back ${captain.name}`)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const logout = async (req, res, next) => {
    try {
        return res.status(200).cookie(CAPTAIN_TOKEN, "", { ...cookieOptions, maxAge: 0 }).json({
            success: true,
            message: "Logged out successfully!"
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const profile = async (req, res, next) => {
    try {
        console.log("captain")
        const captain = await Captain.findById(req.captain._id);
        res.status(200).json({
            success: true,
            captain
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const toggleAvailability = async (req, res, next) => {
    try {
        const captain = await Captain.findById(req.captain._id);

        if (!captain) {
            return res.status(404).json({ message: "Captain not found" });
        }

        captain.isAvailable = !captain.isAvailable;
        await captain.save();
        // Optionally filter sensitive data before sending
        const { isAvailable, name } = captain.toObject();
        res.json({ isAvailable, name });

    } catch (error) {
        console.error("Error in toggleAvailability:", error);
        res.status(500).json({ message: error.message });
    }
};


//this route is for polling
const waitForRide = async (req, res) => {
    try {
        res.setTimeout(30000, () => {
            console.log('Timeout reached for response');
            pendingRequest = pendingRequest.filter((r) => r !== res);
            res.status(204).end();
        });

        // Ensure only valid res objects are added
        if (typeof res.json === 'function') {
            pendingRequest.push(res);
        } else {
            console.error('Invalid res object detected');
        }
    } catch (error) {
        console.error('Error in waitForRide:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// console.log(pendingRequest,"captain-controller")

export {
    login,
    logout,
    profile, 
    register, 
    toggleAvailability,
    waitForRide,
    pendingRequest
};
