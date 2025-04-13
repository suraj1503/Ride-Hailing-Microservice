import jwt from 'jsonwebtoken';
import axios from 'axios';
import { CAPTAIN_TOKEN, USER_TOKEN } from '../constant/config.js';
import ErrorHandler from '../utils/utility.js';

const isAuthenticated = async (req, res, next) => {
    try {
        
        // Load the secret key
        const secretKey = process.env.JWT_KEY;
        if (!secretKey) {
            throw new ErrorHandler('JWT secret key not set!', 500);
        }

        // Get the token from cookies
        const token = req.cookies[USER_TOKEN] || req.headers.authorization.split(' ')[ 1 ];;
        if (!token) {
            return next(new ErrorHandler('Unauthorized! Token not found.', 401));
        }
    
    

        // Verify the token
        const decodedData = jwt.verify(token, secretKey);
       
        // Fetch the user profile from the user service
        try {
            const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = response.data;
            
            if (!user) {
                return next(new ErrorHandler('Unauthorized! User not found.', 401));
            }

            req.user = user;
            next(); // Proceed to the next middleware or route handler
        } catch (axiosError) {
            console.error('Axios Error:', axiosError.message);
            return next(new ErrorHandler('Failed to fetch user profile!', 500));
        }
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new ErrorHandler('Invalid or expired token!', 401));
        }
        next(error);
    }
};

const isAuthenticatedCaptain = async (req, res, next) => {
    try {
        
        // Load the secret key
        const secretKey = process.env.JWT_KEY;
        
        if (!secretKey) {
            throw new ErrorHandler('JWT secret key not set!', 500);
        }

        // Get the token from cookies
        const token = req.cookies[CAPTAIN_TOKEN]
        if (!token) {
            return next(new ErrorHandler('Unauthorized! Token not found.', 401));
        }
    
        // Verify the token
      
        const decodedData = jwt.verify(token, secretKey);
        

        // Fetch the user profile from the user service
        
        try {
            const response = await axios.get(`${process.env.BASE_URL}/captain/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if(!response) console.log("not responded ride")

            const captain = response.data;
            
            
            if (!captain) {
                return next(new ErrorHandler('Unauthorized! User not found.', 401));
            }

            req.captain = captain;
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error('Axios Error:', error.response.data);
            return next(new ErrorHandler('Failed to fetch captain profile!', 500));
        }
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new ErrorHandler('Invalid or expired token!', 401));
        }
        next(error);
    }
};

export { isAuthenticated, isAuthenticatedCaptain };
