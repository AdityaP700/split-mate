"use client";

import { Github, Twitter, MessageSquare } from "lucide-react";
import Link from "next/link";

const socialLinks = [
    { name: "GitHub", icon: Github, url: "https://github.com" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com" },
    { name: "XMTP", icon: MessageSquare, url: "https://xmtp.org" },
];

export default function Footer() {
    const brandColor = "#0553f3";

    return (
        <footer className="w-full bg-[#030815] border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="mb-8 md:mb-0">
                        <Link href="/" className="flex items-center justify-center md:justify-start gap-2">
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: brandColor }}>
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white">SplitMate</h3>
                        </Link>
                        <p className="mt-2 text-sm text-white/60 max-w-xs">
                            The elegant way to split expenses with friends, powered by blockchain.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300"
                            >
                                <span className="sr-only">{link.name}</span>
                                <link.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
                    <p>© {new Date().getFullYear()} SplitMate. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}