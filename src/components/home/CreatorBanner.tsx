'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export const CreatorBanner: React.FC = () => {
  const t = useTranslations('home');

  const waFeatureUrl =
    'https://wa.me/8613510483282?text=' +
    encodeURIComponent('Hello DITS Online! I am a robotics maker/manufacturer and would like to submit our hardware for listing and distribution.');

  return (
    <section className="py-12 my-8">
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-cyan-950/60 via-zinc-950/90 to-blue-950/60 shadow-2xl">
        {/* Ambient glow dots */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hardware Manufacturer Network</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {t('creatorBannerTitle')}
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            {t('creatorBannerSubtitle')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={waFeatureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-600/25 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('submitHardware')}</span>
            </a>

            <div className="text-xs font-mono text-zinc-400">
              WeChat Hotline: <span className="text-emerald-400 font-bold">+86 135 1048 3282</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
