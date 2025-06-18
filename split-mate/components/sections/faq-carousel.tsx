"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqData } from "./faq-data"; // Assuming your faq-data is here

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

const descriptionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(faqs[0]?.id ?? null);
  
  // --- PAGINATION LOGIC ---
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // We will show 3 cards at a time
  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  
  const visibleFaqs = faqs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  // --- END PAGINATION LOGIC ---

  return (
    <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white">
                    Frequently Asked Questions
                </h2>
                <p className="mt-2 text-lg text-white/60">
                    Hover over a card to expand.
                </p>
            </div>
        </div>
      
        {/* Container for the cards - NOT scrollable anymore */}
        <div className="flex items-end h-[24rem] gap-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex h-full w-full items-end gap-4"
                >
                    {visibleFaqs.map((faq) => {
                        const isHovered = hoveredId === faq.id;
                        return (
                            <motion.div
                                key={faq.id}
                                layout
                                onMouseEnter={() => setHoveredId(faq.id)}
                                className={cn(
                                    "relative h-full rounded-2xl p-6 cursor-pointer flex-shrink-0",
                                    "flex flex-col justify-between overflow-hidden",
                                    "transition-colors duration-300",
                                    // --- STYLE CHANGE: Apply brand color on hover ---
                                    isHovered ? "bg-[#0553f3]" : "bg-white/5 border border-white/10"
                                )}
                                style={{
                                    width: isHovered ? 'min(60%, 32rem)' : '6rem',
                                }}
                                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                            >
                                <div className="h-full">
                                    {/* --- STYLE CHANGE: Perfect Vertical Text --- */}
                                    <h3 className={cn(
                                        "font-medium text-white/90 transition-all duration-500 ease-in-out",
                                        isHovered
                                            ? 'text-xl'
                                            : 'text-lg [writing-mode:vertical-rl] transform rotate-180 h-full flex items-center'
                                    )}>
                                        {faq.question}
                                    </h3>
                                </div>
                                
                                <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        variants={descriptionVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute bottom-6 left-6 right-6"
                                    >
                                        <p className="text-white/80 text-sm">{faq.answer}</p>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        <div className="flex items-center justify-center gap-6 mt-8">
            <button onClick={handlePrev} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            currentPage === i ? "w-6 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                        )}
                    />
                ))}
            </div>
            <button onClick={handleNext} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowRight className="w-5 h-5 text-white" />
            </button>
        </div>
    </div>
  );
}