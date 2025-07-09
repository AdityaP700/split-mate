"use client";
import { ListChecks } from "lucide-react";

export default function HelpCenter() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <div className="flex items-center gap-3 mb-6">
        <ListChecks className="w-8 h-8 text-[#0070f3]" />
        <h1 className="text-3xl font-bold text-[#0070f3]">Help Center</h1>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-[#00d4aa]">Getting Started with SplitMate</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        <span className="font-semibold">Quick Setup Guide:</span> Connect your Coinbase Wallet, join or create a group chat via XMTP, enter your bill amount, and let SplitMate handle the rest. Each participant pays their equal share instantly through Base blockchain transactions.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Troubleshooting:</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
        <li><b>Wallet Won't Connect:</b> Ensure you have the latest Coinbase Wallet version and sufficient Base network tokens for gas fees</li>
        <li><b>Messages Not Sending:</b> Check your XMTP connection status and internet connectivity</li>
        <li><b>Payment Failed:</b> Verify you have enough balance and the Base network is operational</li>
        <li><b>Split Not Working:</b> Confirm all group members are properly connected to the chat</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Payment Process:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        SplitMate automatically calculates equal shares, sends payment requests through XMTP, and processes transactions on Base blockchain. All participants receive confirmation receipts in the group chat.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Security:</h2>
      <p className="text-gray-700 dark:text-gray-200">
        Your wallet remains fully in your control. SplitMate only facilitates the splitting calculation and messaging - you approve all transactions directly through your Coinbase Wallet.
      </p>
    </main>
  );
}