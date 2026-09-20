"use client";

import { memo } from "react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { TRACKS_TIMELINE_DATA } from "@/data/kagada-data";

export const TracksSection = memo(function TracksSection() {
  return (
    <section
      id="tracks"
      className="relative w-full text-slate-900 flex flex-col items-center justify-start z-30 px-4 py-8 sm:py-12 scroll-mt-6 overflow-visible"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-start text-center">
        {/* Section Heading */}
        <h2 data-reveal className="font-saman text-5xl sm:text-7xl md:text-8xl text-[#D8D3C7] tshadow-lg mb-1 tracking-tight text-center select-none">
          Tracks
        </h2>

        {/* Subtitle */}
        <p data-reveal className="font-roboto-mono text-xs sm:text-sm md:text-base text-amber-400 font-bold tracking-wider sm:tracking-widest uppercase mb-2 sm:mb-4 tshadow-md select-none">
          Click on any track icon to explore details
        </p>

        {/* Radial Orbital Timeline Component */}
        <div className="w-full flex items-center justify-center">
          <RadialOrbitalTimeline timelineData={TRACKS_TIMELINE_DATA} />
        </div>
      </div>
    </section>
  );
});

export default TracksSection;
