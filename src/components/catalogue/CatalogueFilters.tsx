'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Category, Brand } from '@/lib/api';

interface CatalogueFiltersProps {
  categories: Category[];
  brands: Brand[];
  selectedCategory: string;
  selectedBrand: string;
  selectedRobot: string;
  selectedSort: string;
  searchQuery: string;
  totalProducts: number;
}

const COMPATIBLE_ROBOT_OPTIONS = [
  { label: 'All Compatible Robots', value: 'all' },
  { label: 'Unitree G1', value: 'Unitree G1' },
  { label: 'Unitree Go2', value: 'Unitree Go2' },
  { label: 'Unitree R1', value: 'Unitree R1' },
  { label: 'AgiBot X2', value: 'AgiBot X2' },
  { label: 'Dobot Magician', value: 'Dobot Magician' },
  { label: 'Universal / Modular', value: 'Universal' },
];

export const CatalogueFilters: React.FC<CatalogueFiltersProps> = ({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedRobot,
  selectedSort,
  searchQuery,
  totalProducts,
}) => {
  const t = useTranslations('catalogue');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [inputVal, setInputVal] = useState<string>(searchQuery);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    setInputVal(searchQuery);
  }, [searchQuery]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // reset pagination on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', inputVal.trim());
  };

  const handleResetFilters = () => {
    setInputVal('');
    router.push(pathname);
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== 'all') ||
    (selectedBrand && selectedBrand !== 'all') ||
    (selectedRobot && selectedRobot !== 'all') ||
    Boolean(searchQuery);

  return (
    <div className="space-y-6 mb-10">
      {/* 1. Category Navigation Tabs */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => updateParam('category', 'all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200'
            }`}
          >
            <span>{t('allCategories')}</span>
            <span className="ml-1.5 opacity-60">
              ({categories.reduce((acc, c) => acc + c.productCount, 0)})
            </span>
          </button>

          {categories.map((c) => {
            const isSelected = selectedCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => updateParam('category', c.key)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border whitespace-nowrap ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200'
                }`}
              >
                <span>{locale === 'zh' ? c.nameZh : c.nameEn}</span>
                <span className="ml-1.5 opacity-60">({c.productCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Controls Toolbar: Search, Brand, Robot Compatibility, Sort */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
          <input
            id="catalogue-search-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search parts, brands, DOF, torque..."
            className="w-full bg-zinc-950/90 text-xs text-zinc-100 placeholder-zinc-500 pl-9 pr-8 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500/60"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          {inputVal && (
            <button
              type="button"
              onClick={() => {
                setInputVal('');
                updateParam('q', '');
              }}
              className="p-1 text-zinc-500 hover:text-zinc-300 absolute right-2.5 top-2.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Brand Filter */}
          <div className="relative">
            <select
              id="brand-filter-select"
              value={selectedBrand}
              onChange={(e) => updateParam('brand', e.target.value)}
              className="appearance-none bg-zinc-950/90 border border-white/10 text-xs text-zinc-200 pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
            >
              <option value="all">{t('allBrands')}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.productCount})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* "Fits which robot" Compatibility Filter */}
          <div className="relative">
            <select
              id="robot-compatibility-select"
              value={selectedRobot}
              onChange={(e) => updateParam('fits_robot', e.target.value)}
              className="appearance-none bg-zinc-950/90 border border-cyan-500/30 text-xs text-cyan-300 pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
            >
              {COMPATIBLE_ROBOT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Sort Menu */}
          <div className="relative">
            <select
              id="catalogue-sort-select"
              value={selectedSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="appearance-none bg-zinc-950/90 border border-white/10 text-xs text-zinc-200 pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
            >
              <option value="name_asc">{t('sortNameAsc')}</option>
              <option value="name_desc">{t('sortNameDesc')}</option>
              <option value="price_asc">{t('sortPriceAsc')}</option>
              <option value="price_desc">{t('sortPriceDesc')}</option>
              <option value="quote_first">{t('sortQuoteFirst')}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              id="reset-catalogue-filters-btn"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 hover:text-white transition-colors border border-white/5 font-mono"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('resetFilters')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header status */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
        <div>{t('productsFound', { count: totalProducts })}</div>
        {selectedRobot !== 'all' && (
          <div className="text-cyan-400">
            Filtered by: <span className="font-bold underline">{selectedRobot}</span>
          </div>
        )}
      </div>
    </div>
  );
};
