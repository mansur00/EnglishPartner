import { NextRequest, NextResponse } from "next/server";
import { generateRoleplayTurn } from "@/lib/ai/roleplay";
import { RoleplayTurnRequestSchema } from "@/lib/ai/roleplay-schema";

/**
 * POST /api/v1/ai/roleplay/turn
 * Generates an in-character AI response turn.
 * Conforms to ECP_AI_Prompt_Spec.md §3.5 (Schema R1) and Brief §9.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RoleplayTurnRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "INVALID_REQUEST",
          message: "Invalid roleplay turn request.",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const response = generateRoleplayTurn(parsed.data);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to generate roleplay turn",
      },
      { status: 500 }
    );
  }
}
