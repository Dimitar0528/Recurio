import {
  Plus,
  Filter,
  ArrowUpRight,
  AlertCircle,
  CreditCard,
  Calendar,
  PieChart,
  MoreHorizontal,
  TrendingDown,
  ChevronRight,
  Download,
  Percent,
} from "lucide-react";
// --- Types ---

interface Subscription {
  id: string;
  name: string;
  category: string;
  price: number;
  billing: "Monthly" | "Yearly";
  nextDate: string;
  status: "Active" | "Paused" | "Trial";
}

// --- Mock Data ---

const MOCK_SUBS: Subscription[] = [
  {
    id: "1",
    name: "Adobe Creative",
    category: "Design",
    price: 44.03,
    billing: "Monthly",
    nextDate: "2024-10-12",
    status: "Active",
  },
  {
    id: "2",
    name: "ChatGPT Plus",
    category: "AI",
    price: 20.0,
    billing: "Monthly",
    nextDate: "2024-10-18",
    status: "Active",
  },
  {
    id: "3",
    name: "Dropbox",
    category: "Cloud",
    price: 119.0,
    billing: "Yearly",
    nextDate: "2024-11-04",
    status: "Active",
  },
  {
    id: "4",
    name: "Peloton",
    category: "Fitness",
    price: 12.99,
    billing: "Monthly",
    nextDate: "2024-10-15",
    status: "Paused",
  },
];

// --- Sub-components ---

const StatWidget = ({ label, value, trend, icon: Icon }: any) => (
  <div className="bg-card border border-border p-5 rounded-2xl relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-secondary text-muted-foreground group-hover:text-primary transition-colors">
        <Icon size={20} />
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <TrendingDown size={10} /> {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-2xl font-mono font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* 1. Global Navigation (No Sidenav) */}

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {/* 2. Urgent Alerts (Time Awareness) */}
        <div className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">
                Upcoming: 3 Renewals this week
              </p>
              <p className="text-xs text-muted-foreground">
                Totaling 74.02 € — ensure your primary card has sufficient
                funds.
              </p>
            </div>
          </div>
          <ChevronRight
            size={18}
            className="text-primary opacity-0 group-hover:opacity-100 transition-all mr-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatWidget
            label="Monthly Burn"
            value="142.60 €"
            trend="4% vs last month"
            icon={CreditCard}
          />
          <StatWidget
            label="Yearly Impact"
            value="1,711.20 €"
            icon={Calendar}
          />
          <StatWidget label="Active Subs" value="12" icon={PieChart} />
          <StatWidget label="Income Ratio" value="4.2%" icon={Percent} />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* 4. Main Subscription Manager */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">
                Active Commitments
              </h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-border rounded-lg hover:bg-secondary transition-colors">
                  <Filter size={14} /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  <Plus size={14} /> New Subscription
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Service
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Cost
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Next Billing
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_SUBS.map((sub) => (
                    <tr
                      key={sub.id}
                      className="group hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              sub.status === "Active"
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                : "bg-zinc-500 opacity-40"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-bold">{sub.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-medium">
                              {sub.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm font-bold">
                        {sub.price.toFixed(2)} €
                        <span className="text-[10px] text-muted-foreground ml-1 font-sans">
                          /{sub.billing === "Monthly" ? "mo" : "yr"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(sub.nextDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-border bg-muted/10 flex justify-center">
                <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View all 12 subscriptions <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* 5. Insight Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <PieChart size={16} className="text-primary" /> Category
                Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Design & Creative",
                    value: 45,
                    color: "bg-primary",
                  },
                  { label: "Entertainment", value: 30, color: "bg-purple-500" },
                  { label: "Productivity", value: 15, color: "bg-blue-500" },
                  { label: "Other", value: 10, color: "bg-zinc-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted-foreground font-medium">
                        {item.label}
                      </span>
                      <span className="font-bold">{item.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-foreground text-background rounded-2xl p-6 relative overflow-hidden group">
              <Download
                size={80}
                className="absolute -right-4 -bottom-4 text-background/5 rotate-12 group-hover:rotate-0 transition-transform duration-500"
              />
              <h3 className="text-sm font-bold mb-2 relative z-10">
                Export Report
              </h3>
              <p className="text-xs text-background/60 mb-4 relative z-10 leading-relaxed">
                Generate a PDF audit of your yearly spending to help with tax
                deductions or financial planning.
              </p>
              <button className="w-full bg-background text-foreground py-2 rounded-lg text-xs font-bold hover:bg-background/90 transition-colors relative z-10">
                Download .PDF
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
