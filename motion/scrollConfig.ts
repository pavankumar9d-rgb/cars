export interface ScrollMilestone {
  start: number;
  end: number;
  name: string;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
  };
}

export const SCROLL_RANGES = {
  ASSEMBLY: { start: 0.00, end: 0.12, name: "Assembly" },
  COLLECTION: { start: 0.12, end: 0.27, name: "Collection" },
  SELECTION: { start: 0.27, end: 0.40, name: "Focus" },
  ORBIT: { start: 0.40, end: 0.56, name: "360° Orbit" },
  ENGINE: { start: 0.56, end: 0.64, name: "Powertrain" },
  CHASSIS: { start: 0.64, end: 0.72, name: "Chassis & Wheels" },
  EXPLOSION: { start: 0.72, end: 0.84, name: "Exploded View" },
  REASSEMBLY: { start: 0.84, end: 0.94, name: "Reassembly" },
  SPECS_CTA: { start: 0.94, end: 1.00, name: "Specs & CTA" },
} as const;

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function normalizeRange(val: number, start: number, end: number): number {
  if (val <= start) return 0;
  if (val >= end) return 1;
  return (val - start) / (end - start);
}

export function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
