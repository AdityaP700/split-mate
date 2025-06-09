"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useAccount, useWalletClient } from "wagmi";

type XMTPContextType = {
  client: Client | null;
  isConnected: boolean;
  initializeXMTP: () => Promise<void>;
  sendMessage: (recipientAddress: string, message: string) => Promise<void>;
  sendGroupMessage: (addresses: string[], message: string) => Promise<void>;
};

const XMTPContext = createContext<XMTPContextType | undefined>(undefined);

export const XMTPProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const initializeXMTP = async () => {
    if (!walletClient || !address) {
      console.error("Wallet not connected");
      return;
    }

    try {
      // Get the signer from the walletClient for XMTP
      // @ts-expect-error: getSigner may not be typed on all wagmi versions
      const signer = await walletClient.getSigner?.() ?? walletClient;
      const xmtpClient = await Client.create(signer, {
        env: process.env.NEXT_PUBLIC_XMTP_ENV as "dev" | "production" || "dev"
      });
      setClient(xmtpClient);
      setIsConnected(true);
      console.log("XMTP client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize XMTP:", error);
    }
  };

  const sendMessage = async (recipientAddress: string, message: string) => {
    if (!client) {
      throw new Error("XMTP client not initialized");
    }

    try {
      const canMessage = await client.canMessage(recipientAddress);
      if (!canMessage) {
        throw new Error(`Cannot message ${recipientAddress} - they may not be on XMTP`);
      }

      const conversation = await client.conversations.newConversation(recipientAddress);
      await conversation.send(message);
      console.log(`Message sent to ${recipientAddress}`);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  const sendGroupMessage = async (addresses: string[], message: string) => {
    if (!client) {
      throw new Error("XMTP client not initialized");
    }

    const promises = addresses.map(async (address) => {
      try {
        await sendMessage(address, message);
      } catch (error) {
        console.error(`Failed to send message to ${address}:`, error);
      }
    });

    await Promise.allSettled(promises);
  };

  useEffect(() => {
    if (address && walletClient && !client) {
      initializeXMTP();
    }
  }, [address, walletClient]);

  return (
    <XMTPContext.Provider
      value={{
        client,
        isConnected,
        initializeXMTP,
        sendMessage,
        sendGroupMessage,
      }}
    >
      {children}
    </XMTPContext.Provider>
  );
};

export const useXMTP = () => {
  const context = useContext(XMTPContext);
  if (!context) {
    throw new Error("useXMTP must be used within an XMTPProvider");
  }
  return context;
};