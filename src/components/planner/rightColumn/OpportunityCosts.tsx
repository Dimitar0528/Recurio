import { priceFormatter } from "@/lib/utils";
import { BillingCycle } from "@/lib/validations/enums";
import { useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  Clock,
  Coffee,
  Scale,
  ShieldCheck,
  TrendingUp,
  Utensils,
  Lock,
  Coins,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  XAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  YAxis,
  LabelList,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type OpportunityCostsProps = {
  draftMonthly: number;
  draftYearly: number;
  monthlySpend: number;
  hypotheticalPrice: number;
  hypotheticalPeriod: BillingCycle;
  t: ReturnType<typeof useTranslations<"planner_page.right_column_component">>;
};

export default function OpportunityCosts({
  draftMonthly,
  draftYearly,
  monthlySpend,
  hypotheticalPrice,
  hypotheticalPeriod,
  t,
}: OpportunityCostsProps) {
  const tReusable = useTranslations("Reusable");
  const tLabels = useTranslations("planner_page.period_labels");
  const { user } = useUser();
  const netSalary = user?.unsafeMetadata.net_salary;
  const hasSalary =
    typeof netSalary !== "undefined" &&
    netSalary !== null &&
    !isNaN(Number(netSalary)) &&
    Number(netSalary) > 0;

  const coffeeEquivalent = Math.floor(draftMonthly / 2.22);
  const mealEquivalent = Math.floor(draftMonthly / 18);

  // Compound Interest Calculation: 5 years at 7% compound growth
  const monthlyRate = 0.07 / 12;
  const totalMonths = 60;
  const compoundFiveYear =
    draftMonthly > 0
      ? Math.round(
          draftMonthly *
            ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate),
        )
      : 0;

  const newMonthly = monthlySpend + draftMonthly;
  const incomeVal = hasSalary ? Number(netSalary) : 1;
  const currentHealthPercent = hasSalary ? (monthlySpend / incomeVal) * 100 : 0;
  const newHealthPercent = hasSalary ? (newMonthly / incomeVal) * 100 : 0;

  const draftPercentOfStack =
    newMonthly > 0 ? (draftMonthly / newMonthly) * 100 : 0;
  const hourlyWage = hasSalary ? incomeVal / 160 : 0;
  const hoursToFundPayment =
    hypotheticalPrice > 0 && hourlyWage > 0
      ? hypotheticalPrice / hourlyWage
      : 0;

  const periodSuffixes = {
    Monthly: { short: "mo", full: tReusable("billingCycle.Monthly") },
    Quarterly: { short: "qtr", full: tReusable("billingCycle.Quarterly") },
    Yearly: { short: "yr", full: tReusable("billingCycle.Yearly") },
  };
  const currentPeriod =
    periodSuffixes[hypotheticalPeriod] || periodSuffixes.Monthly;

  // Safety Margin classification
  let safetyMarginZone: "Safe" | "Caution" | "Alert" = "Safe";
  if (hasSalary) {
    if (newHealthPercent > 10) {
      safetyMarginZone = "Alert";
    } else if (newHealthPercent > 5) {
      safetyMarginZone = "Caution";
    }
  }
  const localizedAdjective = t(
    `opportunity_costs.labor_exchange_rate.periods.${hypotheticalPeriod}.adjective`,
  );
  const localizedEvery = t(
    `opportunity_costs.labor_exchange_rate.periods.${hypotheticalPeriod}.every`,
  );
  const localizedHours = t(
    "opportunity_costs.labor_exchange_rate.labor_exchange.hours_plural",
    {
      count: parseFloat(hoursToFundPayment.toFixed(1)),
    },
  );

  const draftTenYearCompound = Math.round(
    draftMonthly * ((Math.pow(1 + 0.07 / 12, 120) - 1) / (0.07 / 12)),
  );

  const wealthData = [
    { period: "0", amount: 0 },
    { period: "1Y", amount: Math.round(draftYearly) },
    { period: "5Y", amount: compoundFiveYear },
    { period: "10Y", amount: draftTenYearCompound },
  ];

  const wealthChartConfig = {
    amount: {
      label: t("opportunity_costs.alt_money_path.name"),
      color: "rgb(16 185 129)",
    },
  } satisfies ChartConfig;

  const discretionaryPercent = Math.min(
    100,
    (draftMonthly / (3000 * 0.3)) * 100,
  );
  const discretionaryData = [
    {
      name: "discretionary",
      value: discretionaryPercent,
      fill: "rgb(99 102 241)",
    },
  ];

  const discretionaryChartConfig = {
    value: {
      label: "Discretionary Impact",
      color: "rgb(99 102 241)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 py-6 transition-all duration-300">
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-250 dark:bg-slate-850 -translate-x-1/2 pointer-events-none" />
        <div className="flex flex-col justify-between md:pr-4 lg:pr-8 space-y-4">
          <div>
            <h4 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              {t("opportunity_costs.alt_money_path.name")}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t("opportunity_costs.alt_money_path.description.part_1")}{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {priceFormatter(draftMonthly)}/{tLabels("monthly")}
              </span>{" "}
              {t("opportunity_costs.alt_money_path.description.part_2")}
            </p>
          </div>
          <div className="py-2">
            <ChartContainer config={wealthChartConfig} className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={wealthData}
                  margin={{ left: -5, right: 30, top: 18, bottom: 5 }}>
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop
                        offset="5%"
                        stopColor="rgb(16 185 129)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="rgb(16 185 129)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="period"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={5}
                  />
                  <YAxis
                    dataKey="amount"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={true}
                    axisLine={true}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => priceFormatter(Number(value))}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="rgb(16 185 129)"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorAmount)">
                    <LabelList
                      dataKey="amount"
                      position="top"
                      offset={12}
                      className="fill-slate-600 dark:fill-slate-400 font-mono text-[8px] font-semibold"
                      formatter={(value) =>
                        Number(value) !== 0 ? priceFormatter(Number(value)) : ""
                      }
                    />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                {t("opportunity_costs.alt_money_path.steps.one_year")}
              </span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">
                {priceFormatter(Math.round(draftYearly))}
              </span>
            </div>
            <div className="flex flex-col border-l border-slate-100 dark:border-slate-800 pl-3">
              <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                {t("opportunity_costs.alt_money_path.steps.five_years")}
              </span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                {priceFormatter(compoundFiveYear)}
              </span>
            </div>
            <div className="flex flex-col border-l border-slate-100 dark:border-slate-800 pl-3">
              <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                {t("opportunity_costs.alt_money_path.steps.ten_years")}
              </span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {priceFormatter(draftTenYearCompound)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-6 md:pl-4 lg:pl-8">
          <div>
            <h4 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-amber-500 shrink-0" />
              {t("opportunity_costs.real_world_comparisons.title")}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t("opportunity_costs.real_world_comparisons.description")}
            </p>
          </div>
          <div className="space-y-4 my-2">
            <div className="flex items-start gap-3">
              <div className="p-1.5 text-amber-600 dark:text-amber-400 mt-0.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                  {coffeeEquivalent}
                </strong>{" "}
                {t(
                  "opportunity_costs.real_world_comparisons.coffee_equivalent",
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 text-rose-600 dark:text-rose-450 mt-0.5 bg-rose-50 dark:bg-rose-950/40 rounded-lg">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                  {mealEquivalent}
                </strong>{" "}
                {t("opportunity_costs.real_world_comparisons.meals_equivalent")}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-850 flex items-center gap-4">
            <div className="relative shrink-0 flex items-center justify-center h-20 w-20">
              <ChartContainer
                config={discretionaryChartConfig}
                className="h-20 w-20 absolute">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="100%"
                  barSize={5}
                  data={discretionaryData}
                  startAngle={90}
                  endAngle={90 - 3.6 * discretionaryPercent}>
                  <RadialBar background dataKey="value" cornerRadius={30} />
                </RadialBarChart>
              </ChartContainer>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 relative z-10">
                {discretionaryPercent.toFixed(1)}%
              </span>
            </div>
            <div className="flex-1 space-y-1">
              <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t(
                  "opportunity_costs.real_world_comparisons.discretionary_bar.title",
                )}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  "opportunity_costs.real_world_comparisons.discretionary_bar.description",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 py-8 border-t border-slate-200 dark:border-slate-850/80 transition-all duration-300">
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-250 dark:bg-slate-850 -translate-x-1/2 pointer-events-none" />
        <div className="flex flex-col justify-between space-y-6 md:pr-4 lg:pr-8">
          {hasSalary ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                    {t(`opportunity_costs.budget_health_analysis.title`)}
                  </h4>
                  <span
                    className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 transition-all duration-300 ${
                      safetyMarginZone === "Alert"
                        ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/60 dark:text-rose-400"
                        : safetyMarginZone === "Caution"
                          ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-400"
                          : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-400"
                    }`}>
                    {safetyMarginZone === "Alert" && (
                      <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                    )}
                    {t(
                      `opportunity_costs.budget_health_analysis.labels.${safetyMarginZone}`,
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t(`opportunity_costs.budget_health_analysis.description`)}
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      {t(
                        `opportunity_costs.budget_health_analysis.curr_stack_allocation`,
                      )}
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {currentHealthPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, currentHealthPercent)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {t(
                        `opportunity_costs.budget_health_analysis.projected_allocation`,
                      )}
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {newHealthPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-linear-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, newHealthPercent)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider leading-relaxed">
                {t(
                  `opportunity_costs.budget_health_analysis.labels.messages.${safetyMarginZone}`,
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                  {t(`opportunity_costs.budget_health_analysis.empty.title`)}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t(
                    `opportunity_costs.budget_health_analysis.empty.description`,
                  )}
                </p>
              </div>
              <div className="space-y-4 my-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-455">
                      {t(
                        `opportunity_costs.budget_health_analysis.empty.draft_weight`,
                      )}
                    </span>
                    <span className="font-mono font-bold text-indigo-650 dark:text-indigo-400">
                      {draftPercentOfStack.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, draftPercentOfStack)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider leading-relaxed">
                {t(`opportunity_costs.budget_health_analysis.empty.callout`, {
                  draftPercentOfStack: draftPercentOfStack.toFixed(2),
                })}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-between space-y-6 md:pl-4 lg:pl-8">
          {hasSalary ? (
            <>
              <div>
                <h4 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                  {t(`opportunity_costs.labor_exchange_rate.title`)}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t(`opportunity_costs.labor_exchange_rate.description`)}
                </p>
              </div>
              <div className="flex items-center gap-6 py-2">
                <div className="relative h-28 w-10 flex flex-col justify-between items-start text-[9px] font-mono text-slate-455 dark:text-slate-500 shrink-0">
                  <span className="leading-none">24h</span>
                  <span className="leading-none">16h</span>
                  <span className="leading-none">8h</span>
                  <span className="leading-none">0h</span>
                  <div className="absolute right-1 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-full transition-all duration-500"
                      style={{
                        height: `${Math.min(100, (hoursToFundPayment / 24) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <span className="block text-[9px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-semibold font-mono">
                      {t(`opportunity_costs.labor_exchange_rate.cost`)}
                    </span>
                    <span className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 font-mono tracking-tight block leading-tight">
                      {hoursToFundPayment.toFixed(1)}{" "}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        {t(`opportunity_costs.labor_exchange_rate.hrs`)} /{" "}
                        {currentPeriod.full}
                      </span>
                    </span>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-md text-[9px] text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">
                    {hoursToFundPayment === 0
                      ? t(
                          "opportunity_costs.labor_exchange_rate.labels.zero_cost",
                        )
                      : hoursToFundPayment < 1.5
                        ? t(
                            "opportunity_costs.labor_exchange_rate.labels.micro_shift",
                          )
                        : hoursToFundPayment < 5
                          ? t(
                              "opportunity_costs.labor_exchange_rate.labels.half_day",
                            )
                          : t(
                              "opportunity_costs.labor_exchange_rate.labels.full_day",
                            )}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-850">
                <p className="text-[10px] text-slate-550 dark:text-slate-455 leading-relaxed">
                  {t.rich(
                    "opportunity_costs.labor_exchange_rate.labor_exchange.description",
                    {
                      price: priceFormatter(hypotheticalPrice),
                      periodAdjective: localizedAdjective,
                      periodEvery: localizedEvery,
                      hours: localizedHours,
                      bold: (chunks) => (
                        <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                          {chunks}
                        </strong>
                      ),
                    },
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  {t("opportunity_costs.labor_exchange_rate.empty.title")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("opportunity_costs.labor_exchange_rate.empty.description")}
                </p>
              </div>
              <div className="py-4 my-2 flex items-center gap-4 bg-slate-100/50 dark:bg-slate-950/40 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-850/50">
                <Coins className="w-8 h-8 text-indigo-500 shrink-0" />
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                    {t(
                      "opportunity_costs.labor_exchange_rate.empty.unlock.title",
                    )}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                    {t(
                      "opportunity_costs.labor_exchange_rate.empty.unlock.description",
                    )}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider leading-relaxed">
                {t("opportunity_costs.labor_exchange_rate.empty.callout")}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
