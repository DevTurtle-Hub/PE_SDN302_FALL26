export type ReadingLogGenre = "Fiction" | "Non-Fiction" | "Sci-Fi" | "Biography" | "Other";

export const VALID_GENRES: ReadingLogGenre[] = [
  "Fiction",
  "Non-Fiction",
  "Sci-Fi",
  "Biography",
  "Other"
];

export interface ReadingLog {
  id: string;
  bookTitle: string;
  minutesRead: number;
  genre: ReadingLogGenre | string;
  note: string;
  favorite: boolean;
  readOn: string;
  createdAt: string | Date;
}

export interface ReadingLogGenreBreakdown {
  genre: string;
  count: number;
  total: number;
}

export interface ReadingLogSummary {
  count: number;
  favoriteCount: number;
  totalMinutes: number;
  breakdown: ReadingLogGenreBreakdown[];
}

export interface CreateReadingLogInput {
  bookTitle: string;
  minutesRead: number;
  genre: string;
  note?: string;
  readOn: string;
}

export interface UpdateReadingLogInput {
  bookTitle?: string;
  minutesRead?: number;
  genre?: string;
  note?: string;
  readOn?: string;
  favorite?: boolean;
}
