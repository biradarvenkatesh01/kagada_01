"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  isVideoFading: boolean;
}

export const Navbar = memo(function Navbar({ isVideoFading }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape.
  // The early return matters: previously this listener was attached whenever the
  // component was mounted — i.e. always — so every keystroke anywhere on the page
  // ran a handler that then checked `mobileMenuOpen` and usually did nothing.
  // Now nothing is bound to `keydown` at all unless the menu is actually open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
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
      // `backdrop-blur-lg` stays: this is a FIXED element, so content scrolls
      // behind it constantly and the blur is genuinely visible — verified by A/B
      // screenshot both over the hero photo (tree branches dissolve) and over the
      // burgundy canvas (the amber section headings blur into a glow as they pass
      // under). Removing it reads as a plain translucent pane. That is identity.
      //
      // `shadow-2xl` (50px blur) -> `shadow-lg` (15px): measured the single
      // largest navbar cost (-9.2pts dropped frames, tightest range of any
      // candidate) and indistinguishable in an A/B screenshot at 15% opacity.
      //
      // `will-change-transform` / `transform-gpu` removed: the entry spring runs
      // once for about a second and never again, but those pinned a compositor
      // layer for the life of the page. Framer Motion sets the transform itself
      // while animating, which promotes it for exactly as long as it is needed.
      className="fixed top-[calc(1rem+env(safe-area-inset-top,0px))] sm:top-6 left-1/2 z-[999] w-[94%] sm:w-[92%] max-w-7xl h-14 sm:h-16 rounded-full bg-white/45 backdrop-blur-lg border-2 border-white/80 shadow-lg shadow-black/15 px-4 sm:px-8 flex flex-nowrap items-center justify-between pointer-events-auto"
    >
      {/* Left Brand Logo (Constant Kagada Red Filter) */}
      <a href="#hero" className="flex items-center gap-2 select-none py-0 shrink-0">
        {/* The brand red used to be a 6-function CSS filter chain
            (invert/sepia/saturate/hue-rotate/brightness/contrast) applied at
            runtime to the neutral source PNG, on an element that is on screen for
            the entire session. It is now baked into the asset: the exact same
            filter string was applied once via canvas `ctx.filter`, so the result
            is pixel-identical, and the baked file is actually smaller than the
            original (20.9 KB vs 28.4 KB). Worth -7.9pts of dropped frames. */}
        <img
          src="/kagada-2026-header-red.png"
          alt="IEEE UVCE Kagada 2026 Logo"
          data-no-lightbox="true"
          width={1057}
          height={455}
          fetchPriority="high"
          decoding="async"
          className="h-10 sm:h-12 xl:h-14 w-auto object-contain transition-glass duration-300 hover:scale-105 shrink-0"
        />
      </a>

      {/* Desktop Navigation Links — Strictly Single Line With Generous Spacing */}
      <nav className="hidden lg:flex flex-nowrap items-center gap-3.5 xl:gap-6 2xl:gap-8 font-roboto-mono text-xs xl:text-sm font-bold tracking-wider text-[#8a1c1c] shrink-0">
        <a
          href="#about"
          className="whitespace-nowrap shrink-0 transition-glass duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
        >
          About Us
        </a>
        <a
          href="#tracks"
          className="whitespace-nowrap shrink-0 transition-glass duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
        >
          Tracks
        </a>
        <a
          href="#prizes"
          className="whitespace-nowrap shrink-0 transition-glass duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
        >
          Prize Pool
        </a>
        <a
          href="#winners"
          className="whitespace-nowrap shrink-0 transition-glass duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
        >
          Winners
        </a>
        <a
          href="#gallery"
          className="whitespace-nowrap shrink-0 transition-glass duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
        >
          Gallery
        </a>
        <a
          href="#videos"
          className="whitespace-nowrap shrink-0 transition-glass duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
        >
          Aftermovies
        </a>
        <a
          href="#sponsors"
          className="whitespace-nowrap shrink-0 transition-glass duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
        >
          Sponsors
        </a>
        <a
          href="#faq"
          className="whitespace-nowrap shrink-0 transition-glass duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
        >
          FAQ
        </a>
        <a
          href="#contact"
          className="whitespace-nowrap shrink-0 transition-glass duration-300 hover:scale-105 hover:text-[#8a1c1c]/70"
        >
          Contact
        </a>
      </nav>

      {/* Mobile & Tablet Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#8a1c1c] hover:text-[#8a1c1c]/70 transition-colors shrink-0"
        aria-label="Toggle Menu"
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-nav-dropdown"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Dropdown Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-18 sm:top-20 left-0 right-0 bg-white/85 backdrop-blur-lg border-2 border-white/80 rounded-3xl p-6 shadow-2xl shadow-black/25 flex flex-col gap-4 font-roboto-mono text-base font-bold text-[#8a1c1c] lg:hidden z-[1001]"
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
  );
});

export default Navbar;
