'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Bot,
  Activity,
  Cpu,
  Camera,
  Layers,
  Wrench,
  Disc,
  CircleDot,
  Box,
  Gamepad2,
  HandMetal,
  ArrowRight,
} from 'lucide-react';
import { Category } from '../../../contracts/types';

interface CategoryTilesProps {
  categories: Category[];
}

const CATEGORY_META: Record<string, {
  icon: React.ElementType;
  color: string;
  descEn: string;
  descZh: string;
}> = {
  humanoid: {
    icon: Bot,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    descEn: 'Full-body bipedal chassis & research humanoid platforms',
    descZh: '全尺寸双足人形机器人本体与具身智能科研底盘',
  },
  quad: {
    icon: Activity,
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
    descEn: 'All-terrain 4-legged dogs for inspection & agility research',
    descZh: '全地形高机动四足机械狗与巡检科研平台',
  },
  arm: {
    icon: Layers,
    color: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30',
    descEn: 'High-precision collaborative & servo manipulator arms',
    descZh: '高精度工业协作臂与伺服机械臂总成',
  },
  hand: {
    icon: HandMetal,
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    descEn: '5-finger dexterous tactile hands & adaptive grippers',
    descZh: '五指触觉多维灵巧手与自适应工业夹爪',
  },
  toy: {
    icon: Gamepad2,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    descEn: 'AI chess robotics & interactive companion units',
    descZh: '下棋对弈机器人与消费级智能伴宠',
  },
  chip: {
    icon: Cpu,
    color: 'from-teal-500/20 to-cyan-500/20 text-teal-400 border-teal-500/30',
    descEn: 'NVIDIA Jetson carrier boards, NPUs & computing docks',
    descZh: 'NVIDIA Jetson 算力主板、边缘算力坞与控制器',
  },
  cam: {
    icon: Camera,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    descEn: 'Intel RealSense depth cameras & 2-DOF head vision modules',
    descZh: 'Intel RealSense 深度相机与双自由度头部视觉模块',
  },
  motor: {
    icon: Disc,
    color: 'from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30',
    descEn: 'Brushless micro motors, planar stators & drivers',
    descZh: '微型无刷直流电机、扁平电机及高频驱动器',
  },
  joint: {
    icon: CircleDot,
    color: 'from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30',
    descEn: 'Planetary & harmonic integrated joint motor modules',
    descZh: '一体化谐波/行星关节模组与高扭矩电机总成',
  },
  cnc: {
    icon: Box,
    color: 'from-zinc-500/20 to-zinc-600/20 text-zinc-300 border-zinc-500/30',
    descEn: 'Structural leg linkages, aviation alloy & CNC fittings',
    descZh: '航空级铝合金机加工件、四肢连杆与结构件',
  },
  act: {
    icon: Wrench,
    color: 'from-violet-500/20 to-blue-500/20 text-violet-400 border-violet-500/30',
    descEn: 'Flange rotary harmonic actuators & high-torque gearboxes',
    descZh: '高抗冲击法兰谐波执行器与超重载动力减速机',
  },
};

// Target categories specifically ordered for the user
const TARGET_KEYS = [
  'humanoid',
  'quad',
  'arm',
  'hand',
  'toy',
  'chip',
  'cam',
  'motor',
  'joint',
  'cnc',
  'act',
];

export const CategoryTiles: React.FC<CategoryTilesProps> = ({ categories }) => {
  const t = useTranslations('home');
  const locale = useLocale();

  // Filter and order according to TARGET_KEYS
  const displayCats = TARGET_KEYS.map((key) => {
    const found = categories.find((c) => c.key === key);
    return (
      found || {
        id: `cat_${key}`,
        key,
        nameEn: key.toUpperCase(),
        nameZh: key,
        productCount: 10,
      }
    );
  });

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
            Hardware Taxonomy
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('shopByCategory')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            {t('shopByCategorySubtitle')}
          </p>
        </div>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold group self-start md:self-auto"
        >
          <span>{t('viewAllCatalogue', { count: categories.reduce((sum, c) => sum + c.productCount, 0) })}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayCats.map((cat) => {
          const meta = CATEGORY_META[cat.key] || {
            icon: Bot,
            color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
            descEn: 'Industrial robotics hardware',
            descZh: '机器人工业级零部件',
          };
          const Icon = meta.icon;

          return (
            <Link
              key={cat.key}
              href={`/catalogue?category=${cat.key}`}
              className="group relative p-5 rounded-2xl glass-card border flex flex-col justify-between overflow-hidden"
            >
              {/* Top ambient shine */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center border shadow-inner`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-900/90 text-zinc-300 border border-white/10 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-colors">
                    {cat.productCount} parts
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">
                  {locale === 'zh' ? cat.nameZh : cat.nameEn}
                </h3>

                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
                  {locale === 'zh' ? meta.descZh : meta.descEn}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-cyan-400 transition-colors">
                <span>Explore category</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
