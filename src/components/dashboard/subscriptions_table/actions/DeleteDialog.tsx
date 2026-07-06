import * as z from "zod";

import { RateLimitError } from "@/lib/security/rate_limits";
import { deleteSubscription, undoDeleteSubscription } from "@/app/actions";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

type DeleteDialogProps = {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>
  id: string;
  name: string;
  t: ReturnType<
    typeof useTranslations<"dashboard_page.subscription_table_component">
  >;
};
export default function DeleteDialog({
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    id,
    name,
    t,
}: DeleteDialogProps) {
  const requiredPhrase = t("delete_dialog.phrase_template", {
    name: name,
  });
  const deleteSubscriptionSchema = z.object({
    requiredPhrase: z
      .string()
      .refine(
        (val) => val === requiredPhrase,
        t("delete_dialog.validation_error", { phrase: requiredPhrase }),
      ),
  });
  const form = useForm({
    defaultValues: {
      requiredPhrase: "",
    },
    validators: {
      onSubmit: deleteSubscriptionSchema,
    },
    onSubmit: async () => {
      try {
        await deleteSubscription(id);
        setIsDeleteDialogOpen(false);
        toast.success(t("delete_dialog.delete_messages.deleted"), {
          duration: 8000,
          action: {
            label: t("delete_dialog.delete_messages.undo"),
            onClick: async () => await undoDeleteSubscription(id),
          },
        });
      } catch (err) {
        const message =
          err instanceof RateLimitError
            ? t("delete_dialog.delete_messages.rate_limited")
            : t("delete_dialog.delete_messages.error");

        toast.error(message);
      }
    },
  });
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border shadow-2xl">
        <div className="bg-destructive/5 px-6 py-4 border-b border-destructive/10 flex items-center gap-3">
          <div className="p-2 bg-destructive/10 rounded-full text-destructive">
            <AlertTriangle size={20} />
          </div>
          <DialogTitle className="text-destructive">
            {t("delete_dialog.title")}
          </DialogTitle>
        </div>
        <div className="p-4 space-y-6">
          <form
            id="delete-subscription-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}>
            <div className="text-sm leading-relaxed text-foreground/80 space-y-4">
              <p>
                {t.rich("delete_dialog.warning", {
                  important: (c) => (
                    <strong className="text-foreground">{c}</strong>
                  ),
                })}
              </p>
              <div className="p-2 rounded-lg bg-muted/50 border border-border text-xs leading-normal">
                <span className="font-bold text-foreground block mb-1 uppercase tracking-wider">
                  {t("delete_dialog.impact_title")}
                </span>
                {t.rich("delete_dialog.impact_text", {
                  italic: (c) => (
                    <span className="text-muted-foreground italic">{c}</span>
                  ),
                })}
              </div>

              <p className="text-xs bg-accent/50 p-2 rounded-lg border border-border">
                <span className="font-bold">
                  {t("delete_dialog.recommendation_title")}
                </span>{" "}
                {t.rich("delete_dialog.recommendation_text", {
                  critical: (c) => <strong>{c}</strong>,
                  paused: (c) => <strong>{c}</strong>,
                  cancelled: (c) => <strong>{c}</strong>,
                })}
              </p>
            </div>

            <div className="space-y-3 select-none">
              <Label className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground mt-4">
                {t("delete_dialog.verification_label")}
              </Label>
              <div className="p-3 bg-secondary/50 border border-border rounded-md text-sm mb-2">
                <span className="text-muted-foreground">
                  {t("delete_dialog.type_phrase")}{" "}
                </span>
                <span className="font-mono font-bold text-destructive">
                  {requiredPhrase}
                </span>
              </div>
              <FieldGroup>
                <form.Field name="requiredPhrase">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          aria-describedby="requiredPhraseError"
                          placeholder={t("delete_dialog.placeholder")}
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError
                            id="requiredPhraseError"
                            errors={field.state.meta.errors}
                            aria-live="polite"
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </div>
          </form>
        </div>

        <DialogFooter className="bg-muted/30 p-4 mb-1 mx-2 border-t border-border gap-2">
          <DialogClose
            render={
              <Button
                variant="outline"
                className="cursor-pointer border-border hover:bg-accent font-semibold outline-dashed">
                {t("delete_dialog.cancel")}
              </Button>
            }
          />
          <Button
            type="submit"
            form="delete-subscription-form"
            disabled={!form.state.canSubmit}
            variant="destructive"
            className="cursor-pointer font-bold shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase">
            {t("delete_dialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
