// components/payments/SpendChart.tsx
"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { cn, priceFormatter } from "@/lib/utils";
import { compareCurrentVsPreviousSpend } from "@/lib/analytics/spending_for_date_ranges";
import { TrendingDown, TrendingUp } from "lucide-react";

type SpendData = {
  label: string;
  spend: number;
};

interface SpendChartProps {
  monthlyData: SpendData[];
  yearlyData: SpendData[];
}

const chartConfig = {
  spend: {
    label: "Spend",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border px-4 py-3 shadow-xl">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">
        {label}
      </p>
      <p className="text-xl font-black tracking-tight">
        {priceFormatter(payload[0].value)}
      </p>
    </div>
  );
}

export function SpendingChart({ monthlyData, yearlyData }: SpendChartProps) {
  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  const data = view === "monthly" ? monthlyData : yearlyData;
  const totalSpend = data.reduce((acc, spendData) => acc + spendData.spend, 0);
  const avgSpend = totalSpend > 0 ? totalSpend / data.length : 0;
  const growthRate = compareCurrentVsPreviousSpend(data);
  const isIncrease = growthRate > 0;
  return (
    <div className="w-full space-y-8 relative z-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between ">
        {/* Analytics */}
        <div
          className={cn(
            "grid gap-x-8 gap-y-4",
            growthRate !== 0
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 text-center",
          )}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold ">
              Spend
            </p>
            <h2 className="text-2xl font-black mt-1 tracking-tight truncate">
              {priceFormatter(totalSpend)}
            </h2>
          </div>
          {growthRate != 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
                Trend
              </p>
              <div
                className={cn(
                  "flex items-center gap-1 mt-2 text-lg font-black",
                  isIncrease ? "text-red-500" : "text-emerald-500",
                )}>
                {isIncrease ? (
                  <TrendingUp size={16} className="shrink-0" />
                ) : (
                  <TrendingDown size={16} className="shrink-0" />
                )}
                <span className="truncate">{growthRate.toFixed(1)}%</span>
              </div>
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
              Average
            </p>

            <p className="text-lg font-black mt-2 truncate">
              {priceFormatter(avgSpend)}
            </p>
          </div>
          <div
            className={`${growthRate === 0 && "col-span-2 text-center sm:col-span-1"}`}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
              Range
            </p>
            <p className="text-lg font-black mt-2">
              {view === "monthly" ? "6 Months" : "3 Years"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-1 bg-muted/50 rounded-lg border border-border/50">
          {["monthly", "yearly"].map((item) => (
            <button
              key={item}
              onClick={() => setView(item as "monthly" | "yearly")}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer duration-200 ${
                view === item
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/20"
              }`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.1}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={true}
                tickMargin={8}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  fill: "currentColor",
                }}
              />
              <YAxis
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: "currentColor",
                }}
                tickFormatter={(value: number) => `${priceFormatter(value)}`}
                tickCount={6}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.45 }}
                content={<CustomTooltip />}
              />
              <Bar
                dataKey="spend"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
                animationDuration={600}>
                <LabelList
                  dataKey="spend"
                  position="top"
                  formatter={(value) => priceFormatter(Number(value))}
                  offset={8}
                  className="fill-foreground text-xs font-bold"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      ) : (
        <div className="border border-dashed border-border/60 rounded-2xl bg-muted/20 flex items-center justify-center py-4">
          <div className="text-center space-y-3 max-w-sm px-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-primary/70" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-tight">
                No spending history yet
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Add your first subscription to start tracking recurring expenses
                and billing activity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
