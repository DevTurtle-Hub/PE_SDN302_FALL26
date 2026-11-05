import { NextRequest, NextResponse } from "next/server";
import { comparePassword, generateToken, COOKIE_NAME, errorResponse } from "@/lib/auth";
import { userService } from "@/lib/user-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse("Invalid email or password", 401);
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const user = await userService.findByEmail(trimmedEmail);

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const isMatch = await comparePassword(String(password), user.passwordHash);
    if (!isMatch) {
      return errorResponse("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    // Return 200 with { id, email }
    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
      },
      { status: 200 }
    );

    // Set HttpOnly cookie named session_token
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}
