import { prisma } from "@/lib/prisma";
import {
  ReadingLog,
  ReadingLogSummary,
  ReadingLogGenreBreakdown,
  CreateReadingLogInput,
  UpdateReadingLogInput
} from "@/types/reading-log";

const GENRE_TIE_BREAKER: Record<string, number> = {
  "Fiction": 1,
  "Non-Fiction": 2,
  "Sci-Fi": 3,
  "Biography": 4,
  "Other": 5
};

export interface ReadingLogFilterOptions {
  genre?: string;
  favorite?: boolean | string;
  q?: string;
}

export async function getUserReadingLogs(
  userId: string,
  filters: ReadingLogFilterOptions = {}
): Promise<ReadingLog[]> {
  const andConditions: any[] = [{ userId }];

  if (filters.genre && filters.genre.trim() !== "") {
    andConditions.push({ genre: filters.genre.trim() });
  }

  if (filters.favorite !== undefined) {
    if (filters.favorite === true || filters.favorite === "true") {
      andConditions.push({ favorite: true });
    }
  }

  if (filters.q && filters.q.trim() !== "") {
    const query = filters.q.trim();
    andConditions.push({
      OR: [
        { bookTitle: { contains: query, mode: "insensitive" } },
        { note: { contains: query, mode: "insensitive" } }
      ]
    });
  }

  const where = andConditions.length > 1 ? { AND: andConditions } : andConditions[0];

  const logs = await prisma.readingLog.findMany({
    where
  });

  // Sort by readOn descending, ties broken by bookTitle alphabetically case-insensitive
  logs.sort((a, b) => {
    if (a.readOn !== b.readOn) {
      return b.readOn.localeCompare(a.readOn);
    }
    return a.bookTitle.localeCompare(b.bookTitle, undefined, { sensitivity: "base" });
  });

  return logs.map((log) => ({
    id: log.id,
    bookTitle: log.bookTitle,
    minutesRead: log.minutesRead,
    genre: log.genre,
    note: log.note,
    favorite: log.favorite,
    readOn: log.readOn,
    createdAt: log.createdAt.toISOString()
  }));
}

export async function getUserReadingLogsSummary(
  userId: string,
  filters: ReadingLogFilterOptions = {}
): Promise<ReadingLogSummary> {
  const logs = await getUserReadingLogs(userId, filters);

  if (logs.length === 0) {
    return {
      count: 0,
      favoriteCount: 0,
      totalMinutes: 0,
      breakdown: []
    };
  }

  const count = logs.length;
  let favoriteCount = 0;
  let totalMinutes = 0;
  const genreMap = new Map<string, { count: number; total: number }>();

  for (const log of logs) {
    if (log.favorite) favoriteCount++;
    totalMinutes += log.minutesRead;

    const existing = genreMap.get(log.genre) || { count: 0, total: 0 };
    existing.count += 1;
    existing.total += log.minutesRead;
    genreMap.set(log.genre, existing);
  }

  const breakdown: ReadingLogGenreBreakdown[] = Array.from(genreMap.entries()).map(
    ([genre, data]) => ({
      genre,
      count: data.count,
      total: data.total
    })
  );

  // Ordered by total minutes descending; equal totals ordered Fiction, Non-Fiction, Sci-Fi, Biography, Other
  breakdown.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total;
    }
    const orderA = GENRE_TIE_BREAKER[a.genre] || 99;
    const orderB = GENRE_TIE_BREAKER[b.genre] || 99;
    return orderA - orderB;
  });

  return {
    count,
    favoriteCount,
    totalMinutes,
    breakdown
  };
}

export async function createReadingLog(
  userId: string,
  input: CreateReadingLogInput
): Promise<ReadingLog> {
  const bookTitle = input.bookTitle.trim();
  const minutesRead = Math.round(Number(input.minutesRead));
  const genre = input.genre.trim();
  const note = input.note !== undefined && input.note !== null ? input.note.trim() : "";
  const readOn = input.readOn.trim();

  // Check duplicate: same bookTitle, minutesRead, and readOn already saved by this user
  const duplicate = await prisma.readingLog.findFirst({
    where: {
      userId,
      bookTitle: { equals: bookTitle, mode: "insensitive" },
      minutesRead,
      readOn
    }
  });

  if (duplicate) {
    const error: any = new Error(
      "Duplicate reading session: a reading session with the same book title, minutes and date already exists"
    );
    error.statusCode = 409;
    throw error;
  }

  const created = await prisma.readingLog.create({
    data: {
      userId,
      bookTitle,
      minutesRead,
      genre,
      note,
      favorite: false,
      readOn
    }
  });

  return {
    id: created.id,
    bookTitle: created.bookTitle,
    minutesRead: created.minutesRead,
    genre: created.genre,
    note: created.note,
    favorite: created.favorite,
    readOn: created.readOn,
    createdAt: created.createdAt.toISOString()
  };
}

export async function updateReadingLog(
  userId: string,
  logId: string,
  input: UpdateReadingLogInput
): Promise<ReadingLog> {
  const existing = await prisma.readingLog.findFirst({
    where: { id: logId, userId }
  });

  if (!existing) {
    const error: any = new Error("Reading log not found");
    error.statusCode = 404;
    throw error;
  }

  const updateData: any = {};
  if (input.bookTitle !== undefined) updateData.bookTitle = input.bookTitle.trim();
  if (input.minutesRead !== undefined) updateData.minutesRead = Math.round(Number(input.minutesRead));
  if (input.genre !== undefined) updateData.genre = input.genre.trim();
  if (input.note !== undefined) updateData.note = input.note.trim();
  if (input.readOn !== undefined) updateData.readOn = input.readOn.trim();
  if (input.favorite !== undefined) updateData.favorite = Boolean(input.favorite);

  // Check duplicate if title, minutes or readOn changes
  const checkTitle = updateData.bookTitle ?? existing.bookTitle;
  const checkMins = updateData.minutesRead ?? existing.minutesRead;
  const checkDate = updateData.readOn ?? existing.readOn;

  if (
    updateData.bookTitle !== undefined ||
    updateData.minutesRead !== undefined ||
    updateData.readOn !== undefined
  ) {
    const duplicate = await prisma.readingLog.findFirst({
      where: {
        userId,
        id: { not: logId },
        bookTitle: { equals: checkTitle, mode: "insensitive" },
        minutesRead: checkMins,
        readOn: checkDate
      }
    });

    if (duplicate) {
      const error: any = new Error(
        "Duplicate reading session: a reading session with the same book title, minutes and date already exists"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  const updated = await prisma.readingLog.update({
    where: { id: logId },
    data: updateData
  });

  return {
    id: updated.id,
    bookTitle: updated.bookTitle,
    minutesRead: updated.minutesRead,
    genre: updated.genre,
    note: updated.note,
    favorite: updated.favorite,
    readOn: updated.readOn,
    createdAt: updated.createdAt.toISOString()
  };
}

export async function deleteReadingLog(userId: string, logId: string): Promise<boolean> {
  const existing = await prisma.readingLog.findFirst({
    where: { id: logId, userId }
  });

  if (!existing) {
    const error: any = new Error("Reading log not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.readingLog.delete({
    where: { id: logId }
  });

  return true;
}

