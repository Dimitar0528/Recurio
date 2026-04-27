"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type SubIconProps = {
  name: string;
  className?: string;
};

export function SubIcon({ name, className }: SubIconProps) {
  const [error, setError] = useState(false);
  
  const logoUrl = `https://www.google.com/s2/favicons?sz=64&domain=${name.split(" ")[0].toLowerCase().replace(/\s+/g, '')}.com`;

  const monogram = name.charAt(0).toUpperCase();
  return (
    <div
      className={cn(
        "relative flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-lg overflow-hidden border border-border bg-muted/50 font-mono text-xs font-bold",
        className,
      )}>
      {!error ? (
        <Image
          src={logoUrl}
          alt="Subscription logo"
          width={64}
          height={64}
          unoptimized
          className="w-3 h-3 object-contain filter transition-opacity"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-muted-foreground opacity-80">{monogram}</span>
      )}

      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
    </div>
  );
}