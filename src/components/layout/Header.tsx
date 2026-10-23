'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import {
  Search,
  ShoppingCart,
  Globe,
  Menu,
  X,
  ChevronDown,
  Cpu,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { getCartItems, getCartCount, subscribeToCart, CartItem } from '@/lib/storage/cart-storage';
import { getProducts } from '@/lib/api/products';
import { ProductSummary } from '../../../contracts/types';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [cartCount, setCartCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ProductSummary[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time cart updates
  useEffect(() => {
    setCartCount(getCartCount(getCartItems()));
    const unsubscribe = subscribeToCart((items: CartItem[]) => {
      setCartCount(getCartCount(items));
    });
    return unsubscribe;
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await getProducts({ q: searchQuery, limit: 5 });
        setSearchResults(res.items);
        setSearchOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'zh' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border-b border-cyan-500/10 text-xs py-1.5 px-4 text-center text-cyan-300 font-mono flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>{t('authenticBrands')}</span>
        <span className="hidden md:inline text-white/30">|</span>
        <span className="hidden md:inline text-zinc-400">Unitree · SenseRobot · AMPSTech · UNISUNBOT · HONPINE</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1.5">
                DITS<span className="text-cyan-400">ONLINE</span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 -mt-1">
                Robots · Parts · Kits
              </div>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setSearchOpen(true)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-zinc-900/90 text-sm text-zinc-100 placeholder-zinc-500 pl-10 pr-4 py-2 rounded-full border border-white/10 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-2.5" />
            </form>

            {/* Live Autocomplete Dropdown */}
            {searchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-fade-in">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-zinc-400">Searching robotics catalog...</div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 py-1 text-[11px] font-mono uppercase text-zinc-400 border-b border-white/5">
                      Suggested Parts & Robots
                    </div>
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/catalogue/${item.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.images[0] || '/images/products/placeholder.webp'}
                            alt={item.nameEn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-zinc-100 truncate group-hover:text-cyan-400">
                            {locale === 'zh' ? item.nameZh : item.nameEn}
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                            <span className="font-mono text-cyan-400/90">{item.brand}</span>
                            <span>·</span>
                            <span>{item.priceUsd ? `$${item.priceUsd.toLocaleString()}` : 'Quote required'}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                    <div className="p-2 border-t border-white/5 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-medium py-1"
                      >
                        View all results for &quot;{searchQuery}&quot; →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-zinc-400">
                    No robot parts found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              {t('home')}
            </Link>
            <Link href="/catalogue" className="hover:text-cyan-400 transition-colors">
              {t('catalogue')}
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors py-2">
                <span>{t('services')}</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 w-48 py-2 bg-zinc-900 border border-white/10 rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <Link href="/services/rental" className="block px-4 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-cyan-400">
                  {t('rental')}
                </Link>
                <Link href="/services/education" className="block px-4 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-cyan-400">
                  {t('education')}
                </Link>
                <Link href="/services/repair" className="block px-4 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-cyan-400">
                  {t('repair')}
                </Link>
                <Link href="/services/reseller" className="block px-4 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-cyan-400">
                  {t('reseller')}
                </Link>
              </div>
            </div>
            <Link href="/videos" className="hover:text-cyan-400 transition-colors">
              {t('videos')}
            </Link>
            <Link href="/blog" className="hover:text-cyan-400 transition-colors">
              {t('blog')}
            </Link>
          </nav>

          {/* Actions: Language Switch & My Quote Drawer Trigger */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              id="lang-switcher-btn"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-xs text-zinc-200 font-mono transition-colors"
              title="Switch language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{locale === 'en' ? '中文' : 'EN'}</span>
            </button>

            {/* My Quote Cart Button */}
            <button
              id="quote-cart-trigger"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t('myQuote')}</span>
              <span
                id="quote-cart-counter-badge"
                className="bg-zinc-950 text-cyan-300 font-mono text-[11px] px-1.5 py-0.5 rounded-full font-bold border border-cyan-400/30"
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 px-2 space-y-3 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-zinc-900 text-sm text-zinc-100 placeholder-zinc-500 pl-10 pr-4 py-2 rounded-xl border border-white/10"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-2.5" />
            </form>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-zinc-900/60 text-zinc-200 hover:text-cyan-400"
              >
                {t('home')}
              </Link>
              <Link
                href="/catalogue"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-zinc-900/60 text-zinc-200 hover:text-cyan-400"
              >
                {t('catalogue')}
              </Link>
              <Link
                href="/services/rental"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-zinc-900/60 text-zinc-200 hover:text-cyan-400"
              >
                {t('rental')}
              </Link>
              <Link
                href="/services/reseller"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-zinc-900/60 text-zinc-200 hover:text-cyan-400"
              >
                {t('reseller')}
              </Link>
              <Link
                href="/videos"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-zinc-900/60 text-zinc-200 hover:text-cyan-400"
              >
                {t('videos')}
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-zinc-900/60 text-zinc-200 hover:text-cyan-400"
              >
                {t('blog')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
