"use client";

import { BillingCycle, Category } from "@/lib/validations/enums";
import { useTranslations } from "next-intl";
import { createContext, useContext, useState, ReactNode } from "react";

type Preset = {
  name: string;
  price: number;
  period: BillingCycle;
  category: Category;
};

export type CalculationResults = {
  draftMonthly: number;
  hasDraft: boolean;
}

export const PRESETS: Preset[] = [
  {
    name: "Netflix Premium",
    price: 10.99,
    period: "Monthly",
    category: "Entertainment",
  },
  {
    name: "Spotify Premium",
    price: 5.62,
    period: "Monthly",
    category: "Entertainment",
  },
  {
    name: "ChatGPT Plus",
    price: 23,
    period: "Monthly",
    category: "Productivity",
  },
  {
    name: "PlayStation Plus Premium",
    price: 54.99,
    period: "Quarterly",
    category: "Entertainment",
  },
  {
    name: "Adobe Creative Cloud Pro",
    price: 511.39,
    period: "Yearly",
    category: "Software",
  },
  {
    name: "Amazon Prime",
    price: 121.99,
    period: "Yearly",
    category: "Utilities",
  },
  {
    name: "Gym Membership",
    price: 69.99,
    period: "Quarterly",
    category: "Health & Fitness",
  },
  {
    name: "Youtube Premium",
    price: 6.64,
    period: "Monthly",
    category: "Entertainment",
  },
];

type SubscriptionPlannerContextType = {
  hypotheticalName: string;
  setHypotheticalName: (val: string) => void;
  hypotheticalCategory: Category | null;
  setHypotheticalCategory: (val: Category | null) => void;
  hypotheticalPrice: string;
  setHypotheticalPrice: (val: string) => void;
  hypotheticalPeriod: BillingCycle;
  setHypotheticalPeriod: (val: BillingCycle) => void;
  handleLoadPresetToDraft: (preset: Preset) => void;
};

const SubscriptionPlannerContext = createContext<SubscriptionPlannerContextType | undefined>(undefined);

export const getPeriodLabel = (
  period: BillingCycle,
  tLabels: ReturnType<
    typeof useTranslations<"planner_page.period_labels">
  >
) => {

  if (period === "Yearly") return tLabels("yearly");
  if (period === "Quarterly") return tLabels("quarterly");
  return tLabels("monthly");
};

export function SubscriptionPlannerProvider({ children }: { children: ReactNode }) {
  const [hypotheticalName, setHypotheticalName] = useState<string>("");
  const [hypotheticalPrice, setHypotheticalPrice] = useState<string>("");
  const [hypotheticalPeriod, setHypotheticalPeriod] =
    useState<BillingCycle>("Monthly");
  const [hypotheticalCategory, setHypotheticalCategory] =
    useState<Category | null>(null);

  const handleLoadPresetToDraft = (preset: Preset) => {
    setHypotheticalName(preset.name);
    setHypotheticalPrice(preset.price.toString());
    setHypotheticalPeriod(preset.period);
    setHypotheticalCategory(preset.category);
  };
  return (
    <SubscriptionPlannerContext.Provider
      value={{
        hypotheticalName,
        setHypotheticalName,
        hypotheticalCategory,
        setHypotheticalCategory,
        hypotheticalPrice,
        setHypotheticalPrice,
        hypotheticalPeriod,
        setHypotheticalPeriod,
        handleLoadPresetToDraft,
      }}>
      {children}
    </SubscriptionPlannerContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionPlannerContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionPlannerContext",
    );
  }
  return context;
}
