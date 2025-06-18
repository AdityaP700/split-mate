"use client";

import Link from "next/link";
import { Github, Twitter, MessageSquare } from "lucide-react";
import { ChromeGrid } from "@/components/ui/chrome-grid";

const footerLinks = {
  Product: [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "FAQ", href: "#faq" },
  ],
  Support: [
    { name: "Help Center", href: "#" },
    { name: "Community Forum", href: "#" },
    { name: "Documentation", href: "#" },
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Brand", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ]
};

const socialLinks = [
    { name: "GitHub", icon: Github, url: "https://github.com" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com" },
    { name: "XMTP", icon: MessageSquare, url: "https://xmtp.org" },
];

export default function InteractiveFooter() {
  const brandColor = "#0553f3";

  return (
    <footer className="relative w-full bg-[#030815] overflow-hidden">
        <ChromeGrid />
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
                     <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: brandColor }}>
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">SplitMate</h3>
                    </Link>
                    <p className="mt-4 text-sm text-white/60">The future of social payments.</p>
                    <div className="flex items-center gap-4 mt-6">
                        {socialLinks.map((link) => (
                            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="group w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300">
                                <link.icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>

                {Object.entries(footerLinks).map(([title, links]) => (
                    <div key={title}>
                        <h4 className="font-semibold text-white mb-4 tracking-wide">{title}</h4>
                        <ul className="space-y-3">
                            {links.map((link) => (
                                <li key={link.name}><a href={link.href} className="text-white/60 hover:text-white transition-colors">{link.name}</a></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/40">
                <p>© {new Date().getFullYear()} SplitMate. All rights reserved. A conceptual design.</p>
            </div>
        </div>
    </footer>
  );
}