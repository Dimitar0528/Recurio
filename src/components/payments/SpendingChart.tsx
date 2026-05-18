"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

import { categoryColors, cn, priceFormatter } from "@/lib/utils";

import {
  compareCurrentVsPreviousSpend,
  SpendingDataForDateRange,
} from "@/lib/analytics/spending_for_date_ranges";

import { TrendingDown, TrendingUp } from "lucide-react";
import { CATEGORY_VALUES } from "@/lib/validations/enums";

interface SpendChartProps {
  monthlyData: SpendingDataForDateRange[];
  yearlyData: SpendingDataForDateRange[];
}

const chartConfig = {
  spend: {
    label: "Spend",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function transformChartData(data: SpendingDataForDateRange[]) {
  const transformedData = data.map((item) => {
    const row: Record<string, string | number> = {
      label: item.label,
      spend: item.spend,
    };
    item.categories.forEach((category) => {
      if (CATEGORY_VALUES.includes(category.name)) {
        row[category.name] = category.amount;
      }
    });
    return row;
  });
  return {
    transformedData,
    categories: CATEGORY_VALUES,
  };
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((acc, item) => acc + item.value, 0);
  const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
  return (
    <div className="bg-background border border-border px-4 py-3 shadow-xl min-w-[220px]">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3">
        {label}
      </p>
      <div className="space-y-2 mb-3">
        {sortedPayload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  background: item.color,
                }}
              />
              <span
                className={cn(
                  "text-sm truncate",
                  categoryColors.find((c) => c.hex === item.color)?.text,
                )}>
                {item.dataKey}
              </span>
            </div>
            <span className="font-mono text-sm font-medium">
              {priceFormatter(item.value)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-bold">
          Total
        </span>
        <span className="text-lg font-black tracking-tight">
          {priceFormatter(total)}
        </span>
      </div>
    </div>
  );
}

export function SpendingChart({ monthlyData, yearlyData }: SpendChartProps) {
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const data = view === "monthly" ? monthlyData : yearlyData;
  const totalSpend = data.reduce((acc, spendData) => acc + spendData.spend, 0);
  const avgSpend = totalSpend > 0 ? totalSpend / data.length : 0;
  const growthRate = compareCurrentVsPreviousSpend(data);
  const hasGrowthRate = growthRate !== 0;
  const { transformedData, categories } = transformChartData(data);

  return (
    <div className="w-full space-y-8 relative z-10">
      <div className="flex items-center gap-4 justify-center sm:justify-between pb-3 border-b border-border/40 flex-wrap mx-auto">
        <div>
          <h2 className="text-2xl md:text-3xl tracking-[0.06em] font-bold leading-[0.95]">
            Spending Insights
          </h2>
        </div>

        <div className="flex items-center justify-center p-1 bg-muted/50 rounded-lg border border-border/50">
          {["monthly", "yearly"].map((item) => (
            <button
              key={item}
              onClick={() => setView(item as "monthly" | "yearly")}
              className={cn(
                "px-4 py-1.25 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer duration-200",
                view === item
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/20",
              )}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "grid grid-cols-2 text-center gap-4",
          hasGrowthRate
            ? "sm:grid-cols-[2fr_auto_1fr_auto_1fr_auto_1fr] sm:gap-0"
            : "sm:grid-cols-[2fr_auto_1fr_auto_1fr] sm:gap-0",
        )}>
        <div
          className={cn(
            "sm:pr-8",
            hasGrowthRate ? "col-span-1" : "col-span-2 sm:col-span-1",
          )}>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-2">
            Total Spend
          </p>

          <p className="font-mono text-2xl sm:text-3xl font-medium leading-none tracking-tight text-primary">
            {priceFormatter(totalSpend)}
          </p>
        </div>

        <div className="hidden sm:block w-px bg-border/40 self-stretch" />

        {hasGrowthRate && (
          <>
            <div className="sm:px-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                Momentum
              </p>

              <div
                className={cn(
                  "flex items-center gap-1.5 font-mono text-lg font-medium justify-center",
                  growthRate > 0 ? "text-red-500" : "text-emerald-500",
                )}>
                {growthRate > 0 ? (
                  <TrendingUp size={15} className="shrink-0" />
                ) : (
                  <TrendingDown size={15} className="shrink-0" />
                )}
                {growthRate.toFixed(2)}%
              </div>
            </div>

            <div className="hidden sm:block w-px bg-border/40 self-stretch" />
          </>
        )}

        <div className="sm:px-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-2">
            Average
          </p>

          <p className="font-mono text-lg font-medium leading-none">
            {priceFormatter(avgSpend)}
          </p>
        </div>

        <div className="hidden sm:block w-px bg-border/40 self-stretch" />

        <div className="sm:pl-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-2">
            Window
          </p>

          <p className="font-mono text-lg font-medium leading-none">
            {view === "monthly" ? "6 Months" : "3 Years"}
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-[380px] w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart
              data={transformedData}
              margin={{
                top: 20,
                right: 0,
                left: 0,
                bottom: 0,
              }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.1}
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine
                tickMargin={8}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  fill: "currentColor",
                }}
              />

              <YAxis
                tickLine
                axisLine
                tickMargin={8}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: "currentColor",
                }}
                tickFormatter={(value: number) => priceFormatter(value)}
                tickCount={6}
              />

              <ChartTooltip
                cursor={{
                  fill: "hsl(var(--muted))",
                  opacity: 0.45,
                }}
                content={<CustomTooltip />}
              />

              {categories.map((category, index) => {
                return (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="spend"
                    fill={categoryColors[index % categoryColors.length].hex}
                    maxBarSize={100}
                    animationDuration={600}>
                    <LabelList
                      dataKey={category}
                      position="top"
                      offset={8}
                      content={(props) => {
                        const { x, y, width, value, index: dataIndex } = props;
                        if (dataIndex === undefined) return null;
                        // Price label only renders on the top of the 
                        // visually top bar for a given row
                        const isVisualTop =
                          Number(value) > 0 &&
                          categories
                            .slice(index + 1)
                            .every((cat) => !transformedData[dataIndex]?.[cat]);

                        if (!isVisualTop) return null;

                        return (
                          <text
                            x={Number(x) + Number(width) / 2}
                            y={Number(y) - 8}
                            textAnchor="middle"
                            fontSize={12}
                            fontWeight={700}
                            fill="currentColor">
                            {priceFormatter(Number(transformedData[dataIndex]?.spend))}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                );
              })}
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
