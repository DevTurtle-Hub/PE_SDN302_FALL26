"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  note: string;
  starred: boolean;
  spentAt: string;
  createdAt: string;
}

export interface ExpenseSummary {
  count: number;
  starredCount: number;
  totalAmount: number;
  breakdown: Array<{
    category: string;
    count: number;
    total: number;
  }>;
}

interface ExpensesContextType {
  expenses: ExpenseItem[];
  summary: ExpenseSummary;
  loading: boolean;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  starredFilter: boolean;
  setStarredFilter: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearFilters: () => void;
  refreshData: () => Promise<void>;
  addExpense: (expense: Omit<ExpenseItem, "id" | "createdAt" | "starred">) => Promise<{ success: boolean; error?: string }>;
  toggleStar: (id: string, currentStarred: boolean) => Promise<{ success: boolean; error?: string }>;
  deleteExpense: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const defaultSummary: ExpenseSummary = {
  count: 0,
  starredCount: 0,
  totalAmount: 0,
  breakdown: [],
};

const ExpensesContext = createContext<ExpensesContextType>({
  expenses: [],
  summary: defaultSummary,
  loading: false,
  categoryFilter: "",
  setCategoryFilter: () => {},
  starredFilter: false,
  setStarredFilter: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
  clearFilters: () => {},
  refreshData: async () => {},
  addExpense: async () => ({ success: false }),
  toggleStar: async () => ({ success: false }),
  deleteExpense: async () => ({ success: false }),
});

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>(defaultSummary);
  const [loading, setLoading] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [starredFilter, setStarredFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const clearFilters = () => {
    setCategoryFilter("");
    setStarredFilter(false);
    setSearchQuery("");
  };

  const fetchExpensesAndSummary = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setSummary(defaultSummary);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.append("category", categoryFilter);
      if (starredFilter) params.append("starred", "true");
      if (searchQuery.trim()) params.append("q", searchQuery.trim());

      const qs = params.toString() ? `?${params.toString()}` : "";

      const [resExp, resSum] = await Promise.all([
        fetch(`/api/expenses${qs}`, { cache: "no-store" }),
        fetch(`/api/expenses/summary${qs}`, { cache: "no-store" }),
      ]);

      if (resExp.ok) {
        const expData = await resExp.json();
        setExpenses(expData);
      }
      if (resSum.ok) {
        const sumData = await resSum.json();
        setSummary(sumData);
      }
    } catch (e) {
      console.error("Failed to fetch expenses or summary", e);
    } finally {
      setLoading(false);
    }
  }, [user, categoryFilter, starredFilter, searchQuery]);

  useEffect(() => {
    fetchExpensesAndSummary();
  }, [fetchExpensesAndSummary]);

  // Clean data when logged out
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setSummary(defaultSummary);
      clearFilters();
    }
  }, [user]);

  const addExpense = async (data: Omit<ExpenseItem, "id" | "createdAt" | "starred">) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        await fetchExpensesAndSummary();
        return { success: true };
      } else {
        return { success: false, error: json.error || "Failed to add expense" };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Network error" };
    }
  };

  const toggleStar = async (id: string, currentStarred: boolean) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred: !currentStarred }),
      });
      const json = await res.json();
      if (res.ok) {
        await fetchExpensesAndSummary();
        return { success: true };
      } else {
        return { success: false, error: json.error || "Failed to update star" };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Network error" };
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok) {
        await fetchExpensesAndSummary();
        return { success: true };
      } else {
        return { success: false, error: json.error || "Failed to delete expense" };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Network error" };
    }
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        summary,
        loading,
        categoryFilter,
        setCategoryFilter,
        starredFilter,
        setStarredFilter,
        searchQuery,
        setSearchQuery,
        clearFilters,
        refreshData: fetchExpensesAndSummary,
        addExpense,
        toggleStar,
        deleteExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpensesContext);
}

