"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n } from "@/i18n-config";
import type { Locale } from "@/app/[lang]/dictionaries";
import { Globe } from "lucide-react";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale =
    (pathname?.split("/")[1] as Locale) || i18n.defaultLocale;

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    if (!pathname) return;

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    router.push(newPath);
  };

  return (
    <div className="relative group flex items-center gap-2">
      <Globe
        size={18}
        className="text-muted-foreground group-hover:text-foreground transition-colors absolute left-3 pointer-events-none"
      />
      <select
        value={currentLocale}
        onChange={handleLocaleChange}
        className="
          appearance-none
          bg-background 
          border border-border 
          hover:border-muted-foreground/50
          text-sm font-medium
          pl-9 pr-8 py-1.5 
          rounded-md 
          cursor-pointer
          focus:outline-none focus:ring-1 focus:ring-primary
          transition-all
        "
        aria-label="Select Language">
        {i18n.locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale.toUpperCase()}
          </option>
        ))}
      </select>

      <div className="absolute right-3 pointer-events-none flex items-center">
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground">
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
