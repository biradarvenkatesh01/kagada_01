"use client";

import { memo } from "react";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import { ABOUT_CARDS } from "@/data/kagada-data";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const AboutSection = memo(function AboutSection() {

  const renderAboutCard = (item: CardStackItem) => {
    if (item.type === "uvce") {
      return (
        <div className="flex flex-col h-full justify-between text-left select-text p-1 sm:p-2">
          {/* Header Centered Horizontally in Smooch Sans Font */}
          <div className="flex items-center justify-center border-b border-white/60 pb-2 mb-4 sm:mb-6 w-full">
            <h3 className="font-smooch text-4xl sm:text-6xl md:text-7xl font-semibold text-[#8a1c1c] tracking-wide whitespace-nowrap text-center leading-none">
              About <span className="text-[#8a1c1c]">UVCE</span>
            </h3>
          </div>

          {/* Content Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center flex-1">
            {/* Left Text Column */}
            <div className="lg:col-span-7 font-jakarta text-xs sm:text-base lg:text-lg text-slate-900/90 leading-relaxed font-medium">
              <p>
                <strong className="font-extrabold text-slate-950">University of Visvesvaraya College of Engineering</strong>, established in <strong className="font-bold text-slate-950">1917</strong> by <strong className="font-bold text-slate-950">Bharat Ratna Sir M Visvesvaraya</strong>. UVCE stands as the fifth engineering college in India and the first in Karnataka. UVCE provides 8 undergraduate, 24 postgraduate, and various research programs in fields such as Computer Science and Engineering, Information Science and Engineering, Artificial Intelligence and Machine Learning, Electronics and Communication Engineering, Electrical and Electronics Engineering, Mechanical Engineering, Civil Engineering, and Architecture. UVCE is dedicated to delivering <strong className="font-bold text-slate-950">high-quality</strong> technical education and is recognized as one of the <strong className="font-bold text-slate-950">top engineering colleges in Karnataka</strong>.
              </p>
            </div>

            {/* Right Image & Stat Column */}
            <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-5 items-center">
              <div className="w-full h-36 sm:h-60 rounded-2xl overflow-hidden shadow-md border border-white/80 bg-black/5">
                <img
                  src="/uvcecollege.png"
                  alt="UVCE Campus"
                  data-no-lightbox="true"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full p-3 sm:p-5 rounded-2xl bg-white/70 border border-white/80 text-center shadow-sm">
                <div className="font-roboto-mono text-2xl sm:text-4xl font-extrabold text-[#8a1c1c]">
                  100+
                </div>
                <div className="font-jakarta text-xs sm:text-sm font-semibold text-slate-800 tracking-wider mt-0.5">
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
        <div className="flex flex-col h-full justify-between text-left select-text p-1 sm:p-2">
          {/* Header Centered Horizontally in Smooch Sans Font */}
          <div className="flex items-center justify-center border-b border-white/60 pb-2 mb-4 sm:mb-6 w-full">
            <h3 className="font-smooch text-4xl sm:text-6xl md:text-7xl font-semibold text-[#8a1c1c] tracking-wide whitespace-nowrap text-center leading-none">
              About <span className="text-[#8a1c1c]">IEEE UVCE</span>
            </h3>
          </div>

          {/* Content Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center flex-1">
            {/* Left Text Column */}
            <div className="lg:col-span-7 font-jakarta text-xs sm:text-base lg:text-lg text-slate-900/90 leading-relaxed font-medium">
              <p>
                <strong className="font-extrabold text-slate-950">IEEE UVCE</strong> is an IEEE student branch at the <strong className="font-bold text-slate-950">University of Visvesvaraya College of Engineering</strong>, under the aegis of the IEEE Bangalore Section. Started in 2001, IEEE UVCE is dedicated to <strong className="font-bold text-slate-950">spreading knowledge</strong> through a variety of activities. The branch <strong className="font-bold text-slate-950">provides students with opportunities</strong> to attend global and national IEEE workshops, symposiums, guest lectures, and conferences. It also <strong className="font-bold text-slate-950">supports various technical interest groups</strong>, offering guidance and a nurturing platform for students. IEEE UVCE enriches students&apos; experiences with social, cultural, and technical events, encourages the use of IEEE membership benefits, and <strong className="font-bold text-slate-950">promotes collaboration</strong> with the global IEEE community.
              </p>
            </div>

            {/* Right Transparent IEEE Stamp Logo Column */}
            <div className="lg:col-span-5 flex items-center justify-center py-2">
              <div className="w-44 h-44 sm:w-72 sm:h-72 flex items-center justify-center p-2">
                <img
                  src="/ieeebluelogo.png"
                  alt="IEEE UVCE Logo"
                  data-no-lightbox="true"
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (item.type === "kagada") {
      return (
        <div className="flex flex-col h-full justify-between text-left select-text p-1 sm:p-2">
          {/* Header Centered Horizontally in Smooch Sans Font */}
          <div className="flex items-center justify-center border-b border-white/60 pb-2 mb-4 sm:mb-6 w-full">
            <h3 className="font-smooch text-4xl sm:text-6xl md:text-7xl font-semibold text-[#8a1c1c] tracking-wide whitespace-nowrap text-center leading-none">
              About <span className="text-[#8a1c1c]">KAGADA</span>
            </h3>
          </div>

          {/* Content Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center flex-1">
            {/* Left Text Column */}
            <div className="lg:col-span-7 font-jakarta text-xs sm:text-sm lg:text-base text-slate-900/90 leading-relaxed font-medium space-y-2 sm:space-y-3">
              <p>
                <strong className="font-extrabold text-slate-950">KAGADA</strong> is our esteemed <strong className="font-bold text-slate-950">Annual National-Level Technical Student Conference</strong>, showcasing <strong className="font-bold text-slate-950">Paper, Poster, and Project Presentations</strong>. Its 22nd edition is set for <strong className="font-bold text-slate-950">October 10, 2026</strong>. At IEEE UVCE, we are dedicated to expanding technical knowledge beyond the classroom. KAGADA, recognized with the <strong className="font-bold text-slate-950">Darrel Chong Student Activity Award</strong> in both 2016 and 2019, aims to inspire students to pursue research during their undergraduate studies. This conference provides an engaging platform for motivated students to <strong className="font-bold text-slate-950">sharpen their technical skills, improve their presentation abilities, and share innovative ideas</strong>.
              </p>
              <p className="text-slate-800">
                Additionally, KAGADA features initiatives like &quot;<strong className="font-bold text-slate-950">Ottige Kaliyona</strong>,&quot; which teaches government school students to utilize technology, and &quot;<strong className="font-bold text-slate-950">Food For Cause</strong>,&quot; a charitable project where profits from a food stall are donated to an orphanage.
              </p>
            </div>

            {/* Right 4-Stat Grid Column */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2 sm:gap-4">
              <div className="p-2.5 sm:p-5 rounded-2xl bg-white/70 border border-white/80 text-center shadow-sm flex flex-col items-center justify-center">
                <div className="font-roboto-mono text-lg sm:text-3xl font-extrabold text-[#8a1c1c]">
                  1000+
                </div>
                <div className="font-jakarta text-[10px] sm:text-xs font-semibold text-slate-800 mt-0.5">
                  Participants Expected
                </div>
              </div>

              <div className="p-2.5 sm:p-5 rounded-2xl bg-white/70 border border-white/80 text-center shadow-sm flex flex-col items-center justify-center">
                <div className="font-roboto-mono text-lg sm:text-3xl font-extrabold text-[#8a1c1c]">
                  50+
                </div>
                <div className="font-jakarta text-[10px] sm:text-xs font-semibold text-slate-800 mt-0.5">
                  Colleges Participating
                </div>
              </div>

              <div className="p-2.5 sm:p-5 rounded-2xl bg-white/70 border border-white/80 text-center shadow-sm flex flex-col items-center justify-center">
                <div className="font-roboto-mono text-lg sm:text-3xl font-extrabold text-[#8a1c1c]">
                  ₹40K+
                </div>
                <div className="font-jakarta text-[10px] sm:text-xs font-semibold text-slate-800 mt-0.5">
                  Total Prizes
                </div>
              </div>

              <div className="p-2.5 sm:p-5 rounded-2xl bg-white/70 border border-white/80 text-center shadow-sm flex flex-col items-center justify-center">
                <div className="font-roboto-mono text-lg sm:text-3xl font-extrabold text-[#8a1c1c]">
                  20
                </div>
                <div className="font-jakarta text-[10px] sm:text-xs font-semibold text-slate-800 mt-0.5">
                  Years of Legacy
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section
      id="about"
      className="relative w-full min-h-screen text-slate-900 flex flex-col items-center justify-center z-10 px-4 py-24 scroll-mt-6"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <ScrollReveal direction="down" duration={450}>
          <h2 className="font-saman text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-lg mb-12 sm:mb-16 md:mb-20 tracking-tight text-center select-none">
            About <span className="text-amber-400 drop-shadow-md">Us</span>
          </h2>
        </ScrollReveal>

        {/* 3D Circular Orbit Card Carousel with 3 Rich Cards */}
        <ScrollReveal direction="scale" duration={400} delay={40} className="w-full flex items-center justify-center">
          <CardStack
            items={ABOUT_CARDS}
            initialIndex={0}
            autoAdvance
            intervalMs={3500}
            pauseOnHover
            showDots={false}
            showArrows={true}
            cardWidth={960}
            cardHeight={640}
            maxVisible={3}
            spreadDeg={0}
            tiltXDeg={0}
            springStiffness={280}
            springDamping={26}
            renderCard={renderAboutCard}
          />
        </ScrollReveal>
      </div>
    </section>
  );
});

export default AboutSection;
