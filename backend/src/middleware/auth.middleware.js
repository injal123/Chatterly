import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';
import  User from '../models/User.js';


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;  // server.js must have app.use(cookieParser()) middleware
        if(!token) return res.status(401).send({ message: "Unauthorized - There's No Token" });

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) return res.status(401).send({ message: "Invalid Token" });

        const user = await User.findById(decoded.userId).select('-password');  // exclude password.
        if(!user) return res.status(404).send({ message: "User not found" });

        req.user=user;  // attach user's all info except password to req obj for use in next handlers. 
        next();

    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(500).send({ message: "Internal server error" });
    }

}