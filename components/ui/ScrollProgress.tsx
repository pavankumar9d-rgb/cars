"use client";

import React from "react";
import { useLenis } from "@/providers/LenisProvider";

interface ScrollProgressProps {
  progress: number;
  currentSection: string;
}

const MILESTONES = [
  { id: "assembly", label: "01 ASSEMBLY", target: 0 },
  { id: "collection", label: "02 COLLECTION", target: 0.24 },
  { id: "orbit", label: "03 360° ORBIT", target: 0.48 },
  { id: "powertrain", label: "04 POWERTRAIN", target: 0.70 },
  { id: "exploded", label: "05 EXPLODED", target: 0.80 },
  { id: "specs", label: "06 SPECS & CTA", target: 0.95 },
];

export default function ScrollProgress({ progress, currentSection }: ScrollProgressProps) {
  const { scrollTo } = useLenis();

  const handleJump = (targetFraction: number) => {
    if (typeof window !== "undefined") {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollTo(targetFraction * maxScroll);
    }
  };

  return (
    <div className="fixed right-3 md:right-8 top-1/2 -translate-y-1/2 z-40 flex items-center pointer-events-auto">
      {/* Label and Milestone List for Desktop */}
      <div className="hidden lg:flex flex-col items-end gap-5 mr-4 select-none">
        {MILESTONES.map((m) => {
          const isActive = currentSection === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleJump(m.target)}
              className="group flex items-center gap-3 text-right cursor-pointer py-1 transition-all"
            >
              <span
                className={`text-[10px] font-mono tracking-widest transition-all duration-300 ${
                  isActive
                    ? "text-blue-400 font-bold opacity-100 translate-x-0"
                    : "text-white/30 opacity-60 group-hover:opacity-100 group-hover:text-white"
                }`}
              >
                {m.label}
              </span>
              <span
                className={`h-[1px] transition-all duration-300 ${
                  isActive
                    ? "w-6 bg-blue-400"
                    : "w-2 bg-white/20 group-hover:w-3 group-hover:bg-white/60"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Vertical Track and Thumb */}
      <div className="relative w-[2px] h-48 md:h-64 bg-white/10 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] transition-all duration-100"
          style={{ height: `${Math.max(4, Math.round(progress * 100))}%` }}
        />
      </div>
    </div>
  );
}
