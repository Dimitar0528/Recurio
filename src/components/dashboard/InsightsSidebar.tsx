import { Download, PieChart, ShieldCheck } from "lucide-react";

export default function InsightsSidebar(){
    return (
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
            <PieChart size={16} className="text-primary" /> Category Breakdown
          </h3>
          <div className="space-y-5">
            {[
              {
                label: "Software",
                value: 58,
                money: "69.56 €",
                color: "bg-primary",
              },
              {
                label: "Education",
                value: 27,
                money: "33.25 €",
                color: "bg-blue-500",
              },
              {
                label: "Entertainment",
                value: 8,
                money: "9.99 €",
                color: "bg-purple-500",
              },
              {
                label: "Utilities",
                value: 7,
                money: "8.00 €",
                color: "bg-zinc-500",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-2 items-baseline">
                  <span className="text-muted-foreground font-medium">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">
                      {item.money}
                    </span>
                    <span className="text-muted-foreground text-[12px]">
                      ({item.value}%)
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-foreground text-background rounded-2xl p-6 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-3 opacity-20">
            <ShieldCheck size={40} />
          </div>
          <h3 className="text-sm font-bold mb-2 relative z-10 flex items-center gap-2">
            <Download size={16} />
            Export Audit
          </h3>
          <p className="text-xs text-background/60 mb-6 relative z-10 leading-relaxed">
            Need this for accounting? Export your full recurring history into a
            verified PDF report.
          </p>
          <button className="w-full bg-background text-foreground py-3 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 flex items-center justify-center gap-2 shadow-xl shadow-black/20 cursor-pointer">
            Download Financial Audit
          </button>
        </div>
      </div>
    );
}