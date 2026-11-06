"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/types/expense";
import { Search, Filter, RotateCcw, Star } from "lucide-react";

interface ExpenseFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  starredFilter: boolean;
  setStarredFilter: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onClearFilters: () => void;
}

export function ExpenseFilters({
  categoryFilter,
  setCategoryFilter,
  starredFilter,
  setStarredFilter,
  searchQuery,
  setSearchQuery,
  onClearFilters,
}: ExpenseFiltersProps) {
  return (
    <Card className="shadow-sm border-slate-200/80 dark:border-slate-800">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                data-testid="filter-category"
                className="h-9 px-3 rounded-xl border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-medium"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Starred Only Checkbox */}
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none px-2.5 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors">
              <input
                data-testid="filter-starred"
                type="checkbox"
                checked={starredFilter}
                onChange={(e) => setStarredFilter(e.target.checked)}
                className="rounded border-input h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1">
                <Star className={`w-3.5 h-3.5 ${starredFilter ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                <span>Starred only</span>
              </span>
            </label>

            {/* Clear button */}
            <Button
              data-testid="btn-clear-filters"
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-9 px-3 rounded-xl text-xs font-semibold gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </Button>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              data-testid="search-input"
              type="text"
              placeholder="Search title or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 rounded-xl text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
