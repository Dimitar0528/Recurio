import AddSubscriptionForm from "@/components/dashboard/AddSubscriptionForm";
import { Button } from "@/components/ui/button";
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
import { columns, Subscription } from "@/components/dashboard/data_table/columns";
import { DataTable } from "@/components/dashboard/data_table/DataTable";

async function getData(): Promise<Subscription[]> {
  // Dummy data for now
  return [
    {
      id: "a18cd91e",
      name: "Spotify",
      price: 9.99,
      billingCycle: "Monthly",
      nextBilling: new Date().toISOString().split("T")[0],
      category: "Entertainment",
      status: "Active",
    },
    {
      id: "b72fa03d",
      name: "Amazon Prime",
      price: 139.0,
      billingCycle: "Annual",
      nextBilling: new Date().toISOString().split("T")[0],
      category: "Software",
      status: "Active",
    },
    {
      id: "c91de44a",
      name: "Adobe Creative Cloud",
      price: 54.99,
      billingCycle: "Monthly",
      nextBilling: new Date().toISOString().split("T")[0],
      category: "Software",
      status: "Active",
    },
    {
      id: "d55ab821",
      name: "iCloud Storage",
      price: 2.99,
      billingCycle: "Monthly",
      nextBilling: new Date().toISOString().split("T")[0],
      category: "Software",
      status: "Active",
    },
    {
      id: "e803fa19",
      name: "Coursera Plus",
      price: 399.0,
      billingCycle: "Annual",
      nextBilling: new Date().toISOString().split("T")[0],
      category: "Education",
      status: "Active",
    },
    {
      id: "f4c9127b",
      name: "Notion",
      price: 8.0,
      billingCycle: "Monthly",
      nextBilling: new Date().toISOString().split("T")[0],
      category: "Utilities",
      status: "Active",
    },
    // ...
  ];
}
export default async function Page() {
  const data = await getData();
  return (
    <div className="py-24 px-12">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
