// /app/service/XMTPBillSplitting.tsx
"use client";
import { useState } from "react";
import { useXMTP } from "../context/XMTPContext";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import axios from "axios";

type Friend = {
  id: number;
  name: string;
  address: string;
  owedAmount: number;
  hasPaid: boolean;
};
const sendBillNotification = async()=>{
  const billId = Date.now().toString();
  const participant = friends.map(f=>({
    address : f.address,
    username: f.name,
    owedAmount = f.owedAmount,
    hasPaid:false
  }));

  await axios.post('/api/bills/create',{
    billId,
    creatorAddress:userAddress,
    creatorUsername: "@yourUsername",
    description:billDescription,
    totalAmount : parseFloat(totalAmount),
    participants,
  })
}
// This is the new, clean component with smart friend addition
const XMTPBillSplitting = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [billDescription, setBillDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [isSplitCalculated, setIsSplitCalculated] = useState(false);

  // ✅ NEW STATE: Replaced old friendName with smart friendInput
  const [friendInput, setFriendInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const [aiDescription, setAiDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    sendGroupMessage,
    isConnected: isXmtpConnected,
    isInitializing,
  } = useXMTP();
  const { address: userAddress } = useAccount();

  // ✅ NEW SMART FUNCTION: The improved handleAddFriend function
  const handleAddFriend = async () => {
    if (!friendInput.trim()) return;

    const input = friendInput.trim().toLowerCase();
    let name = "";
    let address = "";

    try {
      // Handle @username format
      if (input.startsWith("@")) {
        const username = input.substring(1);
        const res = await axios.get(`/api/resolve/${username}`);
        address = res.data.address;
        name = input; // Keep the @username for display

        // ✅ DEMO: Example API response structure
        // Expected response: { address: "0x742d35Cc6634C0532925a3b8D2B0...", username: "alice" }
      } else if (input.startsWith("0x") && input.length === 42) {
        // Handle direct wallet address
        address = input;
        name = `${input.slice(0, 6)}...${input.slice(-4)}`;

        // ✅ DEMO: This creates a shortened display name like "0x742d...2925"
      } else {
        toast.error("Invalid input. Use @username or a full 0x address.");
        return;
      }

      // ✅ NEW FEATURE: Check for duplicates to prevent adding the same friend twice
      if (
        friends.some((f) => f.address.toLowerCase() === address.toLowerCase())
      ) {
        toast.warn(`${name} is already in the list.`);
        return;
      }

      // ✅ IMPROVED: Add friend with proper address resolution
      setFriends((prev) => [
        ...prev,
        {
          id: Date.now(),
          name,
          address,
          owedAmount: 0,
          hasPaid: false,
        },
      ]);

      setFriendInput(""); // Clear the input
      setShowInput(false); // Close the input UI
      toast.success(`${name} added successfully!`);
    } catch (error) {
      // ✅ IMPROVED ERROR HANDLING: More specific error message
      toast.error("Could not find that user in the SplitMate directory.");
      console.error("Friend resolution error:", error);
    }
  };

  const removeFriend = (id: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
    // ✅ IMPROVEMENT: Reset calculation when friends list changes
    setIsSplitCalculated(false);
  };

  const calculateSplit = () => {
    const numericAmount = parseFloat(totalAmount);

    // ✅ IMPROVED VALIDATION: Better error checking
    if (!numericAmount || numericAmount <= 0) {
      toast.warn("Please enter a valid total amount greater than 0.", {
        position: "top-right",
      });
      return;
    }

    if (friends.length === 0) {
      toast.warn(
        "Please add at least one friend before calculating the split.",
        { position: "top-right" }
      );
      return;
    }

    // ✅ CALCULATION: Split among all participants (friends + payer)
    const splitAmount = numericAmount / (friends.length + 1); // +1 for the payer

    const updatedFriends = friends.map((friend) => ({
      ...friend,
      owedAmount: Math.round(splitAmount * 100) / 100, // Round to 2 decimal places
    }));

    setFriends(updatedFriends);
    setIsSplitCalculated(true);

    toast.success(
      `Split calculated! Each person owes $${splitAmount.toFixed(2)}`
    );
  };

  const sendBillNotification = async () => {
    if (!isXmtpConnected || !isSplitCalculated) {
      toast.warn("Please connect to XMTP and calculate the split first.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // ✅ IMPROVED: Now works correctly because friends have proper addresses
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
        return;
      }

      // ✅ DEMO: Message payload structure
      const messagePayload = {
        type: "splitmate_bill_request",
        version: "1.0",
        description: billDescription || "Group Expense",
        totalAmount: parseFloat(totalAmount),
        yourShare: friends[0]?.owedAmount || 0,
        currency: "USD",
        payToAddress: userAddress,
        paymentChainId: 84531, // Base Sepolia Testnet
        // ✅ DEMO: Additional fields you might want to include
        // timestamp: new Date().toISOString(),
        // billId: `bill_${Date.now()}`,
        // dueDate: "2024-12-31",
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
    } catch (error) {
      console.error("Failed to send notifications:", error);
      toast.error("An error occurred while sending notifications.");
    }
  };

  // ✅ DEMO: Optional - Load demo friends for testing
  // Uncomment this useEffect to add demo friends automatically
  /*
  useEffect(() => {
    const demoFriends: Friend[] = [
      {
        id: 1,
        name: "@alice",
        address: "0x742d35Cc6634C0532925a3b8D2B0B4D4f5c1234567",
        owedAmount: 0,
        hasPaid: false,
      },
      {
        id: 2,
        name: "@bob",
        address: "0x8ba1f109551bD432803012645Hac136c22c2bd4f",
        owedAmount: 0,
        hasPaid: false,
      },
    ];
    setFriends(demoFriends);
  }, []);
  */

  // Add this after your existing handler functions
  const handleAiAnalysis = async () => {
    if (!aiDescription) {
      toast.warn("Please describe the bill first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await axios.post("/api/calculate-total", {
        billDescription: aiDescription,
      });

      setTotalAmount(String(res.data.totalAmount));
      setBillDescription(aiDescription); // Automatically set the bill description
      setIsSplitCalculated(false); // Reset split calculation

      toast.success(`AI calculated the total to be $${res.data.totalAmount}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("AI Analysis error:", error);
      toast.error(
        "AI couldn't understand the bill. Please enter the total manually.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        XMTP Bill Splitting
      </h2>

      {/* ✅ XMTP Status Indicator */}
      <div className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
        <span className="text-sm text-gray-900 dark:text-gray-300 font-medium">
          XMTP Status:{" "}
          {isInitializing
            ? "🟠 Initializing..."
            : isXmtpConnected
            ? "🟢 Connected"
            : "🔴 Disconnected"}
        </span>
      </div>

      {/* ✅ Bill Description Input */}
      <div className="mb-6 space-y-4">
        {/* Regular Bill Input */}
        <input
          type="text"
          placeholder="Bill description (e.g., Dinner at Restaurant)"
          value={billDescription}
          onChange={(e) => setBillDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 text-black dark:text-white bg-transparent"
        />

        {/* AI Analysis Section */}
        <div className="p-4 border-2 border-dashed border-purple-400/30 dark:border-purple-400/20 rounded-lg bg-purple-50/50 dark:bg-purple-900/10">
          <h3 className="font-bold mb-2 text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <span>✨ AI Co-Pilot</span>
            {isAnalyzing && (
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h3>
          <textarea
            placeholder="Describe your bill here (e.g., 'Dinner for 3 people at Joe's Pizza with 2 large pizzas at $20 each and 3 sodas at $3 each')"
            value={aiDescription}
            onChange={(e) => setAiDescription(e.target.value)}
            className="w-full p-3 border border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            rows={3}
          />
          <button
            onClick={handleAiAnalysis}
            disabled={isAnalyzing || !aiDescription}
            className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <span>Analyzing...</span>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              <>
                <span>Calculate with AI</span>
                <span>🤖</span>
              </>
            )}
          </button>
        </div>

        {/* Total Amount Input */}
        <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder="Total Amount"
            value={totalAmount}
            onChange={(e) => {
              setTotalAmount(e.target.value);
              setIsSplitCalculated(false);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 text-black dark:text-white bg-transparent"
          />
          <span className="text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">
            Total: ${parseFloat(totalAmount || "0").toFixed(2)}
          </span>
          <button
            onClick={calculateSplit}
            disabled={!totalAmount || parseFloat(totalAmount) <= 0 || friends.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            Calculate Split
          </button>
        </div>
      </div>

      {/* ✅ NEW, IMPROVED ADD FRIEND UI */}
      <div className="my-4">
        {showInput ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="@username or 0x address..."
              value={friendInput}
              onChange={(e) => setFriendInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddFriend()}
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-black dark:text-white bg-transparent"
            />
            <button
              onClick={handleAddFriend}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setFriendInput("");
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            + Add Friend
          </button>
        )}
      </div>

      {/* ✅ IMPROVED Friends List Display */}
      <div className="space-y-2 mb-6">
        {friends.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No friends added yet.</p>
            <p className="text-sm">
              Add friends using @username or wallet address
            </p>
          </div>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
            >
              <div className="flex-1">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {friend.name}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {/* {friend.address} */}
                  {`${friend.address.slice(0, 6)}...${friend.address.slice(
                    -4
                  )}`}
                </div>
              </div>
              <span className="text-lg font-semibold text-purple-600 dark:text-purple-400 mr-3">
                ${friend.owedAmount.toFixed(2)}
              </span>
              <button
                onClick={() => removeFriend(friend.id)}
                className="text-red-500 hover:text-red-700 text-lg transition"
                title="Remove friend"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* ✅ Send Bill Button */}
      <button
        onClick={sendBillNotification}
        disabled={!isXmtpConnected || !isSplitCalculated}
        className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition shadow-md"
      >
        Send Bill via XMTP 📱
      </button>

      {/* ✅ DEMO: Status indicators */}
      {friends.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          {friends.length} friend{friends.length !== 1 ? "s" : ""} added
          {isSplitCalculated && (
            <span className="ml-2 text-green-600 dark:text-green-400">
              • Split calculated ✓
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default XMTPBillSplitting;
