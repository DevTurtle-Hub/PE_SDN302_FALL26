"use client";

import { useState } from "react";
import { useReadingLogs } from "@/context/reading-logs-context";
import { validateReadingLogInput } from "@/lib/reading-log-validator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Calendar, Bookmark, FileText, Plus, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export function ReadingLogForm() {
  const { addReadingLog, apiError, successMessage, clearMessages } = useReadingLogs();

  const [bookTitle, setBookTitle] = useState("");
  const [minutesRead, setMinutesRead] = useState("");
  const [genre, setGenre] = useState("");
  const [note, setNote] = useState("");
  const [readOn, setReadOn] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Client validation
  const validation = validateReadingLogInput({
    bookTitle,
    minutesRead: minutesRead ? Number(minutesRead) : (minutesRead as any),
    genre,
    readOn
  });

  const titleError = hasSubmitted ? validation.errors.bookTitle : undefined;
  const minutesError = hasSubmitted ? validation.errors.minutesRead : undefined;
  const genreError = hasSubmitted ? validation.errors.genre : undefined;
  const dateError = hasSubmitted ? validation.errors.readOn : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    clearMessages();

    if (!validation.isValid) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await addReadingLog({
        bookTitle: bookTitle.trim(),
        minutesRead: Math.round(Number(minutesRead)),
        genre,
        note: note.trim(),
        readOn
      });

      if (res.ok) {
        // Clear form on success
        setBookTitle("");
        setMinutesRead("");
        setGenre("");
        setNote("");
        setReadOn("");
        setHasSubmitted(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl shadow-blue-500/5 backdrop-blur-xl overflow-hidden transition-all">
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Add Reading Session
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Record books, time spent, and categories
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form
          data-testid="reading-log-form"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Success Notification */}
          {successMessage && (
            <div
              data-testid="reading-log-success"
              className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 text-xs font-semibold animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* API Error Notification (duplicate, etc.) */}
          {apiError && (
            <div
              data-testid="error-reading-log"
              className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/50 text-xs font-medium animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Book Title */}
          <div className="space-y-1">
            <Label htmlFor="bookTitle" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Book Title <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                id="bookTitle"
                data-testid="input-book-title"
                type="text"
                placeholder="e.g. Atomic Habits"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 text-sm focus-visible:ring-blue-500/20"
              />
            </div>
            {titleError && (
              <p data-testid="error-book-title" className="text-xs text-red-500 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle className="w-3 h-3" />
                <span>{titleError}</span>
              </p>
            )}
          </div>

          {/* Minutes Read & Genre in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Minutes Read */}
            <div className="space-y-1">
              <Label htmlFor="minutesRead" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Minutes Read <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="minutesRead"
                  data-testid="input-minutes"
                  type="number"
                  placeholder="e.g. 45"
                  value={minutesRead}
                  onChange={(e) => setMinutesRead(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 text-sm focus-visible:ring-blue-500/20"
                />
              </div>
              {minutesError && (
                <p data-testid="error-minutes" className="text-xs text-red-500 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  <span>{minutesError}</span>
                </p>
              )}
            </div>

            {/* Genre */}
            <div className="space-y-1">
              <Label htmlFor="genre" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Genre <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Bookmark className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  id="genre"
                  data-testid="input-genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full pl-10 pr-3 h-10 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                >
                  <option value="">Choose genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Biography">Biography</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {genreError && (
                <p data-testid="error-genre" className="text-xs text-red-500 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  <span>{genreError}</span>
                </p>
              )}
            </div>
          </div>

          {/* Date (readOn) */}
          <div className="space-y-1">
            <Label htmlFor="readOn" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                id="readOn"
                data-testid="input-date"
                type="date"
                value={readOn}
                onChange={(e) => setReadOn(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 text-sm focus-visible:ring-blue-500/20"
              />
            </div>
            {dateError && (
              <p data-testid="error-date" className="text-xs text-red-500 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle className="w-3 h-3" />
                <span>{dateError}</span>
              </p>
            )}
          </div>

          {/* Note (optional) */}
          <div className="space-y-1">
            <Label htmlFor="note" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Note (optional)
            </Label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                id="note"
                data-testid="input-note"
                type="text"
                placeholder="e.g. Chapter 1-3, key takeaways"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 text-sm focus-visible:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            data-testid="btn-add-reading-log"
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Reading Session</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
