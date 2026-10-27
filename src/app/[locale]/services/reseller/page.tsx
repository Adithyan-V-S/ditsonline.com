import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ResellerApplicationForm } from '@/components/services/ResellerApplicationForm';
import {
  Users2,
  ShieldCheck,
  TrendingUp,
  Award,
  ChevronRight,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authorized Trade Reseller Program · DITS Online',
  description:
    'Join our global network of authorized robotics distributors. Enjoy wholesale margin structures, direct manufacturer warranties, demo hardware loaners, and territory protection.',
};

interface ResellerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResellerServicePage({ params }: ResellerPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tiers = [
    {
      name: 'Registered Partner',
      annual: '< $50,000 USD',
      margin: '15% Margin',
      benefits: [
        'Access to wholesale price list',
        'Direct factory drop-shipping',
        'Standard email & WhatsApp SLA',
      ],
    },
    {
      name: 'Silver Distributor',
      annual: '$50,000 – $200,000 USD',
      margin: '22% Margin',
      benefits: [
        '30-day payment term options',
        'Discounted showroom demo units',
        'Direct application engineer support',
      ],
      popular: true,
    },
    {
      name: 'Gold Enterprise',
      annual: '$200,000 – $1,000,000 USD',
      margin: '28% Margin',
      benefits: [
        'Marketing MDF co-op budget',
        'Territory lead redistribution',
        'On-site field training for staff',
      ],
    },
    {
      name: 'Platinum Exclusive',
      annual: '> $1,000,000 USD',
      margin: '35% Margin',
      benefits: [
        'Exclusive country/regional rights',
        'OEM custom branding options',
        'Dedicated VIP channel director',
      ],
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Breadcrumb & Hero */}
      <div className="space-y-4">
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <Link href="/services" className="hover:text-cyan-400 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-rose-400">Reseller Program</span>
        </nav>

        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/40 text-rose-300 font-mono text-xs font-semibold">
              <Users2 className="w-3.5 h-3.5" />
              <span>Global Distributor & Trade Partner Network</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Authorized Reseller Program
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Expand your regional robotics business with verified direct hardware supply, factory warranties, competitive margin tiers, and official manufacturer co-marketing support.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-2 text-rose-400">
              <TrendingUp className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Up to 35%</div>
                <div className="text-[10px] text-zinc-400">Wholesale Margins</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-pink-400">
              <Award className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Territory Rights</div>
                <div className="text-[10px] text-zinc-400">Regional Exclusivity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold">
            Partner Margin Tiers
          </span>
          <h2 className="text-2xl font-bold text-white">Structured for Scalable Growth</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-5 rounded-2xl glass-card border flex flex-col justify-between space-y-4 ${
                tier.popular
                  ? 'border-rose-500/50 bg-rose-950/20 shadow-xl shadow-rose-950/30'
                  : 'border-white/10'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">{tier.name}</h3>
                  {tier.popular && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                      High Growth
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-2xl font-extrabold font-mono text-rose-400">
                    {tier.margin}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    Annual commitment: {tier.annual}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-zinc-300">
                  {tier.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column: Distributor Value Pillars (Left) & Application Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
              <span>Why Partner With DITS Online</span>
            </h3>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="space-y-1">
                <div className="font-semibold text-white">Direct Factory Access</div>
                <p className="text-zinc-400 text-[11px]">
                  Eliminate multiple layers of domestic middlemen. We work directly with Shenzhen and Hangzhou manufacturing assembly floors to secure priority inventory allocations.
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-white">Complete Spare Parts Pipeline</div>
                <p className="text-zinc-400 text-[11px]">
                  Every robot platform is backed by our full catalogue of 300+ actuators, micro motors, depth cameras, and modular limb assemblies.
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-white">Multilingual Engineering Support</div>
                <p className="text-zinc-400 text-[11px]">
                  Bilingual English and Chinese technical account managers provide bridge documentation, firmware SDK translation, and warranty handling.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-2 text-xs">
            <div className="text-[11px] font-mono text-zinc-400 uppercase font-bold">
              Immediate Channel Contact
            </div>
            <p className="text-zinc-300 text-[11px]">
              For urgent high-volume regional bids or government university tenders:
            </p>
            <div className="font-mono text-rose-400 pt-1">
              channel-partners@ditsonline.com
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ResellerApplicationForm />
        </div>
      </div>
    </div>
  );
}
