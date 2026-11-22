import { NextRequest, NextResponse } from "next/server";
import { generateRoleplayFeedback } from "@/lib/ai/roleplay";
import { RoleplayFeedbackRequestSchema } from "@/lib/ai/roleplay-schema";

/**
 * POST /api/v1/ai/roleplay/feedback
 * Generates supportive rubric feedback summary for a roleplay session.
 * Conforms to ECP_AI_Prompt_Spec.md §3.6 (Schema F1) and Brief §9.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RoleplayFeedbackRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "INVALID_REQUEST",
          message: "Invalid roleplay feedback request.",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const response = generateRoleplayFeedback(parsed.data);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to generate session feedback",
      },
      { status: 500 }
    );
  }
}
