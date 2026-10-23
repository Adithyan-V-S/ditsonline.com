'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ShoppingCart, Check, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { ProductSummary, ProductDetail } from '../../../contracts/types';
import { addToCart } from '@/lib/storage/cart-storage';

interface FeaturedPartsProps {
  products: ProductSummary[];
}

export const FeaturedParts: React.FC<FeaturedPartsProps> = ({ products }) => {
  const t = useTranslations('home');
  const prodT = useTranslations('product');
  const locale = useLocale();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAdd = (e: React.MouseEvent, product: ProductSummary) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      nameEn: product.nameEn,
      brand: product.brand,
      modelNo: product.modelNo,
      images: product.images,
      priceUsd: product.priceUsd,
      saleMode: product.saleMode,
      minOrderQuantity: product.minOrderQuantity,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Manufacturer Stock</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('featuredParts')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            {t('featuredPartsSubtitle')}
          </p>
        </div>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold group self-start md:self-auto"
        >
          <span>Browse entire catalogue →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isAdded = addedIds[product.id];
          const hasPrice = product.priceUsd !== null && product.priceUsd > 0;

          return (
            <div
              key={product.id}
              className="group rounded-2xl glass-card border border-white/5 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
            >
              <div>
                {/* Product Image & Badges */}
                <Link
                  href={`/catalogue/${product.slug}`}
                  className="block relative aspect-square bg-zinc-900/80 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0] || '/images/products/placeholder.webp'}
                    alt={product.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Brand & Mode Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-400 border border-cyan-400/20 shadow-md">
                      {product.brand}
                    </span>
                    {product.saleMode === 'rent' && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-purple-300 border border-purple-400/20">
                        Fleet Rental
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase truncate">
                    {product.modelNo}
                  </div>
                  <Link
                    href={`/catalogue/${product.slug}`}
                    className="block font-bold text-sm text-zinc-100 hover:text-cyan-400 line-clamp-1 transition-colors"
                  >
                    {locale === 'zh' ? product.nameZh : product.nameEn}
                  </Link>

                  {/* Truncated description snippet */}
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {product.descriptionEn || 'Factory certified precision hardware specifications.'}
                  </p>

                  {/* Compatibility tag if available */}
                  {product.compatibleRobots && product.compatibleRobots.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1">
                      {product.compatibleRobots.slice(0, 2).map((comp) => (
                        <span
                          key={comp}
                          className="text-[10px] font-mono text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded"
                        >
                          Fits {comp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Price & Add Action */}
              <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Pricing</div>
                  <div className="font-mono text-sm font-bold text-zinc-100">
                    {hasPrice ? (
                      <span className="text-cyan-400">${product.priceUsd?.toLocaleString()}</span>
                    ) : (
                      <span className="text-amber-400/90 text-xs">{prodT('requestQuote')}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleAdd(e, product)}
                  className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-800 hover:bg-cyan-600 text-zinc-200 hover:text-white border border-white/10 hover:border-cyan-400/30'
                  }`}
                  title={prodT('addToQuote')}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{prodT('addToQuote')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
