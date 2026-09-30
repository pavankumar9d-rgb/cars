"use client";

import React, { useState } from "react";
import { CarColorId, CARS_DATA } from "../car/CarPartMap";
import { Volume2, VolumeX, Sparkles, Activity } from "lucide-react";
import { useLenis } from "@/providers/LenisProvider";
import { audioEngine } from "../threeui/AudioSynthesizer";
import ShinyText from "../react-bits/ShinyText";

interface HeaderProps {
  selectedCar: CarColorId;
  onSelectCar: (id: CarColorId) => void;
  progress: number;
}

export default function Header({ selectedCar, onSelectCar, progress }: HeaderProps) {
  const { scrollTo } = useLenis();
  const [isAudioActive, setIsAudioActive] = useState(false);
  const activeCar = CARS_DATA[selectedCar];

  const handleScrollToCTA = () => {
    if (typeof window !== "undefined") {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollTo(maxScroll);
    }
  };

  const toggleSound = () => {
    const newState = !isAudioActive;
    setIsAudioActive(newState);
    audioEngine.setPlaying(newState);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 py-5 flex items-center justify-between pointer-events-auto">
      {/* Brand Identity & Live Audio Visualizer */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center bg-black/60 backdrop-blur-md shadow-lg group hover:border-blue-400 transition-all">
          <span className="text-xs font-mono font-bold text-white tracking-tighter group-hover:text-blue-400 transition-colors">
            GT
          </span>
        </div>
        <div>
          <div className="text-sm font-display font-bold tracking-widest text-white uppercase flex items-center gap-2">
            <ShinyText text="SHELBY GT500" speed={4} />
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              FASTBACK
            </span>
          </div>
          <div className="text-[10px] font-mono text-white/50 tracking-wider flex items-center gap-2">
            <span>{activeCar.badge}</span>
            <span>•</span>
            <span>{activeCar.year}</span>
          </div>
        </div>
      </div>

      {/* Center Color Swatch Selector */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl">
        {(Object.keys(CARS_DATA) as CarColorId[]).map((id) => {
          const car = CARS_DATA[id];
          const isSelected = selectedCar === id;
          return (
            <button
              key={id}
              onClick={() => onSelectCar(id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-white/20 text-white shadow-[0_0_16px_rgba(255,255,255,0.2)] border border-white/30"
                  : "text-white/40 hover:text-white/90 hover:bg-white/5 border border-transparent"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: car.accentHex }}
              />
              <span className="uppercase font-semibold">{car.name}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Procedural Engine Acoustic Audio */}
        <button
          onClick={toggleSound}
          aria-label={isAudioActive ? "Mute engine acoustics" : "Unmute engine acoustics"}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 ${
            isAudioActive
              ? "bg-blue-500/20 border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              : "bg-black/50 border-white/10 text-white/60 hover:text-white hover:border-white/30"
          } backdrop-blur-md`}
        >
          {isAudioActive ? (
            <>
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest hidden sm:inline">
                428 CI ACTIVE
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono tracking-widest hidden sm:inline">SOUND</span>
            </>
          )}
        </button>

        {/* CTA Inquire Button */}
        <button
          onClick={handleScrollToCTA}
          className="px-5 py-2 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
        >
          COMMISSION
        </button>
      </div>
    </header>
  );
}
