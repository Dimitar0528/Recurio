import { columns } from "@/components/dashboard/data_table/columns";
import { DataTable } from "@/components/dashboard/data_table/DataTable";
import { Button } from "@/components/ui/button";
import type { Subscription } from "@/lib/validations/form";
import {
  Calendar,
  PieChart,
  Percent,
  Wallet,
  ArrowUpRight,
  BellRing,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddSubscriptionForm from "@/components/dashboard/AddSubscriptionForm";
import StatWidget from "@/components/dashboard/StatWidget";
import InsightsSidebar from "@/components/dashboard/InsightsSidebar";
import Link from "next/link";

async function getData(): Promise<Subscription[]> {
  return [
    {
      id: "a1",
      name: "Spotify",
      price: 9.99,
      billingCycle: "Monthly",
      nextBilling: "2024-10-20",
      category: "Entertainment",
      status: "Active",
    },
    {
      id: "b2",
      name: "Amazon Prime",
      price: 139.0,
      billingCycle: "Annual",
      nextBilling: "2024-10-12",
      category: "Software",
      status: "Active",
    },
    {
      id: "c3",
      name: "Adobe Creative Cloud",
      price: 54.99,
      billingCycle: "Monthly",
      nextBilling: "2024-10-15",
      category: "Software",
      status: "Active",
    },
    {
      id: "d4",
      name: "iCloud Storage",
      price: 2.99,
      billingCycle: "Monthly",
      nextBilling: "2024-11-01",
      category: "Software",
      status: "Active",
    },
    {
      id: "e5",
      name: "Coursera Plus",
      price: 399.0,
      billingCycle: "Annual",
      nextBilling: "2025-01-19",
      category: "Education",
      status: "Active",
    },
    {
      id: "f6",
      name: "Notion",
      price: 8.0,
      billingCycle: "Monthly",
      nextBilling: "2024-10-25",
      category: "Utilities",
      status: "Active",
    },
    {
      id: "a1",
      name: "Spotify",
      price: 9.99,
      billingCycle: "Monthly",
      nextBilling: "2024-10-20",
      category: "Entertainment",
      status: "Active",
    },
    {
      id: "b2",
      name: "Amazon Prime",
      price: 139.0,
      billingCycle: "Annual",
      nextBilling: "2024-10-12",
      category: "Software",
      status: "Active",
    },
    {
      id: "c3",
      name: "Adobe Creative Cloud",
      price: 54.99,
      billingCycle: "Monthly",
      nextBilling: "2024-10-15",
      category: "Software",
      status: "Active",
    },
    {
      id: "d4",
      name: "iCloud Storage",
      price: 2.99,
      billingCycle: "Monthly",
      nextBilling: "2024-11-01",
      category: "Software",
      status: "Active",
    },
    {
      id: "e5",
      name: "Coursera Plus",
      price: 399.0,
      billingCycle: "Annual",
      nextBilling: "2025-01-19",
      category: "Education",
      status: "Active",
    },
    {
      id: "f6",
      name: "Notion",
      price: 8.0,
      billingCycle: "Monthly",
      nextBilling: "2024-10-25",
      category: "Utilities",
      status: "Active",
    },
  ];
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl text-center md:text-left font-bold tracking-tight mb-2">
              Workspace
            </h1>
            <p className="text-muted-foreground text-sm text-center md:text-left">
              You have{" "}
              <span className="text-foreground font-medium">12 active</span>{" "}
              subscriptions totaling{" "}
              <span className="text-foreground font-medium">142.60 €</span> this
              month.
            </p>
          </div>
          <Dialog>
            <DialogTrigger render={<div></div>} nativeButton={false}>
              <Button
                variant="outline"
                className="cursor-pointer font-bold text-sm uppercase tracking-wider bg-primary dark:bg-primary dark:hover:bg-primary/85 text-primary-foreground hover:bg-primary/85 hover:text-white p-4 w-85 md:w-70">
                + Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className={"font-bold text-lg"}>
                  New Subscription
                </DialogTitle>
                <DialogDescription>
                  Add a new subscription. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <AddSubscriptionForm />
              <DialogFooter>
                <DialogClose render={<div></div>} nativeButton={false}>
                  <Button variant="outline" className="p-4 cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  form="add-subscription-form"
                  className="p-4 cursor-pointer">
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Link href="/payments" className="mb-8 bg-primary/[0.03] border border-primary/20 rounded-2xl p-4 flex items-center justify-between group hover:bg-primary/[0.06] transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
              <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <BellRing size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold">Upcoming charges detected</p>
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground font-bold">Amazon Prime</span>{" "}
                and <span className="text-foreground font-bold">Adobe CC</span>{" "}
                will charge 193.99 € in the next 72 hours.
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Review Schedule <ArrowUpRight size={14} />
          </div>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatWidget
            label="Monthly Burn"
            value="142.60 €"
            trend="4% vs last mo"
            icon={Wallet}
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
          <div className="lg:col-span-8">
            <div className="px-2">
              <DataTable columns={columns} data={data} />
            </div>
          </div>

          <InsightsSidebar />
        </div>
      </div>
    </div>
  );
}
