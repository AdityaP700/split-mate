// /app/api/dashboard/[address]/route.ts

import dbConnect from "@/app/lib/models/mongodb"; // Use aliased paths
import Bill from "@/app/lib/models/Bill";
import Network from "@/app/lib/models/Network";
import Profile from "@/app/lib/models/Profile";

export async function GET(request: Request, { params }: { params: { address: string } }) {
  try {
    const userAddress = params.address.toLowerCase();
    await dbConnect();

    // STEP 1: Fetch all necessary data in parallel for maximum performance
    const [userNetwork, allUserBills] = await Promise.all([
      Network.findOne({ user: userAddress }),
      Bill.find({
        $or: [{ creatorAddress: userAddress }, { "participants.address": userAddress }]
      }).sort({ createdAt: -1 })
    ]);

    const friends = userNetwork?.friends || [];
const friendAddresses = friends.map((f: { address: string }) => f.address);
    const networkProfiles = await Profile.find({ walletAddress: { $in: friendAddresses } });

    // STEP 2: Calculate the main dashboard stats (You Owe, You Are Owed, etc.)
    // Your existing logic for this is perfect and remains here.
    let totalYouAreOwed = 0;
    let totalYouOwe = 0;
    const incomingBills = [];
    const openBills = [];

    for (const bill of allUserBills) {
      if (bill.creatorAddress === userAddress) {
        if (bill.status === 'pending') openBills.push(bill);
        bill.participants.forEach(p => {
          if (!p.hasPaid) totalYouAreOwed += p.owedAmount;
        });
      } else {
        const participant = bill.participants.find(p => p.address === userAddress);
        if (participant && !participant.hasPaid) {
          incomingBills.push(bill);
          totalYouOwe += participant.owedAmount;
        }
      }
    }

    // --- STEP 3: THE CRITICAL FIX - PREPARE THE DETAILED NETWORK REPORT ---
    // This is the new, intelligent logic.
    const networkWithStatus = networkProfiles.map(friendProfile => {
      let owesYou = 0;
      let youOweFriend = 0;
      let lastInteraction = "Never";
      let latestDate = new Date(0);

      // Analyze all bills to calculate the specific financial status with this one friend
      for (const bill of allUserBills) {
        const friendAddress = friendProfile.walletAddress;
        
        // Check if this bill is between you and the current friend
        const isBillBetweenUsers = (bill.creatorAddress === userAddress && bill.participants.some(p => p.address === friendAddress)) ||
                                   (bill.creatorAddress === friendAddress && bill.participants.some(p => p.address === userAddress));
        
        if (isBillBetweenUsers) {
          // Update the last interaction date if this bill is more recent
          if (new Date(bill.createdAt) > latestDate) {
              latestDate = new Date(bill.createdAt);
              lastInteraction = latestDate.toISOString().split('T')[0];
          }

          // If you created the bill, calculate what this friend owes you
          if (bill.creatorAddress === userAddress) {
            const friendParticipant = bill.participants.find(p => p.address === friendAddress);
            if (friendParticipant && !friendParticipant.hasPaid) {
              owesYou += friendParticipant.owedAmount;
            }
          } 
          // If they created the bill, calculate what you owe them
          else {
            const myParticipant = bill.participants.find(p => p.address === userAddress);
            if (myParticipant && !myParticipant.hasPaid) {
              youOweFriend += myParticipant.owedAmount;
            }
          }
        }
      }

      // Determine the final status string
      let status = "Settled";
      let amount = 0;
      let isPositive = null;
      if (owesYou > youOweFriend) {
        status = "Owes you";
        amount = owesYou - youOweFriend;
        isPositive = false;
      } else if (youOweFriend > owesYou) {
        status = "You owe";
        amount = youOweFriend - owesYou;
        isPositive = true;
      }

      // Assemble the final object that the frontend component expects
      return {
        id: friendProfile._id.toString(),
        name: `@${friendProfile.username}`,
        address: friendProfile.walletAddress,
        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${friendProfile.username}`,
        status,
        amount: `$${amount.toFixed(2)}`,
        isPositive,
        lastInteraction,
      };
    });

    // --- STEP 4: Assemble the final response ---
    const dashboardData = {
      youAreOwed: totalYouAreOwed,
      youOwe: totalYouOwe,
      networkSize: friends.length,
      // ... your networkChange logic ...
      incomingBills,
      openBills,
      history: allUserBills,
      network: networkWithStatus, // <-- Send the new, enriched, and perfectly shaped network data
    };

    return new Response(JSON.stringify(dashboardData), { status: 200 });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}