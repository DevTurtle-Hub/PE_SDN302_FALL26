"use client";

import { useReadingLogs } from "@/context/reading-logs-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Star } from "lucide-react";

export function ReadingLogFilters() {
  const {
    genreFilter,
    favoriteFilter,
    searchQuery,
    setGenreFilter,
    setFavoriteFilter,
    setSearchQuery,
    clearFilters
  } = useReadingLogs();

  return (
    <Card className="rounded-[2rem] border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-md shadow-blue-600/5 backdrop-blur-xl p-5 sm:p-6">
      <CardContent className="p-0 flex flex-col sm:flex-row flex-wrap items-center gap-4">
        {/* Search Input - Big & Legible */}
        <div className="relative flex-1 min-w-[220px] w-full sm:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <Input
            data-testid="search-input"
            type="text"
            placeholder="Search by book title or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-blue-500/25 focus-visible:border-blue-600 font-medium"
          />
        </div>

        {/* Genre Select Filter */}
        <div className="w-full sm:w-auto min-w-[160px]">
          <select
            data-testid="filter-genre"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="w-full px-4 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 cursor-pointer transition-all"
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Biography">Biography</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Favorites Only Checkbox */}
        <label className="flex items-center gap-2.5 px-4 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <input
            type="checkbox"
            data-testid="filter-favorite"
            checked={favoriteFilter}
            onChange={(e) => setFavoriteFilter(e.target.checked)}
            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 cursor-pointer"
          />
          <Star className={`w-4 h-4 ${favoriteFilter ? "fill-amber-400 text-amber-500" : "text-slate-400"}`} />
          <span>Favorites only</span>
        </label>

        {/* Clear Filters Button */}
        <Button
          data-testid="btn-clear-filters"
          type="button"
          variant="outline"
          onClick={clearFilters}
          className="w-full sm:w-auto h-12 px-5 rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear</span>
        </Button>
      </CardContent>
    </Card>
  );
}
