import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayCircleIcon,
  ShoppingBag01Icon,
  Briefcase01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  SparklesIcon,
  BotIcon,
  GraduationCapIcon,
  Calendar01Icon,
  Bookmark01Icon,
  Message01Icon,
  Search01Icon,
  Airplane01Icon,
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

      {/* Section 1 — Hero Band */}
      <section className="bg-gradient-to-b from-brand-800 to-brand-900 text-band-panel-ink rounded-band pt-12 pb-16 md:pt-16 md:pb-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-reading mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill text-chip bg-band-panel text-band-panel-ink shadow-2xs backdrop-blur-xs">
            <HugeiconsIcon icon={SparklesIcon} size={16} className="text-sun-500" />
            <span>Spoken English &amp; Grammar Platform for Bangla Speakers</span>
          </div>

          <h1 className="text-page-title font-heading tracking-tight text-band-panel-ink max-w-reading mx-auto leading-tight">
            Speak Real-Life English With Confidence — From Bangla to Fluency
          </h1>

          <p className="text-lead text-band-panel-ink/85 text-bangla max-w-reading mx-auto leading-relaxed">
            বাস্তব জীবনের সংলাপ, বাংলা অনুবাদ, ৮ ধাপের গ্রামার পাথ, AI রোলপ্লে পার্টনার এবং স্মার্ট ভোকাবুলারি অনুশীলনের মাধ্যমে সাবলীল ইংরেজি শিখুন।
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="cta"
                size="lg"
                className="w-full sm:w-auto text-lead rounded-control shadow-sm gap-2.5 px-8"
              >
                <HugeiconsIcon icon={PlayCircleIcon} size={22} />
                <span>Start Learning Free</span>
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

          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-chip text-band-panel-ink/80">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-sun-500" />
              42+ Real-Life Scenarios
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-sun-500" />
              8-Stage Grammar Path
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-sun-500" />
              AI Roleplay &amp; US/UK Audio
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-sun-500" />
              CEFR Aligned (A1 – C2)
            </span>
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

        {/* Section 4 — 2x2 Pastel Topic Cards (Who It's For & What You'll Learn) */}
        <section className="space-y-8">
          <div className="text-center max-w-reading mx-auto space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-card border border-border text-chip text-muted-foreground shadow-2xs">
              <HugeiconsIcon icon={GraduationCapIcon} size={14} className="text-primary" />
              Who It&apos;s For
            </span>
            <h2 className="text-page-title font-heading text-foreground">
              Supercharge Your English Journey
            </h2>
            <p className="text-body text-muted-foreground text-bangla">
              শিক্ষার্থী, চাকরিরপ্রার্থী, ফ্রিল্যান্সার বা ভ্রমণকারী—প্রত্যেকের প্রয়োজন অনুযায়ী সাজানো লার্নিং পাথ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PASTEL_AUDIENCE_CARDS.map((card) => (
              <Link key={card.title} href={card.href} className="block group">
                <Card
                  data-topic={card.topic}
                  className="h-full p-6 md:p-7 rounded-card bg-topic-surface border border-topic-border/50 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-6"
                >
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 rounded-control bg-card text-chip font-semibold text-foreground shadow-2xs">
                      {card.badge}
                    </span>
                    <h3 className="text-card-title font-heading text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                      {card.bnText}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-label font-semibold text-foreground underline underline-offset-4 group-hover:text-primary transition-colors">
                    <span>{card.cta}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5 — 3 Simple Steps + Final CTA */}
        <section className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                icon: ShoppingBag01Icon,
                title: "Choose a Scenario or Track",
                bnText: "আপনার লেভেল বা পেশা অনুযায়ী সংলাপ, গ্রামার স্টেজ অথবা ক্যারিয়ার ট্র্যাক বেছে নিন।",
              },
              {
                step: "02",
                icon: Mic01Icon,
                title: "Listen, Read & Speak Aloud",
                bnText: "অডিও ও বাংলা অর্থ দেখে AI রোলপ্লে পার্টনারের সাথে সরাসরি ইংরেজিতে কথা বলুন।",
              },
              {
                step: "03",
                icon: Airplane01Icon,
                title: "Retain & Level Up Daily",
                bnText: "SM-2 ভোকাবুলারি, ডেইলি প্র্যাকটিস ও কুইজের মাধ্যমে প্রতিদিন আত্মবিশ্বাস বাড়ান।",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="p-6 rounded-card bg-card shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="size-tile rounded-control bg-primary/10 text-primary flex items-center justify-center">
                    <HugeiconsIcon icon={item.icon} size={20} />
                  </div>
                  <span className="text-card-title font-mono text-muted-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-card-title font-heading text-foreground">
                  {item.title}
                </h3>
                <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                  {item.bnText}
                </p>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-b from-brand-800 to-brand-900 text-band-panel-ink rounded-card p-8 md:p-12 text-center space-y-5 shadow-xs">
            <h2 className="text-page-title font-heading text-band-panel-ink max-w-reading mx-auto">
              Ready to Start Speaking English Today?
            </h2>
            <p className="text-lead text-band-panel-ink/85 text-bangla max-w-reading mx-auto">
              আজ থেকেই ডেইলি প্র্যাকটিস, সংলাপ এবং AI পার্টনারের সাথে আপনার ইংরেজি শেখা শুরু করুন।
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full sm:w-auto text-lead rounded-control shadow-sm gap-2 px-8"
                >
                  <HugeiconsIcon icon={PlayCircleIcon} size={20} />
                  <span>Go to Dashboard</span>
                </Button>
              </Link>
              <Link href="/daily-practice" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto text-body rounded-control bg-band-panel text-band-panel-ink border-band-panel-border gap-2 text-bangla"
                >
                  <span>ডেইলি প্র্যাকটিস শুরু করুন</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container-app flex flex-col md:flex-row items-center justify-between gap-4 text-chip text-muted-foreground">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="English Partner"
              className="h-7 w-auto object-contain"
            />
            <span>© 2026 EnglishPartner by MansurVerse. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/explore" className="hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/grammar-path" className="hover:text-foreground transition-colors">
              Grammar Path
            </Link>
            <Link href="/roleplay" className="hover:text-foreground transition-colors">
              AI Partner
            </Link>
            <Link href="/professions" className="hover:text-foreground transition-colors">
              Professions
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
