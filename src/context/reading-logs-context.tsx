"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from "react";
import { useAuth } from "./auth-context";
import {
  ReadingLog,
  ReadingLogSummary,
  CreateReadingLogInput
} from "@/types/reading-log";

interface ReadingLogsContextType {
  readingLogs: ReadingLog[];
  summary: ReadingLogSummary;
  genreFilter: string;
  favoriteFilter: boolean;
  searchQuery: string;
  loading: boolean;
  apiError: string | null;
  successMessage: string | null;
  setGenreFilter: (genre: string) => void;
  setFavoriteFilter: (fav: boolean) => void;
  setSearchQuery: (q: string) => void;
  clearFilters: () => void;
  clearMessages: () => void;
  addReadingLog: (input: CreateReadingLogInput) => Promise<{ ok: boolean; error?: string }>;
  toggleFavorite: (id: string) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultSummary: ReadingLogSummary = {
  count: 0,
  favoriteCount: 0,
  totalMinutes: 0,
  breakdown: []
};

const ReadingLogsContext = createContext<ReadingLogsContextType | undefined>(undefined);

export function ReadingLogsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([]);
  const [summary, setSummary] = useState<ReadingLogSummary>(defaultSummary);
  const [genreFilter, setGenreFilterState] = useState<string>("");
  const [favoriteFilter, setFavoriteFilterState] = useState<boolean>(false);
  const [searchQuery, setSearchQueryState] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setApiError(null);
    setSuccessMessage(null);
  }, []);

  const fetchData = useCallback(
    async (genre = genreFilter, favorite = favoriteFilter, q = searchQuery) => {
      if (!user) {
        setReadingLogs([]);
        setSummary(defaultSummary);
        return;
      }

      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (genre && genre.trim() !== "") params.set("genre", genre.trim());
        if (favorite) params.set("favorite", "true");
        if (q && q.trim() !== "") params.set("q", q.trim());

        const queryStr = params.toString() ? `?${params.toString()}` : "";

        const [logsRes, summaryRes] = await Promise.all([
          fetch(`/api/reading-logs${queryStr}`),
          fetch(`/api/reading-logs/summary${queryStr}`)
        ]);

        if (logsRes.ok && summaryRes.ok) {
          const logsData: ReadingLog[] = await logsRes.json();
          const summaryData: ReadingLogSummary = await summaryRes.json();
          setReadingLogs(logsData);
          setSummary(summaryData);
        }
      } catch (err) {
        console.error("Failed to fetch reading logs data:", err);
      } finally {
        setLoading(false);
      }
    },
    [user, genreFilter, favoriteFilter, searchQuery]
  );

  // Clear memory on logout
  useEffect(() => {
    if (!user) {
      setReadingLogs([]);
      setSummary(defaultSummary);
      setGenreFilterState("");
      setFavoriteFilterState(false);
      setSearchQueryState("");
      setApiError(null);
      setSuccessMessage(null);
    } else {
      fetchData(genreFilter, favoriteFilter, searchQuery);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // When filters change, refetch immediately
  const setGenreFilter = useCallback(
    (genre: string) => {
      setGenreFilterState(genre);
      fetchData(genre, favoriteFilter, searchQuery);
    },
    [favoriteFilter, searchQuery, fetchData]
  );

  const setFavoriteFilter = useCallback(
    (fav: boolean) => {
      setFavoriteFilterState(fav);
      fetchData(genreFilter, fav, searchQuery);
    },
    [genreFilter, searchQuery, fetchData]
  );

  const setSearchQuery = useCallback(
    (q: string) => {
      setSearchQueryState(q);
      fetchData(genreFilter, favoriteFilter, q);
    },
    [genreFilter, favoriteFilter, fetchData]
  );

  const clearFilters = useCallback(() => {
    setGenreFilterState("");
    setFavoriteFilterState(false);
    setSearchQueryState("");
    fetchData("", false, "");
  }, [fetchData]);

  const addReadingLog = async (
    input: CreateReadingLogInput
  ): Promise<{ ok: boolean; error?: string }> => {
    setApiError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/reading-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.error || "Failed to add reading session";
        setApiError(errorMsg);
        return { ok: false, error: errorMsg };
      }

      setSuccessMessage("Reading session added");
      // Immediately refetch list and summary with current filters
      await fetchData(genreFilter, favoriteFilter, searchQuery);
      return { ok: true };
    } catch {
      const netError = "Network error while adding reading session";
      setApiError(netError);
      return { ok: false, error: netError };
    }
  };

  const toggleFavorite = async (id: string) => {
    const target = readingLogs.find((item) => item.id === id);
    if (!target) return;

    const newFavorite = !target.favorite;

    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: newFavorite })
      });

      if (res.ok) {
        // Refresh list and summary to respect 'favorites only' filter immediately
        await fetchData(genreFilter, favoriteFilter, searchQuery);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await fetchData(genreFilter, favoriteFilter, searchQuery);
      }
    } catch (err) {
      console.error("Failed to delete reading session:", err);
    }
  };

  const refresh = useCallback(async () => {
    await fetchData(genreFilter, favoriteFilter, searchQuery);
  }, [fetchData, genreFilter, favoriteFilter, searchQuery]);

  return (
    <ReadingLogsContext.Provider
      value={{
        readingLogs,
        summary,
        genreFilter,
        favoriteFilter,
        searchQuery,
        loading,
        apiError,
        successMessage,
        setGenreFilter,
        setFavoriteFilter,
        setSearchQuery,
        clearFilters,
        clearMessages,
        addReadingLog,
        toggleFavorite,
        deleteLog,
        refresh
      }}
    >
      {children}
    </ReadingLogsContext.Provider>
  );
}

export function useReadingLogs() {
  const context = useContext(ReadingLogsContext);
  if (!context) {
    throw new Error("useReadingLogs must be used within a ReadingLogsProvider");
  }
  return context;
}
