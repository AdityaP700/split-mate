// /app/service/XMTPBillSplitting.tsx
"use client";

import React, { useState } from "react";

import { useBillSplitting } from "@/app/service/useBillSpilliting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Send, Trash2, X, Users, Calculator, QrCode, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import Image from "next/image";
import { useAccount } from "wagmi";
import { toast } from "sonner";

interface XMTPBillSplittingProps {
  onBillCreated: () => void;
}
const XMTPBillSplitting = ({ onBillCreated }: XMTPBillSplittingProps) => {
  const {
    friends,
    billDescription,
    setBillDescription,
    totalAmount,
    setTotalAmount,
    isSplitCalculated,
    friendInput,
    isCreatingBill,
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
  } = useBillSplitting({onBillCreated});

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { address: userAddress } = useAccount();
  const router = useRouter();
  const generatePaymentQr = async () => {
    if (!userAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }

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
    <div className="w-full h-full bg-gray-900 text-white overflow-y-auto">
      {/* Header Section */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-semibold">Bill Splitting</h1>
          </div>
          <Badge
            variant={isInitializing ? "secondary" : isXmtpConnected ? "default" : "destructive"}
            className="text-xs"
          >
            {isInitializing ? "Initializing..." : isXmtpConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Bill Details Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Bill Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Bill description"
              value={billDescription}
              onChange={(e) => setBillDescription(e.target.value)}
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-500 text-sm h-9"
            />
            
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Total ($)"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="bg-gray-900 border-gray-600 text-white placeholder-gray-500 text-sm h-9 flex-1"
              />
              <Button
                onClick={calculateSplit}
                disabled={!totalAmount || parseFloat(totalAmount) <= 0 || friends.length === 0}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 px-3"
              >
                <Calculator className="w-4 h-4" />
              </Button>
            </div>

            {totalAmount && (
              <div className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
                Total: ${parseFloat(totalAmount || "0").toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Analysis Section */}
<Card className="bg-gray-800 border-gray-700">
  <CardHeader className="pb-3">
    <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      AI Co-Pilot
      {isAnalyzing && <Loader2 className="w-3 h-3 animate-spin" />}
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    <Textarea
      placeholder="Describe the bill and how to split it... e.g., 'Total was $95. Alice and I shared the $40 steak. Bob had a $25 pasta. We all split the $30 appetizer.'"
      value={aiDescription}
      onChange={(e) => setAiDescription(e.target.value)}
      className="bg-gray-900 border-gray-600 text-white placeholder-gray-500 text-sm resize-none"
      rows={2}
    />
    <Button
      onClick={handleAiAnalysis}
      disabled={isAnalyzing || !aiDescription}
      size="sm"
      className="bg-blue-600 hover:bg-blue-700 w-full text-xs"
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin mr-1" />
          Analyzing...
        </>
      ) : (
        "Analyze & Split with AI "
      )}
    </Button>
  </CardContent>
</Card>

        {/* Friends Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Friends ({friends.length})
              </CardTitle>
              {!showInput && (
                <Button
                  onClick={() => setShowInput(true)}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 h-7 px-2"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {showInput && (
              <div className="flex gap-2">
                <Input
                  placeholder="@username or 0x..."
                  value={friendInput}
                  onChange={(e) => setFriendInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddFriend()}
                  className="bg-gray-900 border-gray-600 text-white placeholder-gray-500 text-sm h-8 flex-1"
                />
                <Button
                  onClick={handleAddFriend}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 h-8 px-2"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => {
                    setShowInput(false);
                    setFriendInput("");
                  }}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 h-8 px-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {friends.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No friends added</p>
                  <p className="text-xs opacity-75">Add friends to split the bill</p>
                </div>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center bg-gray-900 rounded-lg p-2 border border-gray-700"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate">
                        {friend.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {`${friend.address.slice(0, 6)}...${friend.address.slice(-4)}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-medium text-sm">
                        ${friend.owedAmount.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => removeFriend(friend.id)}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions Section */}
        <div className="space-y-2">
          <Button
            onClick={sendBillNotification}
            disabled={!isXmtpConnected || !isSplitCalculated || isCreatingBill}
            className="w-full bg-blue-600 hover:bg-blue-700 h-10"
          >
            <Send className="w-4 h-4 mr-2" />
          {isCreatingBill ? "Processing & Sending..." : "Send Bill via XMTP 📱"}           </Button>

          {isSplitCalculated && (
            <Button
              onClick={generatePaymentQr}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 h-10"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate Payment QR
            </Button>
          )}
        </div>

        {/* QR Code Display */}
        {qrCodeUrl && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="bg-white p-3 rounded-lg inline-block">
                <Image src={qrCodeUrl} alt="Payment QR Code" width={120} height={120} />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Scan to pay {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Status Footer */}
        {friends.length > 0 && (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              {friends.length} friend{friends.length !== 1 ? "s" : ""} added
              {isSplitCalculated && (
                <>
                  <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  <span className="text-blue-400">Split calculated</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XMTPBillSplitting;