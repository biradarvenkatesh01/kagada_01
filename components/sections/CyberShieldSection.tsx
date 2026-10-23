"use client";

import { memo } from "react";
import { ArrowRight } from "lucide-react";
import { REGISTRATIONS_CLOSED } from "@/data/kagada-data";
import { RegistrationsClosed } from "@/components/ui/registrations-closed";

export const CyberShieldSection = memo(function CyberShieldSection() {
  return (
    <section
      id="cybershield"
      className="relative w-full min-h-screen min-h-[100dvh] text-slate-900 flex flex-col items-center justify-center z-20 px-4 py-16 sm:py-20 lg:py-28 overflow-visible"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center my-auto">
        {/* Section Heading */}
        <h2
          data-reveal
          className="font-saman text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#D8D3C7] tshadow-lg mb-4 sm:mb-6 lg:mb-8 tracking-tight text-center select-none"
        >
          Cyber<span className="text-amber-400 tshadow-md">Shield</span>
        </h2>

        {/* Main Showcase Card */}
        <div
          id="cybershield-card"
          data-reveal
          className="w-full kagada-paper-card border-2 border-white/95 !rounded-2xl sm:!rounded-3xl shadow-2xl shadow-black/35 overflow-hidden p-5 sm:p-7 lg:p-9 text-left transform-gpu"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* Left Column: Official Poster */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-none aspect-square !rounded-xl sm:!rounded-2xl overflow-hidden border-2 border-white/85 shadow-xl relative bg-[#D8D3C7]/40 shrink-0 mx-auto group">
                <img
                  src="/cybershield/cybershield-poster.jpg"
                  width={1024}
                  height={1024}
                  alt="CyberShield Ideathon 2026 - IEEE UVCE Presents, a part of KAGADA 2026"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Right Column: Information & Registration */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5 text-[#5A182B]">
              {/* Card Header & Description */}
              <div>
                <h3 className="font-smooch text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight tracking-wide text-[#5A182B] text-center">
                  CyberShield Ideathon 2026
                </h3>

                <p className="font-jakarta text-xs sm:text-sm lg:text-base text-slate-800 leading-relaxed font-medium mt-2">
                  This ideation challenge invites aspiring innovators to tackle{" "}
                  <strong>real-world cybersecurity threats</strong>, explore emerging digital challenges and develop practical solutions for a safer digital world. Identify pressing digital vulnerabilities, think critically and pitch innovative solutions before an esteemed panel of judges!
                </p>
              </div>

              {/* Event Details as Bullet Points */}
              <ul className="space-y-2 sm:space-y-2.5 font-jakarta text-xs sm:text-sm lg:text-base text-slate-800 py-1">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] shrink-0" />
                  <span>
                    <strong className="font-roboto-mono uppercase text-[#5A182B] tracking-wide text-xs sm:text-sm">Date:</strong>{" "}
                    <span className="font-semibold text-slate-900">24th October, 2026</span>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] shrink-0" />
                  <span>
                    <strong className="font-roboto-mono uppercase text-[#5A182B] tracking-wide text-xs sm:text-sm">Venue:</strong>{" "}
                    <span className="font-semibold text-slate-900">UVCE, K R Circle</span>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] shrink-0" />
                  <span>
                    <strong className="font-roboto-mono uppercase text-[#5A182B] tracking-wide text-xs sm:text-sm">Team Size:</strong>{" "}
                    <span className="font-semibold text-slate-900">1 – 3 Members</span>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] shrink-0" />
                  <span>
                    <strong className="font-roboto-mono uppercase text-[#5A182B] tracking-wide text-xs sm:text-sm">Registration Fee:</strong>{" "}
                    <span className="font-semibold text-slate-900">₹150 per team</span>
                  </span>
                </li>
              </ul>

              {/* Prize Highlight Banner */}
              <div className="w-full flex flex-col items-center justify-center text-center bg-[#5A182B]/10 text-[#5A182B] px-4 py-3 sm:py-3.5 !rounded-xl border-2 border-[#5A182B]/25 shadow-xs gap-1 sm:gap-1.5">
                <p className="font-roboto-mono text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5A182B]">
                  Cash Prizes worth <span className="font-sans text-[0.82em] font-bold inline-block align-baseline">₹</span>10,000/-
                </p>
                <p className="font-roboto-mono text-xs sm:text-sm font-bold text-[#5A182B] leading-snug">
                  Certificates of Participation will be provided to all participants.
                </p>
              </div>

              {/* Registration CTA Button */}
              <div className="w-full">
                {REGISTRATIONS_CLOSED ? (
                  <RegistrationsClosed className="w-full py-3.5" />
                ) : (
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeTWE1TugtSBSe-6629_bYXm8s5PFAR4xHBlAGaupc3L7EP6g/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 bg-[#5A182B] hover:bg-[#431220] border-2 border-white/95 text-white font-roboto-mono font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer !rounded-none select-none text-center group"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default CyberShieldSection;
