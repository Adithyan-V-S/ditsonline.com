'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Cpu, ShieldCheck, Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const servT = useTranslations('services');
  const locale = useLocale();

  return (
    <footer className="bg-zinc-950 border-t border-white/10 text-zinc-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white">
                DITS<span className="text-cyan-400">ONLINE</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {t('tagline')}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Direct Supply Chain</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  {navT('home')}
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-cyan-400 transition-colors">
                  {navT('catalogue')}
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-cyan-400 transition-colors">
                  {navT('videos')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-cyan-400 transition-colors">
                  {navT('blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
              {navT('services')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/rental" className="hover:text-cyan-400 transition-colors">
                  {servT('rentalTitle')}
                </Link>
              </li>
              <li>
                <Link href="/services/education" className="hover:text-cyan-400 transition-colors">
                  {servT('educationTitle')}
                </Link>
              </li>
              <li>
                <Link href="/services/repair" className="hover:text-cyan-400 transition-colors">
                  {servT('repairTitle')}
                </Link>
              </li>
              <li>
                <Link href="/services/reseller" className="hover:text-cyan-400 transition-colors">
                  {servT('resellerTitle')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
              Engineering Support
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="https://wa.me/8613510483282"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cyan-400 text-zinc-300"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+86 135 1048 3282</span>
              </a>
              <div className="flex items-center gap-2 text-zinc-300">
                <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                <span>WeChat: +8613510483282</span>
              </div>
              <a
                href="https://instagram.com/rentobots"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-cyan-400 text-zinc-400"
              >
                <span>Instagram @rentobots</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>{t('rights')}</p>
          <p className="text-[11px] text-zinc-500 text-center md:text-right">
            {t('legal')}
          </p>
        </div>
      </div>
    </footer>
  );
};
