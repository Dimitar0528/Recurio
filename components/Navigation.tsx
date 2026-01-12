"use client";

import { Moon, Sun, Laptop, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LocaleSwitcher from "./locale_switcher";

export default function Navigation() {
  const { setTheme, theme } = useTheme();

  const themes = [
    { name: "Light", value: "light", Icon: Sun },
    { name: "Dark", value: "dark", Icon: Moon },
    { name: "System", value: "system", Icon: Laptop },
  ] as const;

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
            <TrendingUp size={20} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Recurio</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a
            href="#problem"
            className="hover:text-foreground transition-colors">
            Philosophy
          </a>
          <a
            href="#features"
            className="hover:text-foreground transition-colors">
            Insights
          </a>
          <a
            href="#pricing"
            className="hover:text-foreground transition-colors">
            Transparency
          </a>
        </div>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger render={<div></div>} nativeButton={false}>
              <Button variant="ghost" size="icon" style={{ cursor: "pointer" }}>
                <Sun className="text-primary h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="text-chart-1 absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="end">
              {themes.map(({ name, value, Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => switchTheme(value)}
                  className={`group transition-colors cursor-pointer ${
                    theme === value ? "bg-accent text-accent-foreground" : ""
                  }`}>
                  <Icon className="size-4 group-hover:text-white group-focus-visible:text-white" />
                  <span className="group-hover:text-white group-focus-visible:text-white">
                    {name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-85 transition-opacity">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
