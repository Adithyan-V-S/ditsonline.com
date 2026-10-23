'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Send,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Tag,
  ArrowRight,
  RotateCcw,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  CartItem,
  getCartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  subscribeToCart,
  formatWhatsAppUrl,
  formatWeChatMessage,
} from '@/lib/storage/cart-storage';
import { submitQuote } from '@/lib/api/quotes';

interface QuoteCartViewProps {
  onOpenWeChat?: () => void;
}

export const QuoteCartView: React.FC<QuoteCartViewProps> = ({ onOpenWeChat }) => {
  const t = useTranslations('cart');
  const locale = useLocale();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);
  const [weChatCopied, setWeChatCopied] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('1 month');
  const [notes, setNotes] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'whatsapp' | 'wechat'>('email');
  const [contactHandle, setContactHandle] = useState<string>('');

  useEffect(() => {
    setItems(getCartItems());
    const unsub = subscribeToCart((updated) => setItems(updated));
    return unsub;
  }, []);

  // Compute subtotals, MOQ satisfaction, and volume discount tiers
  let listedSubtotal = 0;
  let customQuoteCount = 0;
  let allMoqSatisfied = true;
  let totalUnits = 0;

  const enrichedItems = items.map((item) => {
    const moq = item.minOrderQuantity || 1;
    const satisfiesMoq = item.quantity >= moq;
    if (!satisfiesMoq) allMoqSatisfied = false;
    totalUnits += item.quantity;

    let effectiveUnitPrice = item.priceUsd;
    let discountPercent: number | null = null;

    if (item.priceUsd) {
      if (item.quantity >= 20) {
        effectiveUnitPrice = Math.round(item.priceUsd * 0.88 * 100) / 100;
        discountPercent = 12;
      } else if (item.quantity >= 5) {
        effectiveUnitPrice = Math.round(item.priceUsd * 0.95 * 100) / 100;
        discountPercent = 5;
      }
      listedSubtotal += (effectiveUnitPrice || 0) * item.quantity;
    } else {
      customQuoteCount += 1;
    }

    return {
      ...item,
      moq,
      satisfiesMoq,
      effectiveUnitPrice,
      discountPercent,
      lineTotal: effectiveUnitPrice ? effectiveUnitPrice * item.quantity : null,
    };
  });

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || items.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await submitQuote({
        name,
        email,
        company,
        country: country || 'Not specified',
        timeline,
        message: notes,
        preferredContactMethod: preferredContact,
        phoneOrWechatId: contactHandle,
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

  const whatsAppUrl = formatWhatsAppUrl(items, name, `${notes} | Timeline: ${timeline}`);

  // If submitted, show formal confirmation screen
  if (submittedQuoteId) {
    return (
      <div className="py-20 text-center space-y-6 max-w-xl mx-auto rounded-3xl glass-card border border-white/10 p-8 shadow-2xl animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-800">
            RFQ #{submittedQuoteId}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('quoteSubmitted')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
            {t('quoteSubmittedDesc', { quoteId: submittedQuoteId })}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-2 text-xs font-mono text-left text-zinc-400">
          <div className="flex justify-between">
            <span>Primary Contact:</span>
            <span className="text-zinc-200">{name} ({email})</span>
          </div>
          <div className="flex justify-between">
            <span>Destination:</span>
            <span className="text-zinc-200">{country || 'Global'}</span>
          </div>
          <div className="flex justify-between">
            <span>Review SLA:</span>
            <span className="text-emerald-400 font-bold">Within 24 Hours</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/catalogue"
            onClick={() => setSubmittedQuoteId(null)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all"
          >
            {t('continueShopping')}
          </Link>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  // If empty, show empty state
  if (items.length === 0) {
    return (
      <div className="py-24 text-center space-y-5 max-w-lg mx-auto rounded-3xl glass-card border border-white/10 p-8 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-200">Your Quote Cart is Empty</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {t('emptyMessage')}
        </p>
        <div className="pt-2">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20"
          >
            <span>{t('continueShopping')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Bill of Materials Table (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-base sm:text-lg text-white font-mono">
                {t('billOfMaterials')}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                {items.length} items ({totalUnits} units)
              </span>
            </div>

            <button
              onClick={clearCart}
              className="text-xs font-mono text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('clearCart')}</span>
            </button>
          </div>

          {/* Items List */}
          <div className="divide-y divide-white/5 space-y-4">
            {enrichedItems.map((item) => (
              <div
                key={item.id}
                className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                {/* Photo & Model info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-16 h-16 rounded-xl bg-zinc-900 overflow-hidden shrink-0 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                      {item.brand}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-zinc-100 truncate">
                      {item.modelNo}
                    </h3>

                    {/* Price & Discount chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono">
                      {item.effectiveUnitPrice ? (
                        <>
                          <span className="text-cyan-300 font-bold">
                            ${item.effectiveUnitPrice.toLocaleString()} / unit
                          </span>
                          {item.discountPercent && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800 flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" />
                              <span>{item.discountPercent}% bulk tier</span>
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-amber-400/90 font-sans text-xs">
                          Custom quote required
                        </span>
                      )}
                    </div>

                    {/* MOQ Warning if violated */}
                    {!item.satisfiesMoq && (
                      <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{t('moqWarning', { moq: item.moq })}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.moq - item.quantity)}
                          className="underline hover:text-amber-300 ml-1"
                        >
                          Set to {item.moq}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stepper & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-zinc-950 rounded-xl border border-white/10 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 text-zinc-400 hover:text-white"
                      title="Fewer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold text-zinc-200 px-2.5">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 text-zinc-400 hover:text-white"
                      title="More"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[5rem]">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      {t('total')}
                    </div>
                    <div className="font-mono text-xs font-bold text-zinc-100">
                      {item.lineTotal ? (
                        <span className="text-cyan-400">${item.lineTotal.toLocaleString()}</span>
                      ) : (
                        <span className="text-amber-400/90 text-[11px]">Quote</span>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                    title={t('remove')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotals Box */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs">
            {listedSubtotal > 0 && (
              <div className="flex justify-between items-center text-zinc-200">
                <span className="font-mono">{t('listedSubtotal')}</span>
                <span className="font-mono font-bold text-base text-cyan-400">
                  ${listedSubtotal.toLocaleString()}
                </span>
              </div>
            )}
            {customQuoteCount > 0 && (
              <div className="flex items-center justify-between text-amber-300 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{t('customQuoteItems', { count: customQuoteCount })}</span>
                </div>
                <span>Factory Quote Required</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Contact Options */}
        <div className="p-5 rounded-2xl glass-card border border-white/5 space-y-3">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">
            {t('directContact')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send BOM via WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(formatWeChatMessage(items, name, notes));
                  setWeChatCopied(true);
                  setTimeout(() => setWeChatCopied(false), 3000);
                }
                if (onOpenWeChat) onOpenWeChat();
              }}
              className="py-3 px-4 rounded-xl bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{weChatCopied ? 'Message Copied to Clipboard!' : 'Copy WeChat Inquiry Message'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Formal RFQ Form (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <form
          onSubmit={handleSubmitQuote}
          className="p-6 rounded-3xl glass-card border border-white/10 space-y-4"
        >
          <div className="space-y-1 border-b border-white/10 pb-3">
            <h3 className="font-bold text-base text-white font-mono flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Submit Formal RFQ</span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Our engineering sales team will verify inventory and issue an official proforma invoice.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                {t('name')} *
              </label>
              <input
                id="rfq-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Smith"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                {t('email')} *
              </label>
              <input
                id="rfq-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.smith@robotics-lab.edu"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  {t('company')}
                </label>
                <input
                  id="rfq-company-input"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Autonomous Fleet Inc."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  {t('country')} *
                </label>
                <input
                  id="rfq-country-input"
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States, Germany..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  {t('timeline')}
                </label>
                <select
                  id="rfq-timeline-select"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="Immediate (1–2 weeks)">Immediate (1–2 weeks)</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="Within 3 months">Within 3 months</option>
                  <option value="Budgeting & Planning">Budgeting & Planning</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  {t('preferredContactMethod')}
                </label>
                <select
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="wechat">WeChat</option>
                </select>
              </div>
            </div>

            {(preferredContact === 'whatsapp' || preferredContact === 'wechat') && (
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  {preferredContact === 'whatsapp' ? 'WhatsApp Phone Number' : 'WeChat ID / Phone'} *
                </label>
                <input
                  type="text"
                  required
                  value={contactHandle}
                  onChange={(e) => setContactHandle(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                {t('notes')}
              </label>
              <textarea
                id="rfq-notes-textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Include custom voltage requirements, secondary development needs, or customs documentation specifications."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <button
              id="rfq-submit-btn"
              type="submit"
              disabled={isSubmitting || !allMoqSatisfied}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-600/25 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Dispatching RFQ...' : t('sendQuoteRequest')}</span>
            </button>
          </div>

          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Guaranteed 24-hour SLA response by robotics application engineers.</span>
          </div>
        </form>
      </div>
    </div>
  );
};
