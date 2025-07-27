"use client";

import { motion } from "framer-motion";
import { useDashboard } from "@/app/dashboard/layout";

export default function SettingsPage() {
  const { isLoading } = useDashboard();

  if (isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center h-96 bg-white/5 border border-white/10 rounded-xl"
    >
      <p className="text-white/60">Settings - Coming Soon</p>
    </motion.div>
  );
}
