"use client";

import { useState, FormEvent } from "react";

export default function AIIntegrate() {
  const [amount, setAmount] = useState<number>(0);
  const [noOfUsers, setNoOfUsers] = useState<number>(1);
  const [response, setResponse] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponse("");

    const amountMatch = prompt.match(/(?:Rs\.?|₹)\s*(\d+)/i);
    const peopleMatch = prompt.match(
      /(?:among|with|for|between)\s+(\d+)\s+(?:users?|people|friends?)[.,!?]?\s*$/i
    );

    const extractedAmount = amountMatch?.[1] ? Number(amountMatch[1]) : 0;
    const extractedPeople = peopleMatch?.[1] ? Number(peopleMatch[1]) : 1;

    console.log("Extracted Amount:", extractedAmount);
    console.log("Extracted People:", extractedPeople);

    const finalAmount = extractedAmount || amount;
    const finalUsers = extractedPeople || noOfUsers;

    setAmount(finalAmount);
    setNoOfUsers(finalUsers);

    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: finalAmount, noOfUsers: finalUsers }),
    });

    const data = await res.json();

    if (res.ok) {
      setResponse(data.result);
    } else {
      console.error(data.error);
      setResponse("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🔢 AI Amount Splitter
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I along with 3 friends went for a trip & the total expenses are 2000."
            rows={6}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            Split Now
          </button>
        </form>

        <input
          type="number"
          placeholder="Enter total amount (₹)"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />

        <input
          type="number"
          placeholder="Enter number of users"
          id="noOfUsers"
          value={noOfUsers}
          onChange={(e) => setNoOfUsers(Number(e.target.value))}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />

        {response && (
          <div className="mt-6 bg-gray-50 p-4 border border-gray-200 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-2">💡 Response:</h2>
            <p className="text-gray-800 whitespace-pre-line">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
