"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n } from "@/i18n-config";
import type { Locale } from "@/app/[lang]/dictionaries";
import { ArrowDown, Languages } from "lucide-react";
import { Route } from "next";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale =
    (pathname?.split("/")[1] as Locale) || i18n.defaultLocale;

  const handleLocaleChange = (newLocale: Locale) => {
    if (!pathname) return;

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") as Route;

    router.replace(newPath, { scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<div></div>} nativeButton={false}>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-2 cursor-pointer"
          aria-label="Select language">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {currentLocale.toUpperCase()}
          </span>
          <ArrowDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[80px]">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`group cursor-pointer
              ${
                locale === currentLocale
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            }`}>
            <span className="group-hover:text-white group-focus-visible:text-white">
              {locale.toUpperCase()}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
