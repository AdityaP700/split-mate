// /lib/models/Bill.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import dbConnect from "./mongodb";

interface IParticipant extends Document {
  address: string;
  username: string;
  owedAmount: number;
  hasPaid: boolean;
}

interface IBill extends Document {
  billId: string;
  creatorAddress: string;
  creatorUsername: string;
  description: string;
  totalAmount: number;
  participants: IParticipant[];
  status: 'pending' | 'settled';
  createdAt: Date;
}

const ParticipantSchema: Schema<IParticipant> = new Schema({
  address: { type: String, required: true, lowercase: true },
  username: { type: String, required: true },
  owedAmount: { type: Number, required: true },
  hasPaid: { type: Boolean, default: false },
});

const BillSchema: Schema<IBill> = new Schema({
  billId: { type: String, required: true, unique: true },
  creatorAddress: { type: String, required: true, lowercase: true },
  creatorUsername: { type: String, required: true },
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  participants: [ParticipantSchema],
  status: { type: String, enum: ['pending', 'settled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

dbConnect();

export default (mongoose.models.Bill as Model<IBill>) || mongoose.model<IBill>("Bill", BillSchema);