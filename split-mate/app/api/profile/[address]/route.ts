// /app/api/profile/[address]/route.ts
import dbConnect from "../../../lib/models/mongodb";
import Profile from "../../../lib/models/Profile";

export async function GET(request: Request, props: { params: Promise<{ address: string }> }) {
  const params = await props.params;
  try {
    await dbConnect();
    const profile = await Profile.findOne({ walletAddress: params.address });

    if (!profile) {
      return new Response(JSON.stringify({ message: "Profile not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(profile), { status: 200 });
  } catch (error) {
  console.error("Server Error:", error); // This line uses `error`

  return new Response(
    JSON.stringify({ error: "Server error", details: error.message || String(error) }),
    { status: 500 }
  );
}
}