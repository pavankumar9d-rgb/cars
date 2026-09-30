"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PART_EXPLOSION_MAP, getPartExplosionProgress, CarColorId, CARS_DATA } from "./CarPartMap";

interface CarModelProps {
  colorId: CarColorId;
  explosionProgress?: number;
  isHero?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

// Preload all 4 car models for smooth progressive availability
useGLTF.preload(CARS_DATA.blue.model);
useGLTF.preload(CARS_DATA.green.model);
useGLTF.preload(CARS_DATA.red.model);
useGLTF.preload(CARS_DATA.white.model);

export default function CarModel({
  colorId,
  explosionProgress = 0,
  isHero = false,
  isHovered = false,
  onClick,
  onPointerOver,
  onPointerOut,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: CarModelProps) {
  const carInfo = CARS_DATA[colorId];
  const { scene } = useGLTF(carInfo.model);

  const groupRef = useRef<THREE.Group>(null);
  const clonedSceneRef = useRef<THREE.Group | null>(null);
  const nodesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());

  // Deep clone the scene hierarchy for this instance so each car in the collection has independent transforms
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Deep clone materials so each car's shader properties can be tuned independently
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = Array.isArray(mesh.material)
            ? mesh.material.map((m) => m.clone())
            : mesh.material.clone();

          // Enhance automotive PBR materials
          const enhanceMat = (m: THREE.Material) => {
            if (m instanceof THREE.MeshStandardMaterial) {
              const nameLower = (m.name || "").toLowerCase();
              if (nameLower.includes("body") || nameLower.includes("paint")) {
                m.metalness = 0.85;
                m.roughness = 0.22;
                m.envMapIntensity = 1.6;
              } else if (nameLower.includes("chrome") || nameLower.includes("bumper") || nameLower.includes("silver")) {
                m.metalness = 0.98;
                m.roughness = 0.08;
                m.envMapIntensity = 2.0;
              } else if (nameLower.includes("glass")) {
                m.transparent = true;
                m.opacity = 0.82;
                m.roughness = 0.1;
                m.metalness = 0.9;
              } else if (nameLower.includes("rubber") || nameLower.includes("tire")) {
                m.roughness = 0.85;
                m.metalness = 0.05;
              } else if (nameLower.includes("brake")) {
                m.metalness = 0.7;
                m.roughness = 0.3;
              }
            }
          };

          if (Array.isArray(mat)) {
            mat.forEach(enhanceMat);
          } else {
            enhanceMat(mat);
          }

          mesh.material = mat;
        }
      }
    });

    return clone;
  }, [scene]);

  // Index nodes for instant lookup during explosion interpolation
  useEffect(() => {
    clonedSceneRef.current = clonedScene;
    const map = new Map<string, THREE.Object3D>();
    clonedScene.traverse((child) => {
      if (child.name) {
        map.set(child.name, child);
      }
    });
    nodesMapRef.current = map;
  }, [clonedScene]);

  // Persistent assembled transforms store
  const originalPosMap = useRef<Map<string, THREE.Vector3>>(new Map());
  useEffect(() => {
    nodesMapRef.current.forEach((node, name) => {
      if (!originalPosMap.current.has(name)) {
        originalPosMap.current.set(name, node.position.clone());
      }
    });
  }, [clonedScene]);

  // Apply explosion physics each frame without cumulative drift
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Hover breathing animation if in collection mode
    if (isHovered && !isHero) {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        position[1] + 0.08 + Math.sin(state.clock.elapsedTime * 3) * 0.03,
        delta * 6
      );
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        position[1],
        delta * 8
      );
    }

    // Apply physical explosion to all mapped nodes
    if (isHero) {
      nodesMapRef.current.forEach((node, name) => {
        const target = PART_EXPLOSION_MAP[name];
        const basePos = originalPosMap.current.get(name) || new THREE.Vector3(0, 0, 0);

        if (target) {
          const stagedFactor = getPartExplosionProgress(name, explosionProgress);
          // In GLB local space: [target.offset[0], target.offset[1], target.offset[2]]
          node.position.x = basePos.x + target.offset[0] * stagedFactor;
          node.position.y = basePos.y + target.offset[1] * stagedFactor;
          node.position.z = basePos.z + target.offset[2] * stagedFactor;
        } else {
          node.position.copy(basePos);
        }
      });
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver?.();
      }}
      onPointerOut={() => {
        onPointerOut?.();
      }}
    >
      {/* 
        The GLB coordinate system was modeled with Z as up, length along X, width along Y.
        Rotating by [-Math.PI / 2, 0, 0] converts it cleanly to standard Three.js Y-up!
      */}
      <primitive object={clonedScene} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}
