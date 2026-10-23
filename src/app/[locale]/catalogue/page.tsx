import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getCategories, getBrands } from '@/lib/api/categories';
import { getProducts } from '@/lib/api/products';
import { CatalogueFilters } from '@/components/catalogue/CatalogueFilters';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { FamilyCard } from '@/components/catalogue/FamilyCard';
import { Pagination } from '@/components/catalogue/Pagination';
import { ProductSummary } from '@/lib/api';
import { Sparkles, PackageSearch } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catalogue · DITS Online Robot Hardware',
  description: 'Search, filter and request quotes for industrial robots, actuator modules, hands, depth cameras, and controller docks.',
};

interface CataloguePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    brand?: string;
    q?: string;
    fits_robot?: string;
    sort?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'quote_first';
    page?: string;
  }>;
}

export default async function CataloguePage({ params, searchParams }: CataloguePageProps) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('catalogue');

  const selectedCategory = query.category || 'all';
  const selectedBrand = query.brand || 'all';
  const selectedRobot = query.fits_robot || 'all';
  const selectedSort = query.sort || 'name_asc';
  const searchQuery = query.q || '';
  const currentPage = parseInt(query.page || '1', 10);
  const pageLimit = 24;

  const [categories, brands, productsData] = await Promise.all([
    getCategories(),
    getBrands(selectedCategory),
    getProducts({
      category: selectedCategory,
      brand: selectedBrand,
      q: searchQuery,
      fits_robot: selectedRobot,
      sort: selectedSort,
      page: currentPage,
      limit: pageLimit,
    }),
  ]);

  // Family grouping logic for Humanoids when unfiltered
  const isHumanoidUnfiltered =
    selectedCategory === 'humanoid' &&
    selectedBrand === 'all' &&
    selectedRobot === 'all' &&
    !searchQuery;

  let displayItems: Array<
    | { type: 'family'; family: { id: string; familyName: string; brand: string; items: ProductSummary[] } }
    | { type: 'product'; product: ProductSummary }
  > = [];

  if (isHumanoidUnfiltered) {
    const families: Record<string, { id: string; familyName: string; brand: string; items: ProductSummary[] }> = {};
    const standalone: ProductSummary[] = [];

    productsData.items.forEach((p) => {
      if (p.familyGroup) {
        if (!families[p.familyGroup]) {
          families[p.familyGroup] = {
            id: p.familyGroup,
            familyName: p.familyGroup.replace('-', ' ').toUpperCase(),
            brand: p.brand,
            items: [],
          };
        }
        families[p.familyGroup].items.push(p);
      } else {
        standalone.push(p);
      }
    });

    displayItems = [
      ...Object.values(families).map((f) => ({ type: 'family' as const, family: f })),
      ...standalone.map((p) => ({ type: 'product' as const, product: p })),
    ];
  } else {
    displayItems = productsData.items.map((p) => ({ type: 'product' as const, product: p }));
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Factory Direct Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('title')}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
          Browse verified humanoid chassis, quadruped dogs, harmonic actuators, and modular sensor payloads.
        </p>
      </div>

      {/* Filters Toolbar */}
      <CatalogueFilters
        categories={categories}
        brands={brands}
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        selectedRobot={selectedRobot}
        selectedSort={selectedSort}
        searchQuery={searchQuery}
        totalProducts={productsData.total}
      />

      {/* Product Grid */}
      {displayItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayItems.map((item, idx) => {
            if (item.type === 'family') {
              return <FamilyCard key={item.family.id} family={item.family} />;
            }
            return <ProductCard key={item.product.id || idx} product={item.product} />;
          })}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 rounded-3xl glass-card border border-white/5 max-w-xl mx-auto">
          <PackageSearch className="w-12 h-12 text-zinc-500 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">No Matching Robot Parts Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            {t('noProducts')} Try adjusting your keywords, selecting &quot;All Brands&quot;, or clearing the compatibility filter.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={productsData.page}
        totalPages={productsData.totalPages}
        totalItems={productsData.total}
        limit={productsData.limit}
      />
    </div>
  );
}
