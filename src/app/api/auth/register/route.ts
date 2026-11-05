import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, hashPassword, errorResponse } from "@/lib/auth";
import { userService } from "@/lib/user-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, confirmPassword } = body;

    // 1. Email validation
    if (!email || typeof email !== "string" || email.trim() === "") {
      return errorResponse("Email is required", 400);
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      return errorResponse("Please enter a valid email address", 400);
    }

    // 2. Password validation
    if (!password || typeof password !== "string" || password === "") {
      return errorResponse("Password is required", 400);
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400);
    }

    // 3. Confirm password validation
    if (!confirmPassword || typeof confirmPassword !== "string" || confirmPassword === "") {
      return errorResponse("Confirm password is required", 400);
    }

    if (confirmPassword !== password) {
      return errorResponse("Passwords do not match", 400);
    }

    // 4. Duplicate email check
    const existingUser = await userService.findByEmail(trimmedEmail);
    if (existingUser) {
      return errorResponse("Email already in use", 400);
    }

    // 5. Hash password with bcrypt (never plain text)
    const passwordHash = await hashPassword(password);

    // 6. Create User
    const newUser = await userService.createUser({
      email: trimmedEmail,
      passwordHash,
    });

    // 7. Return 201 with exact shape: { id, email } (no auto-login)
    return NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
      },
      { status: 201 }
    );
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}
