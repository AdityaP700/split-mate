// /app/api/network/add/route.ts
import dbConnect from "@/app/lib/models/mongodb";
import Profile from "@/app/lib/models/Profile";

export async function POST(request: Request) {
  try {
    const { userAddress, friendAddress } = await request.json();
    await dbConnect();

    // Use $addToSet to add the friend's address to the array
    // $addToSet cleverly prevents duplicates automatically
    await Profile.updateOne(
      { walletAddress: userAddress },
      { $addToSet: { friends: friendAddress.toLowerCase() } }
    );
    
    return new Response(JSON.stringify({ success: true, message: "Friend added to network." }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}