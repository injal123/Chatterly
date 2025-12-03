import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async() => {
    try {
        const { MONGO_URI } = ENV;
        if (!MONGO_URI)  throw new Error("MONGO_URI is not defined in environment variables.");

        const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 }); // 10sec
        console.log("MongoDB connected:", conn.connection.host);
    }
    catch (error){
        console.error("MongoDB connection failed:", error);
        throw error;         // allow calling function to handle error.
        // process.exit(1);  // 1 indicates failure.
    }
}





// 10000 = 10 seconds -->   Without it, if MongoDB is unreachable, Mongoose might hang indefinitely → app seems frozen.