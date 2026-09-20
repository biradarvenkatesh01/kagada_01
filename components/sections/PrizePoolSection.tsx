import { Trophy } from "lucide-react";

export function PrizePoolSection() {
  return (
    <section
      id="prizes"
      className="relative w-full text-slate-900 flex flex-col items-center justify-start z-10 px-4 py-8 sm:py-12 scroll-mt-6"
    >
      <div className="relative z-10 w-full max-w-xl md:max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <h2 data-reveal className="font-saman text-4xl sm:text-6xl md:text-7xl text-[#D8D3C7] tshadow-lg mb-4 sm:mb-6 tracking-tight text-center select-none">
          Prize <span className="text-amber-400 tshadow-md">Pool</span>
        </h2>

        <div className="w-full flex flex-col items-center gap-5 sm:gap-6">
          {/* Box 1: Total Prize Money Authentic Paper Card */}
          <div
            className="relative w-full kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/25 rounded-3xl p-5 sm:p-7 md:p-8 text-slate-900 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Circular Trophy SVG Icon Badge */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#5A182B]/10 border-2 border-[#5A182B]/25 text-[#5A182B] flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] text-[#5A182B] drop-shadow-sm" />
            </div>

            {/* Card Title in Smooch Sans */}
            <h3 className="font-smooch text-3xl sm:text-4xl md:text-5xl font-semibold text-[#5A182B] tracking-wide text-center leading-none mb-1.5 sm:mb-2">
              Total Prize Money
            </h3>

            {/* Prize Amount in Roboto Mono with Perfectly Leveled Rupee & Cashprize */}
            <div className="font-roboto-mono font-black text-4xl sm:text-5xl md:text-6xl text-[#5A182B] tracking-tight mb-3 sm:mb-4 flex items-center justify-center gap-1.5">
              <span className="text-[0.74em] font-extrabold leading-none inline-block relative translate-y-[0.16em]">₹</span>
              <span className="leading-none inline-block">40,000</span>
            </div>

            {/* Description Paragraph */}
            <p className="font-jakarta text-xs sm:text-sm text-stone-700 leading-relaxed font-medium max-w-lg mx-auto">
              Exciting rewards await at <strong className="font-extrabold text-[#5A182B]">KAGADA 2026</strong>! A total prize pool of <strong className="font-extrabold text-[#5A182B]">₹40,000</strong> will be shared across <strong className="font-extrabold text-[#5A182B]">Paper, Poster and Project presentations</strong>, celebrating creativity, technical excellence and impactful ideas.
            </p>
          </div>

          {/* Box 2: Certificate Participation Authentic Paper Banner (Clean without emoji) */}
          <div
            className="relative w-full max-w-lg mx-auto kagada-paper-card border-2 border-white/95 shadow-xl shadow-black/20 rounded-2xl sm:rounded-3xl py-3 px-5 sm:py-3.5 sm:px-6 text-slate-900 flex items-center justify-center text-center overflow-hidden"
          >
            <p className="font-jakarta text-xs sm:text-sm text-stone-800 font-semibold leading-snug">
              Every participant will be awarded a <strong className="font-black text-[#5A182B]">Certificate of Participation</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PrizePoolSection;
