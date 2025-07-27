"use client";

import XMTPBillSplitting from "@/components/XMTPBill";
import { motion } from "framer-motion";
import { useDashboard } from "@/app/dashboard/layout";

export default function StartSplitPage() {
  const { isLoading } = useDashboard();

  if (isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8"
    >
      <XMTPBillSplitting />
    </motion.div>
  );
}
