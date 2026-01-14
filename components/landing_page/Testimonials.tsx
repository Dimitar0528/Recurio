"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { type getDictionary } from "@/app/[lang]/dictionaries";

interface Testimonial {
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
            className="bg-card border border-border p-6 rounded-2xl shadow-sm">
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

export default function Testimonials({
  dictionary,
}: {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >["landing_page"]["testimonials_component"];
}) {
  return (
    <section className="py-12 px-6 overflow-hidden bg-primary/10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
            {dictionary.heading}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-lg mx-auto">
            {dictionary.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[520px] -mt-8">
          <ScrollingColumn items={dictionary.items.slice(0, 9)} duration={50} />
          <ScrollingColumn
            items={dictionary.items.slice(9, 18)}
            duration={50}
          />
        </div>
      </div>
    </section>
  );
}
