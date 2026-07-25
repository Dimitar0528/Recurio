"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { type BillingCycle } from "@/lib/validations/enums";

type BudgetContextType = {
  period: BillingCycle;
  setPeriod: React.Dispatch<React.SetStateAction<BillingCycle>>;
  periodMultiplier: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetContextProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<BillingCycle>("Monthly");

  let periodMultiplier;
  switch (period) {
    case "Yearly":
      periodMultiplier = 12;
      break;
    case "Quarterly":
      periodMultiplier = 3;
      break;
    default:
      periodMultiplier = 1;
  }

  return (
    <BudgetContext.Provider
      value={{
        period,
        setPeriod,
        periodMultiplier,
      }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetContextProvider");
  }
  return context;
}
