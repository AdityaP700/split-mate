"use client";


import { XMTPProvider } from "@/app/context/XMTPContext";
import React from "react";

export default function XmtpClientProvider({ children }: { children: React.ReactNode }) {

  return (
    <XMTPProvider>
      {children}
    </XMTPProvider>
  );
}