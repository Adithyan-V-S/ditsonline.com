'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Layers, Check } from 'lucide-react';
import { ProductSummary } from '@/lib/api';

interface VariantSelectorProps {
  currentProduct: ProductSummary;
  variants: ProductSummary[];
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  currentProduct,
  variants,
}) => {
  const prodT = useTranslations('product');
  if (!variants || variants.length === 0) return null;

  // All editions together including current
  const allEditions = [currentProduct, ...variants];

  return (
    <div className="rounded-2xl glass-card border border-white/5 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>{prodT('variants')}</span>
        </h4>
        <span className="text-[11px] font-mono text-zinc-400">
          {allEditions.length} available configurations
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {allEditions.map((item) => {
          const isSelected = item.id === currentProduct.id;
          const editionLabel = item.variantName || item.modelNo;

          return (
            <Link
              key={item.id}
              href={`/catalogue/${item.slug}`}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40'
                  : 'bg-zinc-950/70 border-white/5 hover:border-white/20 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs truncate">{editionLabel}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </div>

              <div className="text-[11px] font-mono mt-2 text-zinc-400">
                {item.priceUsd ? (
                  <span className={isSelected ? 'text-cyan-300 font-bold' : ''}>
                    ${item.priceUsd.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-amber-400/90">Request quote</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
