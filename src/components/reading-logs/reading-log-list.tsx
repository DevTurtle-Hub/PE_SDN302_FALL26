"use client";

import { useState } from "react";
import { useReadingLogs } from "@/context/reading-logs-context";
import { ReadingLog } from "@/types/reading-log";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star,
  Trash2,
  BookOpen,
  Clock,
  Calendar,
  Tag,
  FileText,
  Pencil,
  X,
  Check,
  AlertCircle
} from "lucide-react";

export function ReadingLogList() {
  const { readingLogs, toggleFavorite, deleteLog, updateReadingLogItem } = useReadingLogs();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (log: ReadingLog) => {
    setEditingId(log.id);
    setEditTitle(log.bookTitle);
    setEditMinutes(String(log.minutesRead));
    setEditGenre(log.genre);
    setEditDate(log.readOn);
    setEditNote(log.note || "");
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError(null);
  };

  const handleSaveEdit = async (id: string) => {
    setEditError(null);

    // Basic frontend checks matching exam rules
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setEditError("Book title is required");
      return;
    }
    if (trimmedTitle.length > 80) {
      setEditError("Book title must be at most 80 characters");
      return;
    }
    const mins = Number(editMinutes);
    if (!editMinutes || isNaN(mins)) {
      setEditError("Minutes read is required");
      return;
    }
    if (mins <= 0) {
      setEditError("Minutes read must be a positive number");
      return;
    }
    if (!editGenre) {
      setEditError("Please choose a genre");
      return;
    }
    if (!["Fiction", "Non-Fiction", "Sci-Fi", "Biography", "Other"].includes(editGenre)) {
      setEditError("Invalid genre");
      return;
    }
    if (!editDate) {
      setEditError("Date is required");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    if (editDate > todayStr) {
      setEditError("Date cannot be in the future");
      return;
    }

    setSaving(true);
    try {
      const res = await updateReadingLogItem(id, {
        bookTitle: trimmedTitle,
        minutesRead: Math.round(mins),
        genre: editGenre,
        readOn: editDate,
        note: editNote.trim()
      });

      if (!res.ok) {
        setEditError(res.error || "Failed to update reading session");
      } else {
        setEditingId(null);
      }
    } finally {
      setSaving(false);
    }
  };

  if (readingLogs.length === 0) {
    return (
      <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-12 text-center">
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
      {readingLogs.map((log) => {
        const isEditing = editingId === log.id;

        return (
          <Card
            key={log.id}
            data-testid="reading-log-item"
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all p-5 sm:p-6"
          >
            {isEditing ? (
              /* Inline Edit Mode */
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                    <Pencil className="w-4 h-4" />
                    Edit Reading Session
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={cancelEdit}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {editError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs font-bold text-slate-700">Book Title</Label>
                    <Input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">Minutes Read</Label>
                    <Input
                      type="number"
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">Genre</Label>
                    <select
                      value={editGenre}
                      onChange={(e) => setEditGenre(e.target.value)}
                      className="w-full px-3 h-10 rounded-xl bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                    >
                      <option value="">Choose genre</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Biography">Biography</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">Date</Label>
                    <Input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">Note (optional)</Label>
                    <Input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={cancelEdit}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={saving}
                    onClick={() => handleSaveEdit(log.id)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </Button>
                </div>
              </div>
            ) : (
              /* Normal View Mode */
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
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Edit Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(log)}
                    className="rounded-xl h-10 px-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Edit session"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-semibold ml-1">Edit</span>
                  </Button>

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
            )}
          </Card>
        );
      })}
    </div>
  );
}
