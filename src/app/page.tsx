"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeMute01Icon } from "@hugeicons/core-free-icons";

export default function Home() {
  const [showTranslation, setShowTranslation] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--ecp-canvas)] text-[var(--ecp-text-primary)] font-[var(--ecp-font-sans)] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-[var(--ecp-border)] bg-[var(--ecp-surface)] sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--ecp-brand-800)] flex items-center justify-center text-white font-semibold text-lg shadow-sm">
            E
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight text-[var(--ecp-brand-950)]">
              English Conversation Partner
            </h1>
            <p className="text-xs text-[var(--ecp-text-secondary)] font-medium">
              Phase 0 Foundation & Design System Verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--ecp-brand-100)] text-[var(--ecp-brand-800)]">
            বাংলা / English
          </span>
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--ecp-success-surface)] text-[var(--ecp-success)] border border-[var(--ecp-success)]/20 hover:opacity-90 transition-opacity"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--ecp-success)] animate-pulse" />
            API Health Check
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Banner Section */}
        <section className="bg-[var(--ecp-surface)] border border-[var(--ecp-border)] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--ecp-accent-100)] text-[var(--ecp-brand-950)] border border-[var(--ecp-accent-400)]/40">
              CEFR A2 • Elementary
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--topic-tile)] text-[var(--topic-ink)] border border-[var(--topic-border)]">
              Everyday • Shopping & Money
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--ecp-surface-muted)] text-[var(--ecp-text-secondary)]">
              4 exchanges • Short
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-[var(--ecp-brand-950)] mb-2">
            Asking for a Price & Product Details
          </h2>
          <p className="text-sm text-[var(--ecp-text-secondary)] max-w-2xl">
            Learn how to naturally inquire about items, ask about pricing in a store, and verify payment methods without hesitation.
          </p>
        </section>

        {/* Conversation Turn Verification Component */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--ecp-text-primary)]">
              Conversation Turn Preview (Component Contract Test)
            </h3>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-[var(--ecp-surface)] border border-[var(--ecp-border)] text-[var(--ecp-text-secondary)] hover:text-[var(--ecp-brand-800)] hover:border-[var(--ecp-brand-800)]/30 transition-colors"
            >
              {showTranslation ? "Hide Translations" : "Show Translations (অনুবাদ দেখুন)"}
            </button>
          </div>

          {/* Turn 1 */}
          <div className="bg-[var(--ecp-surface)] border border-[var(--ecp-border)] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--ecp-brand-100)] text-[var(--ecp-brand-800)] flex items-center justify-center font-semibold text-xs">
                  C
                </span>
                <span className="text-sm font-semibold text-[var(--ecp-brand-900)]">
                  Customer (ক্রেতা)
                </span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[var(--ecp-text-muted)] bg-[var(--ecp-surface-muted)] cursor-not-allowed"
                title="Audio will be generated via Piper TTS in Milestone 1C"
              >
                <HugeiconsIcon icon={VolumeMute01Icon} size={15} />
                Audio not available yet
              </button>
            </div>

            <p className="text-lg font-medium text-[var(--ecp-text-primary)]">
              &ldquo;Excuse me, could you tell me how much this blue jacket costs?&rdquo;
            </p>

            {showTranslation && (
              <p className="text-sm text-[var(--ecp-text-secondary)] font-[var(--ecp-font-bangla)] pt-1 border-t border-[var(--ecp-border)]/60">
                মাফ করবেন, আপনি কি বলতে পারেন এই নীল জ্যাকেটটির দাম কত?
              </p>
            )}
          </div>

          {/* Turn 2 */}
          <div className="bg-[var(--ecp-surface-warm)] border border-[var(--ecp-border)] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--ecp-accent-100)] text-[var(--ecp-brand-950)] flex items-center justify-center font-semibold text-xs">
                  S
                </span>
                <span className="text-sm font-semibold text-[var(--ecp-text-primary)]">
                  Shop Assistant (দোকানদার)
                </span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[var(--ecp-text-muted)] bg-[var(--ecp-surface-muted)] cursor-not-allowed"
              >
                <HugeiconsIcon icon={VolumeMute01Icon} size={15} />
                Audio not available yet
              </button>
            </div>

            <p className="text-lg font-medium text-[var(--ecp-text-primary)]">
              &ldquo;Certainly! It is forty-five dollars, and today we have a ten percent discount on it.&rdquo;
            </p>

            {showTranslation && (
              <p className="text-sm text-[var(--ecp-text-secondary)] font-[var(--ecp-font-bangla)] pt-1 border-t border-[var(--ecp-border)]/60">
                অবশ্যই! এটার দাম ৪৫ ডলার, এবং আজ এটার ওপর ১০ শতাংশ ছাড় চলছে।
              </p>
            )}
          </div>
        </section>

        {/* Design System Primitives Test Grid */}
        <section className="bg-[var(--ecp-surface)] border border-[var(--ecp-border)] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-[var(--ecp-brand-950)]">
            UI Primitives & Token Verification
          </h3>

          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-lg bg-[var(--ecp-brand-800)] text-white font-semibold text-sm hover:bg-[var(--ecp-brand-700)] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ecp-brand-800)] focus:ring-offset-2">
              Primary Brand Button
            </button>
            <button className="px-4 py-2 rounded-lg bg-[var(--ecp-accent-500)] text-[var(--ecp-brand-950)] font-semibold text-sm hover:bg-[var(--ecp-accent-400)] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ecp-accent-500)] focus:ring-offset-2">
              Warm Accent Action
            </button>
            <button className="px-4 py-2 rounded-lg bg-[var(--ecp-surface)] border border-[var(--ecp-border-strong)] text-[var(--ecp-text-primary)] font-semibold text-sm hover:bg-[var(--ecp-surface-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ecp-border-strong)]">
              Secondary Outline
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--ecp-border)] bg-[var(--ecp-surface)] py-4 text-center text-xs text-[var(--ecp-text-muted)]">
        English Conversation Partner • Phase 0 Setup Verified • All Systems Operational
      </footer>
    </div>
  );
}
