// /app/service/XMTPBillSplitting.tsx
"use client";

// ✅ NEW: bring in React state
import React, { useState } from "react";

import { useBillSplitting } from "@/app/service/useBillSpilliting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Send, Trash2, X } from "lucide-react";

// ✅ NEW: QR generation + Next.js Image component
import QRCode from "qrcode";
import Image from "next/image";

// ✅ NEW: to grab the connected wallet address
import { useAccount } from "wagmi";

// ✅ NEW: toast (replace with your own toast lib if different)
import { toast } from "sonner";

const XMTPBillSplitting = () => {
  const {
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
  } = useBillSplitting();

  // ✅ NEW: state to store the generated QR Code data URL
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // ✅ NEW: get the user's connected wallet address
  const { address: userAddress } = useAccount();

  // ✅ NEW: function to generate a payment QR code for your wallet address
  const generatePaymentQr = async () => {
    if (!userAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }

    // Simple, universal payment link that most modern wallets recognize.
    // We don't fix an amount here since everyone might owe a different share.
    const qrData = `ethereum:${userAddress}`;

    try {
      const url = await QRCode.toDataURL(qrData);
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Failed to generate QR code", err);
      toast.error("Could not generate QR code.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Bill Splitting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* XMTP Status */}
          <Badge
            variant={isInitializing ? "secondary" : isXmtpConnected ? "default" : "destructive"}
            className="w-fit"
          >
            {isInitializing ? "Initializing..." : isXmtpConnected ? "Connected" : "Disconnected"}
          </Badge>

          {/* Bill Description */}
          <div className="space-y-4">
          <Input
            placeholder="Bill description (e.g., Dinner at Restaurant)"
            value={billDescription}
            onChange={(e) => setBillDescription(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />

          {/* AI Analysis */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-400">AI Co-Pilot</span>
                {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
              </div>
              <Textarea
                placeholder="Describe your bill (e.g., 'Dinner for 3 people at Joe's Pizza...')"
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                rows={3}
              />
              <Button
                onClick={handleAiAnalysis}
                disabled={isAnalyzing || !aiDescription}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    Analyzing...
                    <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                  </>
                ) : (
                  "Calculate with AI"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Total Amount */}
          <div className="flex items-center gap-4">
            <Input
              type="number"
              placeholder="Total Amount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
            <span className="text-gray-400 font-medium">
              Total: ${parseFloat(totalAmount || "0").toFixed(2)}
            </span>
            <Button
              onClick={calculateSplit}
              disabled={!totalAmount || parseFloat(totalAmount) <= 0 || friends.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Calculate Split
            </Button>
          </div>
        </div>

        {/* Add Friend */}
        <div>
          {showInput ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="@username or 0x address..."
                value={friendInput}
                onChange={(e) => setFriendInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddFriend()}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button onClick={handleAddFriend} className="bg-blue-600 hover:bg-blue-700">
                Add
              </Button>
              <Button
                onClick={() => {
                  setShowInput(false);
                  setFriendInput("");
                }}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowInput(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Friend
            </Button>
          )}
        </div>

        {/* Friends List */}
        <div className="space-y-2">
          {friends.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No friends added yet.</p>
              <p className="text-sm">Add friends using @username or wallet address</p>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center bg-gray-800 rounded-lg p-3"
              >
                <div className="flex-1">
                  <span className="font-medium text-white">{friend.name}</span>
                  <div className="text-xs text-gray-400">
                    {`${friend.address.slice(0, 6)}...${friend.address.slice(-4)}`}
                  </div>
                </div>
                <span className="text-lg font-medium text-blue-400 mr-3">
                  ${friend.owedAmount.toFixed(2)}
                </span>
                <Button
                  onClick={() => removeFriend(friend.id)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Send Bill */}
        <Button
          onClick={sendBillNotification}
          disabled={!isXmtpConnected || !isSplitCalculated}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4 mr-2" /> Send Bill
        </Button>

        {/* ✅ NEW: Pay in-person with QR (shown only after split is calculated) */}
        {isSplitCalculated && (
          <div className="mt-6 text-center">
            <Button
              onClick={generatePaymentQr}
              className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
            >
              Pay In-Person with QR
            </Button>

            {qrCodeUrl && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg inline-block">
                {/* Next/Image works with data URLs since Next 13 */}
                <Image src={qrCodeUrl} alt="Payment QR Code" width={200} height={200} />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Scan to pay {`${userAddress?.slice(0, 6)}...`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status Indicators */}
        {friends.length > 0 && (
          <div className="text-sm text-gray-400 text-center">
            {friends.length} friend{friends.length !== 1 ? "s" : ""} added
            {isSplitCalculated && (
              <span className="ml-2 text-blue-400">• Split calculated</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
  );
};

export default XMTPBillSplitting;
