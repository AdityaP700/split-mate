"use client";

import { motion } from "framer-motion";
import MyNetwork from "@/components/sections/my-network";
import { useDashboard } from "@/app/dashboard/layout";

export default function MyNetworkPage() {
  const { dashboardData, isLoading } = useDashboard();

  if (isLoading || !dashboardData) {
    return <div className="text-center text-white/60">Loading your network...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <MyNetwork network={dashboardData.network ?? []} />
    </motion.div>
  );
}
