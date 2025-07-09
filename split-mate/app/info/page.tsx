"use client";

import { useState } from "react";
import Help from "@/components/info/help";
import Community from "@/components/info/community";
import Documentation from "@/components/info/Documentation";
import AboutUs from "@/components/info/AboutUs";
import Contact from "@/components/info/contact";
import Brand from "@/components/info/brand";
import InteractiveFooter from "@/components/sections/interactive-footer";

const tabs = [
  { label: "Help Center", component: Help },
  { label: "Community Forum", component: Community },
  { label: "Documentation", component: Documentation },
  { label: "About Us", component: AboutUs },
  { label: "Contact", component: Contact },
  { label: "Brand", component: Brand },
];

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState("Help Center");

  const ActiveComponent = tabs.find(tab => tab.label === activeTab)?.component || Help;

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-black/30 border-r border-white/10 sticky top-0 h-screen p-6 hidden md:block">
          <h2 className="text-xl font-semibold mb-6">Support & Info</h2>
          <ul className="space-y-4">
            {tabs.map(({ label }) => (
              <li key={label}>
                <button
                  onClick={() => setActiveTab(label)}
                  className={`text-left w-full text-sm px-2 py-1 rounded transition ${
                    activeTab === label ? "bg-blue-600 text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <ActiveComponent />
          </div>
        </main>
      </div>

      {/* Footer */}
      <InteractiveFooter />
    </div>
  );
}
