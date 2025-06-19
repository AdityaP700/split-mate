"use client"

import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import BillDashboard from "@/app/service/BillDashboard";
import XMTPBillSplitting from "@/app/service/XMTPBillSplitting";
import {  Home, Plus, Users, History, Settings, LogOut, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { motion } from "framer-motion";

const TABS = [
  { label: "Dashboard", icon: Home },
  { label: "Start a Split", icon: Plus },
  { label: "My Network", icon: Users },
  { label: "History", icon: History },
  { label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState(0);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [username, setUsername] = useState<string | null>(null);
  
  // --- DATA ---
  // Mock data, to be replaced with real API calls
  const [statCards, setStatCards] = useState([
    { title: "You Are Owed", amount: "$125.50", change: "+12.5%", icon: TrendingUp, positive: true },
    { title: "You Owe", amount: "$32.00", change: "-5.2%", icon: TrendingDown, positive: false },
    { title: "Network Size", amount: "8", change: "+2", icon: Users, positive: true },
  ]);

  useEffect(() => {
    if (!address) return;
    axios.get(`/api/profile/${address}`)
      .then(res => setUsername(res.data.username))
      .catch(() => setUsername(null));
    // TODO: Fetch real stats for statCards
  }, [address]);

  // --- BRANDING & STYLING ---
  const brandColor = "#0553f3";

  return (
    // --- LAYOUT: Main container with our branded dark background ---
    <div className="min-h-screen bg-[#030815] text-white font-sans">
      {/* --- LAYOUT: Fixed sidebar with a defined width and subtle background --- */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#080d1b]/50 backdrop-blur-lg border-r border-white/5">
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-2">
              {/* --- BRANDING: Replaced generic icon with our established logo --- */}
              <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: brandColor }}>
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold">SplitMate</h1>
            </div>
            {/* Keeping ThemeToggle is a good UX feature */}
            {/* <ThemeToggle /> */}
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2 flex-grow">
            {TABS.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(idx)}
                // --- STYLE: Cleaner active state with a left border instead of a gradient ---
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
                        style={{background: brandColor}}
                    />
                )}
                <item.icon className="w-5 h-5 z-10" />
                <span className="font-medium z-10">{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Profile/Logout Section */}
          <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">{username ? `@${username}` : 'Connected'}</p>
                        <p className="text-xs text-white/50 font-mono">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No address'}</p>
                    </div>
                    <button onClick={() => disconnect()} className="p-2 rounded-lg text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                        <LogOut className="w-5 h-5"/>
                    </button>
                </div>
          </div>
        </div>
      </div>
      
      {/* --- LAYOUT: Main Content with correct padding to offset sidebar --- */}
      <main className="pl-64 p-8">
        <header className="mb-10">
          <h2 className="text-3xl font-bold mb-1">Welcome back{username ? `, @${username}` : ""}!</h2>
          <p className="text-white/60">Here's your on-chain financial overview.</p>
        </header>
        
        {activeTab === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* --- STYLE: Refined stat cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <Card key={index} className="bg-white/5 border border-white/10 shadow-lg shadow-black/20 rounded-xl">
                  <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-white/60">{stat.title}</p>
                        <stat.icon className={`w-5 h-5 ${stat.positive ? "text-green-400" : "text-red-400"}`} />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{stat.amount}</p>
                        <span className={`text-sm font-medium ${stat.positive ? "text-green-400" : "text-red-400"}`}>{stat.change}</span>
                      </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* This would be where your list of active bills goes */}
            <BillDashboard />
          </motion.div>
        )}
        {activeTab === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8">
            <XMTPBillSplitting />
          </motion.div>
        )}
        {/* Placeholder content for other tabs */}
        {[2,3,4].includes(activeTab) && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center h-96 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-white/60">{TABS[activeTab].label} - Coming Soon</p>
            </motion.div>
        )}
      </main>
    </div>
  );
}