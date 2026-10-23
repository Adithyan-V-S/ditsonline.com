'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Cpu,
  Layers,
  Zap,
  Battery,
  Shield,
  Weight,
  Maximize2,
  Camera,
  Radio,
  Clock,
  Wrench,
} from 'lucide-react';

interface SpecTableProps {
  specs: Record<string, string>;
  modelNo: string;
}

const SPEC_ICONS: Record<string, React.ElementType> = {
  'Dimensions & Weight': Maximize2,
  'Weight': Weight,
  'Degrees of Freedom (DOF)': Layers,
  'Max Payload': Zap,
  'Torque': Wrench,
  'Battery & Power': Battery,
  'Battery Life': Clock,
  'Connectivity': Radio,
  'Compute & CPU': Cpu,
  'Camera / Vision': Camera,
  'Warranty': Shield,
};

export const SpecTable: React.FC<SpecTableProps> = ({ specs, modelNo }) => {
  const prodT = useTranslations('product');
  const specEntries = Object.entries(specs || {});

  return (
    <div className="rounded-2xl glass-card border border-white/5 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-bold text-sm sm:text-base text-zinc-100 font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>{prodT('specs')}</span>
        </h3>
        <span className="text-[11px] font-mono text-zinc-500">
          Model: {modelNo}
        </span>
      </div>

      {specEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {specEntries.map(([key, val]) => {
            const Icon = SPEC_ICONS[key] || Cpu;
            return (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/5 flex items-start gap-3 hover:border-cyan-500/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    {key}
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 mt-0.5 break-words">
                    {val}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 text-xs text-zinc-400 leading-relaxed font-mono">
          Full parametric specification sheet (CAN bus baud rate, kinematics URDF, and STEP 3D CAD files) provided directly upon quote request.
        </div>
      )}
    </div>
  );
};
