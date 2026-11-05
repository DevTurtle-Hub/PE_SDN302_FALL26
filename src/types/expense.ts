export const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Other"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface ExpenseItem {
  id: string;
  userId?: string;
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

