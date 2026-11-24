import { getLanguageMeta } from "../../../../lib/i18n/languages.ts";

// Server-side in-memory translation cache: `${targetLang}:${text}` -> translated
const serverTranslationCache = new Map<string, string>();

async function translateSingleViaGtx(text: string, targetLang: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
      targetLang
    )}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const joined = data[0]
        .map((seg: unknown) => (Array.isArray(seg) && typeof seg[0] === "string" ? seg[0] : ""))
        .join("")
        .trim();
      return joined || null;
    }
    return null;
  } catch {
    return null;
  }
}

async function translateBatchViaGroq(
  texts: string[],
  targetLang: string
): Promise<Record<string, string> | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || texts.length === 0) return null;

  const langMeta = getLanguageMeta(targetLang);
  const langName = langMeta ? `${langMeta.name} (${langMeta.nativeName})` : targetLang;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an accurate translator. Translate each English string in the input JSON array into natural, conversational ${langName}. Return a JSON object with a single key "translations" containing an array of translated strings in the exact same order.`,
          },
          {
            role: "user",
            content: JSON.stringify({ texts }),
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.translations)) return null;

    const map: Record<string, string> = {};
    texts.forEach((orig, idx) => {
      const tr = parsed.translations[idx];
      if (typeof tr === "string" && tr.trim()) {
        map[orig] = tr.trim();
      }
    });
    return map;
  } catch {
    return null;
  }
}

/**
 * POST /api/v1/translate
 * Translates an array of English texts into any target global language.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const texts: unknown = body?.texts;
    const targetLang: unknown = body?.targetLang;

    if (
      !Array.isArray(texts) ||
      typeof targetLang !== "string" ||
      !targetLang.trim() ||
      targetLang === "none" ||
      targetLang === "en"
    ) {
      return Response.json({ translations: {} }, { status: 200 });
    }

    const cleanTexts = Array.from(
      new Set(
        texts
          .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
          .map((t) => t.trim())
      )
    ).slice(0, 30);

    const translations: Record<string, string> = {};
    const missing: string[] = [];

    for (const text of cleanTexts) {
      const cacheKey = `${targetLang}:${text}`;
      const cached = serverTranslationCache.get(cacheKey);
      if (cached) {
        translations[text] = cached;
      } else {
        missing.push(text);
      }
    }

    if (missing.length > 0) {
      // Translate missing texts in parallel via GTX
      const results = await Promise.all(
        missing.map(async (text) => {
          const translated = await translateSingleViaGtx(text, targetLang);
          return { text, translated };
        })
      );

      const stillMissing: string[] = [];
      for (const { text, translated } of results) {
        if (translated) {
          translations[text] = translated;
          serverTranslationCache.set(`${targetLang}:${text}`, translated);
        } else {
          stillMissing.push(text);
        }
      }

      // Fallback to Groq batch if any failed
      if (stillMissing.length > 0) {
        const groqMap = await translateBatchViaGroq(stillMissing, targetLang);
        if (groqMap) {
          for (const [orig, tr] of Object.entries(groqMap)) {
            translations[orig] = tr;
            serverTranslationCache.set(`${targetLang}:${orig}`, tr);
          }
        }
      }
    }

    return Response.json({ translations }, { status: 200 });
  } catch {
    return Response.json({ translations: {} }, { status: 200 });
  }
}
