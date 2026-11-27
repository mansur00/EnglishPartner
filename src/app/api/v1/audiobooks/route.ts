import { z } from "zod";
import { getCurrentUserProfile } from "@/lib/auth/session";
import {
  deleteCustomAudioBook,
  getAllAudioBooks,
  readCustomAudioBooks,
  saveUploadedAudioFile,
  writeCustomAudioBooks,
} from "@/lib/audiobooks/store";
import { countWords, type AudioBookItem } from "@/lib/audiobooks/types";

const MAX_AUDIO_BYTES = 30 * 1024 * 1024; // 30 MB
const ALLOWED_AUDIO_EXTS = new Set([".mp3", ".wav", ".m4a", ".ogg", ".webm"]);

const CreateAudioBookSchema = z.object({
  kind: z.enum(["audio_only", "story_book"]),
  title: z.string().trim().min(2).max(160),
  titleBn: z.string().trim().max(200).optional(),
  description: z.string().trim().min(4).max(500),
  descriptionBn: z.string().trim().max(600).optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]).default("A2"),
  category: z.string().trim().min(2).max(80).default("Listening"),
  summaryBn: z.string().trim().max(1200).optional(),
  storyText: z.string().trim().optional(),
  durationLabel: z.string().trim().max(40).optional(),
});

export async function GET() {
  const current = await getCurrentUserProfile();
  const isAdmin = Boolean(current?.role === "admin" && current.is_active);
  const items = getAllAudioBooks();
  return Response.json({ items, isAdmin }, { status: 200 });
}

export async function POST(req: Request) {
  const current = await getCurrentUserProfile();
  if (!current) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (current.role !== "admin" || !current.is_active) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const rawPayload = {
      kind: String(formData.get("kind") ?? "audio_only"),
      title: String(formData.get("title") ?? ""),
      titleBn: String(formData.get("titleBn") ?? "").trim() || undefined,
      description: String(formData.get("description") ?? ""),
      descriptionBn: String(formData.get("descriptionBn") ?? "").trim() || undefined,
      level: String(formData.get("level") ?? "A2"),
      category: String(formData.get("category") ?? "Listening"),
      summaryBn: String(formData.get("summaryBn") ?? "").trim() || undefined,
      storyText: String(formData.get("storyText") ?? "").trim() || undefined,
      durationLabel: String(formData.get("durationLabel") ?? "").trim() || undefined,
    };

    const parsed = CreateAudioBookSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return Response.json(
        { error: "INVALID_PAYLOAD", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const fileEntry = formData.get("audioFile");
    const hasFile = fileEntry instanceof File && fileEntry.size > 0;

    if (data.kind === "audio_only" && !hasFile) {
      return Response.json(
        { error: "AUDIO_REQUIRED", message: "Please upload an audio file for Audio Only mode." },
        { status: 400 }
      );
    }

    if (data.kind === "story_book") {
      const wc = countWords(data.storyText ?? "");
      if (wc < 50) {
        return Response.json(
          { error: "STORY_TOO_SHORT", message: "Story text should have at least 50 words (recommended 400–1000 words)." },
          { status: 400 }
        );
      }
    }

    let audioUrl: string | undefined;
    if (hasFile) {
      const dotIdx = fileEntry.name.lastIndexOf(".");
      const ext = dotIdx >= 0 ? fileEntry.name.slice(dotIdx).toLowerCase() : "";
      if (!ALLOWED_AUDIO_EXTS.has(ext)) {
        return Response.json(
          { error: "UNSUPPORTED_AUDIO_FORMAT", message: "Supported formats: MP3, WAV, M4A, OGG, WEBM." },
          { status: 400 }
        );
      }
      if (fileEntry.size > MAX_AUDIO_BYTES) {
        return Response.json(
          { error: "FILE_TOO_LARGE", message: "Maximum audio file size is 30MB." },
          { status: 400 }
        );
      }
      const arrayBuf = await fileEntry.arrayBuffer();
      audioUrl = saveUploadedAudioFile(fileEntry.name, Buffer.from(arrayBuf));
    }

    const wordCount = data.storyText ? countWords(data.storyText) : undefined;
    const newItem: AudioBookItem = {
      id: `ab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      kind: data.kind,
      title: data.title,
      titleBn: data.titleBn || data.title,
      description: data.description,
      descriptionBn: data.descriptionBn || data.description,
      level: data.level,
      category: data.category,
      audioUrl,
      durationLabel: data.durationLabel,
      storyText: data.storyText,
      summaryBn: data.summaryBn,
      wordCount,
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
