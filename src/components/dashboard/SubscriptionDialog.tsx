"use client";
import { useState } from "react";
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
import { DialogCloseContext } from "@/context/subscription-dialog-context";

type SubscriptionDialogProps = {
  trigger: React.ReactElement;
  title: string;
  description: string;
  submitLabel: string;
  cancelLabel: string;
  children: React.ReactNode;
};

export default function SubscriptionDialog({
  trigger,
  title,
  description,
  submitLabel,
  cancelLabel,
  children,
}: SubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <DialogCloseContext.Provider value={() => setOpen(false)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={trigger} />
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {children}

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" className="p-4 cursor-pointer">
                  {cancelLabel}
                </Button>
              }
            />
            <Button
              type="submit"
              form="subscription-form"
              className="p-4 cursor-pointer bg-primary dark:bg-primary/50 dark:hover:bg-primary/70 text-primary-foreground hover:bg-primary/85 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all uppercase">
              {submitLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogCloseContext.Provider>
  );
}
