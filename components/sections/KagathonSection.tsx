"use client";

import { memo } from "react";
import { Calendar, Clock, MapPin, Sparkles, Award } from "lucide-react";

export const KagathonSection = memo(function KagathonSection() {
  return (
    <section
      id="kagathon"
      className="relative w-full text-slate-900 flex flex-col items-center justify-center z-20 px-4 py-12 sm:py-16 lg:py-20 scroll-mt-20 sm:scroll-mt-24 overflow-visible"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Glowing Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-roboto-mono text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md backdrop-blur-sm mb-3 sm:mb-4 select-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curtain Raiser for Kagada 2026</span>
        </div>

        {/* Section Heading */}
        <h2
          data-reveal
          className="font-saman text-5xl sm:text-7xl md:text-8xl text-[#D8D3C7] tshadow-lg mb-2 tracking-tight text-center select-none"
        >
          Kaga<span className="text-amber-400 tshadow-md">thon</span>
        </h2>

        {/* Quote */}
        <p
          data-reveal
          className="font-jakarta italic text-sm sm:text-base md:text-lg text-amber-200/90 font-medium max-w-2xl text-center px-4 leading-relaxed mb-6 sm:mb-10"
        >
          &ldquo;A marathon is a reminder that every finish starts with a beginning!&rdquo;
        </p>

        {/* Main Showcase Card */}
        <div className="w-full kagada-paper-card border-2 border-white/95 !rounded-2xl sm:!rounded-3xl shadow-2xl shadow-black/35 overflow-hidden p-5 sm:p-8 lg:p-10 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* Left Column: Official Poster */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-none aspect-square !rounded-xl sm:!rounded-2xl overflow-hidden border-2 border-white/85 shadow-xl relative bg-[#D8D3C7]/40 shrink-0 mx-auto">
                <img
                  src="/optimized/kagathon/kagathon-poster-720.webp"
                  srcSet="/optimized/kagathon/kagathon-poster-720.webp 720w, /optimized/kagathon/kagathon-poster.webp 1200w"
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 400px, 460px"
                  width={1200}
                  height={1200}
                  alt="Kagathon 2026 - Your Only Limit Is You"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Right Column: Information & Registration */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5 text-[#5A182B]">
              {/* Card Header & Description */}
              <div>
                <h3 className="font-smooch text-4xl sm:text-5xl lg:text-6xl font-semibold leading-none tracking-wide text-[#5A182B]">
                  The Curtain Raiser Marathon
                </h3>
                <p className="font-jakarta text-xs sm:text-sm lg:text-base text-slate-800 leading-relaxed font-medium mt-2">
                  Step into a morning of <strong>live DJ beats, dance, games, and delicious treats</strong> at sunrise in the UVCE Quadrangle. Challenge your limits, celebrate with friends, and commemorate the morning with an <strong>official certificate</strong>!
                </p>
              </div>

              {/* 4 Key Details Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full">
                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-[#5A182B]/10 border border-[#5A182B]/25 flex items-center justify-center shrink-0 text-[#5A182B]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-roboto-mono text-[10px] sm:text-xs font-bold text-[#5A182B]/75 uppercase tracking-wider block">
                      Date
                    </span>
                    <span className="font-roboto-mono text-xs sm:text-sm font-extrabold text-[#5A182B]">
                      18th October, 2026
                    </span>
                  </div>
                </div>

                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-[#5A182B]/10 border border-[#5A182B]/25 flex items-center justify-center shrink-0 text-[#5A182B]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-roboto-mono text-[10px] sm:text-xs font-bold text-[#5A182B]/75 uppercase tracking-wider block">
                      Time
                    </span>
                    <span className="font-roboto-mono text-xs sm:text-sm font-extrabold text-[#5A182B]">
                      6:30 AM (Sunrise)
                    </span>
                  </div>
                </div>

                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-[#5A182B]/10 border border-[#5A182B]/25 flex items-center justify-center shrink-0 text-[#5A182B]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-roboto-mono text-[10px] sm:text-xs font-bold text-[#5A182B]/75 uppercase tracking-wider block">
                      Venue
                    </span>
                    <span className="font-roboto-mono text-xs sm:text-sm font-extrabold text-[#5A182B]">
                      Quadrangle, UVCE
                    </span>
                  </div>
                </div>

                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-[#5A182B]/10 border border-[#5A182B]/25 flex items-center justify-center shrink-0 text-[#5A182B]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-roboto-mono text-[10px] sm:text-xs font-bold text-[#5A182B]/75 uppercase tracking-wider block">
                      Included
                    </span>
                    <span className="font-jakarta text-xs sm:text-sm font-bold text-[#5A182B]">
                      DJ, Tee, Treats & Cert
                    </span>
                  </div>
                </div>
              </div>

              {/* Deadlines Box */}
              <div className="!rounded-xl bg-[#5A182B]/10 border border-[#5A182B]/25 p-3.5 sm:p-4 text-center sm:text-left space-y-1">
                <p className="font-roboto-mono text-xs sm:text-sm font-bold text-[#5A182B]">
                  <span className="uppercase text-[#5A182B]/80 text-[10px] sm:text-xs tracking-wider">
                    T-Shirt Registration Deadline:
                  </span>{" "}
                  <span className="font-jakarta font-extrabold text-[#5A182B]">
                    8th October, 2026
                  </span>
                </p>
                <p className="font-roboto-mono text-xs sm:text-sm font-bold text-[#5A182B]">
                  <span className="uppercase text-[#5A182B]/80 text-[10px] sm:text-xs tracking-wider">
                    Final Registration Deadline:
                  </span>{" "}
                  <span className="font-jakarta font-extrabold text-[#5A182B]">
                    13th October, 2026 &middot; 11:59 PM
                  </span>
                </p>
              </div>

              {/* Registration Button */}
              <div className="pt-1">
                <a
                  href="https://bit.ly/KAGADA2026-Kagathon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center py-3.5 px-8 bg-[#5A182B] hover:bg-[#431220] border-2 border-white/95 text-white font-roboto-mono font-extrabold uppercase tracking-widest text-xs sm:text-sm rounded-none shadow-xl transition-colors select-none text-center"
                >
                  <span>REGISTER FOR KAGATHON &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default KagathonSection;
