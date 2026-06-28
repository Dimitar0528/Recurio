"use client";
import { Sparkles } from "lucide-react";
import {
  useSubscription,
  PRESETS,
  getPeriodLabel,
} from "@/context/SubscriptionPlannerContext";
import { priceFormatter } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Category, CATEGORY_VALUES } from "@/lib/validations/enums";
import { Input } from "../ui/input";

export default function LeftColumn() {
  const {
    hypotheticalName,
    setHypotheticalName,
    hypotheticalCategory,
    setHypotheticalCategory,
    hypotheticalPrice,
    setHypotheticalPrice,
    hypotheticalPeriod,
    setHypotheticalPeriod,
    handleLoadPresetToDraft,
  } = useSubscription();

  const PERIOD_OPTIONS = [
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Yearly", label: "Yearly" },
  ] as const;

  return (
    <div className="lg:col-span-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto pr-0 lg:pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3">
          Quick-Reference Presets
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              className="group flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs transition-all duration-150 cursor-pointer animate-fade-in text-left"
              onClick={() => handleLoadPresetToDraft(p)}>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {p.name}
              </span>
              <span className="text-[10px] text-primary dark:text-slate-500 font-mono">
                {priceFormatter(p.price)}/{getPeriodLabel(p.period)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none" />
        <h2 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 animate-pulse" />
          Draft Sandbox
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Subscription Name
              </label>
              <Input
                type="text"
                value={hypotheticalName}
                onChange={(e) => setHypotheticalName(e.target.value)}
                placeholder="Enter potential service..."
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <Select
                onValueChange={(value: Category | null) => {
                  if (value) setHypotheticalCategory(value);
                }}>
                <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-200 font-mono">
                  <SelectValue placeholder="Select Category">
                    {hypotheticalCategory}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CATEGORY_VALUES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Cost
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">
                  €
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={hypotheticalPrice}
                  onChange={(e) => setHypotheticalPrice(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-8 text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Cycle
              </label>
              <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-850 gap-0.5">
                {PERIOD_OPTIONS.map(({ value, label }) => {
                  const isActive = hypotheticalPeriod === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setHypotheticalPeriod(value)}
                      className={`flex-1 text-center py-1.5 text-[10px] font-bold rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] ${
                        isActive
                          ? "bg-indigo-600 text-white shadow hover:bg-indigo-500"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
