"use client";

import { useReadingLogs } from "@/context/reading-logs-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, Star, Clock, BookOpen, Layers } from "lucide-react";

export function ReadingLogSummaryCard() {
  const { summary } = useReadingLogs();

  return (
    <Card className="rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl shadow-blue-500/5 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-3 px-6 pt-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Live Summary
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 space-y-5">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Total Sessions Count */}
          <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-center">
            <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 block pb-0.5">
              Sessions
            </span>
            <span
              data-testid="reading-log-count"
              className="text-xl sm:text-2xl font-extrabold text-blue-700 dark:text-blue-300"
            >
              {summary.count}
            </span>
          </div>

          {/* Favorites Count */}
          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 text-center">
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 block pb-0.5">
              Favorites
            </span>
            <span
              data-testid="favorite-count"
              className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-300"
            >
              {summary.favoriteCount}
            </span>
          </div>

          {/* Total Minutes */}
          <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-center">
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 block pb-0.5">
              Minutes
            </span>
            <span
              data-testid="total-minutes"
              className="text-xl sm:text-2xl font-extrabold text-indigo-700 dark:text-indigo-300"
            >
              {summary.totalMinutes}
            </span>
          </div>
        </div>

        {/* Genre Breakdown */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Genre Breakdown</span>
          </div>

          <div data-testid="genre-breakdown" className="space-y-2">
            {summary.breakdown.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2 text-center">
                No genre data available
              </p>
            ) : (
              summary.breakdown.map((item) => (
                <div
                  key={item.genre}
                  data-testid="breakdown-row"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span
                    data-testid="breakdown-name"
                    className="font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {item.genre}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      <span data-testid="breakdown-count" className="font-semibold text-slate-700 dark:text-slate-300">
                        {item.count}
                      </span>{" "}
                      logs
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                      <span data-testid="breakdown-total">{item.total}</span> m
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

