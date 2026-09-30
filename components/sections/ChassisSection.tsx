"use client";

import React from "react";
import { Layers, Shield, Disc, Cpu } from "lucide-react";
import { CarColorId, CARS_DATA } from "../car/CarPartMap";
import SpotlightCard from "../react-bits/SpotlightCard";
import ShinyText from "../react-bits/ShinyText";

interface ChassisSectionProps {
  selectedCar: CarColorId;
}

export default function ChassisSection({ selectedCar }: ChassisSectionProps) {
  const car = CARS_DATA[selectedCar];

  return (
    <section id="chassis-section" className="relative w-full min-h-[130vh] flex flex-col justify-between p-8 md:p-16 select-none pointer-events-none">
      {/* Header */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-mono tracking-[0.3em] text-blue-400 uppercase">
              DECONSTRUCTION 02 // CHASSIS & SUSPENSION
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tight">
            FRAME & DYNAMICS
          </h2>
        </div>

        <div className="glass-panel px-5 py-3 rounded-2xl border border-white/10 max-w-xs shadow-xl">
          <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-1">
            FRAME PLATFORM
          </div>
          <div className="text-sm font-mono font-bold text-white uppercase">
            {car.platform}
          </div>
        </div>
      </div>

      {/* Engineering Callouts with Technical Specs */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pb-16 grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
        <SpotlightCard
          spotlightColor="rgba(59, 130, 246, 0.25)"
          className="p-7 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-1">
              CHASSIS STRUCTURE
            </div>
            <div className="text-xl font-display font-bold text-white uppercase mb-2">
              Reinforced Unibody Subframe
            </div>
            <p className="text-xs font-light text-white/60 leading-relaxed">
              Longitudinal heavy-gauge steel frame rails with cross-member torque boxes providing torsional rigidity under full throttle.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>FOUNDATION // RIGID FRAME</span>
            <span className="text-blue-400 font-bold">TORQUE BOXES</span>
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(168, 85, 247, 0.25)"
          className="p-7 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-1">
              SUSPENSION
            </div>
            <div className="text-xl font-display font-bold text-white uppercase mb-2">
              Independent Front A-Arms
            </div>
            <p className="text-xs font-light text-white/60 leading-relaxed">
              Upper and lower control arms with heavy-duty coil springs and anti-roll stabilizer bar for sharp lateral turn-in.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>GEOMETRY // COIL-OVER-SHOCK</span>
            <span className="text-purple-400 font-bold">SWAY BAR</span>
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(239, 68, 68, 0.25)"
          className="p-7 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5 shadow-inner">
              <Disc className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-red-400 tracking-widest uppercase mb-1">
              WHEELS & BRAKES
            </div>
            <div className="text-xl font-display font-bold text-white uppercase mb-2">
              Magstar Wheels & Disc Rotors
            </div>
            <p className="text-xs font-light text-white/60 leading-relaxed">
              Cast 15-inch Magstar-style multi-spoke wheels fitted with front ventilated disc brakes and high-friction calipers.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>MAGSTAR 15" // VENTILATED</span>
            <span className="text-red-400 font-bold">QUAD PISTON</span>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
