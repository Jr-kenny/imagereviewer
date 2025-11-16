import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilters } from '../../types';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { debounce } from '../../lib/utils';

interface FilterPanelProps {
  onFilterChange: (filters: SearchFilters) => void;
  resultCount?: number;
}

export function FilterPanel({ onFilterChange, resultCount }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [keyword, setKeyword] = useState('');

  const debouncedFilterChange = debounce((newFilters: SearchFilters) => {
    onFilterChange(newFilters);
  }, 500);

  useEffect(() => {
    debouncedFilterChange(filters);
  }, [filters]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setFilters((prev) => ({ ...prev, keyword: value || undefined }));
  };

  const handleRaritySelect = (rarity: 'unique' | 'rare' | 'common') => {
    setFilters((prev) => ({
      ...prev,
      rarity: prev.rarity === rarity ? undefined : rarity,
    }));
  };

  const handleRatingChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: value > 0 ? value : undefined,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setKeyword('');
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof SearchFilters] !== undefined
  ).length;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="filter" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {resultCount !== undefined && (
            <span className="text-sm text-gray-400">{resultCount} results</span>
          )}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Toggle filters"
          >
            {isExpanded ? (
              <X className="w-4 h-4 text-gray-400" />
            ) : (
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(isExpanded || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                placeholder="Search by title, color, or keyword..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Rarity
              </label>
              <div className="flex flex-wrap gap-2">
                {(['unique', 'rare', 'common'] as const).map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => handleRaritySelect(rarity)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                      filters.rarity === rarity
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                        : 'border-white/20 bg-white/5 text-gray-300 hover:border-cyan-500/50'
                    }`}
                  >
                    <Badge variant="rarity" rarity={rarity}>
                      {rarity}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Minimum Rating: {filters.minRating || 0}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.minRating || 0}
                onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filters.rarity && (
                    <Badge
                      variant="filter"
                      onRemove={() =>
                        setFilters((prev) => ({ ...prev, rarity: undefined }))
                      }
                    >
                      {filters.rarity}
                    </Badge>
                  )}
                  {filters.minRating && filters.minRating > 0 && (
                    <Badge
                      variant="filter"
                      onRemove={() =>
                        setFilters((prev) => ({ ...prev, minRating: undefined }))
                      }
                    >
                      Rating ≥ {filters.minRating}
                    </Badge>
                  )}
                  {filters.keyword && (
                    <Badge
                      variant="filter"
                      onRemove={() => {
                        setKeyword('');
                        setFilters((prev) => ({ ...prev, keyword: undefined }));
                      }}
                    >
                      "{filters.keyword}"
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
