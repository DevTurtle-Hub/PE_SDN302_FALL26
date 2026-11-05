import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, errorResponse } from "@/lib/auth";
import { expenseService } from "@/lib/expense-service";
import { validateExpenseInput } from "@/lib/expense-validator";

// GET /api/expenses
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

    return NextResponse.json(expenses, { status: 200 });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}

// POST /api/expenses
export async function POST(request: NextRequest) {
  try {
    const sessionUser = getSessionUser(request);
    if (!sessionUser) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json().catch(() => ({}));

    // 1. Validate fields with exact spec error messages
    const validationError = validateExpenseInput(body, false);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const { title, amount, category, note, spentAt } = body;
    const numAmount = Number(Number(amount).toFixed(2));

    // 2. Duplicate check (same title, amount and spentAt for this user)
    const isDuplicate = await expenseService.findDuplicate(
      sessionUser.id,
      title,
      numAmount,
      spentAt
    );

    if (isDuplicate) {
      return errorResponse(
        "Duplicate expense: an expense with the same title, amount and date already exists",
        409
      );
    }

    // 3. Create expense
    const newExpense = await expenseService.create(sessionUser.id, {
      title,
      amount: numAmount,
      category,
      note,
      spentAt,
      starred: false,
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}

