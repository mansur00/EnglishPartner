import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  SparklesIcon,
  BotIcon,
  Calendar01Icon,
  Bookmark01Icon,
  Message01Icon,
  Search01Icon,
  Mic01Icon,
} from "@hugeicons/core-free-icons";

const PROGRESS_BAR_HEIGHTS = [
  "h-12",
  "h-20",
  "h-14",
  "h-10",
  "h-16",
  "h-28",
  "h-12",
  "h-24",
  "h-16",
  "h-14",
  "h-18",
  "h-20",
];

const ECOSYSTEM_LEFT = [
  { href: "/explore", icon: Message01Icon, label: "42+ Dialogues" },
  { href: "/grammar-path", icon: BookOpen01Icon, label: "8-Stage Grammar" },
  { href: "/daily-practice", icon: Calendar01Icon, label: "Daily Streak" },
];

const ECOSYSTEM_RIGHT = [
  { href: "/roleplay", icon: BotIcon, label: "AI Roleplay" },
  { href: "/professions", icon: Briefcase01Icon, label: "5 Career Tracks" },
  { href: "/vocabulary", icon: Bookmark01Icon, label: "SM-2 Vocab" },
];

const PASTEL_AUDIENCE_CARDS = [
  {
    topic: "shopping",
    badge: "Students & Beginners (A1–A2)",
    title: "Build Confidence From Zero With Bangla Support",
    bnText:
      "সহজ বাংলা ব্যাখ্যা, ২০ ধাপের গাইডেড ল্যাডার এবং গ্রামার ফাউন্ডেশন দিয়ে জড়তা কাটিয়ে ইংরেজি বলা শুরু করুন।",
    cta: "Start Foundation",
    href: "/grammar-path",
  },
  {
    topic: "travel",
    badge: "Travelers & Daily Speakers",
    title: "Handle Airports, Shopping & Everyday Talks",
    bnText:
      "বিমানবন্দর, হোটেল বুকিং, হাসপাতাল ও দোকানে সাবলীলভাবে কথা বলার জন্য বাস্তব জীবনের ৪২+ প্রাসঙ্গিক সংলাপ।",
    cta: "Explore Scenarios",
    href: "/explore",
  },
  {
    topic: "workplace",
    badge: "Freelancers & Remote Tech",
    title: "Speak Fluently in Client Calls & Standups",
    bnText:
      "UI/UX Designer, Software Engineer ও ফ্রিল্যান্সারদের জন্য ক্লায়েন্ট ডিসকভারি, ফিডব্যাক ও মিটিং অনুশীলন।",
    cta: "View Career Tracks",
    href: "/professions",
  },
  {
    topic: "social",
    badge: "Job Seekers & Interviewees",
    title: "Sound Natural, Polite & Ready for Interviews",
    bnText:
      "AI পার্টনারের সাথে রোলপ্লে এবং 'What Should I Say?' দিয়ে যেকোনো পরিস্থিতির উপযুক্ত উত্তর তৈরি করুন।",
    cta: "Practice With AI",
    href: "/roleplay",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-header w-full border-b border-border bg-card/90 backdrop-blur">
        <div className="container-app h-header flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="English Partner"
              className="h-9 sm:h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/explore"
              className="text-label text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/grammar-path"
              className="text-label text-muted-foreground hover:text-foreground transition-colors"
            >
              Grammar Path
            </Link>
            <Link
              href="/roleplay"
              className="text-label text-muted-foreground hover:text-foreground transition-colors"
            >
              AI Partner
            </Link>
            <Link
              href="/professions"
              className="text-label text-muted-foreground hover:text-foreground transition-colors"
            >
              Professional English
            </Link>
            <Link
              href="/daily-practice"
              className="text-label text-muted-foreground hover:text-foreground transition-colors"
            >
              Daily Practice
            </Link>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm" className="rounded-control text-label text-bangla">
                ড্যাশবোর্ড
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Section 1 — Light Airy Hero (Paywall Reference) */}
      <section className="container-app pt-6 md:pt-8">
        <div className="rounded-band bg-card border border-border/60 shadow-2xs px-4 sm:px-8 md:px-12 py-12 md:py-16 text-center space-y-8 relative overflow-hidden">
          {/* Floating Learner & Feature Cluster */}
          <div className="max-w-reading mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            {/* Left Floating Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-background border border-border shadow-xs text-chip">
              <span className="size-6 rounded-pill bg-sun-200 text-brand-950 flex items-center justify-center font-semibold">
                <HugeiconsIcon icon={BookOpen01Icon} size={13} />
              </span>
              <span className="text-foreground font-semibold">8 Grammar Stages</span>
            </div>

            {/* Avatar / Learner Node 1 */}
            <div className="relative">
              <div className="size-11 rounded-pill bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold text-label shadow-2xs">
                A1
              </div>
              <span className="absolute -bottom-1 -right-1 size-5 rounded-pill bg-primary text-primary-foreground flex items-center justify-center text-chip shadow-2xs">
                +
              </span>
            </div>

            {/* Center Featured Node */}
            <div className="relative">
              <div className="size-16 rounded-pill bg-gradient-to-br from-primary to-brand-800 text-primary-foreground flex flex-col items-center justify-center shadow-sm">
                <HugeiconsIcon icon={Mic01Icon} size={22} />
                <span className="text-chip font-semibold leading-none mt-0.5">Speak</span>
              </div>
              <span className="absolute -bottom-1 -right-1 size-6 rounded-pill bg-sun-500 text-brand-950 flex items-center justify-center text-chip font-semibold shadow-2xs">
                +
              </span>
            </div>

            {/* Avatar / Learner Node 2 */}
            <div className="relative">
              <div className="size-12 rounded-pill bg-accent border border-border flex items-center justify-center text-accent-foreground font-semibold text-label shadow-2xs">
                B2
              </div>
              <span className="absolute -bottom-1 -right-1 size-5 rounded-pill bg-primary text-primary-foreground flex items-center justify-center text-chip shadow-2xs">
                +
              </span>
            </div>

            {/* Right Floating Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-background border border-border shadow-xs text-chip">
              <span className="size-6 rounded-pill bg-primary/15 text-primary flex items-center justify-center font-semibold">
                <HugeiconsIcon icon={BotIcon} size={13} />
              </span>
              <span className="text-foreground font-semibold">+42 Dialogues</span>
            </div>
          </div>

          {/* Headline & Bangla Subtitle */}
          <div className="max-w-reading mx-auto space-y-4">
            <h1 className="text-page-title font-heading tracking-tight text-foreground leading-tight">
              Speak Real-Life English With Confidence Today
            </h1>
            <p className="text-lead text-muted-foreground text-bangla max-w-reading mx-auto leading-relaxed">
              বাস্তব জীবনের সংলাপ, বাংলা অনুবাদ, ৮ ধাপের গ্রামার পাথ এবং AI রোলপ্লে পার্টনারের মাধ্যমে সাবলীল ইংরেজি শিখুন।
            </p>
          </div>

          {/* Primary Pill CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="rounded-pill px-8 gap-2.5 shadow-sm text-label font-semibold"
              >
                <HugeiconsIcon icon={SparklesIcon} size={18} />
                <span>Start Learning Free</span>
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                variant="outline"
                size="lg"
                className="rounded-pill px-6 gap-2 text-label text-bangla"
              >
                <span>কথোপকথন দেখুন</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 container-app py-14 md:py-20 space-y-20 md:space-y-24">
        {/* Section 2 — Bento Features Grid with Live Mini-UI Previews */}
        <section className="space-y-8">
          <div className="text-center max-w-reading mx-auto space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-card border border-border text-chip text-muted-foreground shadow-2xs">
              <HugeiconsIcon icon={SparklesIcon} size={14} className="text-primary" />
              Our Features
            </span>
            <h2 className="text-page-title font-heading text-foreground">
              Features to Accelerate Your Fluency
            </h2>
            <p className="text-body text-muted-foreground text-bangla">
              কেবল থিওরি নয়—প্রতিটি ফিচারে রয়েছে সরাসরি অনুশীলনের ইন্টারঅ্যাক্টিভ অভিজ্ঞতা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bento Card 1: 20-Step Guided Ladders (Stacked Mini Cards) */}
            <Link href="/explore" className="block group">
              <Card className="h-full p-6 rounded-card bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-6">
                <div className="rounded-panel bg-muted/40 border border-border/60 p-5 flex flex-col items-center justify-center gap-2 min-h-48">
                  <div className="w-4/5 rounded-panel bg-card/70 border border-border/50 px-4 py-2.5 flex items-center justify-between opacity-65">
                    <span className="text-chip text-muted-foreground">Step 01 • Greeting &amp; Needs</span>
                    <span className="px-2 py-0.5 rounded-pill bg-accent text-accent-foreground text-chip">A1</span>
                  </div>
                  <div className="w-full rounded-panel bg-card border border-border px-4 py-3.5 shadow-sm flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-label font-semibold text-foreground">
                        Asking for Price &amp; Product Details
                      </p>
                      <p className="text-chip text-muted-foreground text-bangla">
                        দোকানে দাম ও সাইজ জানতে চাওয়ার সংলাপ
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-pill bg-primary text-primary-foreground text-chip shrink-0">
                      Step 02
                    </span>
                  </div>
                  <div className="w-4/5 rounded-panel bg-card/70 border border-border/50 px-4 py-2.5 flex items-center justify-between opacity-65">
                    <span className="text-chip text-muted-foreground">Step 03 • Polite Discount</span>
                    <span className="px-2 py-0.5 rounded-pill bg-muted text-muted-foreground text-chip">A2</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                    20-Step Guided Ladders &amp; Dialogues
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla">
                    সহজ থেকে ধাপে ধাপে কঠিন পর্যায়ে নিয়ে যাওয়া ৪২+ বাস্তব সংলাপ ও US/UK অডিও প্র্যাকটিস।
                  </p>
                </div>
              </Card>
            </Link>

            {/* Bento Card 2: AI Reply & Roleplay Preview */}
            <Link href="/what-should-i-say" className="block group">
              <Card className="h-full p-6 rounded-card bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-6">
                <div className="rounded-panel bg-gradient-to-br from-primary/10 via-muted/40 to-sun-200/40 border border-border/60 p-5 flex flex-col justify-center gap-2.5 min-h-48">
                  <div className="self-end rounded-pill bg-card border border-border/60 px-3.5 py-1.5 text-chip text-muted-foreground shadow-2xs">
                    How do I politely ask for a deadline extension?
                  </div>
                  <div className="self-end rounded-pill bg-card border border-border/60 px-3.5 py-1.5 text-chip text-muted-foreground shadow-2xs">
                    &ldquo;Could we possibly move the deadline to Friday?&rdquo;
                  </div>
                  <div className="mt-1 rounded-pill bg-card border border-primary/30 px-4 py-2.5 shadow-sm flex items-center gap-2.5">
                    <HugeiconsIcon icon={SparklesIcon} size={18} className="text-primary shrink-0" />
                    <span className="text-label text-foreground">
                      Generating natural English reply...
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                    AI Roleplay &amp; &ldquo;What Should I Say?&rdquo;
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla">
                    বাংলা বা ইংরেজিতে যেকোনো পরিস্থিতি লিখে মুহূর্তেই মার্জিত বাক্য পান ও AI-এর সাথে কথা বলুন।
                  </p>
                </div>
              </Card>
            </Link>

            {/* Bento Card 3: 42+ Scenarios Search & Filter Preview */}
            <Link href="/grammar-path" className="block group">
              <Card className="h-full p-6 rounded-card bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-6">
                <div className="rounded-panel bg-muted/40 border border-border/60 p-5 flex flex-col justify-center gap-3 min-h-48">
                  <div className="rounded-control bg-card border border-border px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2 text-chip text-muted-foreground">
                      <HugeiconsIcon icon={Search01Icon} size={16} />
                      <span>Search grammar stage, topic, or rule...</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-control bg-primary text-primary-foreground text-chip">
                      8 Stages
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-pill bg-card border border-border text-chip text-foreground">
                      Parts of Speech
                    </span>
                    <span className="px-3 py-1 rounded-pill bg-primary text-primary-foreground text-chip">
                      12 Tenses
                    </span>
                    <span className="px-3 py-1 rounded-pill bg-card border border-border text-chip text-foreground">
                      Voice &amp; Narration
                    </span>
                    <span className="px-3 py-1 rounded-pill bg-card border border-border text-chip text-foreground">
                      10-Question Quiz
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                    8-Stage Grammar Learning Path
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla">
                    ৩৮টি বিস্তারিত লেসনে বাংলা নিয়ম, ওয়ার্ড ব্যাংক, বাক্য তৈরি ও প্রতিটি স্টেজ শেষে ১০ প্রশ্নের কুইজ।
                  </p>
                </div>
              </Card>
            </Link>

            {/* Bento Card 4: AI Partner Spotlight Button */}
            <Link href="/professions" className="block group">
              <Card className="h-full p-6 rounded-card bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-6">
                <div className="rounded-panel bg-gradient-to-b from-muted/30 to-primary/10 border border-border/60 p-5 flex flex-col items-center justify-center gap-3 min-h-48">
                  <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-control bg-primary text-primary-foreground shadow-sm text-label font-semibold">
                    <HugeiconsIcon icon={Briefcase01Icon} size={18} />
                    <span>Explore 5 Career Tracks</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-chip text-muted-foreground">
                    <span className="px-2.5 py-1 rounded-pill bg-card border border-border">UI/UX Designer</span>
                    <span className="px-2.5 py-1 rounded-pill bg-card border border-border">Software Engineer</span>
                    <span className="px-2.5 py-1 rounded-pill bg-card border border-border">Freelancer</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                    Professional English Career Tracks
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla">
                    ক্লায়েন্ট মিটিং, টেক হ্যান্ডঅফ, কোড রিভিউ এবং প্রফেশনাল ইমেইল/কথোপকথনের বিশেষ ট্র্যাক।
                  </p>
                </div>
              </Card>
            </Link>

            {/* Bento Card 5 (Full Width): Progress Tracking & SM-2 Chart */}
            <Link href="/progress" className="block group md:col-span-2">
              <Card className="p-6 md:p-7 rounded-card bg-card shadow-2xs hover:shadow-xs transition-shadow space-y-6">
                <div className="rounded-panel bg-muted/35 border border-border/60 p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-chip text-muted-foreground">Vocabulary &amp; Fluency</p>
                      <p className="text-label font-semibold text-foreground">
                        SM-2 Spaced Repetition &amp; Daily Streak
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-pill bg-primary text-primary-foreground text-chip font-semibold">
                      65% Retained
                    </span>
                  </div>

                  {/* Clean Visual Bar Chart */}
                  <div className="relative pt-4">
                    <div className="grid grid-cols-12 items-end gap-2 sm:gap-3 h-32">
                      {PROGRESS_BAR_HEIGHTS.map((hClass, idx) => (
                        <div
                          key={idx}
                          className={`w-full rounded-t-control transition-all ${hClass} ${
                            idx === 5
                              ? "bg-primary shadow-xs"
                              : idx === 7
                              ? "bg-sun-500"
                              : "bg-primary/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div className="space-y-1.5">
                    <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                      Smart Progress Tracking &amp; SM-2 Vocabulary
                    </h3>
                    <p className="text-meta text-muted-foreground text-bangla">
                      শেখা শব্দগুলো মুখস্থ না করে বৈজ্ঞানিক স্পেসড রিপিটেশন, কুইজ ও প্রগ্রেস চার্টের মাধ্যমে দীর্ঘদিন মনে রাখুন।
                    </p>
                  </div>
                  <span className="text-chip text-primary font-semibold flex items-center gap-1 shrink-0">
                    View Analytics <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </span>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* Section 3 — Connected Learning Ecosystem Hub (Inspired by Ref #3) */}
        <section className="rounded-card bg-card border border-border/60 p-8 md:p-12 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
            {/* Left Nodes */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              {ECOSYSTEM_LEFT.map((node) => (
                <Link
                  key={node.href}
                  href={node.href}
                  className="flex items-center gap-3 p-3 rounded-panel bg-muted/40 hover:bg-accent transition-colors"
                >
                  <div className="size-control rounded-control bg-card border border-border flex items-center justify-center text-primary shrink-0 shadow-2xs">
                    <HugeiconsIcon icon={node.icon} size={18} />
                  </div>
                  <span className="text-chip font-semibold text-foreground truncate">
                    {node.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Center Hub */}
            <div className="text-center space-y-4 py-2">
              <span className="inline-block px-3 py-1 rounded-pill bg-accent text-accent-foreground text-chip font-mono">
                {"{learning_ecosystem}"}
              </span>
              <h2 className="text-page-title font-heading text-foreground leading-tight">
                All Your English Practice Connected
              </h2>
              <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                সংলাপ, গ্রামার, AI রোলপ্লে, প্রফেশনাল ট্র্যাক এবং ভোকাবুলারি—সবকিছু এক জায়গায় সমন্বিত।
              </p>
              <div className="pt-1">
                <Link href="/dashboard">
                  <Button size="md" className="rounded-pill px-6 gap-2">
                    <span>Open Dashboard</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Nodes */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              {ECOSYSTEM_RIGHT.map((node) => (
                <Link
                  key={node.href}
                  href={node.href}
                  className="flex items-center gap-3 p-3 rounded-panel bg-muted/40 hover:bg-accent transition-colors"
                >
                  <div className="size-control rounded-control bg-card border border-border flex items-center justify-center text-primary shrink-0 shadow-2xs">
                    <HugeiconsIcon icon={node.icon} size={18} />
                  </div>
                  <span className="text-chip font-semibold text-foreground truncate">
                    {node.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 — Who It's For (4-Column Divided Card Reference) */}
        <section className="rounded-card bg-card border border-border/60 shadow-2xs overflow-hidden">
          <div className="px-6 pt-10 pb-8 text-center max-w-reading mx-auto space-y-2.5">
            <h2 className="text-page-title font-heading text-foreground leading-tight">
              Built for Every Learner.
              <br />
              Structured From Day One.
            </h2>
            <p className="text-meta text-muted-foreground text-bangla">
              আপনার লক্ষ্য যেটাই হোক—সহজ বাংলা গাইডলাইন ও বাস্তব অনুশীলনে দ্রুত উন্নতি করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border border-t border-border">
            {PASTEL_AUDIENCE_CARDS.map((card, idx) => (
              <Link
                key={card.title}
                href={card.href}
                className="p-6 flex flex-col justify-between gap-6 hover:bg-muted/25 transition-colors group"
              >
                <div className="space-y-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-control text-chip font-semibold ${
                      idx === 0
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {card.badge}
                  </span>
                  <h3 className="text-label font-heading text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                    {card.bnText}
                  </p>
                </div>

                {/* Minimal Wireframe Preview Box */}
                <div className="rounded-panel bg-muted/40 border border-border/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="h-2 w-12 rounded-pill bg-primary/35" />
                    <span className="h-2 w-6 rounded-pill bg-muted-foreground/25" />
                  </div>
                  <div className="h-2 w-full rounded-pill bg-border" />
                  <div className="h-2 w-4/5 rounded-pill bg-border/70" />
                  <div className="pt-1 flex items-center justify-between text-chip text-primary font-semibold">
                    <span>{card.cta}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5 — Final Glowing Spotlight CTA Banner (Graphy Reference) */}
        <section>
          <div className="rounded-band bg-gradient-to-b from-brand-800 via-brand-900 to-brand-950 text-band-panel-ink p-10 sm:p-14 md:p-16 text-center space-y-5 shadow-sm relative overflow-hidden">
            <h2 className="text-page-title font-heading text-band-panel-ink max-w-reading mx-auto">
              Ready to speak English fluently?
            </h2>
            <p className="text-lead text-band-panel-ink/80 text-bangla max-w-reading mx-auto">
              হাজারো শিক্ষার্থীর সাথে আজই বাস্তব সংলাপ, গ্রামার ও AI প্র্যাকটিস শুরু করুন।
            </p>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-control bg-card text-foreground hover:bg-card/90 px-7 shadow-sm text-label font-semibold"
                >
                  Start for free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Multi-Column SaaS Footer + Giant Watermark (Graphy Reference) */}
      <footer className="container-app pt-4 pb-0 space-y-6 overflow-hidden">
        <Card className="rounded-card bg-card border border-border shadow-xs p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <Link href="/" className="inline-flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt="English Partner"
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="text-meta text-muted-foreground max-w-xs leading-relaxed">
                EnglishPartner empowers Bangla speakers to master real-life English conversations, grammar, and career fluency.
              </p>
            </div>

            {/* Link Columns */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-meta">
              <div className="space-y-2.5">
                <p className="text-label font-semibold text-foreground">Product</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link></li>
                  <li><Link href="/grammar-path" className="hover:text-foreground transition-colors">Grammar Path</Link></li>
                  <li><Link href="/roleplay" className="hover:text-foreground transition-colors">AI Partner</Link></li>
                  <li><Link href="/professions" className="hover:text-foreground transition-colors">Career Tracks</Link></li>
                </ul>
              </div>
              <div className="space-y-2.5">
                <p className="text-label font-semibold text-foreground">Practice</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/daily-practice" className="hover:text-foreground transition-colors">Daily Practice</Link></li>
                  <li><Link href="/what-should-i-say" className="hover:text-foreground transition-colors">What Should I Say?</Link></li>
                  <li><Link href="/vocabulary" className="hover:text-foreground transition-colors">My Vocabulary</Link></li>
                  <li><Link href="/quiz" className="hover:text-foreground transition-colors">Quiz</Link></li>
                </ul>
              </div>
              <div className="space-y-2.5">
                <p className="text-label font-semibold text-foreground">Account</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                  <li><Link href="/progress" className="hover:text-foreground transition-colors">My Progress</Link></li>
                  <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-chip text-muted-foreground">
            <span>© 2026 EnglishPartner by MansurVerse. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </Card>

        {/* Subtle Watermark Wordmark */}
        <div
          aria-hidden="true"
          className="text-center select-none pointer-events-none py-2 opacity-10"
        >
          <span className="text-page-title font-heading tracking-tight text-foreground inline-block scale-y-150 scale-x-125">
            EnglishPartner
          </span>
        </div>
      </footer>
    </div>
  );
}
