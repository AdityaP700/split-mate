// /lib/models/Profile.ts (rename the file and model)
import dbConnect from "./mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

dbConnect();

const profileSchema = new Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim: true,
    },
    friends:[{
          type: String,
          lowercase:true,
    }]
});

export default mongoose.models.Profile || mongoose.model("Profile", profileSchema);