"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExpenseSummary } from "@/context/expenses-context";
import { PieChart, TrendingUp, Star, Receipt } from "lucide-react";

interface SpendingSummaryProps {
  summary: ExpenseSummary;
}

export function SpendingSummary({ summary }: SpendingSummaryProps) {
  return (
    <Card className="lg:col-span-5 shadow-sm border-slate-200/80 dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Spending Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium flex items-center justify-center gap-1">
              <Receipt className="w-3 h-3" /> Expenses
            </span>
            <span data-testid="expense-count" className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5 block">
              {summary.count}
            </span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Starred
            </span>
            <span data-testid="starred-count" className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">
              {summary.starredCount}
            </span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-500" /> Total
            </span>
            <span data-testid="total-amount" className="text-xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-0.5 block">
              {Number(summary.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Category Breakdown
          </h4>
          <div data-testid="category-breakdown" className="space-y-1.5">
            {summary.breakdown.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 text-center rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800">
                No category data
              </p>
            ) : (
              summary.breakdown.map((row) => (
                <div
                  key={row.category}
                  data-testid="breakdown-row"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shadow-2xs hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span data-testid="breakdown-name" className="font-semibold text-slate-800 dark:text-slate-200">
                    {row.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span data-testid="breakdown-count" className="text-slate-400 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      {row.count} {row.count === 1 ? "item" : "items"}
                    </span>
                    <span data-testid="breakdown-total" className="font-mono font-bold text-slate-900 dark:text-slate-100">
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
  );
}
