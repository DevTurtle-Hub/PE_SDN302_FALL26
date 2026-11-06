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
    <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden p-6 sm:p-8">
      <CardHeader className="p-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Add Reading Session
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 font-medium pt-0.5">
              Record new book session details and categories
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <form
          data-testid="reading-log-form"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Success Notification */}
          {successMessage && (
            <div
              data-testid="reading-log-success"
              className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-sm font-semibold animate-in fade-in"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* API Error Notification */}
          {apiError && (
            <div
              data-testid="error-reading-log"
              className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 text-sm font-medium animate-in fade-in"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Book Title Field */}
          <div className="space-y-1.5">
            <Label htmlFor="bookTitle" className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Book Title <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <Input
                id="bookTitle"
                data-testid="input-book-title"
                type="text"
                placeholder="Enter book title (e.g. Atomic Habits)"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-blue-500/25 focus-visible:border-blue-600 font-medium"
              />
            </div>
            {titleError && (
              <p data-testid="error-book-title" className="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{titleError}</span>
              </p>
            )}
          </div>

          {/* Minutes Read & Genre in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Minutes Read */}
            <div className="space-y-1.5">
              <Label htmlFor="minutesRead" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Minutes Read <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <Input
                  id="minutesRead"
                  data-testid="input-minutes"
                  type="number"
                  placeholder="e.g. 45"
                  value={minutesRead}
                  onChange={(e) => setMinutesRead(e.target.value)}
                  className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-blue-500/25 focus-visible:border-blue-600 font-medium"
                />
              </div>
              {minutesError && (
                <p data-testid="error-minutes" className="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{minutesError}</span>
                </p>
              )}
            </div>

            {/* Genre Select */}
            <div className="space-y-1.5">
              <Label htmlFor="genre" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Genre <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Bookmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  id="genre"
                  data-testid="input-genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full pl-12 pr-4 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 font-medium cursor-pointer transition-all"
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
                <p data-testid="error-genre" className="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{genreError}</span>
                </p>
              )}
            </div>
          </div>

          {/* Date (readOn) */}
          <div className="space-y-1.5">
            <Label htmlFor="readOn" className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <Input
                id="readOn"
                data-testid="input-date"
                type="date"
                value={readOn}
                onChange={(e) => setReadOn(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-slate-100 focus-visible:ring-blue-500/25 focus-visible:border-blue-600 font-medium"
              />
            </div>
            {dateError && (
              <p data-testid="error-date" className="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{dateError}</span>
              </p>
            )}
          </div>

          {/* Note Field (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="note" className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Note (optional)
            </Label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <Input
                id="note"
                data-testid="input-note"
                type="text"
                placeholder="e.g. Chapter 1-3, key takeaways"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-blue-500/25 focus-visible:border-blue-600 font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            data-testid="btn-add-reading-log"
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Add Reading Session</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
