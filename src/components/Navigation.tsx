"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  Laptop,
  Repeat,
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  CreditCard,
  MessageSquareQuote,
  Tag,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LocaleSwitcher from "./locale_switcher";
import { Route } from "next";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";

export default function Navigation() {
  const { isSignedIn, isLoaded } = useUser();
  const locale = useLocale();
  const tReusable = useTranslations("Reusable.navigation_component");
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const themes = [
    { name: "Light", value: "light", Icon: Sun },
    { name: "Dark", value: "dark", Icon: Moon },
    { name: "System", value: "system", Icon: Laptop },
  ] as const;

  const navLinks = [
    {
      name: isSignedIn ? "Dashboard" : "Insights",
      label: isSignedIn
        ? tReusable("dashboard_link")
        : tReusable("insights_link"),
      href: isSignedIn ? "/dashboard" : `/${locale}#insights`,
      Icon: isSignedIn ? LayoutDashboard : Sparkles,
    },
    {
      name: isSignedIn ? "Payments" : "Reviews",
      label: isSignedIn
        ? tReusable("payments_link")
        : tReusable("reviews_link"),
      href: isSignedIn ? "/payments" : `/${locale}#reviews`,
      Icon: isSignedIn ? CreditCard : MessageSquareQuote,
    },
    {
      name: "Pricing",
      label: tReusable("pricing_link"),
      href: "/pricing",
      Icon: Tag,
    },
  ];

  const switchTheme = (value: string) => {
    if (!document.startViewTransition) {
      setTheme(value);
      return;
    }
    document.startViewTransition(() => setTheme(value));
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <a suppressHydrationWarning
          href="#main-content"
          className="absolute left-2 -top-1 -translate-y-full focus:translate-y-4 z-[100] px-4 py-2 bg-foreground text-background text-xs font-mono font-black uppercase tracking-widest rounded-lg shadow-2xl shadow-primary/40 transition-transform duration-300 ease-out outline-none ring-2 ring-primary ring-offset-2
        ">
          Skip to main content
        </a>
  
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

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map(({ name, label, href, Icon }) => {
            const isActive = pathname.split("/")[2] === name.toLowerCase();
            return (
              <Link
                key={name}
                href={href as Route}
                className={`flex items-center gap-2 hover:text-foreground transition-colors ${
                  isActive
                    ? "underline underline-offset-6 decoration-primary decoration-2 text-foreground"
                    : ""
                }`}>
                <Icon size={16} className="text-primary" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Sun className="text-primary h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="text-chart-1 absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              }></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {themes.map(({ name, value, Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => switchTheme(value)}
                  className={`group transition-colors cursor-pointer ${
                    theme === value ? "bg-accent text-accent-foreground" : ""
                  }`}>
                  <Icon className="size-4 mr-2 group-hover:text-white" />
                  <span>{name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {!isLoaded && (
            <div
              className="flex justify-center items-center min-h-[60vh] "
              aria-live="polite"
              aria-busy="true">
              <div className="inline-flex items-center justify-center h-8 px-6 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse">
                <div className="h-4 w-20 rounded bg-slate-300 dark:bg-slate-600" />
              </div>
            </div>
          )}
          <SignedOut>
            <div className="hidden md:block">
              <SignInButton>
                <button className="group relative inline-flex items-center justify-center h-8 px-3 bg-primary text-primary-foreground text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                  {tReusable("sign_in_link")}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonTrigger:
                    "focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] ",
                },
              }}
            />
          </SignedIn>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 top-16 bg-background border-b border-border p-6 transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-4 opacity-0 invisible"
        }`}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
              Navigation
            </p>
            {navLinks.map(({ name, href, Icon }) => (
              <Link
                key={name}
                href={href as Route}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold text-foreground hover:text-primary transition-colors">
                <Icon size={20} />
                <span>{name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-border flex flex-col gap-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
              Preferences
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Language</span>
              <LocaleSwitcher />
            </div>
          </div>

          <SignedOut>
            <SignInButton>
              <button className="group relative inline-flex items-center justify-center h-8 px-3 bg-primary text-primary-foreground text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
