"use client";
import XMTPBillSplitting from "@/app/service/XMTPBillSplitting";
import BillDashboard from "../service/BillDashboard";
import { useAccount } from "wagmi";
import Link from "next/link";

const SplitAmount = () => {
  const { address, isConnected } = useAccount();
  return (
    <div>
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-300 tracking-tight">
            SplitMate
          </h1>
        </Link>
        <h1 className="text-xl font-bold text-blue-600 dark:text-white tracking-tight">
          {isConnected && address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : "Connecting..."}
        </h1>
      </header>
      <main className="px-4 py-10 max-w-4xl mx-auto w-full grid gap-10">
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4">
            💸 Split a Bill
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enter details and split a bill with your friends securely.
          </p>
          <XMTPBillSplitting />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4">
            📊 Bill Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Track all your recent bills and settlements here.
          </p>
          <BillDashboard />
        </section>
      </main>
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} SplitMate • Built with Coinbase OnchainKit
      </footer>
    </div>
  );
};

export default SplitAmount;
