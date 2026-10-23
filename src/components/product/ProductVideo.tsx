'use client';

import React, { useState } from 'react';
import { Play, Video, ExternalLink } from 'lucide-react';

interface ProductVideoProps {
  productName: string;
  modelNo: string;
}

export const ProductVideo: React.FC<ProductVideoProps> = ({
  productName,
  modelNo,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <div className="rounded-2xl glass-card border border-white/5 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-bold text-sm sm:text-base text-zinc-100 font-mono flex items-center gap-2">
          <Video className="w-4 h-4 text-cyan-400" />
          <span>Motion Testing & Field Demonstration</span>
        </h3>
        <span className="text-[11px] font-mono text-cyan-400">
          Official Benchmark
        </span>
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-white/5 flex items-center justify-center">
        {isPlaying ? (
          <div className="w-full h-full flex items-center justify-center bg-black p-6 text-center space-y-2">
            <div>
              <div className="text-cyan-400 font-mono text-xs font-bold mb-1">
                Active Benchmark Feed: {modelNo}
              </div>
              <div className="text-zinc-400 text-xs max-w-sm mx-auto">
                Kinematics stress-test, thermal cycle recording, and payload verification telemetry stream.
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-t from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 flex items-center justify-center shadow-xl shadow-cyan-500/30 hover:scale-110 active:scale-95 transition-all mb-3 group"
              aria-label="Play video demo"
            >
              <Play className="w-7 h-7 fill-current ml-1" />
            </button>
            <div className="font-bold text-sm text-white">{productName} in Motion</div>
            <div className="text-xs text-zinc-400 mt-1 font-mono">
              Click to inspect high-speed actuation and stability benchmarks
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
