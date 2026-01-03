import jwt from 'jsonwebtoken';
import { ENV } from './env.js';


export const generateToken = (userId, res) => {

    const { JWT_SECRET, NODE_ENV } = ENV;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign(
        {userId: userId},
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('jwt', token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,  // in miliseconds (for 1 day).
        httpOnly: true,    // prevents XXS attacks by blocking JS access to cookies.
        sameSite: "strict",  // prevents CSRF attacks.
        secure: NODE_ENV === 'development' ? false : true   // cookie only sent over HTTPS in production.
    })

    return token;

}