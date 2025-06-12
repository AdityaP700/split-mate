import dbConnect from "./mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";
dbConnect();

const dataSchema = new Schema({
    walletAddress: {
        type: String,
    }
})

export default mongoose.model("Data", dataSchema);