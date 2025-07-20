// /app/api/bills/create/route.ts
import dbConnect from "@/app/lib/models/mongodb";
// Update the import path to match the actual location and filename of the Bill model
import Bill from "@/app/lib/models/Bill";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    // Check if a bill with this ID already exists to prevent duplicates
    const existingBill = await Bill.findOne({ billId: body.billId });
    if (existingBill) {
      return new Response(JSON.stringify({ success: true, message: "Bill already exists", bill: existingBill }), { status: 200 });
    }
    const newBill = new Bill(body);
    await newBill.save();
    return new Response(JSON.stringify({ success: true, bill: newBill }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}