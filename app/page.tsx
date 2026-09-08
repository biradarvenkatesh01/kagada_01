"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlipClock from "@/components/ui/flip-clock";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import RadialOrbitalTimeline, { TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { Menu, X, ChevronDown, FileText, Image, Cpu, Heart, Sparkles, Trophy, Award } from "lucide-react";
import { Hero10 } from "@/components/ui/hero-10";
import GalleryMarquee from "@/components/ui/gallery-marquee";
import AftermoviesSection from "@/components/ui/aftermovies-section";
import SponsorsSection from "@/components/ui/sponsors-section";
import FAQSection from "@/components/ui/faq-section";
import ContactSection from "@/components/ui/contact-section";
import Footer from "@/components/ui/footer";
import AIChatCard from "@/components/ui/ai-chat";
import AuroraBackground from "@/components/ui/aurora-background";

// Target Event Date: 10th October 2026
const KAGADA_EVENT_DATE = new Date("2026-10-10T00:00:00");

// Exactly 3 Rich About Section Cards
const ABOUT_CARDS: CardStackItem[] = [
  { id: 1, type: "uvce", title: "About UVCE" },
  { id: 2, type: "ieee", title: "About IEEE UVCE" },
  { id: 3, type: "kagada", title: "About KAGADA" },
];

// Kagada 2026 Track Orbital Nodes
const TRACKS_TIMELINE_DATA: TimelineItem[] = [
  {
    id: 1,
    title: "Paper Presentation",
    date: "Oct 10, 2026",
    content: "Present original research papers across CSE, AI/ML, ECE, EEE, Mechanical, Civil & Architecture.",
    description:
      "Paper presentation competition gives participants a chance to present their technical research papers in their domain of interest and lay an initial stone to engrave one's knowledge to serve society with their innovative ideas including categories UG/PG. Paper presentation will be in online mode, allowing participants to showcase their work. It also provides an opportunity to receive constructive feedback from experts, enhancing their research and presentation skills.",
    imageSrc: "/paper.png",
    category: "Paper",
    icon: FileText,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 2,
    title: "Poster Presentation",
    date: "Oct 10, 2026",
    content: "Visual research posters, technical infographics, and scientific concept demonstrations.",
    description:
      "Poster presentation provides an opportunity to present innovative ideas through technical posters to depict how real-life problems can be solved. Participants are free to choose the domain of their choice and the presentation will be held in hybrid mode. This event encourages creativity, critical thinking, and clear communication of technical concepts. Additionally, participants get a chance to engage with judges and peers, receive valuable feedback, and inspire others with their innovative solutions.",
    imageSrc: "/poster.jpg",
    category: "Poster",
    icon: Image,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Project Presentation",
    date: "Oct 10, 2026",
    content: "Live working hardware prototypes, software solutions, and innovative engineering models.",
    description:
      "Project presentation makes way for students to bring out the inventors in them and their creativity to pure reality through working model demonstrations. This also helps them to display their innovative thoughts on different domains, encouraging problem-solving and critical thinking. The event also helps students gain confidence in presenting their projects, while inspiring peers and fostering a culture of learning and innovation.",
    imageSrc: "/project.jpg",
    category: "Project",
    icon: Cpu,
    relatedIds: [1, 2],
    status: "in-progress" as const,
    energy: 100,
  },
  {
    id: 4,
    title: "Ottige Kaliyona",
    date: "Special Outreach",
    content: "Flagship social initiative empowering government school students through technology education.",
    description:
      "Ottige Kaliyona, conducted by IEEE WIE during KAGADA 25, is an initiative to contribute in uprising of the society, inviting students from a government school for technical education and fun activities. The program provides hands-on learning experiences, fostering curiosity and creativity among young minds.",
    imageSrc: "/ottigekaliona.jpg",
    category: "Social",
    icon: Sparkles,
    relatedIds: [5],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 5,
    title: "Food For Cause",
    date: "Charity Drive",
    content: "Charitable food stall project where 100% of profits are donated directly to orphanages.",
    description:
      "The event is conducted by students of UVCE where food stalls serve a variety of delicious foods to visitors. The profits collected from these stalls are donated to an NGO, supporting a meaningful cause. Along with enjoying good food, attendees also get to engage with the vibrant student community, making the event both fun and impactful.",
    imageSrc: "/FoodForCause.JPG",
    category: "Charity",
    icon: Heart,
    relatedIds: [4],
    status: "completed" as const,
    energy: 88,
  },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) {
        setIsScrolledPastHero(true);
      } else {
        setIsScrolledPastHero(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Lock document scroll while video intro is active
    if (!isVideoHidden) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVideoHidden]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        // Fallback to muted autoplay if browser blocks audio autoplay
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, []);

  // Monitor timeline to start crossfade 1.5s BEFORE video finishes for a seamless film dissolve
  const handleTimeUpdate = () => {
    if (videoRef.current && !isVideoFading) {
      const remainingTime = videoRef.current.duration - videoRef.current.currentTime;
      if (remainingTime <= 1.5 && remainingTime > 0) {
        setIsVideoFading(true);
        setTimeout(() => {
          setIsVideoHidden(true);
        }, 1800);
      }
    }
  };

  const handleVideoEnded = () => {
    if (!isVideoFading) {
      setIsVideoFading(true);
      setTimeout(() => {
        setIsVideoHidden(true);
      }, 1800);
    }
  };

  const handleTapToUnmute = () => {
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
    }
  };

  // Custom renderer for the 3 About Section Cards (Smooch Sans Headings, Centered)
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
                <strong className="font-extrabold text-slate-950">KAGADA</strong> is our esteemed <strong className="font-bold text-slate-950">Annual National-Level Technical Student Conference</strong>, showcasing <strong className="font-bold text-slate-950">Paper, Poster, and Project Presentations</strong>. Its 21st edition is set for <strong className="font-bold text-slate-950">October 10, 2026</strong>. At IEEE UVCE, we are dedicated to expanding technical knowledge beyond the classroom. KAGADA, recognized with the <strong className="font-bold text-slate-950">Darrel Chong Student Activity Award</strong> in both 2016 and 2019, aims to inspire students to pursue research during their undergraduate studies. This conference provides an engaging platform for motivated students to <strong className="font-bold text-slate-950">sharpen their technical skills, improve their presentation abilities, and share innovative ideas</strong>.
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
    <main
      className={`relative w-full bg-transparent overflow-x-hidden ${
        !isVideoHidden ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      
      {/* Atmospheric Aurora Fluid Light Rays Background */}
      <AuroraBackground />

      {/* Floating Glassmorphic Pill Navbar */}
      <motion.header
        initial={{ y: -80, opacity: 0, x: "-50%" }}
        animate={{
          y: isVideoFading ? 0 : -80,
          opacity: isVideoFading ? 1 : 0,
          x: "-50%",
        }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 20,
          delay: 0.1,
        }}
        className="fixed top-6 left-1/2 z-[999] w-[92%] max-w-7xl h-16 rounded-full bg-white/85 backdrop-blur-2xl border-2 border-white/90 shadow-2xl shadow-black/20 px-4 sm:px-8 flex items-center justify-between pointer-events-auto transform-gpu will-change-transform"
      >
        {/* Left Brand Logo (Constant Kagada Red Filter) */}
        <a href="#hero" className="flex items-center gap-2 select-none py-0">
          <img
            src="/handle.png"
            alt="IEEE UVCE Kagada Logo"
            className="h-11 sm:h-14 w-auto object-contain transition-all duration-300 hover:scale-105"
            style={{ filter: "invert(18%) sepia(85%) saturate(3000%) hue-rotate(345deg) brightness(85%) contrast(95%)" }}
          />
        </a>

        {/* Desktop Navigation Links (Constant Kagada Red Color Throughout Movement) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-roboto-mono text-sm font-bold tracking-wider text-[#8a1c1c]">
          <a
            href="#about"
            className="transition-all duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
          >
            About Us
          </a>
          <a
            href="#tracks"
            className="transition-all duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
          >
            Tracks
          </a>
          <a
            href="#prizes"
            className="transition-all duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
          >
            Prize Pool
          </a>
          <a
            href="#winners"
            className="transition-all duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
          >
            Winners
          </a>
          <a
            href="#gallery"
            className="transition-all duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
          >
            Gallery
          </a>
          <a
            href="#videos"
            className="transition-all duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
          >
            Aftermovies
          </a>
          <a
            href="#sponsors"
            className="transition-all duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
          >
            Sponsors
          </a>
          <a
            href="#faq"
            className="transition-all duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
          >
            FAQ
          </a>
          <a
            href="#contact"
            className="transition-all duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
          >
            Contact
          </a>
        </nav>

        {/* Mobile Toggle Button (Constant Kagada Red) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#8a1c1c] hover:text-[#8a1c1c]/70 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Dropdown Navigation (Constant Kagada Red Theme) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-2xl border-2 border-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 font-roboto-mono text-base font-bold text-[#8a1c1c] md:hidden z-40"
            >
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                About Us
              </a>
              <a href="#tracks" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                Tracks
              </a>
              <a href="#prizes" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                Prize Pool
              </a>
              <a href="#winners" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                Winners
              </a>
              <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                Gallery
              </a>
              <a href="#videos" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                Aftermovies
              </a>
              <a href="#sponsors" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                Sponsors
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                FAQ
              </a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                Contact
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* SECTION 1: HERO SECTION */}
      <section id="hero" className="relative w-full h-screen overflow-hidden flex items-center justify-center z-10">
        
        {/* Hero Background Photo Layer with Soft Blend */}
        <motion.img
          src="/hero-bg.jpg"
          alt="UVCE Building"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoFading ? 0.85 : 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover z-0 transform-gpu mix-blend-overlay"
        />

        {/* Textured White Overlay Screen over Hero Photo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoFading ? 1 : 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-white/20 pointer-events-none z-[1]"
        />

        {/* Hero Title & Subtitle Glass Box Container - Centered Vertically */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30, x: "-50%" }}
          animate={{
            opacity: isVideoFading ? 1 : 0,
            scale: isVideoFading ? 1 : 0.95,
            y: isVideoFading ? "-50%" : "30px",
            x: "-50%",
          }}
          transition={{
            type: "spring",
            stiffness: 85,
            damping: 20,
            delay: 0.25,
          }}
          className="absolute top-[48%] sm:top-1/2 left-1/2 z-15 w-[95%] sm:w-auto max-w-lg sm:max-w-none flex flex-col items-center justify-center text-center pointer-events-none transform-gpu"
        >
          {/* Title Glass Box containing Title + Subtitle */}
          <div className="w-full px-3 sm:px-10 py-5 sm:py-8 rounded-2xl sm:rounded-3xl bg-white/30 backdrop-blur-md border border-white/80 shadow-xl shadow-black/10 flex flex-col items-center justify-center text-center mx-auto overflow-hidden">
            <h1 className="whitespace-nowrap font-saman font-normal text-[3.1rem] xs:text-[3.6rem] sm:text-6xl md:text-7xl lg:text-[8.5rem] text-[#8a1c1c]/80 tracking-[-0.015em] drop-shadow-sm select-none leading-none text-center mx-auto">
              K<span className="inline-block ml-[0.03em]">a</span>g<span className="inline-block ml-[0.03em]">a</span>d<span className="inline-block ml-[0.03em]">a</span> 2026
            </h1>

            {/* Subtitle in Roboto Mono Font */}
            <p className="font-roboto-mono text-xs sm:text-base md:text-xl lg:text-2xl text-[#8a1c1c]/95 font-bold tracking-wider sm:tracking-widest mt-4 sm:mt-7 uppercase drop-shadow-sm select-none whitespace-normal sm:whitespace-nowrap leading-snug sm:leading-none max-w-[90%] sm:max-w-none mx-auto">
              Annual National-Level Technical Student Conference
            </p>
          </div>

          {/* Flip Clock Countdown Timer */}
          <div className="mt-7 sm:mt-6 w-full sm:w-auto pointer-events-auto flex flex-col items-center">
            <div className="w-full sm:w-auto px-3 py-3 sm:px-6 sm:py-4 rounded-2xl sm:rounded-3xl bg-white/30 backdrop-blur-md border border-white/80 shadow-lg shadow-black/10 text-[#8a1c1c] flex items-center justify-center text-center mx-auto">
              <FlipClock
                countdown={true}
                targetDate={KAGADA_EVENT_DATE}
                size="sm"
                variant="default"
                showDays="always"
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom "Explore Tracks" CTA Indicator */}
        <motion.a
          href="#tracks"
          initial={{ opacity: 0, y: 30, x: "-50%" }}
          animate={{
            opacity: isVideoFading ? 1 : 0,
            y: isVideoFading ? 0 : 30,
            x: "-50%",
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.4,
          }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 z-20 flex flex-col items-center gap-6 sm:gap-8 group pointer-events-auto transform-gpu"
        >
          {/* Glass Box behind Explore Tracks text */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/80 shadow-md shadow-black/10 flex items-center justify-center"
          >
            <span className="font-roboto-mono text-xs sm:text-sm font-bold text-[#8a1c1c]/95 tracking-widest uppercase drop-shadow-sm select-none group-hover:text-[#8a1c1c] whitespace-nowrap">
              Explore Tracks
            </span>
          </motion.div>

          {/* Circular Down Arrow Pill Button with Floating Animation */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.15 }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/80 shadow-md shadow-black/10 flex items-center justify-center text-[#8a1c1c]"
          >
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </motion.div>
        </motion.a>
      </section>

      {/* SECTION 2: ABOUT US SECTION */}
      <section
        id="about"
        className="relative w-full min-h-screen text-slate-900 flex flex-col items-center justify-center z-10 px-4 py-24 scroll-mt-6"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          
          {/* Section Heading in Saman Font and Pure White Color */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-saman text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-lg mb-12 sm:mb-16 md:mb-20 tracking-tight text-center select-none"
          >
            About Us
          </motion.h2>

          {/* 3D Circular Orbit Card Carousel with 3 Rich Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full flex items-center justify-center"
          >
            <CardStack
              items={ABOUT_CARDS}
              initialIndex={0}
              autoAdvance
              intervalMs={6000}
              pauseOnHover
              showDots={false}
              showArrows={true}
              cardWidth={isMobileScreen ? 330 : 960}
              cardHeight={isMobileScreen ? 770 : 640}
              maxVisible={3}
              spreadDeg={0}
              tiltXDeg={0}
              springStiffness={120}
              springDamping={22}
              renderCard={renderAboutCard}
            />
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: TRACKS SECTION (RADIAL ORBITAL TIMELINE INTEGRATION) */}
      <section
        id="tracks"
        className="relative w-full min-h-[750px] sm:min-h-[820px] md:min-h-[860px] text-slate-900 flex flex-col items-center justify-start z-40 px-4 pt-2 sm:pt-4 pb-12 sm:pb-16 scroll-mt-6"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-start text-center">
          {/* Section Heading in Saman Font and Pure White Color */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-saman text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-lg mb-1 tracking-tight text-center select-none"
          >
            Tracks
          </motion.h2>

          {/* Professional White Instruction Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-roboto-mono text-xs sm:text-sm md:text-base text-white font-bold tracking-wider sm:tracking-widest uppercase mb-2 sm:mb-4 drop-shadow-md select-none"
          >
            Click on any track icon to explore details
          </motion.p>

          {/* Radial Orbital Timeline Component */}
          <div className="w-full flex items-center justify-center">
            <RadialOrbitalTimeline timelineData={TRACKS_TIMELINE_DATA} />
          </div>
        </div>
      </section>

      {/* SECTION 4: PRIZE POOL SECTION */}
      <section
        id="prizes"
        className="relative w-full text-slate-900 flex flex-col items-center justify-start z-10 px-4 pt-0 sm:pt-2 pb-12 sm:pb-16 -mt-16 sm:-mt-24 scroll-mt-6"
      >
        <div className="relative z-10 w-full max-w-xl md:max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Section Heading in Saman Font and Pure White Color */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-saman text-4xl sm:text-6xl md:text-7xl text-white drop-shadow-lg mb-6 sm:mb-8 tracking-tight text-center select-none"
          >
            Prize Pool
          </motion.h2>

          <div className="w-full flex flex-col items-center gap-5 sm:gap-6">
            {/* Box 1: Total Prize Money Translucent Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
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
                Exciting rewards await at <strong className="font-extrabold text-white">KAGADA 2026</strong>! A total prize pool of <strong className="font-extrabold text-white">₹40,000</strong> will be shared across <strong className="font-extrabold text-white">Paper, Poster, and Project presentations</strong>, celebrating creativity, technical excellence and impactful ideas.
              </p>
            </motion.div>

            {/* Box 2: Certificate Participation Translucent Glass Banner */}
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.15 }}
              className="relative w-full max-w-lg mx-auto bg-white/40 backdrop-blur-2xl border-2 border-white/80 shadow-xl shadow-black/20 rounded-2xl sm:rounded-3xl py-3 px-5 sm:py-3.5 sm:px-6 text-white flex items-center justify-center gap-2.5 sm:gap-3 text-center overflow-hidden transform-gpu"
            >
              {/* Award SVG Icon */}
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0 drop-shadow-sm" />

              {/* Banner Text */}
              <p className="font-jakarta text-xs sm:text-sm text-white font-semibold leading-snug drop-shadow-sm">
                Every participant will be awarded a <strong className="font-black text-white">Certificate of Participation</strong>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PREVIOUS WINNERS SECTION */}
      <section
        id="winners"
        className="relative w-full text-slate-900 flex flex-col items-center justify-start z-10 px-4 pt-6 sm:pt-10 pb-12 sm:pb-16 scroll-mt-6"
      >
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Section Heading in Saman Font and Pure White Color */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-saman text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-lg mb-3 sm:mb-4 tracking-tight text-center select-none"
          >
            Previous Winners
          </motion.h2>

          {/* Subtitle text */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-jakarta font-medium text-white/90 text-base sm:text-lg md:text-xl max-w-2xl text-center drop-shadow-sm mb-4 sm:mb-8"
          >
            Honoring innovation, creativity, and excellence that shaped KAGADA’s journey.
          </motion.p>

          {/* 3 Interactive Empty Glassmorphic Cards */}
          <div className="w-full flex items-center justify-center">
            <Hero10 animation="subtle" />
          </div>
        </div>
      </section>

      {/* SECTION 6: GALLERY */}
      <section
        id="gallery"
        className="relative w-full min-h-screen mt-6 sm:mt-12 pt-8 sm:pt-12 pb-6 sm:pb-10 overflow-hidden z-20 flex flex-col items-center justify-start scroll-mt-24"
      >
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Saman Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-saman text-white text-5xl sm:text-7xl md:text-8xl drop-shadow-lg tracking-tight text-center select-none mb-3 sm:mb-4 px-4"
          >
            Gallery
          </motion.h2>

          {/* Subtitle text */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-jakarta font-medium text-white/90 text-base sm:text-lg md:text-xl max-w-2xl text-center drop-shadow-sm mb-8 sm:mb-12 px-4"
          >
            Capturing the essence of innovation, creativity, and celebration from past KAGADA events.
          </motion.p>

          {/* Dual-Row Continuous Infinite Parallax Marquee */}
          <div className="w-full">
            <GalleryMarquee />
          </div>
        </div>
      </section>

      {/* SECTION 7: AFTERMOVIES / VIDEOS */}
      <section
        id="videos"
        className="relative w-full mt-2 sm:mt-4 pt-2 sm:pt-4 pb-12 sm:pb-16 overflow-hidden z-20 flex flex-col items-center justify-start scroll-mt-24"
      >
        <AftermoviesSection />
      </section>

      {/* SECTION 8: SPONSORS */}
      <section
        id="sponsors"
        className="relative w-full mt-4 sm:mt-8 pt-4 sm:pt-8 pb-12 sm:pb-16 overflow-hidden z-20 flex flex-col items-center justify-start scroll-mt-24"
      >
        <SponsorsSection />
      </section>

      {/* SECTION 9: FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section
        id="faq"
        className="relative w-full mt-4 sm:mt-8 pt-4 sm:pt-8 pb-12 sm:pb-16 overflow-hidden z-20 flex flex-col items-center justify-start scroll-mt-24"
      >
        <FAQSection />
      </section>

      {/* SECTION 10: CONTACT US */}
      <section
        id="contact"
        className="relative w-full mt-4 sm:mt-8 pt-4 sm:pt-8 pb-12 sm:pb-16 overflow-hidden z-20 flex flex-col items-center justify-start scroll-mt-24"
      >
        <ContactSection />
      </section>

      {/* FOOTER */}
      <Footer />

      {/* FULLSCREEN STANDALONE INTRO VIDEO OVERLAY */}
      <AnimatePresence>
        {!isVideoHidden && (
          <motion.div
            key="intro-video-container"
            initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            animate={{
              opacity: isVideoFading ? 0 : 1,
              scale: isVideoFading ? 1.04 : 1,
              filter: isVideoFading ? "blur(4px)" : "blur(0px)",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleTapToUnmute}
            className="fixed inset-0 z-50 bg-black cursor-pointer transform-gpu pointer-events-auto"
          >
            <video
              ref={videoRef}
              src="/video-intro.mp4"
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover"
            />

            {/* Soft White Screen Overlay over Video (18% Opacity) */}
            <div className="absolute inset-0 bg-white/18 pointer-events-none z-[51]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* KAGADA 2025 AI ASSISTANT CHATBOT */}
      <AIChatCard isVisible={isVideoHidden} />
    </main>
  );
}
