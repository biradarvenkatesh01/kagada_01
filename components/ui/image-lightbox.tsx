"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LightboxState {
  src: string;
  alt: string;
}

export default function ImageLightbox() {
  const [activeImage, setActiveImage] = useState<LightboxState | null>(null);

  // Close lightbox handler
  const handleClose = useCallback(() => {
    setActiveImage(null);
  }, []);

  // Global click delegator: catches any image clicked across the website
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore interactive controls, navigation, header, hero, contact, footer, and excluded containers
      if (
        target.closest("footer") ||
        target.closest("#contact") ||
        target.closest("#hero") ||
        target.closest("#tracks") ||
        target.closest("#about") ||
        target.closest("header") ||
        target.closest("nav") ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("form") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[data-no-lightbox]") ||
        target.closest(".no-lightbox")
      ) {
        return;
      }

      let imgEl: HTMLImageElement | null = null;

      // Only inspect if the user clicked directly on an <img> or on a designated zoomable wrapper
      if (target.tagName === "IMG") {
        imgEl = target as HTMLImageElement;
      } else {
        const zoomWrapper = target.closest("[data-lightbox-wrapper], .cursor-zoom-in");
        if (zoomWrapper) {
          imgEl = zoomWrapper.querySelector("img");
        }
      }

      if (!imgEl) return;

      // Ensure the image is not inside an excluded area
      if (
        imgEl.closest("footer") ||
        imgEl.closest("#contact") ||
        imgEl.closest("#hero") ||
        imgEl.closest("#tracks") ||
        imgEl.closest("#about") ||
        imgEl.closest("header") ||
        imgEl.closest("nav") ||
        imgEl.closest("[data-no-lightbox]") ||
        imgEl.dataset.noLightbox === "true"
      ) {
        return;
      }

      const src = imgEl.dataset.fullSrc || imgEl.currentSrc || imgEl.src;
      if (
        !src ||
        src.endsWith(".svg") ||
        src.includes("hero-bg") ||
        imgEl.clientWidth < 60 ||
        imgEl.clientHeight < 60
      ) {
        return;
      }

      // Open in lightbox
      setActiveImage({
        src,
        alt: imgEl.alt || "KAGADA 2026 Preview",
      });
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeImage) {
        handleClose();
      }
    };

    if (activeImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [activeImage, handleClose]);

  return (
    <AnimatePresence>
      {activeImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-8 md:p-12 select-none bg-black/85 backdrop-blur-2xl"
          onClick={handleClose}
        >
          {/* Top Control Bar: ONLY Clean Close Button */}
          <div
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000000] flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="p-3 sm:p-3.5 rounded-full bg-[#8a1c1c]/90 hover:bg-[#8a1c1c] backdrop-blur-xl border-2 border-white/80 text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              title="Close image"
              aria-label="Close image"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Centered Image Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 12, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative max-w-[92vw] max-h-[82vh] flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-w-[92vw] max-h-[82vh] w-auto h-auto object-contain rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-2 border-white/40"
            />
          </motion.div>

          {/* Bottom Caption Pill */}
          {activeImage.alt && activeImage.alt !== "Card" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.08, duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-[1000000] px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white font-jakarta text-xs sm:text-sm font-semibold tracking-wide shadow-2xl max-w-[90vw] text-center truncate pointer-events-none"
            >
              {activeImage.alt}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
