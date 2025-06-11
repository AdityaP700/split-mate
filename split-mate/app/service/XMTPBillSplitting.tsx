// src/components/XMTPBillSplitting.tsx

"use client";
import { useState } from "react";
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
  const [friendName, setFriendName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const { sendGroupMessage, isConnected: isXmtpConnected } = useXMTP();
  const { address: userAddress } = useAccount();
  const addFriend = (name: string) => {
    if (!name.trim()) return;
    setFriends((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        address: "", // Placeholder, can be updated later
        owedAmount: 0,
        hasPaid: false,
      },
    ]);
    setFriendName("");
    setShowInput(false);
  };

  const removeFriend = (id: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  // useEffect(() => {
  //   const defaultFriends: Friend[] = [
  //     {
  //       id: 1,
  //       name: "Alice",
  //       address: process.env.NEXT_PUBLIC_ALICE_WALLET_ADDRESS || "",
  //       owedAmount: 0,
  //       hasPaid: false,
  //     },
  //     {
  //       id: 2,
  //       name: "Bob",
  //       address: process.env.NEXT_PUBLIC_BOB_WALLET_ADDRESS || "",
  //       owedAmount: 0,
  //       hasPaid: false,
  //     },
  //   ];
  //   setFriends(defaultFriends);
  // }, []);

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
          <span className="text-gray-700 font-semibold">
            Total: ${parseFloat(totalAmount || "0").toFixed(2)}
          </span>
          <button
            onClick={calculateSplit}
            disabled={!totalAmount || parseFloat(totalAmount) <= 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            Calculate Split
          </button>
        </div>
      </div>
      <button
        className="mb-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        onClick={() => setShowInput(true)}
      >
        Add Friend
      </button>
      {showInput && (
        <div className="flex items-center mt-2 gap-2">
          <input
            type="text"
            placeholder="Friend's name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            className="px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={() => addFriend(friendName)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowInput(false);
              setFriendName("");
            }}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}

      {friends.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center bg-gray-100 rounded-lg px-4 py-2 shadow-sm"
        >
          <span className="font-medium text-gray-800 mr-2">{friend.name}</span>
          <span className="ml-auto text-gray-700 font-semibold">
            ${friend.owedAmount.toFixed(2)}
          </span>
          <button
            onClick={() => removeFriend(friend.id)}
            className="ml-3 text-red-500 hover:text-red-700 text-xs"
            title="Remove"
          >
            ✕
          </button>
        </div>
      ))}

      {/* <div className="space-y-3 mb-6">
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
      </div> */}
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
