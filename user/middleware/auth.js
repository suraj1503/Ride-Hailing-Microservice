import jwt from "jsonwebtoken";
import { USER_TOKEN } from "../constant/config.js";
import { User } from "../model/user-model.js";
import ErrorHandler from "../utils/utility.js";

const isAuthenticated = async (req, res, next) => {
    const secretKey = process.env.JWT_KEY;
    const token = req.cookies[USER_TOKEN] || req.headers.authorization.split(' ')[1];
    

    if (!secretKey)
        return next(new ErrorHandler('Server misconfiguration: Secret key is missing', 404));

    if (!token)
        return next(new ErrorHandler('You need to login to move forward!', 401));


    try {
        const decodedData = jwt.verify(token, secretKey);

        const user = await User.findById(decodedData);
        req.user = user
        next()
    } catch (err) {
        return next(new ErrorHandler('Invalid or expired token'));
    }
}

export {
    isAuthenticated
}