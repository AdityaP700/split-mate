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
import { BentoGrid } from "@/components/ui/bento-grid";
import { splitmateBentoData } from "@/components/sections/bento-data.tsx";
import Footer from "@/components/sections/footer";

// --- CHANGE 1: Import the new FAQ component and its data ---
import FaqCarousel from "@/components/sections/faq-carousel";
import { faqData } from "@/components/sections/faq-data";

export default function App() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { disconnect } = useDisconnect();

  // All effects and handlers remain the same...
  useEffect(() => { if (isConnected && address) { axios.get(`/api/profile/${address}`).then(res => { toast.success(`Welcome back, @${res.data.username}!`); }).catch(err => { if (err.response?.status === 404) { toast.info("Welcome! Let's create your profile to get started."); setShowProfileModal(true); } else { toast.error("Could not verify your profile. Please try again."); } }); } }, [isConnected, address]);
  const handleProfileCreatedAndClose = () => { setShowProfileModal(false); toast.success("Profile created! Redirecting you to the app..."); setTimeout(() => { router.push('/splitamount'); }, 2000); };
  
  const navItems = [ { name: "Home", link: "/", icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" /> }, { name: "How It Works", link: "#how-it-works", icon: <Rocket className="h-4 w-4 text-neutral-500 dark:text-white" /> }, ];
  if (isConnected) { navItems.push({ name: "Profile", link: "#", icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" /> }); }

  const navActionItem = isConnected ? ( <button onClick={() => disconnect()} className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-red-500 dark:text-red-400 px-4 py-2 rounded-full flex items-center gap-2"> <LogOut className="h-4 w-4" /> <span>Disconnect</span> </button> ) : ( <Wallet> <ConnectWallet><button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full"><span>Connect Wallet</span></button></ConnectWallet> <WalletDropdown /> </Wallet> );
  const heroCtaButton = isConnected ? ( <button onClick={() => router.push('/splitamount')} className="neumorphic-button group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-white/10 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:border-[#0553f3]/30 sm:w-auto" style={{ background: "#0553f3" }}> <span>Launch Dashboard</span> <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /> </button> ) : ( <Wallet> <ConnectWallet><button className="neumorphic-button group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-white/10 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:border-[#0553f3]/30 sm:w-auto" style={{ background: "#0553f3" }}><span>Connect Wallet to Start</span><ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></button></ConnectWallet> <WalletDropdown /> </Wallet> );

  return (
    <div className="relative min-h-screen bg-[#030815] text-white">
      <AnimatedShapesBackground />
      <FloatingNav navItems={navItems} actionItem={navActionItem} />
      <ProfileModal isOpen={showProfileModal} onClose={handleProfileCreatedAndClose} />
      <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick theme="colored" className="mt-16" />

      {/* --- CHANGE 2: Add spacing to main and insert the FAQ section before the Footer --- */}
      <main className="flex flex-col items-center justify-center">
        <div className="space-y-24 md:space-y-32">
            <HeroSection ctaButton={heroCtaButton} />
            <HowItWorks />

            <section className="w-full max-w-7xl mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white">
                        Powerful Features, Endless Possibilities
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">
                        From daily expenses to big group trips, SplitMate handles it all with on-chain precision.
                    </p>
                </div>
                <div className="mt-16">
                    <BentoGrid items={splitmateBentoData} />
                </div>
            </section>

            <section id="features" className="w-full pb-12">
            <div className="container mx-auto text-center px-4">
                <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white">
                The Tech Behind the Split
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">
                SplitMate is powered by a stack of robust, decentralized technologies.
                Click a node below to explore how they connect.
                </p>
            </div>
            <div className="relative w-full h-[80vh] mt-16">
                <FeaturesTimeline timelineData={splitmateTimelineData} />
            </div>
            </section>
        </div>

        {/* The Final CTA / FAQ Section */}
        <FaqCarousel faqs={faqData} />

      </main>

      <Footer />
    </div>
  );
}