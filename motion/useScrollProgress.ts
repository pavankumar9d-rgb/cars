"use client";

import { useEffect, useState, useRef } from "react";

export type ActivePhase =
  | "assembly"
  | "collection"
  | "orbit"
  | "powertrain"
  | "chassis"
  | "explode"
  | "specs";

export interface ScrollState {
  progress: number; // 0 to 1 across whole page
  section: string;
  activePhase: ActivePhase;
  assemblyProgress: number; // 0 to 1 mapped across hero 400vh assembly
  rotateProgress: number; // 0 to 1 mapped across 300vh orbit
  explodeProgress: number; // 0 to 1 mapped across 350vh explosion
  orbitAngle: number; // radians 0 to 2*PI
  collectionFactor: number;
  isReducedMotion: boolean;
}

export function useScrollProgress(containerRef: React.RefObject<HTMLElement>) {
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    section: "assembly",
    activePhase: "assembly",
    assemblyProgress: 0,
    rotateProgress: 0,
    explodeProgress: 0,
    orbitAngle: 0,
    collectionFactor: 0,
    isReducedMotion: false,
  });

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false;

    const updateScrollMetrics = () => {
      ticking = false;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, docH - winH);
      const globalProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Measure DOM sections
      const assemblyEl = document.getElementById("assembly-section");
      const collectionEl = document.getElementById("collection-section");
      const orbitEl = document.getElementById("orbit-section");
      const powertrainEl = document.getElementById("powertrain-section");
      const chassisEl = document.getElementById("chassis-section");
      const explodeEl = document.getElementById("exploded-section");
      const specsEl = document.getElementById("specs-section");

      // 1. Assembly Hero Progress: tall 400vh scroll area
      // 0% scroll -> frame 1 (progress = 0)
      // 100% scroll of assembly section -> frame 240 (progress = 1)
      let assemblyProgress = 0;
      if (assemblyEl) {
        const top = assemblyEl.offsetTop;
        const h = assemblyEl.offsetHeight;
        const scrollable = Math.max(1, h - winH);
        assemblyProgress = Math.min(1, Math.max(0, (scrollY - top) / scrollable));
      } else {
        assemblyProgress = Math.min(1, Math.max(0, scrollY / (winH * 3)));
      }

      // 2. Rotate / 360 Orbit Progress (300vh)
      let rotateProgress = 0;
      if (orbitEl) {
        const top = orbitEl.offsetTop;
        const h = orbitEl.offsetHeight;
        const scrollable = Math.max(1, h - winH);
        rotateProgress = Math.min(1, Math.max(0, (scrollY - top) / scrollable));
      }

      // 3. Explode Progress (350vh)
      let explodeProgress = 0;
      if (explodeEl) {
        const top = explodeEl.offsetTop;
        const h = explodeEl.offsetHeight;
        const scrollable = Math.max(1, h - winH);
        explodeProgress = Math.min(1, Math.max(0, (scrollY - top) / scrollable));
      }

      // 4. Determine Active Phase
      let activePhase: ActivePhase = "assembly";
      let sectionName = "assembly";

      const currentMiddle = scrollY + winH * 0.45;

      if (assemblyEl && scrollY < assemblyEl.offsetTop + assemblyEl.offsetHeight - winH * 0.5) {
        activePhase = "assembly";
        sectionName = "assembly";
      } else if (collectionEl && currentMiddle < collectionEl.offsetTop + collectionEl.offsetHeight) {
        activePhase = "collection";
        sectionName = "collection";
      } else if (specsEl && currentMiddle < specsEl.offsetTop + specsEl.offsetHeight) {
        activePhase = "specs";
        sectionName = "specs";
      } else if (powertrainEl && currentMiddle < powertrainEl.offsetTop + powertrainEl.offsetHeight) {
        activePhase = "powertrain";
        sectionName = "powertrain";
      } else if (chassisEl && currentMiddle < chassisEl.offsetTop + chassisEl.offsetHeight) {
        activePhase = "chassis";
        sectionName = "chassis";
      } else if (explodeEl && currentMiddle < explodeEl.offsetTop + explodeEl.offsetHeight) {
        activePhase = "explode";
        sectionName = "exploded";
      } else {
        activePhase = "specs";
        sectionName = "cta";
      }

      // Collection factor
      let collectionFactor = activePhase === "collection" ? 1 : 0;

      // Orbit angle
      const orbitAngle = rotateProgress * Math.PI * 2;

      setScrollState((prev) => {
        // Prevent unnecessary state updates if nothing changed meaningfully
        if (
          Math.abs(prev.progress - globalProgress) < 0.0005 &&
          Math.abs(prev.assemblyProgress - assemblyProgress) < 0.0005 &&
          Math.abs(prev.rotateProgress - rotateProgress) < 0.0005 &&
          Math.abs(prev.explodeProgress - explodeProgress) < 0.0005 &&
          prev.activePhase === activePhase &&
          prev.section === sectionName
        ) {
          return prev;
        }

        return {
          progress: globalProgress,
          section: sectionName,
          activePhase,
          assemblyProgress,
          rotateProgress,
          explodeProgress,
          orbitAngle,
          collectionFactor,
          isReducedMotion: isReduced,
        };
      });
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollMetrics);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Initial calculation
    updateScrollMetrics();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef]);

  return scrollState;
}
