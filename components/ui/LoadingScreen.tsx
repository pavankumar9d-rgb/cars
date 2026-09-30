"use client";

import React, { useEffect, useState } from "react";
import ShinyText from "../react-bits/ShinyText";

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setHidden(true), 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050608] transition-opacity duration-600 ${
        progress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center select-none">
        {/* Monogram */}
        <div className="w-12 h-12 rounded-full border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400 font-mono font-bold text-sm tracking-wider mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          GT
        </div>

        <div className="text-[10px] uppercase tracking-[0.4em] text-blue-400 font-mono mb-1">
          AUTOMOTIVE CINEMA
        </div>
        <div className="text-2xl md:text-3xl font-display font-bold tracking-widest text-white mb-6 uppercase">
          <ShinyText text="SHELBY GT500" speed={3} />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-[2px] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-blue-500 transition-all duration-200 ease-out shadow-[0_0_12px_#3b82f6]"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        {/* Telemetry info */}
        <div className="flex justify-between w-full mt-3 text-[10px] font-mono text-white/40 tracking-wider">
          <span>INITIALIZING 120 FPS ENGINE</span>
          <span>{Math.min(100, progress)}%</span>
        </div>
      </div>
    </div>
  );
}
