"use client";

import { motion } from "framer-motion";
import { Repeat } from "lucide-react";
import { useLocale } from "next-intl";

export default function Loading() {
  const locale = useLocale()
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">
      <div className="relative flex items-center justify-center">
        <motion.div
          style={{ borderTopColor: "var(--primary)" }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-20 h-20 rounded-full border-2 border-primary/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-14 h-14 rounded-full border border-dashed border-primary/20"
        />
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px 0px rgba(var(--primary), 0)",
              "0 0 20px 2px rgba(var(--primary), 0.1)",
              "0 0 0px 0px rgba(var(--primary), 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 w-10 h-10 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center text-primary">
          <Repeat size={20} strokeWidth={2.5} />
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3">
          <div className="h-[1px] w-4 bg-primary/30" />
          <span className="text-xl font-mono font-black uppercase tracking-[0.5em] text-primary">
            Recurio
          </span>
          <div className="h-[1px] w-4 bg-primary/30" />
        </motion.div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-mono text-muted-foreground uppercase tracking-widest">
            {locale === "bg"
              ? "Синхронизираме данните ви"
              : "Synchronizing your data"}
          </span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              times: [0, 0.5, 1],
            }}>
            ...
          </motion.span>
        </div>
      </div>
    </div>
  );
}
