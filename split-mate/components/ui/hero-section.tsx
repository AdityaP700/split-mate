"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Renamed to HeroSection and accepts a CTA button as a prop
export default function HeroSection({ ctaButton }: { ctaButton: React.ReactNode }) {
  // Your brand color
  const brandColor = "#0553f3";
  const brandColorRgb = "5, 83, 243";

  return (
    <section
      className="relative w-full overflow-hidden bg-[#030815] pb-10 pt-12 font-light text-white antialiased md:pb-16"
      style={{
        background: "linear-gradient(135deg, #02040c 0%, #04122d 100%)",
      }}
    >
      {/* Background Glows using your brand color */}
      <div
        className="absolute right-0 top-0 h-1/2 w-1/2"
        style={{
          background: `radial-gradient(circle at 70% 30%, rgba(${brandColorRgb}, 0.15) 0%, rgba(13, 10, 25, 0) 60%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-1/2 w-1/2"
        style={{
          background: `radial-gradient(circle at 30% 70%, rgba(${brandColorRgb}, 0.1) 0%, rgba(13, 10, 25, 0) 50%)`,
        }}
      />

      <div className="container relative z-10 mx-auto max-w-2xl px-4 text-center md:max-w-4xl md:px-6 lg:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge text updated for SplitMate */}
          <span
            className="mb-6 inline-block rounded-full border px-3 py-1 text-xs"
            style={{ borderColor: `rgba(${brandColorRgb}, 0.3)`, color: brandColor }}
          >
            SEAMLESS PAYMENTS WITH XMTP & BASE
          </span>
          {/* Headline updated for SplitMate */}
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-light tracking-tighter md:text-5xl lg:text-7xl">
            Split Expenses Instantly on the{" "}
            <span style={{ color: brandColor }}>Base Blockchain</span>
          </h1>
          {/* Description updated for SplitMate */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl">
            SplitMate integrates with your group chats to calculate shared expenses and facilitate instant, secure crypto payments.
          </p>

          {/* Buttons Section */}
          <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* The dynamic CTA button is rendered here */}
            {ctaButton}
            
            <a
              href="#features"
              className="flex w-full items-center justify-center gap-2 text-white/70 transition-colors hover:text-white sm:w-auto"
            >
              <span>Learn how it works</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Visuals Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          {/* Replaced Earth with a more abstract network graphic */}
          <div className="relative flex w-full h-40 md:h-64 overflow-hidden">
  <Image
    src="/images/istockphoto-1405728317-612x612.jpg"
    alt="Abstract network graphic"
    fill
    className="object-center object-cover opacity-20 -z-10"
    priority
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>

          {/* Replaced dashboard with a generic, sleek UI */}
          <div className="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-t-lg" style={{ boxShadow: `0 0 80px -10px rgba(${brandColorRgb}, 0.3)` }}>
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
              alt="SplitMate Dashboard Preview"
              width={1920}
              height={1080}
              className="h-auto w-full rounded-t-lg border-t border-x border-white/10"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}