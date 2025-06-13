// /app/splitamount/page.tsx

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useXMTP } from "../context/XMTPContext";
import { useAccount, useDisconnect } from "wagmi";
import XMTPBillSplitting from "@/app/service/XMTPBillSplitting"; // Check path
import BillDashboard from "../service/BillDashboard"; // Check path
import Link from "next/link";
import { toast } from "react-toastify";

const SplitAmountPage = () => {
  const router = useRouter();
  const { address, isConnected: isWalletConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Now destructure all the state we need from our upgraded context
  const {
    isConnected: isXmtpConnected,
    initializeXMTP,
    isInitializing,
    initError,
  } = useXMTP();

  useEffect(() => {
    // The Guard Clause: Protects this page from unauthenticated access.
    if (!isWalletConnected) {
      toast.error("Please connect your wallet to access the app.");
      router.push("/");
      return; // Stop execution if not connected
    }

    // The Initialization Trigger: Runs only when needed.
    if (isWalletConnected && !isXmtpConnected && !isInitializing) {
      initializeXMTP();
    }
  }, [
    isWalletConnected,
    isXmtpConnected,
    isInitializing,
    initializeXMTP,
    router,
  ]);

  const handleDisconnect = () => {
    disconnect();
    // The router.push is now inside the disconnect handler for clear, intentional navigation
    router.push("/");
  };

  // Main Render Logic
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
            SplitMate
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {address && (
            <>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </span>
            </>
          )}
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Disconnect
          </button>
        </div>
      </header>

      {/* This is the 3-state renderer. It gives the user perfect feedback. */}
      {isInitializing ? (
        // STATE 1: LOADING
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-6">
            Initializing Secure Messaging...
          </p>
          <p className="text-gray-500">
            Please sign the message in your wallet if prompted.
          </p>
        </div>
      ) : initError ? (
        // STATE 2: ERROR
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
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
        </div>
      ) : (
        // STATE 3: SUCCESS, SHOW THE APP
        <main className="px-4 py-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-10">
          <section className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4">
              💸 Create & Split a Bill
            </h2>
            <XMTPBillSplitting />
          </section>

          <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4">
              📊 Incoming Bills
            </h2>
            <BillDashboard />
          </section>
        </main>
      )}

      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} SplitMate • Powered by XMTP & OnchainKit
      </footer>
    </div>
  );
};

export default SplitAmountPage;
