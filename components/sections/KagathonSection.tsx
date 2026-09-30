"use client";

import { memo } from "react";

export const KagathonSection = memo(function KagathonSection() {
  return (
    <section
      id="kagathon"
      className="relative w-full text-slate-900 flex flex-col items-center justify-center z-20 px-4 py-12 sm:py-16 lg:py-20 scroll-mt-20 sm:scroll-mt-24 overflow-visible"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <h2
          data-reveal
          className="font-saman text-5xl sm:text-7xl md:text-8xl text-[#D8D3C7] tshadow-lg mb-6 sm:mb-10 tracking-tight text-center select-none"
        >
          Kaga<span className="text-amber-400 tshadow-md">thon</span>
        </h2>

        {/* Main Showcase Card */}
        <div
          data-reveal
          className="w-full kagada-paper-card border-2 border-white/95 !rounded-2xl sm:!rounded-3xl shadow-2xl shadow-black/35 overflow-hidden p-5 sm:p-8 lg:p-10 text-left transform-gpu"
        >
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
                <h3 className="font-smooch text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight tracking-wide text-[#5A182B] text-center">
                  The Curtain Raiser<br />for Kagada 2026
                </h3>
                <p className="font-jakarta text-xs sm:text-sm lg:text-base text-slate-800 leading-relaxed font-medium mt-2">
                  Step into a morning of <strong>live DJ beats, dance, games and delicious treats</strong> at sunrise in the UVCE Quadrangle. Challenge your limits, celebrate with friends and commemorate the morning with an <strong>official certificate</strong>!
                </p>
              </div>

              {/* Event Details as Bullet Points */}
              <ul className="space-y-2 sm:space-y-2.5 font-jakarta text-xs sm:text-sm lg:text-base text-slate-800 py-1">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] shrink-0" />
                  <span>
                    <strong className="font-roboto-mono uppercase text-[#5A182B] tracking-wide text-xs sm:text-sm">Date:</strong>{" "}
                    <span className="font-semibold text-slate-900">18th October, 2026</span>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] shrink-0" />
                  <span>
                    <strong className="font-roboto-mono uppercase text-[#5A182B] tracking-wide text-xs sm:text-sm">Time:</strong>{" "}
                    <span className="font-semibold text-slate-900">6:30 AM</span>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] shrink-0" />
                  <span>
                    <strong className="font-roboto-mono uppercase text-[#5A182B] tracking-wide text-xs sm:text-sm">Venue:</strong>{" "}
                    <span className="font-semibold text-slate-900">Quadrangle, UVCE</span>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] shrink-0" />
                  <span>
                    <strong className="font-roboto-mono uppercase text-[#5A182B] tracking-wide text-xs sm:text-sm">Included:</strong>{" "}
                    <span className="font-semibold text-slate-900">Live DJ, Treats & Certificates</span>
                  </span>
                </li>
              </ul>

              {/* Deadlines Box */}
              <div className="!rounded-xl bg-[#5A182B]/10 border border-[#5A182B]/25 p-3 sm:p-4 text-center space-y-2">
                <p className="font-roboto-mono text-xs sm:text-sm font-bold text-[#5A182B] leading-snug">
                  <span className="uppercase text-[#5A182B]/80 text-[10px] sm:text-xs tracking-wider block min-[440px]:inline">
                    T-Shirt Registration Deadline:{" "}
                  </span>
                  <span className="font-jakarta font-extrabold text-[#5A182B]">
                    8th October, 2026
                  </span>
                </p>
                <p className="font-roboto-mono text-xs sm:text-sm font-bold text-[#5A182B] leading-snug">
                  <span className="uppercase text-[#5A182B]/80 text-[10px] sm:text-xs tracking-wider block min-[440px]:inline">
                    Final Registration Deadline:{" "}
                  </span>
                  <span className="font-jakarta font-extrabold text-[#5A182B]">
                    13th October, 2026 &middot; 11:59 PM
                  </span>
                </p>
              </div>

              {/* Registration Button */}
              <div id="kagathon-register" className="pt-1 scroll-mt-32">
                <a
                  id="kagathon-register-btn"
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
