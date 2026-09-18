"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldBeVisible = window.scrollY > 300;
          setIsVisible((prev) => (prev !== shouldBeVisible ? shouldBeVisible : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          className="fixed bottom-5 sm:bottom-7 left-5 sm:left-7 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-[#8a1c1c]/90 backdrop-blur-lg border-2 border-white/80 text-white shadow-2xl shadow-black/60 hover:bg-[#8a1c1c] hover:border-white transition-all duration-300 group select-none cursor-pointer"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[3] group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-md" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
