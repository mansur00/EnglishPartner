import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayCircleIcon,
  ArrowRight01Icon,
  SparklesIcon,
  BookOpen01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* 1. Greeting Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--ecp-brand-950)]">
            Good day, Learner! 👋
          </h1>
          <p className="text-sm text-[var(--ecp-text-secondary)] mt-1">
            Ready to practice real-life English conversation today?
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="accent" size="md">
            🎯 Target: 10 mins/day
          </Badge>
          <Badge variant="brand" size="md">
            ⚡ Day 1 Streak
          </Badge>
        </div>
      </div>

      {/* 2. Today's Recommended Conversation (Hero Feature) */}
      <Card variant="warm" className="relative overflow-hidden border-[var(--ecp-accent-400)]/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Daily Recommendation</Badge>
              <Badge variant="neutral">A2 • Elementary</Badge>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--ecp-brand-950)]">
              Ordering Food & Asking for the Bill at a Restaurant
            </h2>
            <p className="text-sm text-[var(--ecp-text-secondary)] max-w-xl">
              Learn how to order your meal, request recommendations from the server, and politely ask for the check.
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--ecp-text-muted)] pt-1">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Clock01Icon} size={15} /> 5-8 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={BookOpen01Icon} size={15} /> 8 dialogue turns
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Link href="/explore">
              <Button variant="primary" size="lg" className="w-full md:w-auto shadow-md">
                <HugeiconsIcon icon={PlayCircleIcon} size={20} className="mr-1.5" />
                Start Conversation
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 3. Explore Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Life Module */}
        <Card className="hover:border-[var(--ecp-brand-700)]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--ecp-brand-100)] text-[var(--ecp-brand-800)] flex items-center justify-center font-bold">
              🏡
            </div>
            <Badge variant="brand">20 Categories</Badge>
          </div>
          <h3 className="text-lg font-bold text-[var(--ecp-text-primary)] mb-1">
            Everyday & Social English
          </h3>
          <p className="text-sm text-[var(--ecp-text-secondary)] mb-4">
            Shopping, transport, airport, health, dining out, and daily social communications.
          </p>
          <Link href="/explore">
            <Button variant="outline" size="sm" className="w-full justify-between">
              Browse Everyday Library
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
            </Button>
          </Link>
        </Card>

        {/* Professional English Module */}
        <Card className="hover:border-[var(--ecp-accent-500)]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--ecp-accent-100)] text-[#8A6318] flex items-center justify-center font-bold">
              💼
            </div>
            <Badge variant="accent">30+ Job Roles</Badge>
          </div>
          <h3 className="text-lg font-bold text-[var(--ecp-text-primary)] mb-1">
            Professional Conversations
          </h3>
          <p className="text-sm text-[var(--ecp-text-secondary)] mb-4">
            Role-specific tracks: UI/UX Designer, Software Engineer, Manager, Doctor, and Freelancer.
          </p>
          <Link href="/explore">
            <Button variant="outline" size="sm" className="w-full justify-between">
              Explore Professional Paths
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* 4. Continue Learning / Saved Progress */}
      <Card variant="muted">
        <div className="flex items-center gap-2.5 mb-2">
          <HugeiconsIcon icon={SparklesIcon} size={18} className="text-[var(--ecp-brand-800)]" />
          <h3 className="text-base font-bold text-[var(--ecp-text-primary)]">
            Your Progress & Saved Material
          </h3>
        </div>
        <p className="text-sm text-[var(--ecp-text-secondary)]">
          You haven&apos;t started any conversations yet. Pick a scenario from the library above to begin tracking your vocabulary and fluency progress!
        </p>
      </Card>
    </div>
  );
}
