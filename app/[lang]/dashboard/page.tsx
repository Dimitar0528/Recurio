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
import { columns, Subscription } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/DataTable";

async function getData(): Promise<Subscription[]> {
  // Dummy data for now
  return [
    {
      id: "728ed52f",
      name: "Netflix",
      price: 15.99,
      billingCycle: "Monthly",
      nextBillDate: new Date().toISOString().split("T")[0],
      category: "Entertainment",
      subscriptionStatus: "Active",
    },
    // ...
  ];
}
export default async function Page() {
  const data = await getData();
  return (
    <div className="py-24 px-12">
      <DataTable columns={columns} data={data} />
      <Dialog>
        <DialogTrigger
          className={"inline"}
          render={<div></div>}
          nativeButton={false}>
          <Button variant="outline" className="cursor-pointer">
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
  );
}
