"use client";

import Image from "next/image";
import { motion } from "framer-motion";
// --- CHANGE 1: Import our new scroll animation component ---
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function HeroSection({ ctaButton }: { ctaButton: React.ReactNode }) {
  const brandColor = "#0553f3";
  const brandColorRgb = "5, 83, 243";
  
  // --- CHANGE 2: Extract the title/text content into a variable ---
  const TitleContent = (
      <>
        <span
            className="mb-6 inline-block rounded-full border px-3 py-1 text-xs"
            style={{ borderColor: `rgba(${brandColorRgb}, 0.3)`, color: brandColor }}
        >
            SEAMLESS PAYMENTS WITH XMTP & BASE
        </span>
        <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-light tracking-tighter md:text-5xl lg:text-7xl">
            Split Expenses Instantly on the{" "}
            <span style={{ color: brandColor }}>Base Blockchain</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl">
            SplitMate integrates with your group chats to calculate shared expenses and facilitate instant, secure crypto payments.
        </p>
        <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {ctaButton}
            <a href="#how-it-works" className="flex w-full items-center justify-center gap-2 text-white/70 transition-colors hover:text-white sm:w-auto">
                <span>Learn how it works</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" >
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </a>
        </div>
      </>
  );

  return (
    // The main section now acts as a wrapper for the background and the scroll component
    <section className="relative w-full overflow-hidden bg-[#030815] font-light text-white antialiased">
      {/* Background glows remain the same */}
      <div className="absolute right-0 top-0 h-1/2 w-1/2" style={{ background: `radial-gradient(circle at 70% 30%, rgba(${brandColorRgb}, 0.15) 0%, rgba(13, 10, 25, 0) 60%)` }} />
      <div className="absolute bottom-0 left-0 h-1/2 w-1/2" style={{ background: `radial-gradient(circle at 30% 70%, rgba(${brandColorRgb}, 0.1) 0%, rgba(13, 10, 25, 0) 50%)` }}/>

      {/* --- CHANGE 3: Implement the ContainerScroll component --- */}
      <div className="container mx-auto px-4 md:px-6 lg:max-w-7xl">
        <ContainerScroll titleComponent={TitleContent}>
            {/* The dashboard image is now the 'child' of the scroll container */}
            <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                alt="SplitMate Dashboard Preview"
                height={720}
                width={1400}
                className="mx-auto rounded-2xl object-cover h-full object-left-top"
                draggable={false}
            />
        </ContainerScroll>
      </div>
    </section>
  );
}