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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useAccount, useDisconnect } from 'wagmi';
import ProfileModal from "./components/ProfileModal";
import LoadingSpinner from "./components/LoadingSpinner";

// In your main landing page.tsx
export default function App() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // To show loading state
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // This refined effect only runs when the user's connection status changes.
    // It's designed to NOT cause redirect loops.
    if (isConnected && address) {
      setIsLoading(true);
      // When the wallet connects, we check if they have a profile.
      axios.get(`/api/profile/${address}`)
        .then(res => {
          // SUCCESS: They have a profile. Just welcome them back.
          // We let them click the "Launch Dashboard" button themselves.
          toast.success(`Welcome back, @${res.data.username}!`);
        })
        .catch(err => {
          // FAILURE (404): They are a new user.
          if (err.response?.status === 404) {
            toast.info("Welcome! Let's create your profile to get started.");
            setShowProfileModal(true); // Show the registration modal.
          } else {
            // Handle other server/network errors
            toast.error("Could not verify your profile. Please try again.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isConnected, address]); // The dependency array is key.

  const handleProfileCreatedAndClose = () => {
    setShowProfileModal(false);
    toast.success("Profile created! Redirecting you to the app...");
    // Redirect only after the profile is successfully created.
    setTimeout(() => {
        router.push('/splitamount');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-500">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/20 dark:border-gray-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
              SplitMate
            </h1>
          </Link>

          {/* Connection Status */}
          <div className="flex items-center gap-4">
            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <div className="group flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full border border-green-500/20 dark:border-green-400/20">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                  </span>
                </div>

                <button
                  onClick={() => setShowProfileModal(true)}
                  className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">Edit Profile</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>

                {/* This is the "escape hatch" disconnect button */}
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full border border-orange-500/20">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  {isLoading ? "Connecting..." : "Disconnected"}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={handleProfileCreatedAndClose}
      />

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-16"
      />

      {/* Enhanced Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6">
        {/* Title Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="relative">
            <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Split Smart
            </h2>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full opacity-80 animate-bounce"></div>
            <div className="absolute -bottom-2 -left-6 w-8 h-8 bg-pink-400 rounded-full opacity-60 animate-pulse"></div>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The most elegant way to split expenses with friends, powered by blockchain technology
          </p>
        </div>

        {/* Connection/Launch Section */}
        <div className="relative group">
          {!isConnected ? (
            // Show Connect Wallet button when disconnected
            <Wallet>
              <ConnectWallet>
                <div className="relative flex items-center gap-4 bg-white dark:bg-gray-800 px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm group-hover:scale-105">
                  <div className="relative">
                    <Avatar className="h-14 w-14 ring-4 ring-blue-500/20 dark:ring-purple-500/20 shadow-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div className="flex flex-col">
                    <Name className="text-xl font-bold text-gray-900 dark:text-white mb-1" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Click to connect your wallet
                    </span>
                  </div>
                </div>
              </ConnectWallet>
              <WalletDropdown>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                  <Identity
                    className="px-6 pt-6 pb-4 space-y-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20"
                    hasCopyAddressOnClick
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-blue-500/30" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="flex-1">
                        <Name className="text-lg font-bold text-gray-900 dark:text-white" />
                        <Address className="text-sm text-gray-500 dark:text-gray-400 font-mono" />
                      </div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-700/50 rounded-lg p-3">
                      <EthBalance className="text-right text-lg font-bold text-green-600 dark:text-green-400" />
                    </div>
                  </Identity>

                  <div className="p-2">
                    <WalletDropdownLink
                      icon="wallet"
                      href="https://keys.coinbase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                        </svg>
                      </div>
                      Manage Wallet
                    </WalletDropdownLink>
                    <WalletDropdownDisconnect className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200" />
                  </div>
                </div>
              </WalletDropdown>
            </Wallet>
          ) : (
            // Show Launch Dashboard button when connected
            <button
              onClick={() => router.push('/splitamount')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
            >
              <div className="relative flex items-center gap-4">
                <span className="text-xl font-bold text-white">Launch Dashboard</span>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          {[
            {
              icon: "💫",
              title: "Instant Splits",
              description: "Split bills in seconds with smart contracts",
            },
            {
              icon: "🔐",
              title: "Secure & Transparent",
              description: "Blockchain-powered transparency you can trust",
            },
            {
              icon: "🚀",
              title: "Gas Optimized",
              description: "Minimal fees, maximum efficiency",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// Helper component for initialization steps
function InitStep({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {completed ? (
        <span className="text-green-500">✓</span>
      ) : (
        <LoadingSpinner className="w-4 h-4" />
      )}
      <span className={completed ? "text-green-600" : "text-gray-600"}>
        {label}
      </span>
    </div>
  );
}