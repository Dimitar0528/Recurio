"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Laptop, Repeat, Menu, X } from "lucide-react";
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

export default function Navigation() {
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const themes = [
    { name: "Light", value: "light", Icon: Sun },
    { name: "Dark", value: "dark", Icon: Moon },
    { name: "System", value: "system", Icon: Laptop },
  ] as const;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Payments", href: "/payments" },
    { name: "Pricing", href: "/pricing" },
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Repeat size={20} className="text-primary-foreground" />
          </div>
          <Link href={"/" as Route} className="text-lg font-bold">
            <span className="text-xl font-bold tracking-tight text-primary hover:underline hover:underline-offset-4">
              Recurio
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href as Route}
              className={`hover:text-foreground transition-colors ${
                pathname.split("/")[2] === link.name.toLowerCase()
                  ? "underline underline-offset-6 decoration-primary decoration-2 text-foreground"
                  : ""
              }`}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger render={<div></div>} nativeButton={false}>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Sun className="text-primary h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="text-chart-1 absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
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

          <button className="hidden md:block cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-85 transition-opacity">
            Get Started
          </button>

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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href as Route}
                className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}>
                {link.name}
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

          <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
