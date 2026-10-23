import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { QuoteCartView } from '@/components/cart/QuoteCartView';
import { Link } from '@/i18n/routing';
import { ChevronRight, FileText, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quote Cart & Bill of Materials · DITS Online',
  description:
    'Review your robotics bill of materials, verify minimum order quantities (MOQ), calculate volume tier discounts, and submit formal RFQs directly to DITS engineering sales.',
};

interface QuotePageProps {
  params: Promise<{ locale: string }>;
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('cart');

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Breadcrumb & Heading */}
      <div className="space-y-3">
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <Link href="/catalogue" className="hover:text-cyan-400 transition-colors">
            Catalogue
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-cyan-400">{t('title')}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>BOM & Proforma Quotation</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('title')}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Inspect your Bill of Materials, review MOQ validation, verify tiered volume pricing, and dispatch an official RFQ proforma invoice.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Manufacturer Source</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-4 h-4" />
              <span>24h Turnaround SLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quote Cart BOM & RFQ View */}
      <QuoteCartView />
    </div>
  );
}
