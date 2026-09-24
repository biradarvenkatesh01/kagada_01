"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  X,
  FileText,
  Image as ImageIcon,
  Cpu,
  ArrowRight,
} from "lucide-react";
import FlipClock from "@/components/ui/flip-clock";
import { KAGADA_EVENT_DATE } from "@/data/kagada-data";

interface HeroSectionProps {
  isIntroActive?: boolean;
}

const REGISTER_TRACKS = [
  {
    id: 1,
    name: "Paper Track",
    icon: FileText,
  },
  {
    id: 2,
    name: "Poster Track",
    icon: ImageIcon,
  },
  {
    id: 3,
    name: "Project Track",
    icon: Cpu,
  },
];

export const HeroSection = memo(function HeroSection({
  isIntroActive = false,
}: HeroSectionProps) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // 🔒 Scroll lock while register modal is open
  useEffect(() => {
    if (!isRegisterModalOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const lenis = (
      window as unknown as {
        __lenis?: { stop: () => void; start: () => void };
      }
    ).__lenis;
    if (lenis) {
      lenis.stop();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRegisterModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      if (lenis) {
        lenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRegisterModalOpen]);

  // 🎯 Navigate to the selected track card in the tracks section
  const handleSelectTrack = useCallback((trackId: number) => {
    // 1. Immediately unlock scroll so both native and Lenis can scroll without waiting for React unmount cycle
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    const lenis = (
      window as unknown as {
        __lenis?: {
          start: () => void;
          scrollTo: (
            target: HTMLElement | string,
            options?: Record<string, unknown>
          ) => void;
        };
      }
    ).__lenis;

    if (lenis) {
      lenis.start();
    }

    // 2. Close modal
    setIsRegisterModalOpen(false);

    // 3. Scroll to tracks first, then open the track card once arrived
    const tracksElem = document.getElementById("tracks");
    if (!tracksElem) {
      window.dispatchEvent(
        new CustomEvent("kagada:open-track", { detail: { id: trackId } })
      );
      return;
    }

    let opened = false;
    const triggerOpen = () => {
      if (opened) return;
      opened = true;
      window.dispatchEvent(
        new CustomEvent("kagada:open-track", { detail: { id: trackId } })
      );
    };

    if (lenis) {
      lenis.scrollTo(tracksElem, {
        offset: -40,
        duration: 1.0,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        onComplete: () => {
          setTimeout(triggerOpen, 150);
        },
      });
      // Safety fallback timer in case onComplete doesn't fire
      window.setTimeout(triggerOpen, 1250);
    } else {
      tracksElem.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(triggerOpen, 1000);
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] overflow-hidden flex items-center justify-center z-10 bg-black"
    >
      {/* Hero Background Responsive Origami Art Layer */}
      <motion.picture
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full min-h-full z-0 pointer-events-none select-none overflow-hidden"
      >
        {/* Desktop / PC widescreen view (>= 768px) */}
        <source
          media="(min-width: 768px)"
          srcSet="/optimized/hero-bg-desktop-2x.webp 2x, /optimized/hero-bg-desktop.webp 1x"
          type="image/webp"
        />
        {/* Mobile portrait view (< 768px) */}
        <source
          srcSet="/optimized/hero-bg-mobile-2x.webp 2x, /optimized/hero-bg-mobile.webp 1x"
          type="image/webp"
        />
        {/* Native Fallback img */}
        <img
          src="/optimized/hero-bg-desktop-2x.webp"
          alt="UVCE Origami Artwork"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full min-h-full object-cover object-center"
        />
      </motion.picture>

      {/* Hero Title & Subtitle Glass Box Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
        animate={{
          opacity: isIntroActive ? 0 : 1,
          scale: isIntroActive ? 0.95 : 1,
          y: isIntroActive ? "calc(-50% + 20px)" : "-50%",
          x: "-50%",
        }}
        transition={{
          type: "spring",
          stiffness: 85,
          damping: 20,
          delay: isIntroActive ? 0 : 0.25,
        }}
        className="absolute top-[48%] sm:top-1/2 left-1/2 z-15 w-[95%] sm:w-auto max-w-lg sm:max-w-none flex flex-col items-center justify-center text-center pointer-events-none transform-gpu"
      >
        {/* Title Paper Box containing Title + Subtitle */}
        <div className="w-full px-2 sm:px-4 md:px-6 pt-1 sm:pt-2 pb-2 sm:pb-3 md:pb-4 !rounded-2xl sm:!rounded-3xl kagada-paper-card border-2 border-white/95 shadow-xl shadow-black/15 flex flex-col items-center justify-center text-center mx-auto overflow-hidden">
          <img
            src="/kagada-2026-header-maroon.png"
            alt="Kagada 2026"
            width={800}
            height={200}
            className="w-full max-w-[280px] min-[360px]:max-w-[320px] sm:max-w-[420px] md:max-w-[550px] lg:max-w-[700px] h-auto object-contain mx-auto select-none -mt-6 sm:-mt-10 md:-mt-14 lg:-mt-20"
            draggable={false}
          />

          {/* Subtitle in Roboto Mono Font */}
          <p className="font-roboto-mono text-[0.7rem] min-[360px]:text-xs sm:text-base md:text-xl lg:text-2xl text-[#5A182B]/95 font-bold tracking-wider sm:tracking-widest -mt-4 min-[360px]:-mt-5 sm:-mt-7 md:-mt-10 lg:-mt-12 uppercase tshadow-sm select-none whitespace-normal sm:whitespace-nowrap leading-snug sm:leading-none max-w-[95%] sm:max-w-none mx-auto">
            Annual National - Level Technical Student Conference
          </p>
        </div>

        {/* Flip Clock Countdown Timer Paper Box */}
        <div className="mt-2.5 sm:mt-5 w-full max-w-[94vw] sm:max-w-fit mx-auto flex justify-center pointer-events-auto">
          <div className="hero-timer-box w-full sm:w-fit px-2.5 min-[340px]:px-3.5 min-[380px]:px-5 sm:px-6 py-2 min-[340px]:py-2.5 sm:py-3.5 !rounded-none kagada-paper-card border-2 border-white/95 shadow-lg shadow-black/15 text-[#5A182B] flex items-center justify-center text-center mx-auto overflow-hidden">
            <FlipClock
              countdown={true}
              targetDate={KAGADA_EVENT_DATE}
              size="sm"
              variant="default"
              showDays="always"
            />
          </div>
        </div>

        {/* 🌟 Register Now Button (Below Clock, Above Explore Tracks) */}
        <div className="mt-2.5 sm:mt-4 w-full flex justify-center pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="w-full sm:w-auto px-7 sm:px-10 py-2.5 sm:py-3.5 kagada-paper-card border-2 border-white/95 hover:border-white text-[#5A182B] font-roboto-mono font-bold text-xs sm:text-sm md:text-base uppercase tracking-widest shadow-lg hover:shadow-2xl shadow-black/20 hover:brightness-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer rounded-none"
            aria-label="Register for Kagada 2026 tracks"
          >
            <span>Register Now</span>
          </button>
        </div>
      </motion.div>

      {/* Bottom "Explore Tracks" CTA Indicator */}
      <motion.a
        href="#tracks"
        initial={{ opacity: 0, y: 20, x: "-50%" }}
        animate={{
          opacity: isIntroActive ? 0 : 1,
          y: isIntroActive ? 20 : 0,
          x: "-50%",
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 18,
          delay: isIntroActive ? 0 : 0.4,
        }}
        className="absolute bottom-3 sm:bottom-6 left-1/2 z-20 flex flex-col items-center gap-1.5 sm:gap-3 group pointer-events-auto transform-gpu"
      >
        <div className="px-5 py-1.5 sm:px-8 sm:py-2.5 !rounded-full kagada-paper-card border-2 border-white/95 shadow-lg shadow-black/15 flex items-center justify-center transition-glass duration-150 group-hover:border-white">
          <span className="font-roboto-mono text-xs sm:text-sm font-extrabold text-[#5A182B] tracking-widest uppercase tshadow-sm select-none whitespace-nowrap">
            Explore Tracks
          </span>
        </div>

        <div className="w-9 h-9 sm:w-12 sm:h-12 !rounded-full kagada-paper-card border-2 border-white/95 shadow-lg shadow-black/15 flex items-center justify-center text-[#5A182B] animate-bounce-subtle transition-glass duration-150 group-hover:border-white">
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8]" />
        </div>
      </motion.a>

      {/* 📱💻 Track Registration Selection Modal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isRegisterModalOpen && (
              <div
                data-lenis-prevent="true"
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 overscroll-none"
              >
                {/* Burgundy textured backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={() => setIsRegisterModalOpen(false)}
                  onWheel={(e) => e.preventDefault()}
                  onTouchMove={(e) => e.preventDefault()}
                  className="fixed inset-0 cursor-pointer overflow-hidden touch-none transform-gpu will-change-opacity"
                  aria-label="Close registration modal"
                >
                  <div className="absolute inset-0 bg-[#5A182B]/90" />
                  <div className="absolute inset-0 opacity-60 kagada-fabric-bg-texture pointer-events-none transform-gpu" />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at center, transparent 35%, rgba(15, 1, 4, 0.5) 100%)",
                    }}
                  />
                </motion.div>

                {/* Centered Parchment Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{
                    duration: 0.22,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 w-[92vw] max-w-[440px] sm:max-w-md pointer-events-auto transform-gpu will-change-transform will-change-opacity select-none"
                >
                  <div className="relative kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/40 !rounded-2xl sm:!rounded-3xl p-6 sm:p-8 text-slate-900 flex flex-col">
                    {/* Close button */}
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(false)}
                      className="absolute top-4 right-4 z-30 w-8 h-8 !rounded-full bg-[#D8D3C7] border border-[#5A182B]/30 text-[#5A182B] hover:bg-white transition-colors flex items-center justify-center shadow-md cursor-pointer"
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4 text-[#5A182B]" />
                    </button>

                    {/* Header Title */}
                    <div className="flex flex-col items-center justify-center border-b border-[#5A182B]/20 pb-3 mb-4 w-full text-center">
                      <h3 className="font-smooch text-4xl sm:text-5xl font-semibold text-[#5A182B] tracking-wide leading-none">
                        Register for Tracks
                      </h3>
                      <p className="font-roboto-mono text-xs sm:text-[0.8rem] text-slate-700 font-bold uppercase tracking-wider mt-1.5">
                        Select a track to view details & register
                      </p>
                    </div>

                    {/* 3 Track Selection Buttons */}
                    <div className="flex flex-col gap-3 sm:gap-3.5 w-full">
                      {REGISTER_TRACKS.map((track) => {
                        const Icon = track.icon;
                        return (
                          <button
                            key={track.id}
                            type="button"
                            onClick={() => handleSelectTrack(track.id)}
                            className="w-full bg-[#EAE5D9] hover:bg-white active:bg-[#D8D3C7] text-[#5A182B] border-2 border-[#5A182B]/30 hover:border-[#5A182B] py-3.5 px-4 sm:px-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-between group cursor-pointer active:scale-[0.98]"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-full bg-white/80 border border-[#5A182B]/20 flex items-center justify-center text-[#5A182B] group-hover:scale-110 transition-transform shrink-0">
                                <Icon className="w-5 h-5 stroke-[2]" />
                              </div>
                              <span className="font-roboto-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#5A182B]">
                                {track.name}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A182B]/60 group-hover:text-[#5A182B] group-hover:translate-x-1 transition-all shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
});

export default HeroSection;
