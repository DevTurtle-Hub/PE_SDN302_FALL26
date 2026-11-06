"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { AuthWaveBackground } from "@/components/auth-wave-background";
import { ReadingLogForm } from "@/components/reading-logs/reading-log-form";
import { ReadingLogFilters } from "@/components/reading-logs/reading-log-filters";
import { ReadingLogSummaryCard } from "@/components/reading-logs/reading-log-summary";
import { ReadingLogList } from "@/components/reading-logs/reading-log-list";
import { BookOpen, Sparkles } from "lucide-react";

export default function ReadingLogsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // While finding out auth status or if not logged in, render nothing (no flash of content)
  if (loading || !user) {
    return null;
  }

  return (
    <div
      data-testid="reading-logs-page"
      className="relative min-h-[calc(100vh-4rem)] p-3 sm:p-6 lg:p-10 bg-[#f4f6fb] dark:bg-slate-950 overflow-hidden"
    >
      {/* 3D Wave Ribbon Background */}
      <AuthWaveBackground />

      <div className="relative z-10 container mx-auto max-w-7xl space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-blue-500/5 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Personal Reading Journal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <span>My Reading Logs</span>
            </h1>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Logged in as <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{user.email}</span>
          </div>
        </div>

        {/* Main Grid: At 1280px (xl), Form & Summary sit next to the List */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column (xl:col-span-5): Add Form and Summary */}
          <div className="xl:col-span-5 space-y-6">
            <ReadingLogForm />
            <ReadingLogSummaryCard />
          </div>

          {/* Right Column (xl:col-span-7): Filters and Reading Log List */}
          <div className="xl:col-span-7 space-y-6">
            <ReadingLogFilters />
            <ReadingLogList />
          </div>
        </div>
      </div>
    </div>
  );
}
