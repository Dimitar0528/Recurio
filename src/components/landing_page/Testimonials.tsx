"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

type Testimonial = {
  text: string;
  author: string;
  stars: number;
}
const ScrollingColumn = ({
  items,
  duration,
  reverse = false,
}: {
  items: Testimonial[];
  duration: number;
  reverse?: boolean;
}) => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <motion.div
        initial={{ y: reverse ? "-50%" : "0%" }}
        animate={{ y: reverse ? "0%" : "-50%" }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="flex flex-col gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <p className="text-sm leading-relaxed mb-4 text-foreground italic">
              "{item.text}"
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{item.author}</span>
              <div className="flex gap-0.5">
                {[...Array(item.stars)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill="oklch(0.59 0.20 277)"
                    stroke="none"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function Testimonials() {
  const t = useTranslations("landing_page.testimonials_component");
  const testimonials = [
    {
      text: t("people.alex"),
      author: "Alex P.",
      stars: 5,
    },
    {
      text: t("people.samira"),
      author: "Samira L.",
      stars: 4,
    },
    {
      text: t("people.jordan"),
      author: "Jordan K.",
      stars: 5,
    },
    {
      text: t("people.nina"),
      author: "Nina W.",
      stars: 5,
    },
    {
      text: t("people.marcus"),
      author: "Marcus T.",
      stars: 4,
    },
    {
      text: t("people.leah"),
      author: "Leah B.",
      stars: 5,
    },
    {
      text: t("people.ethan"),
      author: "Ethan R.",
      stars: 5,
    },
    {
      text: t("people.clara"),
      author: "Clara D.",
      stars: 4,
    },
    {
      text: t("people.omar"),
      author: "Omar H.",
      stars: 5,
    },
    {
      text: t("people.sophia"),
      author: "Sophia M.",
      stars: 5,
    },
    {
      text: t("people.ryan"),
      author: "Ryan C.",
      stars: 5,
    },
    {
      text: t("people.isabella"),
      author: "Isabella J.",
      stars: 4,
    },
    {
      text: t("people.dylan"),
      author: "Dylan S.",
      stars: 5,
    },
    {
      text: t("people.emily"),
      author: "Emily F.",
      stars: 5,
    },
    {
      text: t("people.leo"),
      author: "Leo V.",
      stars: 5,
    },
    {
      text: t("people.hannah"),
      author: "Hannah Q.",
      stars: 5,
    },
    {
      text: t("people.noah"),
      author: "Noah G.",
      stars: 4,
    },
    {
      text: t("people.maya"),
      author: "Maya K.",
      stars: 5,
    },
  ];
  return (
    <section className="py-12 px-6 overflow-hidden bg-primary/10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
            {t("heading")}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-lg mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[520px] -mt-8">
          <ScrollingColumn items={testimonials.slice(0, 9)} duration={45} />
          <ScrollingColumn
            items={testimonials.slice(9, 18)}
            duration={45}
          />
        </div>
      </div>
    </section>
  );
}
