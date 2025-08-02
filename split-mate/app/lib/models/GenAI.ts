// lib/GenAI.ts

const mockResponses = [
  "Sure, here's a response from GenAI!",
  "Mocked GenAI response: How can I help?",
  "Simulated GenAI says: All systems go!",
  "Hello from the mock GenAI module!"
];

const genAI = {
  async generateResponse(prompt: string): Promise<string> {
    console.log("GenAI received prompt:", prompt);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return random mock response
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    return `${response} (Prompt was: "${prompt}")`;
  }
};

export default genAI;
