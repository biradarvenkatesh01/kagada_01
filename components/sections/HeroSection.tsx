"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import FlipClock from "@/components/ui/flip-clock";
import { KAGADA_EVENT_DATE } from "@/data/kagada-data";

interface HeroSectionProps {
  isVideoFading: boolean;
}

export const HeroSection = memo(function HeroSection({ isVideoFading }: HeroSectionProps) {
  return (
    <section id="hero" className="relative w-full h-screen min-h-[100dvh] overflow-hidden flex items-center justify-center z-10">
      {/* Hero Background Photo Layer with Soft Blend */}
      <motion.img
        src="/optimized/hero-bg.webp"
        alt="UVCE Building"
        data-no-lightbox="true"
        fetchPriority="high"
        decoding="async"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVideoFading ? 0.85 : 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full min-h-[100dvh] object-cover z-0 mix-blend-overlay pointer-events-none select-none"
      />

      {/* 🔴 VERY LIGHT RED TINT LAYER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVideoFading ? 1 : 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full min-h-[100dvh] bg-[#8a1c1c]/15 pointer-events-none select-none z-[1]"
        aria-hidden="true"
      />

      {/* Hero Title & Subtitle Glass Box Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30, x: "-50%" }}
        animate={{
          opacity: isVideoFading ? 1 : 0,
          scale: isVideoFading ? 1 : 0.95,
          y: isVideoFading ? "-50%" : "30px",
          x: "-50%",
        }}
        transition={{
          type: "spring",
          stiffness: 85,
          damping: 20,
          delay: 0.25,
        }}
        className="absolute top-[48%] sm:top-1/2 left-1/2 z-15 w-[95%] sm:w-auto max-w-lg sm:max-w-none flex flex-col items-center justify-center text-center pointer-events-none transform-gpu"
      >
        {/* Title Glass Box containing Title + Subtitle */}
        <div className="w-full px-2.5 min-[360px]:px-3 sm:px-10 py-4 min-[360px]:py-5 sm:py-8 rounded-2xl sm:rounded-3xl bg-white/60 backdrop-blur-md border border-white/85 shadow-xl shadow-black/10 flex flex-col items-center justify-center text-center mx-auto overflow-hidden">
          <h1 className="whitespace-nowrap font-saman font-normal text-[2.65rem] min-[360px]:text-[3.1rem] xs:text-[3.6rem] sm:text-6xl md:text-7xl lg:text-[8.5rem] text-[#8a1c1c] tracking-[-0.015em] tshadow-sm select-none leading-none text-center mx-auto">
            K<span className="inline-block ml-[0.03em]">a</span>g<span className="inline-block ml-[0.03em]">a</span>d<span className="inline-block ml-[0.03em]">a</span> 2026
          </h1>

          {/* Subtitle in Roboto Mono Font */}
          <p className="font-roboto-mono text-[0.7rem] min-[360px]:text-xs sm:text-base md:text-xl lg:text-2xl text-[#8a1c1c]/95 font-bold tracking-wider sm:tracking-widest mt-3 min-[360px]:mt-4 sm:mt-7 uppercase tshadow-sm select-none whitespace-normal sm:whitespace-nowrap leading-snug sm:leading-none max-w-[95%] sm:max-w-none mx-auto">
            Annual National - Level Technical Student Conference
          </p>
        </div>

        {/* Flip Clock Countdown Timer Glass Box */}
        <div className="mt-3.5 sm:mt-6 w-full max-w-[94vw] sm:max-w-fit mx-auto flex justify-center pointer-events-auto">
          <div className="w-full sm:w-fit px-2.5 min-[340px]:px-3.5 min-[380px]:px-5 sm:px-6 py-2 min-[340px]:py-2.5 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-white/60 backdrop-blur-md border border-white/85 shadow-lg shadow-black/10 text-[#8a1c1c] flex items-center justify-center text-center mx-auto overflow-hidden">
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
        initial={{ opacity: 0, y: 30, x: "-50%" }}
        animate={{
          opacity: isVideoFading ? 1 : 0,
          y: isVideoFading ? 0 : 30,
          x: "-50%",
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 18,
          delay: 0.4,
        }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 z-20 flex flex-col items-center gap-6 sm:gap-8 group pointer-events-auto transform-gpu"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/80 shadow-md shadow-black/10 flex items-center justify-center"
        >
          <span className="font-roboto-mono text-xs sm:text-sm font-bold text-[#8a1c1c]/95 tracking-widest uppercase tshadow-sm select-none group-hover:text-[#8a1c1c] whitespace-nowrap">
            Explore Tracks
          </span>
        </motion.div>

        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/80 shadow-md shadow-black/10 flex items-center justify-center text-[#8a1c1c] animate-bounce-subtle group-hover:scale-110 transition-transform duration-200"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </div>
      </motion.a>
    </section>
  );
});

export default HeroSection;
