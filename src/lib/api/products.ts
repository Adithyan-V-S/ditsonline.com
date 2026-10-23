import productsData from '@/data/products.json';
import {
  ProductSummary,
  ProductDetail,
  ProductQueryParams,
  ProductListResponse,
} from '../../../contracts/types';
import { USE_MOCK_DATA, apiClient } from './client';

export async function getProducts(params: ProductQueryParams = {}): Promise<ProductListResponse> {
  if (USE_MOCK_DATA) {
    let list = (productsData as unknown as ProductDetail[]).slice();

    // 1. Category filter
    if (params.category && params.category !== 'all') {
      list = list.filter((p) => p.categoryKey === params.category);
    }

    // 2. Brand filter
    if (params.brand && params.brand !== 'all') {
      list = list.filter((p) => p.brand.toLowerCase() === params.brand?.toLowerCase());
    }

    // 3. Search query
    if (params.q) {
      const q = params.q.toLowerCase().trim();
      list = list.filter((p) =>
        `${p.nameEn} ${p.nameZh} ${p.brand} ${p.modelNo} ${p.descriptionEn || ''}`
          .toLowerCase()
          .includes(q)
      );
    }

    // 4. Fits which robot compatibility filter
    if (params.fits_robot && params.fits_robot !== 'all') {
      const r = params.fits_robot.toLowerCase();
      list = list.filter((p) =>
        p.compatibleRobots?.some((c) => c.toLowerCase().includes(r))
      );
    }

    // 5. Sorting
    switch (params.sort) {
      case 'name_desc':
        list.sort((a, b) => b.nameEn.localeCompare(a.nameEn));
        break;
      case 'price_asc':
        list.sort((a, b) => {
          if (a.priceUsd === null) return 1;
          if (b.priceUsd === null) return -1;
          return a.priceUsd - b.priceUsd;
        });
        break;
      case 'price_desc':
        list.sort((a, b) => {
          if (a.priceUsd === null) return 1;
          if (b.priceUsd === null) return -1;
          return b.priceUsd - a.priceUsd;
        });
        break;
      case 'quote_first':
        list.sort((a, b) => {
          if (a.priceUsd === null && b.priceUsd !== null) return -1;
          if (a.priceUsd !== null && b.priceUsd === null) return 1;
          return a.nameEn.localeCompare(b.nameEn);
        });
        break;
      case 'name_asc':
      default:
        list.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
        break;
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 24);
    const total = list.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedItems = list.slice((page - 1) * limit, page * limit);

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  }

  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set('category', params.category);
  if (params.brand) searchParams.set('brand', params.brand);
  if (params.q) searchParams.set('q', params.q);
  if (params.fits_robot) searchParams.set('fits_robot', params.fits_robot);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  return apiClient<ProductListResponse>(`/products?${searchParams.toString()}`);
}

export async function getProductByIdOrSlug(idOrSlug: string): Promise<ProductDetail | null> {
  if (USE_MOCK_DATA) {
    const list = productsData as unknown as ProductDetail[];
    const item = list.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!item) return null;

    // Attach family variants if applicable
    const variants = item.familyGroup
      ? list.filter((p) => p.familyGroup === item.familyGroup && p.id !== item.id)
      : [];

    // Attach related parts
    const relatedParts = list
      .filter(
        (p) =>
          p.id !== item.id &&
          (p.categoryKey === item.categoryKey ||
            p.compatibleRobots?.some((r) => item.compatibleRobots?.includes(r)))
      )
      .slice(0, 4);

    return {
      ...item,
      variants,
      relatedParts,
    };
  }

  return apiClient<ProductDetail>(`/products/${idOrSlug}`);
}

export async function getFeaturedProducts(): Promise<ProductSummary[]> {
  if (USE_MOCK_DATA) {
    const list = productsData as unknown as ProductSummary[];
    // Pick 8 interesting products across categories
    const categories = ['humanoid', 'quad', 'hand', 'act', 'cam', 'joint', 'chip', 'arm'];
    const featured: ProductSummary[] = [];
    for (const cat of categories) {
      const match = list.find((p) => p.categoryKey === cat);
      if (match) featured.push(match);
    }
    return featured;
  }
  const res = await getProducts({ limit: 8, sort: 'name_asc' });
  return res.items;
}
