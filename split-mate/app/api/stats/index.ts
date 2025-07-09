import dbConnect from "../../lib/models/mongodb";
import Split from "../../lib/models/Split";
import Network from "../../lib/models/Network";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");
    if (!user) {
      return new Response(JSON.stringify({ error: "Missing user address" }), { status: 400 });
    }

    // You Are Owed: sum of all splits where user is a participant and has not paid
    const owedSplits = await Split.find({ "participants.address": user, "participants.hasPaid": false });
    const youAreOwed = owedSplits.reduce((sum, split) => {
      const p = split.participants.find(p => p.address === user);
      return sum + (p && !p.hasPaid ? p.amount : 0);
    }, 0);

    // You Owe: sum of all splits where user is a participant and has not paid, but not the creator
    const youOweSplits = await Split.find({ "participants.address": user, creator: { $ne: user }, "participants.hasPaid": false });
    const youOwe = youOweSplits.reduce((sum, split) => {
      const p = split.participants.find(p => p.address === user);
      return sum + (p && !p.hasPaid ? p.amount : 0);
    }, 0);

    // Network Size
    const network = await Network.findOne({ user });
    const networkSize = network ? network.contacts.length : 0;

    return new Response(JSON.stringify({
      youAreOwed,
      youOwe,
      networkSize,
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
