import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"; // Or your preferred font
import { Providers } from "./providers";
import { AmountProvider } from "./context/AmountContext";
import { XMTPProvider } from "./context/XMTPContext";
export const metadata: Metadata = {
  title: "SplitMate - The Future of Social Payments",
  description: "Split expenses instantly with friends using crypto. SplitMate integrates with your group chats to facilitate secure payments on the Base blockchain via XMTP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background dark">
        <Providers>
          <AmountProvider>
            <XMTPProvider>{children}</XMTPProvider>
          </AmountProvider>
        </Providers>
      </body>
    </html>
  );
}
