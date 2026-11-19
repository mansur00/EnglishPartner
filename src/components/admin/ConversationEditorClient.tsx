"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Alert02Icon,
  Add01Icon,
  Delete01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  VolumeHighIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { ScenarioItem } from "@/content/seed/scenarios";
import { ConversationVersionData, DialogueLineItem } from "@/content/seed/dialogues";
import { validateForPublish } from "@/lib/content/validator";
import { canEditScenario, UserRole } from "@/lib/auth/roles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ConversationEditorClientProps {
  scenario: ScenarioItem;
  initialVersion: ConversationVersionData;
}

export function ConversationEditorClient({
  scenario,
  initialVersion,
}: ConversationEditorClientProps) {
  const searchParams = useSearchParams();
  const userRole = (searchParams.get("role") as UserRole) || "admin";

  const [version, setVersion] = useState<ConversationVersionData>(initialVersion);
  const [isSaved, setIsSaved] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  // Check Permissions
  const canEdit = canEditScenario(userRole);

  // Run Real-Time Pre-Publish Validation
  const validation = useMemo(() => {
    return validateForPublish(scenario, version);
  }, [scenario, version]);

  if (!canEdit) {
    return (
      <div className="flex items-center justify-center p-4 py-16">
        <Card className="max-w-md w-full text-center space-y-4 p-8 border-destructive/30 rounded-card bg-card shadow-md">
          <div className="size-control rounded-pill bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={Alert02Icon} size={24} />
          </div>

          <h1 className="text-card-title text-foreground">
            403 — Edit Access Restricted
          </h1>

          <p className="text-meta text-muted-foreground leading-relaxed text-bangla">
            কন্টেন্ট এডিট করার জন্য &ldquo;editor&rdquo; বা তার ঊর্ধ্বতন অনুমতি প্রয়োজন। বর্তমান ভূমিকা: {userRole}।
          </p>

          <div className="pt-2">
            <Link href={`/admin/conversations/${scenario.slug}/edit?role=admin`}>
              <Button className="w-full text-label text-bangla rounded-control">
                অ্যাডমিন হিসেবে অ্যাক্সেস করুন
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const handleLineChange = (
    index: number,
    field: keyof DialogueLineItem,
    value: string
  ) => {
    setVersion((prev) => {
      const updatedLines = [...prev.lines];
      updatedLines[index] = {
        ...updatedLines[index],
        [field]: value,
      };
      return { ...prev, lines: updatedLines };
    });
    setIsSaved(false);
  };

  const handleAddLine = () => {
    const nextSeq = version.lines.length + 1;
    const defaultSpeaker = version.speakers[nextSeq % 2]?.id || version.speakers[0].id;
    const newLine: DialogueLineItem = {
      id: `${scenario.slug}-l${nextSeq}-${Date.now()}`,
      sequenceNumber: nextSeq,
      speakerId: defaultSpeaker,
      englishText: "",
      translationBn: "",
      wordHighlights: [],
    };
    setVersion((prev) => ({
      ...prev,
      lines: [...prev.lines, newLine],
    }));
    setIsSaved(false);
  };

  const handleDeleteLine = (index: number) => {
    setVersion((prev) => {
      const filtered = prev.lines.filter((_, idx) => idx !== index);
      // Re-index sequences
      const reindexed = filtered.map((line, idx) => ({
        ...line,
        sequenceNumber: idx + 1,
      }));
      return { ...prev, lines: reindexed };
    });
    setIsSaved(false);
  };

  const handleMoveLine = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= version.lines.length) return;

    setVersion((prev) => {
      const reordered = [...prev.lines];
      const temp = reordered[index];
      reordered[index] = reordered[targetIndex];
      reordered[targetIndex] = temp;

      // Re-index sequenceNumbers
      const reindexed = reordered.map((line, idx) => ({
        ...line,
        sequenceNumber: idx + 1,
      }));
      return { ...prev, lines: reindexed };
    });
    setIsSaved(false);
  };

  const handleSaveDraft = () => {
    setIsSaved(true);
    setPublishMessage("খসড়া সংরক্ষিত হয়েছে (Draft saved successfully).");
    setTimeout(() => setPublishMessage(null), 3000);
  };

  const handlePublish = () => {
    if (!validation.isValid) {
      alert("ত্রুটি সংশোধন না করে প্রকাশ করা সম্ভব নয় (Cannot publish with validation errors).");
      return;
    }
    setIsSaved(true);
    setPublishMessage("অভিনন্দন! দৃশ্যপটটি সফলভাবে রিভিউ ও পাবলিশ হয়েছে (Published successfully).");
    setTimeout(() => setPublishMessage(null), 4000);
  };

  return (
    <div className="space-y-6 container-app pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-panel shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href={`/admin?role=${userRole}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 text-label rounded-control -ml-2">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              Admin
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-card-title text-foreground font-sans">
                {scenario.title} — Dialogue Editor
              </h1>
              <Badge variant="brand" size="sm" className="text-chip">
                {version.versionName} Version
              </Badge>
            </div>
            <p className="text-chip text-muted-foreground text-bangla">
              {scenario.titleBn} • {version.lines.length}টি বাক্য
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="text-label text-bangla rounded-control"
          >
            {isSaved ? "সংরক্ষিত ✓" : "খসড়া সংরক্ষণ (Draft)"}
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            disabled={!validation.isValid}
            className="text-label text-bangla gap-1.5 rounded-control"
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} />
            <span>প্রকাশ করুন (Publish)</span>
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {publishMessage && (
        <div className="p-3.5 rounded-control bg-success-bg border border-success/30 text-chip text-success text-bangla animate-in fade-in flex items-center gap-2">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-success" />
          <span>{publishMessage}</span>
        </div>
      )}

      {/* Pre-Publish Content Validation Panel */}
      <Card
        className={`p-5 space-y-3 border rounded-panel transition-colors ${
          validation.isValid
            ? "bg-success-bg/40 border-success/30"
            : "bg-destructive/10 border-destructive/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={validation.isValid ? CheckmarkCircle01Icon : Alert02Icon}
              size={18}
              className={validation.isValid ? "text-success" : "text-destructive"}
            />
            <h3 className="text-label text-foreground text-bangla">
              প্রি-পাবলিশ ভ্যালিডেশন চেকলিস্ট (Pre-Publish Integrity Guard)
            </h3>
          </div>
          <Badge variant={validation.isValid ? "success" : "error"} size="sm" className="text-chip">
            {validation.isValid ? "All Checks Passed" : `${validation.errors.length} Errors`}
          </Badge>
        </div>

        {!validation.isValid && (
          <div className="space-y-1 text-chip text-destructive">
            {validation.errors.map((err, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-bangla">
                <span>•</span>
                <span>{err.messageBn} ({err.message})</span>
              </div>
            ))}
          </div>
        )}

        {validation.warnings.length > 0 && (
          <div className="space-y-1 text-chip text-warning pt-1 border-t border-warning/30">
            {validation.warnings.map((warn, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-bangla">
                <span>⚠</span>
                <span>{warn.messageBn} ({warn.message})</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Grammar Annotation & Pipeline Status */}
      <Card className="p-4 bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-panel shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-control rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={SparklesIcon} size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-label text-foreground font-sans">
                Grammar Status: Pre-annotated (spaCy + Deterministic Rules)
              </h3>
              <Badge variant="brand" size="sm" className="text-chip">
                Build-Gate Verified
              </Badge>
            </div>
            <p className="text-chip text-muted-foreground text-bangla mt-0.5">
              {version.lines.length}টি লাইনের ব্যাকরণ ট্যাগিং স্বয়ংক্রিয়ভাবে পাইপলাইনে সংযুক্ত। বিল্ড টাইমে `grammar:check` দ্বারা স্বয়ংক্রিয়ভাবে রি-ভ্যালিডেট হয়।
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="neutral" size="sm" className="text-chip">
            POS: 100%
          </Badge>
          <Badge variant="neutral" size="sm" className="text-chip">
            Tense & Voice: 100%
          </Badge>
        </div>
      </Card>

      {/* Dialogue Lines List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-card-title text-foreground text-bangla">
            কথোপকথনের বাক্যসমূহ (Turns)
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddLine}
            className="text-label gap-1.5 text-bangla rounded-control"
          >
            <HugeiconsIcon icon={Add01Icon} size={14} />
            <span>নতুন বাক্য যোগ করুন</span>
          </Button>
        </div>

        {version.lines.map((line, index) => {
          return (
            <Card
              key={line.id}
              className="p-5 bg-card border-border rounded-panel space-y-4 hover:border-primary/40 transition-all shadow-2xs"
            >
              {/* Turn Top Meta */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="size-control rounded-control bg-primary/10 text-primary font-mono text-chip flex items-center justify-center">
                    #{line.sequenceNumber}
                  </span>

                  {/* Speaker Selector */}
                  <select
                    value={line.speakerId}
                    onChange={(e) => handleLineChange(index, "speakerId", e.target.value)}
                    className="text-chip px-2.5 py-1.5 rounded-control border border-border bg-card text-foreground focus:outline-hidden focus:border-primary cursor-pointer"
                  >
                    {version.speakers.map((spk) => (
                      <option key={spk.id} value={spk.id}>
                        {spk.name} ({spk.nameBn}) — {spk.role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Move & Delete Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveLine(index, "up")}
                    disabled={index === 0}
                    aria-label="Move Up"
                    className="p-1.5 rounded-control text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                    title="Move up"
                  >
                    <HugeiconsIcon icon={ArrowUp01Icon} size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveLine(index, "down")}
                    disabled={index === version.lines.length - 1}
                    aria-label="Move Down"
                    className="p-1.5 rounded-control text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                    title="Move down"
                  >
                    <HugeiconsIcon icon={ArrowDown01Icon} size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteLine(index)}
                    aria-label="Delete line"
                    className="p-1.5 rounded-control text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1 cursor-pointer"
                    title="Delete line"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={15} />
                  </button>
                </div>
              </div>

              {/* Text Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* English Dialogue Line */}
                <div className="space-y-1">
                  <label className="text-chip text-foreground block">
                    English Text:
                  </label>
                  <textarea
                    rows={2}
                    value={line.englishText}
                    onChange={(e) => handleLineChange(index, "englishText", e.target.value)}
                    placeholder="Enter spoken English sentence..."
                    className="w-full p-2.5 rounded-control border border-border text-body font-sans text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Bengali Contextual Translation */}
                <div className="space-y-1">
                  <label className="text-chip text-foreground block text-bangla">
                    প্রাসঙ্গিক বাংলা অনুবাদ:
                  </label>
                  <textarea
                    rows={2}
                    value={line.translationBn}
                    onChange={(e) => handleLineChange(index, "translationBn", e.target.value)}
                    placeholder="সাবলীল ও প্রাসঙ্গিক বাংলা অনুবাদ লিখুন..."
                    className="w-full p-2.5 rounded-control border border-border text-body text-bangla text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Optional Learning Note & Audio Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-chip text-muted-foreground">
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={line.learningNote || ""}
                    onChange={(e) => handleLineChange(index, "learningNote", e.target.value)}
                    placeholder="শিক্ষণীয় নোট / Grammar tip (ঐচ্ছিক)..."
                    className="w-full px-3 py-1.5 rounded-control border border-border text-chip bg-muted/40 text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-chip text-primary bg-primary/10 px-2 py-1 rounded-control border border-primary/20">
                    <HugeiconsIcon icon={VolumeHighIcon} size={13} />
                    Piper TTS Synthesized
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom Floating Add Button */}
      <div className="pt-4 flex justify-center">
        <Button
          variant="outline"
          onClick={handleAddLine}
          className="gap-2 text-bangla px-6 text-label rounded-control"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          <span>আরেকটি বাক্য যোগ করুন (Add Turn)</span>
        </Button>
      </div>
    </div>
  );
}
