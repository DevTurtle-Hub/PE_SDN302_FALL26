import { CATEGORIES } from "@/types/expense";

export interface ExpenseInput {
  title?: unknown;
  amount?: unknown;
  category?: unknown;
  note?: unknown;
  spentAt?: unknown;
  starred?: unknown;
}

export function validateExpenseInput(
  data: ExpenseInput,
  isPartial = false
): string | null {
  // Title validation
  if (!isPartial || data.title !== undefined) {
    if (data.title === undefined || data.title === null || typeof data.title !== "string" || data.title.trim() === "") {
      return "Title is required";
    }
    if (data.title.trim().length > 80) {
      return "Title must be at most 80 characters";
    }
  }

  // Amount validation
  if (!isPartial || data.amount !== undefined) {
    if (data.amount === undefined || data.amount === null || data.amount === "") {
      return "Amount is required";
    }
    const num = Number(data.amount);
    if (isNaN(num)) {
      return "Amount is required";
    }
    if (num <= 0) {
      return "Amount must be a positive number";
    }
  }

  // Category validation
  if (!isPartial || data.category !== undefined) {
    if (data.category === undefined || data.category === null || typeof data.category !== "string" || data.category.trim() === "") {
      return "Please choose a category";
    }
    if (!CATEGORIES.includes(data.category as (typeof CATEGORIES)[number])) {
      return "Invalid category";
    }
  }

  // Date validation
  if (!isPartial || data.spentAt !== undefined) {
    if (data.spentAt === undefined || data.spentAt === null || typeof data.spentAt !== "string" || data.spentAt.trim() === "") {
      return "Date is required";
    }

    // Check date not in the future (YYYY-MM-DD comparison with local today)
    const dateStr = data.spentAt.trim();
    const todayStr = new Date().toISOString().split("T")[0];
    if (dateStr > todayStr) {
      return "Date cannot be in the future";
    }
  }

  return null;
}
