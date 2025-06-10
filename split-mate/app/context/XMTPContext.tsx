"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useAccount, useWalletClient } from "wagmi";
import { walletClientToSigner } from "../lib/ethers-adapter";

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
  const { address, isConnected: isWalletConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const isXmtpConnected = !!client;

  const initializeXMTP = async () => {
    if (!walletClient || !address) {
      console.error("Wallet not connected");
      return;
    }

    try {
      console.log("Initializing XMTP client...");
      const signer = walletClientToSigner(walletClient);
      
      // 2. Pass the signer to Client.create
      const xmtpClient = await Client.create(signer, {
        env: (process.env.NEXT_PUBLIC_XMTP_ENV as "dev" | "production") || "dev",
      });
      setClient(xmtpClient);
      console.log("XMTP client initialized successfully!", xmtpClient.address);
    } catch (error) {
      console.error("Failed to initialize XMTP client:", error);
      setClient(null);
    }
  };

  const sendMessage = async (recipientAddress: string, message: string) => {
    if (!client) {
      throw new Error("XMTP client not initialized");
    }

    try {
      // Check if address can receive messages before attempting to send
      const canMessage = await client.canMessage(recipientAddress);
      if (!canMessage) {
        console.warn(`Address ${recipientAddress} is not enabled for XMTP`);
        return false;
      }

      const conversation = await client.conversations.newConversation(recipientAddress);
      await conversation.send(message);
      return true;
    } catch (error) {
      console.error(`Failed to send message to ${recipientAddress}:`, error);
      return false;
    }
  };

  const sendGroupMessage = async (addresses: string[], message: string) => {
    if (!client) {
      throw new Error("XMTP client not initialized");
    }

    // Filter enabled addresses first
    const enabledAddresses = await Promise.all(
      addresses.map(async (address) => ({
        address,
        enabled: await client.canMessage(address)
      }))
    );

    const validAddresses = enabledAddresses
      .filter(({ enabled }) => enabled)
      .map(({ address }) => address);

    if (validAddresses.length === 0) {
      console.warn('No recipients are enabled for XMTP messaging');
      return [];
    }

    // Send messages only to enabled addresses
    const results = await Promise.allSettled(
      validAddresses.map(address => sendMessage(address, message))
    );

    return results;
  };

   useEffect(() => {
    if (isWalletConnected && walletClient && !client) {
      initializeXMTP();
    }
    if (!isWalletConnected && client) {
      setClient(null);
    }
  }, [isWalletConnected, walletClient, client]);

   return (
    <XMTPContext.Provider
      value={{
        client,
        isConnected: isXmtpConnected,
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