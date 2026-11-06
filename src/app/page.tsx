import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthWaveBackground } from "@/components/auth-wave-background";
import { BookOpen, Sparkles, Clock, PieChart, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden bg-[#f4f6fb] dark:bg-slate-950">
      <div className="relative w-full max-w-6xl rounded-[2.5rem] bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-blue-500/5 backdrop-blur-xl overflow-hidden p-8 sm:p-12 lg:p-16 space-y-12">
        {/* Subtle ribbon wave in the background */}
        <AuthWaveBackground />

        <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SDN302 Official Assessment</span>
          </div>

          <h1
            data-testid="home-title"
            className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50"
          >
            ReadLog
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Track your personal reading sessions, record minutes spent, categorize by genre, star your favorite books, and view real-time reading breakdowns.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="rounded-2xl px-8 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 text-base font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="rounded-2xl px-8 h-12 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-white text-base font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature cards (At least 3 required) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card className="p-6 rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-850/70 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-0 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Log every session
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Record book titles, minutes read, notes, and session dates with automated duplicate detection.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="p-6 rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-850/70 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-0 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Star className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Sort by genre
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Filter across Fiction, Non-Fiction, Sci-Fi, Biography, and Other, plus instant favorites toggling.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="p-6 rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-850/70 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-0 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                <PieChart className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                See minutes read
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Live summaries calculating total minutes, favorite counts, and ranked genre breakdowns.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
