"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlipClock from "@/components/ui/flip-clock";
import { Menu, X, ChevronDown } from "lucide-react";

// Target Event Date: 10th October 2026
const KAGADA_EVENT_DATE = new Date("2026-10-10T00:00:00");

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center p-0 m-0">
      
      {/* Background Image Layer (Smooth Motion Dissolve) */}
      <motion.img
        src="/hero-bg.jpg"
        alt="UVCE Building"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVideoFading ? 1 : 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 w-full h-full object-cover z-0 transform-gpu"
      />

      {/* Textured White Overlay Screen with Clean Soft White Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVideoFading ? 1 : 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-white/30 bg-tech-grid pointer-events-none z-[1]"
      />

      {/* Floating Glassmorphic Pill Navbar with Spring Entrance */}
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
        className="fixed top-6 left-1/2 z-30 w-[92%] max-w-7xl h-16 rounded-full bg-white/30 backdrop-blur-xl border border-white/70 shadow-lg shadow-black/10 px-4 sm:px-8 flex items-center justify-between pointer-events-auto transform-gpu"
      >
        {/* Left Brand Logo (handle.png tinted in Kagada Red tone) */}
        <a href="#" className="flex items-center gap-2 select-none py-0">
          <img
            src="/handle.png"
            alt="IEEE UVCE Kagada Logo"
            className="h-11 sm:h-14 w-auto object-contain transition-transform hover:scale-105 drop-shadow-sm"
            style={{
              filter: "invert(18%) sepia(85%) saturate(3000%) hue-rotate(345deg) brightness(85%) contrast(95%)"
            }}
          />
        </a>

        {/* Desktop Navigation Links in Kagada Red Tone (#8a1c1c) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-roboto-mono text-sm font-bold text-[#8a1c1c]/90">
          <a href="#about" className="hover:text-[#8a1c1c] hover:scale-105 transition-all">
            About
          </a>
          <a href="#tracks" className="hover:text-[#8a1c1c] hover:scale-105 transition-all">
            Tracks
          </a>
          <a href="#prizes" className="hover:text-[#8a1c1c] hover:scale-105 transition-all">
            Prize Pool
          </a>
          <a href="#winners" className="hover:text-[#8a1c1c] hover:scale-105 transition-all">
            Winners
          </a>
          <a href="#gallery" className="hover:text-[#8a1c1c] hover:scale-105 transition-all">
            Gallery
          </a>
          <a href="#contact" className="hover:text-[#8a1c1c] hover:scale-105 transition-all">
            Contact
          </a>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#8a1c1c] hover:text-[#8a1c1c]/80 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 font-roboto-mono text-base font-bold text-[#8a1c1c]/90 md:hidden z-40"
            >
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8a1c1c] transition-colors">
                About
              </a>
              <a href="#tracks" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8a1c1c] transition-colors">
                Tracks
              </a>
              <a href="#prizes" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8a1c1c] transition-colors">
                Prize Pool
              </a>
              <a href="#winners" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8a1c1c] transition-colors">
                Winners
              </a>
              <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8a1c1c] transition-colors">
                Gallery
              </a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#8a1c1c] transition-colors">
                Contact
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Title & Subtitle Glass Box Container - Centered Vertically with Spring Entrance */}
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
        className="fixed top-[48%] sm:top-1/2 left-1/2 z-15 w-[95%] sm:w-auto max-w-lg sm:max-w-none flex flex-col items-center justify-center text-center pointer-events-none transform-gpu"
      >
        {/* Title Glass Box containing Title + Subtitle */}
        <div className="w-full px-3 sm:px-10 py-5 sm:py-8 rounded-2xl sm:rounded-3xl bg-white/30 backdrop-blur-md border border-white/80 shadow-xl shadow-black/10 flex flex-col items-center justify-center text-center mx-auto overflow-hidden">
          <h1 className="whitespace-nowrap font-saman font-normal text-[3.9rem] sm:text-6xl md:text-7xl lg:text-[8.5rem] text-[#8a1c1c]/80 tracking-[-0.015em] drop-shadow-sm select-none leading-none text-center mx-auto">
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

      {/* Bottom "Explore Tracks" CTA Indicator with Smooth Floating Physics */}
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
        className="fixed bottom-6 sm:bottom-10 left-1/2 z-20 flex flex-col items-center gap-6 sm:gap-8 group pointer-events-auto transform-gpu"
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

        {/* Circular Down Arrow Pill Button with Smooth Floating Animation */}
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

      {/* Video Layer Container with Smooth AnimatePresence Dissolve */}
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
            className="fixed inset-0 z-20 cursor-pointer transform-gpu pointer-events-auto"
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
            <div className="absolute inset-0 bg-white/18 pointer-events-none z-[21]" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
