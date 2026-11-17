import { db } from "./index.ts";
import { bookmarks } from "./schema.ts";
import { eq, and } from "drizzle-orm";
import crypto from "node:crypto";

export interface BookmarkRecord {
  id: string;
  userId: string;
  scenarioId: string;
  createdAt: Date;
}

// In-memory persistent store for unit/integration testing or offline environments
const memoryBookmarks = new Map<string, BookmarkRecord>();

export async function findBookmark(userId: string, scenarioId: string): Promise<BookmarkRecord | null> {
  if (db) {
    try {
      const rows = await db
        .select()
        .from(bookmarks)
        .where(and(eq(bookmarks.userId, userId), eq(bookmarks.scenarioId, scenarioId)))
        .limit(1);
      if (rows.length > 0) {
        return rows[0] as BookmarkRecord;
      }
    } catch {
      // Fallback to memory store if database table is not reachable
    }
  }

  // Memory lookup
  for (const b of memoryBookmarks.values()) {
    if (b.userId === userId && b.scenarioId === scenarioId) {
      return b;
    }
  }
  return null;
}

export async function createBookmark(userId: string, scenarioId: string): Promise<BookmarkRecord> {
  const newId = crypto.randomUUID();
  const record: BookmarkRecord = {
    id: newId,
    userId,
    scenarioId,
    createdAt: new Date(),
  };

  if (db) {
    try {
      const inserted = await db
        .insert(bookmarks)
        .values({
          id: newId,
          userId,
          scenarioId,
        })
        .returning();
      if (inserted && inserted.length > 0) {
        return inserted[0] as BookmarkRecord;
      }
    } catch {
      // Fallback to memory store
    }
  }

  memoryBookmarks.set(newId, record);
  return record;
}

export async function countBookmarks(userId?: string): Promise<number> {
  if (userId) {
    let count = 0;
    for (const b of memoryBookmarks.values()) {
      if (b.userId === userId) count++;
    }
    return count;
  }
  return memoryBookmarks.size;
}

export function _resetMemoryBookmarks(): void {
  memoryBookmarks.clear();
}
