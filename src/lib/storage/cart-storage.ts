/**
 * Client-side Cart State Manager with LocalStorage persistence and event emitter
 */

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  modelNo: string;
  image: string;
  priceUsd: number | null;
  quantity: number;
  saleMode: 'buy' | 'quote' | 'rent';
  minOrderQuantity: number;
}

const STORAGE_KEY = 'dits_online_cart_v1';
const CART_UPDATE_EVENT = 'dits_cart_updated';

export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT, { detail: items }));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
}

export function addToCart(product: {
  id: string;
  nameEn: string;
  brand: string;
  modelNo: string;
  images: string[];
  priceUsd: number | null;
  saleMode: 'buy' | 'quote' | 'rent';
  minOrderQuantity?: number;
}, quantity = 1): void {
  const current = getCartItems();
  const existingIdx = current.findIndex((i) => i.id === product.id);
  const moq = product.minOrderQuantity || 1;

  if (existingIdx > -1) {
    current[existingIdx].quantity += quantity;
  } else {
    current.push({
      id: product.id,
      name: product.nameEn,
      brand: product.brand,
      modelNo: product.modelNo,
      image: product.images[0] || '/images/products/placeholder.webp',
      priceUsd: product.priceUsd,
      quantity: Math.max(quantity, moq),
      saleMode: product.saleMode,
      minOrderQuantity: moq,
    });
  }

  saveCartItems(current);
}

export function updateQuantity(id: string, delta: number): void {
  let current = getCartItems();
  const idx = current.findIndex((i) => i.id === id);
  if (idx > -1) {
    const newQty = current[idx].quantity + delta;
    if (newQty <= 0) {
      current = current.filter((i) => i.id !== id);
    } else {
      current[idx].quantity = newQty;
    }
    saveCartItems(current);
  }
}

export function removeFromCart(id: string): void {
  const current = getCartItems().filter((i) => i.id !== id);
  saveCartItems(current);
}

export function clearCart(): void {
  saveCartItems([]);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function subscribeToCart(callback: (items: CartItem[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<CartItem[]>;
    callback(customEvent.detail || getCartItems());
  };

  window.addEventListener(CART_UPDATE_EVENT, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) callback(getCartItems());
  });

  return () => {
    window.removeEventListener(CART_UPDATE_EVENT, handler);
  };
}

export function formatWhatsAppUrl(items: CartItem[], customerName = '', notes = ''): string {
  const phone = '8613510483282';
  if (items.length === 0) {
    return `https://wa.me/${phone}?text=${encodeURIComponent('Hello DITS Online, I have an inquiry about robotics parts.')}`;
  }

  let text = `Hello DITS Online! I would like to request a quote for:\n`;
  items.forEach((item, idx) => {
    const priceStr = item.priceUsd ? `$${(item.priceUsd * item.quantity).toLocaleString()}` : 'Quote required';
    text += `${idx + 1}. ${item.brand} - ${item.modelNo} (Qty: ${item.quantity}) [${priceStr}]\n`;
  });

  if (customerName) text += `\nName: ${customerName}`;
  if (notes) text += `\nNotes: ${notes}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function formatWeChatMessage(items: CartItem[], customerName = '', notes = ''): string {
  if (items.length === 0) {
    return 'DITS Online 咨询：您好，我想了解更多机器人零部件与整机信息。';
  }

  let text = `【DITS Online 采购询价清单】\n`;
  items.forEach((item, idx) => {
    const priceStr = item.priceUsd ? `$${(item.priceUsd * item.quantity).toLocaleString()}` : '需定制核价';
    text += `${idx + 1}. [${item.brand}] ${item.modelNo} × ${item.quantity} 件 (${priceStr})\n`;
  });

  if (customerName) text += `联系人: ${customerName}\n`;
  if (notes) text += `采购要求: ${notes}\n`;
  text += `官方对接微信号: +8613510483282`;

  return text;
}
