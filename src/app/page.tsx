import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthWaveBackground } from "@/components/auth-wave-background";
import { BookOpen, ArrowRight, Clock, Star, BarChart3, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Harmonious Blue Ambient Background */}
      <AuthWaveBackground />

      <div className="relative z-10 w-full max-w-6xl rounded-[2.5rem] bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-blue-600/5 backdrop-blur-xl p-8 sm:p-14 lg:p-16 space-y-12">
        
        {/* Main Hero Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Reading Session Tracker</span>
          </div>

          <h1
            data-testid="home-title"
            className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-50"
          >
            ReadLog
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            A focused web application to record your daily reading sessions, track minutes read, categorize by genre, star favorites, and review real-time breakdowns.
          </p>

          {/* Action Buttons - Prominent & Clear */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
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

        {/* 3 Large, Clear Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
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
