import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { bgBG, enGB } from "@clerk/localizations";
import { shadcn } from "@clerk/themes";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata.root_layout");
  return {
    title: {
      template: "%s - Recurio",
      default: "Recurio",
    },
    description: t("description"),
    generator: "Next.js",
    applicationName: "Recurio",
  };
}

export async function generateStaticParams() {
  return [{ lang: "bg" }, { lang: "en" }];
}
export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }
  // enable static rendering, by distribuing the locale that is received via params 
  // to all next-intl API's and storing it inside a cache.
  setRequestLocale(lang);
  return (
    <NextIntlClientProvider>
      <html lang={lang} className={notoSans.variable} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Suspense>
            <ClerkProvider
              localization={lang === "bg" ? bgBG : enGB}
              appearance={{
                theme: [shadcn],
                layout: {
                  socialButtonsVariant: "blockButton",
                },
              }}>
              <Toaster position="top-center" richColors closeButton />
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                enableColorScheme>
                <Navigation />

                <main>{children}</main>
                <Footer />
              </ThemeProvider>
            </ClerkProvider>
          </Suspense>
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
