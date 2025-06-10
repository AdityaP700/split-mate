// src/components/BillNotificationListener.tsx
"use client";

import { useEffect } from "react";
import { useXMTP } from "../context/XMTPContext";

// This is where you might use a library to show pop-up notifications
// For now, we will just use console.log and window.alert
// import toast from 'react-hot-toast'; 

const BillNotificationListener = () => {
  const { client, isConnected } = useXMTP();

  useEffect(() => {
    // Only start listening if the XMTP client is connected
    if (!isConnected || !client) {
      return;
    }

    const listenForMessages = async () => {
      console.log("XMTP: Now listening for incoming bill split messages...");

      // Stream all new messages from the network
      for await (const message of await client.conversations.streamAllMessages()) {
        // Ignore messages sent by you
        if (message.senderAddress === client.address) {
          continue;
        }

        console.log(`XMTP: New message received from ${message.senderAddress}`);

        // Try to parse the message content as JSON
        try {
          const payload = JSON.parse(message.content);

          // IMPORTANT: Check if it's a message our app understands
          if (payload.type === "splitmate_bill_request") {
            console.log("✅ It's a SplitMate bill request!", payload);

            // This is where you would trigger a real UI notification
            // For our test, a simple alert is perfect!
            const alertMessage = 
`New Bill Request!
From: ${message.senderAddress.slice(0,6)}...${message.senderAddress.slice(-4)}
Description: ${payload.description}
Your Share: $${payload.yourShare}
Pay to: ${payload.payToAddress.slice(0,6)}...`;

            window.alert(alertMessage);
            // toast.success(`New bill request: ${payload.description}`);
          }
        } catch (error) {
          // This just means the message wasn't a JSON object we care about.
          // It's safe to ignore.
          console.log("   (Ignoring a non-JSON or non-SplitMate message)",error);
        }
      }
    };

    listenForMessages();

  }, [client, isConnected]); // Re-run this effect if the client or connection status changes

  // This component doesn't render any visible HTML. It just runs in the background.
  return null;
};

export default BillNotificationListener;