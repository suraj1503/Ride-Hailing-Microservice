import jwt from 'jsonwebtoken'
import { USER_TOKEN } from '../constant/config.js';

const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true
};

const sendToken = (res,user,code,message)=>{
    const secretKey = process.env.JWT_KEY;
    const token = jwt.sign({_id:user._id},secretKey)

    res.status(code).cookie(USER_TOKEN,token,cookieOptions).json({
        success:true,
        message,
        token,
        user
    })

}

export {
    sendToken,
    cookieOptions
}

