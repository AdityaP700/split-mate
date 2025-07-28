// /app/api/analyze-bill/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined.");
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request: Request) {
  try {
    const { billDescription, friends } = await request.json();

    const prompt = `
      You are an expert bill splitting AI agent for an app called SplitMate.
      Your task is to analyze a complex, natural language bill description and calculate a fair and accurate split among the friends provided.

      CONTEXT:
      - The list of friends involved is: ${JSON.stringify(friends)}. Their names and addresses are the ground truth.
      - The person using the app is the one who paid the total bill.

      BILL DESCRIPTION TO ANALYZE:
      "${billDescription}"

      YOUR INSTRUCTIONS:
      1. Read the bill description carefully to understand all items, shared costs, individual costs, and any pre-payments or deposits.
      2. Calculate the final "owedAmount" for each person. This is the amount they need to pay back to the person who paid the bill.
      3. The final output MUST be a clean JSON object.
      4. The JSON object must contain one key: "split".
      5. The value of "split" must be an array of friend objects, perfectly matching the structure of the friends list I provided.
      6. For each friend in your response array, you MUST use the exact same "id", "name", and "address" that I provided.
      7. You MUST update the "owedAmount" for each friend based on your calculations.
      8. "hasPaid" should always be false
      9. The sum of all "owedAmount" values in your response should equal the total expense.

      EXAMPLE OUTPUT FORMAT:
      {
        "split": [
          { "id": 1, "name": "@alice", "address": "0x...", "owedAmount": 25.50, "hasPaid": false },
          { "id": 2, "name": "@bob", "address": "0x...", "owedAmount": 42.00, "hasPaid": false }
        ]
      }

      Now, analyze the bill and provide ONLY the JSON object as your response.
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); 
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonResponse = JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, ""));

    return new Response(JSON.stringify(jsonResponse), { status: 200 });

  } catch (error) {
    console.error("AI analysis failed:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze bill" }), { status: 500 });
  }
}