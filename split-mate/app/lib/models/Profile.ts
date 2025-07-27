// /lib/models/Profile.ts (rename the file and model)
import dbConnect from "./mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

dbConnect();

const profileSchema = new Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true, // A wallet can only have one profile
    },
    username: {
        type: String,
        required: true,
        unique: true, // Usernames must be unique
        lowercase: true, // Store usernames in lowercase for easy lookup
        trim: true,
    },
    friends:[{
          type: String,
          lowercase:true,
    }]
});

// Avoid recompiling the model
export default mongoose.models.Profile || mongoose.model("Profile", profileSchema);