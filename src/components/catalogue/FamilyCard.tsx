'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ShoppingCart, Check, X, Layers, ChevronRight, Info } from 'lucide-react';
import { ProductSummary } from '@/lib/api';
import { addToCart } from '@/lib/storage/cart-storage';

interface FamilyGroupItem {
  id: string;
  familyName: string;
  brand: string;
  items: ProductSummary[];
}

interface FamilyCardProps {
  family: FamilyGroupItem;
}

export const FamilyCard: React.FC<FamilyCardProps> = ({ family }) => {
  const prodT = useTranslations('product');
  const locale = useLocale();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const representative =
    family.items.find((i) => i.images.length > 0 && !i.images[0].includes('placeholder')) ||
    family.items[0];

  const prices = family.items
    .map((i) => i.priceUsd)
    .filter((p): p is number => p !== null && p > 0);

  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  const handleAddVariant = (variant: ProductSummary) => {
    addToCart({
      id: variant.id,
      nameEn: variant.nameEn,
      brand: variant.brand,
      modelNo: variant.modelNo,
      images: variant.images,
      priceUsd: variant.priceUsd,
      saleMode: variant.saleMode,
      minOrderQuantity: variant.minOrderQuantity,
    });

    setAddedIds((prev) => ({ ...prev, [variant.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [variant.id]: false }));
    }, 2000);
  };

  return (
    <>
      <div className="group rounded-2xl glass-card border border-cyan-500/20 overflow-hidden flex flex-col justify-between hover:border-cyan-400/50 transition-all duration-300">
        <div>
          {/* Photo Container */}
          <div
            onClick={() => setModalOpen(true)}
            className="block relative aspect-square bg-zinc-900 overflow-hidden cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={representative.images[0] || '/images/products/placeholder.webp'}
              alt={family.familyName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Models Count Badge */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
              <span className="px-2.5 py-1 rounded-md bg-cyan-950/90 backdrop-blur-md text-[11px] font-mono font-bold text-cyan-300 border border-cyan-400/40 shadow-lg flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>{family.items.length} Configurations</span>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              {family.brand}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="block font-bold text-base text-zinc-100 hover:text-cyan-400 text-left transition-colors"
            >
              {family.familyName} Series
            </button>

            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              Available in {family.items.map((i) => i.variantName || i.modelNo).join(', ')} editions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Series Pricing</div>
            <div className="font-mono text-sm font-bold text-zinc-100">
              {minPrice !== null ? (
                <span className="text-cyan-400">From ${minPrice.toLocaleString()}</span>
              ) : (
                <span className="text-amber-400/90 text-xs">Request quote</span>
              )}
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl font-semibold text-xs bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1 shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
          >
            <span>Select Model</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Model Picker Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-5 text-zinc-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden shrink-0 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={representative.images[0] || '/images/products/placeholder.webp'}
                    alt={family.familyName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {family.familyName} Series Configurations
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Select a model variant to add to your quote inquiry
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Variants List */}
            <div className="space-y-3">
              {family.items.map((variant) => {
                const isVariantAdded = addedIds[variant.id];
                const hasVariantPrice = variant.priceUsd !== null && variant.priceUsd > 0;

                return (
                  <div
                    key={variant.id}
                    className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-100">
                          {variant.modelNo}
                        </span>
                        {variant.variantName && (
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800">
                            {variant.variantName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {variant.descriptionEn || 'Full factory specification package.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-zinc-200">
                          {hasVariantPrice ? (
                            <span className="text-cyan-400">${variant.priceUsd?.toLocaleString()}</span>
                          ) : (
                            <span className="text-amber-400/90">Request quote</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddVariant(variant)}
                        className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-md ${
                          isVariantAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-800 hover:bg-cyan-600 text-zinc-200 hover:text-white border border-white/10'
                        }`}
                      >
                        {isVariantAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
