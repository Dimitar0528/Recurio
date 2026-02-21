import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./[lang]/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster position="top-center" richColors closeButton />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme>
            {children}
        </ThemeProvider>
    </body>
    </html>
  );
}
