import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, errorResponse } from "@/lib/auth";
import { expenseService } from "@/lib/expense-service";
import { validateExpenseInput } from "@/lib/expense-validator";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/expenses/:id
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const sessionUser = getSessionUser(request);
    if (!sessionUser) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    const existing = await expenseService.getById(id, sessionUser.id);
    if (!existing) {
      return errorResponse("Expense not found", 404);
    }

    const body = await request.json().catch(() => ({}));

    // Partial validation for fields provided
    const validationError = validateExpenseInput(body, true);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const nextTitle = body.title !== undefined ? String(body.title).trim() : existing.title;
    const nextAmount =
      body.amount !== undefined ? Number(Number(body.amount).toFixed(2)) : existing.amount;
    const nextSpentAt = body.spentAt !== undefined ? String(body.spentAt).trim() : existing.spentAt;

    // Duplicate check if any of title, amount, spentAt is changing
    if (
      nextTitle !== existing.title ||
      nextAmount !== existing.amount ||
      nextSpentAt !== existing.spentAt
    ) {
      const isDuplicate = await expenseService.findDuplicate(
        sessionUser.id,
        nextTitle,
        nextAmount,
        nextSpentAt,
        id // exclude current item
      );

      if (isDuplicate) {
        return errorResponse(
          "Duplicate expense: an expense with the same title, amount and date already exists",
          409
        );
      }
    }

    const updated = await expenseService.update(id, sessionUser.id, body);
    if (!updated) {
      return errorResponse("Expense not found", 404);
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}

// DELETE /api/expenses/:id
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const sessionUser = getSessionUser(request);
    if (!sessionUser) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    const deleted = await expenseService.delete(id, sessionUser.id);
    if (!deleted) {
      return errorResponse("Expense not found", 404);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      500
    );
  }
}

