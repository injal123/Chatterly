// DB schema, table (model).

import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,     // pfp stored as string (URL).
        default: ""
    }
},
{  timestamps: true  }   // Adds createdAt + updatedAt automatically. 

);

const User = mongoose.model('User', userSchema); //mongoose makes 'users' collection (plural & small).

export default User;
