"use client";

import React from "react";
import { CarColorId, CARS_DATA } from "../car/CarPartMap";
import { Maximize2, Minimize2, Cpu, Wrench, Shield, Layers } from "lucide-react";
import SpotlightCard from "../react-bits/SpotlightCard";
import ShinyText from "../react-bits/ShinyText";

interface ExplodedSectionProps {
  selectedCar: CarColorId;
  explodeProgress?: number; // 0 to 1
}

export default function ExplodedSection({ selectedCar, explodeProgress = 0 }: ExplodedSectionProps) {
  const car = CARS_DATA[selectedCar] || CARS_DATA.blue;
  const safeProgress = typeof explodeProgress === "number" && !isNaN(explodeProgress) ? explodeProgress : 0;
  // Calculate separation percentage (peaks at 100% in middle, reassembles to 0%)
  let separationFactor = 0;
  if (safeProgress <= 0.65) {
    separationFactor = safeProgress / 0.65;
  } else if (safeProgress <= 0.78) {
    separationFactor = 1.0;
  } else {
    separationFactor = 1.0 - (safeProgress - 0.78) / 0.22;
  }
  const percentExploded = Math.min(100, Math.max(0, Math.round(separationFactor * 100)));
  const currentExplodeFrame = Math.min(240, Math.max(1, Math.round(separationFactor * 239) + 1));

  return (
    <section id="exploded-section" className="relative w-full h-[350vh] select-none pointer-events-none">
      {/* Sticky Fullscreen HUD Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 sm:p-10 md:p-16 overflow-hidden">
        {/* Top Header */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span className="text-xs font-mono tracking-[0.3em] text-blue-400 uppercase">
                STUDIO EXPLODED SCHEMATIC // {car.badge}
              </span>
            </div>
            <h2 className="text-4xl sm:text-7xl md:text-8xl font-display font-extrabold text-white uppercase tracking-tight">
              <ShinyText text="EXPLODED VIEW" speed={4} />
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-mono text-white/60 tracking-wider">
              HIGH-FIDELITY DECONSTRUCTION // ALL KINEMATIC COMPONENTS SEPARATING ON MECHANICAL VECTORS
            </p>
          </div>

          {/* Real-Time Explosion Indicator */}
          <div className="glass-panel px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-5 pointer-events-auto shadow-2xl backdrop-blur-2xl">
            <div className="w-12 h-12 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
              {percentExploded > 50 ? <Maximize2 className="w-6 h-6 animate-pulse" /> : <Minimize2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
                DECOUPLING FACTOR
              </div>
              <div className="text-2xl font-mono font-bold text-white tracking-wider flex items-center gap-1">
                <span>{percentExploded}%</span>
                <span className="text-xs text-blue-400 font-normal">DISPLACEMENT</span>
              </div>
              <div className="text-[9px] font-mono text-white/40">
                FRAME {String(currentExplodeFrame).padStart(3, "0")} / 240
              </div>
            </div>
          </div>
        </div>

        {/* Floating HUD Callouts Corresponding to the Real Schematic */}
        <div className="relative z-10 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto py-10">
          {/* Left Column Callouts */}
          <SpotlightCard
            spotlightColor="rgba(59, 130, 246, 0.25)"
            className="p-5 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">
                AERODYNAMICS // FASCIA
              </div>
            </div>
            <div className="text-base font-display font-bold text-white">
              Eleanor Hood & Custom Grille
            </div>
            <p className="text-xs text-white/60 mt-1 font-light">
              Ram-air induction scoop separates forward and upward, clearing the intake plenum.
            </p>
            <div className="mt-3 text-[10px] font-mono text-white/40">
              SYSTEM // COMPOSITE HOOD ASSEMBLY
            </div>
          </SpotlightCard>

          {/* Center Prompt */}
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="glass-panel px-5 py-3 rounded-full border border-white/10 shadow-xl">
              <span className="text-xs font-mono text-white/80 tracking-widest uppercase font-semibold">
                SCROLL FORWARD / BACKWARD FOR INSTANT BI-DIRECTIONAL DECONSTRUCTION
              </span>
            </div>
          </div>

          {/* Right Column Callouts */}
          <SpotlightCard
            spotlightColor="rgba(239, 68, 68, 0.25)"
            className="p-5 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div className="text-[10px] font-mono text-red-400 tracking-widest uppercase">
                DRIVETRAIN // CORNERS
              </div>
            </div>
            <div className="text-base font-display font-bold text-white">
              Magstar Wheels & Calipers
            </div>
            <p className="text-xs text-white/60 mt-1 font-light">
              Cast 15-inch multi-spokes and ventilated rotors extend laterally on the wheel hubs.
            </p>
            <div className="mt-3 text-[10px] font-mono text-white/40">
              SYSTEM // WHEEL & ROTOR HUBS
            </div>
          </SpotlightCard>
        </div>

        {/* Bottom Reassembly Guide */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pb-12 flex items-center justify-between text-xs font-mono text-white/40 tracking-wider">
          <span>IMMUTABLE SCHEMATIC BASELINES PRESERVED</span>
          <span>CONTINUE SCROLLING FOR REASSEMBLY & SPECIFICATIONS →</span>
        </div>
      </div>
    </section>
  );
}
