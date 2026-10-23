/**
 * DITS Online Storefront API Contract Types
 * Corresponds to /contracts/openapi.yaml
 */

export type SaleMode = 'buy' | 'quote' | 'rent';

export interface Category {
  id: string;
  key: string;
  nameEn: string;
  nameZh: string;
  descriptionEn?: string;
  descriptionZh?: string;
  icon?: string;
  productCount: number;
  subCategories?: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  productCount: number;
}

export interface BulkPriceTier {
  minQuantity: number;
  unitPriceUsd: number;
}

export interface ProductSummary {
  id: string;
  slug: string;
  modelNo: string;
  nameEn: string;
  nameZh: string;
  brand: string;
  categoryKey: string;
  descriptionEn?: string;
  descriptionZh?: string;
  priceUsd: number | null; // null means "Request a quote", never $0
  saleMode: SaleMode;
  minOrderQuantity: number;
  familyGroup?: string | null;
  variantName?: string | null;
  compatibleRobots?: string[];
  images: string[];
}

export interface ProductDetail extends ProductSummary {
  specs: Record<string, string>;
  variants?: ProductSummary[];
  relatedParts?: ProductSummary[];
  videoUrl?: string | null;
  bulkPricing?: BulkPriceTier[];
}

export interface ProductQueryParams {
  category?: string;
  brand?: string;
  q?: string;
  fits_robot?: string;
  sort?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'quote_first';
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  items: ProductSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CartValidationRequest {
  items: CartItemInput[];
}

export interface CartValidatedItem {
  product: ProductSummary;
  quantity: number;
  unitPriceUsd: number | null;
  lineTotalUsd: number | null;
  satisfiesMoq: boolean;
  appliedTierDiscountPercent?: number | null;
}

export interface CartValidationResponse {
  items: CartValidatedItem[];
  listedSubtotalUsd: number;
  quoteItemsCount: number;
  allSatisfyMoq: boolean;
}

export interface QuoteRequest {
  name: string;
  email: string;
  company?: string;
  country: string;
  timeline?: string;
  message?: string;
  preferredContactMethod?: 'email' | 'whatsapp' | 'wechat';
  phoneOrWechatId?: string;
  items: CartItemInput[];
}

export interface QuoteResponse {
  quoteId: string;
  status: 'submitted' | 'under_review' | 'quoted' | 'accepted' | 'expired';
  createdAt: string;
  estimatedResponseHours: number;
}

export interface OrderRequest {
  items: CartItemInput[];
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export interface OrderResponse {
  orderId: string;
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped';
  totalUsd: number;
  clientSecret?: string;
}

export interface RentalInquiryRequest {
  robotModel: string;
  startDate: string;
  endDate: string;
  location: string;
  needsTechnician?: boolean;
  customerName: string;
  customerEmail: string;
  company?: string;
  notes?: string;
}

export interface RentalInquiryResponse {
  rentalInquiryId: string;
  status: 'received' | 'checking_fleet_availability';
  message: string;
}

/**
 * Assumptions made for Dev B (platform / backend):
 * 1. Price is in USD. When null, saleMode defaults to 'quote', or can be 'rent' for rental items.
 * 2. Categories match the sheet tab groupings, normalized to lowercase slug keys.
 * 3. A single product can fit multiple robots ('compatibleRobots' string array of model names).
 * 4. Quantity tiers ('bulkPricing') define step-discounts for parts with MOQs.
 * 5. Submitted quotes generate a unique human-friendly ID like 'Q-2026-XXXX' and alert the admin.
 */
