"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface KagathonPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Pre-decode poster image once globally so it resides directly in GPU texture memory
if (typeof window !== "undefined") {
  const preloadImg = new Image();
  preloadImg.src = "/optimized/kagathon/kagathon-poster-720.webp";
  if (preloadImg.decode) {
    preloadImg.decode().catch(() => {});
  }
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function KagathonPopup({ isOpen, onClose }: KagathonPopupProps) {
  const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const maybeLaterBtnRef = useRef<HTMLButtonElement>(null);

  // Handle Lenis pause, escape key, and mutual exclusivity
  useEffect(() => {
    if (!isOpen) return;

    window.dispatchEvent(new CustomEvent("kagada:close-dropdown"));
    window.dispatchEvent(new CustomEvent("kagada:close-chat"));

    // Freeze virtualized scrolling without modifying document.body.style.overflow to prevent layout shifts
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

    const focusTimer = setTimeout(() => {
      maybeLaterBtnRef.current?.focus();
    }, 60);

    return () => {
      if (lenis) {
        lenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  // Smooth redirection directly to the middle of the Kagathon section
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
        // Position viewport directly over the center of the Kagathon section
        lenis.scrollTo(elem, {
          offset: -50,
          duration: 0.9,
          easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        });
      } else {
        elem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 240);
  };

  if (!isMounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div
          data-lenis-prevent="true"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kagathon-popup-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 select-none pointer-events-auto"
          style={{ touchAction: "none" }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* SEPARATE LAYER 1: Pure GPU Alpha Backdrop (Zero CSS Blur Filter = True 60 FPS) */}
          <motion.div
            key="kagathon-pure-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={onClose}
            style={{
              transform: "translateZ(0)",
              willChange: "opacity",
              backgroundColor: "rgba(10, 1, 3, 0.78)",
            }}
            className="fixed inset-0 cursor-pointer overflow-hidden"
            aria-label="Close Kagathon announcement"
          />

          {/* SEPARATE LAYER 2: Hardware-Composited Dialog Card */}
          <motion.div
            key="kagathon-pure-card"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: "translateZ(0)",
              willChange: "transform, opacity",
              backgroundColor: "#EAE5D9",
            }}
            className="relative z-10 w-[92vw] max-w-[360px] sm:max-w-[390px] flex flex-col items-center border-2 border-white/95 shadow-2xl shadow-black/50 !rounded-2xl sm:!rounded-3xl overflow-hidden p-5 sm:p-6"
          >

            {/* Poster Showcase Container */}
            <div className="w-[210px] h-[210px] min-[360px]:w-[240px] min-[360px]:h-[240px] sm:w-[260px] sm:h-[260px] aspect-square !rounded-xl sm:!rounded-2xl overflow-hidden border-2 border-white/90 shadow-xl relative bg-[#D8D3C7]/40 shrink-0 mx-auto mt-1 sm:mt-2">
              <img
                src="/optimized/kagathon/kagathon-poster-720.webp"
                srcSet="/optimized/kagathon/kagathon-poster-720.webp 720w, /optimized/kagathon/kagathon-poster.webp 1200w"
                sizes="(max-width: 640px) 240px, 260px"
                width={720}
                height={720}
                alt="Kagathon - Your Only Limit Is You"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Catchy Persuasive Text & Tagline */}
            <div className="text-center px-2 mt-3.5 sm:mt-4 text-[#5A182B] flex flex-col items-center">
              <p className="font-roboto-mono text-[9px] min-[360px]:text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5A182B]/80 mb-1">
                The Curtain Raiser for Kagada 2026
              </p>
              <h2
                id="kagathon-popup-title"
                className="font-smooch text-3xl sm:text-4xl font-semibold leading-none tracking-wide text-[#5A182B]"
              >
                Run the Beat. Feel the Thrill.
              </h2>
              <p className="font-jakarta text-xs sm:text-sm text-slate-800 font-medium mt-1.5 leading-relaxed max-w-[280px] sm:max-w-xs mx-auto">
                Sunrise energy, live DJ beats, exciting treats & official certificate await at UVCE Quadrangle!
              </p>
            </div>

            {/* Actions: Register & Maybe Later */}
            <div className="w-full flex flex-col items-center gap-2.5 mt-4 sm:mt-5 pt-1">
              <a
                href="#kagathon"
                onClick={handleRegisterClick}
                className="w-full py-3 px-4 bg-[#5A182B] hover:bg-[#431220] border-2 border-white/95 text-white font-roboto-mono font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-none shadow-lg flex items-center justify-center transition-colors select-none text-center"
              >
                <span>REGISTER FOR KAGATHON &rarr;</span>
              </a>
              <button
                ref={maybeLaterBtnRef}
                type="button"
                onClick={onClose}
                className="font-roboto-mono text-xs font-semibold tracking-wider text-[#5A182B]/75 hover:text-[#5A182B] transition-colors cursor-pointer py-1.5 px-4 outline-none focus-visible:ring-1 focus-visible:ring-[#5A182B]/40 hover:underline underline-offset-4"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
