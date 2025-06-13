// /app/api/register/route.ts
import dbConnect from "../../lib/models/mongodb";
import Profile from "../../lib/models/Profile"; // Use the new Profile model
import { verifyMessage } from 'viem';

export async function POST(request: Request) {
  try {
    const { address, username, signature } = await request.json();
    await dbConnect();

    // 1. SECURITY: Verify the user owns the wallet
    const message = `Registering @${username} for SplitMate`;
    const isValid = await verifyMessage({ address, message, signature });
    if (!isValid) {
      return new Response(JSON.stringify({ message: "Invalid signature" }), { status: 401 });
    }

    // 2. Check if username or address is already taken
    const existingProfile = await Profile.findOne({ $or: [{ username }, { walletAddress: address }] });
    if (existingProfile) {
      return new Response(JSON.stringify({ message: "Username or address already taken" }), { status: 409 });
    }

    // 3. Create the new profile
    const newProfile = new Profile({ walletAddress: address, username });
    await newProfile.save();

    return new Response(JSON.stringify({ message: "Username registered successfully" }), { status: 201 });
  } catch (error) {
console.log("Server-error",error) ; 
  return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}