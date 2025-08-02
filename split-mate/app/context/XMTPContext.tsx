"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { walletClientToSigner } from "../lib/ethers-adapter";

type XMTPContextType = {
client: any | null;
  isConnected: boolean;
  isXmtpConnected: boolean;
  initializeXMTP: () => Promise<void>;
  isInitializing: boolean;
  sendMessage: (recipientAddress: string, message: string) => Promise<boolean>;
  sendGroupMessage: (
    addresses: string[],
    message: string
  ) => Promise<PromiseSettledResult<boolean>[]>;
  initError: string | null;
};


const XMTPContext = createContext<XMTPContextType | undefined>(undefined);

export const XMTPProvider = ({ children }: { children: ReactNode }) => {
const [client, setClient] = useState<any | null>(null);
  const { address, isConnected: isWalletConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [lastWalletAddress, setLastWalletAddress] = useState<string | null>(null);
  const isXmtpConnected = !!client;
  const [initError, setInitError] = useState<string | null>(null);
  
 // REMOVE this:
// import { Client } from "@xmtp/xmtp-js";

const initializeXMTP = async () => {
  if (!walletClient || !address || isInitializing) return;
  setIsInitializing(true);
  setInitError(null);

  try {
    if (client && lastWalletAddress === address) return;

    const { Client } = await import("@xmtp/xmtp-js");
    const signer = walletClientToSigner(walletClient);
    const xmtpClient = await Client.create(signer, {
      env: (process.env.NEXT_PUBLIC_XMTP_ENV as "dev" | "production") || "dev",
    });

    setClient(xmtpClient);
    setIsConnected(true);
    setLastWalletAddress(address);
    setInitError(null);
    console.log("XMTP client initialized successfully!", xmtpClient.address);
  } catch (error: any) {
    setClient(null);
    setIsConnected(false);
    setInitError(error?.message || "Failed to initialize XMTP client");
    console.error("Failed to initialize XMTP client:", error);
  } finally {
    setIsInitializing(false);
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
    if (isWalletConnected && walletClient) {
      initializeXMTP();
    } else if (!isWalletConnected && client) {
      setClient(null);
      setIsConnected(false);
      setLastWalletAddress(null);
    }
    // Re-initialize if wallet address changes
    if (lastWalletAddress && address && lastWalletAddress !== address) {
      setClient(null);
      setIsConnected(false);
      setLastWalletAddress(null);
      initializeXMTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWalletConnected, walletClient, address]);

  return (
    <XMTPContext.Provider
      value={{
        client,
        isConnected,
        isXmtpConnected,
        initializeXMTP,
        sendMessage,
        sendGroupMessage,
        isInitializing,
        initError,  
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