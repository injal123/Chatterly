import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from '../models/User.js';



export const socketAuthMiddleware = async (socket, next) => {

    try {
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];

        // Token received..?
        if (!token) {
            console.log("Socket connection rejected: No token provided");
            const error = new Error("Unauthorized - No Token Provided");

            return next(error);
        }

        // verify token.
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid Token"));
        }

        // find user from DB.
        const user = await User.findById(decoded.userId).select('-password');
        if(!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("User not found"));
        }



        // attach authenticated user info to socket.
        socket.user = user;    // full user object, except pw.
        socket.userId = user._id.toString();   

        // Store user ID as a string, for quick access as userId.
        // MongoDB provides _id as an ObjectId, but Socket.IO / JS comparisons,
        // maps, and room names work reliably with string IDs.

        console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);
        
        next(); 

    } 
    catch (error) {
        console.log("Error in socket authentication:", error.message);
        next(new Error("Unauthorized - Authentication failed"));
    }


}