"use client";
import { Info } from "lucide-react";

export default function AboutUs() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Info className="w-8 h-8 text-[#0070f3]" />
        <h1 className="text-3xl font-bold text-[#0070f3]">About Us</h1>
      </div>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        SplitMate was created to solve the age-old problem of splitting bills fairly and efficiently. We believe that money shouldn't complicate friendships or group experiences, so we built a seamless solution that combines messaging, calculation, and payment in one simple app.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Our Mission:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        To make bill splitting effortless through innovative blockchain technology and intuitive group messaging. We're eliminating the awkwardness of asking friends to pay you back by enabling instant, transparent crypto payments.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Why We Built This:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        Traditional bill splitting involves complex calculations, multiple payment apps, and endless follow-ups. SplitMate streamlines the entire process into a single group chat experience with automatic equal splitting and instant Base blockchain payments.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Our Technology:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        We leverage cutting-edge technologies including XMTP for decentralized messaging, Base blockchain for fast and affordable transactions, and Coinbase Wallet for secure authentication. Everything is built on Next.js for optimal performance.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Vision:</h2>
      <p className="text-gray-700 dark:text-gray-200">
        We envision a world where splitting expenses is as simple as sending a message. By combining blockchain payments with group messaging, we're creating the future of collaborative spending.
      </p>
    </main>
  );
}