"use client";

import { cn } from "@/lib/utils";

// The BentoItem interface remains the same
export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

interface BentoGridProps {
    items: BentoItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
    const brandColor = "#0553f3"; // Our brand color

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={cn(
                        "group relative p-4 rounded-xl overflow-hidden transition-all duration-300",
                        // --- STYLE CHANGE: Themed background and border ---
                        "border border-white/10 bg-white/5",
                        "hover:shadow-2xl dark:hover:shadow-blue-500/20",
                        "hover:-translate-y-1 will-change-transform",
                        item.colSpan ? "md:col-span-" + item.colSpan : "md:col-span-1",
                        {
                            "shadow-xl -translate-y-1 shadow-blue-500/10": item.hasPersistentHover,
                        }
                    )}
                >
                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300", { "opacity-100": item.hasPersistentHover })}>
                         {/* Subtle grid background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,83,243,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(5,83,243,0.08)_1px,transparent_1px)] bg-[length:6px_6px]" />
                    </div>

                    <div className="relative flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                             {/* --- STYLE CHANGE: Themed icon background --- */}
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 group-hover:bg-blue-500/20 transition-all duration-300">
                                {item.icon}
                            </div>
                            {item.status && <span className="text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm bg-white/10 text-gray-300">{item.status}</span>}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium text-gray-100 tracking-tight text-[15px]">
                                {item.title}
                                {item.meta && <span className="ml-2 text-xs text-gray-400 font-normal">{item.meta}</span>}
                            </h3>
                            <p className="text-sm text-gray-300 leading-snug font-[425]">
                                {item.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-2 min-h-[24px]">
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                {item.tags?.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 rounded-md bg-white/5 backdrop-blur-sm">#{tag}</span>
                                ))}
                            </div>
                            <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.cta || "Explore →"}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}