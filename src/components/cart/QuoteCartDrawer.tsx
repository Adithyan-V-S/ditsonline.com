'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Send,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  FileText,
} from 'lucide-react';
import {
  CartItem,
  getCartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  subscribeToCart,
  formatWhatsAppUrl,
} from '@/lib/storage/cart-storage';
import { submitQuote } from '@/lib/api/quotes';

interface QuoteCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWeChat: () => void;
}

export const QuoteCartDrawer: React.FC<QuoteCartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenWeChat,
}) => {
  const t = useTranslations('cart');
  const [items, setItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    setItems(getCartItems());
    const unsub = subscribeToCart((updated) => setItems(updated));
    return unsub;
  }, []);

  if (!isOpen) return null;

  // Compute pricing
  let listedSubtotal = 0;
  let customQuoteCount = 0;
  items.forEach((item) => {
    if (item.priceUsd) {
      listedSubtotal += item.priceUsd * item.quantity;
    } else {
      customQuoteCount += 1;
    }
  });

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsSubmitting(true);
    try {
      const res = await submitQuote({
        name,
        email,
        company,
        country: country || 'Not specified',
        timeline,
        message: notes,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      setSubmittedQuoteId(res.quoteId);
      clearCart();
    } catch (err) {
      console.error('Failed to submit quote:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppUrl = formatWhatsAppUrl(items, name, notes);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-white/10 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-base text-white tracking-wide">{t('title')}</h2>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                {items.length}
              </span>
            </div>
            <button
              id="close-quote-drawer"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {submittedQuoteId ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">{t('quoteSubmitted')}</h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                  {t('quoteSubmittedDesc', { quoteId: submittedQuoteId })}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmittedQuoteId(null);
                      onClose();
                    }}
                    className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                  >
                    Back to Catalogue
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-zinc-600" />
                <p className="text-sm text-zinc-400">{t('emptyMessage')}</p>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex gap-3 items-center group"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-lg bg-zinc-800 shrink-0 overflow-hidden border border-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-mono text-cyan-400 truncate">{item.brand}</div>
                        <div className="text-xs font-semibold text-zinc-200 truncate">{item.modelNo}</div>
                        <div className="text-[11px] text-zinc-400">
                          {item.priceUsd ? `$${item.priceUsd.toLocaleString()} / unit` : 'Custom quote'}
                        </div>
                        {item.minOrderQuantity > 1 && (
                          <div className="text-[10px] text-amber-400/90 font-mono">
                            MOQ: {item.minOrderQuantity}
                          </div>
                        )}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1 rounded-lg border border-white/5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-0.5 text-zinc-400 hover:text-white"
                          title="Fewer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-zinc-200 px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-0.5 text-zinc-400 hover:text-white"
                          title="More"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Tier Overview */}
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2 text-xs">
                  {listedSubtotal > 0 && (
                    <div className="flex justify-between items-center text-zinc-300">
                      <span>{t('listedSubtotal')}</span>
                      <span className="font-mono font-bold text-sm text-cyan-400">
                        ${listedSubtotal.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {customQuoteCount > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-300 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{t('customQuoteItems', { count: customQuoteCount })}</span>
                    </div>
                  )}
                </div>

                {/* Link to Full BOM Page */}
                <Link
                  id="view-full-bom-link"
                  href="/quote"
                  onClick={onClose}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-2 transition-colors group shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>View Full Bill of Materials & RFQ Page</span>
                </Link>

                {/* Quick Chat CTAs */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    {t('directContact')}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t('whatsappBtn')}</span>
                    </a>
                    <button
                      onClick={onOpenWeChat}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{t('wechatBtn')}</span>
                    </button>
                  </div>
                </div>

                {/* RFQ Form */}
                <form onSubmit={handleSubmitQuote} className="space-y-3 pt-2">
                  <div className="text-xs font-mono font-bold text-zinc-200 uppercase">
                    Formal Quote Request
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('name')}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('email')}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={t('company')}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder={t('country')}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('notes')}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : t('sendQuoteRequest')}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
