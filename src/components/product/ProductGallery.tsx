'use client';

import React, { useState } from 'react';
import { Layers, ShieldCheck } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  brand: string;
  saleMode: 'buy' | 'quote' | 'rent';
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  brand,
  saleMode,
}) => {
  const displayImages =
    images.length > 0 ? images : ['/images/products/placeholder.webp'];
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  return (
    <div className="space-y-4">
      {/* Main High-Res Image Canvas */}
      <div className="relative aspect-square rounded-3xl glass-card border border-white/10 overflow-hidden bg-zinc-900/90 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImages[selectedIdx] || displayImages[0]}
          alt={productName}
          className="w-full h-full object-contain p-4 transition-all duration-300"
        />

        {/* Brand & Sale Mode Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          <span className="px-3 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md text-xs font-mono font-bold text-cyan-400 border border-cyan-400/30 shadow-lg">
            {brand}
          </span>
          {saleMode === 'rent' && (
            <span className="px-3 py-1 rounded-lg bg-purple-950/80 backdrop-blur-md text-xs font-mono font-bold text-purple-300 border border-purple-400/30 shadow-lg">
              Fleet Rental Available
            </span>
          )}
        </div>

        {/* Verified Hardware Watermark */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono text-zinc-400 border border-white/5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Factory Verified Specs</span>
        </div>
      </div>

      {/* Thumbnails Strip (if multiple images) */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-16 h-16 rounded-xl overflow-hidden border transition-all shrink-0 bg-zinc-900 ${
                selectedIdx === idx
                  ? 'border-cyan-400 ring-2 ring-cyan-400/30 scale-105'
                  : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
