export type CarColorId = "blue" | "green" | "red" | "white";

export interface CarInfo {
  id: CarColorId;
  name: string;
  badge: string;
  colorName: string;
  accentHex: string;
  model: string;
  poster: string;
  explodedReference: string;
  description: string;
  finish: string;
  year: string;
  platform: string;
}

export const CARS_DATA: Record<CarColorId, CarInfo> = {
  blue: {
    id: "blue",
    name: "BLUE",
    badge: "GT500 FASTBACK",
    colorName: "Acapulco Blue with Le Mans Stripes",
    accentHex: "#3b82f6",
    model: "/assets/vehicles/blue/blue_car.glb",
    poster: "/assets/vehicles/blue/blue_car.png",
    explodedReference: "/assets/vehicles/blue/blue_car_exploded_reference.mp4",
    description: "Thoroughbred automotive heritage. High-compression Cobra Jet architecture framed in classic fastback proportions.",
    finish: "Gloss Metallic Coat",
    year: "1967",
    platform: "Tubular Chassis"
  },
  green: {
    id: "green",
    name: "GREEN",
    badge: "HIGHLAND RS",
    colorName: "Highland Green Metallic",
    accentHex: "#10b981",
    model: "/assets/vehicles/green/green_car.glb",
    poster: "/assets/vehicles/green/green_car.png",
    explodedReference: "/assets/vehicles/green/green_car_exploded_reference.mp4",
    description: "Stealth track pedigree. Aerodynamic rear diffuser lip and high-tensile spring dynamics for uncompromising line control.",
    finish: "Deep Satin Metallic",
    year: "1967",
    platform: "Reinforced Subframe"
  },
  red: {
    id: "red",
    name: "RED",
    badge: "ROSSO SCUDERIA",
    colorName: "Candy Apple Crimson",
    accentHex: "#ef4444",
    model: "/assets/vehicles/red/red_car.glb",
    poster: "/assets/vehicles/red/red_car.png",
    explodedReference: "/assets/vehicles/red/red_car_exploded_reference.mp4",
    description: "Visceral mechanical presence. High-flow induction channels paired with aggressive quad-caliper stopping geometry.",
    finish: "Triple-Coat Pearl",
    year: "1967",
    platform: "Sport Tuned Geometry"
  },
  white: {
    id: "white",
    name: "WHITE",
    badge: "BLANC PROTOTYPE",
    colorName: "Wimbledon White Pearl",
    accentHex: "#f8fafc",
    model: "/assets/vehicles/white/white_car.glb",
    poster: "/assets/vehicles/white/white_car.png",
    explodedReference: "/assets/vehicles/white/white_car_exploded_reference.mp4",
    description: "Pure aerodynamic blueprint. Monolithic surfacing contrasting dark structural elements and forged lightweight wheels.",
    finish: "Opalescent Mica",
    year: "1967",
    platform: "Lightweight Prototype"
  }
};

export interface ExplodedTarget {
  offset: [number, number, number]; // [dx, dy, dz] in GLB local space
  delay: number; // 0 to 1
  duration: number; // 0 to 1
  category: "body" | "hood" | "cabin" | "powertrain" | "chassis" | "wheels" | "brakes" | "aero";
  label?: string;
}

// In GLB local space:
// X: Length (-X is Forward, +X is Rear)
// Y: Width (-Y is Left, +Y is Right)
// Z: Height (+Z is Up, -Z is Down)
export const PART_EXPLOSION_MAP: Record<string, ExplodedTarget> = {
  // Body Panels & Aerodynamics
  Hood: {
    offset: [-0.7, 0, 0.75], // slides forward and up
    delay: 0.15,
    duration: 0.65,
    category: "hood",
    label: "Eleanor Hood with Ram-Air Scoop"
  },
  Hood_Stripe_1: {
    offset: [-0.7, 0, 0.75],
    delay: 0.15,
    duration: 0.65,
    category: "hood"
  },
  Hood_Stripe_2: {
    offset: [-0.7, 0, 0.75],
    delay: 0.15,
    duration: 0.65,
    category: "hood"
  },
  Roof_Skin: {
    offset: [0, 0, 1.1], // lifts straight up
    delay: 0.2,
    duration: 0.6,
    category: "body",
    label: "Fastback Roof Skin"
  },
  Glass_House: {
    offset: [0, 0, 0.7],
    delay: 0.25,
    duration: 0.6,
    category: "cabin",
    label: "Greenhouse Glass Enclosure"
  },
  Cabin: {
    offset: [0, 0, 0.45],
    delay: 0.3,
    duration: 0.6,
    category: "cabin",
    label: "Cockpit Interior Assembly"
  },
  Rear_Quarter: {
    offset: [0.8, 0, 0.4],
    delay: 0.2,
    duration: 0.65,
    category: "body",
    label: "Rear Quarter & Trunk Lid"
  },
  Rear_Aero_Lip: {
    offset: [0.95, 0, 0.6],
    delay: 0.15,
    duration: 0.65,
    category: "aero",
    label: "Rear Aero Deck Spoiler"
  },
  Front_Bumper: {
    offset: [-0.85, 0, -0.1],
    delay: 0.1,
    duration: 0.6,
    category: "body",
    label: "Front Chrome Bumper Assembly"
  },
  Front_Grille: {
    offset: [-0.75, 0, 0.05],
    delay: 0.1,
    duration: 0.6,
    category: "body",
    label: "Shelby Custom Billet Grille"
  },
  Rear_Bumper: {
    offset: [0.85, 0, -0.1],
    delay: 0.1,
    duration: 0.6,
    category: "body",
    label: "Rear Chrome Bumper"
  },
  Headlight_L: {
    offset: [-0.7, -0.3, 0.05],
    delay: 0.15,
    duration: 0.6,
    category: "body",
    label: "High-Beam Projector (L)"
  },
  Headlight_R: {
    offset: [-0.7, 0.3, 0.05],
    delay: 0.15,
    duration: 0.6,
    category: "body",
    label: "High-Beam Projector (R)"
  },
  Mirror_L: {
    offset: [-0.1, -0.65, 0.25],
    delay: 0.1,
    duration: 0.65,
    category: "body"
  },
  Mirror_R: {
    offset: [-0.1, 0.65, 0.25],
    delay: 0.1,
    duration: 0.65,
    category: "body"
  },
  Side_Vent_L: {
    offset: [0.15, -0.55, 0.1],
    delay: 0.15,
    duration: 0.65,
    category: "body"
  },
  Side_Vent_R: {
    offset: [0.15, 0.55, 0.1],
    delay: 0.15,
    duration: 0.65,
    category: "body"
  },
  Side_Stripe_L: {
    offset: [0, -0.4, 0],
    delay: 0.15,
    duration: 0.6,
    category: "body"
  },
  Side_Stripe_R: {
    offset: [0, 0.4, 0],
    delay: 0.15,
    duration: 0.6,
    category: "body"
  },
  Body_Main: {
    offset: [0, 0, 0.1],
    delay: 0.2,
    duration: 0.6,
    category: "body",
    label: "Unibody Core Structure"
  },

  // Powertrain & Drivetrain
  Engine: {
    offset: [-0.1, 0, 0.2],
    delay: 0.4,
    duration: 0.55,
    category: "powertrain",
    label: "428 Cobra Jet V8 Engine"
  },
  Engine_Intake: {
    offset: [-0.1, 0, 0.45],
    delay: 0.35,
    duration: 0.6,
    category: "powertrain",
    label: "Dual-Plane High-Flow Intake"
  },
  Transmission: {
    offset: [0.2, 0, -0.15],
    delay: 0.45,
    duration: 0.5,
    category: "powertrain",
    label: "Toploader 4-Speed Manual Transmission"
  },
  Exhaust_L: {
    offset: [0.6, -0.2, -0.15],
    delay: 0.3,
    duration: 0.6,
    category: "powertrain",
    label: "Dual Side-Exit Exhaust System"
  },
  Exhaust_R: {
    offset: [0.6, 0.2, -0.15],
    delay: 0.3,
    duration: 0.6,
    category: "powertrain"
  },

  // Chassis & Frame
  Chassis: {
    offset: [0, 0, -0.35],
    delay: 0.5,
    duration: 0.5,
    category: "chassis",
    label: "Heavy-Duty Perimeter Chassis Frame"
  },

  // Suspension (expands slightly outward)
  FrontSuspension_L: {
    offset: [0, -0.3, 0],
    delay: 0.25,
    duration: 0.65,
    category: "chassis"
  },
  FrontSuspension_R: {
    offset: [0, 0.3, 0],
    delay: 0.25,
    duration: 0.65,
    category: "chassis"
  },
  RearSuspension_L: {
    offset: [0, -0.3, 0],
    delay: 0.25,
    duration: 0.65,
    category: "chassis"
  },
  RearSuspension_R: {
    offset: [0, 0.3, 0],
    delay: 0.25,
    duration: 0.65,
    category: "chassis"
  },

  // Brakes (slide outward to intermediate position)
  FrontBrakeDisc_L: {
    offset: [0, -0.65, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes",
    label: "Ventilated Front Disc Brake"
  },
  FrontBrakeCaliper_L: {
    offset: [0, -0.65, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes",
    label: "High-Performance Caliper"
  },
  FrontHub_L: {
    offset: [0, -0.5, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes"
  },

  FrontBrakeDisc_R: {
    offset: [0, 0.65, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes"
  },
  FrontBrakeCaliper_R: {
    offset: [0, 0.65, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes"
  },
  FrontHub_R: {
    offset: [0, 0.5, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes"
  },

  RearBrakeDisc_L: {
    offset: [0, -0.65, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes",
    label: "Rear Ventilated Disc Brake"
  },
  RearBrakeCaliper_L: {
    offset: [0, -0.65, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes"
  },
  RearHub_L: {
    offset: [0, -0.5, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes"
  },

  RearBrakeDisc_R: {
    offset: [0, 0.65, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes"
  },
  RearBrakeCaliper_R: {
    offset: [0, 0.65, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes"
  },
  RearHub_R: {
    offset: [0, 0.5, 0],
    delay: 0.2,
    duration: 0.7,
    category: "brakes"
  },

  // Wheels & Rims (maximum outward lateral displacement)
  FrontWheel_L: {
    offset: [0, -1.2, 0],
    delay: 0.15,
    duration: 0.75,
    category: "wheels",
    label: "Magstar Cast Wheel & Radial Tire (FL)"
  },
  FrontRim_L: {
    offset: [0, -1.2, 0],
    delay: 0.15,
    duration: 0.75,
    category: "wheels"
  },

  FrontWheel_R: {
    offset: [0, 1.2, 0],
    delay: 0.15,
    duration: 0.75,
    category: "wheels",
    label: "Magstar Cast Wheel & Radial Tire (FR)"
  },
  FrontRim_R: {
    offset: [0, 1.2, 0],
    delay: 0.15,
    duration: 0.75,
    category: "wheels"
  },

  RearWheel_L: {
    offset: [0, -1.2, 0],
    delay: 0.15,
    duration: 0.75,
    category: "wheels",
    label: "Magstar Cast Wheel & Wide Radial Tire (RL)"
  },
  RearRim_L: {
    offset: [0, -1.2, 0],
    delay: 0.15,
    duration: 0.75,
    category: "wheels"
  },

  RearWheel_R: {
    offset: [0, 1.2, 0],
    delay: 0.15,
    duration: 0.75,
    category: "wheels",
    label: "Magstar Cast Wheel & Wide Radial Tire (RR)"
  },
  RearRim_R: {
    offset: [0, 1.2, 0],
    delay: 0.15,
    duration: 0.75,
    category: "wheels"
  }
};

/**
 * Calculates current staged explosion factor (0 to 1) for a specific node given overall explosion progress
 */
export function getPartExplosionProgress(nodeName: string, globalExplosionProgress: number): number {
  const target = PART_EXPLOSION_MAP[nodeName];
  if (!target) return 0;

  const { delay, duration } = target;
  if (globalExplosionProgress <= delay) return 0;
  if (globalExplosionProgress >= delay + duration) return 1;

  const localT = (globalExplosionProgress - delay) / duration;
  // Smooth cubic ease out/in
  return localT * localT * (3 - 2 * localT);
}
