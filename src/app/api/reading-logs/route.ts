import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, errorResponse } from "@/lib/auth";
import { validateReadingLogInput } from "@/lib/reading-log-validator";
import { getUserReadingLogs, createReadingLog } from "@/lib/reading-log-service";

export async function GET(request: NextRequest) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const searchParams = request.nextUrl.searchParams;
    const genre = searchParams.get("genre") || undefined;
    const favorite = searchParams.get("favorite") || undefined;
    const q = searchParams.get("q") || undefined;

    const logs = await getUserReadingLogs(session.id, {
      genre,
      favorite,
      q
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json().catch(() => ({}));
    const validation = validateReadingLogInput(body, false);

    if (!validation.isValid) {
      return errorResponse(validation.firstError || "Validation error", 400);
    }

    const created = await createReadingLog(session.id, {
      bookTitle: body.bookTitle,
      minutesRead: Number(body.minutesRead),
      genre: body.genre,
      note: body.note,
      readOn: body.readOn
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err?.statusCode === 409) {
      return errorResponse(err.message, 409);
    }
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}
