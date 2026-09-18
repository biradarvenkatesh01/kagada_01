import { ScrollReveal } from "@/components/ui/scroll-reveal";
import WinnerTrackCards from "@/components/sections/WinnerTrackCards";

export function WinnersSection() {
  return (
    <section
      id="winners"
      className="relative w-full text-slate-900 flex flex-col items-center justify-start z-10 px-0 sm:px-4 pt-6 sm:pt-10 pb-12 sm:pb-16 scroll-mt-6"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4 sm:px-0">
        {/* Section Heading */}
        <ScrollReveal direction="down" duration={500}>
          <h2 className="font-saman text-5xl sm:text-7xl md:text-8xl text-white tshadow-lg mb-3 sm:mb-4 tracking-tight text-center select-none">
            Previous <span className="text-amber-400 tshadow-md">Winners</span>
          </h2>
        </ScrollReveal>

        {/* Subtitle text */}
        <ScrollReveal direction="up" delay={60} duration={500}>
          <p className="font-jakarta font-medium text-white/90 text-base sm:text-lg md:text-xl max-w-2xl text-center tshadow-sm mb-4 sm:mb-8">
            Honoring innovation, creativity and excellence that shaped KAGADA’s journey.
          </p>
        </ScrollReveal>

        {/* 3 Interactive Winner Track Cards */}
        <div className="w-full flex items-center justify-center">
          <WinnerTrackCards />
        </div>
      </div>
    </section>
  );
}

export default WinnersSection;
