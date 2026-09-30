"use client";

import React, { useRef, useEffect, useState } from "react";
import { ChevronDown, Activity, Sparkles, ShieldCheck } from "lucide-react";
import { useLenis } from "@/providers/LenisProvider";
import ShinyText from "../react-bits/ShinyText";
import CountUp from "../react-bits/CountUp";

interface AssemblySectionProps {
  assemblyProgress?: number; // 0 to 1
}

export default function AssemblySection({ assemblyProgress = 0 }: AssemblySectionProps) {
  const { scrollTo } = useLenis();

  const handleBegin = () => {
    if (typeof window !== "undefined") {
      scrollTo(window.innerHeight * 4.2);
    }
  };

  const safeProgress = typeof assemblyProgress === "number" && !isNaN(assemblyProgress) ? assemblyProgress : 0;
  const currentFrameNumber = Math.min(240, Math.max(1, Math.round(safeProgress * 239) + 1));
  const completionPercent = Math.round(safeProgress * 100);

  return (
    // Tall 400vh scroll container mapped directly to frames 1-240
    <section id="assembly-section" className="relative w-full h-[400vh] select-none pointer-events-none">
      {/* Sticky Fullscreen HUD Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 sm:p-10 md:p-16 overflow-hidden">
        {/* Top Metadata & Telemetry */}
        <div className="relative z-10 w-full flex items-center justify-between max-w-7xl mx-auto pt-16">
          <div className="flex items-center gap-3 glass-panel-subtle px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-white/80 uppercase">
              CHASSIS BLUEPRINT // GEN-1
            </span>
          </div>

          <div className="flex items-center gap-5 text-[10px] font-mono text-white/50 tracking-widest glass-panel-subtle px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>ASSEMBLY:</span>
              <span className="text-white font-bold">{completionPercent}%</span>
            </div>
            <span>•</span>
            <span className="text-blue-400 font-bold">FRAME {String(currentFrameNumber).padStart(3, "0")} / 240</span>
          </div>
        </div>

        {/* Center Cinematic Editorial Typography */}
        <div className="relative z-10 flex flex-col items-center text-center my-auto px-4">
          <div className="overflow-hidden mb-3">
            <p className="text-xs md:text-sm font-mono tracking-[0.4em] text-blue-400 uppercase">
              ENGINEERED WITHOUT COMPROMISE
            </p>
          </div>

          <div className="overflow-hidden">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-extrabold tracking-tight text-white uppercase drop-shadow-2xl">
              FORM
            </h1>
          </div>
          <div className="overflow-hidden -mt-2 md:-mt-6">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-extrabold tracking-tight uppercase drop-shadow-2xl">
              <ShinyText text="IN MOTION." speed={4} />
            </h1>
          </div>

          <p className="mt-6 max-w-xl text-sm md:text-base font-light text-white/70 tracking-wide leading-relaxed">
            A sculptural convergence of unadulterated American mechanical power, precision unibody balance, and authentic fastback proportions.
          </p>

          <div className="mt-8 flex items-center gap-4 text-[11px] font-mono text-white/40 tracking-widest">
            <span>01 FPV ASSEMBLY</span>
            <span>•</span>
            <span>02 360° ORBIT</span>
            <span>•</span>
            <span>03 PHYSICAL EXPLOSION</span>
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="relative z-10 flex flex-col items-center pb-8">
          <button
            onClick={handleBegin}
            className="pointer-events-auto group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 group-hover:text-blue-400 transition-colors uppercase">
              {assemblyProgress < 0.95 ? "SCROLL TO ASSEMBLE (1 → 240)" : "VEHICLE ASSEMBLED // PROCEED"}
            </span>
            <div className="w-9 h-9 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center group-hover:border-blue-500/50 group-hover:scale-110 transition-all duration-300 shadow-xl">
              <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-blue-400 animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
