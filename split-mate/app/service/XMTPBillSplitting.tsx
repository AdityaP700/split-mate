// src/components/XMTPBillSplitting.tsx

"use client";
import { useState, useEffect } from "react";
import { useXMTP } from "../context/XMTPContext";
import { useAccount } from "wagmi";
import { ToastContainer, toast } from "react-toastify";

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
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [isSplitCalculated, setIsSplitCalculated] = useState(false);

  const { sendGroupMessage, isConnected: isXmtpConnected } = useXMTP();
  const { address: userAddress } = useAccount();

  useEffect(() => {
    const defaultFriends: Friend[] = [
      {
        id: 1,
        name: "Alice",
        address: process.env.NEXT_PUBLIC_ALICE_WALLET_ADDRESS || "",
        owedAmount: 0,
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
    const numericAmount = parseFloat(totalAmount);
    if (!numericAmount || numericAmount <= 0 || friends.length === 0) {
      toast.warn("Please enter a valid total amount.", {
        position: "top-right",
        autoClose: 3000,
      });
      alert("Please enter a valid total amount.");
      return;
    }
    const splitAmount = numericAmount / (friends.length + 1);
    const updatedFriends = friends.map((friend) => ({
      ...friend,
      owedAmount: Math.round(splitAmount * 100) / 100,
    }));
    setFriends(updatedFriends);
    setIsSplitCalculated(true);
    toast.success(
      `Split calculated! Each person owes $${splitAmount.toFixed(2)}`,
      {
        position: "top-right",
        autoClose: 3000,
      }
    );
    alert(`Split calculated! Each person owes $${splitAmount.toFixed(2)}.`);
  };

  const sendBillNotification = async () => {
    if (!isXmtpConnected || !isSplitCalculated) {
      toast.warn("Please connect to XMTP and calculate the split first.", {
        position: "top-right",
        autoClose: 3000,
      });
      alert("Please connect to XMTP and calculate the split first.");
      return;
    }
    try {
      const recipientAddresses = friends
        .map((f) => f.address)
        .filter(
          (addr) => addr && addr.toLowerCase() !== userAddress?.toLowerCase()
        );
      if (recipientAddresses.length === 0) {
        toast.error("No valid recipient addresses to send notifications to.", {
          position: "top-right",
          autoClose: 3000,
        });
        alert("No valid recipient addresses to send notifications to.");
        return;
      }
      const messagePayload = {
        type: "splitmate_bill_request",
        version: "1.0",
        description: billDescription || "Group Expense",
        totalAmount: parseFloat(totalAmount),
        yourShare: friends[0]?.owedAmount || 0,
        currency: "USD",
        payToAddress: userAddress,
        paymentChainId: 84531, // Base Sepolia Testnet
      };
      const message = JSON.stringify(messagePayload);
      await sendGroupMessage(recipientAddresses, message);
      toast.success(
        `Successfully sent bill requests to ${recipientAddresses.length} friends!`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      alert(
        `Successfully sent bill requests to ${recipientAddresses.length} friends!`
      );
    } catch (error) {
      console.error("Failed to send notifications:", error);
      alert("An error occurred while sending notifications.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        XMTP Bill Splitting
      </h2>
      <div className="mb-4 p-3 rounded-lg bg-gray-100">
        <span className="text-sm text-gray-900 font-medium">
          XMTP Status: {isXmtpConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </span>
      </div>
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Bill description (e.g., Dinner at Restaurant)"
          value={billDescription}
          onChange={(e) => setBillDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-black"
        />
        <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder="Total Amount"
            value={totalAmount}
            onChange={(e) => {
              setTotalAmount(e.target.value);
              setIsSplitCalculated(false);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-black"
          />
          <button
            onClick={calculateSplit}
            disabled={!totalAmount || parseFloat(totalAmount) <= 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            Calculate Split
          </button>
        </div>
      </div>
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
                ${friend.owedAmount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={sendBillNotification}
        disabled={!isXmtpConnected || !isSplitCalculated}
        className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition shadow-md"
      >
        Send Bill via XMTP 📱
      </button>
    </div>
  );
};

export default XMTPBillSplitting;
