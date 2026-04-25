"use client";

import { Calendar, PieChart, CreditCard, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { easeOut, motion } from "framer-motion";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

export default function Features() {
  const t = useTranslations("landing_page.features_component");

  return (
    <section id="insights" className="py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-12">
          <div className="grid lg:grid-cols-[1fr_auto] items-end text-center lg:text-left">
            <motion.h2
              variants={rise}
              className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] text-foreground">
              {t("heading.line_1")}
              <br />
              <span className="text-primary">{t("heading.line_2")}</span>
            </motion.h2>
            <motion.p
              variants={rise}
              className="text-muted-foreground max-w-xs text-base leading-relaxed font-light mx-auto mt-4 lg:mt-0">
              {t("intro")}
            </motion.p>
          </div>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-16 gap-px bg-primary/50"
          style={{ border: "1px solid var(--border)" }}>
          <motion.div
            variants={rise}
            className="md:col-start-2 md:col-end-9 bg-gray-950 dark:bg-gray-100 text-gray-50 dark:text-gray-900 p-4 flex flex-col justify-between transition-colors duration-300 group">
            <div>
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase">
                  01
                </span>
                <div
                  className="w-10 h-10 border border-border border-white dark:border-gray-900 flex items-center justify-center text-primary"
                  style={{
                    clipPath:
                      "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}>
                  <PieChart size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-4">
                {t("cost_normalization.title")}
              </h3>
              <p className="text-gray-300 dark:text-gray-600 leading-relaxed max-w-sm">
                {t("cost_normalization.description")}
              </p>
            </div>
            <div className="border-t border-background pt-6 mt-6 flex items-center gap-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em]  mb-1">
                  {t("cost_normalization.monthly")}
                </p>
                <p className="font-mono text-2xl font-bold tabular-nums">
                  11.99 €
                </p>
              </div>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="text-primary text-xl font-light">
                →
              </motion.div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] mb-1">
                  {t("cost_normalization.annual")}
                </p>
                <p className="font-mono text-2xl font-bold tabular-nums">
                  143.88 €
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={rise}
            className="md:col-span-8 bg-card p-4 md:p-12 flex flex-col group">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
                02
              </span>
              <div
                className="w-10 h-10 bg-foreground text-background flex items-center justify-center"
                style={{
                  clipPath:
                    "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                }}>
                <Calendar size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">
              {t("time_awareness.title")}
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              {t("time_awareness.description")}
            </p>
            <div className="mt-10 space-y-3">
              <div className="h-[3px] w-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "66.6%" }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.4,
                  }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                {t("time_awareness.proximity")}
              </p>
            </div>
          </motion.div>
          <motion.div
            variants={rise}
            className="md:col-span-7 bg-card p-10 md:p-12 flex flex-col group">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
                03
              </span>
              <div
                className="w-10 h-10 flex items-center justify-center border border-blue-400/30 text-blue-500"
                style={{
                  clipPath:
                    "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                }}>
                <CreditCard size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">
              {t("manual_entry.title")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("manual_entry.description")}
            </p>
          </motion.div>
          <motion.div
            variants={rise}
            className="md:col-span-8 bg-gray-950 dark:bg-gray-100 text-gray-50 dark:text-gray-900 p-10 md:p-14 flex flex-col justify-between overflow-hidden relative min-h-[280px]">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase">
              04
            </span>
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: 20 }}
              whileInView={{ opacity: 0.16, scale: 1, rotate: 8 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "backOut" }}
              className="absolute -right-8 -bottom-8 pointer-events-none">
              <ShieldCheck size={200} />
            </motion.div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
                {t("privacy.title")}
              </h3>
              <p className=" text-gray-300 dark:text-gray-600 leading-relaxed max-w-md">
                {t("privacy.description")}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
