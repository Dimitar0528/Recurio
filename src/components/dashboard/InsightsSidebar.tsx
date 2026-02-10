"use client";

import {  useState } from "react";
import { priceFormatter } from "@/lib/utils";
import { Subscription } from "@/lib/validations/form";
import { Download, PieChart, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import type { BillingCycle } from "@/lib/validations/enum";
type InsightsSidebarProps = {
  data: Subscription[];
}

export default function InsightsSidebar({ data }: InsightsSidebarProps) {
  const [viewMode, setViewMode] = useState<BillingCycle>("Monthly");

  const aggregatedByCategory = data.filter(subscription => subscription.status === "Active").reduce<Record<string, number>>(
      (acc, { price, billingCycle, category }) => {
        let normalizedAmount = price;

        if (viewMode === "Monthly") {
          normalizedAmount = billingCycle === "Annual" ? price / 12 : price;
        } else {
          normalizedAmount = billingCycle === "Monthly" ? price * 12 : price;
        }

        acc[category] = (acc[category] ?? 0) + normalizedAmount;
        return acc;
      },
      {},
    );
  const totalSpend = Object.values(aggregatedByCategory).reduce(
      (sum, amount) => sum + amount,
      0,
    );
  const categoryItems = Object.entries(aggregatedByCategory).map(([category, amount]) => {
      const percentage =
        totalSpend === 0 ? 0 : Math.round((amount / totalSpend) * 100);

      return {
        label: category,
        value: percentage,
        money: priceFormatter(amount),
      };
    },
  );
  const categoryColors: Record<string, string> = {
    Software: "bg-primary",
    Education: "bg-blue-500",
    Entertainment: "bg-purple-500",
    Utilities: "bg-zinc-500",
    Fitness: "bg-green-500",
    Other: "bg-orange-500",
  };
  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <PieChart size={16} className="text-primary" />
            Category Breakdown
          </h3>

          <div className="flex bg-secondary rounded-xl text-xs font-bold">
            <Button
              onClick={() => setViewMode("Monthly")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === "Monthly"
                  ? "bg-primary/30 shadow text-foreground"
                  : "text-gray-600 dark:text-gray-400 bg-secondary"
              }`}>
              Monthly
            </Button>
            <Button
              onClick={() => setViewMode("Annual")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === "Annual"
                  ? "bg-primary/30 shadow text-foreground"
                  : "text-gray-600 dark:text-gray-400 bg-secondary"
              }`}>
              Annual
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {categoryItems.length > 0 ? (
            categoryItems.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-2 items-baseline">
                  <span className="text-gray-600 dark:text-gray-300 font-bold">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">
                      {item.money}
                    </span>
                    <span className="text-muted-foreground text-[12px]">
                      ({item.value}%)
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      categoryColors[item.label] ?? "bg-muted"
                    } transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm"> No results available.</div>
          )}
        </div>
      </div>

      <div className="bg-foreground text-background rounded-2xl p-6 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-3 opacity-20">
          <ShieldCheck size={40} />
        </div>
        <h3 className="text-sm font-bold mb-2 relative z-10 flex items-center gap-2">
          <Download size={16} />
          Export Audit
        </h3>
        <p className="text-xs text-background/60 mb-6 relative z-10 leading-relaxed">
          Need this for accounting? Export your full recurring history into a
          verified PDF report.
        </p>
        <button className="w-full bg-background text-foreground py-3 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 flex items-center justify-center gap-2 shadow-xl shadow-black/20 cursor-pointer">
          Download Financial Audit
        </button>
      </div>
    </div>
  );
}