// /app/api/calculate-total/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  console.log("--- [AI ANALYSIS MOCKED] ---");
  console.log("Returning a hardcoded successful response for the demo.");

  // Simulate a short delay to make it look real
  await new Promise(resolve => setTimeout(resolve, 1000));

  // The successful JSON response the AI would normally give
  const mockedResponse = {
    totalAmount: 123.45 
  };

  return new Response(JSON.stringify(mockedResponse), { status: 200 });
}
