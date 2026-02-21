"use client";

import { Calendar, PieChart, CreditCard, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { easeOut, motion } from "framer-motion";

export default function Features() {
  const t = useTranslations("landing_page.features_component");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  return (
    <section id="insights" className="py-18 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col items-center md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <motion.h2
              variants={itemVariants}
              className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">
              {t("tagline")}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight text-foreground mx-auto">
              {t("heading.line_1")}
              <br />
              {t("heading.line_2")}
            </motion.p>
          </div>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground max-w-xs text-md leading-relaxed">
            {t("intro")}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="md:col-span-8 bg-card border border-border p-8 rounded-2xl flex flex-col justify-between min-h-[400px] transition-colors hover:border-primary/30">
            <div className="max-w-md mx-auto md:mx-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <PieChart size={28} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3">
                {t("cost_normalization.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("cost_normalization.description")}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-border flex gap-8 mx-auto md:mx-0">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                  {t("cost_normalization.monthly")}
                </p>
                <p className="text-xl font-mono font-bold">11.99 €</p>
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="text-muted-foreground self-center">
                →
              </motion.div>
              <div>
                <p className="text-[10px] uppercase font-bold text-primary mb-1">
                  {t("cost_normalization.annual")}
                </p>
                <p className="text-xl font-mono font-bold text-primary">
                  143.88 €
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="md:col-span-4 bg-secondary/30 border border-border p-8 rounded-2xl flex flex-col text-center items-center justify-center md:text-left md:items-stretch transition-colors hover:border-primary/30">
            <div className="w-10 h-10 rounded-lg bg-foreground text-background flex items-center justify-center mb-6">
              <Calendar size={22} />
            </div>
            <h3 className="text-xl font-bold mb-3">
              {t("time_awareness.title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
              {t("time_awareness.description")}
            </p>
            <div className="mt-auto space-y-2">
              <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "66.6%" }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase">
                {t("time_awareness.proximity")}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="md:col-span-4 bg-card border border-border p-8 rounded-2xl flex flex-col justify-center text-center md:text-left md:items-start transition-colors hover:border-primary/30">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-6">
              <CreditCard size={22} color="oklch(0.59 0.20 277)" />
            </div>
            <h3 className="text-xl font-bold mb-3">
              {t("manual_entry.title")}
            </h3>
            <p className="text-sm max-w-md text-muted-foreground leading-relaxed">
              {t("manual_entry.description")}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="md:col-span-8 bg-gray-900 dark:bg-gray-300 text-background p-8 rounded-2xl flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10 max-w-lg mx-auto md:mx-0">
              <h3 className="text-xl font-bold mb-3">{t("privacy.title")}</h3>
              <p className="text-sm text-background/80 leading-relaxed">
                {t("privacy.description")}
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, rotate: 45, scale: 0.5 }}
              whileInView={{ opacity: 0.1, rotate: 12, scale: 1 }}
              transition={{ duration: 1, ease: "backOut" }}
              className="absolute -right-4">
              <ShieldCheck size={120} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
