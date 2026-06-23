"use client";

import { PriceHistory } from "@/lib/validations/schemas";
import { createContext, useContext } from "react";

const PriceHistoryContext = createContext<PriceHistory | null>(null);

export function PriceHistoryProvider({
  value,
  children,
}: {
  value: PriceHistory;
  children: React.ReactNode;
}) {
  return (
    <PriceHistoryContext.Provider value={value}>
      {children}
    </PriceHistoryContext.Provider>
  );
}

export function usePriceHistory() {
  const context = useContext(PriceHistoryContext);

  if (!context) {
    throw new Error("Missing PriceHistoryProvider");
  }

  return context;
}
