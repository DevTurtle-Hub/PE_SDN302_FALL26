"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useExpenses } from "@/context/expenses-context";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { SpendingSummary } from "@/components/expenses/spending-summary";
import { ExpenseFilters } from "@/components/expenses/expense-filters";
import { ExpenseList } from "@/components/expenses/expense-list";

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

  // Redirect to /login if not logged in; no flash
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return null; // Return null so nothing from this page is shown before auth is confirmed
  }

  return (
    <div data-testid="expenses-page" className="container mx-auto max-w-6xl py-8 px-4 sm:px-6 space-y-8">
      {/* Top Section: Add Expense Form & Spending Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <ExpenseForm onAddExpense={addExpense} />
        <SpendingSummary summary={summary} />
      </div>

      {/* Middle Section: Filter & Search Controls */}
      <ExpenseFilters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        starredFilter={starredFilter}
        setStarredFilter={setStarredFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClearFilters={clearFilters}
      />

      {/* Bottom Section: Interactive Expense List */}
      <ExpenseList
        expenses={expenses}
        onToggleStar={toggleStar}
        onDeleteExpense={deleteExpense}
      />
    </div>
  );
}
