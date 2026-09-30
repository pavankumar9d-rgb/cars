"use client";

import React, { useState } from "react";
import { CarColorId, CARS_DATA } from "../car/CarPartMap";
import { ArrowUpRight, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useLenis } from "@/providers/LenisProvider";
import SpotlightCard from "../react-bits/SpotlightCard";
import ShinyText from "../react-bits/ShinyText";

interface CTASectionProps {
  selectedCar: CarColorId;
}

export default function CTASection({ selectedCar }: CTASectionProps) {
  const { scrollTo } = useLenis();
  const car = CARS_DATA[selectedCar];
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", location: "Monaco Studio" });

  const handleReturnToTop = () => {
    scrollTo(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setModalOpen(false);
      setFormSubmitted(false);
    }, 2800);
  };

  return (
    <section className="relative w-full min-h-[120vh] flex flex-col justify-between p-8 md:p-16 select-none pointer-events-none">
      {/* Top Transition Bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-[0.3em] text-blue-400 uppercase">
          COMMISSION // PRIVATE ALLOCATION
        </span>
        <button
          onClick={handleReturnToTop}
          className="pointer-events-auto text-[10px] font-mono text-white/40 hover:text-white transition-colors uppercase tracking-widest"
        >
          ↑ RETURN TO ASSEMBLY
        </button>
      </div>

      {/* Main Hero CTA Card with SpotlightCard */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto pointer-events-auto">
        <SpotlightCard
          spotlightColor={car.accentHex + "40"}
          className="p-8 sm:p-12 md:p-16 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: car.accentHex }}
                />
                <span className="text-xs font-mono font-bold tracking-widest text-white/70 uppercase">
                  {car.badge} // {car.colorName}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-white uppercase tracking-tight leading-tight">
                <ShinyText text="BOOK A TEST DRIVE" speed={4} />
              </h2>
              <p className="mt-4 text-sm sm:text-base font-light text-white/70 leading-relaxed">
                Experience the visceral acoustic thunder and unadulterated mechanical response of the 428 Cobra Jet V8. Private viewing and dynamic road testing available through our private client concierge.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="group relative px-8 py-4 rounded-full bg-white text-black font-mono font-bold text-xs tracking-widest uppercase hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>SCHEDULE VIEWING</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-wider justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>CONFIDENTIAL CLIENT PROTOCOL</span>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Luxury Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto pb-8 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
        <div>
          © 2026 SHELBY AMERICAN GT500 EXPERIENCE. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-white transition-colors cursor-pointer pointer-events-auto">
            LEGAL ARCHIVE
          </span>
          <span className="hover:text-white transition-colors cursor-pointer pointer-events-auto">
            PRIVACY PROTOCOL
          </span>
          <span className="hover:text-white transition-colors cursor-pointer pointer-events-auto">
            DISCLOSURE
          </span>
        </div>
      </footer>

      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl pointer-events-auto">
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#090b10] border border-white/20 shadow-2xl text-white">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-display font-bold uppercase mb-2">
                  ALLOCATION INITIATED
                </h3>
                <p className="text-xs font-mono text-white/60">
                  Our private client director will contact you within 24 hours to finalize your test drive window for the {car.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase block mb-1">
                    COMMISSION REQUEST
                  </span>
                  <h3 className="text-xl font-display font-bold uppercase">
                    SCHEDULE TEST DRIVE
                  </h3>
                  <p className="text-xs font-mono text-white/50 mt-1">
                    Vehicle: {car.name} ({car.colorName})
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Christian Bale"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="client@concierge.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">
                      Direct Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-mono font-bold text-xs uppercase tracking-widest text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    CONFIRM PRIVATE VIEWING
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
