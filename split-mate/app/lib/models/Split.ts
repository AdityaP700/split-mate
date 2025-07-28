import mongoose, { Schema } from "mongoose";

export interface Participant {
  address: string;
  username: string;
  amount: number;
  hasPaid: boolean;
}

export interface ISplit {
  billId: string;
  creator: string;
  creatorUsername: string;
  description: string;
  participants: Participant[];
  totalAmount: number;
  status: "pending" | "settled";
  createdAt: Date;
}

const ParticipantSchema = new Schema<Participant>({
  address: { type: String, required: true, lowercase: true },
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  hasPaid: { type: Boolean, default: false },
});

const SplitSchema = new Schema<ISplit>(
  {
    billId: { type: String, required: true, unique: true },
    creator: { type: String, required: true, lowercase: true },
    creatorUsername: { type: String, required: true },
    description: { type: String, required: true },
    participants: { type: [ParticipantSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "settled"], default: "pending" },
  },
  { timestamps: true }
);

const Split = mongoose.models.Split || mongoose.model<ISplit>("Split", SplitSchema);
export default Split;
