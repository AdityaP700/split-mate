"use client";

import { motion } from "framer-motion";
import History from "@/components/history";
import { useDashboard } from "@/app/dashboard/layout";

export default function HistoryPage() {
  const { dashboardData, isLoading } = useDashboard();

  if (isLoading || !dashboardData) {
    return <div className="text-center text-white/60">Loading transaction history...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <History history={dashboardData.history ?? []} />
    </motion.div>
  );
}
