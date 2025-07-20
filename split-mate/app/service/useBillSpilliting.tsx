// /app/service/useBillSplitting.ts
import { useState } from "react";
import { useXMTP } from "../context/XMTPContext";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import axios from "axios";

export type Friend = {
  id: number;
  name: string;
  address: string;
  owedAmount: number;
  hasPaid: boolean;
};

export const useBillSplitting = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [billDescription, setBillDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [isSplitCalculated, setIsSplitCalculated] = useState(false);
  const [friendInput, setFriendInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { sendGroupMessage, isConnected: isXmtpConnected, isInitializing } = useXMTP();
  const { address: userAddress } = useAccount();

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

  const removeFriend = (id: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
    setIsSplitCalculated(false);
  };

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

  const handleAiAnalysis = async () => {
    if (!aiDescription) {
      toast.warn("Please describe the bill first");
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await axios.post("/api/calculate-total", { billDescription: aiDescription });
      setTotalAmount(String(res.data.totalAmount));
      setBillDescription(aiDescription);
      setIsSplitCalculated(false);
      toast.success(`AI calculated the total to be $${res.data.totalAmount}`);
    } catch (error) {
      console.error("AI Analysis error:", error);
      toast.error("AI couldn't understand the bill. Please enter the total manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendBillNotification = async () => {
    try {
      const billId = Date.now().toString();
      const participants = friends.map((f) => ({
        address: f.address,
        username: f.name,
        owedAmount: f.owedAmount,
        hasPaid: false,
      }));

      await axios.post("/api/bills/create", {
        billId,
        creatorAddress: userAddress,
        creatorUsername: "@yourUsername",
        description: billDescription,
        totalAmount: parseFloat(totalAmount),
        participants,
      });
      toast.info("Bill saved to your dashboard...");

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

      for (const msg of messages) {
        if (msg) await sendGroupMessage([msg.address], msg.message);
      }
      toast.success(`Bill requests sent to ${messages.length} friends!`);
    } catch (error) {
      console.error("Failed to create or send bill:", error);
      toast.error("An error occurred. Please try again.");
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
    isXmtpConnected,
    isInitializing,
    handleAddFriend,
    removeFriend,
    calculateSplit,
    handleAiAnalysis,
    sendBillNotification,
  };
};