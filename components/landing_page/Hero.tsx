"use client";
import { ArrowRight } from "lucide-react";
import { type getDictionary } from "@/app/[lang]/dictionaries";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
type SubscriptionItemProps = {
  name: string;
  price: string | number;
  date: string;
  color: string;
};
function SubscriptionItem({ name, price, date, color }: SubscriptionItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">Renews {date}</p>
        </div>
      </div>
      <div className="text-sm font-mono font-medium text-foreground">
        {typeof price === "number" ? price.toFixed(2) : price} €
      </div>
    </div>
  );
}

export default function HeroSection({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["hero"];
}) {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="lg:text-left text-center">
          <h1 className="lg:mt-10 text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
            {dictionary.title.part_1} <br />
            <span className="text-muted-foreground">
              {dictionary.title.part_2}
            </span>{" "}
            {dictionary.title.part_3}{" "}
            <span className="text-primary italic">
              {dictionary.title.part_4}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed lg:mx-0 mx-auto">
            {dictionary.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="w-fit bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:gap-3 transition-all sm:w-xl mx-auto cursor-pointer hover:shadow-lg hover:bg-primary/90 hover:scale-[1.02]">
              Start tracking for free <ArrowRight />
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl group-hover:bg-primary/10 transition-colors" />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="border-b border-border p-4 flex items-center justify-between bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                workspace / insights
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                    Monthly Burn
                  </p>
                  <p className="text-2xl font-mono font-bold">82.64 €</p>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-primary mb-1">
                    Yearly Impact
                  </p>
                  <p className="text-2xl font-mono font-bold text-primary">
                    991.68 €
                  </p>
                </div>
              </div>
              <div className="space-y-1 border border-border rounded-lg overflow-hidden">
                <SubscriptionItem
                  name="Adobe Creative Cloud"
                  price="44.03"
                  date={formatter.format(new Date())}
                  color="bg-red-500"
                />
                <SubscriptionItem
                  name="ChatGPT Plus"
                  price="23.00"
                  date={formatter.format(
                    new Date().setDate(new Date().getDate() + 28)
                  )}
                  color="bg-gray-500"
                />
                <SubscriptionItem
                  name="Netflix Premium"
                  price="9.99"
                  date={formatter.format(
                    new Date().setDate(new Date().getDate() + 14)
                  )}
                  color="bg-red-600"
                />
                <SubscriptionItem
                  name="Spotify Premium"
                  price="5.62"
                  date={formatter.format(
                    new Date().setDate(new Date().getDate() + 18)
                  )}
                  color="bg-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
