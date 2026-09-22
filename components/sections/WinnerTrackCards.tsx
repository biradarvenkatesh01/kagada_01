"use client";

import { useState, useRef, useEffect, memo } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WinnerCardItem {
  id: number;
  line1: string;
  line2: string;
  artSrc: string;
  link: string;
}

// 3 Winner Track Cards matching the scrapbook polaroid & paper torn style
const WINNER_CARDS: WinnerCardItem[] = [
  {
    id: 0,
    line1: "Paper",
    line2: "Presentation",
    artSrc: "/winners/paper-presentation.jpg?v=3",
    link: "https://drive.google.com/drive/folders/1lRi76mdAld0b2_vnPImVYjpB2j2Zz0iW",
  },
  {
    id: 1,
    line1: "Poster",
    line2: "Presentation",
    artSrc: "/winners/poster-presentation.jpg?v=3",
    link: "https://drive.google.com/drive/folders/1AKdGbdqLyxHwr6ZWauQmmgjjFBfO59uS",
  },
  {
    id: 2,
    line1: "Project",
    line2: "Presentation",
    artSrc: "/winners/project-presentation.jpg?v=3",
    link: "https://drive.google.com/drive/folders/1Xzn2vQoLUEN9mUnCeG4UOiWyjex2m-YY",
  },
];

export const WinnerTrackCards = memo(function WinnerTrackCards() {
  const [activeCard, setActiveCard] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTickingRef = useRef(false);

  const handleScroll = () => {
    if (!scrollTickingRef.current) {
      window.requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          const containerEl = scrollContainerRef.current;
          const width = containerEl.clientWidth;
          if (width > 0) {
            const index = Math.round(containerEl.scrollLeft / width);
            if (index >= 0 && index < WINNER_CARDS.length && index !== activeCard) {
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
      {/* 3 Horizontal Cards Container: Grid on Tablet/Desktop (md+), Swipeable Carousel on Mobile (<md) */}
      <div className="w-full">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full flex md:grid md:grid-cols-3 gap-0 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-4 md:py-0 select-none scrollbar-none justify-items-center"
        >
          {WINNER_CARDS.map((card) => (
            <div
              key={card.id}
              className="w-full shrink-0 snap-center flex items-center justify-center px-4 md:px-0 md:w-auto md:shrink"
            >
              <div className="w-full flex justify-center">
                <div
                  className={cn(
                    "w-[310px] sm:w-[320px] lg:w-[350px] shrink-0 h-[450px] sm:h-[480px] lg:h-[510px]",
                    "kagada-paper-card border border-white/80 shadow-2xl shadow-black/25",
                    "p-6 sm:p-7 flex flex-col justify-between items-center select-none group",
                    "hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-all duration-300"
                  )}
                >
                  {/* Card Header: Bold 2-line Burgundy Title */}
                  <div className="flex items-center justify-center w-full z-10 text-center pt-1">
                    <h3 className="font-outfit text-3xl sm:text-3.5xl lg:text-4xl font-bold text-[#5A182B] tracking-tight text-center leading-[1.12]">
                      {card.line1}
                      <br />
                      {card.line2}
                    </h3>
                  </div>

                  {/* Center Scrapbook Collage Artwork (with angled polaroid, masking tape & torn paper) */}
                  <div className="flex-1 my-2 sm:my-3 flex items-center justify-center w-full overflow-hidden z-10">
                    <img
                      src={card.artSrc}
                      alt={`${card.line1} ${card.line2} Showcase`}
                      loading="lazy"
                      decoding="async"
                      className="w-full max-w-[320px] sm:max-w-[340px] h-[250px] sm:h-[280px] object-contain transition-transform duration-300 ease-out group-hover:scale-105 select-none pointer-events-none drop-shadow-sm"
                    />
                  </div>

                  {/* Bottom CTA: Rectangular Thin-Border Button */}
                  <div className="w-full z-10 flex justify-center pb-1">
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full max-w-[230px] sm:max-w-[250px] py-2.5 px-4 border border-[#5A182B] bg-transparent hover:bg-[#5A182B] text-[#5A182B] hover:text-[#ECE7DF] font-jakarta text-sm sm:text-base font-semibold tracking-wide transition-all duration-200 shadow-sm flex items-center justify-center gap-2.5 group/btn cursor-pointer"
                    >
                      <span>Explore Winners</span>
                      <ArrowRight className="w-4 h-4 text-current transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Controls: Arrows + Indicator Dots (Visible on mobile only) */}
      <div className="flex md:hidden items-center justify-center gap-4 mt-6 z-20">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, activeCard - 1))}
          disabled={activeCard === 0}
          className={cn(
            "p-2.5 border border-[#5A182B]/40 kagada-paper-card text-[#5A182B] shadow-md transition-all duration-150",
            activeCard === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white active:bg-white/80 cursor-pointer"
          )}
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {WINNER_CARDS.map((card, i) => (
            <button
              key={`dot-${card.id}`}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "h-2 transition-[width,background-color] duration-300 cursor-pointer",
                activeCard === i
                  ? "w-7 bg-[#D8D3C7]"
                  : "w-2 bg-[#D8D3C7]/40 hover:bg-[#D8D3C7]/70"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(WINNER_CARDS.length - 1, activeCard + 1))}
          disabled={activeCard === WINNER_CARDS.length - 1}
          className={cn(
            "p-2.5 border border-[#5A182B]/40 kagada-paper-card text-[#5A182B] shadow-md transition-all duration-150",
            activeCard === WINNER_CARDS.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white active:bg-white/80 cursor-pointer"
          )}
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

export default WinnerTrackCards;
