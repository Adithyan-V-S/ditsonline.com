import productsData from '@/data/products.json';
import {
  CartValidationRequest,
  CartValidationResponse,
  CartValidatedItem,
  QuoteRequest,
  QuoteResponse,
  ProductSummary,
} from '../../../contracts/types';
import { USE_MOCK_DATA, apiClient } from './client';

export async function validateCart(req: CartValidationRequest): Promise<CartValidationResponse> {
  if (USE_MOCK_DATA) {
    const list = productsData as unknown as ProductSummary[];
    let listedSubtotalUsd = 0;
    let quoteItemsCount = 0;
    let allSatisfyMoq = true;

    const validatedItems: CartValidatedItem[] = req.items.map((item) => {
      const product = list.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      const moq = product.minOrderQuantity || 1;
      const satisfiesMoq = item.quantity >= moq;
      if (!satisfiesMoq) allSatisfyMoq = false;

      let unitPriceUsd = product.priceUsd;
      let appliedTierDiscountPercent: number | null = null;

      // Apply bulk tier discount if available
      if (unitPriceUsd && product.priceUsd) {
        if (item.quantity >= 20) {
          unitPriceUsd = Math.round(product.priceUsd * 0.88 * 100) / 100;
          appliedTierDiscountPercent = 12;
        } else if (item.quantity >= 5) {
          unitPriceUsd = Math.round(product.priceUsd * 0.95 * 100) / 100;
          appliedTierDiscountPercent = 5;
        }
      }

      const lineTotalUsd = unitPriceUsd ? unitPriceUsd * item.quantity : null;

      if (lineTotalUsd !== null) {
        listedSubtotalUsd += lineTotalUsd;
      } else {
        quoteItemsCount += 1;
      }

      return {
        product,
        quantity: item.quantity,
        unitPriceUsd,
        lineTotalUsd,
        satisfiesMoq,
        appliedTierDiscountPercent,
      };
    });

    return {
      items: validatedItems,
      listedSubtotalUsd: Math.round(listedSubtotalUsd * 100) / 100,
      quoteItemsCount,
      allSatisfyMoq,
    };
  }

  return apiClient<CartValidationResponse>('/cart/validate', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export async function submitQuote(req: QuoteRequest): Promise<QuoteResponse> {
  if (USE_MOCK_DATA) {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 400));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const quoteId = `Q-${new Date().getFullYear()}-${randomSuffix}`;

    // Store in localStorage if in browser environment for demo tracking
    if (typeof window !== 'undefined') {
      const quotes = JSON.parse(localStorage.getItem('dits_submitted_quotes') || '[]');
      quotes.unshift({
        quoteId,
        status: 'submitted',
        createdAt: new Date().toISOString(),
        req,
      });
      localStorage.setItem('dits_submitted_quotes', JSON.stringify(quotes));
    }

    return {
      quoteId,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      estimatedResponseHours: 24,
    };
  }

  return apiClient<QuoteResponse>('/quotes', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}
