import http from 'http';
import { Server } from 'socket.io';

import express from 'express';
import { ENV } from './env.js';

import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";




const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
})



// apply authentication middleware to all socket connections.
io.use(socketAuthMiddleware);




// This is for storing online users - Initially empty.
const userSocketMap = {};   // { userId: socketId }     - key:value format.



// listen when user connects.
io.on("connection", (socket) => {
    console.log("A user connected:", socket.user.fullName);

    const userId = socket.userId;   // as string from socketAuthMiddleware.
    userSocketMap[userId] = socket.id;  // add this new user to userSocketMap list in backend.

    // io.emit() is used to send events to all connected clients, as broadcasting "Everyone, this new user connected."
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // "Everyone, heres the updated list."


    // listen when user disconnects.
    // Btw, once we have socket connection, we can use socket.on()
    // with socket.on we listen for events from clients.
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);

        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


export { app, server, io };  // now go ahead, import these on server.js