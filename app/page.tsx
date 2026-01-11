"use client"

import React, { useState, useEffect } from 'react';
import { 
  ArrowRightIcon, 
  CalendarIcon, 
  ChartPieSliceIcon, 
  CreditCardIcon, 
  EyeIcon, 
  TrendUpIcon, 
  WarningIcon, 
  ShieldCheckIcon,
  MoonIcon,
  SunIcon,
  Icon
} from '@phosphor-icons/react';
import Hero from '@/components/landing_page/Hero';
import Features from '@/components/landing_page/Features';
import DataVisualization from "@/components/landing_page/DataVisualization";
import { Separator } from '@/components/ui/separator';

type MetricCardProps = {
  label: string;
  value: string | number;
  subtext: string;
  icon: Icon;
  color?: string;
}
function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-secondary text-foreground">
          <Icon size={24} color="oklch(0.59 0.20 277)" weight="duotone" />
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-3xl font-mono font-bold mb-1">{value}</div>
      <p className="text-sm text-muted-foreground">{subtext}</p>
    </div>
  );
}
export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-primary-foreground">
        <Hero />

        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Efficiency Score"
              value="69%"
              subtext="Top 15% of users in your region"
              icon={ChartPieSliceIcon}
            />
            <MetricCard
              label="Pending Subscriptions"
              value="02"
              subtext="Expiring in the next 48 hours"
              icon={WarningIcon}
            />
            <MetricCard
              label="Income Leak"
              value="4.2%"
              subtext="Percentage of net monthly pay"
              icon={CreditCardIcon}
            />
            <MetricCard
              label="Annual Burn"
              value="$2,140"
              subtext="Total committed yearly spend"
              icon={TrendUpIcon}
            />
          </div>
        </section>

        <section id="problem" className="py-18 px-6 border-y border-border">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-primary mb-8 underline decoration-2 underline-offset-8">
              The Problem
            </h2>
            <p className="text-3xl md:text-4xl font-medium leading-[1.3] text-foreground italic">
              "We are living in an era of 'Subscription Creep'. We trade
              long-term financial freedom for short-term digital convenience,
              10 € at a time."
            </p>
          </div>
        </section>

        <Features />
        <Separator />
        <DataVisualization />

        <section className="pb-16 pt-4 px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Take back the keys.</h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Recurio is free for up to 5 subscriptions. No credit card
              required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold cursor-pointer hover:shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all ">
                Start Tracking Now
              </button>
              <button className="w-full sm:w-auto bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-bold border border-border cursor-pointer hover:bg-secondary/60 transition-colors  ">
                Read our Privacy Manifesto
              </button>
            </div>
          </div>
        </section>
    </div>
  );
}