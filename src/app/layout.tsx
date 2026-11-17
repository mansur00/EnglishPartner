import type { Metadata } from "next";
import { Inter, Poppins, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  variable: "--font-bangla",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(poppins.variable, inter.variable, hindSiliguri.variable)}
    >
      <body className="antialiased min-h-screen font-sans bg-background text-foreground transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
