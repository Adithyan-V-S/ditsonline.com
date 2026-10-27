import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import {
  Globe2,
  CalendarDays,
  GraduationCap,
  Wrench,
  Users2,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Robotics Lifecycle Services · DITS Online',
  description:
    'Comprehensive B2B robotics lifecycle solutions: robot fleet rentals, academic & research packages, joint module repairs & calibration, factory distribution, and authorized trade reseller program.',
};

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');

  const services = [
    {
      id: 'distribution',
      title: locale === 'zh' ? '全球硬件分销与供应链直供' : 'Global Distribution & Supply Chain',
      badge: 'Direct Supply Chain',
      desc:
        locale === 'zh'
          ? '直通中国顶尖具身智能源头工厂，提供一站式批量采购、国际出口清关与全球空运特快服务。'
          : 'Direct link to top-tier robotics manufacturers with verified supply chains, customs clearance, and global air freight logistics.',
      icon: Globe2,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      href: '/services/distribution',
      features: ['Direct Factory Invoicing', 'Volume Freight Discounts', 'Customs Pre-Clearance'],
    },
    {
      id: 'rental',
      title: t('rentalTitle'),
      badge: 'Flexible Fleet Rental',
      desc: t('rentalDesc'),
      icon: CalendarDays,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
      href: '/services/rental',
      features: ['Daily & Monthly Flexible Rates', 'Certified Flight Technicians', 'Full Transit Insurance'],
    },
    {
      id: 'education',
      title: t('educationTitle'),
      badge: 'Academic & Lab Support',
      desc: t('educationDesc'),
      icon: GraduationCap,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      href: '/services/education',
      features: ['University Grant Procurement', 'ROS 2 & SDK Curriculum Kits', 'Academic Cluster Discounts'],
    },
    {
      id: 'repair',
      title: t('repairTitle'),
      badge: 'Engineering Maintenance',
      desc: t('repairDesc'),
      icon: Wrench,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      href: '/services/repair',
      features: ['Harmonic Actuator Overhaul', 'Zero-Point Calibration', '180-Day Repair Warranty'],
    },
    {
      id: 'reseller',
      title: t('resellerTitle'),
      badge: 'Authorized Channel Partner',
      desc: t('resellerDesc'),
      icon: Users2,
      color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
      href: '/services/reseller',
      features: ['Tiered Distributor Margins', 'Demo Hardware Units', 'Regional Territorial Rights'],
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
          <span className="text-cyan-400">Services</span>
        </nav>

        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Lifecycle Robotics Partner</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Robotics Lifecycle Services
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              From short-term fleet deployment for global exhibitions to factory-authorized joint actuator overhauls, DITS Online bridges the gap between robotics factories and worldwide deployment.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Factory Direct</div>
                <div className="text-[10px] text-zinc-400">Certified Warranty</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Zap className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">24h SLA</div>
                <div className="text-[10px] text-zinc-400">Engineer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((serv) => {
          const Icon = serv.icon;
          return (
            <div
              key={serv.id}
              className="group p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/5 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center border shadow-md ${serv.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
                    {serv.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {serv.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {serv.desc}
                  </p>
                </div>

                {/* Key features bullets */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {serv.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-[11px] text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4">
                <Link
                  href={serv.href}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-2 group-hover:bg-cyan-950/60 group-hover:text-cyan-300 transition-all"
                >
                  <span>Explore Service Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Process Workflow */}
      <div className="p-8 sm:p-10 rounded-3xl glass-card border border-white/10 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            How Our Service Delivery Operates
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Engineering Precision at Every Step
          </h2>
          <p className="text-xs text-zinc-400">
            A standardized, quality-controlled pipeline ensures your robot components and service contracts are executed reliably.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
              01
            </div>
            <div className="font-bold text-sm text-white">Scope & Requirements</div>
            <div className="text-xs text-zinc-400">
              Submit your hardware specifications, event dates, or repair symptoms online or via WhatsApp.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
              02
            </div>
            <div className="font-bold text-sm text-white">Technical Review</div>
            <div className="text-xs text-zinc-400">
              Dedicated robotics engineers verify compatibility, parts availability, and draft custom proformas within 24h.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-800 text-purple-400 font-mono font-bold text-xs flex items-center justify-center">
              03
            </div>
            <div className="font-bold text-sm text-white">Direct Dispatch</div>
            <div className="text-xs text-zinc-400">
              Factory testing, calibration logs, secure crating, and express global door-to-door delivery.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
              04
            </div>
            <div className="font-bold text-sm text-white">Lifecycle Care</div>
            <div className="text-xs text-zinc-400">
              Long-term warranty coverage, firmware update advisories, and spare parts availability guarantees.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
