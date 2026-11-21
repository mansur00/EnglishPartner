import { NextRequest, NextResponse } from "next/server";
import { resolveSayItIntent } from "@/lib/ai/say-it";
import { SayItRequestSchema } from "@/lib/ai/say-it-schema";

/**
 * POST /api/v1/ai/say-it
 * "What Should I Say?" API Endpoint
 * Complies with ECP_API_Contract.md §4.7 and ECP_AI_Prompt_Spec.md §3.4.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SayItRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "INVALID_REQUEST",
          message: "Intent must be between 1 and 500 characters.",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const response = resolveSayItIntent(parsed.data);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to process intent",
      },
      { status: 500 }
    );
  }
}
