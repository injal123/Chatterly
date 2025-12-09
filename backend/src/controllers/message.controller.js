// $in $or $ne


import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from '../lib/cloudinary.js';


export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId =  req.user._id;  // next, get all users except this loggedInUserId.
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error in getAllContacts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;                 // you
    const { id: chatPartnerId } = req.params;       // the user you are chatting with
    
    if (!chatPartnerId) {
      return res.status(400).json({ error: "Chat partner ID is required." });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: chatPartnerId },
        { senderId: chatPartnerId, receiverId: myId }
      ]
    })
      .sort({ createdAt: 1 });   //sort messages by ascending order of time- older messages then newer.

    return res.status(200).json(messages);

  } catch (error) {
    console.error("Error in getMessagesByUserId:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;

        const senderId = req.user._id;
        const { id: receiverId } = req.params;

        // if both are missing.
        if(!text && !image) {
            return res.status(400).json({ message: "Message text or image is required" });
        }

        // compare ObjectIds easily as..
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }

        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image,
                { folder: 'Chatterly/imageMessage' }
            );
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // socket.io 

        res.status(200).send(newMessage);

    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




export const getAllChattedPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // find all the messages where the logged-in user is either sender or receiver.
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        // res.status(200).send(messages); // toFutureMe: Uncomment this line to see messages value.

        const partnersId = [];

        // Pick the other person's ID from each message where its not loggedInUserId.
        // Since, ObjectId !== ObjectId → use toString() for comparision.
        //  or I can do ...... if (msg.senderId.equals(loggedInUserId)) {
        messages.forEach( msg => {    
            if (msg.senderId.toString() === loggedInUserId.toString()) {  
                partnersId.push(msg.receiverId.toString());
            }
            else {
                partnersId.push(msg.senderId.toString());
            }
        });

        // Remove duplicates: e.g., [user1, user2, user1] --> [user1, user2]
        const uniquePartnerIds = [...new Set(partnersId)];

        // Fetch user details of chat partners.
        const chatPartners = await User.find({
            _id: { $in: uniquePartnerIds }
        }).select("-password");

        res.status(200).send(chatPartners);


    } catch (error) {
        console.error("Error in getAllChattedPartners:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};