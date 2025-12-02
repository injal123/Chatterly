import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';


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