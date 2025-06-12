// /app/api/route.ts
import dbConnect from "../lib/models/mongodb";
import Data from "../lib/models/data";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    console.log("Received address:", address);

    if (!address) {
      return new Response(JSON.stringify({ message: "Address is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await dbConnect();

    const existing = await Data.findOne({ walletAddress: address });

    if (!existing) {
      const newEntry = new Data({ walletAddress: address });
      await newEntry.save();
    }

    return new Response(
      JSON.stringify({
        message: "Data received successfully",
        address,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in POST /api:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
