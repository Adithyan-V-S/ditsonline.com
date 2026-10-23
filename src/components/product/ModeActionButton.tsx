'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ShoppingCart,
  Check,
  Plus,
  Minus,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
} from 'lucide-react';
import { ProductDetail, BulkPriceTier } from '@/lib/api';
import { addToCart, formatWhatsAppUrl } from '@/lib/storage/cart-storage';

interface ModeActionButtonProps {
  product: ProductDetail;
  onOpenWeChat?: () => void;
}

export const ModeActionButton: React.FC<ModeActionButtonProps> = ({
  product,
  onOpenWeChat,
}) => {
  const prodT = useTranslations('product');
  const cartT = useTranslations('cart');

  const moq = product.minOrderQuantity || 1;
  const [quantity, setQuantity] = useState<number>(moq);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const hasPrice = product.priceUsd !== null && product.priceUsd > 0;

  // Determine button text and styling based on mode
  let buttonLabel = prodT('requestQuote');
  let modeBadge = 'Custom RFQ Mode';

  if (product.saleMode === 'buy' && hasPrice) {
    buttonLabel = prodT('buyNow');
    modeBadge = 'Direct Checkout Available';
  } else if (product.saleMode === 'rent') {
    buttonLabel = prodT('rentRobot');
    modeBadge = 'Commercial Fleet Rental';
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        nameEn: product.nameEn,
        brand: product.brand,
        modelNo: product.modelNo,
        images: product.images,
        priceUsd: product.priceUsd,
        saleMode: product.saleMode,
        minOrderQuantity: moq,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  // WhatsApp link for this product
  const singleItemWhatsAppUrl = formatWhatsAppUrl(
    [
      {
        id: product.id,
        name: product.nameEn,
        brand: product.brand,
        modelNo: product.modelNo,
        image: product.images[0] || '',
        priceUsd: product.priceUsd,
        quantity,
        saleMode: product.saleMode,
        minOrderQuantity: moq,
      },
    ],
    '',
    `Inquiry regarding ${product.brand} ${product.modelNo}`
  );

  return (
    <div className="rounded-3xl glass-card border border-white/10 p-6 space-y-6">
      {/* Price & MOQ Header */}
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            {modeBadge}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-1">
            {hasPrice ? (
              <span className="text-cyan-400">${product.priceUsd?.toLocaleString()}</span>
            ) : (
              <span className="text-amber-400 text-xl sm:text-2xl font-sans font-bold">
                {prodT('requestQuote')}
              </span>
            )}
          </div>
          {moq > 1 && (
            <div className="text-xs font-mono text-amber-300/90 mt-1">
              {prodT('minOrder', { qty: moq })}
            </div>
          )}
        </div>

        {/* Lead time guarantee badge */}
        <div className="px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-white/5 text-right font-mono text-[11px] text-zinc-400">
          <div>Factory Dispatch</div>
          <div className="text-emerald-400 font-bold">3–5 Business Days</div>
        </div>
      </div>

      {/* Bulk Pricing Tiers (if available) */}
      {product.bulkPricing && product.bulkPricing.length > 0 && (
        <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>{prodT('bulkTiers')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            {product.bulkPricing.map((tier: BulkPriceTier, idx: number) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 flex justify-between"
              >
                <span className="text-zinc-400">≥ {tier.minQuantity} units</span>
                <span className="text-cyan-400 font-bold">
                  ${tier.unitPriceUsd.toLocaleString()} / ea
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Stepper & Add Action */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-zinc-950 rounded-2xl border border-white/10 p-1">
            <button
              onClick={() => setQuantity(Math.max(moq, quantity - 1))}
              disabled={quantity <= moq}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm font-bold text-white px-3 min-w-[2.5rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            id="product-mode-action-btn"
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>{prodT('addedToQuote')}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{buttonLabel}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Contact Links for Immediate Spec Questions */}
        <div className="pt-2 grid grid-cols-2 gap-2.5">
          <a
            href={singleItemWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Spec Inquiry</span>
          </a>

          <button
            onClick={onOpenWeChat}
            className="py-2.5 px-3 rounded-xl bg-green-600/15 hover:bg-green-600/25 border border-green-500/30 text-green-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>WeChat Sales Engineer</span>
          </button>
        </div>
      </div>

      {/* Trust & Guarantee Highlights */}
      <div className="pt-4 border-t border-white/5 space-y-2 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Manufacturer Direct 12-Month Official Warranty</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-400" />
          <span>Global Air Freight with Customs & Duty Handling</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-purple-400" />
          <span>DOA Replacement & Factory Technical Calibration</span>
        </div>
      </div>
    </div>
  );
};
