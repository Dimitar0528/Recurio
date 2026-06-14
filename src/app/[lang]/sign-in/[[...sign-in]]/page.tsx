import { SignIn } from "@clerk/nextjs";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const t = await getTranslations({
    locale,
    namespace: "Metadata.sign_in_page",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const locale = (await params).lang as Locale;
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px] animate-pulse dark:bg-purple-900/15" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse dark:bg-indigo-900/15 [animation-delay:2s]" />
      </div>

      <div className="relative w-full max-w-md">
        <ClerkLoading>
          <div
            className="flex flex-col justify-center items-center min-h-[500px] w-full rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/70 p-8 text-center shadow-2xl"
            aria-live="polite"
            aria-busy="true">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/50 mb-6">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {locale === "bg"
                ? "Зареждане на защитен достъп"
                : "Loading Secure Access"}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {locale === "bg"
                ? "Подготовка на работното ви място. Моля, изчакайте..."
                : "Preparing your workspace. Please wait..."}
            </p>
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          <SignIn
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "iconButton",
              },
              variables: {
                colorPrimary: "#8b5cf6",
                colorTextSecondary: "#94a3b8",
                borderRadius: "1rem",
              },
              elements: {
                cardBox:
                  "shadow-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden w-full",
                card: "bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl p-8 border-none shadow-none",
                formFieldInput:
                  "bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 rounded-xl transition-all duration-200 px-4 py-3 text-sm",
                formFieldLabel:
                  "text-slate-700 dark:text-slate-300 font-semibold text-xs tracking-wider uppercase mb-1.5",
                formButtonPrimary:
                  "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-purple-500/20 text-white font-medium text-sm py-2.5 rounded-xl border-0 active:scale-[0.98]",
                socialButtonsBlockButton:
                  "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 active:scale-[0.98]",
                socialButtonsBlockButtonText:
                  "text-slate-700 dark:text-slate-300 font-medium",
                headerTitle:
                  "text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2",
                headerSubtitle:
                  "text-slate-500 dark:text-slate-400 text-sm mb-6",
                dividerRow: "my-6",
                dividerLine: "bg-slate-200 dark:bg-slate-800",
                dividerText:
                  "text-slate-400 text-xs font-semibold px-3 uppercase tracking-wider",
                footerActionText: "text-slate-500 dark:text-slate-400 text-sm",
                footerActionLink:
                  "text-purple-600 dark:text-purple-400 hover:text-purple-500 hover:underline font-semibold transition-colors duration-200",
              },
            }}
          />
        </ClerkLoaded>
      </div>
    </div>
  );
}
