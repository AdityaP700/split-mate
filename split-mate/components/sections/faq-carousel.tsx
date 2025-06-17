"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqCarouselProps {
  faqs: FaqItem[];
}

export default function FaqCarousel({ faqs }: FaqCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % faqs.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + faqs.length) % faqs.length);
  };

  const brandColor = "#0553f3";

  return (
    <section className="w-full bg-[#030815] py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/60">
              Find answers to common questions about our services, process, and technology.
            </p>
          </div>
          <div className="flex justify-center lg:justify-start items-center gap-4">
            <button
              onClick={handlePrev}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="relative h-[22rem] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeIndex}
              className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {[...Array(3)].map((_, i) => {
                const faqIndex = (activeIndex + i) % faqs.length;
                const faq = faqs[faqIndex];
                const isActive = i === 0;

                return (
                  <motion.div
                    key={faq.id}
                    className={cn(
                      "rounded-2xl p-6 transition-all duration-500 ease-in-out flex flex-col justify-between",
                      isActive ? "bg-blue-600 text-white" : "bg-white/5 text-white/70"
                    )}
                    animate={{
                        height: isActive ? "100%" : "90%",
                        opacity: isActive ? 1 : 0.6,
                        y: isActive ? 0 : '5%',
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1]}}
                  >
                    <div>
                        <h3 className={cn("text-xl font-medium", isActive ? "text-white" : "text-white/90")}>{faq.question}</h3>
                        <AnimatePresence>
                        {isActive && (
                            <motion.p 
                                className="mt-4 text-white/80"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto', transition: {delay: 0.2} }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                {faq.answer}
                            </motion.p>
                        )}
                        </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}