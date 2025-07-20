// /app/api/bills/settle/route.ts
import dbConnect from "@/app/lib/models/mongodb";
import Bill from "@/app/lib/models/Bill";

export async function POST(request: Request) {
  try {
    const { billId, payerAddress } = await request.json();
    await dbConnect();
    
    // Update the participant's status
    await Bill.updateOne(
      { billId, 'participants.address': payerAddress },
      { $set: { 'participants.$.hasPaid': true } }
    );
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}