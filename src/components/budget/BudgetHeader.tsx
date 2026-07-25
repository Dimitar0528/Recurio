"use client"

import { useBudget } from "@/context/BudgetContext";
import { cn } from "@/lib/utils";
import { BillingCycle } from "@/lib/validations/enums";

export default function BudgetHeader(){
    const { period, setPeriod } = useBudget();

    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-border/80">
        <div>
          <h1 className="text-3xl text-center md:text-left font-bold uppercase tracking-tight mb-1">
            Budget & Savings Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze execution and allocate limits across your active plans.
          </p>
        </div>
        <div className="flex items-center self-start md:self-center bg-muted rounded-none border border-border">
          {(["Monthly", "Quarterly", "Yearly"] as BillingCycle[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-2.5 rounded-md text-xs font-black uppercase transition-all duration-200 cursor-pointer border-r border-border last:border-r-0",
                period === p
                  ? "bg-primary text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/10",
              )}>
              {p}
            </button>
          ))}
        </div>
      </div>
    );
}