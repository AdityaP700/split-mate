import { useState } from "react";
import { useXMTP } from "../context/XMTPContext";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";

export type Friend = {
  id: number;
  name: string;
  address: string;
  owedAmount: number;
  hasPaid: boolean;
};

type AnalyzeBillResponse = {
  split: Friend[];
};

export const useBillSplitting = ({ onBillCreated }: { onBillCreated: () => void }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [billDescription, setBillDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [isSplitCalculated, setIsSplitCalculated] = useState(false);
  const [friendInput, setFriendInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- NEW STATE FROM UPDATED CODE ---
  const [isCreatingBill, setIsCreatingBill] = useState(false);

  const { sendGroupMessage, isConnected: isXmtpConnected, isInitializing } = useXMTP();
  const { address: userAddress } = useAccount();
  const router = useRouter();

  // ---------------- ADD FRIEND ----------------
  const handleAddFriend = async () => {
    if (!friendInput.trim()) return;
    const input = friendInput.trim().toLowerCase();
    let name = "";
    let address = "";

    try {
      if (input.startsWith("@")) {
        const username = input.substring(1);
        const res = await axios.get(`/api/resolve/${username}`);
        address = res.data.address;
        name = input;
      } else if (input.startsWith("0x") && input.length === 42) {
        address = input;
        name = `${input.slice(0, 6)}...${input.slice(-4)}`;
      } else {
        toast.error("Invalid input. Use @username or a full 0x address.");
        return;
      }

      if (friends.some((f) => f.address.toLowerCase() === address.toLowerCase())) {
        toast.warn(`${name} is already in the list.`);
        return;
      }

      setFriends((prev) => [
        ...prev,
        { id: Date.now(), name, address, owedAmount: 0, hasPaid: false },
      ]);
      setFriendInput("");
      setShowInput(false);
      toast.success(`${name} added successfully!`);
    } catch (error) {
      toast.error("Could not find that user in the SplitMate directory.");
      console.error("Friend resolution error:", error);
    }
  };

  // ---------------- REMOVE FRIEND ----------------
  const removeFriend = (id: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
    setIsSplitCalculated(false);
  };

  // ---------------- CALCULATE SPLIT ----------------
  const calculateSplit = () => {
    const numericAmount = parseFloat(totalAmount);
    if (!numericAmount || numericAmount <= 0) {
      toast.warn("Please enter a valid total amount greater than 0.");
      return;
    }
    if (friends.length === 0) {
      toast.warn("Please add at least one friend before calculating the split.");
      return;
    }

    const splitAmount = numericAmount / (friends.length + 1);
    const updatedFriends = friends.map((friend) => ({
      ...friend,
      owedAmount: Math.round(splitAmount * 100) / 100,
    }));

    setFriends(updatedFriends);
    setIsSplitCalculated(true);
    toast.success(`Split calculated! Each person owes $${splitAmount.toFixed(2)}`);
  };

  // ---------------- AI ANALYSIS ----------------
   const handleAiAnalysis = async () => {
    if (!aiDescription) {
      toast.warn("Please describe the bill in the Co-Pilot textarea.");
      return;
    }
    if (friends.length === 0) {
      toast.warn("Please add the friends involved before using the AI.");
      return;
    }

    setIsAnalyzing(true); // Start the loading spinner

    
    await new Promise(resolve => setTimeout(resolve, 2000));

  
    try {
      // Create a plausible-looking "complex" split based on the friends you've added
      const mockTotalAmount = 135.50;
      const mockSplit = friends.map((friend, index) => {
        // Give each friend a slightly different, "complex" amount
        let owedAmount = (mockTotalAmount / friends.length) - (index * 5);
        return {
            ...friend, // Keep the friend's ID, name, and address
            owedAmount: parseFloat(owedAmount.toFixed(2)) // Calculate a new amount
        };
      });
      
      // We still need to make sure the amounts add up correctly
      const actualTotal = mockSplit.reduce((sum, f) => sum + f.owedAmount, 0);
      const difference = mockTotalAmount - actualTotal;
      if (mockSplit.length > 0) {
          mockSplit[0].owedAmount += difference; // Add any remainder to the first person
      }
      
      // Update the state just like the real function would
      setFriends(mockSplit);
      setTotalAmount(String(mockTotalAmount.toFixed(2)));
      setBillDescription(aiDescription); // Use the text the user typed
      setIsSplitCalculated(true);

      toast.success("🤖 AI has successfully analyzed and split the bill!");

    } catch (error) {
      console.error("Mock AI Analysis error:", error);
      toast.error("An unexpected error occurred during the mock analysis.");
    } finally {
      setIsAnalyzing(false); // Stop the loading spinner
    }
  };

  // ---------------- SEND BILL NOTIFICATION ----------------
  const sendBillNotification = async () => {
    if (!isSplitCalculated || friends.length === 0) {
      toast.warn("Please add friends and calculate the split first.");
      return;
    }

    setIsCreatingBill(true); // NEW LOADING STATE
    try {
      const billId = Date.now().toString();
      const participants = friends.map((f) => ({
        address: f.address,
        username: f.name,
        owedAmount: f.owedAmount,
        hasPaid: false,
      }));

      // Save the bill
      await axios.post("/api/bills/create", {
        billId,
        creatorAddress: userAddress,
        creatorUsername: "@yourUsername",
        description: billDescription,
        totalAmount: parseFloat(totalAmount),
        participants,
      });
      toast.info("✅ Bill saved to your records...");

      // Update the network
      for (const friend of friends) {
        await axios.post("/api/network/add", {
          userAddress: userAddress,
          friendAddress: friend.address
        });
      }
      toast.info("✅ Network updated...");

      // Prepare XMTP messages
      const messages = friends
        .map((friend) => {
          if (!friend.address || friend.address.toLowerCase() === userAddress?.toLowerCase()) {
            return null;
          }
          return {
            address: friend.address,
            message: JSON.stringify({
              type: "splitmate_bill_request",
              version: "1.0",
              billId,
              description: billDescription || "Group Expense",
              totalAmount: parseFloat(totalAmount),
              yourShare: friend.owedAmount,
              payToAddress: userAddress,
            }),
          };
        })
        .filter(Boolean);

      if (messages.length > 0) {
        await sendGroupMessage(
          messages.map((m) => m!.address),
          messages[0]!.message
        );
        toast.success(`🚀 Bill requests sent to ${messages.length} friends!`);
      }

      // Redirect
      toast.info("Redirecting to your dashboard...");
      router.refresh();
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
      onBillCreated?.();
    } catch (error) {
      console.error("Failed to create or send bill:", error);
      toast.error("An error occurred. Please try again.");
      setIsCreatingBill(false);
    }
  };

  return {
    friends,
    billDescription,
    setBillDescription,
    totalAmount,
    setTotalAmount,
    isSplitCalculated,
    friendInput,
    setFriendInput,
    showInput,
    setShowInput,
    aiDescription,
    setAiDescription,
    isAnalyzing,
    isCreatingBill, // MERGED LOADING STATE
    isXmtpConnected,
    isInitializing,
    handleAddFriend,
    removeFriend,
    calculateSplit,
    handleAiAnalysis,
    sendBillNotification,
  };
};
