"use client";

import { ExpenseItem } from "@/context/expenses-context";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Calendar, FileText } from "lucide-react";

interface ExpenseListProps {
  expenses: ExpenseItem[];
  onToggleStar: (id: string, currentStarred: boolean) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({
  expenses,
  onToggleStar,
  onDeleteExpense,
}: ExpenseListProps) {
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Food":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800";
      case "Transport":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      case "Bills":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800";
      case "Shopping":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Your Expenses
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Showing {expenses.length} {expenses.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {expenses.length === 0 ? (
        <div
          data-testid="expenses-empty"
          className="p-12 text-center border border-dashed border-slate-200/90 dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500 text-sm flex flex-col items-center justify-center gap-2"
        >
          <FileText className="w-8 h-8 opacity-40" />
          <span>No expenses found</span>
        </div>
      ) : (
        <div data-testid="expense-list" className="space-y-2.5">
          {expenses.map((item: ExpenseItem) => (
            <div
              key={item.id}
              data-testid="expense-item"
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all gap-3.5"
            >
              {/* Item Info */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span data-testid="expense-title" className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {item.title}
                  </span>
                  <span
                    data-testid="expense-category"
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(item.category)}`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span data-testid="expense-date" className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.spentAt}
                  </span>
                  {item.note && (
                    <span className="truncate max-w-[280px] sm:max-w-[400px]">
                      • {item.note}
                    </span>
                  )}
                </div>
              </div>

              {/* Amount and Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <span
                  data-testid="expense-amount"
                  className="font-mono font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100"
                >
                  {Number(item.amount).toFixed(2)}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    data-testid="btn-toggle-star"
                    variant={item.starred ? "default" : "outline"}
                    size="sm"
                    aria-pressed={item.starred ? "true" : "false"}
                    onClick={() => onToggleStar(item.id, item.starred)}
                    className={`h-9 px-3 rounded-xl text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                      item.starred
                        ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-xs"
                        : "text-slate-600 hover:text-amber-500"
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${item.starred ? "fill-white text-white" : ""}`} />
                    <span>{item.starred ? "★ Starred" : "☆ Star"}</span>
                  </Button>

                  <Button
                    data-testid="btn-delete-expense"
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteExpense(item.id)}
                    className="h-9 px-3 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
