import { z } from "zod";
import { getCurrentUserProfile } from "@/lib/auth/session";
import {
  deleteCustomAudioBook,
  getAllAudioBooks,
  readCustomAudioBooks,
  saveUploadedAudioFile,
  saveUploadedThumbnailFile,
  writeCustomAudioBooks,
} from "@/lib/audiobooks/store";
import type { AudioBookItem } from "@/lib/audiobooks/types";

const MAX_AUDIO_BYTES = 50 * 1024 * 1024; // 50 MB for longer 1000-5000 word stories
const MAX_THUMB_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_AUDIO_EXTS = new Set([".mp3", ".wav", ".m4a", ".ogg", ".webm"]);
const ALLOWED_IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const CreateAudioBookSchema = z.object({
  kind: z.enum(["audio_only", "story_book"]),
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(160),
  titleBn: z.string().trim().max(200).optional(),
  description: z.string().trim().max(500).optional(),
  descriptionBn: z.string().trim().max(600).optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]).default("A2"),
  category: z.string().trim().min(2).max(80).default("Listening"),
  summaryBn: z.string().trim().max(2000).optional(),
  storyText: z.string().trim().optional(),
  durationLabel: z.string().trim().max(40).optional(),
});

function isUploadedFileLike(entry: FormDataEntryValue | null): entry is File {
  return (
    entry !== null &&
    typeof entry === "object" &&
    "arrayBuffer" in entry &&
    "size" in entry &&
    typeof (entry as Blob).size === "number" &&
    (entry as Blob).size > 0
  );
}

export async function GET() {
  const current = await getCurrentUserProfile();
  const isAdmin = Boolean(current?.role === "admin" && current.is_active);
  const items = getAllAudioBooks();
  return Response.json({ items, isAdmin }, { status: 200 });
}

export async function POST(req: Request) {
  const current = await getCurrentUserProfile();
  if (!current) {
    return Response.json(
      { error: "UNAUTHORIZED", message: "Please log in as an admin to upload." },
      { status: 401 }
    );
  }
  if (current.role !== "admin" || !current.is_active) {
    return Response.json(
      { error: "FORBIDDEN", message: "Only active admin accounts can upload Audio Books." },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const rawPayload = {
      kind: String(formData.get("kind") ?? "audio_only"),
      title: String(formData.get("title") ?? ""),
      titleBn: String(formData.get("titleBn") ?? "").trim() || undefined,
      description: String(formData.get("description") ?? "").trim() || undefined,
      descriptionBn: String(formData.get("descriptionBn") ?? "").trim() || undefined,
      level: String(formData.get("level") ?? "A2"),
      category: String(formData.get("category") ?? "Listening").trim() || "Listening",
      summaryBn: String(formData.get("summaryBn") ?? "").trim() || undefined,
      storyText: String(formData.get("storyText") ?? "").trim() || undefined,
      durationLabel: String(formData.get("durationLabel") ?? "").trim() || undefined,
    };

    const parsed = CreateAudioBookSchema.safeParse(rawPayload);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return Response.json(
        {
          error: "INVALID_PAYLOAD",
          message: firstIssue?.message || "Invalid form fields.",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const audioEntry = formData.get("audioFile");
    const hasAudio = isUploadedFileLike(audioEntry);
    const thumbEntry = formData.get("thumbnailFile");
    const hasThumb = isUploadedFileLike(thumbEntry);

    if (data.kind === "audio_only" && !hasAudio) {
      return Response.json(
        { error: "AUDIO_REQUIRED", message: "Please select an audio file (MP3, WAV, M4A, OGG) for Audio Only." },
        { status: 400 }
      );
    }

    if (data.kind === "story_book" && (!data.storyText || data.storyText.length < 20)) {
      return Response.json(
        { error: "STORY_REQUIRED", message: "Please enter at least 20 characters of story text." },
        { status: 400 }
      );
    }

    let audioUrl: string | undefined;
    if (hasAudio) {
      const fileName = (audioEntry as { name?: string }).name || "audiobook.mp3";
      const dotIdx = fileName.lastIndexOf(".");
      const ext = dotIdx >= 0 ? fileName.slice(dotIdx).toLowerCase() : ".mp3";
      if (!ALLOWED_AUDIO_EXTS.has(ext)) {
        return Response.json(
          { error: "UNSUPPORTED_AUDIO_FORMAT", message: "Supported audio formats: MP3, WAV, M4A, OGG, WEBM." },
          { status: 400 }
        );
      }
      if (audioEntry.size > MAX_AUDIO_BYTES) {
        return Response.json(
          { error: "FILE_TOO_LARGE", message: "Maximum audio file size is 50MB." },
          { status: 400 }
        );
      }
      const arrayBuf = await audioEntry.arrayBuffer();
      audioUrl = saveUploadedAudioFile(fileName, Buffer.from(arrayBuf));
    }

    let thumbnailUrl: string | undefined;
    if (hasThumb) {
      const thumbName = (thumbEntry as { name?: string }).name || "cover.jpg";
      const dotIdx = thumbName.lastIndexOf(".");
      const ext = dotIdx >= 0 ? thumbName.slice(dotIdx).toLowerCase() : ".jpg";
      if (!ALLOWED_IMAGE_EXTS.has(ext)) {
        return Response.json(
          { error: "UNSUPPORTED_IMAGE_FORMAT", message: "Supported thumbnail formats: JPG, PNG, WEBP." },
          { status: 400 }
        );
      }
      if (thumbEntry.size > MAX_THUMB_BYTES) {
        return Response.json(
          { error: "THUMB_TOO_LARGE", message: "Maximum thumbnail image size is 5MB." },
          { status: 400 }
        );
      }
      const arrayBuf = await thumbEntry.arrayBuffer();
      thumbnailUrl = saveUploadedThumbnailFile(thumbName, Buffer.from(arrayBuf));
    }

    const fallbackDesc = data.description || data.category || data.title;
    const newItem: AudioBookItem = {
      id: `ab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      kind: data.kind,
      title: data.title,
      titleBn: data.titleBn || data.title,
      description: fallbackDesc,
      descriptionBn: data.descriptionBn || fallbackDesc,
      level: data.level,
      category: data.category,
      thumbnailUrl,
      audioUrl,
      durationLabel: data.durationLabel,
      storyText: data.storyText,
      summaryBn: data.summaryBn,
      createdAt: new Date().toISOString(),
      isBuiltIn: false,
    };

    const existing = readCustomAudioBooks();
    writeCustomAudioBooks([newItem, ...existing]);

    return Response.json({ item: newItem }, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: "UPLOAD_FAILED", message: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const current = await getCurrentUserProfile();
  if (!current) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (current.role !== "admin" || !current.is_active) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "MISSING_ID" }, { status: 400 });
  }

  const deleted = deleteCustomAudioBook(id);
  if (!deleted) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return Response.json({ deletedId: id }, { status: 200 });
}
