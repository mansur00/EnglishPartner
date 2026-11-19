import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { t } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayCircleIcon,
  ShoppingBag01Icon,
  Airplane01Icon,
  Briefcase01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-header w-full border-b border-border bg-card/90 backdrop-blur">
        <div className="container-app h-header flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-control rounded-control bg-primary text-primary-foreground flex items-center justify-center font-heading text-card-title shadow-xs group-hover:scale-95 transition-transform">
              EP
            </div>
            <div>
              <span className="text-label font-heading text-foreground tracking-tight leading-none block">
                {t("header.title")}
              </span>
              <span className="text-chip text-muted-foreground text-bangla leading-none block mt-0.5">
                কথোপকথনে ইংরেজি শিখুন
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/explore"
              className="text-label text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.explore")}
            </Link>

            {/* Soon Nav Items (properly disabled per spec) */}
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="text-label text-muted-foreground/50 cursor-not-allowed flex items-center gap-1.5"
            >
              <span>Grammar Visualizer</span>
              <Badge variant="outline" size="sm" className="opacity-70 text-chip font-sans">
                Soon
              </Badge>
            </button>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="text-label text-muted-foreground/50 cursor-not-allowed flex items-center gap-1.5"
            >
              <span>AI Voice Tutor</span>
              <Badge variant="outline" size="sm" className="opacity-70 text-chip font-sans">
                Soon
              </Badge>
            </button>

            <Link
              href="/dashboard"
              className="text-label text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Right Action & Theme Toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm" className="hidden sm:inline-flex rounded-control text-label text-bangla">
                ড্যাশবোর্ড
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Header Band inspired by Speech Language School) */}
      <section className="bg-gradient-to-b from-brand-800 to-brand-900 text-band-panel-ink rounded-band pt-12 pb-18 md:pt-16 md:pb-22 px-4 sm:px-6 md:px-8">
        <div className="max-w-reading mx-auto text-center space-y-6">
          {/* Top Pill Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill text-chip bg-band-panel border border-band-panel-border text-band-panel-ink shadow-2xs backdrop-blur-xs">
            <HugeiconsIcon icon={SparklesIcon} size={16} className="text-sun-500" />
            <span>Spoken English for Native Bangla Speakers</span>
          </div>

          {/* Hero Display Headline (max 40px per design system v2) */}
          <h1 className="text-page-title font-heading tracking-tight text-band-panel-ink max-w-reading mx-auto leading-tight">
            Master Real-Life English Conversations With Confidence
          </h1>

          {/* Bangla Subtitle */}
          <p className="text-lead text-band-panel-ink/85 text-bangla max-w-reading mx-auto leading-relaxed">
            বাস্তব জীবনের প্রাসঙ্গিক সংলাপ, বাংলা অনুবাদ, সঠিক উচ্চারণ এবং ইন্টারঅ্যাক্টিভ অনুশীলনের মাধ্যমে সাবলীল ইংরেজি শিখুন।
          </p>

          {/* Primary CTA ("Start Learning") */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="cta"
                size="lg"
                className="w-full sm:w-auto text-lead rounded-control shadow-sm gap-2.5 px-8"
              >
                <HugeiconsIcon icon={PlayCircleIcon} size={22} />
                <span>Start Learning (শুরু করুন)</span>
              </Button>
            </Link>

            <Link href="/explore" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-body rounded-control bg-band-panel text-band-panel-ink border-band-panel-border gap-2 text-bangla"
              >
                <HugeiconsIcon icon={BookOpen01Icon} size={20} />
                <span>কথোপকথন এক্সপ্লোর করুন</span>
              </Button>
            </Link>
          </div>

          {/* Micro Benefits Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-chip text-band-panel-ink/70">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-sun-500" />
              80+ Real-Life Scenarios
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-sun-500" />
              Bilingual Bengali Support
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-sun-500" />
              CEFR Aligned (A1 - B2)
            </span>
          </div>
        </div>
      </section>

      {/* 3. Highlight Feature Cards (Overlapping) */}
      <main className="flex-1 container-app overlap-band relative z-base pb-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1: Shopping & Everyday */}
          <Card
            data-topic="shopping"
            className="p-5 md:p-6 rounded-card border border-border bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="size-tile rounded-control emoji-tile flex items-center justify-center">
                <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
              </div>
              <h2 className="text-card-title font-heading text-foreground">
                Everyday & Shopping
              </h2>
              <p className="text-meta text-muted-foreground text-bangla">
                দোকানে দাম জানতে চাওয়া, ছাড়ের কথা বলা এবং বিল পরিশোধ করার বাস্তব কথোপকথন।
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-chip text-muted-foreground">
              <span>20 Step Ladder</span>
              <span className="text-foreground flex items-center gap-1">
                Explore <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </span>
            </div>
          </Card>

          {/* Feature 2: Travel & Commute */}
          <Card
            data-topic="travel"
            className="p-5 md:p-6 rounded-card border border-border bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="size-tile rounded-control emoji-tile flex items-center justify-center">
                <HugeiconsIcon icon={Airplane01Icon} size={24} />
              </div>
              <h2 className="text-card-title font-heading text-foreground">
                Travel & Commute
              </h2>
              <p className="text-meta text-muted-foreground text-bangla">
                বিমানবন্দর, হোটেল বুকিং ও দিকনির্দেশনা চাওয়ার সময় সাবলীলভাবে কথা বলার দক্ষতা।
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-chip text-muted-foreground">
              <span>15 Scenarios</span>
              <span className="text-foreground flex items-center gap-1">
                Explore <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </span>
            </div>
          </Card>

          {/* Feature 3: Workplace & Business */}
          <Card
            data-topic="workplace"
            className="p-5 md:p-6 rounded-card border border-border bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="size-tile rounded-control emoji-tile flex items-center justify-center">
                <HugeiconsIcon icon={Briefcase01Icon} size={24} />
              </div>
              <h2 className="text-card-title font-heading text-foreground">
                Office & Workplace
              </h2>
              <p className="text-meta text-muted-foreground text-bangla">
                মিটিং পরিচালনা, ক্লায়েন্ট কমিউনিকেশন ও পেশাদার প্রেজেন্টেশনের জন্য উপযুক্ত ভাষা।
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-chip text-muted-foreground">
              <span>12 Scenarios</span>
              <span className="text-foreground flex items-center gap-1">
                Explore <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </span>
            </div>
          </Card>
        </div>
      </main>

      {/* 4. Minimalist Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4 text-chip text-muted-foreground">
          <div>
            © 2026 EnglishPartner. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
