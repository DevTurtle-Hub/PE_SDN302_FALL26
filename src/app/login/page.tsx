"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";
import { Mail, Lock, Eye, EyeOff, Wallet, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-radial-[at_top_right] from-primary/5 via-background to-muted/20">
      {/* Decorative background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl opacity-50" />
      </div>

      <Card className="relative w-full max-w-md border border-border/60 shadow-xl bg-card/95 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300">
        {/* Top subtle accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-accent" />

        <CardHeader className="pt-8 pb-4 text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to track and manage your daily expenses
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <form
            data-testid="login-form"
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

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  data-testid="login-email"
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
                  data-testid="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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

            <Button
              data-testid="login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-muted/20 border-t border-border/40 text-center text-xs text-muted-foreground flex flex-col gap-2">
          <div>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline transition-colors">
              Create an account
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground/70">
            Secure session encrypted with JWT & HTTP-Only cookies
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
