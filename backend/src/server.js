import express from 'express';

import path from 'path';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';

import cookieParser from 'cookie-parser';
import cors from "cors";


const app = express(); 
const PORT = ENV.PORT || 3000;

const __dirname = path.resolve();
// console.log(__dirname);           //    /Users/injalthapa/Downloads/Chatterly/backend


// middleware

// app.use(express.json());   // under req.body we can access json data
app.use(cors({ origin: ENV.CLIENT_URL, credentials:true })); // allow frontend, send cookie to backend.
app.use(cookieParser());  // to parse cookies from request headers..to be used in auth.middleware.js

// the default limit of express.json() is only 100kb. So we use limit option here bcz it said payload size too large.
// Backend can receive JSON (including Base64 images) and URL-encoded data up to 5 MB.
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));




// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


// make ready for deployment
if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
}


app.use('*', (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});





// app.listen(PORT, () => {
//     console.log("Server is running on Port:", PORT);
//     connectDB();
// });




// Server only starts if DB is ready.
const startServer = async () => {
  try {
    await connectDB(); // wait for DB connection.
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // exit because DB is required before starting the server.
  }
};

startServer();