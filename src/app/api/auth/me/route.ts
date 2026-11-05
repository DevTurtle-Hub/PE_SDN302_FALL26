import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, errorResponse } from "@/lib/auth";
import { userService } from "@/lib/user-service";

export async function GET(request: NextRequest) {
  try {
    const sessionUser = getSessionUser(request);

    if (!sessionUser) {
      return errorResponse("Unauthorized", 401);
    }

    const user = await userService.findById(sessionUser.id);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
      },
      { status: 200 }
    );
  } catch {
    return errorResponse("Unauthorized", 401);
  }
}
