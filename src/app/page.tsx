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
  Mic01Icon,
  GraduationCapIcon,
  UserGroupIcon,
  Award01Icon,
  Calendar01Icon,
  Bookmark01Icon,
  Layers01Icon,
  Target01Icon,
  Message01Icon,
  TranslateIcon,
  VolumeHighIcon,
  Rocket01Icon,
  Airplane01Icon,
} from "@hugeicons/core-free-icons";

interface HighlightCardProps {
  topic: string;
  href: string;
  icon: typeof ShoppingBag01Icon;
  title: string;
  bnDescription: string;
  badgeText: string;
}

function HighlightCard({
  topic,
  href,
  icon: IconComponent,
  title,
  bnDescription,
  badgeText,
}: HighlightCardProps) {
  return (
    <Link href={href} className="block group">
      <Card
        data-topic={topic}
        className="h-full p-5 md:p-6 rounded-card bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
      >
        <div className="space-y-3">
          <div className="size-tile rounded-control emoji-tile flex items-center justify-center">
            <HugeiconsIcon icon={IconComponent} size={24} />
          </div>
          <h2 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-meta text-muted-foreground text-bangla">
            {bnDescription}
          </p>
        </div>
        <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-chip text-muted-foreground">
          <span>{badgeText}</span>
          <span className="text-primary flex items-center gap-1 font-semibold">
            Explore <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </span>
        </div>
      </Card>
    </Link>
  );
}

const APP_FEATURES = [
  {
    href: "/explore",
    icon: Message01Icon,
    title: "42+ Real-Life Dialogues & 20-Step Ladder",
    bnText:
      "দৈনন্দিন কেনাকাটা, ভ্রমণ, হাসপাতাল ও অফিসের বাস্তব সংলাপ—২০ ধাপের গাইডেড ল্যাডার ও US/UK অডিও সহ।",
    tag: "Explore",
  },
  {
    href: "/grammar-path",
    icon: BookOpen01Icon,
    title: "8-Stage Grammar Learning Path",
    bnText:
      "Parts of Speech ও Tense থেকে শুরু করে Voice, Narration ও Clauses—৩৮টি বিস্তারিত লেসন, ওয়ার্ড ব্যাংক ও কুইজ।",
    tag: "Grammar",
  },
  {
    href: "/roleplay",
    icon: BotIcon,
    title: "AI Roleplay Partner",
    bnText:
      "১০টির বেশি রোলপ্লে টপিক বা ফ্রি-স্টাইল মোডে AI পার্টনারের সাথে সরাসরি ইংরেজিতে কথা বলুন ও তাৎক্ষণিক ফিডব্যাক পান।",
    tag: "AI Practice",
  },
  {
    href: "/what-should-i-say",
    icon: SparklesIcon,
    title: '"What Should I Say?" Assistant',
    bnText:
      "বাংলা বা ইংরেজিতে যেকোনো পরিস্থিতি লিখুন—মুহূর্তেই মার্জিত, স্বাভাবিক ও ব্যবহারযোগ্য ইংরেজি বাক্য পেয়ে যান।",
    tag: "Instant Phrases",
  },
  {
    href: "/professions",
    icon: Briefcase01Icon,
    title: "Professional English Career Tracks",
    bnText:
      "UI/UX Designer, Software Engineer, Freelancer, Healthcare ও Teacher-দের জন্য আলাদা পেশাগত ইংরেজি ট্র্যাক।",
    tag: "Careers",
  },
  {
    href: "/vocabulary",
    icon: Bookmark01Icon,
    title: "Smart Vocabulary (SM-2) & Quiz",
    bnText:
      "অর্থসহ শব্দ সেভ করুন, বৈজ্ঞানিক SM-2 স্পেসড রিপিটেশন দিয়ে রিভিশন দিন এবং ইন্টারেক্টিভ কুইজে দক্ষতা যাচাই করুন।",
    tag: "Retention",
  },
];

const LEARNING_OUTCOMES = [
  {
    icon: VolumeHighIcon,
    title: "Natural Pronunciation",
    bnText: "US ও UK অ্যাক্সেন্টে প্রতিটি লাইন শুনে সঠিক উচ্চারণ ও কথা বলার ছন্দ আয়ত্ত করুন।",
  },
  {
    icon: TranslateIcon,
    title: "Context-First Grammar",
    bnText: "সংলাপের ভেতরেই লাইভ গ্রামার হাইলাইট ও সহজ বাংলা ব্যাখ্যায় বাক্য গঠন শিখুন।",
  },
  {
    icon: Target01Icon,
    title: "Workplace Confidence",
    bnText: "ক্লায়েন্ট মিটিং, স্ট্যান্ডআপ, কোড রিভিউ ও প্রেজেন্টেশনে সাবলীলভাবে কথা বলুন।",
  },
  {
    icon: Layers01Icon,
    title: "Long-Term Retention",
    bnText: "মুখস্থ না করে নিয়মিত ডেইলি প্র্যাকটিস ও SM-2 রিভিউয়ে শব্দ স্থায়ীভাবে মনে রাখুন।",
  },
];

const TARGET_AUDIENCES = [
  {
    icon: GraduationCapIcon,
    title: "Students & Beginners",
    level: "A1 – A2",
    bnText:
      "যারা একদম শুরু থেকে বাংলা ব্যাখ্যাসহ সহজ ইংরেজি বলা ও গ্রামার ভিত্তি মজবুত করতে চান।",
  },
  {
    icon: Award01Icon,
    title: "Job Seekers & Interviewees",
    level: "B1 – B2",
    bnText:
      "চাকরির ইন্টারভিউ ও কর্পোরেট যোগাযোগে আত্মবিশ্বাসী ও পেশাদার উত্তর দেওয়ার প্রস্তুতি নিন।",
  },
  {
    icon: Rocket01Icon,
    title: "Freelancers & Remote Tech",
    level: "B1 – C2",
    bnText:
      "আন্তর্জাতিক ক্লায়েন্ট ডিসকভারি, প্রজেক্ট আপডেট ও ফিডব্যাক হ্যান্ডলিং দক্ষতা বাড়ান।",
  },
  {
    icon: Airplane01Icon,
    title: "Travelers & Daily Speakers",
    level: "A1 – B1",
    bnText:
      "এয়ারপোর্ট, হোটেল, শপিং, ডাক্তার ও দৈনন্দিন সামাজিক পরিস্থিতি সামলানোর বাস্তব সংলাপ শিখুন।",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    icon: Calendar01Icon,
    title: "Pick Your Path or Daily Practice",
    bnText:
      "আপনার লক্ষ্য অনুযায়ী একটি কনভারসেশন ল্যাডার, গ্রামার স্টেজ অথবা প্রফেশনাল ট্র্যাক বেছে নিন।",
  },
  {
    step: "02",
    icon: Mic01Icon,
    title: "Listen, Inspect & Speak Aloud",
    bnText:
      "অডিও শুনে বাংলা অনুবাদ ও গ্রামার স্ট্রাকচার দেখুন, তারপর AI পার্টনার বা ভয়েস প্র্যাকটিসে নিজে বলুন।",
  },
  {
    step: "03",
    icon: UserGroupIcon,
    title: "Save Words & Track Mastery",
    bnText:
      "নতুন শব্দ ভোকাবুলারিতে সেভ করুন, কুইজ দিন এবং প্রগ্রেস ড্যাশবোর্ডে নিজের উন্নতি দেখুন।",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* 1. Top Navigation Bar */}
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

      {/* 2. Section 1 — Hero Band */}
      <section className="bg-gradient-to-b from-brand-800 to-brand-900 text-band-panel-ink rounded-band pt-12 pb-18 md:pt-16 md:pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-reading mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill text-chip bg-band-panel text-band-panel-ink shadow-2xs backdrop-blur-xs">
            <HugeiconsIcon icon={SparklesIcon} size={16} className="text-sun-500" />
            <span>Complete Spoken English &amp; Grammar Platform for Bangla Speakers</span>
          </div>

          <h1 className="text-page-title font-heading tracking-tight text-band-panel-ink max-w-reading mx-auto leading-tight">
            Speak Real-Life English With Confidence — From Bangla to Fluency
          </h1>

          <p className="text-lead text-band-panel-ink/85 text-bangla max-w-reading mx-auto leading-relaxed">
            বাস্তব জীবনের প্রাসঙ্গিক সংলাপ, বাংলা অনুবাদ, ৮ ধাপের গ্রামার পাথ, AI রোলপ্লে পার্টনার এবং স্মার্ট ভোকাবুলারি অনুশীলনের মাধ্যমে সাবলীল ইংরেজি শিখুন।
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

      <main className="flex-1 container-app pb-16 space-y-16 md:space-y-20">
        {/* 3. Section 2 — Overlapping Quick-Start Paths */}
        <section className="overlap-band relative z-base">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <HighlightCard
              topic="shopping"
              href="/explore"
              icon={ShoppingBag01Icon}
              title="Everyday & Shopping"
              bnDescription="দোকানে দাম জানতে চাওয়া, ছাড়ের কথা বলা এবং বিল পরিশোধ করার ২০ ধাপের বাস্তব কথোপকথন।"
              badgeText="20-Step Ladder"
            />
            <HighlightCard
              topic="travel"
              href="/grammar-path"
              icon={BookOpen01Icon}
              title="8-Stage Grammar Path"
              bnDescription="সহজ বাংলা নিয়ম, ওয়ার্ড ব্যাংক, বাক্য তৈরি ও ১০ প্রশ্নের কুইজসহ ৩৮টি ধাপে ধাপে গ্রামার লেসন।"
              badgeText="38 Detailed Lessons"
            />
            <HighlightCard
              topic="workplace"
              href="/roleplay"
              icon={BotIcon}
              title="AI Roleplay & Careers"
              bnDescription="AI পার্টনারের সাথে বাস্তব রোলপ্লে প্র্যাকটিস এবং ৫টি পেশাগত ক্যারিয়ার ট্র্যাকে ইংরেজি দক্ষতা।"
              badgeText="Live AI + 5 Tracks"
            />
          </div>
        </section>

        {/* 4. Section 3 — Core Web App Features */}
        <section className="space-y-8">
          <div className="text-center max-w-reading mx-auto space-y-2.5">
            <p className="text-chip uppercase tracking-wider text-primary font-semibold">
              Platform Features
            </p>
            <h2 className="text-page-title font-heading text-foreground">
              Everything You Need to Master English
            </h2>
            <p className="text-body text-muted-foreground text-bangla">
              কেবল মুখস্থ নয়—সংলাপ, গ্রামার, AI কথোপকথন এবং স্মার্ট রিভিশনের পূর্ণাঙ্গ সমন্বয়।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {APP_FEATURES.map((feat) => (
              <Link key={feat.href} href={feat.href} className="block group">
                <Card className="h-full p-6 rounded-card bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="size-tile rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={feat.icon} size={22} />
                      </div>
                      <span className="px-2.5 py-1 rounded-pill bg-muted text-chip text-muted-foreground">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="text-card-title font-heading text-foreground group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                      {feat.bnText}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border flex items-center justify-between text-chip text-primary font-semibold">
                    <span>Open Feature</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Section 4 — What Learners Will Learn */}
        <section className="space-y-8">
          <div className="text-center max-w-reading mx-auto space-y-2.5">
            <p className="text-chip uppercase tracking-wider text-primary font-semibold">
              Learning Outcomes
            </p>
            <h2 className="text-page-title font-heading text-foreground">
              What You Will Learn &amp; Gain
            </h2>
            <p className="text-body text-muted-foreground text-bangla">
              প্রতিদিন মাত্র ১৫–৩০ মিনিট অনুশীলনে আপনার ইংরেজি বলার ও লেখার দক্ষতায় বাস্তব পরিবর্তন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LEARNING_OUTCOMES.map((item) => (
              <Card
                key={item.title}
                className="p-5 rounded-card bg-card shadow-2xs space-y-3"
              >
                <div className="size-tile rounded-control bg-sun-200 text-brand-950 flex items-center justify-center">
                  <HugeiconsIcon icon={item.icon} size={22} />
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
        </section>

        {/* 6. Section 5 — Who Is This For? */}
        <section className="space-y-8">
          <div className="text-center max-w-reading mx-auto space-y-2.5">
            <p className="text-chip uppercase tracking-wider text-primary font-semibold">
              Who It&apos;s For
            </p>
            <h2 className="text-page-title font-heading text-foreground">
              Designed for Every Bangla-Speaking Learner
            </h2>
            <p className="text-body text-muted-foreground text-bangla">
              আপনি শিক্ষার্থী, চাকরিরপ্রার্থী, ফ্রিল্যান্সার কিংবা ভ্রমণকারী—প্রত্যেকের জন্য আলাদা গাইডলাইন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TARGET_AUDIENCES.map((aud) => (
              <Card
                key={aud.title}
                className="p-5 rounded-card bg-card shadow-2xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="size-tile rounded-control bg-primary/10 text-primary flex items-center justify-center">
                      <HugeiconsIcon icon={aud.icon} size={22} />
                    </div>
                    <span className="px-2.5 py-1 rounded-pill bg-accent text-accent-foreground text-chip font-semibold">
                      {aud.level}
                    </span>
                  </div>
                  <h3 className="text-card-title font-heading text-foreground">
                    {aud.title}
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                    {aud.bnText}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 7. Section 6 — How It Works + Final CTA */}
        <section className="space-y-10">
          <div className="text-center max-w-reading mx-auto space-y-2.5">
            <p className="text-chip uppercase tracking-wider text-primary font-semibold">
              How It Works
            </p>
            <h2 className="text-page-title font-heading text-foreground">
              Start Speaking in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS_STEPS.map((s) => (
              <Card
                key={s.step}
                className="p-6 rounded-card bg-card shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="size-tile rounded-control bg-primary/10 text-primary flex items-center justify-center">
                    <HugeiconsIcon icon={s.icon} size={22} />
                  </div>
                  <span className="text-card-title font-mono text-muted-foreground">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-card-title font-heading text-foreground">
                  {s.title}
                </h3>
                <p className="text-meta text-muted-foreground text-bangla leading-relaxed">
                  {s.bnText}
                </p>
              </Card>
            ))}
          </div>

          {/* Final SaaS CTA Card */}
          <Card className="bg-gradient-to-b from-brand-800 to-brand-900 text-band-panel-ink rounded-card p-8 md:p-12 text-center space-y-5 shadow-xs">
            <h2 className="text-page-title font-heading text-band-panel-ink max-w-reading mx-auto">
              Ready to Build Real English Fluency?
            </h2>
            <p className="text-lead text-band-panel-ink/85 text-bangla max-w-reading mx-auto">
              আজ থেকেই ডেইলি প্র্যাকটিস, সংলাপ এবং AI পার্টনারের সাথে ইংরেজি বলা শুরু করুন।
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
