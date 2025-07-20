// /app/api/dashboard/[address]/route.ts
import dbConnect from "@/app/lib/models/mongodb";
import Bill from "@/app/lib/models/Bill";
import Profile from "@/app/lib/models/Profile"; // Assuming Profile model exists

export async function GET(request: Request, { params }: { params: { address: string } }) {
  try {
    const userAddress = params.address.toLowerCase();
    await dbConnect();

    // Fetch all bills relevant to the user
    const userBills = await Bill.find({
      $or: [{ creatorAddress: userAddress }, { 'participants.address': userAddress }]
    }).sort({ createdAt: -1 });

    // Fetch user's network from their profile (assuming a 'friends' array)
    const userProfile = await Profile.findOne({ walletAddress: userAddress });
    const networkSize = userProfile?.friends?.length || 0;

    let youAreOwed = 0;
    let youOwe = 0;
    const incomingBills = [];
    const openBills = [];
    const history = userBills; // All bills are part of history

    for (const bill of userBills) {
      if (bill.creatorAddress === userAddress) {
        if (bill.status === 'pending') openBills.push(bill);
        bill.participants.forEach(p => {
          if (!p.hasPaid) youAreOwed += p.owedAmount;
        });
      } else {
        const participant = bill.participants.find(p => p.address === userAddress);
        if (participant && !participant.hasPaid) {
          incomingBills.push(bill);
          youOwe += participant.owedAmount;
        }
      }
    }

    return new Response(JSON.stringify({ youAreOwed, youOwe, networkSize, incomingBills, openBills, history }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}