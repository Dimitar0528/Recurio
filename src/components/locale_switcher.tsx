"use client";

import { Locale, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function LocaleSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale, scroll: false });
    router.refresh();
  };

  const formatLocaleLabel = (loc: Locale) => {
    return loc === "bg" ? "БГ" : loc.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className="group flex items-center gap-2.5 p-1.5 rounded-full border border-border bg-card/50 hover:bg-secondary hover:border-primary/40 transition-all duration-300 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <Globe className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>

            <span className="text-[11px] font-mono font-bold tracking-widest text-foreground/80 group-hover:text-foreground">
              {formatLocaleLabel(currentLocale)}
            </span>

            <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </Button>
        }></DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[110px] p-1.5 bg-background/95 backdrop-blur-xl border-border rounded-xl shadow-2xl">
        <div className="py-1.5 mb-1">
          <p className="text-[8px] font-black uppercase tracking-[0.1em] text-muted-foreground/60 text-center">
            {currentLocale === "bg" ? "Избери език" : "Select Language"}
          </p>
        </div>

        {routing.locales.map((locale, index) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`
              relative flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-200
              ${locale === currentLocale ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}
            `}>
            <motion.span
              initial={{ x: -4, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-xs font-mono font-bold">
              {formatLocaleLabel(locale)}
            </motion.span>

            {locale === currentLocale && (
              <motion.div
                layoutId="activeLocale"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}>
                <Check
                  className="h-3 w-3 group-hover:text-white"
                  strokeWidth={3}
                />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
