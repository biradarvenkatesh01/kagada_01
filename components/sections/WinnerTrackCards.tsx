"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, Image as ImageIcon, Cpu, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function WinnerTrackCards() {
  const [activeCard, setActiveCard] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 3 Winner Track Red-Tinted Glass Cards
  const cards = [
    {
      id: 0,
      title: "Paper Presentation",
      icon: FileText,
      link: "https://drive.google.com/drive/folders/1lRi76mdAld0b2_vnPImVYjpB2j2Zz0iW",
    },
    {
      id: 1,
      title: "Poster Presentation",
      icon: ImageIcon,
      link: "https://drive.google.com/drive/folders/1AKdGbdqLyxHwr6ZWauQmmgjjFBfO59uS",
    },
    {
      id: 2,
      title: "Project Presentation",
      icon: Cpu,
      link: "https://drive.google.com/drive/folders/1Xzn2vQoLUEN9mUnCeG4UOiWyjex2m-YY",
    },
  ];

  const scrollTickingRef = useRef(false);

  const handleScroll = () => {
    if (!scrollTickingRef.current) {
      window.requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          const containerEl = scrollContainerRef.current;
          const width = containerEl.clientWidth;
          if (width > 0) {
            const index = Math.round(containerEl.scrollLeft / width);
            if (index >= 0 && index < cards.length && index !== activeCard) {
              setActiveCard(index);
            }
          }
        }
        scrollTickingRef.current = false;
      });
      scrollTickingRef.current = true;
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const containerEl = scrollContainerRef.current;
    const width = containerEl.clientWidth;
    containerEl.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
    setActiveCard(index);
  };

  // Keep active card centered if window resizes (debounced with RAF)
  useEffect(() => {
    let resizeTimer: number;
    const handleResize = () => {
      cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        if (scrollContainerRef.current && window.innerWidth < 768) {
          const width = scrollContainerRef.current.clientWidth;
          scrollContainerRef.current.scrollTo({
            left: activeCard * width,
            behavior: "auto",
          });
        }
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(resizeTimer);
    };
  }, [activeCard]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl my-4 sm:my-8 px-0 sm:px-4">
      {/* 3 Horizontal Cards Container: Grid in Laptop/Desktop View, Full-Width 1-Card Carousel in Mobile View */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full flex md:grid md:grid-cols-3 gap-0 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-4 md:py-0 select-none scrollbar-none"
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            className="w-full shrink-0 snap-center flex items-center justify-center px-4 md:px-0 md:w-auto md:shrink"
          >
            <ScrollReveal direction="up" delay={i * 80} className="w-full flex justify-center">
              <div
                className={cn(
                  "w-full max-w-[320px] xs:max-w-[340px] sm:max-w-[360px] md:max-w-none md:w-full h-[360px] sm:h-[400px] lg:h-[440px]",
                  "rounded-3xl border-2 border-white/90 shadow-md shadow-black/10 backdrop-blur-xl bg-white/25",
                  "p-4 sm:p-8 flex flex-col justify-between items-center overflow-hidden transform-gpu select-none cursor-pointer group",
                  "hover:-translate-y-2 hover:scale-[1.02] hover:border-white hover:bg-white/35 transition-all duration-300"
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
                  <a
  href={card.link}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full py-3 px-5 sm:py-3.5 sm:px-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/80 text-white font-jakarta text-xs sm:text-base font-extrabold tracking-wide group-hover:bg-white/45 active:scale-[0.98] transition-all shadow-md shadow-black/10 flex items-center justify-center gap-2 group/btn cursor-pointer"
>
  <span>Explore Winners</span>
  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1" />
</a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>

      {/* Mobile Navigation Controls: Arrows + Indicator Dots */}
      <div className="flex md:hidden items-center justify-center gap-4 mt-5 z-20">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, activeCard - 1))}
          disabled={activeCard === 0}
          className={cn(
            "p-2 rounded-full border border-white/60 bg-white/20 backdrop-blur-md text-white transition-all",
            activeCard === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white/40 active:scale-95 cursor-pointer"
          )}
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
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

        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(cards.length - 1, activeCard + 1))}
          disabled={activeCard === cards.length - 1}
          className={cn(
            "p-2 rounded-full border border-white/60 bg-white/20 backdrop-blur-md text-white transition-all",
            activeCard === cards.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white/40 active:scale-95 cursor-pointer"
          )}
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
