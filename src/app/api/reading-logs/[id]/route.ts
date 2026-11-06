import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, errorResponse } from "@/lib/auth";
import { validateReadingLogInput } from "@/lib/reading-log-validator";
import { updateReadingLog, deleteReadingLog } from "@/lib/reading-log-service";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await context.params;
    if (!id) {
      return errorResponse("Reading log not found", 404);
    }

    const body = await request.json().catch(() => ({}));

    // Validate only provided fields
    const validation = validateReadingLogInput(body, true);
    if (!validation.isValid) {
      return errorResponse(validation.firstError || "Validation error", 400);
    }

    const updated = await updateReadingLog(session.id, id, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    if (err?.statusCode === 404) {
      return errorResponse("Reading log not found", 404);
    }
    if (err?.statusCode === 409) {
      return errorResponse(err.message, 409);
    }
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await context.params;
    if (!id) {
      return errorResponse("Reading log not found", 404);
    }

    await deleteReadingLog(session.id, id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err?.statusCode === 404) {
      return errorResponse("Reading log not found", 404);
    }
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}
