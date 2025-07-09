"use client";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-8 h-8 text-[#0070f3]" />
        <h1 className="text-3xl font-bold text-[#0070f3]">Contact</h1>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-[#00d4aa]">Development Team:</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
        <li><b>Aditya Pattanayak</b> (Full Stack Developer) - XMTP Messaging, split function integration, and core functionalities</li>
        <li><b>Vidip Ghosh</b> (Full Stack Developer) - Coinbase Wallet integration and frontend development</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Technical Support:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        For technical issues, bug reports, or integration questions, please reach out through our support channels. We're committed to helping you get the most out of SplitMate.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Business Inquiries:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        Interested in partnerships, integrations, or business opportunities? We'd love to hear from you.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Feedback:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        Your feedback helps us improve SplitMate. Share your thoughts, suggestions, and feature requests - we read every message and use your input to guide our development roadmap.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Contributing:</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        SplitMate is open to community contributions. Check our GitHub repository for contribution guidelines and current development needs.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#00d4aa]">Response Time:</h2>
      <p className="text-gray-700 dark:text-gray-200">
        We typically respond to all inquiries within 24-48 hours during business days.
      </p>
    </main>
  );
}