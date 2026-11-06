"use client";

import { useReadingLogs } from "@/context/reading-logs-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2, BookOpen, Clock, Calendar, Tag, FileText } from "lucide-react";

export function ReadingLogList() {
  const { readingLogs, toggleFavorite, deleteLog } = useReadingLogs();

  if (readingLogs.length === 0) {
    return (
      <Card className="rounded-[2rem] border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-md shadow-blue-600/5 backdrop-blur-xl p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <p
            data-testid="reading-logs-empty"
            className="text-lg font-bold text-slate-800 dark:text-slate-200"
          >
            No reading sessions found
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Add a new reading session using the form or clear your filters to view sessions.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div data-testid="reading-log-list" className="space-y-4">
      {readingLogs.map((log) => (
        <Card
          key={log.id}
          data-testid="reading-log-item"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all p-5 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Book Details */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3
                  data-testid="reading-log-title"
                  className="text-lg font-extrabold text-slate-900 dark:text-slate-50 tracking-tight"
                >
                  {log.bookTitle}
                </h3>
                <span
                  data-testid="reading-log-genre"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  <Tag className="w-3 h-3" />
                  {log.genre}
                </span>
              </div>

              {/* Note if present */}
              {log.note && (
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-2 flex items-start gap-1.5 pt-0.5">
                  <FileText className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                  <span>{log.note}</span>
                </p>
              )}

              {/* Meta: Minutes & Date - High Contrast */}
              <div className="flex items-center gap-5 text-sm text-slate-600 dark:text-slate-400 pt-1 flex-wrap font-medium">
                <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span data-testid="reading-log-minutes">{log.minutesRead}</span> mins
                </span>

                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span data-testid="reading-log-date">{log.readOn}</span>
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
              {/* Favorite Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-testid="btn-toggle-favorite"
                aria-pressed={log.favorite ? "true" : "false"}
                onClick={() => toggleFavorite(log.id)}
                className={`rounded-xl h-10 px-3.5 flex items-center gap-1.5 transition-all cursor-pointer ${
                  log.favorite
                    ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 font-semibold border border-slate-200 dark:border-slate-700"
                }`}
                title={log.favorite ? "Favorited" : "Mark as favorite"}
              >
                <Star
                  className={`w-4 h-4 transition-transform ${
                    log.favorite ? "fill-amber-400 text-amber-500 scale-110" : ""
                  }`}
                />
                <span className="text-xs sm:text-sm">
                  {log.favorite ? "Favorite" : "Star"}
                </span>
              </Button>

              {/* Delete Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-testid="btn-delete-reading-log"
                onClick={() => deleteLog(log.id)}
                className="rounded-xl h-10 px-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                title="Delete session"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
