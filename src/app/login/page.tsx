"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Wallet, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  TrendingUp, 
  ShieldCheck, 
  PieChart, 
  Star 
} from "lucide-react";

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
              <Wallet className="w-3.5 h-3.5" />
              <span>ExpenseTrail Platform</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              Smart personal expense tracking, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">simplified.</span>
            </h1>
            <p className="text-base xl:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Effortlessly track daily expenditures, categorize spending into Food, Transport, Bills, and analyze your financial health in real time.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-blue-100/80 dark:border-slate-800 backdrop-blur-md shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Category Breakdown</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live dynamic summaries of every expense category.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-blue-100/80 dark:border-slate-800 backdrop-blur-md shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Bank-Grade Security</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Encrypted JWT session tokens in HTTP-Only cookies.</p>
            </div>
          </div>

          {/* Floating mini preview card */}
          <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/60 dark:border-slate-800 backdrop-blur-md shadow-md max-w-md">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Recent Expenditure</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">Grab to Campus • Transport</p>
            </div>
            <div className="flex items-center gap-1.5 text-right">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">-45,000₫</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Right column: Login Form */}
        <div className="w-full lg:col-span-5 flex justify-center lg:justify-end">
          <Card className="w-full max-w-md border border-blue-100/80 dark:border-slate-800 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300">
            {/* Top decorative gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500" />

            <CardHeader className="pt-8 pb-4 text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                <Wallet className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Sign in to manage your expense dashboard
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
                    className="flex items-center gap-2 p-3 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/50 font-medium animate-in fade-in slide-in-from-top-1"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
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
                      data-testid="login-email"
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
                      data-testid="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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

                <Button
                  data-testid="login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
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

            <CardFooter className="px-6 py-4 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-2">
              <div>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                  Create an account
                </Link>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Secure session encrypted with JWT & HTTP-Only cookies
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
