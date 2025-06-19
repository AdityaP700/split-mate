// /app/splitamount/page.tsx

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useXMTP } from "../context/XMTPContext";
import { useAccount, useDisconnect } from "wagmi";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "react-toastify";

const SplitAmountPage = () => {
  const router = useRouter();
  const { address, isConnected: isWalletConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    isConnected: isXmtpConnected,
    initializeXMTP,
    isInitializing,
    initError,
  } = useXMTP();

  useEffect(() => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet to access the app.");
      router.push("/");
      return;
    }
    if (isWalletConnected && !isXmtpConnected && !isInitializing) {
      initializeXMTP();
    }
  }, [isWalletConnected, isXmtpConnected, isInitializing, initializeXMTP, router]);

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  // Main Render Logic
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-6">
          Initializing Secure Messaging...
        </p>
        <p className="text-gray-500">
          Please sign the message in your wallet if prompted.
        </p>
      </div>
    );
  }
  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="w-16 h-16 text-red-500">...Error Icon SVG...</div>
        <p className="text-xl font-semibold text-red-600 dark:text-red-400 mt-6">
          XMTP Connection Failed
        </p>
        <p className="text-gray-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md my-2">
          {initError}
        </p>
        <button
          onClick={() => initializeXMTP()}
          className="mt-4 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Retry Initialization
        </button>
        <button
          onClick={handleDisconnect}
          className="mt-4 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Disconnect
        </button>
      </div>
    );
  }
  return <DashboardLayout />;
};

export default SplitAmountPage;
