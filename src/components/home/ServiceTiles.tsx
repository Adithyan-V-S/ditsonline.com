'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Globe2,
  CalendarDays,
  GraduationCap,
  Wrench,
  Users2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ServiceTiles: React.FC = () => {
  const t = useTranslations('home');
  const servT = useTranslations('services');
  const locale = useLocale();

  const services = [
    {
      id: 'distribution',
      title: locale === 'zh' ? '全球硬件分销与直供' : 'Global Distribution',
      desc:
        locale === 'zh'
          ? '直连各大具身智能与机器人源头厂商，为全球创客、实验室及商业客户提供批量采购与国际清关支持。'
          : 'Direct link to top-tier robotics manufacturers with verified supply chains, customs clearance, and global express shipping.',
      icon: Globe2,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      href: '/services/distribution',
      badge: 'Supply Chain',
    },
    {
      id: 'rental',
      title: servT('rentalTitle'),
      desc: servT('rentalDesc'),
      icon: CalendarDays,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
      href: '/services/rental',
      badge: 'Flexible Fleet',
    },
    {
      id: 'education',
      title: servT('educationTitle'),
      desc: servT('educationDesc'),
      icon: GraduationCap,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      href: '/services/education',
      badge: 'Academic & Lab',
    },
    {
      id: 'repair',
      title: servT('repairTitle'),
      desc: servT('repairDesc'),
      icon: Wrench,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      href: '/services/repair',
      badge: 'Engineering Care',
    },
    {
      id: 'reseller',
      title: servT('resellerTitle'),
      desc: servT('resellerDesc'),
      icon: Users2,
      color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
      href: '/services/reseller',
      badge: 'Trade Portal',
    },
  ];

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
            Enterprise Solutions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('servicesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            {t('servicesSubtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {services.map((serv) => {
          const Icon = serv.icon;
          return (
            <Link
              key={serv.id}
              href={serv.href}
              className="group p-5 rounded-2xl glass-card border border-white/5 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${serv.color} flex items-center justify-center border`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-white/5">
                    {serv.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-zinc-100 group-hover:text-cyan-400 transition-colors">
                  {serv.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-3">
                  {serv.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-cyan-400 transition-colors">
                <span>{t('exploreService')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
