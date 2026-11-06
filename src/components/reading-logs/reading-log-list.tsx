"use client";

import { useReadingLogs } from "@/context/reading-logs-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2, BookOpen, Clock, Calendar, Tag, FileText } from "lucide-react";

export function ReadingLogList() {
  const { readingLogs, toggleFavorite, deleteLog } = useReadingLogs();

  if (readingLogs.length === 0) {
    return (
      <Card className="rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl shadow-blue-500/5 backdrop-blur-xl p-10 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <p
            data-testid="reading-logs-empty"
            className="text-base font-semibold text-slate-700 dark:text-slate-300"
          >
            No reading sessions found
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Add a new reading session above or adjust your search filters.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div data-testid="reading-log-list" className="space-y-3">
      {readingLogs.map((log) => (
        <Card
          key={log.id}
          data-testid="reading-log-item"
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md shadow-blue-500/5 backdrop-blur-xl overflow-hidden hover:border-blue-300/60 dark:hover:border-blue-700/60 transition-all p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Book Info & Details */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  data-testid="reading-log-title"
                  className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate max-w-full"
                >
                  {log.bookTitle}
                </h3>
                <span
                  data-testid="reading-log-genre"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {log.genre}
                </span>
              </div>

              {/* Note if present */}
              {log.note && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 flex items-start gap-1">
                  <FileText className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />
                  <span>{log.note}</span>
                </p>
              )}

              {/* Meta: Minutes & Date */}
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span data-testid="reading-log-minutes">{log.minutesRead}</span> mins
                </span>

                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span data-testid="reading-log-date">{log.readOn}</span>
                </span>
              </div>
            </div>

            {/* Right: Actions (Favorite Toggle & Delete) */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {/* Favorite Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-testid="btn-toggle-favorite"
                aria-pressed={log.favorite ? "true" : "false"}
                onClick={() => toggleFavorite(log.id)}
                className={`rounded-xl h-9 px-3 flex items-center gap-1.5 transition-all cursor-pointer ${
                  log.favorite
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                }`}
                title={log.favorite ? "Favorited" : "Mark as favorite"}
              >
                <Star
                  className={`w-4 h-4 transition-transform ${
                    log.favorite ? "fill-amber-400 text-amber-500 scale-110" : ""
                  }`}
                />
                <span className="text-xs font-semibold hidden sm:inline">
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
                className="rounded-xl h-9 px-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                title="Delete session"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
