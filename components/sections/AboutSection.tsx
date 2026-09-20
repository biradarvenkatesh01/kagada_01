"use client";

import { memo } from "react";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import { ABOUT_CARDS } from "@/data/kagada-data";

function renderAboutCard(item: CardStackItem) {
  if (item.type === "uvce") {
    return (
      <div className="flex flex-col text-left select-text w-full">
        {/* Header Centered Horizontally in Smooch Sans Font */}
        <div className="flex items-center justify-center border-b border-[#5A182B]/20 pb-1.5 sm:pb-2.5 mb-2.5 sm:mb-4 lg:mb-5 w-full shrink-0">
          <h3 className="font-smooch text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#5A182B] tracking-wide whitespace-nowrap text-center leading-none">
            About <span className="text-[#5A182B]">UVCE</span>
          </h3>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-8 items-center w-full">
          {/* Left Text Column */}
          <div className="lg:col-span-7 font-jakarta text-xs sm:text-sm lg:text-base text-slate-900/90 leading-relaxed font-medium">
            <p>
              <strong className="font-extrabold text-slate-950">University of Visvesvaraya College of Engineering</strong>, established in <strong className="font-bold text-slate-950">1917</strong> by <strong className="font-bold text-slate-950">Bharat Ratna Sir M Visvesvaraya</strong>. UVCE stands as the fifth engineering college in India and the first in Karnataka. UVCE provides 8 undergraduate, 24 postgraduate and various research programs in fields such as Computer Science and Engineering, Information Science and Engineering, Artificial Intelligence and Machine Learning, Electronics and Communication Engineering, Electrical and Electronics Engineering, Mechanical Engineering, Civil Engineering and Architecture. UVCE is dedicated to delivering <strong className="font-bold text-slate-950">high-quality</strong> technical education and is recognized as one of the <strong className="font-bold text-slate-950">top engineering colleges in Karnataka</strong>.
            </p>
          </div>

          {/* Right Image & Stat Column */}
          <div className="lg:col-span-5 flex flex-col gap-2 sm:gap-3 lg:gap-4 items-center w-full">
            <div className="w-full h-24 min-[360px]:h-28 sm:h-44 lg:h-52 !rounded-xl sm:!rounded-2xl overflow-hidden shadow-md border border-white/80 bg-black/5 shrink-0">
              <img
                src="/optimized/about/uvcecollege.webp"
                alt="UVCE Campus"
                loading="lazy"
                decoding="async"
                width={800}
                height={409}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full py-1.5 px-3 sm:py-2.5 sm:px-4 !rounded-xl sm:!rounded-2xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 text-center shadow-sm">
              <div className="font-roboto-mono text-lg sm:text-2xl lg:text-3xl font-extrabold text-[#5A182B] leading-none">
                100+
              </div>
              <div className="font-jakarta text-[10px] sm:text-xs font-semibold text-slate-800 tracking-wider mt-0.5">
                Years of Legacy
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === "ieee") {
    return (
      <div className="flex flex-col justify-between text-left select-text w-full h-full flex-1">
        {/* Header Centered Horizontally in Smooch Sans Font */}
        <div className="flex items-center justify-center border-b border-[#5A182B]/20 pb-1.5 sm:pb-2.5 mb-2.5 sm:mb-4 lg:mb-5 w-full shrink-0">
          <h3 className="font-smooch text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#5A182B] tracking-wide whitespace-nowrap text-center leading-none">
            About <span className="text-[#5A182B]">IEEE UVCE</span>
          </h3>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-8 items-center w-full flex-1">
          {/* Left Text Column */}
          <div className="lg:col-span-7 font-jakarta text-xs sm:text-sm lg:text-base text-slate-900/90 leading-relaxed font-medium">
            <p>
              <strong className="font-extrabold text-slate-950">IEEE UVCE</strong> is an IEEE student branch at the <strong className="font-bold text-slate-950">University of Visvesvaraya College of Engineering</strong>, under the aegis of the IEEE Bangalore Section. Started in 2001, IEEE UVCE is dedicated to <strong className="font-bold text-slate-950">spreading knowledge</strong> through a variety of activities. The branch <strong className="font-bold text-slate-950">provides students with opportunities</strong> to attend global and national IEEE workshops, symposiums, guest lectures and conferences. It also <strong className="font-bold text-slate-950">supports various technical interest groups</strong>, offering guidance and a nurturing platform for students. IEEE UVCE enriches student&apos;s experiences with social, cultural and technical events, encourages the use of IEEE membership benefits and <strong className="font-bold text-slate-950">promotes collaboration</strong> with the global IEEE community.
            </p>
          </div>

          {/* Right Transparent IEEE Stamp Logo Column - Centered in Lower Space */}
          <div className="lg:col-span-5 flex-1 flex items-center justify-center py-2 sm:py-2 mt-2 min-[380px]:mt-3 sm:mt-0 w-full">
            <div className="w-36 h-36 min-[380px]:w-44 min-[380px]:h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 flex items-center justify-center p-1 sm:p-2">
              <img
                src="/optimized/about/ieeebluelogo.webp"
                alt="IEEE UVCE Logo"
                loading="lazy"
                decoding="async"
                width={500}
                height={500}
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === "kagada") {
    return (
      <div className="flex flex-col text-left select-text w-full">
        {/* Header Centered Horizontally in Smooch Sans Font */}
        <div className="flex items-center justify-center border-b border-[#5A182B]/20 pb-1.5 sm:pb-2.5 mb-2.5 sm:mb-4 lg:mb-5 w-full shrink-0">
          <h3 className="font-smooch text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#5A182B] tracking-wide whitespace-nowrap text-center leading-none">
            About <span className="text-[#5A182B]">KAGADA</span>
          </h3>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-8 items-center w-full">
          {/* Left Text Column */}
          <div className="lg:col-span-7 font-jakarta text-xs sm:text-sm lg:text-base text-slate-900/90 leading-relaxed font-medium space-y-1.5 sm:space-y-2.5">
            <p>
              <strong className="font-extrabold text-slate-950">KAGADA</strong> is our esteemed <strong className="font-bold text-slate-950">Annual National-Level Technical Student Conference</strong>, showcasing <strong className="font-bold text-slate-950">Paper, Poster and Project Presentations</strong>. Its 22nd edition is set for <strong className="font-bold text-slate-950">October 24, 2026</strong>. At IEEE UVCE, we are dedicated to expanding technical knowledge beyond the classroom. KAGADA, recognized with the <strong className="font-bold text-slate-950">Darrel Chong Student Activity Award</strong> in both 2016 and 2019, aims to inspire students to pursue research during their undergraduate studies. This conference provides an engaging platform for motivated students to <strong className="font-bold text-slate-950">sharpen their technical skills, improve their presentation abilities and share innovative ideas</strong>.
            </p>
            <p className="text-slate-800">
              Additionally, KAGADA features initiatives like &quot;<strong className="font-bold text-slate-950">Ottige Kaliyona</strong>,&quot; which teaches government school students to utilize technology and &quot;<strong className="font-bold text-slate-950">Food For Cause</strong>,&quot; a charitable project where profits from a food stall are donated to an orphanage.
            </p>
          </div>

          {/* Right 4-Stat Grid Column */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2 min-[380px]:gap-2.5 sm:gap-3.5 w-full">
            <div className="p-2 min-[380px]:p-2.5 sm:p-3.5 !rounded-xl sm:!rounded-2xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 text-center shadow-sm flex flex-col items-center justify-center">
              <div className="font-roboto-mono text-base min-[380px]:text-lg sm:text-2xl font-extrabold text-[#5A182B]">
                1000+
              </div>
              <div className="font-jakarta text-[9px] min-[380px]:text-[10px] sm:text-xs font-semibold text-slate-800 mt-0.5 leading-tight">
                Participants Expected
              </div>
            </div>

            <div className="p-2 min-[380px]:p-2.5 sm:p-3.5 !rounded-xl sm:!rounded-2xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 text-center shadow-sm flex flex-col items-center justify-center">
              <div className="font-roboto-mono text-base min-[380px]:text-lg sm:text-2xl font-extrabold text-[#5A182B]">
                50+
              </div>
              <div className="font-jakarta text-[9px] min-[380px]:text-[10px] sm:text-xs font-semibold text-slate-800 mt-0.5 leading-tight">
                Colleges Participating
              </div>
            </div>

            <div className="p-2 min-[380px]:p-2.5 sm:p-3.5 !rounded-xl sm:!rounded-2xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 text-center shadow-sm flex flex-col items-center justify-center">
              <div className="font-roboto-mono text-base min-[380px]:text-lg sm:text-2xl font-extrabold text-[#5A182B]">
                ₹40K+
              </div>
              <div className="font-jakarta text-[9px] min-[380px]:text-[10px] sm:text-xs font-semibold text-slate-800 mt-0.5 leading-tight">
                Total Prizes
              </div>
            </div>

            <div className="p-2 min-[380px]:p-2.5 sm:p-3.5 !rounded-xl sm:!rounded-2xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 text-center shadow-sm flex flex-col items-center justify-center">
              <div className="font-roboto-mono text-base min-[380px]:text-lg sm:text-2xl font-extrabold text-[#5A182B]">
                20
              </div>
              <div className="font-jakarta text-[9px] min-[380px]:text-[10px] sm:text-xs font-semibold text-slate-800 mt-0.5 leading-tight">
                Years of Legacy
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export const AboutSection = memo(function AboutSection() {

  return (
    <section
      id="about"
      className="relative w-full text-slate-900 flex flex-col items-center justify-center z-10 px-4 pt-16 pb-8 sm:pt-24 sm:pb-12 scroll-mt-6"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <div>
          <h2 className="font-saman text-5xl sm:text-7xl md:text-8xl text-[#D8D3C7] tshadow-lg mb-4 sm:mb-6 tracking-tight text-center select-none">
            About <span className="text-amber-400 tshadow-md">Us</span>
          </h2>
        </div>

        {/* 3D Circular Orbit Card Carousel with 3 Rich Cards */}
        <div className="w-full flex items-center justify-center">
          <CardStack
            items={ABOUT_CARDS}
            initialIndex={0}
            autoAdvance
            intervalMs={3500}
            pauseOnHover
            showDots={false}
            showArrows={true}
            cardWidth={960}
            cardHeight={560}
            mobileCardHeight={570}
            maxVisible={3}
            springStiffness={280}
            springDamping={26}
            renderCard={renderAboutCard}
          />
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
