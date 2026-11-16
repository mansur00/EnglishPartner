import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[var(--ecp-canvas)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center space-y-4 p-8 border-[var(--ecp-error)]/30">
        <div className="w-12 h-12 rounded-full bg-[var(--ecp-error-surface)] text-[var(--ecp-error)] flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={Alert02Icon} size={24} />
        </div>

        <h1 className="text-xl font-bold text-[var(--ecp-text-primary)]">
          403 — Unauthorized Access
        </h1>

        <p className="text-sm text-[var(--ecp-text-secondary)] leading-relaxed">
          The content administration panel is restricted to authorized editors and reviewers. Role assignment will be fully activated in Milestone 1E.
        </p>

        <div className="pt-2">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full gap-2">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              Return to Learner Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
