"use client";
import { useState, useEffect } from "react";
import {useXMTP} from "../context/XMTPContext"
import { useAmount } from "../context/AmountContext"
import { useAccount } from "wagmi";

type Friend = {
  id: number;
  name: string;
  address: string;
  owedAmount: number;
  hasPaid: boolean;
};

const XMTPBillSplitting = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [billDescription, setBillDescription] = useState("");
  const { sendGroupMessage, isConnected } = useXMTP();
  const { amount } = useAmount();
  const { address: userAddress } = useAccount();

  useEffect(() => {
    const defaultFriends: Friend[] = [
      {
        id: 1,
        name: "Alice",
        address: process.env.NEXT_PUBLIC_ALICE_WALLET_ADDRESS || "",
        owedAmount: 10,
        hasPaid: false,
      },
      {
        id: 2,
        name: "Bob",
        address: process.env.NEXT_PUBLIC_BOB_WALLET_ADDRESS || "",
        owedAmount: 0,
        hasPaid: false,
      },
    ];
    setFriends(defaultFriends);
  }, []);

  const calculateSplit = () => {
    if (!amount || friends.length === 0) return;

    const splitAmount = amount / (friends.length + 1); // +1 for current user
    const updatedFriends = friends.map(friend => ({
      ...friend,
      owedAmount: Math.round(splitAmount * 100) / 100, // Round to 2 decimal places
    }));

    setFriends(updatedFriends);
  };

  const sendBillNotification = async () => {
    if (!isConnected || !amount || friends.length === 0) {
      alert("Please ensure XMTP is connected and bill details are filled");
      return;
    }

    try {
      const addresses = friends.map(f => f.address).filter(addr => addr);
      const message = `🧾 Bill Split Request
${billDescription || "Group Expense"}
Total: $${amount}
Your share: $${friends[0]?.owedAmount || 0}
Please pay to: ${userAddress}

Powered by SplitMate 💰`;

      await sendGroupMessage(addresses, message);
      alert("Bill notifications sent via XMTP!");
    } catch (error) {
      console.error("Failed to send notifications:", error);
      alert("Failed to send notifications. Please try again.");
    }
  };

  const markAsPaid = async (friendId: number) => {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    setFriends(prev => prev.map(f => 
      f.id === friendId ? { ...f, hasPaid: true } : f
    ));

    if (isConnected) {
      try {
        const addresses = friends.map(f => f.address).filter(addr => addr);
        const message = `✅ Payment Confirmed
${friend.name} has paid $${friend.owedAmount}
Bill: ${billDescription || "Group Expense"}

Powered by SplitMate 💰`;

        await sendGroupMessage(addresses, message);
      } catch (error) {
        console.error("Failed to send payment confirmation:", error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        XMTP Bill Splitting
      </h2>
      
      {/* XMTP Status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-100">
        <span className="text-sm font-medium">
          XMTP Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </span>
      </div>

      {/* Bill Details */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Bill description (e.g., Dinner at Restaurant)"
          value={billDescription}
          onChange={(e) => setBillDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-black"
        />
        
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Total Amount: ${amount || 0}</span>
          <button
            onClick={calculateSplit}
            disabled={!amount}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition"
          >
            Calculate Split
          </button>
        </div>
      </div>

      {/* Friends List */}
      <div className="space-y-3 mb-6">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{friend.name}</h3>
              <p className="text-sm text-gray-600 truncate">{friend.address}</p>
              <p className="text-lg font-bold text-purple-600">
                ${friend.owedAmount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {friend.hasPaid ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  ✅ Paid
                </span>
              ) : (
                <button
                  onClick={() => markAsPaid(friend.id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm transition"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Send Notifications */}
      <button
        onClick={sendBillNotification}
        disabled={!isConnected || !amount || friends.length === 0}
        className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition shadow-md"
      >
        Send Bill via XMTP 📱
      </button>

      {/* Debug Info */}
      <details className="mt-6">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
          Debug Information
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 text-black rounded text-sm overflow-x-auto">
          {JSON.stringify({ friends, amount, billDescription, isConnected }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default XMTPBillSplitting;