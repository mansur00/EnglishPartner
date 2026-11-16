import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, Filter, PlayCircle, BookOpen } from "lucide-react";

export default function ExplorePage() {
  const sampleScenarios = [
    {
      id: "1",
      title: "Asking for a Price & Product Details",
      category: "Shopping & Money",
      level: "A1 • Beginner",
      turns: "4 exchanges",
      description: "Learn how to ask store clerks about item pricing and available colors.",
    },
    {
      id: "2",
      title: "Hotel Check-in & Inquiring About Amenities",
      category: "Travel & Transportation",
      level: "A2 • Elementary",
      turns: "6 exchanges",
      description: "Check in with the receptionist, request your room key, and ask about Wi-Fi.",
    },
    {
      id: "3",
      title: "Describing Symptoms to a Doctor",
      category: "Health & Hospital",
      level: "B1 • Intermediate",
      turns: "8 exchanges",
      description: "Explain how you feel, describe aches, and understand prescription instructions.",
    },
    {
      id: "4",
      title: "Introducing Design Role & Kickoff Questions",
      category: "UI/UX Designer Path",
      level: "B1 • Intermediate",
      turns: "8 exchanges",
      description: "Introduce your role to client stakeholders and ask key project discovery questions.",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--ecp-brand-950)]">
          Explore Conversations
        </h1>
        <p className="text-sm text-[var(--ecp-text-secondary)] mt-1">
          Browse realistic everyday situations and professional dialogues.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ecp-text-muted)]" />
          <input
            type="text"
            placeholder="Search situations (e.g. airport, doctor, refund, interview)..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[var(--ecp-border-strong)] bg-[var(--ecp-surface)] text-sm text-[var(--ecp-text-primary)] placeholder:text-[var(--ecp-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ecp-brand-800)]"
          />
        </div>
        <Button variant="outline" className="h-11 gap-2 shrink-0">
          <Filter className="w-4 h-4" />
          Filters (All Levels)
        </Button>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {sampleScenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className="flex flex-col justify-between hover:border-[var(--ecp-brand-800)]/40 transition-all hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="brand">{scenario.category}</Badge>
                <Badge variant="neutral">{scenario.level}</Badge>
              </div>

              <h2 className="text-base font-bold text-[var(--ecp-text-primary)] leading-snug">
                {scenario.title}
              </h2>

              <p className="text-xs text-[var(--ecp-text-secondary)] leading-relaxed">
                {scenario.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--ecp-border)] flex items-center justify-between">
              <span className="text-xs text-[var(--ecp-text-muted)] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {scenario.turns}
              </span>

              <Link href="/">
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <PlayCircle className="w-4 h-4" />
                  Practice
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
