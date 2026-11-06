"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/types/expense";
import { PlusCircle, AlertCircle, CheckCircle2 } from "lucide-react";

interface ExpenseFormProps {
  onAddExpense: (data: {
    title: string;
    amount: number;
    category: string;
    note: string;
    spentAt: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [spentAt, setSpentAt] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [expenseSuccess, setExpenseSuccess] = useState(false);
  const [expenseError, setExpenseError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Field validation functions exactly per SDN302 Spec
  const getTitleError = (val: string) => {
    if (!val || !val.trim()) return "Title is required";
    if (val.trim().length > 80) return "Title must be at most 80 characters";
    return null;
  };

  const getAmountError = (val: string) => {
    if (!val || val.trim() === "") return "Amount is required";
    const num = Number(val);
    if (isNaN(num)) return "Amount is required";
    if (num <= 0) return "Amount must be a positive number";
    return null;
  };

  const getCategoryError = (val: string) => {
    if (!val || val.trim() === "") return "Please choose a category";
    if (!CATEGORIES.includes(val as (typeof CATEGORIES)[number])) return "Invalid category";
    return null;
  };

  const getDateError = (val: string) => {
    if (!val || val.trim() === "") return "Date is required";
    const todayStr = new Date().toISOString().split("T")[0];
    if (val.trim() > todayStr) return "Date cannot be in the future";
    return null;
  };

  const titleError = hasSubmitted ? getTitleError(title) : null;
  const amountError = hasSubmitted ? getAmountError(amount) : null;
  const categoryError = hasSubmitted ? getCategoryError(category) : null;
  const dateError = hasSubmitted ? getDateError(spentAt) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setExpenseError(null);
    setExpenseSuccess(false);

    const errT = getTitleError(title);
    const errA = getAmountError(amount);
    const errC = getCategoryError(category);
    const errD = getDateError(spentAt);

    if (errT || errA || errC || errD) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await onAddExpense({
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        note: note.trim(),
        spentAt,
      });

      if (res.success) {
        setTitle("");
        setAmount("");
        setCategory("");
        setNote("");
        setSpentAt("");
        setHasSubmitted(false);
        setExpenseSuccess(true);
      } else {
        setExpenseError(res.error || "Failed to add expense");
      }
    } catch {
      setExpenseError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="lg:col-span-7 shadow-sm border-slate-200/80 dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Add New Expense</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          data-testid="expense-form"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Success Message */}
          {expenseSuccess && (
            <div
              data-testid="expense-success"
              className="flex items-center gap-2 p-3 text-sm rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Expense added</span>
            </div>
          )}

          {/* Error Message */}
          {expenseError && (
            <div
              data-testid="error-expense"
              className="flex items-center gap-2 p-3 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{expenseError}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Title</label>
            <Input
              data-testid="input-title"
              type="text"
              placeholder="e.g. Lunch with team"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setExpenseError(null);
                setExpenseSuccess(false);
              }}
              className="h-10 rounded-xl"
            />
            {titleError && (
              <p data-testid="error-title" className="text-xs text-red-500 dark:text-red-400 font-medium">
                {titleError}
              </p>
            )}
          </div>

          {/* Amount and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Amount</label>
              <Input
                data-testid="input-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setExpenseError(null);
                  setExpenseSuccess(false);
                }}
                className="h-10 rounded-xl"
              />
              {amountError && (
                <p data-testid="error-amount" className="text-xs text-red-500 dark:text-red-400 font-medium">
                  {amountError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <select
                data-testid="input-category"
                className="w-full h-10 px-3 rounded-xl border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setExpenseError(null);
                  setExpenseSuccess(false);
                }}
              >
                <option value="">Choose category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {categoryError && (
                <p data-testid="error-category" className="text-xs text-red-500 dark:text-red-400 font-medium">
                  {categoryError}
                </p>
              )}
            </div>
          </div>

          {/* Date and Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date</label>
              <Input
                data-testid="input-date"
                type="date"
                value={spentAt}
                onChange={(e) => {
                  setSpentAt(e.target.value);
                  setExpenseError(null);
                  setExpenseSuccess(false);
                }}
                className="h-10 rounded-xl"
              />
              {dateError && (
                <p data-testid="error-date" className="text-xs text-red-500 dark:text-red-400 font-medium">
                  {dateError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Note (optional)</label>
              <Input
                data-testid="input-note"
                type="text"
                placeholder="Optional details"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <Button
            data-testid="btn-add-expense"
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-sm transition-all cursor-pointer"
          >
            {submitting ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
