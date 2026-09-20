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
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="fixed bottom-5 sm:bottom-7 left-5 sm:left-7 z-50 w-12 h-12 sm:w-14 sm:h-14 !rounded-full flex items-center justify-center kagada-paper-card border-2 border-white/95 text-[#5A182B] shadow-2xl shadow-black/40 hover:border-white transition-all duration-300 group select-none cursor-pointer"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 text-[#5A182B] stroke-[2.8] group-hover:-translate-y-0.5 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
