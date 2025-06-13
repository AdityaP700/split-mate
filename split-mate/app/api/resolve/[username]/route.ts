// /app/api/resolve/[username]/route.ts
import dbConnect from "../../../lib/models/mongodb";
import Profile from "../../../lib/models/Profile";

export async function GET(request: Request, props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  try {
    const username = params.username.toLowerCase();
    await dbConnect();

    const profile = await Profile.findOne({ username });

    if (!profile) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ address: profile.walletAddress }), {
      status: 200,
    });
  } catch (error) {
  console.error("Server Error:", error); // This line uses `error`

  return new Response(
    JSON.stringify({ error: "Server error", details: error.message || String(error) }),
    { status: 500 }
  );
}
}
