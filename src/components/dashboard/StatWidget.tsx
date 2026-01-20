import { TrendingDown, LucideIcon } from "lucide-react";

type StarWidgetProps = {
  label: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
};

export default function StatWidget ({ label, value, trend, icon: Icon }: StarWidgetProps){
    return (
      <div className="bg-primary/15 border border-border p-4 rounded-xl group hover:border-primary/40 transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-secondary text-muted-foreground group-hover:text-primary transition-colors shrink-0">
            <Icon size={18} className="dark:text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-foreground uppercase tracking-widest truncate mb-0.5">
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-mono font-bold text-foreground leading-none">
                {value}
              </p>
              {trend && (
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 whitespace-nowrap">
                  <TrendingDown size={10} /> {trend}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}
;
