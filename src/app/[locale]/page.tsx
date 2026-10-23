import React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Bot,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { getCategories } from '@/lib/api/categories';
import { getFeaturedProducts } from '@/lib/api/products';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { FeaturedParts } from '@/components/home/FeaturedParts';
import { ServiceTiles } from '@/components/home/ServiceTiles';
import { VideosSection } from '@/components/home/VideosSection';
import { BlogTeaser } from '@/components/home/BlogTeaser';
import { CreatorBanner } from '@/components/home/CreatorBanner';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('hero');
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-purple-600/15 blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wide shadow-lg shadow-cyan-950/50">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>{t('badge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            {t('title')}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              id="hero-explore-catalogue-btn"
              href="/catalogue"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-cyan-600/25 flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>{t('exploreCatalogue')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              id="hero-request-quote-btn"
              href="/services/rental"
              className="px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-200 font-semibold text-xs sm:text-sm transition-colors"
            >
              <span>{t('requestQuote')}</span>
            </Link>
          </div>

          {/* Key Value Metrics */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-4 rounded-2xl glass-card border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-white">300+ Parts</div>
                <div className="text-[11px] text-zinc-400">{t('statsRobots')}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-white">Direct Source</div>
                <div className="text-[11px] text-zinc-400">{t('statsSupply')}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-white">24/7 Support</div>
                <div className="text-[11px] text-zinc-400">{t('statsSupport')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TILES (Humanoid, Quadruped Dog, Arm, Hands, Toy Robot, Controllers, Cameras, MicroMotor, Joint Modules, CNC Parts, Actuators) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryTiles categories={categories} />
      </div>

      {/* 3. FEATURED ROBOT PARTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedParts products={featuredProducts} />
      </div>

      {/* 4. SERVICE TILES (Distribution, Rental, Education, Repair, Reseller) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServiceTiles />
      </div>

      {/* 5. VIDEOS: ROBOTS IN MOTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VideosSection />
      </div>

      {/* 6. BLOG: GUIDES AND ROBOT NEWS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogTeaser />
      </div>

      {/* 7. CREATOR & SUPPLIER SUBMISSION BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CreatorBanner />
      </div>
    </div>
  );
}
