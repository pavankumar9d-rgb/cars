"use client";

import React, { useRef, useState } from "react";
import { CarColorId } from "@/components/car/CarPartMap";
import { useScrollProgress } from "@/motion/useScrollProgress";
import Header from "@/components/ui/Header";
import ScrollProgress from "@/components/ui/ScrollProgress";
import DebugHUD from "@/components/ui/DebugHUD";
import SmoothCanvasScroller from "@/components/canvas/SmoothCanvasScroller";
import AssemblySection from "@/components/sections/AssemblySection";
import CollectionSection from "@/components/sections/CollectionSection";
import EngineSection from "@/components/sections/EngineSection";
import ChassisSection from "@/components/sections/ChassisSection";
import ExplodedSection from "@/components/sections/ExplodedSection";
import SpecsSection from "@/components/sections/SpecsSection";
import CTASection from "@/components/sections/CTASection";
import Studio360Modal from "@/components/ui/Studio360Modal";
import { useLenis } from "@/providers/LenisProvider";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCar, setSelectedCar] = useState<CarColorId>("blue");
  const [hasUserSelectedCar, setHasUserSelectedCar] = useState<boolean>(false);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [studioCar, setStudioCar] = useState<CarColorId>("blue");
  const { scrollTo } = useLenis();

  // Single unified master scroll progress driver
  const {
    progress,
    section,
    activePhase,
    assemblyProgress,
    rotateProgress,
    explodeProgress,
    orbitAngle,
  } = useScrollProgress(containerRef);

  const handleSelectCar = (carId: CarColorId) => {
    setSelectedCar(carId);
    setHasUserSelectedCar(true);
  };

  const handleOpenStudio = (carId: CarColorId) => {
    setStudioCar(carId);
    setSelectedCar(carId);
    setHasUserSelectedCar(true);
    setIsStudioOpen(true);
  };

  const handleCommissionFromStudio = (carId: CarColorId) => {
    setSelectedCar(carId);
    setHasUserSelectedCar(true);
    setIsStudioOpen(false);
    if (typeof window !== "undefined") {
      const ctaEl = document.getElementById("cta-section");
      if (ctaEl) {
        scrollTo(ctaEl.offsetTop);
      }
    }
  };

  return (
    <main className="relative bg-[#050608] min-h-screen text-white select-none">
      {/* 1. Butter-Smooth 60-120fps HTML5 Canvas Scroller Layer (Fixed behind content) */}
      <SmoothCanvasScroller
        progress={progress}
        assemblyProgress={assemblyProgress}
        rotateProgress={rotateProgress}
        explodeProgress={explodeProgress}
        activePhase={activePhase}
        selectedCar={selectedCar}
        hasUserSelectedCar={hasUserSelectedCar}
      />

      {/* 2. Global Fixed HUD and Navigation */}
      <Header
        selectedCar={selectedCar}
        onSelectCar={handleSelectCar}
        progress={progress}
      />
      
      <ScrollProgress progress={progress} currentSection={section} />
      
      <DebugHUD
        selectedCar={selectedCar}
        progress={progress}
        explosionProgress={explodeProgress}
        orbitAngle={orbitAngle}
        currentSection={section}
      />

      {/* 3. Scrolling Content Driver Container */}
      <div ref={containerRef} className="relative z-10 w-full flex flex-col pointer-events-none">
        {/* SECTION 01: FPV ASSEMBLY (Frames 1 -> 240, zero lag, no watermark, 8K clarity) */}
        <AssemblySection assemblyProgress={assemblyProgress} />

        {/* SECTION 02: THE COLLECTION SHOWROOM */}
        <CollectionSection
          selectedCar={selectedCar}
          onSelectCar={handleSelectCar}
          onOpen360Studio={handleOpenStudio}
          hasUserSelectedCar={hasUserSelectedCar}
        />

        {/* SECTION 03: VERIFIED TECHNICAL SPECIFICATIONS MATRIX */}
        <SpecsSection selectedCar={selectedCar} />

        {/* SECTION 04: ENGINE / POWERTRAIN HIGHLIGHTS */}
        <EngineSection selectedCar={selectedCar} />

        {/* SECTION 05: CHASSIS & SUSPENSION HIGHLIGHTS */}
        <ChassisSection selectedCar={selectedCar} />

        {/* SECTION 06: PHYSICAL EXPLODED VIEW & REASSEMBLY */}
        <ExplodedSection
          selectedCar={selectedCar}
          explodeProgress={explodeProgress}
        />

        {/* SECTION 07: BESPOKE COMMISSION & RESERVE CTA */}
        <CTASection selectedCar={selectedCar} />
      </div>

      {/* 4. On-Demand 360° Studio Inspection Modal (Appears ONLY when user clicks '360° ORBIT') */}
      <Studio360Modal
        isOpen={isStudioOpen}
        carId={studioCar}
        onClose={() => setIsStudioOpen(false)}
        onCommission={handleCommissionFromStudio}
      />
    </main>
  );
}
