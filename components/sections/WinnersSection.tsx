"use client";

import * as React from "react";
import { useState, useRef, memo } from "react";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, Cpu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function WinnerTrackCards() {
  const [activeCard, setActiveCard] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 3 Winner Track Red-Tinted Glass Cards
  const cards = [
    {
      id: 0,
      title: "Paper Presentation",
      icon: FileText,
    },
    {
      id: 1,
      title: "Poster Presentation",
      icon: ImageIcon,
    },
    {
      id: 2,
      title: "Project Presentation",
      icon: Cpu,
    },
  ];

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const containerEl = scrollContainerRef.current;
    const firstChild = containerEl.firstElementChild as HTMLElement | null;
    const cardWidth = firstChild?.getBoundingClientRect().width || 300;
    const scrollPosition = containerEl.scrollLeft;
    const index = Math.round(scrollPosition / (cardWidth + 16));
    if (index >= 0 && index < cards.length) {
      setActiveCard(index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const containerEl = scrollContainerRef.current;
    const firstChild = containerEl.firstElementChild as HTMLElement | null;
    const cardWidth = firstChild?.getBoundingClientRect().width || 300;
    containerEl.scrollTo({
      left: index * (cardWidth + 16),
      behavior: "smooth",
    });
    setActiveCard(index);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl my-4 sm:my-8 px-0 sm:px-4">
      {/* 3 Horizontal Cards Container: Grid in Laptop/Desktop View, Slidable Row in Mobile View */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full flex md:grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 pr-8 py-4 md:mx-0 md:px-0 md:py-0 select-none scrollbar-none"
      >
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={cn(
              "shrink-0 snap-center w-[80vw] max-w-[285px] xs:max-w-[310px] md:w-full md:max-w-none h-[350px] sm:h-[400px] lg:h-[440px]",
              "rounded-3xl border-2 border-white/90 shadow-md shadow-black/10 backdrop-blur-xl bg-white/25",
              "p-4 sm:p-8 flex flex-col justify-between items-center overflow-hidden transform-gpu select-none cursor-pointer group",
              "hover:border-white hover:bg-white/35 transition-all duration-300"
            )}
          >
            {/* Subtle Glass Interior Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none rounded-3xl" />

            {/* Card Header: Title Centered Horizontally */}
            <div className="flex items-center justify-center w-full z-10 text-center px-1">
              <h3 className="font-smooch text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-wide drop-shadow-md text-center leading-tight whitespace-normal break-words">
                {card.title}
              </h3>
            </div>

            {/* Center Prominent Red Glass SVG Icon Badge */}
            <div className="flex-1 my-3 sm:my-6 flex items-center justify-center z-10">
              <div className="w-22 h-22 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-white/30 backdrop-blur-xl border-2 border-white/80 text-white flex items-center justify-center shadow-md shadow-black/10 transform-gpu group-hover:scale-110 transition-transform duration-300">
                <card.icon className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 stroke-[1.8] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" />
              </div>
            </div>

            {/* Bottom CTA Red Glass Button */}
            <div className="w-full z-10">
              <button
                type="button"
                className="w-full py-3 px-5 sm:py-3.5 sm:px-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/80 text-white font-jakarta text-xs sm:text-base font-extrabold tracking-wide group-hover:bg-white/45 active:scale-[0.98] transition-all shadow-md shadow-black/10 flex items-center justify-center gap-2 group/btn cursor-pointer"
              >
                <span>Explore Winners</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Indicator Dots for Mobile View */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-4 z-20">
        {cards.map((card, i) => (
          <button
            key={`dot-${card.id}`}
            onClick={() => scrollToIndex(i)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
              activeCard === i
                ? "w-8 bg-white"
                : "w-2.5 bg-white/40 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

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

        {/* 3 Interactive Winner Track Cards */}
        <div className="w-full flex items-center justify-center">
          <WinnerTrackCards />
        </div>
      </div>
    </section>
  );
});

export default WinnersSection;
