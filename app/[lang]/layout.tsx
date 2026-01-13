import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

const notoSans = Noto_Sans({variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Recurio",
    default: "Recurio",
  },
  description: "The only modern subscription management tool you need.",
  generator: "Next.js",
  applicationName: "Recurio",
};

export async function generateStaticParams() {
  return [{ lang: "bg" }, { lang: "en" }];
}
export default async function RootLayout({
  children,
  params
}: LayoutProps<"/[lang]">) {
  return (
    <html lang={(await params).lang} className={notoSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme>
          <Navigation />
            <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
