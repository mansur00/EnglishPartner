"use client";

import { cn } from "@/lib/utils";
import type { DialogueSpeaker } from "@/content/seed/dialogues";
import { useLocale } from "@/lib/i18n";

interface SpeakerLabelProps {
  speaker: DialogueSpeaker;
}

export function SpeakerLabel({ speaker }: SpeakerLabelProps) {
  const locale = useLocale();
  const avatarColors = {
    brand: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-warning-bg text-warning border-warning/30",
    peach: "bg-topic-tile text-topic-ink border-topic-border",
  };

  const name = locale === "bn" ? (speaker.nameBn || speaker.name || "বক্তা") : (speaker.name || "Speaker");
  const role = locale === "bn" ? (speaker.roleBn || speaker.role || "অংশগ্রহণকারী") : (speaker.role || "Participant");

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "size-marker rounded-pill flex items-center justify-center text-chip border shadow-2xs select-none",
          avatarColors[speaker.colorScheme] || avatarColors.brand
        )}
      >
        {speaker.avatarChar}
      </div>

      <div className="flex flex-col">
        <span className={cn("text-chip text-foreground leading-tight", locale === "bn" && "font-bangla text-bangla")}>
          {name}
        </span>
        <span className={cn("text-chip text-muted-foreground leading-none", locale === "bn" ? "font-bangla text-bangla" : "font-sans")}>
          {role}
        </span>
      </div>
    </div>
  );
}

