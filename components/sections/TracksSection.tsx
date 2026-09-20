"use client";

import { memo } from "react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { TRACKS_TIMELINE_DATA } from "@/data/kagada-data";

export const TracksSection = memo(function TracksSection() {
  return (
    <section
      id="tracks"
      className="relative w-full text-slate-900 flex flex-col items-center justify-start z-30 px-4 pt-2 sm:pt-4 pb-2 sm:pb-4 scroll-mt-6 overflow-visible"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-start text-center">
        {/* Section Heading */}
        <ScrollReveal as="h2" y={15} duration={0.4} className="font-saman text-5xl sm:text-7xl md:text-8xl text-[#E8E5DC] tshadow-lg mb-1 tracking-tight text-center select-none">
          Tracks
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal as="p" y={12} delay={60} duration={0.4} className="font-roboto-mono text-xs sm:text-sm md:text-base text-amber-400 font-bold tracking-wider sm:tracking-widest uppercase mb-2 sm:mb-4 tshadow-md select-none">
          Click on any track icon to explore details
        </ScrollReveal>

        {/* Radial Orbital Timeline Component */}
        <div className="w-full flex items-center justify-center">
          <RadialOrbitalTimeline timelineData={TRACKS_TIMELINE_DATA} />
        </div>
      </div>
    </section>
  );
});

export default TracksSection;
