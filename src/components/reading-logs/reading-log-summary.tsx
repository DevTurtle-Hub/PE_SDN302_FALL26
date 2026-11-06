"use client";

import { useReadingLogs } from "@/context/reading-logs-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, Star, Clock, BookOpen, Layers } from "lucide-react";

export function ReadingLogSummaryCard() {
  const { summary } = useReadingLogs();

  return (
    <Card className="rounded-[2rem] border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-lg shadow-blue-600/5 backdrop-blur-xl overflow-hidden p-6 sm:p-8">
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Live Summary
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Aggregated statistics based on active filters
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        {/* Metric Cards Grid - Big, High Contrast Numbers */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* Total Sessions Count */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-center">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block pb-1">
              Sessions
            </span>
            <span
              data-testid="reading-log-count"
              className="text-2xl sm:text-3xl font-black text-blue-800 dark:text-blue-200"
            >
              {summary.count}
            </span>
          </div>

          {/* Favorites Count */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-center">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block pb-1">
              Favorites
            </span>
            <span
              data-testid="favorite-count"
              className="text-2xl sm:text-3xl font-black text-blue-800 dark:text-blue-200"
            >
              {summary.favoriteCount}
            </span>
          </div>

          {/* Total Minutes */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-center">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block pb-1">
              Minutes
            </span>
            <span
              data-testid="total-minutes"
              className="text-2xl sm:text-3xl font-black text-blue-800 dark:text-blue-200"
            >
              {summary.totalMinutes}
            </span>
          </div>
        </div>

        {/* Genre Breakdown List */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Genre Breakdown</span>
          </div>

          <div data-testid="genre-breakdown" className="space-y-2.5">
            {summary.breakdown.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic py-3 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                No genre data available
              </p>
            ) : (
              summary.breakdown.map((item) => (
                <div
                  key={item.genre}
                  data-testid="breakdown-row"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span
                    data-testid="breakdown-name"
                    className="font-bold text-slate-900 dark:text-slate-100"
                  >
                    {item.genre}
                  </span>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 dark:text-slate-400 text-xs">
                      <span data-testid="breakdown-count" className="font-bold text-slate-800 dark:text-slate-200">
                        {item.count}
                      </span>{" "}
                      logs
                    </span>
                    <span className="font-extrabold text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/50 px-2.5 py-1 rounded-lg text-xs">
                      <span data-testid="breakdown-total">{item.total}</span> mins
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
