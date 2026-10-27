import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ServiceInquiryForm } from '@/components/services/ServiceInquiryForm';
import {
  Globe2,
  Truck,
  ShieldCheck,
  Zap,
  PackageCheck,
  ChevronRight,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Global Hardware Distribution & Factory Direct Supply · DITS Online',
  description:
    'Direct factory procurement from leading robotics manufacturers. Volume freight, export customs clearance, hazardous lithium battery logistics, and batch quality assurance.',
};

interface DistributionPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DistributionServicePage({ params }: DistributionPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pillars = [
    {
      title: 'Factory-Direct Pricing',
      desc: 'Tiered wholesale pricing negotiated directly with production floors, bypassing layered domestic export brokers.',
      icon: Zap,
    },
    {
      title: 'Dangerous Goods Logistics',
      desc: 'Certified UN3480/UN3481 hazardous lithium-ion battery air and ocean cargo handling with MSDS and UN38.3 test reports.',
      icon: Truck,
    },
    {
      title: 'End-of-Line QA Inspection',
      desc: 'Physical inspection, serial number verification, cosmetic check, and power-on telemetry logging before export packaging.',
      icon: PackageCheck,
    },
    {
      title: 'Customs & Tariff Management',
      desc: 'Accurate HS code categorization for robotic manipulators and bipedal chassis to optimize international import duties.',
      icon: FileCheck,
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
          <span className="text-cyan-400">Global Distribution</span>
        </nav>

        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 font-mono text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Direct Factory Supply Chain</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Global Hardware Distribution
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              We connect international enterprises, makers, and research labs with verified hardware from top-tier robotics manufacturers, handling everything from factory QA to international customs clearance.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-2 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Factory Floor</div>
                <div className="text-[10px] text-zinc-400">Direct Invoicing</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Truck className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Global Express</div>
                <div className="text-[10px] text-zinc-400">Door-to-Door</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="p-5 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/40 transition-colors space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">{p.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 2-Column: Global Hub Map / Logistics & Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Logistics & Shipping Capabilities</span>
            </h3>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                <div className="font-semibold text-white">Air Freight Express (3–7 Days)</div>
                <p className="text-zinc-400 text-[11px]">
                  DHL Express, FedEx Priority, and dedicated air cargo charters for urgent prototype evaluations.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                <div className="font-semibold text-white">Consolidated LCL / FCL Ocean Cargo</div>
                <p className="text-zinc-400 text-[11px]">
                  Palletized container freight for high-volume commercial deployments with significant cost savings.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                <div className="font-semibold text-white">Custom Wooden Crating & Desiccants</div>
                <p className="text-zinc-400 text-[11px]">
                  ISPM-15 certified heat-treated timber crates with anti-moisture vapor barriers and tilt/impact telemetry indicators.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ServiceInquiryForm
            serviceType="distribution"
            accentColor="cyan"
            title="Direct Factory Supply Chain Inquiry"
            subtitle="Request bulk logistics pricing, export documentation, or container freight quotes."
          />
        </div>
      </div>
    </div>
  );
}
