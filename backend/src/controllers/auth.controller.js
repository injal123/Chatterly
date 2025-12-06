import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';

import { ENV } from '../lib/env.js';
import cloudinary from '../lib/cloudinary.js';






export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;


    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });  // 400 Bad Request.
        }

        // trim avoids accidental spaces at the start and end.
        const trimmedFullName = fullName.trim();
        const trimmedEmail = email.trim().toLowerCase();

        // Validate fullName: at least 3 chars.
        if (trimmedFullName.length < 3) {
            return res.status(400).json({ message: "Full name is too short" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        // check if email is in valid format using regex.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const user = await User.findOne({ email:trimmedEmail });
        if (user) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: trimmedEmail,
            fullName: trimmedFullName,
            password: hashedPassword
        });


        if (newUser) {
            const savedUser = await newUser.save();   // save user to DB 1st then generate token.
            generateToken(savedUser._id, res);   // server sends JWT in cookies so we need res.
            

            res.status(201).json({   // 201 Created
                _id: savedUser._id,
                email: savedUser.email,
                fullName: savedUser.fullName,
                profilePic: savedUser.profilePic
             });

            
            sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL)
                .catch((error) => {
                    console.error("Error sending welcome email:", error);
                });
            
             
        }


        else {
            res.status(400).json({ message: "Invalid user data !!" });
        }


    } catch (error) {
        console.error("Error in auth-signup controller:", error);

        // Handle race-condition.
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ message: "Email already exists." });
        }

        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }

};





export const login = async (req, res) => {
    
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findOne({ email:email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        } // never tell the user which one is wrong: email or password.



        // console.log("Password from body:", password);
        // console.log("Password from DB:", user.password);



        const isPasswordMatch = await bcrypt.compare(password, user.password);


        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // generate token and send cookie.
        generateToken(user._id, res);

        res.status(200).json({   // 200 SUCCESS
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
            message: "Login Successful"
        });
        
    } catch (error) {
        console.error("Error in auth-login controller:", error);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });   
    }
};





export const logout = (_, res) => {
    res.cookie("jwt", "",                       // "" :no new value means clears the cookie.
        {maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only HTTPS in production
        sameSite: "strict"
        }
    );

    res.status(200).json({ message: "Logged out successfully" });
};





export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;

        if(!profilePic) return res.status(400).json({ message: "Profile picture is required." });
        if(typeof profilePic !== 'string') return res.status(400).json({ message: "Invalid profile picture format." });

        // size limit for Base64 images.
        if (profilePic.length > 5_000_000) {    // ~5MB Base64 string
            return res.status(413).json({ message: "Image too large." });
        }


        // Upload image to Cloudinary.
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: 'Chatterly/profile_pics',
            resource_type: 'image',
            overwrite: true,   // replace old image instead of creating a duplicate for same img.
            invalidate: true,  // forces CDN to fetch new img, so users immediately see the updated profile pic everywhere.
            transformation: [
                { width: 500, height: 500, crop: "limit" }  // limit to 500x500
            ]
        });

        // Update user's profilePic URL in DB.
        const userId = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(
                                        userId, 
                                        { profilePic: uploadResponse.secure_url }, 
                                        { new:true, runValidators: true, select: "-password" }  // exclude pw field.
                                    );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(updatedUser);


    } catch (error) {
        console.error("Error in auth-updateProfile controller:", error);
        res.status(500).json({ message: "Internal Server Error. Please try again later." }); 
    }
}