'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ShoppingCart, Check, ArrowRight, Sparkles } from 'lucide-react';
import { ProductSummary } from '@/lib/api';
import { addToCart } from '@/lib/storage/cart-storage';

interface RelatedPartsProps {
  parts: ProductSummary[];
  parentModel: string;
}

export const RelatedParts: React.FC<RelatedPartsProps> = ({
  parts,
  parentModel,
}) => {
  const prodT = useTranslations('product');
  const locale = useLocale();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  if (!parts || parts.length === 0) return null;

  const handleAdd = (e: React.MouseEvent, part: ProductSummary) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: part.id,
      nameEn: part.nameEn,
      brand: part.brand,
      modelNo: part.modelNo,
      images: part.images,
      priceUsd: part.priceUsd,
      saleMode: part.saleMode,
      minOrderQuantity: part.minOrderQuantity,
    });

    setAddedIds((prev) => ({ ...prev, [part.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [part.id]: false }));
    }, 2000);
  };

  return (
    <section className="mt-16 pt-10 border-t border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hardware Ecosystem</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {prodT('relatedParts')}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Factory verified modules and accessories compatible with {parentModel}.
          </p>
        </div>

        <Link
          href="/catalogue"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold hidden sm:inline"
        >
          View all parts →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {parts.map((part) => {
          const isAdded = addedIds[part.id];
          const hasPrice = part.priceUsd !== null && part.priceUsd > 0;

          return (
            <div
              key={part.id}
              className="group rounded-2xl glass-card border border-white/5 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
            >
              <div>
                <Link
                  href={`/catalogue/${part.slug}`}
                  className="block relative aspect-square bg-zinc-900 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={part.images[0] || '/images/products/placeholder.webp'}
                    alt={part.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-400 border border-white/10">
                    {part.brand}
                  </span>
                </Link>

                <div className="p-4 space-y-1.5">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase truncate">
                    {part.modelNo}
                  </div>
                  <Link
                    href={`/catalogue/${part.slug}`}
                    className="block font-bold text-xs text-zinc-100 hover:text-cyan-400 line-clamp-1 transition-colors"
                  >
                    {locale === 'zh' ? part.nameZh : part.nameEn}
                  </Link>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="font-mono text-xs font-bold text-zinc-100">
                    {hasPrice ? (
                      <span className="text-cyan-400">${part.priceUsd?.toLocaleString()}</span>
                    ) : (
                      <span className="text-amber-400/90 text-[11px]">Request quote</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAdd(e, part)}
                    className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-800 hover:bg-cyan-600 text-zinc-200 hover:text-white border border-white/10'
                    }`}
                    title={prodT('addToQuote')}
                  >
                    {isAdded ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <ShoppingCart className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
