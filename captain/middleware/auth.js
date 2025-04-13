import jwt from "jsonwebtoken";
import { CAPTAIN_TOKEN } from "../constant/config.js";
import { Captain } from "../model/captain.js";
import ErrorHandler from "../utils/utility.js";

const isAuthenticated = async(req,res,next)=>{
    const secretKey = process.env.JWT_KEY;
    
    const token = req.cookies[CAPTAIN_TOKEN]|| req.headers.authorization.split(' ')[1];
    

    
    if (!secretKey) 
        return next(new ErrorHandler('Server misconfiguration: Secret key is missing'));

    if (!token) 
        return next(new ErrorHandler('You need to login to move forward!'));


    try{
        const decodedData = jwt.verify(token,secretKey);

        const captain = await Captain.findById(decodedData);
        req.captain=captain
        next()
    }catch(err){
        return next(new ErrorHandler('Invalid or expired token'));
    }
}

export {
    isAuthenticated
}