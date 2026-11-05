"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useExpenses, ExpenseItem } from "@/context/expenses-context";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/types/expense";

export default function ExpensesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    expenses,
    summary,
    categoryFilter,
    setCategoryFilter,
    starredFilter,
    setStarredFilter,
    searchQuery,
    setSearchQuery,
    clearFilters,
    addExpense,
    toggleStar,
    deleteExpense,
  } = useExpenses();

  // Form inputs
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [spentAt, setSpentAt] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [expenseSuccess, setExpenseSuccess] = useState(false);
  const [expenseError, setExpenseError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect to /login if not logged in; no flash
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return null; // Return null so nothing from this page is shown before auth is confirmed
  }

  // Field validation functions
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
    setExpenseSuccess(false);
    setExpenseError(null);

    const errT = getTitleError(title);
    const errA = getAmountError(amount);
    const errC = getCategoryError(category);
    const errD = getDateError(spentAt);

    if (errT || errA || errC || errD) {
      return;
    }

    setSubmitting(true);
    const result = await addExpense({
      title: title.trim(),
      amount: Number(amount),
      category,
      note: note.trim(),
      spentAt: spentAt.trim(),
    });

    if (result.success) {
      setTitle("");
      setAmount("");
      setCategory("");
      setNote("");
      setSpentAt("");
      setHasSubmitted(false);
      setExpenseSuccess(true);
    } else {
      setExpenseError(result.error || "Failed to add expense");
    }
    setSubmitting(false);
  };

  return (
    <div data-testid="expenses-page" className="container mx-auto max-w-6xl py-8 px-4 space-y-8">
      {/* Top Section: Form + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Add Expense Form */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              data-testid="expense-form"
              noValidate
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {expenseSuccess && (
                <div
                  data-testid="expense-success"
                  className="p-3 text-sm rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-medium"
                >
                  Expense added
                </div>
              )}

              {expenseError && (
                <div
                  data-testid="error-expense"
                  className="p-3 text-sm rounded bg-destructive/10 text-destructive border border-destructive/20 font-medium"
                >
                  {expenseError}
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-medium">Title</label>
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
                />
                {titleError && (
                  <p data-testid="error-title" className="text-xs text-destructive">
                    {titleError}
                  </p>
                )}
              </div>

              {/* Amount and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Amount</label>
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
                  />
                  {amountError && (
                    <p data-testid="error-amount" className="text-xs text-destructive">
                      {amountError}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Category</label>
                  <select
                    data-testid="input-category"
                    className="w-full h-8 px-2.5 rounded-lg border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    <p data-testid="error-category" className="text-xs text-destructive">
                      {categoryError}
                    </p>
                  )}
                </div>
              </div>

              {/* Date and Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Date</label>
                  <Input
                    data-testid="input-date"
                    type="date"
                    value={spentAt}
                    onChange={(e) => {
                      setSpentAt(e.target.value);
                      setExpenseError(null);
                      setExpenseSuccess(false);
                    }}
                  />
                  {dateError && (
                    <p data-testid="error-date" className="text-xs text-destructive">
                      {dateError}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Note (optional)</label>
                  <Input
                    data-testid="input-note"
                    type="text"
                    placeholder="Optional details"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <Button
                data-testid="btn-add-expense"
                type="submit"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Adding..." : "Add Expense"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Spending Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg border bg-muted/40">
                <span className="text-xs text-muted-foreground block">Expenses</span>
                <span data-testid="expense-count" className="text-xl font-bold">
                  {summary.count}
                </span>
              </div>
              <div className="p-3 rounded-lg border bg-muted/40">
                <span className="text-xs text-muted-foreground block">Starred</span>
                <span data-testid="starred-count" className="text-xl font-bold">
                  {summary.starredCount}
                </span>
              </div>
              <div className="p-3 rounded-lg border bg-muted/40">
                <span className="text-xs text-muted-foreground block">Total</span>
                <span data-testid="total-amount" className="text-xl font-bold font-mono">
                  {Number(summary.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category Breakdown
              </h4>
              <div data-testid="category-breakdown" className="space-y-1.5">
                {summary.breakdown.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No category data</p>
                ) : (
                  summary.breakdown.map((row) => (
                    <div
                      key={row.category}
                      data-testid="breakdown-row"
                      className="flex items-center justify-between p-2 rounded border bg-card text-xs"
                    >
                      <span data-testid="breakdown-name" className="font-medium">
                        {row.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <span data-testid="breakdown-count" className="text-muted-foreground">
                          {row.count}
                        </span>
                        <span data-testid="breakdown-total" className="font-mono font-semibold">
                          {Number(row.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Category Filter */}
              <select
                data-testid="filter-category"
                className="h-8 px-2.5 rounded-lg border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Starred Only Checkbox */}
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  data-testid="filter-starred"
                  type="checkbox"
                  checked={starredFilter}
                  onChange={(e) => setStarredFilter(e.target.checked)}
                  className="rounded border-input h-4 w-4"
                />
                <span>Starred only</span>
              </label>

              {/* Clear button */}
              <Button
                data-testid="btn-clear-filters"
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear
              </Button>
            </div>

            {/* Search Box */}
            <div className="w-full sm:w-64">
              <Input
                data-testid="search-input"
                type="text"
                placeholder="Search title or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold tracking-tight">Your Expenses</h3>
        {expenses.length === 0 ? (
          <div
            data-testid="expenses-empty"
            className="p-8 text-center border rounded-lg bg-card text-muted-foreground text-sm"
          >
            No expenses found
          </div>
        ) : (
          <div data-testid="expense-list" className="space-y-2">
            {expenses.map((item: ExpenseItem) => (
              <div
                key={item.id}
                data-testid="expense-item"
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span data-testid="expense-title" className="font-semibold text-sm">
                      {item.title}
                    </span>
                    <span
                      data-testid="expense-category"
                      className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground border"
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span data-testid="expense-date">{item.spentAt}</span>
                    {item.note && <span>• {item.note}</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span
                    data-testid="expense-amount"
                    className="font-mono font-bold text-sm sm:text-base"
                  >
                    {Number(item.amount).toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      data-testid="btn-toggle-star"
                      variant={item.starred ? "default" : "outline"}
                      size="sm"
                      aria-pressed={item.starred ? "true" : "false"}
                      onClick={() => toggleStar(item.id, item.starred)}
                    >
                      {item.starred ? "★ Starred" : "☆ Star"}
                    </Button>
                    <Button
                      data-testid="btn-delete-expense"
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteExpense(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
