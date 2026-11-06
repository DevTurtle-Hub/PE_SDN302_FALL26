import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthWaveBackground } from "@/components/auth-wave-background";
import { BookOpen, ArrowRight, Clock, Star, BarChart3, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Harmonious Blue Wave Background */}
      <AuthWaveBackground />

      <div className="relative z-10 w-full max-w-6xl rounded-[2.5rem] bg-white/92 dark:bg-slate-900/92 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-blue-600/5 backdrop-blur-xl p-8 sm:p-12 lg:p-16 space-y-12">
        
        {/* Main Hero Section: Left Text + Right 3D Modern Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Personal Reading Journal & Tracker</span>
            </div>

            <div className="space-y-3">
              <h1
                data-testid="home-title"
                className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-50 leading-tight"
              >
                ReadLog
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200">
                Turn your reading habit into a clear, measurable daily routine.
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl">
              Track daily books and minutes read, sort across Fiction, Non-Fiction, Sci-Fi, Biography, and Other, bookmark your favorite sessions, and view real-time genre summaries.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-2xl px-8 h-13 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 flex items-center gap-2.5 transition-all cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl px-8 h-13 text-base font-bold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Hero Image Column: 3D Modern Floating Open Book */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-[2rem] overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-blue-600/15 group">
              <Image
                src="/hero-student.jpg"
                alt="3D Cartoon Student Reading Book"
                fill
                priority
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              {/* Subtle ambient border shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-white/20 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3 Large, Clean Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1 */}
          <Card className="p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-0 space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Log every session
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Record book titles, minutes read, notes, and session dates with automated duplicate detection.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 2 */}
          <Card className="p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-0 space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Star className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Sort by genre
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Organize across Fiction, Non-Fiction, Sci-Fi, Biography, and Other with instant favorite filtering.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card 3 */}
          <Card className="p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-0 space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                See minutes read
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                View live summaries calculating total minutes, favorite counts, and dynamically ranked category breakdowns.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
