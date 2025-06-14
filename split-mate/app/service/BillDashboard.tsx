// src/components/BillDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useXMTP } from "../context/XMTPContext";
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";

// Define the type for a bill request
type BillRequest = {
  id: string; // We'll use the message ID as a unique key
  description: string;
  yourShare: number;
  payToAddress: `0x${string}`; // Use viem's address type
  paymentChainId: number;
};

const BillDashboard = () => {
  const { client, isConnected } = useXMTP();
  const [incomingBills, setIncomingBills] = useState<BillRequest[]>([]);

  // Wagmi hook to send a transaction
  const { data: hash, sendTransaction, isPending } = useSendTransaction();

  // The "Ears": Listen for new messages
  useEffect(() => {
    if (!isConnected || !client) return;

    const listenForMessages = async () => {
      console.log("Dashboard: Listening for bill requests...");
      for await (const message of await client.conversations.streamAllMessages()) {
        if (message.senderAddress === client.address) continue;

        try {
          const payload = JSON.parse(message.content);
          if (payload.type === "splitmate_bill_request") {
            console.log("Dashboard: Received a new bill request!", payload);

            // Add the new bill to our state, avoiding duplicates
            setIncomingBills((prevBills) => {
              if (prevBills.find((bill) => bill.id === message.id)) {
                return prevBills; // Already have this bill
              }
              return [
                ...prevBills,
                {
                  id: message.id,
                  description: payload.description,
                  yourShare: payload.yourShare,
                  payToAddress: payload.payToAddress,
                  paymentChainId: payload.paymentChainId,
                },
              ];
            });
          }
        } catch (error) {
          console.error("Dashboard: Error parsing message content", error);
        }
      }
    };

    listenForMessages();
  }, [client, isConnected]);

  // The "Hands": Function to handle payment
  const handlePayBill = (bill: BillRequest) => {
    console.log(
      `Attempting to pay ${bill.yourShare} ETH to ${bill.payToAddress}`
    );
    sendTransaction({
      to: bill.payToAddress,
      value: parseEther(String(bill.yourShare)), // Convert dollar amount to ETH
      // Note: For a real app, you would convert USD to ETH via an oracle (e.g., Chainlink)
      // For this test, we assume the 'yourShare' value is in ETH for simplicity.
    });
  };

  // The UI
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Incoming Bills</h2>
      {incomingBills.length === 0 ? (
        <p className="text-gray-500">No new bill requests.</p>
      ) : (
        <div className="space-y-4">
          {incomingBills.map((bill) => (
            <div
              key={bill.id}
              className="p-4 bg-white border rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {bill.description}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pay to:{" "}
                    <span className="font-mono text-xs">{`${bill.payToAddress.slice(
                      0,
                      6
                    )}...${bill.payToAddress.slice(-4)}`}</span>
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    ${bill.yourShare}
                  </p>
                </div>
                <button
                  onClick={() => handlePayBill(bill)}
                  disabled={isPending}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition"
                >
                  {isPending ? "Paying..." : "Pay Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {hash && (
        <div className="w-full flex justify-center mt-4">
          <div className="text-xs text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded-md shadow-sm max-w-md text-center">
            ✅ Success! Tx hash:{" "}
            <span className="font-mono break-all">{hash}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDashboard;
