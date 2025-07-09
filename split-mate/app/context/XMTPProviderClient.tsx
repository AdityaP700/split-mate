"use client";

// This component's sole purpose is to be a client-side boundary.
// It is the ONLY place (outside of the context itself) that should import XMTPProvider.

import { XMTPProvider } from "@/app/context/XMTPContext"; // Adjust path if needed
import React from "react";

export default function XmtpClientProvider({ children }: { children: React.ReactNode }) {
  // Now, the "dangerous" provider is only ever rendered inside a component
  // that is explicitly marked as "use client".
  return (
    <XMTPProvider>
      {children}
    </XMTPProvider>
  );
}