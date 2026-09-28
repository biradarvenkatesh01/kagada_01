"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface KagathonPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const cardVariants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function KagathonPopup({ isOpen, onClose }: KagathonPopupProps) {
  const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const maybeLaterBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Preload the poster on mount with new Image() so it is already decoded when popup opens
    const img720 = new Image();
    img720.src = "/optimized/kagathon/kagathon-poster-720.webp";
    const img1200 = new Image();
    img1200.src = "/optimized/kagathon/kagathon-poster.webp";
  }, []);

  // Scroll lock, lenis pause, escape key, and mutual exclusivity events
  useEffect(() => {
    if (!isOpen) return;

    // Dispatch custom events to close navbar dropdown or chat if open
    window.dispatchEvent(new CustomEvent("kagada:close-dropdown"));
    window.dispatchEvent(new CustomEvent("kagada:close-chat"));

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const lenis = (
      window as unknown as {
        __lenis?: { stop: () => void; start: () => void };
      }
    ).__lenis;
    if (lenis) {
      lenis.stop();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Focus interactive button on open
    const focusTimer = setTimeout(() => {
      maybeLaterBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      if (lenis) {
        lenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const elem = document.getElementById("kagathon");
      if (!elem) {
        window.location.hash = "kagathon";
        return;
      }
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (el: HTMLElement | string, opts?: unknown) => void };
        }
      ).__lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(elem, { offset: -80 });
      } else {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  if (!isMounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kagathon-popup-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overscroll-none"
        >
          {/* Backdrop with slight blur, tinted burgundy, fabric texture, and vignette */}
          <motion.div
            key="kagathon-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
            className="fixed inset-0 cursor-pointer overflow-hidden touch-none transform-gpu will-change-opacity backdrop-blur-[3px]"
            aria-label="Close Kagathon announcement"
          >
            <div className="absolute inset-0 bg-[#5A182B]/80" />
            <div className="absolute inset-0 opacity-50 kagada-fabric-bg-texture pointer-events-none transform-gpu" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 35%, rgba(15, 1, 4, 0.5) 100%)",
              }}
            />
          </motion.div>

          {/* Card: Animates opacity and y only (never scale) */}
          <motion.div
            key="kagathon-popup-card"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-[92vw] max-w-[360px] sm:max-w-[400px] flex flex-col items-center kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/40 !rounded-2xl sm:!rounded-3xl overflow-hidden pointer-events-auto transform-gpu select-none p-4 sm:p-5"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5A182B]/10 hover:bg-[#5A182B]/20 text-[#5A182B] flex items-center justify-center transition-colors cursor-pointer text-base sm:text-lg font-bold leading-none"
            >
              &times;
            </button>

            {/* Poster - Significantly enlarged */}
            <div className="w-[230px] h-[230px] min-[360px]:w-[260px] min-[360px]:h-[260px] sm:w-[300px] sm:h-[300px] aspect-square !rounded-xl sm:!rounded-2xl overflow-hidden border-2 border-white/90 shadow-xl relative bg-[#D8D3C7]/40 shrink-0 mx-auto">
              <img
                src="/optimized/kagathon/kagathon-poster-720.webp"
                srcSet="/optimized/kagathon/kagathon-poster-720.webp 720w, /optimized/kagathon/kagathon-poster.webp 1200w"
                sizes="(max-width: 640px) 260px, 300px"
                width={1200}
                height={1200}
                alt="Kagathon - Your Only Limit Is You"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Catchy Persuasive Text */}
            <div className="text-center px-1 pt-3 pb-1 text-[#5A182B]">
              <h2
                id="kagathon-popup-title"
                className="font-smooch text-3xl sm:text-4xl font-semibold leading-none tracking-wide text-[#5A182B]"
              >
                Run the Beat. Feel the Thrill.
              </h2>
              <p className="font-jakarta text-xs sm:text-sm text-slate-800 font-medium mt-1.5 leading-snug">
                Sunrise energy, live DJ beats, exciting treats & official certificate await at UVCE Quadrangle!
              </p>
            </div>

            {/* Registration Action Button & Maybe Later */}
            <div className="w-full flex flex-col items-center gap-1.5 pt-2">
              <a
                href="#kagathon"
                onClick={handleRegisterClick}
                className="w-full py-2.5 sm:py-3 px-4 bg-[#5A182B] hover:bg-[#431220] border-2 border-white/95 text-white font-roboto-mono font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-none shadow-lg flex items-center justify-center transition-colors select-none text-center"
              >
                <span>REGISTER FOR KAGATHON &rarr;</span>
              </a>
              <button
                ref={maybeLaterBtnRef}
                type="button"
                onClick={onClose}
                className="font-roboto-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#5A182B]/75 hover:text-[#5A182B] transition-colors cursor-pointer py-1"
              >
                MAYBE LATER
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
