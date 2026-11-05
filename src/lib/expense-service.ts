import { prisma } from "@/lib/prisma";
import { CATEGORIES, Category } from "@/types/expense";

export interface ExpenseEntity {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  note: string;
  starred: boolean;
  spentAt: string; // YYYY-MM-DD
  createdAt: string | Date;
}

const inMemoryExpenses: Map<string, ExpenseEntity> = new Map();

const isPlaceholderConfigured = (): boolean => {
  const url = process.env.DATABASE_URL || "";
  return url.includes("[YOUR-PASSWORD]") || url.trim() === "";
};

export const expenseService = {
  async getExpenses(
    userId: string,
    filters?: { category?: string; starred?: boolean; q?: string }
  ): Promise<ExpenseEntity[]> {
    let list: ExpenseEntity[] = [];

    if (!isPlaceholderConfigured()) {
      try {
        const whereClause: Record<string, unknown> = { userId };

        if (filters?.category) {
          whereClause.category = filters.category;
        }

        if (filters?.starred !== undefined) {
          whereClause.starred = filters.starred;
        }

        if (filters?.q) {
          const query = filters.q.trim();
          whereClause.OR = [
            { title: { contains: query, mode: "insensitive" } },
            { note: { contains: query, mode: "insensitive" } },
          ];
        }

        const rows = await prisma.expense.findMany({
          where: whereClause,
          orderBy: [{ spentAt: "desc" }, { title: "asc" }],
        });

        list = rows.map((r) => ({
          id: r.id,
          userId: r.userId,
          title: r.title,
          amount: Number(r.amount),
          category: r.category,
          note: r.note,
          starred: r.starred,
          spentAt: r.spentAt,
          createdAt: r.createdAt.toISOString(),
        }));
      } catch (err) {
        console.warn("Prisma expense query failed, falling back to in-memory:", err);
      }
    }

    if (list.length === 0 && inMemoryExpenses.size > 0) {
      list = Array.from(inMemoryExpenses.values()).filter((e) => e.userId === userId);

      if (filters?.category) {
        list = list.filter((e) => e.category === filters.category);
      }

      if (filters?.starred !== undefined) {
        list = list.filter((e) => e.starred === filters.starred);
      }

      if (filters?.q) {
        const q = filters.q.trim().toLowerCase();
        list = list.filter(
          (e) => e.title.toLowerCase().includes(q) || e.note.toLowerCase().includes(q)
        );
      }
    }

    // Sort: spentAt desc, ties broken by title alphabetically (case-insensitive)
    list.sort((a, b) => {
      if (b.spentAt !== a.spentAt) {
        return b.spentAt.localeCompare(a.spentAt);
      }
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    });

    return list;
  },

  async findDuplicate(
    userId: string,
    title: string,
    amount: number,
    spentAt: string,
    excludeId?: string
  ): Promise<boolean> {
    const normTitle = title.trim();

    if (!isPlaceholderConfigured()) {
      try {
        const existing = await prisma.expense.findFirst({
          where: {
            userId,
            title: normTitle,
            amount,
            spentAt,
            ...(excludeId ? { NOT: { id: excludeId } } : {}),
          },
        });
        if (existing) return true;
      } catch (err) {
        console.warn("Prisma duplicate check failed:", err);
      }
    }

    for (const exp of inMemoryExpenses.values()) {
      if (
        exp.userId === userId &&
        exp.title.trim() === normTitle &&
        Number(exp.amount) === Number(amount) &&
        exp.spentAt === spentAt &&
        (!excludeId || exp.id !== excludeId)
      ) {
        return true;
      }
    }

    return false;
  },

  async getById(id: string, userId: string): Promise<ExpenseEntity | null> {
    if (!isPlaceholderConfigured()) {
      try {
        const item = await prisma.expense.findFirst({
          where: { id, userId },
        });
        if (item) {
          return {
            id: item.id,
            userId: item.userId,
            title: item.title,
            amount: Number(item.amount),
            category: item.category,
            note: item.note,
            starred: item.starred,
            spentAt: item.spentAt,
            createdAt: item.createdAt.toISOString(),
          };
        }
      } catch (err) {
        console.warn("Prisma getById failed:", err);
      }
    }

    const mem = inMemoryExpenses.get(id);
    if (mem && mem.userId === userId) {
      return mem;
    }
    return null;
  },

  async create(userId: string, data: {
    title: string;
    amount: number;
    category: string;
    note?: string;
    spentAt: string;
    starred?: boolean;
  }): Promise<ExpenseEntity> {
    const formattedAmount = Number(Number(data.amount).toFixed(2));
    const note = data.note ? data.note.trim() : "";
    const starred = Boolean(data.starred);

    if (!isPlaceholderConfigured()) {
      try {
        const row = await prisma.expense.create({
          data: {
            userId,
            title: data.title.trim(),
            amount: formattedAmount,
            category: data.category,
            note,
            starred,
            spentAt: data.spentAt,
          },
        });
        return {
          id: row.id,
          userId: row.userId,
          title: row.title,
          amount: Number(row.amount),
          category: row.category,
          note: row.note,
          starred: row.starred,
          spentAt: row.spentAt,
          createdAt: row.createdAt.toISOString(),
        };
      } catch (err) {
        console.warn("Prisma create failed, falling back to memory:", err);
      }
    }

    const newExpense: ExpenseEntity = {
      id: "exp_" + Math.random().toString(36).substring(2, 10),
      userId,
      title: data.title.trim(),
      amount: formattedAmount,
      category: data.category,
      note,
      starred,
      spentAt: data.spentAt,
      createdAt: new Date().toISOString(),
    };
    inMemoryExpenses.set(newExpense.id, newExpense);
    return newExpense;
  },

  async update(
    id: string,
    userId: string,
    data: Partial<{
      title: string;
      amount: number;
      category: string;
      note: string;
      starred: boolean;
      spentAt: string;
    }>
  ): Promise<ExpenseEntity | null> {
    const existing = await this.getById(id, userId);
    if (!existing) return null;

    const updatedData: Record<string, unknown> = {};
    if (data.title !== undefined) updatedData.title = data.title.trim();
    if (data.amount !== undefined) updatedData.amount = Number(Number(data.amount).toFixed(2));
    if (data.category !== undefined) updatedData.category = data.category;
    if (data.note !== undefined) updatedData.note = data.note.trim();
    if (data.starred !== undefined) updatedData.starred = data.starred;
    if (data.spentAt !== undefined) updatedData.spentAt = data.spentAt;

    if (!isPlaceholderConfigured()) {
      try {
        const row = await prisma.expense.update({
          where: { id },
          data: updatedData,
        });
        return {
          id: row.id,
          userId: row.userId,
          title: row.title,
          amount: Number(row.amount),
          category: row.category,
          note: row.note,
          starred: row.starred,
          spentAt: row.spentAt,
          createdAt: row.createdAt.toISOString(),
        };
      } catch (err) {
        console.warn("Prisma update failed:", err);
      }
    }

    const mem = inMemoryExpenses.get(id);
    if (mem && mem.userId === userId) {
      const updated = {
        ...mem,
        ...updatedData,
      } as ExpenseEntity;
      inMemoryExpenses.set(id, updated);
      return updated;
    }

    return null;
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const existing = await this.getById(id, userId);
    if (!existing) return false;

    if (!isPlaceholderConfigured()) {
      try {
        await prisma.expense.delete({
          where: { id },
        });
        return true;
      } catch (err) {
        console.warn("Prisma delete failed:", err);
      }
    }

    if (inMemoryExpenses.has(id) && inMemoryExpenses.get(id)?.userId === userId) {
      inMemoryExpenses.delete(id);
      return true;
    }

    return false;
  },
};
