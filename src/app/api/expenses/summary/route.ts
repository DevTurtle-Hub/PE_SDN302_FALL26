import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, errorResponse } from "@/lib/auth";
import { expenseService } from "@/lib/expense-service";
import { CATEGORIES } from "@/types/expense";

const CATEGORY_PRIORITY: Record<string, number> = {
  Food: 1,
  Transport: 2,
  Bills: 3,
  Shopping: 4,
  Other: 5,
};

export async function GET(request: NextRequest) {
  try {
    const sessionUser = getSessionUser(request);
    if (!sessionUser) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const starredParam = searchParams.get("starred");
    const starred = starredParam === "true" ? true : undefined;
    const q = searchParams.get("q") || undefined;

    const expenses = await expenseService.getExpenses(sessionUser.id, {
      category,
      starred,
      q,
    });

    const count = expenses.length;
    let starredCount = 0;
    let totalAmount = 0;

    const categoryMap: Record<string, { count: number; total: number }> = {};

    for (const exp of expenses) {
      if (exp.starred) starredCount++;
      const amt = Number(exp.amount);
      totalAmount += amt;

      if (!categoryMap[exp.category]) {
        categoryMap[exp.category] = { count: 0, total: 0 };
      }
      categoryMap[exp.category].count += 1;
      categoryMap[exp.category].total += amt;
    }

    // Breakdown: only categories present in the matching set
    const breakdown = Object.entries(categoryMap).map(([cat, val]) => ({
      category: cat,
      count: val.count,
      total: Number(val.total.toFixed(2)),
    }));

    // Ordered by total amount descending; equal totals ordered Food, Transport, Bills, Shopping, Other
    breakdown.sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      const pA = CATEGORY_PRIORITY[a.category] || 99;
      const pB = CATEGORY_PRIORITY[b.category] || 99;
      return pA - pB;
    });

    return NextResponse.json(
      {
        count,
        starredCount,
        totalAmount: Number(totalAmount.toFixed(2)),
        breakdown,
      },
      { status: 200 }
    );
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}
