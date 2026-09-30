"use client";

import React, { useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import CarModel from "./CarModel";
import { CarColorId } from "./CarPartMap";

interface CarCollectionProps {
  selectedCar: CarColorId;
  onSelectCar: (id: CarColorId) => void;
  collectionFactor: number; // 0 (Hero single car) to 1 (All four cars side-by-side)
  explosionProgress: number;
  orbitAngle: number;
}

const CAR_ORDER: CarColorId[] = ["blue", "green", "red", "white"];

export default function CarCollection({
  selectedCar,
  onSelectCar,
  collectionFactor,
  explosionProgress,
  orbitAngle,
}: CarCollectionProps) {
  const [hoveredCar, setHoveredCar] = useState<CarColorId | null>(null);

  // Layout positions for the 4 cars in the showroom
  // BLUE (-4.8), GREEN (-1.6), RED (+1.6), WHITE (+4.8)
  const getCarTargetPosition = (id: CarColorId): [number, number, number] => {
    const isHero = id === selectedCar;

    if (collectionFactor <= 0.01) {
      if (isHero) return [0, 0, 0];
      // Offscreen parked
      const idx = CAR_ORDER.indexOf(id);
      return [(idx - 1.5) * 14, -4, -6];
    }

    const idx = CAR_ORDER.indexOf(id);
    const spreadX = (idx - 1.5) * 3.3; // Spacing between cars
    const staggerZ = -Math.abs(idx - 1.5) * 0.4; // Subtle curved arch

    if (isHero) {
      // Interpolate between hero center and showroom slot
      return [
        THREE.MathUtils.lerp(0, spreadX, collectionFactor),
        0,
        THREE.MathUtils.lerp(0, staggerZ, collectionFactor),
      ];
    } else {
      // Interpolate non-hero cars into view
      return [
        spreadX,
        THREE.MathUtils.lerp(-3, 0, collectionFactor),
        THREE.MathUtils.lerp(-10, staggerZ, collectionFactor),
      ];
    }
  };

  const getCarTargetRotation = (id: CarColorId): [number, number, number] => {
    const isHero = id === selectedCar;

    if (isHero) {
      // In hero mode, apply 360 orbit angle when active
      const baseShowroomRot = THREE.MathUtils.lerp(0.35, 0.15, collectionFactor);
      return [0, baseShowroomRot + orbitAngle, 0];
    } else {
      // In showroom mode, slightly angled inward toward center viewer
      const idx = CAR_ORDER.indexOf(id);
      const angleInward = (1.5 - idx) * 0.08 + 0.25;
      return [0, angleInward, 0];
    }
  };

  return (
    <group>
      {CAR_ORDER.map((id) => {
        const isHero = id === selectedCar;
        const pos = getCarTargetPosition(id);
        const rot = getCarTargetRotation(id);
        const isHovered = hoveredCar === id;

        // If collection factor is 0 and it's not hero, do not render to save draw calls
        if (collectionFactor <= 0.01 && !isHero) {
          return null;
        }

        return (
          <CarModel
            key={id}
            colorId={id}
            isHero={isHero}
            isHovered={isHovered}
            explosionProgress={isHero ? explosionProgress : 0}
            position={pos}
            rotation={rot}
            scale={isHero ? 1 : 0.85}
            onClick={() => onSelectCar(id)}
            onPointerOver={() => setHoveredCar(id)}
            onPointerOut={() => {
              if (hoveredCar === id) setHoveredCar(null);
            }}
          />
        );
      })}
    </group>
  );
}
