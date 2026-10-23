'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { BookOpen, Calendar, Clock, ArrowRight, X } from 'lucide-react';
import mediaData from '@/data/media.json';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
  category: string;
  categoryZh: string;
  readTime: string;
  date: string;
  image: string;
  featuredRobot: string;
}

export const BlogTeaser: React.FC = () => {
  const t = useTranslations('home');
  const locale = useLocale();
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const posts = mediaData.blogPosts as BlogPost[];

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Documentation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('blogTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            {t('blogSubtitle')}
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold group self-start md:self-auto"
        >
          <span>{t('viewAllGuides')} →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            onClick={() => setActiveArticle(post)}
            className="group cursor-pointer rounded-2xl glass-card border border-white/5 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
          >
            <div>
              {/* Photo */}
              <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-400 border border-white/10">
                  {post.featuredRobot}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="text-cyan-400">
                    {locale === 'zh' ? post.categoryZh : post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-zinc-100 group-hover:text-cyan-400 line-clamp-2 transition-colors">
                  {locale === 'zh' ? post.titleZh : post.title}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {locale === 'zh' ? post.summaryZh : post.summary}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-cyan-400 transition-colors">
                <span>{t('readArticle')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Guide Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-xs font-bold border border-cyan-800">
                  {activeArticle.featuredRobot}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {activeArticle.date} · {activeArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white leading-tight">
              {locale === 'zh' ? activeArticle.titleZh : activeArticle.title}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {locale === 'zh' ? activeArticle.summaryZh : activeArticle.summary}
            </p>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-2 text-xs text-zinc-400 leading-relaxed font-mono">
              <div className="text-cyan-400 font-bold uppercase">Engineering Advisory Note</div>
              <p>
                When selecting hardware variants, ensure power supply rails (typically 24V or 48V DC bus) and CAN/EtherCAT network topology match the controller&apos;s IO capability. Request full pinout sheets through the quote cart.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Link
                href="/catalogue"
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
              >
                Explore Hardware →
              </Link>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
