import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight, Home, Cpu, Sparkles } from 'lucide-react';
import { getProductByIdOrSlug, getProducts } from '@/lib/api/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { SpecTable } from '@/components/product/SpecTable';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ModeActionButton } from '@/components/product/ModeActionButton';
import { ProductVideo } from '@/components/product/ProductVideo';
import { RelatedParts } from '@/components/product/RelatedParts';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);

  if (!product) {
    return { title: 'Product Not Found · DITS Online' };
  }

  return {
    title: `${product.brand} ${product.modelNo} · DITS Online`,
    description: product.descriptionEn?.slice(0, 160) || 'Industrial robotics hardware specifications and quote inquiry.',
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductByIdOrSlug(slug);
  if (!product) {
    notFound();
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono text-zinc-400 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-cyan-400 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
        <Link href="/catalogue" className="hover:text-cyan-400">
          Catalogue
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
        <Link href={`/catalogue?category=${product.categoryKey}`} className="hover:text-cyan-400 capitalize">
          {product.categoryKey}
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
        <span className="text-zinc-200 font-bold truncate max-w-[200px] sm:max-w-none">
          {product.modelNo}
        </span>
      </nav>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Gallery & Video (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <ProductGallery
            images={product.images}
            productName={product.nameEn}
            brand={product.brand}
            saleMode={product.saleMode}
          />

          <ProductVideo
            productName={product.nameEn}
            modelNo={product.modelNo}
          />
        </div>

        {/* Right Column: Information, Pricing, Actions & Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header titles */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
                {product.brand}
              </span>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Model: {product.modelNo}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {locale === 'zh' ? product.nameZh : product.nameEn}
            </h1>

            {/* Compatible robots tags */}
            {product.compatibleRobots && product.compatibleRobots.length > 0 && (
              <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <span className="text-zinc-500">Robot Compatibility:</span>
                {product.compatibleRobots.map((robot) => (
                  <span
                    key={robot}
                    className="px-2 py-0.5 rounded bg-zinc-900 border border-cyan-500/30 text-cyan-300"
                  >
                    Fits {robot}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-2">
            <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold">
              Engineering Overview
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {product.descriptionEn || 'Official factory certified component with verified kinematic and electrical compatibility.'}
            </p>
          </div>

          {/* Variant Selector (if editions/variants exist) */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              currentProduct={product}
              variants={product.variants}
            />
          )}

          {/* Mode Action Button (Buy, Quote, Rent + Quantity + Bulk Pricing) */}
          <ModeActionButton product={product} />

          {/* Specification Table */}
          <SpecTable
            specs={product.specs}
            modelNo={product.modelNo}
          />
        </div>
      </div>

      {/* Bottom Related & Compatible Parts Ecosystem */}
      <RelatedParts
        parts={product.relatedParts || []}
        parentModel={product.modelNo}
      />
    </div>
  );
}
