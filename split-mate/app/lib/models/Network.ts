// /lib/models/Network.ts
import mongoose, { Schema, Document } from "mongoose";

export interface Friend {
  address: string;
  username: string;
  createdAt: Date; 
}

export interface INetwork extends Document {
  user: string;
  friends: Friend[];
}

const FriendSchema = new Schema<Friend>({
  address: { type: String, required: true, lowercase: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, 
});

const NetworkSchema = new Schema<INetwork>(
  {
    user: { type: String, required: true, unique: true },
    friends: { type: [FriendSchema], default: [] },
  },
  { timestamps: true }
);

const Network = mongoose.models.Network || mongoose.model<INetwork>("Network", NetworkSchema);
export default Network;