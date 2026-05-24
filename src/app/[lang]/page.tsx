import Hero from "@/components/landing_page/Hero";
import Features from "@/components/landing_page/Features";
import DataVisualization from "@/components/landing_page/DataVisualization";
import { Separator } from "@/components/ui/separator";

import { Suspense } from "react";;
import Testimonials from "@/components/landing_page/Testimonials";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "next-intl";
import type { Metadata } from "next";
import CallToAction from "@/components/landing_page/CallToAction";

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const t = await getTranslations({
    locale,
    namespace: "Metadata.landing_page",
  });

  return {
    title: t("title", { brandName: "Recurio" }),
    description: t("description"),
  };
}

export default async function LandingPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  setRequestLocale(lang as Locale);
  const t = await getTranslations("landing_page");
  return (
    <main
      id="main-content"
      className="min-h-screen font-sans selection:bg-primary selection:text-primary-foreground">
      <Suspense>
        <Hero />
      </Suspense>

      <section id="problem" className="py-24 px-6 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-primary mb-8 underline decoration-2 underline-offset-8">
            {t("problem.title")}
          </h2>
          <p className="text-3xl md:text-4xl font-medium leading-[1.3] text-foreground italic">
            {t("problem.quote")}
          </p>
        </div>
      </section>

      <Features />
      <Separator />

      <DataVisualization />
      <Separator />

      <Testimonials />
      <Separator />
      
      <CallToAction />
    </main>
  );
}
