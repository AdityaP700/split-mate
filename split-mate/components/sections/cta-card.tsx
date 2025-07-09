"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CtaCardProps {
  ctaButton: ReactNode;
}

export default function CtaCard({ ctaButton }: CtaCardProps) {
  const brandColor = "#0553f3";

  return (
    <motion.div 
      className="h-full w-full rounded-2xl p-8 flex flex-col justify-between"
      style={{
        background: `radial-gradient(circle at 100% 0%, rgba(5, 83, 243, 0.3), transparent 40%), #0d1222`
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
    >
      <div>
        <h3 className="text-2xl font-semibold text-white">
          Ready to Simplify Your Expenses?
        </h3>
        <p className="mt-2 text-white/70">
          Connect your wallet to get started. It's fast, secure, and the first step towards effortless group payments.
        </p>
      </div>
      <div className="mt-8">
        {ctaButton}
      </div>
    </motion.div>
  );
}