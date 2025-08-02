// app/api/dashboard/[address]/route.ts
import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/models/mongodb";
import Split from "@/app/lib/models/Split";
import Network from "@/app/lib/models/Network";
import Profile from "@/app/lib/models/Profile";

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  try {
    await dbConnect();
    const userAddress = params.address.toLowerCase();

    if (!userAddress) {
      return new Response(JSON.stringify({ error: "Missing user address" }), { status: 400 });
    }

    const allUserSplits = await Split.find({
      $or: [{ creator: userAddress }, { "participants.address": userAddress }],
    }).sort({ createdAt: -1 });

    let youAreOwed = 0;
    let youOwe = 0;
    const incomingBills: any[] = [];
    const openBills: any[] = [];

    for (const split of allUserSplits) {
      if (split.creator === userAddress) {
        if (split.status === 'pending') openBills.push(split);
        split.participants.forEach((p: any) => {
          if (!p.hasPaid) {
            youAreOwed += p.amount;
          }
        });
      } else {
        const myParticipantEntry = split.participants.find((p: any) => p.address === userAddress);
        if (myParticipantEntry && !myParticipantEntry.hasPaid) {
          incomingBills.push(split);
          youOwe += myParticipantEntry.amount;
        }
      }
    }

    const userNetwork = await Network.findOne({ user: userAddress });
    const friendAddresses = userNetwork?.friends.map((f: any) => f.address) || [];
    const networkProfiles = await Profile.find({ walletAddress: { $in: friendAddresses } });

    const responseData = {
      youAreOwed,
      youOwe,
      networkSize: networkProfiles.length,
      incomingBills,
      openBills,
      history: allUserSplits,
      network: networkProfiles,
    };

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
