import fs from "fs";
import path from "path";
import { SEED_AUDIOBOOKS } from "@/content/seed/audiobooks-seed";
import type { AudioBookItem } from "@/lib/audiobooks/types";

const DATA_DIR = path.resolve(process.cwd(), "data");
const CATALOG_FILE = path.join(DATA_DIR, "audiobooks.json");
const AUDIO_UPLOAD_DIR = path.resolve(process.cwd(), "public", "audio", "audiobooks");
const THUMB_UPLOAD_DIR = path.resolve(process.cwd(), "public", "images", "audiobooks");

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(AUDIO_UPLOAD_DIR)) {
    fs.mkdirSync(AUDIO_UPLOAD_DIR, { recursive: true });
  }
  if (!fs.existsSync(THUMB_UPLOAD_DIR)) {
    fs.mkdirSync(THUMB_UPLOAD_DIR, { recursive: true });
  }
}

export function readCustomAudioBooks(): AudioBookItem[] {
  try {
    if (!fs.existsSync(CATALOG_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(CATALOG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AudioBookItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCustomAudioBooks(items: AudioBookItem[]) {
  ensureDirectories();
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(items, null, 2), "utf8");
}

export function getAllAudioBooks(): AudioBookItem[] {
  const custom = readCustomAudioBooks();
  return [...custom, ...SEED_AUDIOBOOKS];
}

export function getAudioBookById(id: string): AudioBookItem | null {
  return getAllAudioBooks().find((item) => item.id === id) ?? null;
}

function sanitizeFilename(fileName: string, fallbackExt: string, fallbackBase: string): string {
  const ext = path.extname(fileName).toLowerCase() || fallbackExt;
  const base =
    path
      .basename(fileName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || fallbackBase;
  return `${Date.now()}-${base}${ext}`;
}

export function saveUploadedAudioFile(fileName: string, buffer: Buffer): string {
  ensureDirectories();
  const finalName = sanitizeFilename(fileName, ".mp3", "audiobook");
  fs.writeFileSync(path.join(AUDIO_UPLOAD_DIR, finalName), buffer);
  return `/audio/audiobooks/${finalName}`;
}

export function saveUploadedThumbnailFile(fileName: string, buffer: Buffer): string {
  ensureDirectories();
  const finalName = sanitizeFilename(fileName, ".jpg", "cover");
  fs.writeFileSync(path.join(THUMB_UPLOAD_DIR, finalName), buffer);
  return `/images/audiobooks/${finalName}`;
}

export function deleteCustomAudioBook(id: string): boolean {
  const custom = readCustomAudioBooks();
  const target = custom.find((item) => item.id === id);
  if (!target) {
    return false;
  }

  if (target.audioUrl && target.audioUrl.startsWith("/audio/audiobooks/")) {
    const filePath = path.join(AUDIO_UPLOAD_DIR, path.basename(target.audioUrl));
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore cleanup failure
      }
    }
  }

  if (target.thumbnailUrl && target.thumbnailUrl.startsWith("/images/audiobooks/")) {
    const thumbPath = path.join(THUMB_UPLOAD_DIR, path.basename(target.thumbnailUrl));
    if (fs.existsSync(thumbPath)) {
      try {
        fs.unlinkSync(thumbPath);
      } catch {
        // Ignore cleanup failure
      }
    }
  }

  const next = custom.filter((item) => item.id !== id);
  writeCustomAudioBooks(next);
  return true;
}
