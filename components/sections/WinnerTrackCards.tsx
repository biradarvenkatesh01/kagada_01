"use client";

import { useState, useRef, useEffect, memo } from "react";
import { FileText, Image as ImageIcon, Cpu, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// 3 Winner Track Red-Tinted Glass Cards (Allocated statically once)
const WINNER_CARDS = [
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
    <div className="flex flex-col items-center justify-center w-full max-w-5xl my-3 sm:my-6 px-0 sm:px-4">
      {/* 3 Horizontal Cards Container: Grid in Laptop/Desktop View, Full-Width 1-Card Carousel in Mobile View. */}
      <div className="w-full">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full flex md:grid md:grid-cols-3 gap-0 md:gap-5 lg:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-4 md:py-0 select-none scrollbar-none"
        >
          {WINNER_CARDS.map((card) => (
            <div
              key={card.id}
              className="w-full shrink-0 snap-center flex items-center justify-center px-4 md:px-0 md:w-auto md:shrink"
            >
              <div className="w-full flex justify-center">
                <div
                  className={cn(
                    "w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[310px] lg:max-w-[330px] md:w-full h-[320px] sm:h-[360px] lg:h-[390px]",
                    "kagada-paper-card rounded-3xl border-2 border-white/95 shadow-xl shadow-black/25",
                    "p-4 sm:p-6 flex flex-col justify-between items-center overflow-hidden select-none cursor-pointer group",
                    "hover:shadow-2xl hover:border-white transition-glass duration-300"
                  )}
                >
                  {/* Card Header: Title Centered Horizontally */}
                  <div className="flex items-center justify-center w-full z-10 text-center px-1">
                    <h3 className="font-smooch text-3xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#5A182B] tracking-wide text-center leading-tight whitespace-normal break-words">
                      {card.title}
                    </h3>
                  </div>

                  {/* Center Prominent Burgundy SVG Icon (without circular frame) */}
                  <div className="flex-1 my-2 sm:my-4 flex items-center justify-center z-10">
                    <card.icon className="w-20 h-20 sm:w-26 sm:h-26 lg:w-30 lg:h-30 stroke-[1.6] text-[#5A182B] drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
                  </div>

                  {/* Bottom CTA Button: Off-White Bg with Burgundy Maroon text */}
                  <div className="w-full z-10">
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 sm:py-3 sm:px-5 rounded-2xl kagada-paper-card hover:brightness-105 border-2 border-[#5A182B]/30 hover:border-[#5A182B]/60 text-[#5A182B] font-jakarta text-xs sm:text-sm font-extrabold tracking-wide transition-glass duration-200 shadow-md shadow-black/15 flex items-center justify-center gap-2 group/btn cursor-pointer"
                    >
                      <span>Explore Winners</span>
                      <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#5A182B] transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Controls: Arrows + Indicator Dots */}
      <div className="flex md:hidden items-center justify-center gap-4 mt-5 z-20">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, activeCard - 1))}
          disabled={activeCard === 0}
          className={cn(
            "p-2 rounded-full border-2 border-[#5A182B]/30 kagada-paper-card text-[#5A182B] shadow-md transition-glass duration-150",
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
                "h-2.5 rounded-full transition-[width,background-color] duration-300 cursor-pointer",
                activeCard === i
                  ? "w-8 bg-[#5A182B]"
                  : "w-2.5 bg-[#D8D3C7]/60 hover:bg-[#D8D3C7]"
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
            "p-2 rounded-full border-2 border-[#5A182B]/30 kagada-paper-card text-[#5A182B] shadow-md transition-glass duration-150",
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
