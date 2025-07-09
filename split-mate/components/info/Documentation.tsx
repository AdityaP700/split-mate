"use client";
import { BookOpen } from "lucide-react";

export default function Documentation() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-[#0070f3]" />
        <h1 className="text-3xl font-bold text-[#0070f3]">Documentation</h1>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-[#00d4aa]">SplitMate Technical Documentation</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        <b>API Reference:</b> SplitMate integrates with XMTP for messaging, Base blockchain for payments, and Coinbase Wallet for authentication. All interactions are client-side rendered using Next.js.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Integration Guide:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        Built on Next.js with Ethers.js for blockchain interactions, Tailwind CSS for styling, and full XMTP messaging integration. Supports real-time group chat context and instant crypto payments.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Wallet Connection:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        Users authenticate via Coinbase Wallet connection. The app requires Base network access for transaction processing and sufficient token balance for gas fees.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Message Flow:</h2>
      <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-200">
        <li>User connects Coinbase Wallet</li>
        <li>Joins/creates XMTP group chat</li>
        <li>Enters total bill amount</li>
        <li>App calculates equal splits</li>
        <li>Payment requests sent via XMTP</li>
        <li>Users approve transactions</li>
        <li>Confirmations sent to group chat</li>
      </ol>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Error Handling:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        The app handles wallet connection failures, network timeouts, insufficient balance warnings, and XMTP messaging errors with user-friendly notifications.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Development Environment:</h2>
      <p className="text-gray-700 dark:text-gray-200">
        Requires Node.js, XMTP API key, WalletConnect project ID, and Base network RPC URL. Full setup instructions available in the README.
      </p>
    </main>
  );
}