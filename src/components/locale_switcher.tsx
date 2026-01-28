"use client";

import { Locale, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ArrowDown, Languages } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale, scroll: false });
    router.refresh()
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
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
        }></DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[80px]">
        {routing.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`cursor-pointer ${
              locale === currentLocale ? "bg-accent text-accent-foreground" : ""
            }`}>
            {locale.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
