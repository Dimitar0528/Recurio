import React from "react";
import { cn } from "@/lib/utils";

type SpendingCardVariant = "light" | "dark";

type SpendingCardProps = {
  variant: SpendingCardVariant;
  title: string;
  description: string;
  icon: React.ReactNode;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
}

export function SpendingCard({
  variant,
  title,
  description,
  icon,
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
}: SpendingCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "group relative p-0 rounded-3xl overflow-hidden transition-all duration-300",
        isDark
          ? "bg-foreground text-background hover:shadow-2xl hover:shadow-primary/10"
          : "bg-card border border-border hover:border-primary/80",
      )}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] mb-1",
                isDark ? "text-background/70" : "text-muted-foreground",
              )}>
              {title}
            </h3>
            <p
              className={cn(
                "text-xs",
                isDark ? "text-background/60" : "text-muted-foreground",
              )}>
              {description}
            </p>
          </div>

          <div
            className={cn(
              "p-2 rounded-xl text-primary transition-transform",
              isDark
                ? "bg-background/10 group-hover:rotate-12"
                : "bg-secondary group-hover:scale-110",
            )}>
            {icon}
          </div>
        </div>

        <div className="flex items-end gap-6">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase block mb-1">
              {primaryLabel}
            </span>
            <p className="text-4xl font-mono font-bold tracking-tighter">
              {primaryValue}
            </p>
          </div>

          <div
            className={cn(
              "pb-1 pl-4 border-l",
              isDark ? "border-background/10" : "border-border",
            )}>
            <span
              className={cn(
                "text-[10px] font-bold uppercase block mb-1",
                isDark ? "text-background/60" : "text-gray-600 dark:text-gray-400",
              )}>
              {secondaryLabel}
            </span>
            <p
              className={cn(
                "text-xl font-mono font-medium",
                isDark ? "text-background/60" : "text-muted-foreground",
              )}>
              {secondaryValue}
            </p>
          </div>
        </div>
      </div>
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-secondary overflow-hidden">
          <div className="h-full bg-primary transition-all duration-1000 ease-out group-hover:bg-emerald-500" />
        </div>
    </div>
  );
}
