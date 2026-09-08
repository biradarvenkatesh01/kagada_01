"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { TRACKS_TIMELINE_DATA } from "@/data/kagada-data";

export const TracksSection = memo(function TracksSection() {
  return (
    <section
      id="tracks"
      className="relative w-full min-h-[750px] sm:min-h-[820px] md:min-h-[860px] text-slate-900 flex flex-col items-center justify-start z-40 px-4 pt-2 sm:pt-4 pb-12 sm:pb-16 scroll-mt-6"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-start text-center">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-saman text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-lg mb-1 tracking-tight text-center select-none"
        >
          Tracks
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-roboto-mono text-xs sm:text-sm md:text-base text-amber-400 font-bold tracking-wider sm:tracking-widest uppercase mb-2 sm:mb-4 drop-shadow-md select-none"
        >
          Click on any track icon to explore details
        </motion.p>

        {/* Radial Orbital Timeline Component */}
        <div className="w-full flex items-center justify-center">
          <RadialOrbitalTimeline timelineData={TRACKS_TIMELINE_DATA} />
        </div>
      </div>
    </section>
  );
});

export default TracksSection;
