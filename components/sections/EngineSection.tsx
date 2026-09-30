"use client";

import React from "react";
import { Zap, Gauge, Flame, Award } from "lucide-react";
import { CarColorId, CARS_DATA } from "../car/CarPartMap";
import SpotlightCard from "../react-bits/SpotlightCard";
import ShinyText from "../react-bits/ShinyText";
import CountUp from "../react-bits/CountUp";

interface EngineSectionProps {
  selectedCar: CarColorId;
}

export default function EngineSection({ selectedCar }: EngineSectionProps) {
  const car = CARS_DATA[selectedCar];

  return (
    <section id="powertrain-section" className="relative w-full min-h-[130vh] flex flex-col justify-between p-8 md:p-16 select-none pointer-events-none">
      {/* Header */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-mono tracking-[0.3em] text-blue-400 uppercase">
              DECONSTRUCTION 01 // POWERTRAIN
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tight">
            ENGINE & DRIVETRAIN
          </h2>
        </div>

        <div className="glass-panel px-5 py-3 rounded-2xl border border-white/10 max-w-xs shadow-xl">
          <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-1">
            CORE DISPLACEMENT
          </div>
          <div className="text-xl font-mono font-bold text-white uppercase flex items-center gap-2">
            <CountUp to={428} duration={2.5} className="text-blue-400 font-bold" />
            <span>COBRA JET V8</span>
          </div>
        </div>
      </div>

      {/* Engineering Callout Cards */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pb-16 grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
        <SpotlightCard
          spotlightColor="rgba(59, 130, 246, 0.25)"
          className="p-7 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 shadow-inner">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-1">
              POWERTRAIN
            </div>
            <div className="text-xl font-display font-bold text-white uppercase mb-2">
              428 Cobra Jet Block
            </div>
            <p className="text-xs font-light text-white/60 leading-relaxed">
              Cast-iron high-nodular block casting engineered with reinforced main bearing webs and optimized oiling galleries.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>DISPLACEMENT // 428 CI</span>
            <span className="text-blue-400 font-bold">FE BIG-BLOCK</span>
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.25)"
          className="p-7 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 shadow-inner">
              <Flame className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-1">
              INDUCTION
            </div>
            <div className="text-xl font-display font-bold text-white uppercase mb-2">
              Dual-Plane Aluminum Intake
            </div>
            <p className="text-xs font-light text-white/60 leading-relaxed">
              Tuned runner lengths optimized for rapid vacuum response and balanced air-fuel distribution across cylinders.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>HIGH-VACUUM PLENUM</span>
            <span className="text-emerald-400 font-bold">ALUMINUM</span>
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.25)"
          className="p-7 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 shadow-inner">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-amber-400 tracking-widest uppercase mb-1">
              TRANSMISSION
            </div>
            <div className="text-xl font-display font-bold text-white uppercase mb-2">
              Toploader 4-Speed
            </div>
            <p className="text-xs font-light text-white/60 leading-relaxed">
              Rugged all-synchromesh manual gearbox designed to handle extreme torque with short, positive shift throws.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>MANUAL LINKAGE</span>
            <span className="text-amber-400 font-bold">CLOSE RATIO</span>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
