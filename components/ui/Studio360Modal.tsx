"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { CarColorId, CARS_DATA } from "../car/CarPartMap";
import { RotateCw, MoveHorizontal, X, Shield, Sparkles, Check, ArrowRight } from "lucide-react";
import ShinyText from "../react-bits/ShinyText";

interface Studio360ModalProps {
  isOpen: boolean;
  carId: CarColorId;
  onClose: () => void;
  onCommission: (carId: CarColorId) => void;
}

const TOTAL_FRAMES = 240;

export default function Studio360Modal({
  isOpen,
  carId,
  onClose,
  onCommission,
}: Studio360ModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentFrameFloatRef = useRef(0);
  const targetFrameFloatRef = useRef(0);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  const car = CARS_DATA[carId] || CARS_DATA.blue;
  const degrees = Math.round((frameIndex / TOTAL_FRAMES) * 360) % 360;

  // Preload 360 frames for this car
  useEffect(() => {
    if (!isOpen) return;

    // Reset frame list
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);

    // Frame 1 immediate
    const f1 = new Image();
    f1.src = `/frames/rotate/${carId}/frame_001.jpg`;
    f1.onload = () => {
      imagesRef.current[0] = f1;
      draw(0);
    };

    // Load keyframes first
    for (let i = 0; i < TOTAL_FRAMES; i += 6) {
      const img = new Image();
      img.src = `/frames/rotate/${carId}/frame_${String(i + 1).padStart(3, "0")}.jpg`;
      img.onload = () => {
        imagesRef.current[i] = img;
      };
    }

    // Load rest
    const loadRest = () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!imagesRef.current[i]) {
          const img = new Image();
          img.src = `/frames/rotate/${carId}/frame_${String(i + 1).padStart(3, "0")}.jpg`;
          img.onload = () => {
            imagesRef.current[i] = img;
          };
        }
      }
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(loadRest);
    } else {
      setTimeout(loadRest, 100);
    }
  }, [isOpen, carId]);

  // Draw frame on canvas
  const draw = useCallback(
    (idx: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      let img = imagesRef.current[idx];
      if (!img?.complete || !img.naturalWidth) {
        // Find nearest
        for (let off = 1; off < 30; off++) {
          const prev = imagesRef.current[idx - off];
          if (prev?.complete && prev.naturalWidth) {
            img = prev;
            break;
          }
          const next = imagesRef.current[idx + off];
          if (next?.complete && next.naturalWidth) {
            img = next;
            break;
          }
        }
      }

      if (!img?.complete || !img.naturalWidth) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const cw = canvas.width;
      const ch = canvas.height;
      const sw = img.naturalWidth;
      const sh = img.naturalHeight;

      const scale = Math.min(cw / sw, ch / sh) * 0.95;
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    },
    []
  );

  // Animation lerp loop
  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    const loop = () => {
      const diff = targetFrameFloatRef.current - currentFrameFloatRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameFloatRef.current += diff * 0.25;
      } else {
        currentFrameFloatRef.current = targetFrameFloatRef.current;
      }

      // Normalize modulo TOTAL_FRAMES
      let normalized = Math.round(currentFrameFloatRef.current) % TOTAL_FRAMES;
      if (normalized < 0) normalized += TOTAL_FRAMES;

      setFrameIndex(normalized);
      draw(normalized);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, draw]);

  // Canvas resize
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      draw(frameIndex);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, draw, frameIndex]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    startXRef.current = e.clientX;
    targetFrameFloatRef.current -= deltaX * 0.45;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    startXRef.current = e.touches[0].clientX;
    targetFrameFloatRef.current -= deltaX * 0.45;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-[#050608]/95 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-300"
    >
      {/* 360 Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none filter contrast-[1.08] brightness-[1.03] saturate-[1.05]"
      />

      {/* Top Header Controls */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
            style={{ backgroundColor: car.accentHex }}
          />
          <div>
            <div className="text-xs font-mono tracking-[0.25em] text-blue-400 uppercase">
              STUDIO 360° INSPECTION // {car.badge}
            </div>
            <div className="text-xl sm:text-2xl font-display font-bold text-white uppercase">
              {car.name} — {car.colorName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Azimuth Telemetry */}
          <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 shadow-xl">
            <RotateCw className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: "12s" }} />
            <div className="text-xs font-mono font-bold text-white tracking-wider">
              {degrees}° AZIMUTH
            </div>
          </div>

          {/* Close Studio Button */}
          <button
            onClick={onClose}
            aria-label="Close 360 Studio"
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center hover:border-red-400 hover:scale-110 active:scale-95 transition-all shadow-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Interactive Drag Area */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative z-20 w-full max-w-2xl mx-auto h-72 sm:h-96 my-auto flex flex-col items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto group"
      >
        <div className="px-6 py-3 rounded-full bg-black/70 backdrop-blur-2xl border border-white/20 text-white/90 group-hover:border-blue-400 group-hover:text-white transition-all flex items-center gap-3 shadow-2xl">
          <MoveHorizontal className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest uppercase font-semibold">
            CLICK & DRAG HORIZONTALLY TO SPIN 360°
          </span>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto pt-4 border-t border-white/10">
        <div className="text-xs font-mono text-white/50 tracking-wider">
          FRAME {String(frameIndex + 1).padStart(3, "0")} / 240 • 8K ULTRA-DEFINITION BITMAP SEQUENCE
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-white tracking-wider uppercase transition-all"
          >
            RETURN TO SHOWROOM
          </button>

          <button
            onClick={() => {
              onClose();
              onCommission(carId);
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-xs font-mono font-bold text-white tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
          >
            <span>COMMISSION THIS BUILD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
