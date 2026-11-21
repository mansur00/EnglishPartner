import { db } from "../db/index.ts";
import { dailyChallenges } from "../db/schema.ts";
import { eq, and } from "drizzle-orm";
import { SEED_SCENARIOS } from "../../content/seed/scenarios.ts";

export interface DailyChallengeInfo {
  id?: string;
  userId: string;
  challengeDate: string; // YYYY-MM-DD
  scenarioSlug: string;
  scenarioTitle: string;
  scenarioLevel: string;
  categorySlug: string;
  status: "assigned" | "in_progress" | "completed" | "expired";
  completedAt?: string | null;
}

/**
 * Format Date to ISO Date string (YYYY-MM-DD)
 */
export function formatChallengeDate(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

/**
 * Select candidate scenario for a daily challenge:
 * Rules per Spec §7:
 * - Unfinished (not completed in user progress)
 * - Matches level (defaults to A1/A2 or specified user level)
 * - Not seen in last 7 days
 */
export function pickCandidateScenario(
  completedSlugs: string[] = [],
  recentSlugs: string[] = [],
  preferredLevel: string = "A1"
) {
  // 1. Filter out completed and recent scenarios
  const eligible = SEED_SCENARIOS.filter(
    (s) => !completedSlugs.includes(s.slug) && !recentSlugs.includes(s.slug)
  );

  // 2. Try to match preferred level
  const levelMatch = eligible.filter((s) => s.level.toUpperCase() === preferredLevel.toUpperCase());
  if (levelMatch.length > 0) {
    return levelMatch[0];
  }

  // 3. Fallback to any eligible scenario
  if (eligible.length > 0) {
    return eligible[0];
  }

  // 4. Fallback if all scenarios completed: pick scenario least recently seen
  const notRecent = SEED_SCENARIOS.filter((s) => !recentSlugs.includes(s.slug));
  if (notRecent.length > 0) {
    return notRecent[0];
  }

  // 5. Ultimate fallback
  return SEED_SCENARIOS[0];
}

/**
 * Get or create today's daily challenge for a user
 */
export async function getOrCreateDailyChallenge(
  userId: string,
  targetDate: string = formatChallengeDate(),
  userLevel: string = "A1"
): Promise<DailyChallengeInfo> {
  // Check if DB is available
  if (db) {
    try {
      const existing = await db
        .select()
        .from(dailyChallenges)
        .where(
          and(
            eq(dailyChallenges.userId, userId),
            eq(dailyChallenges.challengeDate, targetDate)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        const item = existing[0];
        const scenario = SEED_SCENARIOS.find((s) => s.slug === item.scenarioSlug) || SEED_SCENARIOS[0];
        return {
          id: item.id,
          userId: item.userId,
          challengeDate: item.challengeDate,
          scenarioSlug: item.scenarioSlug,
          scenarioTitle: scenario.title,
          scenarioLevel: scenario.level,
          categorySlug: scenario.categories[0]?.slug || "general",
          status: item.status as DailyChallengeInfo["status"],
          completedAt: item.completedAt ? item.completedAt.toISOString() : null,
        };
      }

      // Fetch recent 7 days challenge slugs for this user to avoid repetition
      const recentChallenges = await db
        .select({ scenarioSlug: dailyChallenges.scenarioSlug })
        .from(dailyChallenges)
        .where(eq(dailyChallenges.userId, userId))
        .limit(7);

      const recentSlugs = recentChallenges.map((r) => r.scenarioSlug);
      const chosenScenario = pickCandidateScenario([], recentSlugs, userLevel);

      const [created] = await db
        .insert(dailyChallenges)
        .values({
          userId,
          challengeDate: targetDate,
          scenarioSlug: chosenScenario.slug,
          status: "assigned",
        })
        .onConflictDoNothing()
        .returning();

      if (created) {
        return {
          id: created.id,
          userId: created.userId,
          challengeDate: created.challengeDate,
          scenarioSlug: created.scenarioSlug,
          scenarioTitle: chosenScenario.title,
          scenarioLevel: chosenScenario.level,
          categorySlug: chosenScenario.categories[0]?.slug || "general",
          status: "assigned",
          completedAt: null,
        };
      }
    } catch {
      // Fallback to in-memory generation if DB connection fails
    }
  }

  // Fallback for offline / guest
  const fallbackScenario = pickCandidateScenario([], [], userLevel);
  return {
    id: `guest-${targetDate}`,
    userId,
    challengeDate: targetDate,
    scenarioSlug: fallbackScenario.slug,
    scenarioTitle: fallbackScenario.title,
    scenarioLevel: fallbackScenario.level,
    categorySlug: fallbackScenario.categories[0]?.slug || "general",
    status: "assigned",
    completedAt: null,
  };
}

/**
 * Mark a daily challenge as completed
 */
export async function completeDailyChallenge(
  challengeId: string,
  userId: string
): Promise<boolean> {
  if (!db) return true;
  try {
    await db
      .update(dailyChallenges)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(
        and(
          eq(dailyChallenges.id, challengeId),
          eq(dailyChallenges.userId, userId)
        )
      );
    return true;
  } catch {
    return false;
  }
}
