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
} from "@hugeicons/core-free-icons";

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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-header w-full border-b border-border bg-card/90 backdrop-blur">
        <div className="container-landing h-header flex items-center justify-between gap-4">
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

      {/* Section 1 — 2-Column SaaS Hero (Left Content + Right Illustration) */}
      <section className="container-landing pt-8 pb-4 md:pt-12 md:pb-8">
        <div className="rounded-band bg-card border border-border/60 shadow-2xs p-6 sm:p-10 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Text Content & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-accent text-accent-foreground text-chip font-semibold">
              <HugeiconsIcon icon={SparklesIcon} size={15} className="text-primary" />
              <span>Spoken English &amp; Grammar for Bangla Speakers</span>
            </div>

            <h1 className="text-landing-heading tracking-tight text-foreground leading-tight">
              Speak Real-Life English With Confidence — From Bangla to Fluency
            </h1>

            <p className="text-lead text-muted-foreground text-bangla leading-relaxed">
              বাস্তব জীবনের সংলাপ, বাংলা অনুবাদ, ৮ ধাপের গ্রামার পাথ এবং AI রোলপ্লে পার্টনারের মাধ্যমে দ্রুত ও সাবলীল ইংরেজি শিখুন।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-control px-7 gap-2 shadow-sm text-label font-semibold"
                >
                  <HugeiconsIcon icon={SparklesIcon} size={18} />
                  <span>Start Learning Free</span>
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-control px-6 gap-2 text-label text-bangla"
                >
                  <span>কথোপকথন এক্সপ্লোর করুন</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Button>
              </Link>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-chip text-muted-foreground">
              <span>42+ Real-Life Scenarios</span>
              <span>•</span>
              <span>8 Grammar Stages</span>
              <span>•</span>
              <span>5 Career Tracks</span>
              <span>•</span>
              <span>CEFR A1–C2</span>
            </div>
          </div>

          {/* Right Column: Hero Illustration */}
          <div className="lg:col-span-6 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-illustration.svg"
              alt="English Partner learning illustration"
              className="w-full h-auto max-w-lg mx-auto object-contain"
            />
          </div>
        </div>
      </section>

      <main className="flex-1 container-landing py-14 md:py-20 space-y-20 md:space-y-24">
        {/* Section 2 — Bento Features Grid with Live Mini-UI Previews */}
        <section className="space-y-8">
          <div className="text-center max-w-reading mx-auto space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-card border border-border text-chip text-muted-foreground shadow-2xs">
              <HugeiconsIcon icon={SparklesIcon} size={14} className="text-primary" />
              Our Features
            </span>
            <h2 className="text-landing-heading text-foreground">
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
              <h2 className="text-landing-heading text-foreground leading-tight">
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

        {/* Section 4 — Who It's For (4-Card Asymmetric Bento Grid Reference) */}
        <section className="space-y-8">
          <div className="text-center max-w-reading mx-auto space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-card border border-border text-chip text-muted-foreground shadow-2xs">
              Who It&apos;s For
            </span>
            <h2 className="text-landing-heading text-foreground leading-tight">
              Built for Every Learner.
              <br />
              Structured From Day One.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. Left Tall Card (4 cols, 2 rows): Students & Beginners */}
            <Link
              href="/grammar-path"
              className="lg:col-span-4 lg:row-span-2 block group"
            >
              <Card className="h-full p-6 rounded-card bg-card border border-border/70 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                    Students &amp; Beginners
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                    সহজ বাংলা ব্যাখ্যা, ২০ ধাপের গাইডেড ল্যাডার ও গ্রামার ফাউন্ডেশন দিয়ে শূন্য থেকে ইংরেজি বলা শুরু করুন।
                  </p>
                </div>

                {/* Vertical Milestone & Fluency Curve Widget */}
                <div className="rounded-panel bg-muted/35 border border-border/60 p-5 flex-1 flex flex-col justify-between gap-4 min-h-64">
                  <div className="self-end rounded-control bg-card border border-border px-3.5 py-2 shadow-xs flex items-center gap-2.5">
                    <span className="size-7 rounded-pill bg-accent text-accent-foreground text-chip font-semibold flex items-center justify-center">
                      A1
                    </span>
                    <div>
                      <p className="text-chip font-semibold text-foreground">Stage 1: Foundation</p>
                      <p className="text-chip text-muted-foreground">10 Guided Lessons</p>
                    </div>
                  </div>

                  {/* Rising Progress Steps */}
                  <div className="flex items-end gap-2 h-20 px-2">
                    <div className="flex-1 h-6 rounded-t-control bg-primary/20" />
                    <div className="flex-1 h-9 rounded-t-control bg-primary/35" />
                    <div className="flex-1 h-12 rounded-t-control bg-primary/50" />
                    <div className="flex-1 h-16 rounded-t-control bg-primary/75" />
                    <div className="flex-1 h-20 rounded-t-control bg-primary" />
                  </div>

                  <div className="rounded-control bg-card border border-border p-3.5 shadow-sm space-y-1">
                    <p className="text-chip text-muted-foreground">Confidence Score</p>
                    <p className="text-card-title font-heading text-foreground">A1 → B2</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="size-6 rounded-pill bg-sun-500 text-brand-950 text-chip font-semibold flex items-center justify-center">
                        BN
                      </span>
                      <span className="text-chip text-muted-foreground">Bilingual Support</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 2. Right Top Wide Card (8 cols): Travelers & Daily Speakers */}
            <Link href="/explore" className="lg:col-span-8 block group">
              <Card className="h-full p-6 rounded-card bg-card border border-border/70 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-6">
                <div className="space-y-2 max-w-reading">
                  <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                    Travelers &amp; Daily Speakers
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                    দোকান, বিমানবন্দর, হোটেল, হাসপাতাল ও দৈনন্দিন কথোপকথনের জন্য ৪২+ বাস্তব পরিস্থিতি অনুযায়ী সাজানো সংলাপ।
                  </p>
                </div>

                {/* Horizontal Pipeline Visual */}
                <div className="rounded-panel bg-muted/35 border border-border/60 p-5 grid grid-cols-1 sm:grid-cols-11 items-center gap-4">
                  {/* Left Mini Scenario Cards */}
                  <div className="sm:col-span-5 space-y-2">
                    <div className="rounded-control bg-card border border-border p-3 shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="size-6 rounded-pill bg-primary/15 text-primary text-chip font-semibold flex items-center justify-center">
                          01
                        </span>
                        <span className="h-2 w-24 rounded-pill bg-border" />
                      </div>
                      <div className="h-2 w-full rounded-pill bg-muted" />
                    </div>
                    <div className="rounded-control bg-card border border-border p-3 shadow-xs space-y-1.5 sm:translate-x-3">
                      <div className="flex items-center gap-2">
                        <span className="size-6 rounded-pill bg-sun-500 text-brand-950 text-chip font-semibold flex items-center justify-center">
                          02
                        </span>
                        <span className="h-2 w-28 rounded-pill bg-primary/30" />
                      </div>
                      <div className="h-2 w-4/5 rounded-pill bg-muted" />
                    </div>
                  </div>

                  {/* Center Hub Icon */}
                  <div className="sm:col-span-1 flex justify-center">
                    <div className="size-9 rounded-control bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                      <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </div>
                  </div>

                  {/* Right Category Count Pills */}
                  <div className="sm:col-span-5 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="px-3 py-1.5 rounded-control bg-card border border-border text-chip font-semibold text-foreground shadow-2xs">
                      Shopping <span className="text-primary ml-1">20</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-control bg-card border border-border text-chip font-semibold text-foreground shadow-2xs">
                      Travel <span className="text-primary ml-1">8</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-control bg-card border border-border text-chip font-semibold text-foreground shadow-2xs">
                      Workplace <span className="text-primary ml-1">6</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-control bg-card border border-border text-chip font-semibold text-foreground shadow-2xs">
                      Health <span className="text-primary ml-1">8</span>
                    </span>
                  </div>
                </div>
              </Card>
            </Link>

            {/* 3. Right Bottom Left Card (4 cols): Freelancers & Remote Tech */}
            <Link href="/professions" className="lg:col-span-4 block group">
              <Card className="h-full p-6 rounded-card bg-card border border-border/70 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                    Freelancers &amp; Remote Tech
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                    UI/UX Designer, Software Engineer ও ফ্রিল্যান্সারদের জন্য ক্লায়েন্ট মিটিং ও প্রফেশনাল ট্র্যাক।
                  </p>
                </div>

                {/* Connected 3-Node Strip */}
                <div className="rounded-panel bg-muted/35 border border-border/60 p-5 flex items-center justify-center gap-3">
                  <div className="size-12 rounded-control bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                    <HugeiconsIcon icon={Briefcase01Icon} size={20} />
                  </div>
                  <span className="h-0.5 w-5 bg-border" />
                  <div className="size-12 rounded-control bg-card border border-border text-foreground flex items-center justify-center shadow-2xs text-chip font-semibold">
                    5 Tracks
                  </div>
                  <span className="h-0.5 w-5 bg-border" />
                  <div className="size-12 rounded-control bg-sun-500 text-brand-950 flex items-center justify-center shadow-xs">
                    <HugeiconsIcon icon={BookOpen01Icon} size={20} />
                  </div>
                </div>
              </Card>
            </Link>

            {/* 4. Right Bottom Right Card (4 cols): Job Seekers & Interviewees */}
            <Link href="/roleplay" className="lg:col-span-4 block group">
              <Card className="h-full p-6 rounded-card bg-card border border-border/70 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                    Job Seekers &amp; Interviewees
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                    AI পার্টনারের সাথে রোলপ্লে ও &lsquo;What Should I Say?&rsquo; দিয়ে ইন্টারভিউ প্রস্তুতি নিন।
                  </p>
                </div>

                {/* Centered Cluster Widget */}
                <div className="rounded-panel bg-muted/35 border border-border/60 p-5 flex items-center justify-center relative">
                  <div className="rounded-pill bg-card border border-border px-4 py-2.5 shadow-xs flex items-center gap-2">
                    <span className="size-7 rounded-pill bg-primary text-primary-foreground text-chip font-semibold flex items-center justify-center">
                      AI
                    </span>
                    <span className="size-7 rounded-pill bg-sun-500 text-brand-950 text-chip font-semibold flex items-center justify-center">
                      EN
                    </span>
                    <span className="size-7 rounded-pill bg-accent text-accent-foreground text-chip font-semibold flex items-center justify-center">
                      BN
                    </span>
                    <span className="text-chip font-semibold text-foreground pl-1">
                      Live Feedback
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* Section 5 & Footer — Unified Soft Gradient CTA + Nested Footer Card */}
        <section className="rounded-band bg-gradient-to-br from-accent via-card to-sun-100/70 border border-border/60 p-4 sm:p-6 md:p-8 shadow-2xs space-y-10 md:space-y-12">
          {/* Top Half: CTA */}
          <div className="pt-8 pb-2 md:pt-12 md:pb-4 text-center space-y-5 max-w-reading mx-auto">
            <h2 className="text-landing-heading text-foreground leading-tight">
              Ready to Take Control
              <br />
              of Your English?
            </h2>
            <p className="text-meta text-muted-foreground text-bangla max-w-reading mx-auto leading-relaxed">
              বাস্তব সংলাপ, ৮ ধাপের গ্রামার পাথ এবং AI রোলপ্লে পার্টনারের সাথে আজ থেকেই আত্মবিশ্বাসী ইংরেজি বলা শুরু করুন।
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-pill px-7 shadow-xs text-label font-semibold"
                >
                  Start Now
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-pill px-6 bg-card text-foreground shadow-2xs text-label"
                >
                  Explore Dialogues
                </Button>
              </Link>
            </div>
          </div>

          {/* Bottom Half: Nested White Footer Card */}
          <footer className="rounded-card bg-card border border-border/70 p-6 sm:p-8 md:p-10 shadow-xs space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Left Brand & Email Subscribe */}
              <div className="lg:col-span-4 space-y-4">
                <Link href="/" className="inline-flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.svg"
                    alt="English Partner"
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <p className="text-meta font-semibold text-foreground">
                  Sign up to receive daily English tips.
                </p>
                <form
                  action="/dashboard"
                  className="rounded-pill border border-border bg-background p-1 flex items-center gap-2 max-w-sm"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    aria-label="Email address"
                    className="flex-1 min-w-0 bg-transparent px-3 py-1.5 text-meta text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-pill px-4 bg-foreground text-background hover:bg-foreground/90 text-chip font-semibold shrink-0"
                  >
                    Submit
                  </Button>
                </form>
                <p className="text-chip text-muted-foreground leading-relaxed max-w-xs">
                  By subscribing you agree to with our{" "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                    Privacy Policy
                  </Link>{" "}
                  and receive learning updates.
                </p>
              </div>

              {/* Right Multi-Column Links */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-meta">
                <div className="space-y-2.5">
                  <p className="text-chip font-semibold text-muted-foreground">Learning</p>
                  <ul className="space-y-2 text-foreground">
                    <li><Link href="/explore" className="hover:text-primary transition-colors">Explore</Link></li>
                    <li><Link href="/grammar-path" className="hover:text-primary transition-colors">Grammar Path</Link></li>
                    <li><Link href="/professions" className="hover:text-primary transition-colors">Career Tracks</Link></li>
                  </ul>
                </div>
                <div className="space-y-2.5">
                  <p className="text-chip font-semibold text-muted-foreground">Practice</p>
                  <ul className="space-y-2 text-foreground">
                    <li><Link href="/daily-practice" className="hover:text-primary transition-colors">Daily Practice</Link></li>
                    <li><Link href="/roleplay" className="hover:text-primary transition-colors">AI Roleplay</Link></li>
                    <li><Link href="/what-should-i-say" className="hover:text-primary transition-colors">What Should I Say?</Link></li>
                    <li><Link href="/quiz" className="hover:text-primary transition-colors">Quiz</Link></li>
                  </ul>
                </div>
                <div className="space-y-2.5">
                  <p className="text-chip font-semibold text-muted-foreground">Account</p>
                  <ul className="space-y-2 text-foreground">
                    <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                    <li><Link href="/vocabulary" className="hover:text-primary transition-colors">My Vocabulary</Link></li>
                    <li><Link href="/progress" className="hover:text-primary transition-colors">My Progress</Link></li>
                  </ul>
                </div>
                <div className="space-y-2.5">
                  <p className="text-chip font-semibold text-muted-foreground">Legal</p>
                  <ul className="space-y-2 text-foreground">
                    <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                    <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border text-center text-chip text-muted-foreground">
              © 2026 EnglishPartner by MansurVerse, All rights reserved.
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
