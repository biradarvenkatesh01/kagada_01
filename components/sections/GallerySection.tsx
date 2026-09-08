"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import GalleryMarquee from "@/components/ui/gallery-marquee";

export const GallerySection = memo(function GallerySection() {
  return (
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
  );
});

export default GallerySection;
