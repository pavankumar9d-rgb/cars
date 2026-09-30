"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import CarCollection from "./CarCollection";
import { CarColorId, CARS_DATA } from "./CarPartMap";
import { clamp, normalizeRange } from "@/motion/scrollConfig";

interface CarSceneProps {
  selectedCar: CarColorId;
  onSelectCar: (id: CarColorId) => void;
  progress: number;
  collectionFactor: number;
  explosionProgress: number;
  orbitAngle: number;
  isReducedMotion: boolean;
}

function CameraRig({
  progress,
  collectionFactor,
  explosionProgress,
  orbitAngle,
  isReducedMotion,
}: {
  progress: number;
  collectionFactor: number;
  explosionProgress: number;
  orbitAngle: number;
  isReducedMotion: boolean;
}) {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0.7, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.7, 0));

  useFrame((_, delta) => {
    let targetPos = new THREE.Vector3(-3.6, 1.4, 3.8);
    let lookTarget = new THREE.Vector3(0, 0.7, 0);

    if (progress < 0.12) {
      // 1. Opening Assembly: dramatic dark front 3/4
      const p = normalizeRange(progress, 0.0, 0.12);
      targetPos.set(
        THREE.MathUtils.lerp(-4.2, -3.8, p),
        THREE.MathUtils.lerp(1.6, 1.3, p),
        THREE.MathUtils.lerp(4.8, 3.9, p)
      );
      lookTarget.set(0, 0.7, 0);
    } else if (progress < 0.27) {
      // 2. Collection: wide framing so all 4 cars are visible
      const p = normalizeRange(progress, 0.12, 0.27);
      targetPos.set(0, THREE.MathUtils.lerp(2.2, 2.6, p), THREE.MathUtils.lerp(8.8, 9.4, p));
      lookTarget.set(0, 0.5, 0);
    } else if (progress < 0.40) {
      // 3. Selection / Focus: smooth dive toward selected hero car
      const p = normalizeRange(progress, 0.27, 0.40);
      targetPos.set(
        THREE.MathUtils.lerp(0, -3.6, p),
        THREE.MathUtils.lerp(2.6, 1.4, p),
        THREE.MathUtils.lerp(9.4, 3.8, p)
      );
      lookTarget.set(0, 0.7, 0);
    } else if (progress < 0.56) {
      // 4. 360 Orbit section
      const radius = 5.2;
      const height = 1.6;
      const angle = -0.7 + orbitAngle; // continuous rotation
      targetPos.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius);
      lookTarget.set(0, 0.7, 0);
    } else if (progress < 0.64) {
      // 5. Powertrain / Engine focus: pushed close to engine bay (-X is front)
      const p = normalizeRange(progress, 0.56, 0.64);
      targetPos.set(
        THREE.MathUtils.lerp(-3.6, -1.9, p),
        THREE.MathUtils.lerp(1.4, 1.7, p),
        THREE.MathUtils.lerp(3.8, 1.6, p)
      );
      lookTarget.set(THREE.MathUtils.lerp(0, -0.6, p), 0.85, 0);
    } else if (progress < 0.72) {
      // 6. Chassis & Suspension: lower angle inspection
      const p = normalizeRange(progress, 0.64, 0.72);
      targetPos.set(
        THREE.MathUtils.lerp(-1.9, -2.8, p),
        THREE.MathUtils.lerp(1.7, 0.75, p),
        THREE.MathUtils.lerp(1.6, 2.4, p)
      );
      lookTarget.set(THREE.MathUtils.lerp(-0.6, 0, p), 0.5, 0);
    } else if (progress < 0.84) {
      // 7. Exploded View: pull back to maintain part visibility
      const p = normalizeRange(progress, 0.72, 0.84);
      targetPos.set(-4.6, 2.5, 5.2);
      lookTarget.set(0, 0.8, 0);
    } else if (progress < 0.94) {
      // 8. Reassembly: return smoothly toward hero framing
      const p = normalizeRange(progress, 0.84, 0.94);
      targetPos.set(
        THREE.MathUtils.lerp(-4.6, -3.5, p),
        THREE.MathUtils.lerp(2.5, 1.3, p),
        THREE.MathUtils.lerp(5.2, 3.6, p)
      );
      lookTarget.set(0, 0.7, 0);
    } else {
      // 9. Specs & CTA: refined showcase position
      targetPos.set(-3.2, 1.25, 3.4);
      lookTarget.set(0, 0.65, 0);
    }

    const dampSpeed = isReducedMotion ? 12 : 5.0;
    camera.position.lerp(targetPos, delta * dampSpeed);
    currentLookAt.current.lerp(lookTarget, delta * dampSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

export default function CarScene({
  selectedCar,
  onSelectCar,
  progress,
  collectionFactor,
  explosionProgress,
  orbitAngle,
  isReducedMotion,
}: CarSceneProps) {
  const carInfo = CARS_DATA[selectedCar];

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden bg-[#050608]">
      {/* Dynamic ambient radial lighting tied to vehicle color */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 opacity-20"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${carInfo.accentHex} 0%, transparent 65%)`,
        }}
      />

      <Canvas
        shadows
        camera={{ position: [-3.8, 1.4, 4.2], fov: 42, near: 0.1, far: 50 }}
        dpr={[1, typeof window !== "undefined" && window.innerWidth < 768 ? 1.5 : 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <Suspense fallback={null}>
          <CameraRig
            progress={progress}
            collectionFactor={collectionFactor}
            explosionProgress={explosionProgress}
            orbitAngle={orbitAngle}
            isReducedMotion={isReducedMotion}
          />

          {/* Premium Automotive Studio Lighting */}
          <ambientLight intensity={0.45} />

          {/* Key Light (Front/Top) */}
          <directionalLight
            position={[-5, 8, 5]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />

          {/* Soft Top Fill Light */}
          <directionalLight position={[0, 10, 0]} intensity={0.8} />

          {/* Rim / Edge Accent Light */}
          <directionalLight
            position={[6, 4, -5]}
            intensity={1.4}
            color={carInfo.accentHex}
          />

          {/* Low Ground Accent Light */}
          <pointLight
            position={[-2, 0.3, 2]}
            intensity={0.6}
            color={carInfo.accentHex}
            distance={8}
          />

          {/* Studio Floor Contact Shadows */}
          <ContactShadows
            position={[0, -0.02, 0]}
            opacity={0.75}
            scale={14}
            blur={1.8}
            far={3.5}
            resolution={1024}
            color="#000000"
          />

          {/* 3D Car Collection with interactive selection and physical explosion */}
          <CarCollection
            selectedCar={selectedCar}
            onSelectCar={onSelectCar}
            collectionFactor={collectionFactor}
            explosionProgress={explosionProgress}
            orbitAngle={orbitAngle}
          />

          {/* Studio Environment Map for metallic reflections */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
