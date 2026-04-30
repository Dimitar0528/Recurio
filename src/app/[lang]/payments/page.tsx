"use client";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  CreditCard,
  History,
  AlertCircle,
} from "lucide-react";

// --- Mock Data ---
const RECENT_PAYMENTS = [
  {
    id: "1",
    name: "Spotify Premium",
    price: 9.99,
    date: "Yesterday",
    status: "settled",
    color: "bg-emerald-500",
  },
  {
    id: "2",
    name: "Adobe Creative",
    price: 44.03,
    date: "3 days ago",
    status: "settled",
    color: "bg-red-500",
  },
  {
    id: "3",
    name: "iCloud+",
    price: 0.99,
    date: "5 days ago",
    status: "settled",
    color: "bg-blue-500",
  },
];

const UPCOMING_RENEWALS = [
  {
    id: "4",
    name: "ChatGPT Plus",
    price: 20.0,
    date: "In 2 days",
    status: "pending",
    color: "bg-zinc-500",
  },
  {
    id: "5",
    name: "Netflix",
    price: 17.99,
    date: "In 4 days",
    status: "pending",
    color: "bg-red-600",
  },
];

const HISTORY_LEDGER = [
  {
    id: "101",
    name: "Amazon Prime",
    price: 139.0,
    date: "Sep 12, 2024",
    method: "•••• 4242",
    category: "Software",
  },
  {
    id: "102",
    name: "Notion",
    price: 8.0,
    date: "Sep 10, 2024",
    method: "Apple Pay",
    category: "Utilities",
  },
  {
    id: "103",
    name: "Spotify",
    price: 9.99,
    date: "Aug 20, 2024",
    method: "•••• 4242",
    category: "Entertainment",
  },
  {
    id: "104",
    name: "Coursera",
    price: 399.0,
    date: "Aug 15, 2024",
    method: "PayPal",
    category: "Education",
  },
];

// --- Sub-Components ---

const SectionHeader = ({ title, icon: Icon, description }: any) => (
  <div className="flex flex-col mb-6">
    <div className="flex items-center gap-2 mb-1">
      <div className="p-1.5 bg-primary/10 rounded-md text-primary">
        <Icon size={16} />
      </div>
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
    </div>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
);

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 px-6  ">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h1 className="text-3xl font-bold tracking-tighter mb-2">
              Payments
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
              Monitor your recent settlements and prepare for upcoming
              obligations in the current billing cycle.
            </p>
        </div>

        {/* 2. The Horizon Row (7-Day Windows) */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Recent (Last 7 Days) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}>
            <SectionHeader
              title="Recent Settlements"
              icon={CheckCircle2}
              description="Successfully processed in the last 7 days."
            />
            <div className="space-y-3">
              {RECENT_PAYMENTS.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-card border border-border p-4 rounded-2xl flex items-center justify-between hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full ${item.color} bg-opacity-10 flex items-center justify-center text-emerald-600`}>
                      <ArrowDownLeft size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold">
                      {item.price.toFixed(2)} €
                    </p>
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      Settled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Upcoming (Next 7 Days) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <SectionHeader
              title="Imminent Renewals"
              icon={Clock}
              description="Projected charges for the coming week."
            />
            <div className="space-y-3">
              {UPCOMING_RENEWALS.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center justify-between group hover:bg-primary/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-[10px] uppercase font-bold text-primary tracking-widest">
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-primary">
                      {item.price.toFixed(2)} €
                    </p>
                    <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter italic">
                      Reviewing
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* 3. Full History Ledger */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <History size={20} className="text-muted-foreground" />
              <h2 className="text-xl font-bold tracking-tight">
                Full Transaction History
              </h2>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest bg-secondary px-3 py-1 rounded-md">
              Showing last 30 entries
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-black/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">
                      Billing Date
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">
                      Service
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">
                      Payment Method
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {HISTORY_LEDGER.map((history, idx) => (
                    <motion.tr
                      key={history.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      className="group hover:bg-muted/20 transition-all cursor-default">
                      <td className="px-8 py-6 text-sm font-mono text-muted-foreground italic">
                        {history.date}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground">
                            {history.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground/60">
                            {history.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <CreditCard size={12} />
                          {history.method}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-mono font-bold text-foreground">
                            {history.price.toFixed(2)} €
                          </span>
                          <button className="p-1.5 opacity-0 group-hover:opacity-100 bg-secondary rounded-md text-muted-foreground hover:text-primary transition-all">
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
