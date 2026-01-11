import { EyeIcon } from "@phosphor-icons/react";

export default function DataVisualization() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-primary font-mono text-xs mb-6 mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                LIVE PROJECTION ENGINE
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-6 leading-tight text-center lg:text-left">
                The cost of "Just one more."
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed text-center lg:text-left max-w-lg mx-auto lg:mx-0">
                A 15 €/month subscription isn't a 15 € decision. It's an 1,800 €
                decision over a decade. When visualized, "small" choices reveal
                their true <strong className="uppercase text-black dark:text-gray-200">large</strong> scale.
              </p>

              <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
                <div className="mx-auto lg:mx-0">
                  <p className="text-3xl font-mono font-bold">10 Years</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Horizon
                  </p>
                </div>
                <div className="mx-auto lg:mx-0">
                  <p className="text-3xl font-mono font-bold text-primary">
                    120x
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Multiplier
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-8 md:p-16 border-l border-border">
              <div className="space-y-12">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      Year 01 Impact
                    </span>
                    <span className="font-mono text-sm">180.00 €</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-foreground/20 w-[10%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      Year 05 Impact
                    </span>
                    <span className="font-mono text-sm">900.00 €</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-foreground/40 w-[40%]" />
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold uppercase tracking-tighter text-primary">
                      Year 10 Impact
                    </span>
                    <span className="font-mono text-xl font-bold text-primary">
                      1,800.00 €
                    </span>
                  </div>
                  <div className="h-4 w-full bg-primary/10 rounded-full overflow-hidden border border-primary/20">
                    <div className="h-full bg-primary w-full" />
                  </div>
                  <div className="absolute -top-12 -right-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded text-[10px] font-bold rotate-6 shadow-xl">
                    OPPORTUNITY COST
                  </div>
                </div>

                <div className="pt-4 flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                  <EyeIcon className="text-primary mt-1" size={20} />
                  <p className="text-xs text-muted-foreground leading-normal">
                    Calculated based on a single 14.99 €/mo service. This does
                    not account for annual price increases, which Recurio also
                    tracks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
