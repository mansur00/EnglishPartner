import { cn } from "@/lib/utils";
import type { DialogueSpeaker } from "@/content/seed/dialogues";

interface SpeakerLabelProps {
  speaker: DialogueSpeaker;
}

export function SpeakerLabel({ speaker }: SpeakerLabelProps) {
  const avatarColors = {
    brand: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-warning-bg text-warning border-warning/30",
    peach: "bg-topic-tile text-topic-ink border-topic-border",
  };

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
        <span className="text-chip text-foreground leading-tight">
          {speaker.name}
        </span>
        <span className="text-chip text-muted-foreground text-bangla leading-none">
          {speaker.roleBn}
        </span>
      </div>
    </div>
  );
}

