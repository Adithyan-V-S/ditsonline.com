'use client';

import React from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalItems,
  limit,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const goToPage = (p: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  // Generate page numbers array
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
      <div className="text-zinc-400">
        Showing <span className="text-zinc-200 font-bold">{startItem}–{endItem}</span> of{' '}
        <span className="text-zinc-200 font-bold">{totalItems}</span> parts
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => {
          const isCurrent = p === page;
          return (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`w-8 h-8 rounded-xl font-bold transition-all ${
                isCurrent
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'border border-white/10 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
