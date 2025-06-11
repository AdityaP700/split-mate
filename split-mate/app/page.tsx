"use client";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ToastContainer, toast } from "react-toastify";

export default function App() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  useEffect(() => {
    if (isConnected && address) {
      toast.success("Wallet Connected Successfully", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => router.push("/splitamount"), // <-- navigate only after toast closes
      });
    }
  }, [isConnected, address]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200 dark:from-background dark:to-gray-900 text-black dark:text-white transition-colors">
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
      <ToastContainer />
      <div className="flex items-center justify-center h-screen gap-3">
        <Wallet>
          <ConnectWallet>
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-purple-800 dark:via-blue-700 dark:to-blue-900 px-7 py-3 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 cursor-pointer">
              <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-purple-300" />
              <Name className="text-white text-lg font-bold drop-shadow" />
            </div>
          </ConnectWallet>

          <WalletDropdown>
            <Identity
              className="px-4 pt-3 pb-2 space-y-2 border-b border-gray-200 dark:border-gray-700"
              hasCopyAddressOnClick
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10" />
                <div>
                  <Name className="text-sm font-semibold" />
                  <Address className="text-xs text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <EthBalance className="text-right text-sm font-medium" />
            </Identity>
            <WalletDropdownLink
              icon="wallet"
              href="https://keys.coinbase.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Manage Wallet
            </WalletDropdownLink>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </div>
  );
}
