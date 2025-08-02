"use client";

import Link from "next/link";
import { Github, X, MessageSquare, ArrowRight, Download } from "lucide-react";
import { ChromeGrid } from "@/components/ui/chrome-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount } from "wagmi";
import { useState } from "react";

const footerLinks = {
  Product: [
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Features", href: "/#features" },
    { name: "Use Cases", href: "/#use-cases" },
    { name: "FAQ", href: "/#faq" },
  ],
   Support: [
  { name: "Help Center", href: "/info" },
  { name: "Community Forum", href: "/info" },
  { name: "Documentation", href: "/info" },
],
Company: [
  { name: "About Us", href: "/info" },
  { name: "Contact", href: "/contact" },
  { name: "Brand", href: "/info" },
],
};

const collaborationLinks = [
  { name: "Contribute on GitHub", icon: Github, url: "https://github.com/AdityaP700/split-mate" },
  { name: "Report Issues", icon: MessageSquare, url: "https://github.com/AdityaP700/split-mate/issues" },
];


export default function InteractiveFooter({
  onLinkClick,
}: {
  onLinkClick?: (label: string) => void;
}) {  const { isConnected } = useAccount();
const [email, setEmail] = useState("");
const [submitted, setSubmitted] = useState(false);

  const getStartedButton = isConnected ? (
    <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
      Launch Dashboard <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  ) : (
    <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
      Connect Wallet <Download className="w-4 h-4 ml-2" />
    </Button>
  );

  return (
    <footer className="relative w-full bg-gradient-to-b from-black via-[#0c0c0c] to-[#0050ff] overflow-hidden pt-24">
      <div className="absolute inset-0 opacity-20">
        <ChromeGrid />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* CTA Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            Ready to start splitting?
          </h2>
          <p className="text-lg text-white/60 mb-8">
            Join SplitMate now and become part of a community simplifying social payments on the blockchain.
          </p>
          {getStartedButton}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-blue-500 rounded-sm"></div>
                <h4 className="text-sm font-medium tracking-wider text-white uppercase">{title}</h4>
              </div>
              <ul className="space-y-3">
               {links.map((link, idx) => {
  if (typeof link === "object" && "href" in link) {
    return (
      <li key={link.name}>
  <Link
    href={link.href}
    className="text-white/80 hover:text-white transition-colors text-sm"
  >
    {link.name}
  </Link>
</li>

    );
  }
})}

              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
            <div>
              <h4 className="font-semibold text-white">Never miss an update</h4>
              <p className="text-sm text-white/60 mt-1">
                Get all the latest news, blog posts and product updates from SplitMate.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
  <Input
    type="email"
    placeholder="example@gmail.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-white/5 border-white/20 placeholder:text-white/40"
  />
  <Button
    className="w-full sm:w-auto bg-white text-black hover:bg-white/90"
    onClick={() => {
      if (email.trim() !== "") {
        setSubmitted(true);
        setEmail(""); // Optionally reset
      }
    }}
  >
    Join
  </Button>
</div>
{submitted && (
  <p className="text-sm text-green-400 mt-2">
    🎉 You're in! Thanks for joining SplitMate.
  </p>
)}

          </div>

          {/* Open Source Collaboration */}
          <div className="text-center mb-8">
            <h4 className="text-lg font-semibold text-white mb-2">Open for Collaboration</h4>
            <p className="text-sm text-white/60 mb-4">
              SplitMate is open source. Join our community and help us build the future of social payments.
            </p>
            <div className="flex justify-center items-center gap-4">
              {collaborationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 text-sm text-white/80 hover:text-white"
                    title={link.name}
                  >
                    <IconComponent className="w-4 h-4" />
                    {link.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer bottom row */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4 pt-8 border-t border-white/10 text-sm text-white/60">
            <p>© {new Date().getFullYear()} SplitMate. A MVP design.</p>
            {/* <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}