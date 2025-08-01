// app/api/splits/history.ts
import Split from "@/app/lib/models/Split";
import dbConnect from "@/app/lib/models/mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");

    if (!user) {
      return new Response(JSON.stringify({ error: "Missing user address" }), { status: 400 });
    }

    const splits = await Split.find({
      $or: [
        { creator: user },
        { "participants.address": user }
      ]
    }).sort({ updatedAt: -1 });

    return new Response(JSON.stringify(splits), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
