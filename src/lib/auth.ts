import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.JWT_SECRET ||
  "pe_sdn302_fall26_default_secret_key_change_in_production";

export const COOKIE_NAME = "session_token";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface TokenPayload {
  id: string;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, AUTH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to extract session user from incoming request
export function getSessionUser(request: NextRequest): TokenPayload | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Standard error response helper matching spec: { "error": "<exact message>" }
export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
