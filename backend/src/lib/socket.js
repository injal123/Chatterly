import http from 'http';
import { Server } from 'socket.io';

import express from 'express';
import { ENV } from './env.js';

import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import Message from "../models/Message.js";



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






// 1. User A sends a message → backend receives it via sendMessage controller,
// 2. Backend saves it to DB (newMessage),
// 3. Backend finds receiver’s socket ID with getSocketId,
// 4. Backend emits "newMessage" event directly to receiver’s socket,
// 5. User B’s frontend listens for "newMessage" → updates chat UI in real-time.

// for sendMessage controller in message.controller.js.
export function getSocketId(userId) {
    return userSocketMap[userId];
}







// This is for storing online users - Initially empty.
export const userSocketMap = {};   // { userId: socketId }     - key:value format.
export const activeChatMap = {}; // { userId: chatPartnerId }

// userActiveChatMap = {
//   "userB": "userA"
// }







// listen when user connects.
io.on("connection", async (socket) => {
    console.log("A user connected:", socket.user.fullName);

    const userId = socket.userId;   // as string from socketAuthMiddleware.
    userSocketMap[userId] = socket.id;  // add this new user to userSocketMap list in backend.

    // io.emit() is used to send events to all connected clients, as broadcasting "Everyone, this new user connected."
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // "Everyone, heres the updated list."



    // When I come online, find all my chattedpartner's msg and put delivered over sent.
    const undeliveredMessages = await Message.find({ receiverId: userId, status: "sent" });
    for (let msg of undeliveredMessages) {
        msg.status = "delivered";
        msg.deliveredAt = new Date();
        await msg.save();

        const senderSocketId = getSocketId(msg.senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("message_status", {
                messageId: msg._id,
                status: "delivered"
            });
        }
    }


    socket.on("chat_opened", async ({ senderId, receiverId }) => {
        activeChatMap[receiverId] = senderId; // “User-receiverId is currently viewing the chat with senderId.”

        const result = await Message.updateMany(
            {
                senderId,
                receiverId, // I opened the chat..should show seen to friend.
                status: { $ne: "seen" }
            },
            {
                status: "seen",
                seenAt: new Date()
            }
        );

        if (result.modifiedCount > 0) {
            const senderSocketId = getSocketId(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messages_seen", {
                    receiverId,
                });
            }
        }
    });

    socket.on("chat_closed", ({ userId }) => {
        delete activeChatMap[userId];
    });






    // SENDER Typing ?
    socket.on("typing", ({ receiverId }) => {
        // console.log("Backend received a Typing to:", receiverId);
        const receiverSocketId = getSocketId(receiverId);
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("typing", { senderId: userId } );
        }
    } )



    // listen when user disconnects.
    // Btw, once we have socket connection, we can use socket.on()
    // with socket.on we listen for events from clients.
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketMap[userId];
        delete activeChatMap[userId];

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    })
})


export { app, server, io };  // now go ahead, import these on server.js




// Only "connection" and "disconnect" are built-in, everything else like "getOnlineUsers" is custom.