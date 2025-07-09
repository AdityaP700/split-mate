import { cn } from "@/lib/utils";
import { BentoItem } from "./bento-grid";
import { motion } from "framer-motion";

export function BentoGridItem(item: BentoItem) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-blue-500/30",
        item.colSpan ? `md:col-span-${item.colSpan}` : "md:col-span-1",
        item.hasPersistentHover && "shadow-xl -translate-y-1 shadow-blue-500/10"
      )}
    >
      {/* Glow ring effect */}
      <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl" />
      </div>

      {/* Optional image / background layer */}
      {item.background && (
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          {item.background}
        </div>
      )}

      <div className="relative z-10 flex flex-col space-y-3">
        {/* Top Icon + Status */}
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-all group-hover:bg-blue-500/20">
            {item.icon}
          </div>
          {item.status && (
            <span className="rounded-lg bg-white/10 px-2 py-1 text-xs text-gray-300 backdrop-blur-sm">
              {item.status}
            </span>
          )}
        </div>

        {/* Title, Meta, Description */}
        <div className="space-y-2">
          <h3 className="text-[15px] font-medium tracking-tight text-gray-100">
            {item.title}
            {item.meta && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                {item.meta}
              </span>
            )}
          </h3>
          <p className="text-sm font-[425] leading-snug text-gray-300">
            {item.description}
          </p>
        </div>

        {/* Tags + CTA */}
        <div className="mt-2 flex min-h-[24px] items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            {item.tags?.map((tag, i) => (
              <span
                key={i}
                className="rounded-md bg-white/5 px-2 py-1 backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
          <span className="opacity-0 transition-opacity group-hover:opacity-100 text-xs text-blue-400">
            {item.cta || "Explore →"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
