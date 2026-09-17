import ScrollReveal from "@/components/ui/scroll-reveal";
import { Trophy, Award } from "lucide-react";

export function PrizePoolSection() {
  return (
    <section
      id="prizes"
      className="relative w-full text-slate-900 flex flex-col items-center justify-start z-10 px-4 pt-0 sm:pt-2 pb-12 sm:pb-16 -mt-16 sm:-mt-24 scroll-mt-6"
    >
      <div className="relative z-10 w-full max-w-xl md:max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <ScrollReveal as="h2" y={15} duration={0.4} className="font-saman text-4xl sm:text-6xl md:text-7xl text-white drop-shadow-lg mb-6 sm:mb-8 tracking-tight text-center select-none">
          Prize <span className="text-amber-400 drop-shadow-md">Pool</span>
        </ScrollReveal>

        <div className="w-full flex flex-col items-center gap-5 sm:gap-6">
          {/* Box 1: Total Prize Money Translucent Glass Card */}
          <ScrollReveal
            y={20}
            scale={0.98}
            duration={0.45}
            className="relative w-full bg-white/40 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/20 rounded-3xl p-5 sm:p-7 md:p-8 text-white flex flex-col items-center text-center overflow-hidden transform-gpu"
          >
            {/* Circular Trophy SVG Icon Glass Badge */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/40 backdrop-blur-md border-2 border-white/80 text-white flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-black/10">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] drop-shadow-sm" />
            </div>

            {/* Card Title in Smooch Sans */}
            <h3 className="font-smooch text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-wide text-center leading-none mb-1.5 sm:mb-2 drop-shadow-md">
              Total Prize Money
            </h3>

            {/* Prize Amount in Roboto Mono */}
            <div className="font-roboto-mono font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] mb-3 sm:mb-4">
              ₹40,000
            </div>

            {/* Description Paragraph */}
            <p className="font-jakarta text-xs sm:text-sm text-white/95 leading-relaxed font-medium max-w-lg mx-auto drop-shadow-sm">
              Exciting rewards await at <strong className="font-extrabold text-white">KAGADA 2026</strong>! A total prize pool of <strong className="font-extrabold text-white">₹40,000</strong> will be shared across <strong className="font-extrabold text-white">Paper, Poster and Project presentations</strong>, celebrating creativity, technical excellence and impactful ideas.
            </p>
          </ScrollReveal>

          {/* Box 2: Certificate Participation Translucent Glass Banner */}
          <ScrollReveal
            y={16}
            delay={80}
            duration={0.45}
            className="relative w-full max-w-lg mx-auto bg-white/40 backdrop-blur-2xl border-2 border-white/80 shadow-xl shadow-black/20 rounded-2xl sm:rounded-3xl py-3 px-5 sm:py-3.5 sm:px-6 text-white flex items-center justify-center gap-2.5 sm:gap-3 text-center overflow-hidden transform-gpu"
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0 drop-shadow-sm" />
            <p className="font-jakarta text-xs sm:text-sm text-white font-semibold leading-snug drop-shadow-sm">
              Every participant will be awarded a <strong className="font-black text-white">Certificate of Participation</strong>.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export default PrizePoolSection;
