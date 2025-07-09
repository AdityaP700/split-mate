"use client";
import { BadgeCheck } from "lucide-react";

export default function Brand() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <div className="flex items-center gap-3 mb-6">
        <BadgeCheck className="w-8 h-8 text-[#0070f3]" />
        <h1 className="text-3xl font-bold text-[#0070f3]">Brand</h1>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-[#00d4aa]">Brand Identity:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        SplitMate represents simplicity, fairness, and innovation in bill splitting. Our brand embodies the seamless fusion of social interaction and financial technology.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Logo Usage:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        The SplitMate logo features clean, modern typography with a subtle cryptocurrency accent. Use the logo in its original proportions and colors. Do not modify, stretch, or alter the logo design.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Color Palette:</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
        <li><b>Primary:</b> Modern blue (<span className="text-[#0070f3]">#0070f3</span>) representing trust and technology</li>
        <li><b>Secondary:</b> Crypto green (<span className="text-[#00d4aa]">#00d4aa</span>) for payment success states</li>
        <li><b>Accent:</b> Neutral gray (<span className="text-[#666666]">#666666</span>) for supporting text</li>
        <li><b>Background:</b> Clean white (<span className="text-[#ffffff]">#ffffff</span>) for clarity</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Typography:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        We use clean, readable fonts that work well across all devices and screen sizes. Our typography emphasizes clarity and accessibility.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Voice and Tone:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        SplitMate communicates in a friendly, approachable manner. We're helpful without being overly casual, and technical without being intimidating. Our messaging focuses on solving problems and making bill splitting effortless.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Brand Values:</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
        <li>Transparency in all financial transactions</li>
        <li>Simplicity in user experience</li>
        <li>Innovation through blockchain technology</li>
        <li>Fairness in expense sharing</li>
        <li>Community-focused development</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Usage Guidelines:</h2>
      <p className="text-gray-700 dark:text-gray-200">
        When representing SplitMate, maintain consistency with our brand identity. Focus on the benefits of seamless bill splitting and instant crypto payments while highlighting our commitment to user-friendly design.
      </p>
    </main>
  );
}