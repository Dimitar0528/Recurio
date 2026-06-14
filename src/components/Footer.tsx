"use client";

import { useAuth } from "@clerk/nextjs";
import { Repeat } from "lucide-react";
import { Route } from "next";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const locale = useLocale();
  const { isSignedIn } = useAuth();

  return (
    <footer className="relative border-t border-border bg-background py-12 px-6 sm:px-12 md:py-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-7xl bg-linear-to-r from-transparent via-border to-transparent" />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">
        <div className="max-w-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/25">
              <Repeat
                size={18}
                className="text-primary animate-pulse"
                style={{ animationDuration: "4s" }}
              />
            </div>
            <Link
              href={isSignedIn ? `/${locale}/dashboard` : ("/" as Route)}
              className="group flex items-center gap-1.5 focus:outline-none">
              <span className="text-xl font-black text-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                Recurio
              </span>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The intentional way to manage your recurring expenses. Built for
            those who value clarity over convenience.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16 w-full lg:w-auto">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/80">
              Product
            </h4>
            <ul className="text-sm space-y-3 text-muted-foreground">
              <li>
                <Link
                  href={`/${locale}/dashboard`}
                  className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/dashboard`}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1">
                  Payments
                  <span className="inline-block px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary font-bold rounded">
                    New
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/80">
              Legal
            </h4>
            <ul className="text-sm space-y-3 text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-border/60 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Recurio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
