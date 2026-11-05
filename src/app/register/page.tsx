"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/auth";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  TrendingUp, 
  CheckCircle, 
  PieChart, 
  Wallet 
} from "lucide-react";

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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden bg-gradient-to-br from-blue-50/80 via-sky-50/40 to-white dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      {/* Decorative ambient light-blue orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-200/50 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-sky-200/40 dark:bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-indigo-100/30 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left column: Brand & Showcase (Visible on large screens) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-8 pr-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide border border-blue-200/60 dark:border-blue-800/60 backdrop-blur-sm shadow-xs">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join ExpenseTrail Free</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              Start managing your budget with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">confidence.</span>
            </h1>
            <p className="text-base xl:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Create your account in seconds. Never lose track of your expenses again with category filters, starred lists, and instant live reports.
            </p>
          </div>

          {/* Quick Benefits List */}
          <div className="space-y-3.5 max-w-lg">
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span>Filter by Food, Transport, Bills, Shopping, and Other</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span>Star important transactions to review whenever you want</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span>Data secured with PostgreSQL and modern encrypted hashing</span>
            </div>
          </div>

          {/* Mini trust stats pill */}
          <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-blue-100/80 dark:border-slate-800 backdrop-blur-md shadow-xs max-w-md">
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Private Data</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">&lt; 1s</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live Syncing</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">Free</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Account Ready</p>
            </div>
          </div>
        </div>

        {/* Right column: Register Form */}
        <div className="w-full lg:col-span-5 flex justify-center lg:justify-end">
          <Card className="w-full max-w-md border border-blue-100/80 dark:border-slate-800 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300">
            {/* Top decorative gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500" />

            <CardHeader className="pt-8 pb-4 text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                <UserPlus className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Create Account
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Sign up to start tracking your daily expenses
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
                    className="flex items-center gap-2 p-3 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/50 font-medium animate-in fade-in slide-in-from-top-1"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Success Message */}
                {formSuccess && (
                  <div
                    data-testid="form-success"
                    className="flex items-center gap-2.5 p-3.5 text-sm rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-semibold animate-in fade-in zoom-in-95"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Registration successful</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <Input
                      data-testid="register-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setAuthError(null);
                      }}
                      className="pl-10 h-11 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all text-sm"
                    />
                  </div>
                  {emailError && (
                    <p data-testid="error-email" className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 pt-0.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{emailError}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <Input
                      data-testid="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setAuthError(null);
                      }}
                      className="pl-10 pr-11 h-11 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p data-testid="error-password" className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 pt-0.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{passwordError}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <Input
                      data-testid="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setAuthError(null);
                      }}
                      className="pl-10 pr-11 h-11 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p data-testid="error-confirm-password" className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 pt-0.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{confirmPasswordError}</span>
                    </p>
                  )}
                </div>

                <Button
                  data-testid="register-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
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

            <CardFooter className="px-6 py-4 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-2">
              <div>
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                  Sign in here
                </Link>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Passwords are securely encrypted with bcrypt
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
