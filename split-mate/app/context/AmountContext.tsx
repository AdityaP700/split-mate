// context/AmountContext.tsx
"use client";
import { createContext, useState, useContext, ReactNode } from "react";

type AmountContextType = {
  amount: number | undefined;
  setAmount: (value: number | undefined) => void;
};

const AmountContext = createContext<AmountContextType | undefined>(undefined);

export const AmountProvider = ({ children }: { children: ReactNode }) => {
  const [amount, setAmount] = useState<number | undefined>();

  return (
    <AmountContext.Provider value={{ amount, setAmount }}>
      {children}
    </AmountContext.Provider>
  );
};

export const useAmount = () => {
  const context = useContext(AmountContext);
  if (!context) {
    throw new Error("useAmount must be used within an AmountProvider");
  }
  return context;
};
