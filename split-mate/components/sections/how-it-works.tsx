"use client";

import { motion } from "framer-motion";
import { MessageSquare, ListChecks, ArrowRight, Zap } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "1. Chat & Connect",
    description: "Inside any XMTP group chat, connect your wallet. You're now ready to split expenses with the group.",
  },
  {
    icon: ListChecks,
    title: "2. Request & Split",
    description: "Simply type a command like '/split $50 for dinner'. SplitMate calculates everyone's equal share automatically.",
  },
  {
    icon: Zap,
    title: "3. Approve & Settle",
    description: "Group members receive a prompt to approve the transaction. Once approved, payments are settled instantly on the Base blockchain.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function HowItWorks() {
  const brandColor = "#0553f3";

  return (
    <section id="how-it-works" className="w-full py-24 sm:py-15 bg-[#030815] relative">
       {/* Subtle background glow */}
       <div
        className="absolute inset-x-0 top-0 h-1/4 w-full"
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(5, 83, 243, 0.1) 0%, rgba(3, 8, 21, 0) 40%)`,
        }}
      />
      <div className="container mx-auto text-center px-4 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
        >
            <span className="mb-4 inline-block rounded-full border border-[#0553f3]/30 px-3 py-1 text-xs" style={{ color: brandColor }}>
                EFFORTLESSLY SIMPLE
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white">
                Split Bills in 3 Easy Steps
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">
                From conversation to crypto settlement in under a minute.
            </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="flex flex-col items-center text-center"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
                <div className="relative flex items-center justify-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/10 bg-white/5 backdrop-blur-sm">
                        <step.icon className="h-8 w-8 text-white" style={{color: brandColor}} />
                    </div>
                    {/* Arrow connecting the steps, not shown on the last item */}
                    {i < steps.length - 1 && (
                        <ArrowRight className="absolute left-full top-1/2 -translate-y-1/2 ml-4 md:ml-8 h-8 w-8 text-white/20 hidden md:block" />
                    )}
                </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-white/60 max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}