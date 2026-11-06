import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, errorResponse } from "@/lib/auth";
import { getUserReadingLogsSummary } from "@/lib/reading-log-service";

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

    const summary = await getUserReadingLogsSummary(session.id, {
      genre,
      favorite,
      q
    });

    return NextResponse.json(summary, { status: 200 });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}
