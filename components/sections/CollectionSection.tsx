"use client";

import React, { useRef, useEffect } from "react";
import { CarColorId, CARS_DATA } from "../car/CarPartMap";
import { Check, ArrowRight, RotateCw, Eye, Sparkles } from "lucide-react";
import { useLenis } from "@/providers/LenisProvider";
import ShinyText from "../react-bits/ShinyText";

interface CollectionSectionProps {
  selectedCar: CarColorId;
  onSelectCar: (id: CarColorId) => void;
  onOpen360Studio?: (id: CarColorId) => void;
  hasUserSelectedCar?: boolean;
}

const CAR_KEYS: CarColorId[] = ["blue", "green", "red", "white"];

function CardRotatingPreview({ carId, accentHex }: { carId: CarColorId; accentHex: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.defaultMuted = true;
      v.muted = true;
      const p = v.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    }
  }, []);

  return (
    <div className="relative w-full h-44 sm:h-48 md:h-52 rounded-xl overflow-hidden bg-[#030407] border border-white/10 flex items-center justify-center my-3 group-hover:border-white/30 transition-all shadow-inner">
      {/* 360 Rotating MP4 Loop */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-contain filter contrast-105 brightness-105 group-hover:scale-105 transition-transform duration-500"
        src={`/assets/rotate/360_${carId}.mp4`}
      />
      {/* 360 Active Pill */}
      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[9px] font-mono text-white/80 flex items-center gap-1.5 shadow-md">
        <RotateCw className="w-2.5 h-2.5 animate-spin" style={{ color: accentHex, animationDuration: "5s" }} />
        <span className="tracking-wider font-semibold">360° LIVE</span>
      </div>
    </div>
  );
}

export default function CollectionSection({
  selectedCar,
  onSelectCar,
  onOpen360Studio,
  hasUserSelectedCar = false,
}: CollectionSectionProps) {
  const { scrollTo } = useLenis();

  const handleCarSelectAndScroll = (id: CarColorId) => {
    onSelectCar(id);
    if (typeof window !== "undefined") {
      const ctaEl = document.getElementById("cta-section");
      if (ctaEl) {
        scrollTo(ctaEl.offsetTop);
      } else {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        scrollTo(maxScroll);
      }
    }
  };

  return (
    <section
      id="collection-section"
      className="relative w-full min-h-screen flex flex-col justify-between p-6 sm:p-10 md:p-16 select-none pointer-events-none"
    >
      {/* Header with Luxury Brand Typography */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            <span className="text-xs font-mono tracking-[0.3em] text-blue-400 uppercase">
              SELECT FINISH // 04 BESPOKE SPECIFICATIONS
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-white uppercase tracking-wider">
            <ShinyText text="THE COLLECTION" speed={4} />
          </h2>
        </div>

        <div className="glass-panel px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-mono text-white/80 tracking-widest uppercase">
            CLICK ANY SPEC TO ACTIVATE CAR ON STAGE
          </span>
        </div>
      </div>

      {/* Clean Stationary 4-Card Luxury Showroom Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-8 pointer-events-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {CAR_KEYS.map((id) => {
            const car = CARS_DATA[id];
            const isSelected = selectedCar === id && hasUserSelectedCar;

            return (
              <div
                key={id}
                onClick={() => onSelectCar(id)}
                className={`p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between border cursor-pointer backdrop-blur-2xl shadow-2xl group ${
                  isSelected
                    ? "border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.35)] scale-[1.02] bg-[#0c1018]/95 ring-2 ring-blue-500/50"
                    : "border-white/15 hover:border-white/40 bg-[#080a0f]/85 hover:bg-[#0c0f16]/95 hover:scale-[1.01]"
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: car.accentHex }}
                      />
                      <span className="text-xs font-mono font-bold uppercase text-white">
                        {car.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 tracking-wider">
                      {car.year} GT500
                    </span>
                  </div>

                  {/* 360 Degree Rotating Car Video inside Card */}
                  <CardRotatingPreview carId={car.id} accentHex={car.accentHex} />

                  <div className="text-sm font-mono text-blue-400 tracking-wider font-semibold">
                    {car.badge}
                  </div>
                  <div className="text-[11px] text-white/50 mt-1 font-mono line-clamp-2 leading-relaxed">
                    {car.colorName}
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center gap-2">
                  {/* 360 Inspect Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCar(id);
                      onOpen360Studio?.(id);
                    }}
                    className="flex-1 py-2 px-2.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-[10px] font-mono tracking-wider text-white uppercase flex items-center justify-center gap-1.5 transition-all hover:border-blue-400"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>360° ORBIT</span>
                  </button>

                  {/* Select / Commission Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCarSelectAndScroll(id);
                    }}
                    className={`py-2 px-3 rounded-lg text-[10px] font-mono tracking-wider uppercase font-bold flex items-center gap-1 transition-all ${
                      isSelected
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "border border-white/20 bg-white/5 hover:bg-white/15 text-white/90 hover:border-white/50"
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    <span>{isSelected ? "ACTIVE" : "SELECT"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pb-8 flex items-center justify-between text-xs font-mono text-white/40 tracking-wider">
        <span>CLICK ANY FINISH TO ACTIVATE • &apos;360° ORBIT&apos; TO INTERACTIVELY ROTATE</span>
        <span>CONTINUE SCROLLING FOR POWERTRAIN & CHASSIS MATRIX ↓</span>
      </div>
    </section>
  );
}
