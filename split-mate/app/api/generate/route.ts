import genAI from "@/app/lib/models/GenAI";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {amount, noOfUsers} = await request.json();
    const prompt = `Split Rs ${amount} equally among ${noOfUsers} users.`;
    console.log("Received data: ", { amount, noOfUsers });
    if(!prompt) {
        return NextResponse.json({error: "Prompt is required"}, { status: 400 });
    }

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        })
        console.log("Response from genAI:", response.text);
        return NextResponse.json({ result: response.text });
    } catch (error) {
        console.log("Error generating content:", error);
    }
}