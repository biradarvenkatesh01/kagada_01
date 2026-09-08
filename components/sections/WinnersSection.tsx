"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Hero10 } from "@/components/ui/hero-10";

export const WinnersSection = memo(function WinnersSection() {
  return (
    <section
      id="winners"
      className="relative w-full text-slate-900 flex flex-col items-center justify-start z-10 px-0 sm:px-4 pt-6 sm:pt-10 pb-12 sm:pb-16 scroll-mt-6"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4 sm:px-0">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-saman text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-lg mb-3 sm:mb-4 tracking-tight text-center select-none"
        >
          Previous Winners
        </motion.h2>

        {/* Subtitle text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-jakarta font-medium text-white/90 text-base sm:text-lg md:text-xl max-w-2xl text-center drop-shadow-sm mb-4 sm:mb-8"
        >
          Honoring innovation, creativity, and excellence that shaped KAGADA’s journey.
        </motion.p>

        {/* 3 Interactive Cards */}
        <div className="w-full flex items-center justify-center">
          <Hero10 animation="subtle" />
        </div>
      </div>
    </section>
  );
});

export default WinnersSection;
