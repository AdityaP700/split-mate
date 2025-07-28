// /app/api/network/add/route.ts

import dbConnect from "@/app/lib/models/mongodb"; // Use aliased paths
import Network from "@/app/lib/models/Network";
import Profile from "@/app/lib/models/Profile";

export async function POST(request: Request) {
  try {
    const { userAddress, friendAddress } = await request.json();
    const lowerCaseFriendAddress = friendAddress.toLowerCase();
    await dbConnect();

    // Find the user's network document, or create it if it doesn't exist
    let userNetwork = await Network.findOne({ user: userAddress.toLowerCase() });
    if (!userNetwork) {
      userNetwork = new Network({ user: userAddress.toLowerCase(), friends: [] });
    }

    // --- CRITICAL UNIQUENESS CHECK ---
    const friendExists = userNetwork.friends.some(
      (friend) => friend.address.toLowerCase() === lowerCaseFriendAddress
    );

    if (friendExists) {
      return new Response(JSON.stringify({ success: true, message: "Friend already in network." }), { status: 200 });
    }

    // --- THE DEFINITIVE FIX: The "Ghost Profile" Handler ---
    let friendUsername = '';
    
    // Step 1: Try to find the friend's official profile.
    const friendProfile = await Profile.findOne({ walletAddress: lowerCaseFriendAddress });

    if (friendProfile) {
      // SUCCESS: The friend has a profile. Use their official username.
      friendUsername = friendProfile.username;
    } else {
      // FAILURE: The friend exists on-chain but hasn't registered on SplitMate yet.
      // We will create a "placeholder" name for them based on their address.
      // This makes your app incredibly robust.
      friendUsername = `${lowerCaseFriendAddress.slice(0, 6)}...${lowerCaseFriendAddress.slice(-4)}`;
    }

    // Add the new friend object (either with their real username or a placeholder)
    userNetwork.friends.push({
      address: lowerCaseFriendAddress,
      username: friendUsername,
      createdAt: new Date(),
    });

    await userNetwork.save();
    
    return new Response(JSON.stringify({ success: true, message: "Friend added successfully to network." }), { status: 201 });

  } catch (error) {
    console.error("Add Network Error:", error);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}