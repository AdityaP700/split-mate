// src/components/BillNotificationListener.tsx
"use client";

import { useEffect } from "react";
import { useXMTP } from "../context/XMTPContext";
import { ToastContainer, toast } from "react-toastify";

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
        toast.info(`New message from ${message.senderAddress}`, {
          position: "top-right",
          autoClose: 3000,
        });
        console.log(`XMTP: New message received from ${message.senderAddress}`);

        try {
          const payload = JSON.parse(message.content);

          if (payload.type === "splitmate_bill_request") {
            console.log("✅ It's a SplitMate bill request!", payload);

            
            const alertMessage = `New Bill Request!
From: ${message.senderAddress.slice(0, 6)}...${message.senderAddress.slice(-4)}
Description: ${payload.description}
Your Share: $${payload.yourShare}
Pay to: ${payload.payToAddress.slice(0, 6)}...`;

            window.alert(alertMessage);
            alert(alertMessage);

            toast.success(alertMessage, {
              position: "top-right",
              autoClose: 3000,
            });
            // toast.success(`New bill request: ${payload.description}`);
          }
        } catch (error) {
          // This just means the message wasn't a JSON object we care about.
          // It's safe to ignore.
          console.log(
            "   (Ignoring a non-JSON or non-SplitMate message)",
            error
          );
        }
      }
    };

    listenForMessages();
  }, [client, isConnected]); 
  return <ToastContainer />;
};

export default BillNotificationListener;
