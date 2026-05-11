import { cn, priceFormatter } from "@/lib/utils";
import { Subscription } from "@/lib/validations/schemas";

type TimelineSectionProps = {
  title: string;
  items: Subscription[];
  theme_color: "amber" | "emerald";
  emptyMessage: string;
  getLabel: (item: Subscription) => string;
  getTitle: (item: Subscription) => string;
  getSubtitle: (item: Subscription) => string;
  getPrice: (item: Subscription) => number;
  crossed?: boolean;
};

const getItemsOverallCost = (items: Subscription[]) => {
  const subscriptionCost = items.reduce((acc, items) => {
    return acc + items.price;
  }, 0);
  return priceFormatter(subscriptionCost);
};
export function TimelineSection({
  title,
  items,
  theme_color,
  emptyMessage,
  getLabel,
  getTitle,
  getSubtitle,
  getPrice,
  crossed = false,
}: TimelineSectionProps) {
  const itemsOverallCost = getItemsOverallCost(items);
  const styles = {
    amber: {
      text: "text-amber-500",
      glow: "shadow-[0_0_18px_var(--color-amber-500)]",
      dot: "bg-amber-500/40",
      dotHover: "group-hover:bg-amber-400",
      hoverGlow: "group-hover:shadow-[0_0_16px_var(--color-amber-500)]",
      gradient:
        "bg-linear-to-r from-amber-500/[0.1] to-transparent",
      amountHover: "group-hover:text-amber-300",
      line: "bg-linear-to-r from-amber-500/40 to-transparent",
    },

    emerald: {
      text: "text-emerald-500",
      glow: "shadow-[0_0_18px_var(--color-emerald-500)]",
      dot: "bg-emerald-500/40",
      dotHover: "group-hover:bg-emerald-400",
      hoverGlow: "group-hover:shadow-[0_0_16px_var(--color-emerald-500)]",
      gradient:
        "bg-linear-to-r from-emerald-500/[0.1]  to-transparent",
      amountHover: "group-hover:text-emerald-300",
      line: "bg-linear-to-r from-emerald-500/40 to-transparent",
    },
  };

  const theme = styles[theme_color];

  return (
    <div className="space-y-6">
      <div className="pl-16 relative">
        <div
          className={cn(
            "absolute left-[18px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full",
            theme_color === "amber" ? "bg-amber-500" : "bg-emerald-500",
            theme.glow,
          )}
        />
        <div className="flex items-center gap-4">
          <div className={cn("h-px flex-1", theme.line)} />
          <p
            className={cn(
              "text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap",
              theme.text,
            )}>
            {title}:{" "}
            <span className="text-sm underline underline-offset-3">
              {itemsOverallCost}
            </span>
          </p>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="group relative pl-16 flex items-center h-12 opacity-70">
          <div className="absolute left-[19px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-muted-foreground" />
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest italic">
            {emptyMessage}
          </div>
        </div>
      ) : (
        items.map((item, index) => (
          <div
            key={index}
            className="group relative pl-16 opacity-90 hover:opacity-100 transition-all duration-500">
            {/* Hover Background */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                theme.gradient,
              )}
            />
            {/* Dot */}
            <div
              className={cn(
                "absolute left-[18px] top-1/2 -translate-y-1/2",
                "w-3 h-3 rounded-full border-2 border-background",
                "transition-all duration-300",
                "shadow-[0_0_0px_transparent]",
                "group-hover:scale-125",
                theme.dot,
                theme.dotHover,
                theme.hoverGlow,
              )}
            />
            {/* Content */}
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-5 min-w-0">
                <div className="text-right w-14 hidden sm:block">
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.18em]",
                      theme.text,
                    )}>
                    {getLabel(item)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p
                    className={cn(
                      "text-lg font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-1",
                      crossed && "line-through decoration-emerald-500/40",
                    )}>
                    {getTitle(item)}
                  </p>
                  <p className="text-xs text-muted-foreground/60 font-medium uppercase tracking-widest">
                    {getSubtitle(item)}
                  </p>
                </div>
              </div>
              <p
                className={cn(
                  "text-lg font-mono transition-colors duration-300",
                  crossed
                    ? "font-medium text-muted-foreground"
                    : "font-bold tracking-tight",
                  theme.amountHover,
                )}>
                {priceFormatter(getPrice(item))}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
