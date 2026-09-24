"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  isIntroActive?: boolean;
}

export const Navbar = memo(function Navbar({ isIntroActive = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Close mobile menu on Escape or click outside.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile dropdown automatically when the user scrolls or wheels while it is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const initialScrollY = window.scrollY;

    const handleScroll = () => {
      if (Math.abs(window.scrollY - initialScrollY) > 8) {
        setMobileMenuOpen(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 4 || Math.abs(e.deltaX) > 4) {
        setMobileMenuOpen(false);
      }
    };

    let startTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startTouchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - startTouchY) > 10) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [mobileMenuOpen]);

  // Listen for custom event from AIChatCard to close dropdown if chatbot is opened
  useEffect(() => {
    const handleClose = () => setMobileMenuOpen(false);
    window.addEventListener("kagada:close-dropdown", handleClose);
    return () => window.removeEventListener("kagada:close-dropdown", handleClose);
  }, []);

  const handleToggleMenu = () => {
    setMobileMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        // Automatically close AI chat if dropdown is opened
        window.dispatchEvent(new CustomEvent("kagada:close-chat"));
      }
      return next;
    });
  };

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -80, opacity: 0, x: "-50%" }}
      animate={{
        y: isIntroActive ? -80 : 0,
        opacity: isIntroActive ? 0 : 1,
        x: "-50%",
      }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 20,
        delay: isIntroActive ? 0 : 0.2,
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
      className="fixed top-[calc(1rem+env(safe-area-inset-top,0px))] sm:top-6 left-1/2 z-[999] w-[94%] sm:w-[92%] max-w-7xl h-14 sm:h-16 !rounded-full kagada-paper-card border-2 border-white/95 shadow-xl shadow-black/20 px-4 sm:px-8 flex flex-nowrap items-center justify-between pointer-events-auto"
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
          width={1057}
          height={455}
          fetchPriority="high"
          decoding="async"
          className="h-10 sm:h-12 xl:h-14 w-auto object-contain transition-glass duration-300 shrink-0"
        />
      </a>

      {/* Desktop Navigation Links — Strictly Single Line With Generous Spacing */}
      <nav className="hidden lg:flex flex-nowrap items-center gap-3.5 xl:gap-6 2xl:gap-8 font-roboto-mono text-xs xl:text-sm font-bold tracking-wider text-[#5A182B] shrink-0">
        <a
          href="#about"
          className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#5A182B]/70"
        >
          About Us
        </a>
        <a
          href="#tracks"
          className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#5A182B]/70"
        >
          Tracks
        </a>
        <a
          href="#prizes"
          className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#5A182B]/70"
        >
          Prize Pool
        </a>
        <a
          href="#winners"
          className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#5A182B]/70"
        >
          Winners
        </a>
        <a
          href="#gallery"
          className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#5A182B]/70"
        >
          Gallery
        </a>
        <a
          href="#videos"
          className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#5A182B]/70"
        >
          Aftermovies
        </a>
        {/* <a
          href="#sponsors"
          className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#5A182B]/70"
        >
          Sponsors
        </a> */}
        <a
          href="#faq"
          className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#5A182B]/70"
        >
          FAQ
        </a>
        <a
          href="#contact"
          className="whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#5A182B]/70"
        >
          Contact
        </a>
      </nav>

      {/* Mobile & Tablet Toggle Button */}
      <button
        onClick={handleToggleMenu}
        className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#5A182B] hover:text-[#5A182B]/70 transition-colors shrink-0 cursor-pointer"
        aria-label="Toggle Menu"
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-nav-dropdown"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Dropdown Navigation.
          Deliberately always rendered rather than mounted on open. Mounting it
          meant React render + layout + the first raster of a ~350x430
          `.kagada-paper-card` (a six-layer procedural gradient) all had to land
          inside the first frame of the open animation, which is exactly the
          frame that has no budget to spare. Kept in the DOM, that paint is
          already done and opening is only `opacity` + `translate`, both of
          which the compositor handles without touching layout or paint.

          It is also plain CSS now instead of framer-motion: a JS-driven
          animation has to tick on the main thread every frame, and this one
          has nothing JS needs to decide. `lg:hidden` means it does not exist
          at all on desktop. `inert` keeps it out of the tab order and the
          accessibility tree while it is closed, which is what the old
          conditional mount was giving us for free.

          No `scale`: scaling a gradient-textured card makes Chrome
          re-rasterise the texture at each step to stay sharp, where a
          translate just moves an already-rasterised layer.

          `shadow-2xl` -> `shadow-xl`: a 50px blur over a panel this size was
          the most expensive part of its paint, same finding as the header
          above and the chat panel. */}
      <div
        id="mobile-nav-dropdown"
        inert={!mobileMenuOpen}
        className={cn(
          "absolute top-18 sm:top-20 left-0 right-0 kagada-paper-card border-2 border-white/95",
          "!rounded-3xl p-6 shadow-xl shadow-black/25 flex flex-col gap-4 font-roboto-mono",
          "text-base font-bold text-[#5A182B] lg:hidden z-[1001]",
          "transition-[opacity,translate] duration-200 ease-out",
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2.5 pointer-events-none"
        )}
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
          {/* <a href="#sponsors" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
            Sponsors
          </a> */}
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
            FAQ
          </a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity">
            Contact
          </a>
      </div>
    </motion.header>
  );
});

export default Navbar;
