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

export default function Page() {
  return (
    <Dialog>
      <DialogTrigger
        className={"py-16"}
        render={<div></div>}
        nativeButton={false}>
        <Button variant="outline" className="cursor-pointer">+ Add Subscription</Button>
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
  );
}
