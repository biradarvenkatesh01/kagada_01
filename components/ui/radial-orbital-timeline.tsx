"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface TimelineItem {
  id: number;
  title: string;
  content: string;
  description?: string;
  imageSrc?: string;
  icon: React.ElementType;
  relatedIds: number[];
  fee?: number;
  teamSize?: string;
  hasRegistration?: boolean;
  registrationLink?: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

// 🎬 Snappy Apple-style slide & modal variants
const slideVariants: Variants = {
  initialModal: {
    opacity: 0,
    scale: 0.94,
    y: 12,
  },
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 32 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 32 },
      opacity: { duration: 0.16 },
      scale: { duration: 0.16 },
    },
  }),
};

// 📱 RESPONSIVE ORBIT RADIUS SUBSCRIPTION (118px phone < 480px, 165px tablet < 640px, 240px desktop)
const subscribeOrbitRadius = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mqlPhone = window.matchMedia("(max-width: 479px)");
  const mqlTablet = window.matchMedia("(max-width: 639px)");
  mqlPhone.addEventListener("change", callback);
  mqlTablet.addEventListener("change", callback);
  return () => {
    mqlPhone.removeEventListener("change", callback);
    mqlTablet.removeEventListener("change", callback);
  };
};

const getOrbitRadiusSnapshot = () => {
  if (typeof window === "undefined") return 240;
  if (window.matchMedia("(max-width: 479px)").matches) return 118;
  if (window.matchMedia("(max-width: 639px)").matches) return 165;
  return 240;
};

const getOrbitRadiusServerSnapshot = () => 240;

const emptySubscribe = () => () => {};
const getMountedClientSnapshot = () => true;
const getMountedServerSnapshot = () => false;

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isInView, setIsInView] = useState<boolean>(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getMountedClientSnapshot,
    getMountedServerSnapshot
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const rotationAngleRef = useRef<number>(0);

  // 🖼️ Preload track card images on mount so card renders instantly with zero decode stutter
  useEffect(() => {
    timelineData.forEach((item) => {
      if (item.imageSrc) {
        const img = new Image();
        img.src = item.imageSrc;
      }
    });
  }, [timelineData]);

  // ⚡ High-performance card close: clean transition, resumes RAF only after modal unmounts
  const closeCard = useCallback(() => {
    setActiveNodeId(null);
    setExpandedItems({});
    setDirection(0);
    // Delay resuming auto-rotation until the exit animation (~200ms) completes
    // so the exit animation runs at a solid 60-120fps with zero background RAF competition
    window.setTimeout(() => {
      setAutoRotate(true);
    }, 240);
  }, []);

  const openCard = useCallback(
    (id: number) => {
      setAutoRotate(false);
      const idx = timelineData.findIndex((item) => item.id === id);
      setDirection(0);
      setActiveIndex(idx !== -1 ? idx : 0);
      setExpandedItems({ [id]: true });
      setActiveNodeId(id);
    },
    [timelineData]
  );

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setActiveIndex((prev) => {
        const nextIndex =
          (prev + newDirection + timelineData.length) % timelineData.length;
        const nextItem = timelineData[nextIndex];
        if (nextItem) {
          setActiveNodeId(nextItem.id);
          setExpandedItems({ [nextItem.id]: true });
        }
        return nextIndex;
      });
    },
    [timelineData]
  );

  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex) return;
      const newDirection = targetIndex > activeIndex ? 1 : -1;
      setDirection(newDirection);
      setActiveIndex(targetIndex);
      const nextItem = timelineData[targetIndex];
      if (nextItem) {
        setActiveNodeId(nextItem.id);
        setExpandedItems({ [nextItem.id]: true });
      }
    },
    [activeIndex, timelineData]
  );

  const toggleItem = useCallback(
    (id: number) => {
      if (activeNodeId === id) {
        closeCard();
      } else {
        openCard(id);
      }
    },
    [activeNodeId, closeCard, openCard]
  );

  // 🔒 Modal scroll lock: prevent background page scrolling when card is open (mobile & desktop)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (activeNodeId !== null) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Stop Lenis virtualized scroll engine completely while modal is open
      const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
      if (lenis) {
        lenis.stop();
      }

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        if (lenis) {
          lenis.start();
        }
      };
    }
  }, [activeNodeId]);

  // ⌨️ Close card on Escape, slide with ArrowLeft / ArrowRight
  useEffect(() => {
    if (activeNodeId === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCard();
      } else if (e.key === "ArrowLeft") {
        paginate(-1);
      } else if (e.key === "ArrowRight") {
        paginate(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeNodeId, closeCard, paginate]);

  // 📱 Track visibility to avoid 60fps RAF re-renders when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 📱 RESPONSIVE ORBIT RADIUS (referentially stable)
  const orbitRadius = useSyncExternalStore(
    subscribeOrbitRadius,
    getOrbitRadiusSnapshot,
    getOrbitRadiusServerSnapshot
  );

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      closeCard();
    }
  };

  // Geometry for a single node at a given orbit rotation.
  const calculateNodePosition = useCallback(
    (index: number, total: number, angleDeg: number) => {
      const angle = ((index / total) * 360 + angleDeg) % 360;
      const radian = (angle * Math.PI) / 180;

      const x = orbitRadius * Math.cos(radian);
      const y = orbitRadius * Math.sin(radian);

      return { x, y };
    },
    [orbitRadius]
  );

  // Mirror the interaction state into refs so the RAF loop can read it without
  // being re-created. Kept in sync by the layout effect below, never in render.
  const expandedItemsRef = useRef(expandedItems);
  const activeNodeIdRef = useRef(activeNodeId);

  // ⚡ Writes orbit geometry straight to the DOM with GPU translate3d.
  // CRITICAL PERFORMANCE: Only updates `transform` on the rAF loop.
  // Mutating `zIndex` on every degree of rotation forced Chromium to run Recalculate Style
  // and rebuild the LayerTree 60-120 times/sec.
  const applyRotation = useCallback(
    (angleDeg: number) => {
      const total = timelineData.length;

      for (let i = 0; i < total; i++) {
        const item = timelineData[i];
        const el = nodeRefs.current[item.id];
        if (!el) continue;

        const position = calculateNodePosition(i, total, angleDeg);
        el.style.transform = `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, 0px)`;
      }
    },
    [timelineData, calculateNodePosition]
  );

  // Sync zIndex and opacity only when active/expanded card state changes, not on every rAF frame
  useLayoutEffect(() => {
    expandedItemsRef.current = expandedItems;
    activeNodeIdRef.current = activeNodeId;
    const isAnyCardOpen = activeNodeId !== null;

    for (const item of timelineData) {
      const el = nodeRefs.current[item.id];
      if (!el) continue;
      const isExpanded = !!expandedItems[item.id];
      el.style.zIndex = String(isExpanded ? 500 : 20);
      el.style.opacity = String(isExpanded ? 1 : isAnyCardOpen ? 0 : 1);
    }
    applyRotation(rotationAngleRef.current);
  }, [expandedItems, activeNodeId, timelineData, applyRotation]);



  // 🚀 HARDWARE-ACCELERATED RAF ROTATION (20°/sec = 18s 1:1 match with center gear)
  // Pauses automatically when off-screen or tab hidden to eliminate 60fps main-thread React re-renders
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!autoRotate || !isInView || prefersReducedMotion) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      return;
    }

    let isTabVisible = !document.hidden;

    const updateRotation = (time: number) => {
      if (!isTabVisible) return;
      if (lastTimeRef.current !== null) {
        const delta = (time - lastTimeRef.current) / 1000;
        rotationAngleRef.current = (rotationAngleRef.current + delta * 20) % 360;
        applyRotation(rotationAngleRef.current);
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(updateRotation);
    };

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTimeRef.current = performance.now();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updateRotation);
      } else {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    if (isTabVisible) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(updateRotation);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [autoRotate, isInView, applyRotation]);

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const activeItem =
    activeNodeId !== null && timelineData[activeIndex]
      ? timelineData[activeIndex]
      : null;

  // 📄 Shared parchment card layout for both desktop and mobile
  const renderCardContent = (item: TimelineItem) => (
    <div
      data-lenis-prevent="true"
      className="relative kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/40 !rounded-2xl sm:!rounded-3xl p-3.5 sm:p-5 md:p-6 lg:p-7 text-slate-900 flex flex-col max-h-[86vh] sm:max-h-[82vh] overflow-y-auto overscroll-contain custom-scrollbar transform-gpu"
    >
      {/* Top Floating Glass Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          closeCard();
        }}
        className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-30 w-7 h-7 sm:w-8 sm:h-8 !rounded-full bg-[#D8D3C7] border border-[#5A182B]/30 text-[#5A182B] hover:bg-white transition-colors flex items-center justify-center shadow-md cursor-pointer"
        aria-label="Close card"
      >
        <X className="w-4 h-4 text-[#5A182B]" />
      </button>

      {/* Smooch Sans Title Header (Centered at top in Deep Burgundy Maroon) */}
      <div className="flex items-center justify-center border-b border-[#5A182B]/20 pb-1.5 sm:pb-2 mb-2 sm:mb-3 md:mb-4 w-full pr-7 pl-2 sm:pr-0">
        <h3 className="font-smooch text-3xl sm:text-5xl md:text-6xl font-semibold text-[#5A182B] tracking-wide whitespace-nowrap text-center leading-none">
          {item.title}
        </h3>
      </div>

      {/* Card Content Layout: 2-Column Horizontal Side-by-Side Grid on PC, Responsive on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-4 md:gap-6 items-center w-full">
        {/* Image Box (Left Column on PC) */}
        {item.imageSrc && (
          <div className="md:col-span-5 w-full h-28 min-[380px]:h-32 sm:h-44 md:h-52 lg:h-60 !rounded-xl sm:!rounded-2xl overflow-hidden border-2 border-white/80 shadow-md bg-[#D8D3C7]/40 relative group shrink-0">
            <img
              src={item.imageSrc}
              alt={item.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>
        )}

        {/* Description Paragraph & Event Details (Right Column on PC) */}
        <div
          className={`${
            item.imageSrc ? "md:col-span-7" : "md:col-span-12"
          } flex flex-col justify-center space-y-2 sm:space-y-2.5 md:space-y-3 text-left w-full h-full`}
        >
          {(item.description || item.content) && (
            <p className="font-jakarta text-[0.76rem] min-[380px]:text-[0.82rem] sm:text-xs md:text-sm text-slate-800 leading-snug sm:leading-relaxed font-medium">
              {item.description || item.content}
            </p>
          )}

          {/* Fee & Team Size Boxes (Symmetrically Aligned 2-Column Grid) */}
          {(item.fee || item.teamSize) && (
            <div
              className={`grid ${
                item.fee && item.teamSize ? "grid-cols-2" : "grid-cols-1"
              } gap-2 sm:gap-2.5 w-full`}
            >
              {item.fee && (
                <div className="bg-[#D8D3C7]/60 border border-[#5A182B]/25 py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl shadow-inner flex items-center justify-center flex-nowrap text-center overflow-hidden">
                  <span className="text-[0.66rem] min-[350px]:text-[0.72rem] min-[400px]:text-[0.76rem] sm:text-xs md:text-sm font-bold text-[#5A182B] whitespace-nowrap">
                    Fee: ₹{item.fee} <span className="font-semibold text-[0.62rem] min-[350px]:text-[0.68rem] sm:text-xs text-[#5A182B]/75">/ team</span>
                  </span>
                </div>
              )}
              {item.teamSize && (
                <div className="bg-[#D8D3C7]/60 border border-[#5A182B]/25 py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl shadow-inner flex items-center justify-center flex-nowrap text-center overflow-hidden">
                  <span className="text-[0.66rem] min-[350px]:text-[0.72rem] min-[400px]:text-[0.76rem] sm:text-xs md:text-sm font-bold text-[#5A182B] whitespace-nowrap">
                    Team Size: {item.teamSize}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Registration Button */}
          {item.hasRegistration && (
            <a
              href={item.registrationLink || "#"}
              target={item.registrationLink ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="w-full bg-[#EAE5D9] hover:bg-[#D8D3C7] text-[#5A182B] font-roboto-mono font-bold py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-none text-[0.72rem] min-[380px]:text-[0.78rem] sm:text-[0.85rem] uppercase tracking-wider sm:tracking-widest transition-all active:scale-[0.98] mt-0.5 border-2 border-[#5A182B]/40 shadow-[2px_2px_6px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2"
            >
              {item.registrationLink ? "Register Now" : "Registrations Opening Soon"}
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="w-full min-h-[380px] sm:min-h-[580px] md:min-h-[620px] flex flex-col items-center justify-start bg-transparent overflow-visible py-0 select-none -mt-4 sm:-mt-6"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-6xl h-[380px] min-[480px]:h-[440px] sm:h-[580px] md:h-[620px] flex items-center justify-center">
        {/* Active card flag to hide background gear and sibling nodes */}
        {(() => {
          const isAnyCardOpen = activeNodeId !== null;
          return (
            <div
              className="absolute w-full h-full flex items-center justify-center transform-gpu will-change-transform"
              ref={orbitRef}
              style={{ perspective: isAnyCardOpen ? "none" : "1000px" }}
            >
              {/* ⚙️ PURE WHITE VECTOR GEAR (gear-svgrepo-com.svg) - Fades out when any card is open */}
              <div
                className={`absolute z-20 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                  isAnyCardOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                <div data-marquee-track className="animate-gear-spin flex items-center justify-center transform-gpu will-change-transform bg-transparent">
                  <svg
                    viewBox="0 0 32 32"
                    className="w-16 h-16 sm:w-44 sm:h-44 text-[#D8D3C7] fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M29 12.256h-1.88c-0.198-0.585-0.405-1.072-0.643-1.541l0.031 0.067 1.338-1.324c0.35-0.3 0.57-0.742 0.57-1.236 0-0.406-0.149-0.778-0.396-1.063l0.002 0.002-3.178-3.178c-0.283-0.246-0.654-0.395-1.061-0.395-0.494 0-0.937 0.221-1.234 0.57l-0.002 0.002-1.332 1.33c-0.402-0.206-0.888-0.413-1.39-0.586l-0.082-0.025 0.009-1.88c0.003-0.040 0.005-0.086 0.005-0.133 0-0.854-0.66-1.554-1.498-1.617l-0.005-0h-4.496c-0.844 0.063-1.505 0.763-1.505 1.617 0 0.047 0.002 0.093 0.006 0.139l-0-0.006v1.879c-0.585 0.198-1.071 0.404-1.54 0.641l0.067-0.031-1.324-1.336c-0.299-0.352-0.742-0.573-1.236-0.573-0.407 0-0.778 0.15-1.063 0.397l0.002-0.002-3.179 3.179c-0.246 0.283-0.396 0.655-0.396 1.061 0 0.494 0.221 0.937 0.57 1.234l0.002 0.002 1.329 1.329c-0.207 0.403-0.414 0.891-0.587 1.395l-0.024 0.082-1.88-0.009c-0.040-0.003-0.086-0.005-0.133-0.005-0.854 0-1.554 0.661-1.617 1.499l-0 0.005v4.495c0.062 0.844 0.763 1.505 1.617 1.505 0.047 0 0.093-0.002 0.139-0.006l-0.006 0h1.88c0.198 0.585 0.404 1.072 0.642 1.541l-0.030-0.066-1.335 1.32c-0.351 0.3-0.572 0.744-0.572 1.239 0 0.407 0.149 0.779 0.396 1.064l-0.002-0.002 3.179 3.178c0.249 0.246 0.591 0.399 0.97 0.399 0.007 0 0.014-0 0.021-0h-0.001c0.515-0.013 0.977-0.231 1.308-0.576l0.001-0.001 1.33-1.33c0.403 0.207 0.891 0.414 1.395 0.587l0.082 0.025-0.009 1.878c-0.003 0.040-0.005 0.086-0.005 0.132 0 0.854 0.661 1.555 1.499 1.617l0.005 0h4.496c0.843-0.064 1.503-0.763 1.503-1.617 0-0.047-0.002-0.093-0.006-0.139l0 0.006v-1.881c0.585-0.198 1.073-0.405 1.543-0.643l-0.067 0.031 1.321 1.333c0.332 0.344 0.793 0.562 1.304 0.574l0.002 0h0.002c0.006 0 0.013 0 0.019 0 0.378 0 0.72-0.151 0.971-0.395l3.177-3.177c0.244-0.249 0.395-0.591 0.395-0.968 0-0.009-0-0.017-0-0.026l0 0.001c-0.012-0.513-0.229-0.973-0.572-1.304l-0.001-0.001-1.331-1.332c0.206-0.401 0.412-0.887 0.586-1.389l0.025-0.083 1.879 0.009c0.040 0.003 0.086 0.005 0.132 0.005 0.855 0 1.555-0.661 1.617-1.5l0-0.005v-4.495c-0.063-0.844-0.763-1.504-1.618-1.504-0.047 0-0.093 0.002-0.138 0.006l0.006-0zM29.004 18.25l-2.416-0.012c-0.020 0-0.037 0.010-0.056 0.011-0.198 0.024-0.372 0.115-0.501 0.249l-0 0c-0.055 0.072-0.103 0.153-0.141 0.24l-0.003 0.008c-0.005 0.014-0.016 0.024-0.020 0.039-0.24 0.844-0.553 1.579-0.944 2.264l0.026-0.049c-0.054 0.1-0.086 0.218-0.086 0.344 0 0.001 0 0.003 0 0.004v-0c-0 0.016 0.003 0.028 0.004 0.045 0.006 0.187 0.080 0.355 0.199 0.481l-0-0 0.009 0.023 1.707 1.709c0.109 0.109 0.137 0.215 0.176 0.176l-3.102 3.133c-0.099-0.013-0.186-0.061-0.248-0.13l-0-0-1.697-1.713c-0.008-0.009-0.022-0.005-0.030-0.013-0.121-0.112-0.28-0.183-0.456-0.193l-0.002-0c-0.020-0.003-0.044-0.005-0.068-0.006l-0.001-0c-0.125 0-0.243 0.032-0.345 0.088l0.004-0.002c-0.636 0.362-1.373 0.676-2.146 0.903l-0.074 0.019c-0.015 0.004-0.025 0.015-0.039 0.020-0.096 0.042-0.179 0.092-0.255 0.149l0.003-0.002c-0.035 0.034-0.066 0.071-0.093 0.11l-0.002 0.002c-0.027 0.033-0.053 0.070-0.075 0.11l-0.002 0.004c-0.033 0.081-0.059 0.175-0.073 0.274l-0.001 0.007c-0.001 0.016-0.010 0.031-0.010 0.047v2.412c0 0.15-0.055 0.248 0 0.25l-4.41 0.023c-0.052-0.067-0.084-0.153-0.084-0.246 0-0.008 0-0.016 0.001-0.024l-0 0.001 0.012-2.412c0-0.017-0.008-0.032-0.010-0.048-0.005-0.053-0.015-0.102-0.030-0.149l0.001 0.005c-0.012-0.053-0.028-0.1-0.048-0.145l0.002 0.005c-0.052-0.86-0.109-0.16-0.173-0.227l0 0c-0.029-0.024-0.062-0.046-0.096-0.066l-0.004-0.002c-0.044-0.030-0.093-0.056-0.146-0.076l-0.005-0.002c-0.014-0.005-0.024-0.016-0.039-0.020-0.847-0.241-1.585-0.554-2.272-0.944l0.051 0.026c-0.099-0.054-0.216-0.086-0.341-0.086h-0c-0.022-0.001-0.040 0.004-0.062 0.005-0.18 0.008-0.342 0.080-0.465 0.193l0.001-0c-0.008 0.008-0.021 0.004-0.029 0.012l-1.705 1.705c-0.107 0.107-0.216 0.139-0.178 0.178l-3.134-3.101c0.012-0.1 0.060-0.187 0.13-0.25l0-0 1.714-1.695 0.011-0.026c0.115-0.123 0.189-0.286 0.197-0.466l0-0.002c0.001-0.021 0.005-0.037 0.005-0.058 0-0.001 0-0.002 0-0.003 0-0.126-0.032-2.45-0.088-0.348l0.002 0.004c-0.365-0.636-0.679-1.371-0.903-2.145l-0.018-0.072c-0.004-0.015-0.016-0.026-0.021-0.041-0.042-0.094-0.090-0.176-0.146-0.25l0.002 0.003c-0.065-0.061-0.136-0.117-0.212-0.165l-0.006-0.003c-0.051-0.025-0.109-0.045-0.171-0.057l-0.005-0.001c-0.029-0.009-0.065-0.016-0.102-0.021l-0.004-0c-0.020-0.002-0.037-0.012-0.058-0.012h-2.412c-0.152 0.002-0.248-0.055-0.25-0.002l-0.022-4.409c0.067-0.052 0.151-0.084 0.244-0.084 0.009 0 0.017 0 0.026 0.001l-0.001-0 2.416 0.012c0.152-0.004 0.292-0.054 0.407-0.136l-0.002 0.002c0.024-0.014 0.044-0.028 0.064-0.043l-0.002 0.001c0.109-0.088 0.191-0.206 0.235-0.341l0.001-0.005c0.003-0.010 0.014-0.014 0.017-0.025 0.242-0.847 0.555-1.583 0.946-2.27l-0.026 0.050c0.054-0.1 0.086-0.218 0.086-0.344 0-0.001 0-0.001 0-0.002v0c0.001-0.019-0.003-0.033-0.004-0.052-0.007-0.184-0.080-0.35-0.197-0.475l0 0-0.010-0.024-1.705-1.705c-0.108-0.11-0.142-0.221-0.176-0.178l3.102-3.134c0.101 0.008 0.189 0.058 0.248 0.131l0.001 0.001 1.697 1.713c0.018 0.018 0.046 0.011 0.065 0.027 0.125 0.121 0.295 0.196 0.483 0.196 0.13 0 0.251-0.036 0.355-0.098l-0.003 0.002c0.636-0.364 1.372-0.677 2.145-0.902l0.072-0.018c0.014-0.004 0.24-0.015 0.038-0.019 0.057-0.021 0.105-0.047 0.151-0.077l-0.003 0.002c0.163-0.090 0.281-0.244 0.321-0.427l0.001-0.004c0.014-0.043 0.025-0.093 0.030-0.145l0-0.003c0.001-0.016 0.009-0.030 0.009-0.046v-2.412c0-0.151 0.056-0.249 0.001-0.25l4.41-0.023c0.052 0.067 0.083 0.152 0.083 0.245 0 0.009-0 0.017-0.001 0.026l0-0.001-0.012 2.412c-0 0.016 0.008 0.030 0.009 0.047 0.005 0.055 0.015 0.106 0.031 0.155l-0.001-0.005c0.071 0.234 0.243 0.419 0.464 0.506l0.005 0.002c0.014 0.005 0.025 0.016 0.039 0.020 0.845 0.242 1.58 0.555 2.265 0.945l-0.050-0.026c0.105 0.060 0.231 0.096 0.366 0.096 0 0 0.001 0 0.001 0h-0c0.183-0.008 0.347-0.082 0.471-0.198l-0 0c0.017-0.015 0.043-0.008 0.059-0.024l1.709-1.705c0.105-0.106 0.213-0.137 0.176-0.176l3.133 3.102c-0.012 0.1-0.059 0.186-0.129 0.249l-0 0-1.715 1.697-0.011 0.026c-0.116 0.123-0.19 0.287-0.198 0.468l-0 0.002c-0.001 0.020-0.005 0.036-0.005 0.056 0 0.001 0 0.002 0 0.003 0 0.126 0.032 0.245 0.088 0.348l-0.002-0.004c0.365 0.636 0.679 1.371 0.902 2.144l0.018 0.071c0.003 0.012 0.016 0.017 0.019 0.028 0.046 0.137 0.127 0.253 0.232 0.339l0.001 0.001c0.019 0.015 0.041 0.030 0.063 0.043l0.003 0.002c0.112 0.080 0.252 0.13 0.402 0.134l0.001 0h2.412c0.152-0.001 0.248 0.057 0.25 0.001l0.021 4.409c-0.065 0.053-0.149 0.085-0.24 0.085-0.010 0-0.019-0-0.029-0.001l0.001 0zM16 11.25c-2.623 0-4.75 2.127-4.75 4.75s2.127 4.75 4.75 4.75c2.623 0 4.75-2.127 4.75-4.75v0c-0.003-2.622-2.128-4.747-4.75-4.75h-0zM16 19.25c-1.795 0-3.25-1.455-3.25-3.25s1.455-3.25 3.25-3.25c1.795 0 3.25 1.455 3.25 3.25v0c-0.002 1.794-1.456 3.248-3.25 3.25h-0z" />
                  </svg>
                </div>
              </div>

              {/* 🌌 ORBITING CIRCULAR NODES */}
              {timelineData.map((index_item, index) => {
                const item = index_item;
                const position = calculateNodePosition(
                  index,
                  timelineData.length,
                  0
                );
                const isExpanded = !!expandedItems[item.id];
                const isRelated = isRelatedToActive(item.id);
                const Icon = item.icon;

                const nodeStyle = {
                  transform: `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, 0px)`,
                  zIndex: isExpanded ? 500 : 20,
                  opacity: isExpanded ? 1 : isAnyCardOpen ? 0 : 1,
                  pointerEvents: (isAnyCardOpen && !isExpanded ? "none" : "auto") as React.CSSProperties["pointerEvents"],
                  transition: "opacity 0.3s ease-out",
                };

                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      nodeRefs.current[item.id] = el;
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto cursor-pointer transform-gpu will-change-transform"
                    style={nodeStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                  >
                    {/* ⚪ CIRCULAR NODE BUTTON: Off-White Bg with Deep Burgundy Maroon Icon */}
                    <motion.div
                      className={`
                        relative z-20
                        w-10 h-10 sm:w-12 sm:h-12 !rounded-full flex items-center justify-center
                        ${
                          isExpanded
                            ? "bg-white text-[#5A182B] border-[#5A182B] shadow-2xl scale-125"
                            : isRelated
                            ? "bg-[#D8D3C7] text-[#5A182B] border-[#5A182B]/50 shadow-lg"
                            : "bg-[#D8D3C7] text-[#5A182B] border-[#5A182B]/30 shadow-md shadow-black/50"
                        }
                        border-2 
                        transition-glass duration-300 transform-gpu cursor-pointer
                      `}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75] text-[#5A182B]" />
                    </motion.div>

                    {/* Node Label Title Below Button */}
                    <div
                      className={`
                        absolute top-11 sm:top-14 left-1/2 -translate-x-1/2 z-20
                        max-w-[105px] sm:max-w-none text-center leading-tight whitespace-normal sm:whitespace-nowrap
                        font-roboto-mono text-xs sm:text-base font-extrabold tracking-wide
                        transition-glass duration-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]
                        ${isExpanded ? "text-[#D8D3C7] scale-115" : "text-[#D8D3C7]/95"}
                      `}
                    >
                      {item.title === "Food for Cause" ? (
                        <>
                          Food for
                          <br />
                          Cause
                        </>
                      ) : (
                        item.title
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* 📱💻 FULL-VIEWPORT TINTED BURGUNDY TEXTURED BACKDROP + SLIDABLE CARD (MOBILE & PC) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeItem && (
            <div
              data-lenis-prevent="true"
              className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overscroll-none"
            >
              {/* Slight tinted low opacity burgundy textured layer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={closeCard}
                onWheel={(e) => e.preventDefault()}
                onTouchMove={(e) => e.preventDefault()}
                className="fixed inset-0 cursor-pointer overflow-hidden touch-none transform-gpu will-change-opacity"
                aria-label="Close card backdrop"
              >
                {/* Base tinted burgundy layer - smooth pure color without expensive backdrop-blur */}
                <div className="absolute inset-0 bg-[#5A182B]/90" />
                {/* Fabric weave texture overlay */}
                <div className="absolute inset-0 opacity-60 kagada-fabric-bg-texture pointer-events-none transform-gpu" />
                {/* Soft vignette for visual depth */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at center, transparent 35%, rgba(15, 1, 4, 0.5) 100%)",
                  }}
                />
              </motion.div>

              {/* Main Slider Wrapper: Chevrons + Animated Slidable Card */}
              <div className="relative z-10 w-full flex items-center justify-center max-w-[96vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl gap-2 sm:gap-4 md:gap-6">
                {/* Desktop Left Navigation Chevron */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                  className="hidden md:flex items-center justify-center w-12 h-12 !rounded-full bg-[#D8D3C7] hover:bg-white text-[#5A182B] border-2 border-white/95 shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-30 shrink-0"
                  aria-label="Previous track"
                  title="Previous track (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Card Slide Container with AnimatePresence */}
                <div className="w-full flex items-center justify-center overflow-visible">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={activeIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial={direction === 0 ? "initialModal" : "enter"}
                      animate="center"
                      exit="exit"
                      drag="x"
                      dragDirectionLock
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_e, { offset, velocity }) => {
                        const swipeThreshold = 50;
                        const swipeVelocity = 350;
                        if (offset.x < -swipeThreshold || velocity.x < -swipeVelocity) {
                          paginate(1);
                        } else if (offset.x > swipeThreshold || velocity.x > swipeVelocity) {
                          paginate(-1);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-10 w-[94vw] max-w-[420px] sm:max-w-xl md:max-w-3xl lg:max-w-4xl pointer-events-auto transform-gpu will-change-transform will-change-opacity touch-pan-y cursor-grab active:cursor-grabbing"
                    >
                      {renderCardContent(activeItem)}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Desktop Right Navigation Chevron */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                  className="hidden md:flex items-center justify-center w-12 h-12 !rounded-full bg-[#D8D3C7] hover:bg-white text-[#5A182B] border-2 border-white/95 shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-30 shrink-0"
                  aria-label="Next track"
                  title="Next track (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>

              {/* Bottom Navigation & Track Sequence Dots */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-20 flex items-center justify-center gap-2 sm:gap-3 mt-2 sm:mt-3"
              >
                {/* Mobile Prev Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                  className="md:hidden flex items-center justify-center w-8 h-8 !rounded-full bg-[#D8D3C7] text-[#5A182B] border border-[#5A182B]/30 shadow-md active:scale-90 transition-all cursor-pointer"
                  aria-label="Previous track"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Track Sequence Dots */}
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-lg">
                  {timelineData.map((track, i) => {
                    const isCurrent = i === activeIndex;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToIndex(i);
                        }}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          isCurrent
                            ? "w-6 sm:w-8 h-2 bg-[#D8D3C7] shadow-sm shadow-black/50"
                            : "w-2 h-2 bg-white/40 hover:bg-white/80"
                        }`}
                        aria-label={`Go to ${track.title}`}
                        title={track.title}
                      />
                    );
                  })}
                </div>

                {/* Mobile Next Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                  className="md:hidden flex items-center justify-center w-8 h-8 !rounded-full bg-[#D8D3C7] text-[#5A182B] border border-[#5A182B]/30 shadow-md active:scale-90 transition-all cursor-pointer"
                  aria-label="Next track"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
