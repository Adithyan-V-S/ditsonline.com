import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';
import { Category, Brand } from '../../../contracts/types';
import { USE_MOCK_DATA, apiClient } from './client';

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK_DATA) {
    return categoriesData as Category[];
  }
  return apiClient<Category[]>('/categories');
}

export async function getBrands(categoryKey?: string): Promise<Brand[]> {
  if (USE_MOCK_DATA) {
    const filteredProducts = categoryKey && categoryKey !== 'all'
      ? productsData.filter((p) => p.categoryKey === categoryKey)
      : productsData;

    const brandCounts: Record<string, number> = {};
    for (const p of filteredProducts) {
      if (p.brand) {
        brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      }
    }

    return Object.entries(brandCounts)
      .map(([name, count]) => ({
        id: `brand_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        productCount: count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const query = categoryKey ? `?category=${encodeURIComponent(categoryKey)}` : '';
  return apiClient<Brand[]>(`/brands${query}`);
}
