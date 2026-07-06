"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { categoryColors, cn, priceFormatter } from "@/lib/utils";

import {
  compareCurrentVsPreviousSpend,
  SpendingDataForDateRange,
} from "@/lib/analytics/spending_for_date_ranges";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Category, CATEGORY_VALUES } from "@/lib/validations/enums";
import { useTranslations } from "next-intl";
import { Button } from "@base-ui/react";

type SpendChartProps = {
  monthlyData: SpendingDataForDateRange[];
  yearlyData: SpendingDataForDateRange[];
};

function transformChartsData(
  data: SpendingDataForDateRange[],
  breakdownType: "category" | "subscription",
) {
  const categoryTotals = new Map<Category, number>();
  const subscriptionTotals = new Map<
    string,
    { amount: number; count: number }
  >();

  const chartData = data.map((item) => {
    const row: Record<string, string | number> = {
      label: item.label,
      spend: item.spend.toFixed(2),
    };
    item.categories.forEach((category) => {
      if (CATEGORY_VALUES.includes(category.name)) {
        row[category.name] = category.amount;
      }

      categoryTotals.set(
        category.name,
        (categoryTotals.get(category.name) || 0) + category.amount,
      );
    });
    item.subscriptions?.forEach((sub) => {
      const existingSubData = subscriptionTotals.get(sub.name) || {
        amount: 0,
        count: 0,
      };
      subscriptionTotals.set(sub.name, {
        amount: existingSubData.amount + sub.amount,
        count: existingSubData.count + sub.count,
      });
    });
    return row;
  });

  //  Format Category Breakdown Data
  const categoryBreakdownData = Array.from(categoryTotals.entries())
    .map(([name, amount]) => {
      const globalIndex = CATEGORY_VALUES.indexOf(name);
      const resolvedColor =
        categoryColors[
          globalIndex !== -1 ? globalIndex % categoryColors.length : 0
        ];
      return {
        name,
        amount,
        fill: resolvedColor.hex,
      };
    })
    .sort((a, b) => b.amount - a.amount);
  const subscriptionBreakdownData = Array.from(subscriptionTotals.entries())
    .map(([name, data]) => ({
      name,
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
  const totalBreakdownSpend =
    breakdownType === "category"
      ? categoryBreakdownData.reduce((acc, curr) => acc + curr.amount, 0)
      : subscriptionBreakdownData.reduce((acc, curr) => acc + curr.amount, 0);

  return {
    chartData,
    categoryBreakdownData,
    subscriptionBreakdownData,
    totalBreakdownSpend,
  };
}

function CustomTooltip({
  active,
  payload,
  label,
  tReusable,
  t,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  tReusable: ReturnType<typeof useTranslations<"Reusable">>;
  t: ReturnType<
    typeof useTranslations<"payments_page.spending_charts_component">
  >;
}) {
  if (!active || !payload?.length || !label) return null;
  const total = payload.reduce((acc, item) => acc + item.value, 0);
  const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
  return (
    <div className="bg-background border border-border px-4 py-3 shadow-xl min-w-[220px]">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3">
        {label}
      </p>
      <div className="space-y-2 mb-3">
        {sortedPayload.map((item) => {
          const typedCategory = item.dataKey as Category;
          return (
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
                  {tReusable(`categories.${typedCategory}`)}
                </span>
              </div>
              <span className="font-mono text-sm font-medium">
                {priceFormatter(item.value)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border pt-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-bold">
          {t("tooltip.total")}
        </span>
        <span className="text-lg font-black tracking-tight">
          {priceFormatter(total)}
        </span>
      </div>
    </div>
  );
}

export function SpendingCharts({ monthlyData, yearlyData }: SpendChartProps) {
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("payments_page.spending_charts_component");

  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const [breakdownType, setBreakdownType] = useState<
    "subscription" | "category"
  >("subscription");

  const data = view === "monthly" ? monthlyData : yearlyData;
  const totalSpend = data.reduce((acc, spendData) => acc + spendData.spend, 0);
  const avgSpend = totalSpend > 0 ? totalSpend / data.length : 0;
  const growthRate = compareCurrentVsPreviousSpend(data);
  const hasGrowthRate = growthRate !== 0;

  const { 
    chartData, 
    categoryBreakdownData, 
    subscriptionBreakdownData, 
    totalBreakdownSpend 
    } = transformChartsData(data, breakdownType)
  const activeCategories = CATEGORY_VALUES.filter((category) =>
    chartData.some((item) => Number(item[category] ?? 0) > 0),
  );
      
  const chartConfig = {
    ...Object.fromEntries(
      activeCategories.map((category) => {
        const globalIndex = CATEGORY_VALUES.indexOf(category);
        const resolvedColor =
          categoryColors[
            globalIndex !== -1 ? globalIndex % categoryColors.length : 0
          ];
        return [
          category,
          {
            label: tReusable(`categories.${category}`),
            color: resolvedColor.hex,
          },
        ];
      }),
    ),
  } satisfies ChartConfig;

  return (
    <div className="w-full space-y-8 relative z-10">
      <div className="flex items-center gap-4 justify-center sm:justify-between pb-3 border-b border-border/40 flex-wrap mx-auto">
        <div>
          <h2 className="text-2xl md:text-3xl tracking-[0.06em] font-bold leading-[0.95]">
            {t("title")}
          </h2>
        </div>
        <div className="flex items-center justify-center p-1 bg-muted/50 rounded-lg border border-border/50">
          {(["monthly", "yearly"] as const).map((item) => (
            <Button
              key={item}
              onClick={() => setView(item)}
              className={cn(
                "px-4 py-1.25 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer duration-200",
                view === item
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/20",
              )}>
              {t(`view.${item}`)}
            </Button>
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
            {t("stats.total_spend")}
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
                {t("stats.growth_rate")}
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
            {t("stats.average")}
          </p>
          <p className="font-mono text-lg font-medium leading-none">
            {priceFormatter(avgSpend)}
          </p>
        </div>
        <div className="hidden sm:block w-px bg-border/40 self-stretch" />
        <div className="sm:pl-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-2">
            {t("stats.window")}
          </p>
          <p className="font-mono text-lg font-medium leading-none">
            {view === "monthly"
              ? t("stats.window_monthly")
              : t("stats.window_yearly")}
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[380px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="2 2"
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
                  tickFormatter={(value) =>
                    typeof value === "string"
                      ? value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase()
                      : value
                  }
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
                  content={<CustomTooltip tReusable={tReusable} t={t} />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                {activeCategories.map((category) => {
                  const globalIndex = CATEGORY_VALUES.indexOf(category);
                  const resolvedColor =
                    categoryColors[
                      globalIndex !== -1
                        ? globalIndex % categoryColors.length
                        : 0
                    ];
                  return (
                    <Bar
                      key={category}
                      dataKey={category}
                      stackId="spend"
                      fill={resolvedColor.hex}
                      maxBarSize={100}
                      animationDuration={600}>
                      <LabelList
                        dataKey={category}
                        position="top"
                        offset={8}
                        content={(props) => {
                          const { x, y, width, value } = props;
                          const row = chartData.find(
                            (d) => d[category] === value,
                          );
                          if (!row) return null;
                          const isTop = activeCategories
                            .slice(activeCategories.indexOf(category) + 1)
                            .every((c) => !row[c]);
                          if (!isTop) return null;
                          return (
                            <text
                              x={Number(x) + Number(width) / 2}
                              y={Number(y) - 8}
                              textAnchor="middle"
                              fontSize={12}
                              fontWeight={700}
                              fill="currentColor">
                              {priceFormatter(Number(row.spend))}
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

          <div className="lg:col-span-1 border border-border/40 rounded-2xl p-6 bg-card/45 flex flex-col justify-between h-[380px] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-black">
                {t("breakdown.name")}
              </span>
              <div className="flex items-center p-0.5 bg-muted/60 rounded-md border border-border/40">
                {(["subscription", "category"] as const).map((item) => (
                  <Button
                    key={item}
                    onClick={() => setBreakdownType(item)}
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer duration-200",
                      breakdownType === item
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/20",
                    )}>
                    {item === "subscription"
                      ? t("breakdown.breakdown_type.subscriptions")
                      : t("breakdown.breakdown_type.categories")}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col justify-center">
              {breakdownType === "subscription" ? (
                <div className="space-y-1.5 max-h-[270px] overflow-y-auto pr-1 scroll-smooth py-1">
                  {subscriptionBreakdownData.length > 0 ? (
                    subscriptionBreakdownData.map((item) => {
                      const percentage =
                        totalBreakdownSpend > 0
                          ? (item.amount / totalBreakdownSpend) * 100
                          : 0;
                      return (
                        <div
                          key={item.name}
                          className="group flex flex-col gap-2 p-2 rounded-xl border border-transparent hover:border-border/15 hover:bg-muted/20 transition-all duration-200">
                          <div className="flex items-center justify-between text-xs leading-none">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[11px] font-bold text-foreground truncate tracking-tight">
                                {item.name}
                              </span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase bg-primary/10 text-primary shrink-0 leading-none">
                                {t("breakdown.paid")} {item.count}×
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 font-mono">
                              <span className="font-bold text-foreground">
                                {priceFormatter(item.amount)}
                              </span>
                              <span className="text-[10px] text-muted-foreground/70 font-semibold">
                                ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary/75 rounded-full transition-all duration-500 ease-out group-hover:bg-primary"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-xs text-muted-foreground py-8">
                      {t("empty.title")}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative h-[160px] w-full flex items-center justify-center">
                    <ChartContainer
                      config={chartConfig}
                      className="w-full h-full max-h-[160px]">
                      <PieChart>
                        <Pie
                          data={categoryBreakdownData}
                          dataKey="amount"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={68}
                          paddingAngle={2}>
                          {categoryBreakdownData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.fill}
                              stroke="hsl(var(--card))"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                        {t("stats.total_spend")}
                      </span>
                      <span className="text-lg font-black tracking-tight leading-none mt-1">
                        {priceFormatter(totalBreakdownSpend)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                    {categoryBreakdownData.map((item) => {
                      const percentage =
                        totalBreakdownSpend > 0
                          ? (item.amount / totalBreakdownSpend) * 100
                          : 0;
                      return (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="truncate text-muted-foreground font-semibold">
                              {tReusable(`categories.${item.name}`)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="font-bold">
                              {priceFormatter(item.amount)}
                            </span>
                            <span className="text-muted-foreground/50 text-[9px]">
                              ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border/60 rounded-2xl bg-muted/45 flex items-center justify-center py-4">
          <div className="text-center space-y-3 max-w-sm px-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-primary/70" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-tight">
                {t("empty.title")}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("empty.description")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
