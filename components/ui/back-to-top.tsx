"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
          className="fixed bottom-5 left-5 sm:bottom-7 sm:left-7 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[#8a1c1c]/90 backdrop-blur-2xl border-2 border-white/80 text-white shadow-2xl shadow-black/60 hover:bg-[#8a1c1c] transition-all duration-300 group select-none cursor-pointer"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3] group-hover:-translate-y-0.5 transition-transform duration-300 drop-shadow-md" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
