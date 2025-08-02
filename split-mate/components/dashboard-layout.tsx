"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useDisconnect } from "wagmi";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Home,
  Plus,
  Users,
  History as HistoryIcon,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import BillDashboard from "@/app/service/BillDashboard";
import XMTPBillSplitting from "./XMTPBill";
import MyNetwork from "@/components/sections/my-network";
import History from "@/components/history"; // assuming you have this
import { Card, CardContent } from "@/components/ui/card";

// --- TABS Definition ---
const TABS = [
  { label: "Dashboard", icon: Home },
  { label: "Start a Split", icon: Plus },
  { label: "My Network", icon: Users },
  { label: "History", icon: HistoryIcon },
  { label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState(0);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [username, setUsername] = useState<string | null>(null);

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Define this outside useEffect so it can be reused
  const fetchDashboardData = useCallback(async () => {
  try {
    const res = await axios.get(`/api/dashboard/${address}`);
    setDashboardData(res.data);
  } catch (err) {
    console.error("Failed to fetch dashboard data", err);
  } finally {
    setIsLoading(false);
  }
}, [address]);


  // --- Fetch Profile Info ---
  useEffect(() => {
    if (!address) return;
    axios
      .get(`/api/profile/${address}`)
      .then((res) => setUsername(res.data.username))
      .catch(() => setUsername(null));
  }, [address]);

  // --- Fetch Dashboard Info ---
 useEffect(() => {
  if (address) fetchDashboardData();
}, [address, fetchDashboardData]);


  const brandColor = "#0553f3";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030815] text-white flex items-center justify-center">
        Loading your command center...
      </div>
    );
  }
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#030815] text-white flex items-center justify-center">
        Could not load dashboard data. Please try again.
      </div>
    );
  }

  // --- Construct stat cards from live data ---
  const statCards = [
    {
      title: "You Are Owed",
      amount: `$${dashboardData.youAreOwed.toFixed(2)}`,
      change: "+12.5%", // Optional: can add real-time calc later
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "You Owe",
      amount: `$${dashboardData.youOwe.toFixed(2)}`,
      change: "-5.2%",
      icon: TrendingDown,
      positive: false,
    },
    {
      title: "Network Size",
      amount: dashboardData.networkSize,
      change: "+2",
      icon: Users,
      positive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030815] text-white font-sans">
      {/* --- Sidebar --- */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#080d1b]/50 backdrop-blur-lg border-r border-white/5">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ background: brandColor }}
              >
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold">SplitMate</h1>
            </div>
          </div>

          <nav className="space-y-2 flex-grow">
            {TABS.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(idx)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 relative ${
                  activeTab === idx
                    ? "text-white bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {activeTab === idx && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                    style={{ background: brandColor }}
                  />
                )}
                <item.icon className="w-5 h-5 z-10" />
                <span className="font-medium z-10">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {username ? `@${username}` : "Connected"}
                </p>
                <p className="text-xs text-white/50 font-mono">
                  {address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : "No address"}
                </p>
              </div>
              <button
                onClick={() => disconnect()}
                className="p-2 rounded-lg text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="pl-64 p-8">
        {/* --- Tab 0: Dashboard --- */}
        {activeTab === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <header className="mb-10">
          <h2 className="text-3xl font-bold mb-1">
            Welcome back{username ? `, @${username}` : ""}!
          </h2>
          <p className="text-white/60">
            Here's your on-chain financial overview.
          </p>
        </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <Card
                  key={index}
                  className="bg-white/5 border border-white/10 shadow-lg shadow-black/20 rounded-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-white/60">
                        {stat.title}
                      </p>
                      <stat.icon
                        className={`w-5 h-5 ${
                          stat.positive ? "text-green-400" : "text-red-400"
                        }`}
                      />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{stat.amount}</p>
                      <span
                        className={`text-sm font-medium ${
                          stat.positive ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
<BillDashboard
  bills={dashboardData.incomingBills}
  fetchDashboardData={fetchDashboardData}
/>
          </motion.div>
        )}

        {/* --- Tab 1: Start a Split --- */}
        {activeTab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8"
          >
            <XMTPBillSplitting onBillCreated={fetchDashboardData} />
          </motion.div>
        )}

        {/* --- Tab 2: My Network --- */}
        {activeTab === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <MyNetwork network={dashboardData.network} />
          </motion.div>
        )}

        {/* --- Tab 3: History --- */}
        {activeTab === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <History history={dashboardData.history} />
          </motion.div>
        )}

        {/* --- Tab 4: Settings Placeholder --- */}
        {activeTab === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center h-96 bg-white/5 border border-white/10 rounded-xl"
          >
            <p className="text-white/60">Settings - Coming Soon</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
