"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { CarColorId } from "../car/CarPartMap";
import { ActivePhase } from "@/motion/useScrollProgress";

interface SmoothCanvasScrollerProps {
  progress: number; // Global scroll progress (0 to 1)
  assemblyProgress: number; // 0 to 1 during the 400vh assembly phase
  rotateProgress: number; // 0 to 1 during 360 orbit phase
  explodeProgress: number; // 0 to 1 during exploded view phase
  activePhase: ActivePhase;
  selectedCar: CarColorId;
  hasUserSelectedCar?: boolean; // True ONLY after user explicitly clicks/selects a car
  dragOffset?: number; // Optional user drag offset
}

const TOTAL_FRAMES = 240;

// Assembly frames path
const getAssemblyPath = (i: number) =>
  `/frames/assembly/frame-${String(i + 1).padStart(3, "0")}.jpg`;

// 360 Orbit frames path for selected car
const getRotatePath = (car: CarColorId, i: number) =>
  `/frames/rotate/${car}/frame_${String(i + 1).padStart(3, "0")}.jpg`;

// Physical Exploded frames path for selected car
const getExplodePath = (car: CarColorId, i: number) =>
  `/frames/explode/${car}/frame_${String(i + 1).padStart(3, "0")}.jpg`;

export default function SmoothCanvasScroller({
  progress,
  assemblyProgress,
  rotateProgress,
  explodeProgress,
  activePhase,
  selectedCar,
  hasUserSelectedCar = false,
  dragOffset = 0,
}: SmoothCanvasScrollerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // In-memory bitmap caches to eliminate garbage collection & network stalls
  const assemblyImages = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const rotateImages = useRef<Record<CarColorId, (HTMLImageElement | null)[]>>({
    blue: new Array(TOTAL_FRAMES).fill(null),
    green: new Array(TOTAL_FRAMES).fill(null),
    red: new Array(TOTAL_FRAMES).fill(null),
    white: new Array(TOTAL_FRAMES).fill(null),
  });
  const explodeImages = useRef<Record<CarColorId, (HTMLImageElement | null)[]>>({
    blue: new Array(TOTAL_FRAMES).fill(null),
    green: new Array(TOTAL_FRAMES).fill(null),
    red: new Array(TOTAL_FRAMES).fill(null),
    white: new Array(TOTAL_FRAMES).fill(null),
  });

  // State for persistent lerp animation loop
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const currentPhaseRef = useRef(activePhase);
  const selectedCarRef = useRef(selectedCar);
  const hasUserSelectedCarRef = useRef(hasUserSelectedCar);
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);

  currentPhaseRef.current = activePhase;
  selectedCarRef.current = selectedCar;
  hasUserSelectedCarRef.current = hasUserSelectedCar;

  // 1. Calculate target frame index (0 to 239) based on active section
  useEffect(() => {
    let target = 0;

    if (activePhase === "assembly") {
      // 0% scroll -> frame 1 (index 0)
      // 100% scroll -> frame 240 (index 239)
      const clamped = Math.min(1, Math.max(0, assemblyProgress));
      target = Math.floor(clamped * (TOTAL_FRAMES - 1));
    } else if (activePhase === "collection") {
      // If user hasn't explicitly clicked a car yet, maintain the final assembled hero car (frame 239)
      if (!hasUserSelectedCar) {
        target = TOTAL_FRAMES - 1;
      } else {
        target = 0;
      }
    } else if (activePhase === "orbit") {
      // 360 degree orbit of the selected car
      const combined = (rotateProgress + dragOffset) % 1;
      const normalized = ((combined % 1) + 1) % 1;
      target = Math.floor(normalized * (TOTAL_FRAMES - 1));
    } else if (activePhase === "explode") {
      // Selected car physical exploded deconstruction & reassembly (frames 0 to 239)
      const safeExp = typeof explodeProgress === "number" && !isNaN(explodeProgress) ? explodeProgress : 0;
      if (safeExp <= 0.65) {
        const p = safeExp / 0.65;
        target = Math.floor(p * (TOTAL_FRAMES - 1));
      } else if (safeExp <= 0.78) {
        target = TOTAL_FRAMES - 1;
      } else {
        const p = 1.0 - (safeExp - 0.78) / 0.22;
        target = Math.floor(Math.max(0, p) * (TOTAL_FRAMES - 1));
      }
    } else {
      // Powertrain / Chassis / Specs / CTA: Assembled studio view of selected car
      target = 0;
    }

    targetFrameRef.current = Math.min(TOTAL_FRAMES - 1, Math.max(0, target));
  }, [activePhase, assemblyProgress, rotateProgress, explodeProgress, hasUserSelectedCar, dragOffset]);

  // 2. Ultra-Fast Canvas Drawing with Watermark Removal & 8K Visual Clarity
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const phase = currentPhaseRef.current;
    const car = selectedCarRef.current;
    const userSelected = hasUserSelectedCarRef.current;

    let imgList: (HTMLImageElement | null)[] = assemblyImages.current;
    let isAssembly = false;

    if (phase === "assembly") {
      // Heroic FPV Assembly Sequence
      imgList = assemblyImages.current;
      isAssembly = true;
    } else if (phase === "collection" && !userSelected) {
      // During collection showroom, if user has NOT clicked a car, keep the assembly hero car!
      imgList = assemblyImages.current;
      isAssembly = true;
      frameIdx = TOTAL_FRAMES - 1; // Hold frame 239 (fully assembled car)
    } else if (phase === "explode") {
      // Physical Exploded View & Deconstruction frames for selected car!
      imgList = explodeImages.current[car];
      isAssembly = false;
    } else {
      // Orbit, Powertrain, Chassis, Specs, CTA, or Collection after explicit selection
      imgList = rotateImages.current[car];
      isAssembly = false;
    }

    let img = imgList[frameIdx];

    // Nearest-neighbor fallback if specific frame is still buffering
    if (!img?.complete || !img.naturalWidth) {
      for (let offset = 1; offset < 40; offset++) {
        const prev = imgList[frameIdx - offset];
        if (prev?.complete && prev.naturalWidth) {
          img = prev;
          break;
        }
        const next = imgList[frameIdx + offset];
        if (next?.complete && next.naturalWidth) {
          img = next;
          break;
        }
      }
      // Guaranteed instant fallback to frame 0 or assembled hero frame
      if ((!img?.complete || !img.naturalWidth) && imgList[0]?.complete && imgList[0].naturalWidth) {
        img = imgList[0];
      } else if (!img?.complete || !img.naturalWidth) {
        if (assemblyImages.current[TOTAL_FRAMES - 1]?.complete) {
          img = assemblyImages.current[TOTAL_FRAMES - 1];
        }
      }
    }

    const source = img?.complete && img.naturalWidth ? img : lastDrawnImageRef.current;
    if (!source || !source.complete || !source.naturalWidth) return;

    lastDrawnImageRef.current = source;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cw = canvas.width;
    const ch = canvas.height;

    // WATERMARK REMOVAL:
    // On assembly frames, crop the bottom 8% (srcH = 92%) where the bottom-right watermark sits.
    // Pixels below this line are never sampled or drawn.
    let srcX = 0;
    let srcY = 0;
    let srcW = source.naturalWidth;
    let srcH = source.naturalHeight;

    if (isAssembly) {
      srcH = Math.floor(source.naturalHeight * 0.92);
    }

    const scale = Math.max(cw / srcW, ch / srcH);
    const sw = srcW * scale;
    const sh = srcH * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.drawImage(source, srcX, srcY, srcW, srcH, sx, sy, sw, sh);
  }, []);

  // 3. Progressive Preloader for Assembly Frames
  useEffect(() => {
    // Zero-delay first paint: load frame 1 immediately
    const f1 = new Image();
    f1.src = getAssemblyPath(0);
    f1.onload = () => {
      assemblyImages.current[0] = f1;
      if (!lastDrawnImageRef.current) {
        lastDrawnImageRef.current = f1;
      }
    };

    // Also immediately load final frame 240 (the assembled hero car)
    const fHero = new Image();
    fHero.src = getAssemblyPath(TOTAL_FRAMES - 1);
    fHero.onload = () => {
      assemblyImages.current[TOTAL_FRAMES - 1] = fHero;
    };

    // Priority load: keyframes every 4th frame for instantaneous scrubbing response
    for (let i = 0; i < TOTAL_FRAMES; i += 4) {
      if (i === 0 || i === TOTAL_FRAMES - 1) continue;
      const img = new Image();
      img.src = getAssemblyPath(i);
      img.onload = () => {
        assemblyImages.current[i] = img;
      };
    }

    // Idle load: remaining assembly frames smoothly
    const loadRemaining = () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!assemblyImages.current[i]) {
          const img = new Image();
          img.src = getAssemblyPath(i);
          img.onload = () => {
            assemblyImages.current[i] = img;
          };
        }
      }
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(loadRemaining);
    } else {
      setTimeout(loadRemaining, 100);
    }
  }, []);

  // 4. Preload Frame 0 for ALL 4 cars on initial mount for instant 0ms color switching
  useEffect(() => {
    const cars: CarColorId[] = ["blue", "green", "red", "white"];
    cars.forEach((c) => {
      const img = new Image();
      img.src = getRotatePath(c, 0);
      img.onload = () => {
        rotateImages.current[c][0] = img;
        if (selectedCarRef.current === c && currentPhaseRef.current !== "assembly") {
          lastRenderedFrameRef.current = -1;
          drawFrame(0);
        }
      };

      // Also preload frame 0 of explode sequence
      const expImg = new Image();
      expImg.src = getExplodePath(c, 0);
      expImg.onload = () => {
        explodeImages.current[c][0] = expImg;
      };
    });
  }, [drawFrame]);

  // 5. Preloader for Rotate frames of the active selected car
  useEffect(() => {
    const car = selectedCar;
    const rotList = rotateImages.current[car];

    // Priority load keyframes every 6th frame
    for (let i = 0; i < TOTAL_FRAMES; i += 6) {
      if (!rotList[i]) {
        const rImg = new Image();
        rImg.src = getRotatePath(car, i);
        rImg.onload = () => {
          rotList[i] = rImg;
        };
      }
    }

    // Background load remainder
    const loadAll = () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!rotList[i]) {
          const rImg = new Image();
          rImg.src = getRotatePath(car, i);
          rImg.onload = () => {
            rotList[i] = rImg;
          };
        }
      }
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(loadAll);
    } else {
      setTimeout(loadAll, 150);
    }
  }, [selectedCar]);

  // 6. Preloader for Exploded frames of the active selected car
  useEffect(() => {
    const car = selectedCar;
    const expList = explodeImages.current[car];

    // Priority load keyframes every 4th frame
    for (let i = 0; i < TOTAL_FRAMES; i += 4) {
      if (!expList[i]) {
        const img = new Image();
        img.src = getExplodePath(car, i);
        img.onload = () => {
          expList[i] = img;
        };
      }
    }

    // Background load remainder
    const loadAllExplode = () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!expList[i]) {
          const img = new Image();
          img.src = getExplodePath(car, i);
          img.onload = () => {
            expList[i] = img;
          };
        }
      }
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(loadAllExplode);
    } else {
      setTimeout(loadAllExplode, 150);
    }
  }, [selectedCar]);

  // 7. Force immediate canvas redraw whenever user selects a different vehicle or clicks
  useEffect(() => {
    selectedCarRef.current = selectedCar;
    hasUserSelectedCarRef.current = hasUserSelectedCar;
    lastRenderedFrameRef.current = -1; // Invalidate rendered frame cache
    lastDrawnImageRef.current = null;
    drawFrame(Math.round(currentFrameRef.current));
  }, [selectedCar, hasUserSelectedCar, drawFrame]);

  // 8. Persistent requestAnimationFrame Lerp Loop
  useEffect(() => {
    let animId: number;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      if (prefersReducedMotion) {
        currentFrameRef.current = target;
      } else {
        // Continuous smooth easing toward target frame without ever stalling
        const diff = target - current;
        if (Math.abs(diff) > 0.01) {
          currentFrameRef.current += diff * 0.22;
        } else {
          currentFrameRef.current = target;
        }
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      if (frameToDraw !== lastRenderedFrameRef.current) {
        drawFrame(frameToDraw);
        lastRenderedFrameRef.current = frameToDraw;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  // 9. Responsive High-DPI 8K Canvas Buffer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      // 8K Ultra-clarity retina multiplier
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      drawFrame(Math.round(currentFrameRef.current));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden pointer-events-none z-0 bg-[#050608]">
      {/* High-DPI 8K-Grade 60-120fps HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08] brightness-[1.03] saturate-[1.05]"
        style={{
          imageRendering: "crisp-edges",
        }}
      />

      {/* 8K Ultra-Clarity Cinematic Micro-Grain Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cinematic Studio Vignette & bottom dark gradient to eliminate any possible watermark artifact */}
      <div className="absolute inset-0 radial-vignette pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050608] to-transparent pointer-events-none opacity-90" />
    </div>
  );
}
