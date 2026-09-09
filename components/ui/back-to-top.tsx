"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(20);

  const handleScroll = useCallback(() => {
    // Show/hide based on scroll position
    setIsVisible(window.scrollY > 300);

    // Detect footer and adjust bottom offset
    const footer = document.querySelector("footer");
    if (!footer) return;

    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const defaultBottom = 20; // normal bottom offset in px
    const margin = 16; // gap above footer border

    if (footerRect.top < viewportHeight) {
      // Footer is visible — push button above its top edge
      const newBottom = viewportHeight - footerRect.top + margin;
      setBottomOffset(Math.max(newBottom, defaultBottom));
    } else {
      setBottomOffset(defaultBottom);
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const initialRaf = window.requestAnimationFrame(handleScroll);
    return () => {
      window.cancelAnimationFrame(initialRaf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { duration?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="fixed left-5 sm:left-7 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-[#8a1c1c]/90 backdrop-blur-2xl border-2 border-white/80 text-white shadow-2xl shadow-black/60 hover:bg-[#8a1c1c] hover:border-white transition-all duration-300 group select-none cursor-pointer"
          style={{ bottom: `${bottomOffset}px` }}
          aria-label="Back to Top"
        >
          <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[3] group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-md" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
