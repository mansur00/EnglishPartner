import type { Metadata } from "next";
import { Manrope, Nunito, Comic_Neue, Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { LocaleProvider } from "@/lib/i18n/provider";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comic-neue",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  variable: "--font-bangla",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  variable: "--font-bangla-fallback",
  display: "swap",
});

export const metadata: Metadata = {
  title: "English Conversation Partner",
  description: "Learn English through realistic, context-driven conversations.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EnglishPartner",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        manrope.variable,
        nunito.variable,
        comicNeue.variable,
        hindSiliguri.variable,
        notoSansBengali.variable
      )}
    >
      <body className="antialiased min-h-screen font-sans bg-background text-foreground transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider>
            <PwaRegister />
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
