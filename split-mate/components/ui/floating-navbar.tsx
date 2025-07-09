"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FloatingNav = ({
  navItems,
  actionItem,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  actionItem?: React.ReactNode;
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  // Set initial state to TRUE so it's visible on page load.
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // For debugging: You can open your browser's developer console to see this.
    // console.log("ScrollY:", current, "Visible:", visible);

    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious()!;

      // If we're at the very top of the page, always show the nav.
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        // Otherwise, if scrolling up, show the nav. If scrolling down, hide it.
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          // Upped the z-index to ensure it's above other elements like react-toastify
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto border dark:border-white/[0.2] border-black/[0.1] rounded-full dark:bg-black/80 bg-white/80 shadow-xl backdrop-blur-sm z-[50000] pr-3 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
          </Link>
        ))}
        
        {actionItem}
      </motion.div>
    </AnimatePresence>
  );
};