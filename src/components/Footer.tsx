"use client"
import { useAuth } from "@clerk/nextjs";
import { Repeat } from "lucide-react";
import { Route } from "next";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const locale = useLocale();
  const isSignedIn = useAuth()
  return (
    <footer className="py-20 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-6">
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
            The intentional way to manage your recurring expenses. Built for
            those who value clarity over convenience.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-foreground">
              Product
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Terms Of Use
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border text-center md:text-left">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Recurio Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
