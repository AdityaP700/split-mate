import { NextResponse } from "next/server";

// In-memory store (for testing)
let subscribers: string[] = [];

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (subscribers.includes(email)) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
    }

    subscribers.push(email);
    console.log("Current Subscribers:", subscribers);

    return NextResponse.json({ message: "Successfully subscribed!", email });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  // Just for testing/debugging (not for production)
  return NextResponse.json({ subscribers });
}
