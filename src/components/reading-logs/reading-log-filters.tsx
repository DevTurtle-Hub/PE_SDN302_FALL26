"use client";

import { useReadingLogs } from "@/context/reading-logs-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw, Star } from "lucide-react";

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
    <Card className="rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl shadow-blue-500/5 backdrop-blur-xl overflow-hidden p-4 sm:p-5">
      <CardContent className="p-0 flex flex-col sm:flex-row flex-wrap items-center gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            data-testid="search-input"
            type="text"
            placeholder="Search by book title or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 text-sm focus-visible:ring-blue-500/20"
          />
        </div>

        {/* Genre Select Filter */}
        <div className="w-full sm:w-auto min-w-[150px]">
          <select
            data-testid="filter-genre"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="w-full px-3.5 h-10 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
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
        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <input
            type="checkbox"
            data-testid="filter-favorite"
            checked={favoriteFilter}
            onChange={(e) => setFavoriteFilter(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 cursor-pointer"
          />
          <Star className={`w-3.5 h-3.5 ${favoriteFilter ? "fill-amber-400 text-amber-500" : "text-slate-400"}`} />
          <span>Favorites only</span>
        </label>

        {/* Clear Filters Button */}
        <Button
          data-testid="btn-clear-filters"
          type="button"
          variant="outline"
          onClick={clearFilters}
          className="w-full sm:w-auto h-10 px-4 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </Button>
      </CardContent>
    </Card>
  );
}

