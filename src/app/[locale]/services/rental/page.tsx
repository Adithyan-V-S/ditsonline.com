import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { RentalInquiryForm } from '@/components/services/RentalInquiryForm';
import {
  CalendarDays,
  Bot,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Truck,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Robot Fleet Rental & Short-Term Leasing · DITS Online',
  description:
    'Deploy humanoid biped robots and quadruped robot dogs for tech expos, TV film production, academic testing, and pilot deployments with certified field technicians.',
};

interface RentalPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RentalServicePage({ params }: RentalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const fleetRoster = [
    {
      name: 'Unitree Go2 (With 4D LiDAR)',
      category: 'Quadruped Robot Dog',
      price: 'From $450 / day',
      desc: 'High agility terrain navigation, autonomous obstacle avoidance, companion demos, and camera payloads.',
      tag: 'Most Popular',
      specs: 'Speed: 3.5 m/s · Payload: 5 kg · Battery: 2-3 hours per swap',
    },
    {
      name: 'Unitree G1 Humanoid',
      category: 'Full-Size Bipedal Humanoid',
      price: 'From $1,800 / day',
      desc: 'Dynamic walking balance, 23–43 DoF, real-time imitation learning, stage performances, and high-impact VIP receptions.',
      tag: 'Flagship Humanoid',
      specs: 'Height: 132 cm · Weight: 35 kg · DoF: Up to 43 with DexHands',
    },
    {
      name: 'AgiBot X2 Research Biped',
      category: 'Humanoid Biped Platform',
      price: 'From $1,500 / day',
      desc: 'Modular research humanoid with 30 DoF, dexterous manipulation arms, and open-source ROS 2 control hooks.',
      tag: 'Research & Labs',
      specs: 'Height: 131 cm · Weight: 39 kg · Computing: Dual Intel/Orin',
    },
    {
      name: 'Booster T2 Industrial Humanoid',
      category: 'Heavy-Duty Humanoid Chassis',
      price: 'Custom Quote',
      desc: 'Robust torque joint modules with high payload arms for factory automation trials and outdoor agility demonstrations.',
      tag: 'Enterprise Tier',
      specs: 'Height: 140 cm · Weight: 43 kg · Arm Payload: 5 kg',
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
          <span className="text-purple-400">Robot Fleet Rental</span>
        </nav>

        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/40 text-purple-300 font-mono text-xs font-semibold">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Turnkey Event & Research Leasing</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Robot Fleet Rental & Leasing
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Deploy state-of-the-art humanoid bipeds and quadruped robot dogs for international exhibitions, commercial video shoots, academic evaluation, and pilot demonstrations without full capital expenditure.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-2 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Full Insurance</div>
                <div className="text-[10px] text-zinc-400">Transit & Operation</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-400">
              <Users className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Pilot On-Site</div>
                <div className="text-[10px] text-zinc-400">Certified Engineers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Fleet Cards (Left) and Booking Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Available Fleet Roster (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span>Available Rental Fleet Models</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Units are rigorously flight-checked, calibrated with fresh battery sets, and packed in reinforced ATA flight cases.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {fleetRoster.map((item) => (
              <div
                key={item.name}
                className="p-5 rounded-2xl glass-card border border-white/10 hover:border-purple-500/40 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-purple-300 px-2 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40">
                      {item.price}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {item.desc}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>{item.specs}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Rental Inclusions Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/50 via-zinc-900/60 to-zinc-950/80 border border-purple-800/30 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Every Rental Package Includes</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Heavy-duty pelican/ATA flight case with custom foam shock absorbers.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>2x hot-swappable OEM high-discharge battery packs + rapid charging dock.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Pre-configured handheld joystick controller + tablet telemetry dashboard.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Comprehensive damage waiver and international ATA Carnet customs documents.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Form (5 cols) */}
        <div className="lg:col-span-5">
          <RentalInquiryForm />
        </div>
      </div>
    </div>
  );
}
