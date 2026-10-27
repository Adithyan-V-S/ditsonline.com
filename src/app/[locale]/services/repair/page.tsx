import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ServiceInquiryForm } from '@/components/services/ServiceInquiryForm';
import {
  Wrench,
  ShieldCheck,
  RotateCcw,
  Cpu,
  ChevronRight,
  CheckCircle2,
  Activity,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Robotics Maintenance & Joint Calibration · DITS Online',
  description:
    'Factory-certified maintenance for humanoid robots and quadruped chassis. Harmonic actuator spline replacement, joint zero-point calibration, motor stator rewind, and 180-day warranty.',
};

interface RepairPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RepairServicePage({ params }: RepairPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const capabilities = [
    {
      title: 'Harmonic Drive & Gearbox Overhaul',
      desc: 'Precision replacement of strain wave gear flexsplines, circular splines, and cross roller bearings with zero backlash tolerances.',
      icon: RotateCcw,
    },
    {
      title: 'Optical Encoder Zero-Point Calibration',
      desc: 'Dual magnetic and absolute optical encoder re-alignment, kinematic offset correction, and CAN-FD / EtherCAT bus diagnostic verification.',
      icon: Activity,
    },
    {
      title: 'Motor Stator & Driver Repair',
      desc: 'BLDC frameless torque motor stator rewinds, hall sensor matrix repair, and GaN/MOSFET driver board inspection.',
      icon: Cpu,
    },
    {
      title: '180-Day Post-Service Warranty',
      desc: 'All serviced actuators and limbs receive a full factory diagnostic bench test certificate and a 180-day hardware warranty.',
      icon: ShieldCheck,
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
          <span className="text-amber-400">Maintenance & Repair</span>
        </nav>

        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/40 text-amber-300 font-mono text-xs font-semibold">
              <Wrench className="w-3.5 h-3.5" />
              <span>Certified Actuator & Robot Overhaul</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Maintenance & Calibration
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Factory-grade repair and diagnostic services for quadruped dogs, humanoid biped joints, harmonic drive modules, and dexterous robot hands.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">180 Days</div>
                <div className="text-[10px] text-zinc-400">Repair Warranty</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              <Zap className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Factory Tools</div>
                <div className="text-[10px] text-zinc-400">OEM Diagnostics</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {capabilities.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="p-5 rounded-2xl glass-card border border-white/10 hover:border-amber-500/40 transition-colors space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">{c.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 2-Column: Diagnostic Process & Intake Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Diagnostic & Intake Protocol</span>
            </h3>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                <div className="font-semibold text-white">Step 1: Telemetry & Video Review</div>
                <p className="text-zinc-400 text-[11px]">
                  Submit fault symptoms, error codes (e.g. overcurrent, phase imbalance, thermal cut-off), or joint movement clips.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                <div className="font-semibold text-white">Step 2: RMA Shipping Authorization</div>
                <p className="text-zinc-400 text-[11px]">
                  Receive return merchandise authorization (RMA) shipping documentation to our closest authorized service depot.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                <div className="font-semibold text-white">Step 3: Factory Bench Testing & Dispatch</div>
                <p className="text-zinc-400 text-[11px]">
                  Rigorous torque dyno testing, thermal imaging check, zero-backlash verification, and return shipment.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ServiceInquiryForm
            serviceType="repair"
            accentColor="amber"
            title="Request Equipment Repair & Calibration Intake"
            subtitle="Submit details regarding damaged actuator joints, quadruped legs, or sensor communication errors."
          />
        </div>
      </div>
    </div>
  );
}
