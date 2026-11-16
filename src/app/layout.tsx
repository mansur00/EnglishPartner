import type { Metadata } from "next";
import { Inter, Hind_Siliguri, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--ecp-font-sans",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
  variable: "--ecp-font-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "English Conversation Partner",
  description: "Learn English through realistic, context-driven conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, hindSiliguri.variable, "font-sans", geist.variable)}>
      <body className="antialiased min-h-screen bg-[var(--ecp-canvas)] text-[var(--ecp-text-primary)]">
        {children}
      </body>
    </html>
  );
}
