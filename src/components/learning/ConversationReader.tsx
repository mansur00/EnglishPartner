"use client";

import { useState } from "react";
import { ConversationTurn } from "./ConversationTurn";
import { AudioPlayer } from "./AudioPlayer";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, Layers01Icon } from "@hugeicons/core-free-icons";
import type { ConversationVersionData } from "@/content/seed/dialogues";

interface ConversationReaderProps {
  versions: ConversationVersionData[];
}

export function ConversationReader({ versions }: ConversationReaderProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    versions[0]?.versionId || ""
  );
  const [isGlobalTranslationVisible, setIsGlobalTranslationVisible] = useState(true);
  const [accent, setAccent] = useState<"en-US" | "en-GB">("en-US");
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);

  const currentVersion =
    versions.find((v) => v.versionId === selectedVersionId) || versions[0];

  if (!currentVersion) {
    return (
      <div className="p-8 text-center text-sm text-[var(--ecp-text-muted)]">
        Dialogue content is being prepared.
      </div>
    );
  }

  const speakerMap = new Map(currentVersion.speakers.map((s) => [s.id, s]));

  return (
    <div className="space-y-6 relative pb-16">
      {/* Control Header: Version Switch & Global Translation Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[var(--ecp-surface)] border border-[var(--ecp-border)] rounded-2xl shadow-2xs">
        {/* Version Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--ecp-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <HugeiconsIcon icon={Layers01Icon} size={14} />
            Version:
          </span>
          <div className="flex items-center gap-1.5 bg-[var(--ecp-surface-muted)] p-1 rounded-xl border border-[var(--ecp-border)]">
            {versions.map((ver) => (
              <button
                key={ver.versionId}
                type="button"
                onClick={() => {
                  setSelectedVersionId(ver.versionId);
                  setActiveLineIndex(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedVersionId === ver.versionId
                    ? "bg-[var(--ecp-brand-800)] text-white shadow-xs"
                    : "text-[var(--ecp-text-secondary)] hover:text-[var(--ecp-text-primary)]"
                }`}
              >
                {ver.versionName} ({ver.lines.length} turns)
              </button>
            ))}
          </div>
        </div>

        {/* Global Translation Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGlobalTranslationVisible(!isGlobalTranslationVisible)}
            className="text-xs gap-1.5"
          >
            <HugeiconsIcon icon={isGlobalTranslationVisible ? ViewOffIcon : ViewIcon} size={15} />
            <span>
              {isGlobalTranslationVisible
                ? "Hide All Translations"
                : "Show All Translations (সব অনুবাদ)"}
            </span>
          </Button>
        </div>
      </div>

      {/* Ordered Dialogue Turns */}
      <div className="space-y-4">
        {currentVersion.lines.map((line, index) => {
          const speaker = speakerMap.get(line.speakerId) || {
            id: line.speakerId,
            name: "Speaker",
            nameBn: "বক্তা",
            role: "Participant",
            roleBn: "অংশগ্রহণকারী",
            avatarChar: "S",
            colorScheme: "brand" as const,
          };

          return (
            <ConversationTurn
              key={line.id}
              line={line}
              speaker={speaker}
              accent={accent}
              isGlobalTranslationVisible={isGlobalTranslationVisible}
              isCurrentlyPlaying={activeLineIndex === index}
              onLinePlayStart={() => setActiveLineIndex(index)}
              onLinePlayEnd={() => setActiveLineIndex(null)}
            />
          );
        })}
      </div>

      {/* Sticky Full Audio Player */}
      <AudioPlayer
        lines={currentVersion.lines}
        accent={accent}
        onAccentChange={setAccent}
        activeLineIndex={activeLineIndex}
        onActiveLineChange={setActiveLineIndex}
      />
    </div>
  );
}
