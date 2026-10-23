'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ShoppingCart, Check, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { ProductSummary } from '@/lib/api';
import { addToCart } from '@/lib/storage/cart-storage';

interface ProductCardProps {
  product: ProductSummary;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const prodT = useTranslations('product');
  const locale = useLocale();
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const handleAdd = (e: React.MouseEvent) => {
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

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const hasPrice = product.priceUsd !== null && product.priceUsd > 0;

  return (
    <div className="group rounded-2xl glass-card border border-white/5 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300">
      <div>
        {/* Photo Container */}
        <Link
          href={`/catalogue/${product.slug}`}
          className="block relative aspect-square bg-zinc-900 overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0] || '/images/products/placeholder.webp'}
            alt={product.nameEn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Brand & Sale Mode Badges */}
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

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.descriptionEn || 'Direct source robotics component with factory specification calibration.'}
          </p>

          {/* Compatible Robots Tags */}
          {product.compatibleRobots && product.compatibleRobots.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1">
              {product.compatibleRobots.slice(0, 2).map((comp) => (
                <span
                  key={comp}
                  className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-white/5"
                >
                  Fits {comp}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Unit Price</div>
          <div className="font-mono text-sm font-bold text-zinc-100">
            {hasPrice ? (
              <span className="text-cyan-400">${product.priceUsd?.toLocaleString()}</span>
            ) : (
              <span className="text-amber-400/90 text-xs">{prodT('requestQuote')}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 hover:bg-cyan-600 text-zinc-200 hover:text-white border border-white/10 hover:border-cyan-400/30'
          }`}
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
};
