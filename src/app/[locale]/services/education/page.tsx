import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ServiceInquiryForm } from '@/components/services/ServiceInquiryForm';
import {
  GraduationCap,
  BookOpen,
  Code2,
  Cpu,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Academic & Research Robotics Packages · DITS Online',
  description:
    'Dedicated support for university robotics laboratories, PhD research teams, and STEM education. Grant procurement documentation, ROS 2 packages, and academic volume discounts.',
};

interface EducationPageProps {
  params: Promise<{ locale: string }>;
}

export default async function EducationServicePage({ params }: EducationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const academicKits = [
    {
      title: 'Embodied AI & Humanoid Research Cluster',
      tag: 'Tier 1 Universities',
      desc: 'Complete package with Unitree G1 / AgiBot biped, dual depth cameras, high-power compute docks, and sim-to-real reinforcement learning scripts.',
      features: ['Pre-configured ROS 2 Humble/Iron', 'MuJoCo & Isaac Sim URDF Assets', 'Sim-to-Real Policy Transfer Guides'],
    },
    {
      title: 'Autonomous Mobile & Quadruped Lab',
      tag: 'Undergraduate & Masters',
      desc: 'Unitree Go2 quadruped platform with 4D LiDAR mapping, SLAM spatial navigation stacks, and Python locomotion SDK.',
      features: ['3D Point Cloud Processing Stack', 'Waypoint Navigation Software', 'Multi-Robot Fleet Telemetry'],
    },
    {
      title: 'Manipulation & Dexterous Hands Setup',
      tag: 'Robotics & Control Labs',
      desc: 'Collaborative arm paired with 6 DoF tactile sensor hands, force feedback impedance control, and teaching pendants.',
      features: ['Force-Torque Teleoperation', 'Object Grasping Benchmark Datasets', 'Open-Source Python Controller API'],
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
          <span className="text-emerald-400">Academic & Research Kits</span>
        </nav>

        <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 font-mono text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>University & Research Lab Partner</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Academic & Research Kits
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Equipping robotics faculties, PhD research groups, and innovation centers with verified hardware, research grant procurement documentation, and open-source simulation assets.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-2 text-emerald-400">
              <Award className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Grant Ready</div>
                <div className="text-[10px] text-zinc-400">Procurement Quotes</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-teal-400">
              <Code2 className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">ROS 2 / Sim</div>
                <div className="text-[10px] text-zinc-400">Isaac & MuJoCo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {academicKits.map((kit) => (
          <div
            key={kit.title}
            className="p-6 rounded-3xl glass-card border border-white/10 hover:border-emerald-500/40 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono text-[10px] font-bold">
                {kit.tag}
              </span>
              <h3 className="text-base font-bold text-white">{kit.title}</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">{kit.desc}</p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-white/5 text-[11px] text-zinc-300">
              {kit.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column: Academic Procurement Support & Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>University Grant & Tender Assistance</span>
            </h3>

            <div className="space-y-3 text-xs text-zinc-300">
              <p className="text-zinc-400 leading-relaxed">
                Academic procurement often requires specialized vendor setup, sole-source justification letters, formal proforma quotes in USD or EUR, and specific delivery invoicing.
              </p>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Official University Vendor Registrations</span>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sole-Source Justification Documentation</span>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Educational Tax-Exempt Invoicing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ServiceInquiryForm
            serviceType="education"
            accentColor="emerald"
            title="Academic & Research Lab Package Inquiry"
            subtitle="Provide your department details, funding cycle timeline, or curriculum requirements."
          />
        </div>
      </div>
    </div>
  );
}
