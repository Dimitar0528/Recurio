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
import { Button } from "../ui/button";
type SubscriptionDialogProps = {
  trigger: React.ReactElement;
  title: string;
  description: string;
  submitLabel: string;
  children: React.ReactNode;
};

export default function SubscriptionDialog({
  trigger,
  title,
  description,
  submitLabel,
  children,
}: SubscriptionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-lg">
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {children}

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" className="p-4 cursor-pointer">
                Cancel
              </Button>
            }
          />
          <Button
            type="submit"
            form="subscription-form"
            className="p-4 cursor-pointer">
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
