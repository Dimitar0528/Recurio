import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartConfig,
} from "@/components/ui/chart";
import { cn, dateFormatter, priceFormatter } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { PriceHistory } from "@/lib/validations/schemas";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type PriceHistoryDialogProps = {
  isPriceHistoryDialogOpen: boolean;
  setIsPriceHistoryDialogOpen: Dispatch<SetStateAction<boolean>>;
  priceHistory: PriceHistory[] | undefined;
  isLoading: boolean;
  isError: boolean;
  t: ReturnType<
    typeof useTranslations<"dashboard_page.subscription_table_component">
  >;
};

export default function PriceHistoryDialog({
  isPriceHistoryDialogOpen,
  setIsPriceHistoryDialogOpen,
  priceHistory,
  isLoading,
  isError,
  t,
}: PriceHistoryDialogProps) {
  const locale = useLocale();

  const hasHistory = priceHistory && priceHistory.length > 0;
  const sortedHistory = hasHistory
    ? [...priceHistory].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    : [];

  const chartData = hasHistory
    ? [
        {
          date: t("price_history_dialog.initial"),
          price: sortedHistory[0].oldPrice,
        },
        ...sortedHistory.map((item) => ({
          date: dateFormatter(item.createdAt, locale),
          price: item.newPrice,
        })),
      ]
    : [];

  const initialPrice = sortedHistory[0]?.oldPrice;
  const currentPrice = sortedHistory[sortedHistory.length - 1]?.newPrice;
  const percentChange =
    initialPrice && initialPrice !== 0
      ? Math.round(((currentPrice - initialPrice) / initialPrice) * 100)
      : 0;

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const reasonMap: Record<string, { label: string; className: string }> = {
    Increase: {
      label: t("price_history_dialog.price_change_reasons.increase"),
      className: "bg-destructive/10 text-destructive",
    },
    Discount: {
      label: t("price_history_dialog.price_change_reasons.discount"),
      className: "bg-emerald-500/10 text-emerald-500",
    },
  };

  return (
    <Dialog
      open={isPriceHistoryDialogOpen}
      onOpenChange={setIsPriceHistoryDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-0.5 border-b border-border/90">
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-4.5 h-4.5 text-green-600" />
            {t("price_history_dialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("price_history_dialog.description")}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <>
            <div className="h-[170px] w-full">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>

            <div className="border-t border-border/40 pt-2">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-1 w-24" />
                      <Skeleton className="h-2 w-32" />
                    </div>

                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="font-medium text-destructive">
              {t("price_history_dialog.error_title")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("price_history_dialog.error_description")}
            </p>
          </div>
        ) : !hasHistory ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            {t("price_history_dialog.empty_state")}
          </div>
        ) : (
          <>
            <div className="h-[170px] w-full relative -left-3">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-price)"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-price)"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    strokeOpacity={0.1}
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{
                      fontSize: 10,
                      fontWeight: 600,
                      fill: "currentColor",
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 10,
                      fontWeight: 600,
                      fill: "currentColor",
                    }}
                    tickFormatter={(val) => `€${val}`}
                  />
                  <ChartTooltip
                    cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0].payload;
                      return (
                        <div className="bg-background border border-border px-2.5 py-1.5 shadow-lg rounded-md font-mono text-xs font-bold">
                          {t("price_history_dialog.price_showcase", {
                            price: priceFormatter(item.price),
                          })}
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="price"
                    stroke="oklch(62.7% 0.194 149.214)"
                    fill="oklch(62.7% 0.194 149.214)"
                    fillOpacity={0.15}
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "oklch(62.7% 0.194 149.214)",
                      stroke: "white",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 7,
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            <div className="border-t border-border/40 pt-3">
              {percentChange !== 0 && (
                <p className="text-xs font-medium text-muted-foreground mb-3 px-1">
                  {percentChange > 0
                    ? t("price_history_dialog.percentage_increase", {
                        percent: percentChange,
                      })
                    : t("price_history_dialog.percentage_decrease", {
                        percent: Math.abs(percentChange),
                      })}
                </p>
              )}
              <div className="max-h-[160px] overflow-y-auto pr-1">
                <div className="relative border-l border-border/70 ml-3 pl-6 space-y-3">
                  {priceHistory.map((item, index) => {
                    const reason = reasonMap[item.changeReason];
                    return (
                      <div key={index} className="relative group">
                        <div className="absolute left-[-30px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-green-600 transition-transform group-hover:scale-125" />
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                              {dateFormatter(item.createdAt, locale, "numeric")}
                            </span>
                            <span className="text-[13px] font-bold text-foreground">
                              {priceFormatter(item.oldPrice)}
                              <span className="text-muted-foreground/50 font-normal mx-1">
                                →
                              </span>
                              {priceFormatter(item.newPrice)}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md leading-none",
                              reason.className,
                            )}>
                            {reason.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
        <DialogFooter className="">
          <DialogClose
            render={
              <Button
                variant="outline"
                className="cursor-pointer border-border hover:bg-accent font-semibold outline-dashed">
                {t("price_history_dialog.close")}
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
