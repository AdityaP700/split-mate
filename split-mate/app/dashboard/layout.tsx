"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";

const brandColor = "#0553f3";

// -----------------
// Dashboard Context
// -----------------
interface DashboardContextType {
  dashboardData: any;
  username: string | null;
  fetchDashboardData: () => Promise<void>;
  isLoading: boolean;
  address?: string;
}

const DashboardContext = createContext<DashboardContextType | null>(null);
export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardLayout");
  return ctx;
};

// -----------------
// Tabs Config
// -----------------
const TABS = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Start a Split", icon: Plus, href: "/dashboard/start-a-split" },
  { label: "My Network", icon: Users, href: "/dashboard/my-network" },
  { label: "History", icon: HistoryIcon, href: "/dashboard/history" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

// -----------------
// DashboardLayout
// -----------------
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [username, setUsername] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    if (!address) return;
    try {
      setError(null);
      const res = await axios.get(`/api/dashboard/${address}`);
      setDashboardData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      setError("Unable to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
      return;
    }
    const fetchInitialData = async () => {
      if (!address) return;
      setIsLoading(true);
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          axios.get(`/api/profile/${address}`),
          axios.get(`/api/dashboard/${address}`)
        ]);
        setUsername(profileRes.data.username);
        setDashboardData(dashboardRes.data);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
        setError("Could not load profile or dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [isConnected, address, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030815] text-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#030815] text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-lg text-red-400">{error || "Unknown error occurred."}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <DashboardContext.Provider
      value={{ dashboardData, username, fetchDashboardData, isLoading, address }}
    >
      <div className="min-h-screen bg-[#030815] text-white font-sans">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-[#080d1b]/50 backdrop-blur-lg border-r border-white/5">
          <div className="p-6 flex flex-col h-full">
            {/* Logo */}
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

            {/* Navigation */}
            <nav className="space-y-2 flex-grow">
              {TABS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link href={item.href} key={item.href} passHref>
                    <div
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 relative cursor-pointer ${
                        isActive
                          ? "text-white bg-white/5"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-tab-indicator"
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                          style={{ background: brandColor }}
                        />
                      )}
                      <item.icon className="w-5 h-5 z-10" />
                      <span className="font-medium z-10">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Profile & Disconnect */}
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

        {/* Content */}
        <main className="pl-64 p-8">{children}</main>
      </div>
    </DashboardContext.Provider>
  );
}
