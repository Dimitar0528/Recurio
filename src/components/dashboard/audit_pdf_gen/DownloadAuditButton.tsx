"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Subscription, BillingEvent } from "@/lib/validations/schemas";
import { Button } from "@base-ui/react";
import { useTranslations } from "use-intl";

type DownloadAuditButtonProps = {
  subscriptions: Subscription[];
  billingEvents: BillingEvent[];
  label: string;
};

export default function DownloadAuditButton({
  subscriptions,
  billingEvents,
  label,
}: DownloadAuditButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const t = useTranslations("dashboard_page.audit_pdf_component.download");
  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const { pdf } = await import("@react-pdf/renderer");
      const { AuditPdfDocument } = await import("./AuditPdfDocument");
      // Compile document to PDF blob
      const doc = (
        <AuditPdfDocument
          subscriptions={subscriptions}
          billingEvents={billingEvents}
        />
      );
      const blob = await pdf(doc).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Recurio_Financial_Audit_${new Date().getFullYear()}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(t("success"));
    } catch (error) {
      console.error(t("error"), error);
      toast.error(t("error"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      className="shrink-0 bg-background text-foreground px-8 py-3 font-mono font-bold text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-xl shadow-black/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
      }}>
      <Download size={14} className={isGenerating ? "animate-pulse" : ""} />
      {isGenerating ? t("loading") : label}
    </Button>
  );
}
