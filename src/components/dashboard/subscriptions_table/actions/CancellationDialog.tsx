import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Route } from "next";
import { useTranslations } from "next-intl";

type CancellationStep = {
  order: number;
  title: string;
  description: string;
};

type CancellationGuide = {
  id: string;
  service_name: string;
  cancel_url: string;
  difficulty: "easy" | "medium" | "hard";
  estimated_minutes: number;
  steps_json: unknown;
  last_verified_at: Date
};

type CancellationDialogProps = {
  isCancelDialogOpen: boolean;
  setIsCancelDialogOpen: Dispatch<SetStateAction<boolean>>;
  guide: CancellationGuide | null | undefined;
  isLoading: boolean;
  isError: boolean;
  serviceName: string;
  t: ReturnType<
    typeof useTranslations<"dashboard_page.subscription_table_component">
  >;
};

export default function CancellationDialog({
    isCancelDialogOpen,
    setIsCancelDialogOpen,
    guide,
    isLoading,
    isError,
    serviceName,
    t
}: CancellationDialogProps) {
  const tReusable = useTranslations("Reusable")
  const steps = (guide?.steps_json as CancellationStep[]) || [];

   return (
     <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
       <DialogContent className="sm:max-w-[480px]">
         <DialogHeader className="relative">
           <DialogTitle className="text-xl relative">
             {t("cancel_assistant_dialog.title")} {serviceName}
           </DialogTitle>
           <span className="absolute right-5.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[8px] tracking-wide uppercase font-bold px-1 py-0.5 rounded pointer-events-none select-none leading-none z-10 tab">
             {t("cancel_assistant_dialog.label")}
           </span>
           <DialogDescription>
             {t("cancel_assistant_dialog.description")}
           </DialogDescription>
         </DialogHeader>

         {isLoading ? (
           <div className="space-y-4">
             <div className="flex gap-2">
               <div className="h-4 w-24 bg-muted animate-pulse rounded" />
               <div className="h-4 w-20 bg-muted animate-pulse rounded" />
             </div>

             <div className="space-y-2">
               <div className="h-3 w-20 bg-muted animate-pulse rounded" />
               <div className="space-y-3 pt-1">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex gap-3 items-start">
                     <div className="h-4 w-4 shrink-0 rounded-full bg-muted animate-pulse" />
                     <div className="space-y-1.5 flex-1">
                       <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
                       <div className="h-2.5 w-full bg-muted animate-pulse rounded" />
                       <div className="h-2.5 w-3/4 bg-muted animate-pulse rounded" />
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
               <div className="h-6 sm:w-24 w-full bg-muted animate-pulse rounded" />
               <div className="h-6 flex-1 w-full bg-muted animate-pulse rounded" />
             </DialogFooter>
           </div>
         ) : isError ? (
           <div className="py-6 flex flex-col items-center text-center gap-4">
             <AlertCircle className="h-8 w-8 text-destructive" />
             <p className="text-sm text-muted-foreground max-w-sm">
               {t("cancel_assistant_dialog.error_message", {
                 serviceName: serviceName,
               })}
             </p>
             <DialogFooter className="w-full flex justify-center">
               <DialogClose
                 render={
                   <Button
                     variant="outline"
                     className="cursor-pointer border-border hover:bg-accent font-semibold">
                     {t("price_history_dialog.close")}
                   </Button>
                 }
               />
             </DialogFooter>
           </div>
         ) : !guide ? (
           <div className="py-6 flex flex-col items-center text-center gap-4">
             <AlertCircle className="h-8 w-8 text-muted-foreground" />
             <p className="text-sm text-muted-foreground max-w-sm">
               {t("cancel_assistant_dialog.not_found_message", {
                 serviceName: serviceName,
               })}
             </p>
             <DialogFooter>
               <DialogClose
                 render={
                   <Button
                     variant="outline"
                     className="cursor-pointer border-border hover:bg-accent font-semibold">
                     {t("price_history_dialog.close")}
                   </Button>
                 }
               />
               <Button className="p-4 cursor-pointer bg-primary dark:bg-primary/50 dark:hover:bg-primary/70 text-primary-foreground hover:bg-primary/85 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all uppercase">
                 <Link
                   href={`https://www.google.com/search?q=how+to+cancel+${encodeURIComponent(serviceName || "")}`}
                   target="_blank"
                   rel="noopener noreferrer">
                   {t("cancel_assistant_dialog.actions.search_google")}
                 </Link>
               </Button>
             </DialogFooter>
           </div>
         ) : (
           <div className="space-y-4">
             <div className="flex gap-2">
               <Badge
                 variant={
                   guide.difficulty === "easy"
                     ? "secondary"
                     : guide.difficulty === "medium"
                       ? "outline"
                       : "destructive"
                 }
                 className="capitalize">
                 {tReusable(`cancellation_difficulty.${guide.difficulty}`)} {" "}
                 {t("cancel_assistant_dialog.difficulty")}
               </Badge>
               <Badge
                 variant="outline"
                 className="flex items-center gap-1 text-muted-foreground">
                 <Clock className="h-3 w-3" />
                 {t("cancel_assistant_dialog.est_time", {
                   estimated_minutes: String(guide.estimated_minutes),
                 })}
               </Badge>
             </div>

             <div className="space-y-2">
               <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                 {t("cancel_assistant_dialog.instructions")}
               </p>
               <div className="space-y-2">
                 {steps.map((step) => (
                   <div key={step.order} className="flex gap-3 items-start">
                     <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                       {step.order}
                     </div>
                     <div className="space-y-0.5">
                       <h4 className="text-xs font-semibold leading-none">
                         {step.title}
                       </h4>
                       <p className="text-[11px] text-muted-foreground">
                         {step.description}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <DialogFooter className="flex flex-col sm:flex-row gap-2">
               <DialogClose
                 render={
                   <Button
                     variant="outline"
                     className="cursor-pointer border-border hover:bg-accent font-semibold">
                     {t("price_history_dialog.close")}
                   </Button>
                 }
               />
               <Button className="p-4 cursor-pointer bg-primary dark:bg-primary/50 dark:hover:bg-primary/70 text-primary-foreground hover:bg-primary/85 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all uppercase">
                 <Link
                   href={guide.cancel_url as Route}
                   target="_blank"
                   rel="noopener noreferrer">
                   {t("cancel_assistant_dialog.actions.open_page")}
                 </Link>
               </Button>
             </DialogFooter>
           </div>
         )}
       </DialogContent>
     </Dialog>
   );
}
