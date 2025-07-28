"use client";

import { useDashboard } from "@/app/dashboard/layout";
import { Card, CardContent } from "@/components/ui/card";
import BillDashboard from "@/app/service/BillDashboard";
import { TrendingUp, TrendingDown, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardOverview() {
  const { dashboardData, fetchDashboardData, isLoading, username } = useDashboard();

  if (isLoading || !dashboardData) {
    return (
      <div className="text-center text-white/60">
        Loading your on-chain financial overview...
      </div>
    );
  }

  const statCards = [
    {
      title: "You Are Owed",
      amount: `$${dashboardData.youAreOwed.toFixed(2)}`,
      change: "+12.5%",
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
      change: `$${dashboardData.networkChange>=0? '+': ''}${dashboardData.networkChange}`,
      icon: Users,
      positive: true,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <header className="mb-10">
        <h2 className="text-3xl font-bold mb-1">
          Welcome back{username ? `, @${username}` : ""}!
        </h2>
        <p className="text-white/60">Here's your on-chain financial overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="bg-white/5 border border-white/10 shadow-lg shadow-black/20 rounded-xl"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-white/60">{stat.title}</p>
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
  );
}
