"use client";

import { useAuth } from "@clerk/nextjs";
import { Repeat } from "lucide-react";
import { Route } from "next";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const locale = useLocale();
  const { isSignedIn } = useAuth();
  const tReusable = useTranslations("Reusable.footer_component");
  const tCommonLinks = useTranslations("Reusable.common_links");

  return (
    <footer className="relative border-t border-border bg-background py-12 px-6 sm:px-12 md:py-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-7xl bg-linear-to-r from-transparent via-border to-transparent" />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">
        <div className="max-w-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Repeat size={20} className="text-primary-foreground" />
            </div>
            <Link
              href={isSignedIn ? `/${locale}/dashboard` : ("/" as Route)}
              className="text-lg font-bold">
              <span className="text-xl font-bold text-primary hover:underline hover:underline-offset-4 uppercase tracking-tight">
                Recurio
              </span>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tReusable("description")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16 w-full lg:w-auto">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/80">
              {tReusable("product_column")}
            </h4>
            <ul className="text-sm space-y-3 text-muted-foreground">
              <li>
                <Link
                  href={`/${locale}/dashboard`}
                  className="hover:text-foreground transition-colors hover:underline hover:underline-offset-4 hover:decoration-primary decoration-2">
                  {tCommonLinks("dashboard_link")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/dashboard`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1 hover:underline hover:underline-offset-4 hover:decoration-primary decoration-2">
                  {tCommonLinks("payments_link")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/80">
              {tReusable("legal_column.name")}
            </h4>
            <ul className="text-sm space-y-3 text-muted-foreground">
              <li>
                <Link
                  href={`/${locale}/privacy-policy`}
                  className="hover:text-foreground transition-colors hover:underline hover:underline-offset-4 hover:decoration-primary decoration-2">
                  {tReusable("legal_column.privacy_policy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms-of-use`}
                  className="hover:text-foreground transition-colors hover:underline hover:underline-offset-4 hover:decoration-primary decoration-2">
                  {tReusable("legal_column.terms-of-use")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-border/60 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Recurio. {tReusable("rights_reserved")}
        </p>
      </div>
    </footer>
  );
}
