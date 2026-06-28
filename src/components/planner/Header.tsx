"use client"

import { priceFormatter } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";


export default function Header(){
    const {user} = useUser();
    const netSalary = user?.unsafeMetadata.net_salary
    return (
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-primary bg-clip-text text-transparent">
            Subscription Planner
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Visualize hierarchy shifts, weight, and lifestyle opportunity costs
            in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 ">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Monthly Net Income:
          </span>
          <div className="relative max-w-[110px]">
            <div className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg pl-2 pr-6 py-1 text-sm font-mono text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              {netSalary != undefined && (priceFormatter(netSalary))}
            </div>
          </div>
        </div>
      </section>
    );
}