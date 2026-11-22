import { NextResponse } from "next/server";
import { getActiveLlmProvider } from "@/lib/ai/llm-client";

/**
 * GET /api/v1/ai/status
 * Returns public metadata about the active LLM provider (zero secret exposure).
 */
export async function GET() {
  const active = getActiveLlmProvider();
  const isLive = active.provider !== "mock";

  return NextResponse.json({
    provider: active.provider,
    model: active.model,
    isLive,
    statusText: isLive
      ? `Active (${active.provider.toUpperCase()} · ${active.model})`
      : "Offline Fallback Mode (Set GROQ_API_KEY or GEMINI_API_KEY in .env.local for live AI)",
  });
}
