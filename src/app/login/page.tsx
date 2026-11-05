"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { checkAuth } = useAuth();

  const getEmailError = (val: string) => {
    if (!val.trim()) return "Email is required";
    if (!isValidEmail(val.trim())) return "Please enter a valid email address";
    return null;
  };

  const getPasswordError = (val: string) => {
    if (!val) return "Password is required";
    return null;
  };

  const emailError = hasSubmitted ? getEmailError(email) : null;
  const passwordError = hasSubmitted ? getPasswordError(password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setAuthError(null);

    const errE = getEmailError(email);
    const errP = getPasswordError(password);
    if (errE || errP) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await checkAuth();
        router.push("/expenses");
      } else {
        setAuthError(data.error || "Login failed");
      }
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-16 px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Sign in to manage your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            data-testid="login-form"
            noValidate
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {authError && (
              <div
                data-testid="error-auth"
                className="p-3 text-sm rounded bg-destructive/10 text-destructive border border-destructive/20"
              >
                {authError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium">Email</label>
              <Input
                data-testid="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setAuthError(null);
                }}
              />
              {emailError && (
                <p data-testid="error-email" className="text-xs text-destructive">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Password</label>
              <Input
                data-testid="login-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError(null);
                }}
              />
              {passwordError && (
                <p data-testid="error-password" className="text-xs text-destructive">
                  {passwordError}
                </p>
              )}
            </div>

            <Button
              data-testid="login-submit"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            <div className="text-center text-xs text-muted-foreground pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary underline">
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

