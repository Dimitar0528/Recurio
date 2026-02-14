"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { easeIn, motion } from "framer-motion";

type SpendingCardProps = {
  variant: "light" | "dark";
  title: string;
  description: string;
  icon: React.ReactNode;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
};

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
  const isDarkCardVariant = variant === "dark";

  return (
    <motion.div
      initial={{ opacity: 0.4, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "group relative rounded-3xl overflow-hidden transition-all duration-300",
        isDarkCardVariant
          ? "bg-foreground/95 text-background hover:shadow-2xl hover:shadow-primary/10"
          : "bg-card border border-border hover:border-primary/80",
      )}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}>
            <h3
              className={cn(
                "text-md font-black uppercase tracking-[0.125em]",
                isDarkCardVariant
                  ? "text-background/90"
                  : "text-gray-800 dark:text-gray-200",
              )}>
              {title}
            </h3>
            <p
              className={cn(
                "text-xs",
                isDarkCardVariant
                  ? "text-background/70"
                  : "text-gray-600 dark:text-gray-400",
              )}>
              {description}
            </p>
          </motion.div>

          <div
            className={cn(
              "p-2 rounded-xl text-primary transition-transform ml-2",
              isDarkCardVariant
                ? "bg-background/10 group-hover:rotate-12"
                : "bg-secondary group-hover:scale-110",
            )}>
            {icon}
          </div>
        </div>

        <div className="flex items-end gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring" }}>
            <span
              className={cn(
                "text-xs font-bold uppercase block mb-1",
                isDarkCardVariant
                  ? "text-gray-200 dark:text-gray-600"
                  : "text-gray-700 dark:text-gray-400",
              )}>
              {primaryLabel}
            </span>
            <p className="text-3xl sm:text-4xl font-mono font-bold tracking-tighter tabular-nums">
              {primaryValue}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            whileInView={{ opacity: 1, height: "auto" }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className={cn(
              "pb-1 pl-4 border-l",
              isDarkCardVariant ? "border-background/10" : "border-border",
            )}>
            <span
              className={cn(
                "text-[10px] font-bold uppercase block mb-1",
                isDarkCardVariant
                  ? "text-background/60"
                  : "text-gray-600 dark:text-gray-400",
              )}>
              {secondaryLabel}
            </span>
            <p
              className={cn(
                "text-xl font-mono font-medium",
                isDarkCardVariant
                  ? "text-background/60"
                  : "text-gray-600 dark:text-gray-400",
              )}>
              {secondaryValue}
            </p>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-secondary overflow-hidden">
        <div className="h-full bg-primary transition-all duration-1000 ease-out group-hover:bg-emerald-500" />
      </div>
    </motion.div>
  );
}
