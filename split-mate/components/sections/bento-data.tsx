import { BentoItem } from "@/components/ui/bento-grid";
import { Users, ShieldCheck, Pizza, Plane, BarChart } from "lucide-react";

export const splitmateBentoData: BentoItem[] = [
  {
    title: "Splitting Dinner",
    meta: "Most Popular",
    description:
      "Instantly split the bill for food, drinks, and tips right from your group chat. No more awkward math.",
    icon: <Pizza className="w-4 h-4 text-amber-400" />,
    status: "Use Case",
    tags: ["Social", "Dining"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Fair & Transparent",
    description:
      "Every transaction is recorded on-chain. Eliminate disputes with a clear, immutable ledger of who paid what.",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    status: "Benefit",
    tags: ["Trust", "Security"],
    colSpan: 2,
  },
  {
    title: "Group Trip Planning",
    description:
      "Manage shared expenses for flights, hotels, and activities. Settle up at the end of the trip with a single transaction.",
    icon: <Plane className="w-4 h-4 text-sky-400" />,
    status: "Use Case",
    tags: ["Travel", "Planning"],
    colSpan: 2,
  },
  {
    title: "Dive Deeper",
    description:
      "Explore the robust, decentralized technologies that make SplitMate possible.",
    icon: <BarChart className="w-4 h-4 text-purple-400" />,
    status: "Tech",
    tags: ["XMTP", "Base"],
    colSpan: 3,
    cta: "View Timeline →",
  },
  {
    title: "Roommate Utilities",
    description:
      "Automatically split rent, WiFi, and utility bills with your housemates. Get reminders, track dues, and avoid late fees.",
    icon: <Users className="w-4 h-4 text-indigo-400" />,
    status: "Use Case",
    tags: ["Home", "Utilities", "Roommates"],
    colSpan: 3,
  },
];
