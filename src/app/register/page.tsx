"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/auth";
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-radial-[at_top_right] from-primary/5 via-background to-muted/20">
      {/* Decorative background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 right-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl opacity-50" />
      </div>

      <Card className="relative w-full max-w-md border border-border/60 shadow-xl bg-card/95 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300">
        {/* Top subtle accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-accent" />

        <CardHeader className="pt-8 pb-4 text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Create Account</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Start tracking and categorizing your expenses today
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
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
                className="flex items-center gap-2 p-3 text-sm rounded-xl bg-destructive/10 text-destructive border border-destructive/20 font-medium animate-in fade-in slide-in-from-top-1"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Success Message */}
            {formSuccess && (
              <div
                data-testid="form-success"
                className="flex items-center gap-2 p-3.5 text-sm rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25 font-semibold animate-in fade-in zoom-in-95"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
                <span>Registration successful</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  data-testid="register-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setAuthError(null);
                  }}
                  className="pl-9 h-10 rounded-xl bg-background/50 border-border/70 focus-visible:ring-primary/30 transition-all"
                />
              </div>
              {emailError && (
                <p data-testid="error-email" className="flex items-center gap-1 text-xs text-destructive pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  data-testid="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError(null);
                  }}
                  className="pl-9 pr-10 h-10 rounded-xl bg-background/50 border-border/70 focus-visible:ring-primary/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p data-testid="error-password" className="flex items-center gap-1 text-xs text-destructive pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  data-testid="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setAuthError(null);
                  }}
                  className="pl-9 pr-10 h-10 rounded-xl bg-background/50 border-border/70 focus-visible:ring-primary/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPasswordError && (
                <p data-testid="error-confirm-password" className="flex items-center gap-1 text-xs text-destructive pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{confirmPasswordError}</span>
                </p>
              )}
            </div>

            <Button
              data-testid="register-submit"
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-muted/20 border-t border-border/40 text-center text-xs text-muted-foreground flex flex-col gap-2">
          <div>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
              Sign in here
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground/70">
            Passwords are encrypted using bcrypt salt hashing
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
