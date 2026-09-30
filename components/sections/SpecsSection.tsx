"use client";

import React, { useState } from "react";
import { CarColorId, CARS_DATA } from "../car/CarPartMap";
import { CheckCircle2, Shield, Settings, Wrench, Compass, Award, Zap, Disc, Cpu, Flame } from "lucide-react";
import ShinyText from "../react-bits/ShinyText";

interface SpecsSectionProps {
  selectedCar: CarColorId;
}

export default function SpecsSection({ selectedCar }: SpecsSectionProps) {
  const car = CARS_DATA[selectedCar] || CARS_DATA.blue;
  const [isPaused, setIsPaused] = useState(false);

  // Technical systems badges derived from authentic vehicle architecture
  const specsRow1 = [
    { label: "ENGINE ARCHITECTURE", value: "428 Cobra Jet V8 Block", badge: "7.0L V8", icon: Settings },
    { label: "INDUCTION SYSTEM", value: "Dual-Plane Tuned Aluminum", badge: "RAM-AIR", icon: Flame },
    { label: "TRANSMISSION", value: "Toploader 4-Speed Manual", badge: "CLOSE RATIO", icon: Wrench },
    { label: "WHEEL HARDWARE", value: "15-Inch Magstar Cast Alloy", badge: "MAGSTAR", icon: Compass },
    { label: "BRAKE HARDWARE", value: "Ventilated Front Discs", badge: "DISC BRAKES", icon: Disc },
    { label: "CHASSIS PLATFORM", value: "Heavy-Gauge Perimeter Rails", badge: "SUBFRAME", icon: Shield },
    { label: "BODY ARCHITECTURE", value: "Fastback Ram-Air Unibody", badge: "UNIBODY", icon: Cpu },
    { label: "EXTERIOR FINISH", value: `${car.colorName}`, badge: car.name, icon: Award },
  ];

  const specsRow2 = [
    { label: "TORQUE OUTPUT", value: "440 lb-ft @ 3,400 RPM", badge: "440 LB-FT", icon: Zap },
    { label: "BRAKE GEOMETRY", value: "11.3-Inch Vented Rotors", badge: "DUAL CALIPER", icon: CheckCircle2 },
    { label: "REAR DIFFERENTIAL", value: "9-Inch Traction-Lok 3.50:1", badge: "POSITRACTION", icon: Settings },
    { label: "IGNITION SYSTEM", value: "Dual-Point High-Output Spark", badge: "HIGH VOLTAGE", icon: Zap },
    { label: "SUSPENSION", value: "Independent Heavy-Duty Coils", badge: "TRACK TUNED", icon: Shield },
    { label: "EXHAUST ARCHITECTURE", value: "Dual Low-Restriction Headers", badge: "DUAL FLOW", icon: Flame },
    { label: "STEERING SYSTEM", value: "Recirculating Ball 16:1", badge: "COMPETITION", icon: Compass },
    { label: "PROVENANCE", value: "Authentic 1967 GT500 Spec", badge: "ORIGINAL", icon: Award },
  ];

  // Quadruple items to ensure seamless infinite looping without gaps
  const loopRow1 = [...specsRow1, ...specsRow1, ...specsRow1, ...specsRow1];
  const loopRow2 = [...specsRow2, ...specsRow2, ...specsRow2, ...specsRow2];

  return (
    <section
      id="specs-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[110vh] flex flex-col justify-between p-6 sm:p-10 md:p-16 select-none pointer-events-none"
    >
      {/* Header with Luxury Brand Typography */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono tracking-[0.3em] text-blue-400 uppercase">
              INFINITE TECHNICAL MARQUEE // VERIFIED SPECIFICATIONS
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-white uppercase tracking-tight">
            <ShinyText text="SPECIFICATIONS" speed={4} />
          </h2>
        </div>

        <div className="glass-panel px-4 py-2 rounded-full border border-white/10 flex items-center gap-2.5 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono text-white/80 tracking-widest uppercase font-semibold">
            CONTINUOUS STREAMING SYSTEMS CAROUSEL • PAUSE ON HOVER
          </span>
        </div>
      </div>

      {/* Infinite Logo & Systems Carousel Rows */}
      <div className="relative z-10 w-full my-auto py-8 pointer-events-auto overflow-hidden flex flex-col gap-5">
        {/* Track 1: Smooth Left Stream */}
        <div className="relative w-full overflow-hidden mask-gradient-x">
          <div
            className={`flex gap-4 w-max ${isPaused ? "animate-none" : "animate-marquee"}`}
            style={{
              animation: isPaused ? "none" : "marquee-left 32s linear infinite",
            }}
          >
            {loopRow1.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`r1-${idx}`}
                  className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-[#090b10]/85 border border-white/10 backdrop-blur-xl shadow-2xl hover:border-blue-400 hover:bg-[#0e131d]/95 transition-all duration-300 group cursor-pointer flex-shrink-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-mono text-blue-400/90 tracking-wider uppercase font-bold">
                        {item.label}
                      </span>
                      <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-sm font-mono font-bold text-white tracking-wide group-hover:text-blue-200 transition-colors">
                      {item.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Smooth Right Stream (Opposing Direction) */}
        <div className="relative w-full overflow-hidden mask-gradient-x">
          <div
            className={`flex gap-4 w-max ${isPaused ? "animate-none" : "animate-marquee-reverse"}`}
            style={{
              animation: isPaused ? "none" : "marquee-right 36s linear infinite",
            }}
          >
            {loopRow2.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`r2-${idx}`}
                  className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-[#090b10]/85 border border-white/10 backdrop-blur-xl shadow-2xl hover:border-emerald-400 hover:bg-[#0c1618]/95 transition-all duration-300 group cursor-pointer flex-shrink-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-inner">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-mono text-emerald-400/90 tracking-wider uppercase font-bold">
                        {item.label}
                      </span>
                      <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-sm font-mono font-bold text-white tracking-wide group-hover:text-emerald-200 transition-colors">
                      {item.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pb-8 flex items-center justify-between text-xs font-mono text-white/40 tracking-wider">
        <span>MANUFACTURED ACCORDING TO ORIGINAL SHELBY GT500 SPECIFICATION</span>
        <span>FINAL ALLOCATION & INQUIRY →</span>
      </div>

      {/* CSS Keyframes for High-Performance GPU Marquee Animation */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </section>
  );
}
