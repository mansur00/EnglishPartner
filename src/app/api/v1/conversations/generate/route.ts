import { buildProgressiveDialogueVersion } from "../../../../../lib/content/dialogue-builder.ts";
import {
  getLengthTierById,
  getDefaultLengthTierForLevel,
  type CefrLevelCode,
  type ConversationStyle,
} from "../../../../../lib/content/length-tiers.ts";
import type { ConversationVersionData, DialogueSpeaker } from "../../../../../content/seed/dialogues.ts";

const generatedCache = new Map<string, ConversationVersionData>();

function getComplexityInstruction(level: CefrLevelCode): string {
  switch (level) {
    case "A1":
      return "Use ultra-short, basic simple sentences starting with 'Hello!' or 'Hi!'. Everyday basic words, 4-8 words per turn.";
    case "A2":
      return "Use simple and basic compound sentences (and, but, so, because) for practical everyday situations.";
    case "B1":
      return "Use connected compound and clear descriptive sentences expressing opinions, plans, and explanations.";
    case "B2":
      return "Use complex sentences with conditionals, relative clauses, and nuanced polite persuasion.";
    case "C1":
      return "Use advanced multi-clause complex sentences, idiomatic expressions, and articulate professional reasoning.";
    case "C2":
      return "Use full compound-complex sentences with multiple subordinate and coordinate clauses, executive/academic precision, and natural discourse markers.";
  }
}

async function generateViaLlm(params: {
  slug: string;
  title: string;
  description: string;
  level: CefrLevelCode;
  targetTurns: number;
  style: ConversationStyle;
  tierId: string;
  speakers?: DialogueSpeaker[];
}): Promise<ConversationVersionData | null> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return null;

  const spkA = params.speakers?.[0] || {
    id: "spk-a",
    name: "Speaker A",
    nameBn: "বক্তা ক",
    role: "Learner",
    roleBn: "শিক্ষার্থী",
    avatarChar: "A",
    colorScheme: "brand" as const,
  };
  const spkB = params.speakers?.[1] || {
    id: "spk-b",
    name: "Speaker B",
    nameBn: "বক্তা খ",
    role: "Partner",
    roleBn: "সহযোগী",
    avatarChar: "B",
    colorScheme: "accent" as const,
  };

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an expert English curriculum designer. Generate a realistic, imaginary real-time conversation for English learners.
Level: ${params.level}
Complexity Rule: ${getComplexityInstruction(params.level)}
Communication Style / Tone: ${params.style}
Exact Number of Turns: ${params.targetTurns} alternating turns between ${spkA.role} and ${spkB.role}.
Return JSON with: { "lines": [ { "en": "English line", "bn": "Natural Bengali translation" } ] }.
Ensure exactly ${params.targetTurns} items in "lines".`,
          },
          {
            role: "user",
            content: `Topic: ${params.title}\nContext: ${params.description}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed?.lines) || parsed.lines.length < 4) return null;

    const speakers = [spkA, spkB];
    const lines = parsed.lines.slice(0, params.targetTurns).map((item: { en?: string; bn?: string }, idx: number) => ({
      id: `${params.slug}-${params.tierId}-${params.style}-${idx + 1}`,
      sequenceNumber: idx + 1,
      speakerId: speakers[idx % 2].id,
      englishText: String(item.en || "").trim() || "Hello!",
      translationBn: String(item.bn || "").trim() || "",
      translationReviewStatus: "draft" as const,
    }));

    return {
      versionId: `${params.slug}-${params.tierId}-${params.style}`,
      versionName: `${params.targetTurns} turns • ${params.style}`,
      level: params.level,
      lengthType: params.targetTurns <= 15 ? "short" : params.targetTurns <= 35 ? "medium" : "long",
      communicationStyle: params.style,
      speakers,
      lines,
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || "custom-conversation");
    const title = String(body?.title || "Real-World Conversation");
    const description = String(body?.description || title);
    const level = (["A1", "A2", "B1", "B2", "C1", "C2"].includes(body?.level)
      ? body.level
      : "A1") as CefrLevelCode;
    const style = (["casual", "neutral", "formal"].includes(body?.style)
      ? body.style
      : "neutral") as ConversationStyle;

    const tier =
      (body?.lengthTierId ? getLengthTierById(String(body.lengthTierId)) : undefined) ||
      getDefaultLengthTierForLevel(level);

    const cacheKey = `${slug}:${level}:${tier.id}:${style}`;
    const cached = generatedCache.get(cacheKey);
    if (cached) {
      return Response.json({ version: cached, source: "cache" }, { status: 200 });
    }

    const llmVersion = await generateViaLlm({
      slug,
      title,
      description,
      level,
      targetTurns: tier.targetTurns,
      style,
      tierId: tier.id,
      speakers: Array.isArray(body?.speakers) ? body.speakers : undefined,
    });

    const version =
      llmVersion ||
      buildProgressiveDialogueVersion({
        slug,
        title,
        level,
        lengthTierId: tier.id,
        style,
        speakers: Array.isArray(body?.speakers) ? body.speakers : undefined,
      });

    generatedCache.set(cacheKey, version);
    return Response.json({ version, source: llmVersion ? "ai" : "progressive" }, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to generate conversation" }, { status: 500 });
  }
}
