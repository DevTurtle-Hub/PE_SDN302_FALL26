"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation functions
  const getEmailError = (val: string) => {
    if (!val.trim()) return "Email is required";
    if (!isValidEmail(val.trim())) return "Please enter a valid email address";
    return null;
  };

  const getPasswordError = (val: string) => {
    if (!val) return "Password is required";
    if (val.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const getConfirmPasswordError = (val: string, pass: string) => {
    if (!val) return "Confirm password is required";
    if (val !== pass) return "Passwords do not match";
    return null;
  };

  const emailError = hasSubmitted ? getEmailError(email) : null;
  const passwordError = hasSubmitted ? getPasswordError(password) : null;
  const confirmPasswordError = hasSubmitted ? getConfirmPasswordError(confirmPassword, password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setAuthError(null);
    setFormSuccess(false);

    const errE = getEmailError(email);
    const errP = getPasswordError(password);
    const errC = getConfirmPasswordError(confirmPassword, password);

    if (errE || errP || errC) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setAuthError(data.error || "Registration failed");
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
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>Create a new account on ExpenseTrail</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            data-testid="register-form"
            noValidate
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Global API Auth Error */}
            {authError && (
              <div
                data-testid="error-auth"
                className="p-3 text-sm rounded bg-destructive/10 text-destructive border border-destructive/20"
              >
                {authError}
              </div>
            )}

            {/* Success Message */}
            {formSuccess && (
              <div
                data-testid="form-success"
                className="p-3 text-sm rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-medium"
              >
                Registration successful
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Email</label>
              <Input
                data-testid="register-email"
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

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Password</label>
              <Input
                data-testid="register-password"
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

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Confirm Password</label>
              <Input
                data-testid="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setAuthError(null);
                }}
              />
              {confirmPasswordError && (
                <p data-testid="error-confirm-password" className="text-xs text-destructive">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            <Button
              data-testid="register-submit"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <div className="text-center text-xs text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline">
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

