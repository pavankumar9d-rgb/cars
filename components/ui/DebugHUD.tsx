"use client";

import React, { useState, useEffect } from "react";
import { CarColorId, CARS_DATA, PART_EXPLOSION_MAP } from "../car/CarPartMap";

interface DebugHUDProps {
  selectedCar: CarColorId;
  progress: number;
  explosionProgress: number;
  orbitAngle: number;
  currentSection: string;
}

export default function DebugHUD({
  selectedCar,
  progress,
  explosionProgress,
  orbitAngle,
  currentSection,
}: DebugHUDProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle debug HUD with Shift + D
      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-white/40 hover:text-white/80 transition-all select-none"
      >
        DEBUG_3D [Shift+D]
      </button>
    );
  }

  const mappedPartsCount = Object.keys(PART_EXPLOSION_MAP).length;
  const activeCar = CARS_DATA[selectedCar];

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 text-white font-mono text-xs shadow-2xl">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
        <span className="text-blue-400 font-bold tracking-wider">3D ENGINE TELEMETRY</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/40 hover:text-white text-[10px]"
        >
          [CLOSE]
        </button>
      </div>

      <div className="space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-white/50">SECTION:</span>
          <span className="text-emerald-400 uppercase font-bold">{currentSection}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">SCROLL PROGRESS:</span>
          <span>{(progress * 100).toFixed(1)}% ({progress.toFixed(3)})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">EXPLOSION STAGE:</span>
          <span className="text-amber-400">{(explosionProgress * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">ORBIT ANGLE:</span>
          <span>{((orbitAngle * 180) / Math.PI).toFixed(0)}°</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">SELECTED VEHICLE:</span>
          <span className="text-blue-400 font-bold uppercase">{activeCar.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">ACTIVE GLB:</span>
          <span className="text-[10px] text-white/70 truncate max-w-[140px]">{activeCar.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">MAPPED NODES:</span>
          <span>{mappedPartsCount} kinematic parts</span>
        </div>
      </div>
    </div>
  );
}
