import { cn } from "@/lib/utils";
import type { DialogueSpeaker } from "@/content/seed/dialogues";

interface SpeakerLabelProps {
  speaker: DialogueSpeaker;
}

export function SpeakerLabel({ speaker }: SpeakerLabelProps) {
  const avatarColors = {
    brand: "bg-[var(--ecp-brand-100)] text-[var(--ecp-brand-800)] border-[var(--ecp-brand-800)]/20",
    accent: "bg-[var(--ecp-accent-100)] text-[var(--ecp-brand-950)] border-[var(--ecp-accent-400)]/40",
    peach: "bg-[var(--topic-tile)] text-[var(--topic-ink)] border-[var(--topic-border)]",
  };

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs border shadow-2xs select-none",
          avatarColors[speaker.colorScheme] || avatarColors.brand
        )}
      >
        {speaker.avatarChar}
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-semibold text-[var(--ecp-brand-950)] leading-tight">
          {speaker.name}
        </span>
        <span className="text-xs text-muted-foreground font-bangla leading-none">
          {speaker.roleBn}
        </span>
      </div>
    </div>
  );
}

