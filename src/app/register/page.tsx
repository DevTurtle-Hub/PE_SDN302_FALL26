"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/auth";
import { AuthWaveBackground } from "@/components/auth-wave-background";
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
  Sparkles,
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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#f4f6fb] dark:bg-slate-950">
      {/* Outer container expanded in size */}
      <div className="relative w-full max-w-[1400px] min-h-[700px] lg:min-h-[760px] rounded-[2.5rem] bg-white/92 dark:bg-slate-900/92 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-blue-500/5 backdrop-blur-xl overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        
        {/* The 3D Wave Ribbon Background from reference image */}
        <AuthWaveBackground />

        {/* Top bar header inside canvas */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              ExpenseTrail
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <span>Already registered?</span>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/20 transition-all cursor-pointer text-xs uppercase tracking-wider"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Middle Main Content: Hero on Left & Larger Floating Form on Right */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-8">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3.5">
              <p className="text-2xl sm:text-3xl font-medium text-slate-700 dark:text-slate-300">
                Start budgeting smarter
              </p>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                Create your account <span className="inline-flex items-center align-middle mx-1.5 text-sky-500"><Sparkles className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" /></span> and track spending today
              </h1>
            </div>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Join ExpenseTrail to categorize expenses into Food, Transport, Bills, Shopping, and Other, and get live financial analytics.
            </p>
          </div>

          {/* Right Floating Form Card (Expanded size & comfortable padding) */}
          <div className="w-full lg:col-span-5 flex justify-center lg:justify-end">
            <Card className="w-full max-w-[440px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-900/10 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden transition-all duration-300">
              <CardHeader className="pt-9 pb-4 px-8">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Register to continue<span className="text-blue-500">.</span>
                </CardTitle>
                <CardDescription className="text-sm text-slate-400 dark:text-slate-500 pt-1">
                  Create a new personal account in seconds
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-7">
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
                      className="flex items-center gap-2.5 p-3.5 text-xs rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/50 font-medium animate-in fade-in"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {formSuccess && (
                    <div
                      data-testid="form-success"
                      className="flex items-center gap-2.5 p-3.5 text-xs rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-semibold animate-in fade-in"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>Registration successful</span>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                      <Input
                        data-testid="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setAuthError(null);
                        }}
                        className="pl-11 h-12 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 focus-visible:ring-blue-500/25 focus-visible:border-blue-500 transition-all text-sm sm:text-base"
                      />
                    </div>
                    {emailError && (
                      <p data-testid="error-email" className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 pt-0.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{emailError}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                      <Input
                        data-testid="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password (min 6 chars)"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setAuthError(null);
                        }}
                        className="pl-11 pr-11 h-12 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 focus-visible:ring-blue-500/25 focus-visible:border-blue-500 transition-all text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p data-testid="error-password" className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 pt-0.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{passwordError}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                      <Input
                        data-testid="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setAuthError(null);
                        }}
                        className="pl-11 pr-11 h-12 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 focus-visible:ring-blue-500/25 focus-visible:border-blue-500 transition-all text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <p data-testid="error-confirm-password" className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 pt-0.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{confirmPasswordError}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    data-testid="register-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400 justify-center">
                <span>
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Sign in here
                  </Link>
                </span>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Bottom footer bar */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100/80 dark:border-slate-800/80">
          <span>ExpenseTrail • SDN302 Practical Exam</span>
          <span className="hidden sm:inline">Protected by End-to-End JWT Session Token</span>
        </div>

      </div>
    </div>
  );
}
