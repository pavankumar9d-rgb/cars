"use client";

import React, { useRef } from "react";
import { CarColorId, CARS_DATA } from "../car/CarPartMap";
import { RotateCw, MoveHorizontal, Compass, Shield } from "lucide-react";
import ShinyText from "../react-bits/ShinyText";

interface SelectedCarSectionProps {
  selectedCar: CarColorId;
  rotateProgress: number; // 0 to 1
  onDragRotate?: (delta: number) => void;
}

export default function SelectedCarSection({
  selectedCar,
  rotateProgress = 0,
  onDragRotate,
}: SelectedCarSectionProps) {
  const car = CARS_DATA[selectedCar] || CARS_DATA.blue;
  const safeProgress = typeof rotateProgress === "number" && !isNaN(rotateProgress) ? rotateProgress : 0;
  const orbitDegrees = Math.round(safeProgress * 360) % 360;
  const currentRotateFrame = Math.min(240, Math.max(1, Math.round(safeProgress * 239) + 1));

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    startXRef.current = e.clientX;
    onDragRotate?.(deltaX * 0.004);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    startXRef.current = e.touches[0].clientX;
    onDragRotate?.(deltaX * 0.004);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <section
      id="orbit-section"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[300vh] select-none pointer-events-none"
    >
      {/* Sticky Fullscreen HUD Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 sm:p-10 md:p-16 overflow-hidden">
        {/* Top Identity Block */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: car.accentHex }} />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-white/80">
                360° CINEMATIC ORBIT // {car.badge}
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tight">
              <ShinyText text={car.name} speed={3.5} />
            </h2>
            <p className="mt-3 text-sm md:text-base font-light text-white/70 leading-relaxed">
              {car.description}
            </p>
          </div>

          {/* 360 Degree Telemetry Gauge */}
          <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-5 border border-white/10 pointer-events-auto shadow-2xl backdrop-blur-2xl">
            <RotateCw
              className="w-6 h-6 text-blue-400 animate-spin"
              style={{ animationDuration: "10s" }}
            />
            <div>
              <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
                STUDIO AZIMUTH
              </div>
              <div className="text-lg font-mono font-bold text-white tracking-wider">
                {orbitDegrees}° ROTATION
              </div>
              <div className="text-[9px] font-mono text-blue-400">
                FRAME {String(currentRotateFrame).padStart(3, "0")} / 240
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Drag & Spin Center Box */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="relative z-20 w-full max-w-2xl mx-auto h-40 md:h-56 my-auto flex flex-col items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto group"
        >
          <div className="px-6 py-3 rounded-full bg-black/60 backdrop-blur-2xl border border-white/20 text-white/90 group-hover:border-blue-400 group-hover:text-white transition-all flex items-center gap-3 shadow-2xl">
            <MoveHorizontal className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest uppercase font-semibold">
              SCROLL OR DRAG HORIZONTALLY TO SPIN 360°
            </span>
          </div>
        </div>

        {/* Bottom Technical Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="glass-panel-subtle px-5 py-3.5 rounded-xl max-w-md border border-white/10 shadow-lg">
            <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase block mb-1">
              SPECIFICATION DETAILS
            </span>
            <span className="text-xs font-mono text-white/90">
              {car.colorName} — {car.finish}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase block">
              NEXT STAGE
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
              POWERTRAIN & 428 COBRA JET DECONSTRUCTION →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
