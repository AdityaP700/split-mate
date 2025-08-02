// app/layout.tsx

import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { AmountProvider } from "./context/AmountContext";
import dynamic from "next/dynamic";

const XmtpProviderWrapper = dynamic(
  () => import('@/app/context/XMTPProviderClient'), 
  { 
    ssr: false,
    loading: () => <div className="min-h-screen bg-[#030815]"></div> 
  }
);

export const metadata: Metadata = {
  title: "SplitMate - The Future of Social Payments",
  description: "Split expenses instantly with friends using crypto. SplitMate integrates with your group chats to facilitate secure payments on the Base blockchain via XMTP.",
  icons: {
    icon: "/images/Splitmate-logo.png", // path relative to public/
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <AmountProvider>
            {/* --- CHANGE 2: Use the wrapper component here --- */}
            <XmtpProviderWrapper>
              {children}
            </XmtpProviderWrapper>
          </AmountProvider>
        </Providers>
      </body>
    </html>
  );
}