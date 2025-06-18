"use client";
import { ConnectWallet, Wallet, WalletDropdown } from "@coinbase/onchainkit/wallet";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useAccount, useDisconnect } from 'wagmi';
import ProfileModal from "./components/ProfileModal";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Home, Rocket, User, LogOut, ArrowRight } from "lucide-react";
import HeroSection from "@/components/ui/hero-section";
import HowItWorks from "@/components/sections/how-it-works";
import FeaturesTimeline from "@/components/sections/features-timeline";
import { splitmateTimelineData } from "@/components/sections/splitmate-features.tsx";
import AnimatedShapesBackground from "@/components/sections/animated-shapes-background";
import { BentoGridItem } from "@/components/ui/bentogriditem";
import { splitmateBentoData } from "@/components/sections/bento-data.tsx";
import FaqCarousel from "@/components/sections/faq-carousel";
import { faqData } from "@/components/sections/faq-data";
import CtaCard from "@/components/sections/cta-card";

// --- CHANGE 1: Import our new InteractiveFooter ---
import InteractiveFooter from "@/components/sections/interactive-footer";

export default function App() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { disconnect } = useDisconnect();

  // All effects and handlers remain the same...
  useEffect(() => { if (isConnected && address) { axios.get(`/api/profile/${address}`).then(res => { toast.success(`Welcome back, @${res.data.username}!`); }).catch(err => { if (err.response?.status === 404) { toast.info("Welcome! Let's create your profile to get started."); setShowProfileModal(true); } else { toast.error("Could not verify your profile. Please try again."); } }); } }, [isConnected, address]);
  const handleProfileCreatedAndClose = () => { setShowProfileModal(false); toast.success("Profile created! Redirecting you to the app..."); setTimeout(() => { router.push('/splitamount'); }, 2000); };

  const navItems = [{ name: "Home", link: "/", icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" /> }, { name: "How It Works", link: "#how-it-works", icon: <Rocket className="h-4 w-4 text-neutral-500 dark:text-white" /> },];
  if (isConnected) { navItems.push({ name: "Profile", link: "#", icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" /> }); }

  const navActionItem = isConnected ? (<button onClick={() => disconnect()} className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-red-500 dark:text-red-400 px-4 py-2 rounded-full flex items-center gap-2"> <LogOut className="h-4 w-4" /> 
  <span>Disconnect</span> </button>) : (<Wallet> 
    <ConnectWallet>
      <button
       className="border text-sm font-medium relative
        border-neutral-200 dark:border-white/[0.2]
         text-black dark:text-white px-4 py-2 rounded-full"><span>Connect Wallet</span></button></ConnectWallet> <WalletDropdown /> </Wallet>);
  const getStartedButton = isConnected ? (
    <button
      onClick={() => router.push('/splitamount')}
      className="group flex items-center justify-center gap-2 rounded-full bg-[#0553f3] px-6 py-3 text-white transition-all hover:bg-[#0348d4] focus:outline-none"
    >
      <span className="text-sm font-medium">Launch Dashboard</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  ) : (
    <Wallet>
      <ConnectWallet>
        <button
          className="group flex items-center justify-center gap-2 rounded-full bg-[#0553f3] px-6 py-3 text-white transition-all hover:bg-[#0348d4] focus:outline-none"
        >
          <span className="text-sm font-medium">Connect Wallet to Start</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </ConnectWallet>
      <WalletDropdown />
    </Wallet>
  );

  return (
    <div className="relative min-h-screen bg-[#030815] text-white">
      <AnimatedShapesBackground />
      <FloatingNav navItems={navItems} actionItem={navActionItem} />
      <ProfileModal isOpen={showProfileModal} onClose={handleProfileCreatedAndClose} />
      <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick theme="colored" className="mt-16" />

      <main className="flex flex-col items-center justify-center">
        <div className="w-full space-y-24 md:space-y-32">
          <HeroSection ctaButton={getStartedButton} />
          <HowItWorks />
          <section id="use-cases" className="w-full max-w-7xl mx-auto px-4">
            <div className="text-center"><h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white">Powerful Features, Endless Possibilities</h2><p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">From daily expenses to big group trips, SplitMate handles it all with on-chain precision.</p></div>
            <div className="mt-16 grid gap-4">
              {/* Top 3 items, each 1/3 width */}
              <div className="grid grid-cols-3 gap-4">
                {splitmateBentoData.slice(0, 3).map((item, i) => (
                  <BentoGridItem key={i} {...item} />
                ))}
              </div>

              {/* Bottom 2 items, each 1/2 width */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {splitmateBentoData.slice(3, 5).map((item, i) => (
                  <BentoGridItem key={i + 3} {...item} />
                ))}
              </div>
            </div>
          </section>
          <section id="features" className="w-full pb-12">
            <div className="container mx-auto text-center px-4"><h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white">The Tech Behind the Split</h2><p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">SplitMate is powered by a stack of robust, decentralized technologies.</p></div>
            <div className="relative w-full h-[80vh] mt-16"><FeaturesTimeline timelineData={splitmateTimelineData} /></div>
          </section>
          <section id="faq" className="w-full max-w-7xl mx-auto px-4 pb-24 sm:pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3"><FaqCarousel faqs={faqData} /></div>
              <div className="lg:col-span-2"><CtaCard ctaButton={getStartedButton} /></div>
            </div>
          </section>
        </div>
      </main>

      {/* --- CHANGE 2: Replace the old Footer with our new InteractiveFooter --- */}
      <InteractiveFooter />
    </div>
  );
}