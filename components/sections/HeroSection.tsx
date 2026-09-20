"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import FlipClock from "@/components/ui/flip-clock";
import { KAGADA_EVENT_DATE } from "@/data/kagada-data";

interface HeroSectionProps {
  isIntroActive?: boolean;
}

export const HeroSection = memo(function HeroSection({ isIntroActive = false }: HeroSectionProps) {
  return (
    <section id="hero" className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex items-center justify-center z-10 bg-black">
      {/* Hero Background Responsive Origami Art Layer */}
      <motion.picture
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full min-h-[100dvh] z-0 pointer-events-none select-none overflow-hidden"
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
          className="w-full h-full min-h-[100dvh] object-cover object-center"
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
        <div className="w-full px-2.5 min-[360px]:px-3 sm:px-10 py-4 min-[360px]:py-5 sm:py-8 !rounded-2xl sm:!rounded-3xl kagada-paper-card border-2 border-white/95 shadow-xl shadow-black/15 flex flex-col items-center justify-center text-center mx-auto overflow-hidden">
          <h1 className="whitespace-nowrap font-saman font-normal text-[2.65rem] min-[360px]:text-[3.1rem] xs:text-[3.6rem] sm:text-6xl md:text-7xl lg:text-[8.5rem] text-[#5A182B] tracking-[-0.015em] tshadow-sm select-none leading-none text-center mx-auto">
            K<span className="inline-block ml-[0.03em]">a</span>g<span className="inline-block ml-[0.03em]">a</span>d<span className="inline-block ml-[0.03em]">a</span> 2026
          </h1>

          {/* Subtitle in Roboto Mono Font */}
          <p className="font-roboto-mono text-[0.7rem] min-[360px]:text-xs sm:text-base md:text-xl lg:text-2xl text-[#5A182B]/95 font-bold tracking-wider sm:tracking-widest mt-3 min-[360px]:mt-4 sm:mt-7 uppercase tshadow-sm select-none whitespace-normal sm:whitespace-nowrap leading-snug sm:leading-none max-w-[95%] sm:max-w-none mx-auto">
            Annual National - Level Technical Student Conference
          </p>
        </div>

        {/* Flip Clock Countdown Timer Paper Box */}
        <div className="mt-3.5 sm:mt-6 w-full max-w-[94vw] sm:max-w-fit mx-auto flex justify-center pointer-events-auto">
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
        className="absolute bottom-5 sm:bottom-8 left-1/2 z-20 flex flex-col items-center gap-3 sm:gap-4 group pointer-events-auto transform-gpu"
      >
        <div
          className="px-6 py-2.5 sm:px-8 sm:py-3 !rounded-full kagada-paper-card border-2 border-white/95 shadow-lg shadow-black/15 flex items-center justify-center transition-glass duration-150 group-hover:border-white"
        >
          <span className="font-roboto-mono text-sm sm:text-base font-extrabold text-[#5A182B] tracking-widest uppercase tshadow-sm select-none whitespace-nowrap">
            Explore Tracks
          </span>
        </div>

        <div
          className="w-12 h-12 sm:w-14 sm:h-14 !rounded-full kagada-paper-card border-2 border-white/95 shadow-lg shadow-black/15 flex items-center justify-center text-[#5A182B] animate-bounce-subtle transition-glass duration-150 group-hover:border-white"
        >
          <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.8]" />
        </div>
      </motion.a>
    </section>
  );
});

export default HeroSection;
