'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Play, Eye, X, ArrowRight, Video } from 'lucide-react';
import mediaData from '@/data/media.json';

interface VideoItem {
  id: string;
  title: string;
  titleZh: string;
  category: string;
  categoryZh: string;
  duration: string;
  robotModel: string;
  thumbnail: string;
  videoUrl: string;
  views: string;
  description: string;
}

export const VideosSection: React.FC = () => {
  const t = useTranslations('home');
  const locale = useLocale();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const videos = mediaData.videos as VideoItem[];

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" />
            <span>Field Motion Benchmarks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('videosTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            {t('videosSubtitle')}
          </p>
        </div>
        <Link
          href="/videos"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold group self-start md:self-auto"
        >
          <span>{t('allVideos')} →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setActiveVideo(vid)}
            className="group cursor-pointer rounded-2xl glass-card border border-white/5 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark overlay with Play icon */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/90 group-hover:bg-cyan-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-white">
                  {vid.duration}
                </span>

                {/* Model tag */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-white/10">
                  {vid.robotModel}
                </span>
              </div>

              {/* Text */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>{locale === 'zh' ? vid.categoryZh : vid.category}</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Eye className="w-3 h-3" />
                    <span>{vid.views}</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-zinc-100 group-hover:text-cyan-400 line-clamp-2 transition-colors">
                  {locale === 'zh' ? vid.titleZh : vid.title}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-cyan-400 transition-colors">
                <span>{t('watchVideo')}</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/60">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  {activeVideo.robotModel} · {activeVideo.duration}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {locale === 'zh' ? activeVideo.titleZh : activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Canvas */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {/* Responsive simulated video feed */}
              <div className="text-center space-y-3 p-6">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto animate-pulse">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <div className="text-xs font-mono text-zinc-400 max-w-sm">
                  Motion testing stream connected for {activeVideo.robotModel}.
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Factory Telemetry: 1080p60 · ROS2 Driver Node · RealSense RGB-D Sync
                </div>
              </div>
            </div>

            {/* Footer description */}
            <div className="p-4 bg-zinc-950/80 text-xs text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p>{activeVideo.description}</p>
              <Link
                href="/catalogue"
                onClick={() => setActiveVideo(null)}
                className="shrink-0 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs text-center transition-colors"
              >
                Find Compatible Parts →
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
