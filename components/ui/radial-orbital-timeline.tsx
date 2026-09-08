"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { ArrowRight, Link, Zap, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  description?: string;
  imageSrc?: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [orbitRadius, setOrbitRadius] = useState<number>(240);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const rotationAngleRef = useRef<number>(0);

  // 📱 RESPONSIVE ORBIT RADIUS (118px phone < 480px, 165px tablet < 640px, 240px desktop)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setOrbitRadius(118);
      } else if (width < 640) {
        setOrbitRadius(165);
      } else {
        setOrbitRadius(240);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep ref in sync for RAF loop
  useEffect(() => {
    rotationAngleRef.current = rotationAngle;
  }, [rotationAngle]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  // 🚀 HIGH-PERFORMANCE SPRING ROTATION TO TOP CENTER (270°)
  const centerViewOnNode = useCallback(
    (nodeId: number) => {
      const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
      if (nodeIndex === -1) return;

      const totalNodes = timelineData.length;
      // Target top-center angle is 270° (top of orbit)
      const rawTargetAngle = 270 - (nodeIndex / totalNodes) * 360;

      const currentAngle = rotationAngleRef.current;
      const normalizedCurrent = ((currentAngle % 360) + 360) % 360;
      let normalizedTarget = ((rawTargetAngle % 360) + 360) % 360;

      let delta = normalizedTarget - normalizedCurrent;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      const targetAngle = currentAngle + delta;

      // Physics-optimized spring rotation: fast start, zero overshoot
      animate(currentAngle, targetAngle, {
        type: "spring",
        stiffness: 75,
        damping: 19,
        mass: 0.8,
        onUpdate: (latest) => {
          setRotationAngle(latest);
        },
      });
    },
    [timelineData]
  );

  const toggleItem = (id: number) => {
    // ⚡ INSTANT CARD OPENING: Update expanded state immediately on click
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      const isCurrentlyExpanded = !!prev[id];

      if (!isCurrentlyExpanded) {
        newState[id] = true;
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        // 🎯 Glide node & open card to top center smoothly right as it pops open
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  // 🚀 HARDWARE-ACCELERATED RAF ROTATION (20°/sec = 18s 1:1 match with center gear)
  useEffect(() => {
    const updateRotation = (time: number) => {
      if (lastTimeRef.current !== null && autoRotate) {
        const delta = (time - lastTimeRef.current) / 1000;
        setRotationAngle((prev) => (prev + delta * 20) % 360);
      }
      lastTimeRef.current = time;
      if (autoRotate) {
        rafRef.current = requestAnimationFrame(updateRotation);
      }
    };

    if (autoRotate) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(updateRotation);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [autoRotate]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    const x = orbitRadius * Math.cos(radian);
    const y = orbitRadius * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.7,
      Math.min(1, 0.7 + 0.3 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  return (
    <div
      className="w-full min-h-[580px] sm:min-h-[760px] md:min-h-[840px] flex flex-col items-center justify-start bg-transparent overflow-visible py-0 sm:py-2 select-none -mt-4 sm:-mt-8"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-6xl h-[560px] sm:h-[720px] md:h-[780px] flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center transform-gpu will-change-transform"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* ⚙️ PURE WHITE VECTOR GEAR (gear-svgrepo-com.svg) */}
          <div className="absolute z-20 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex items-center justify-center transform-gpu will-change-transform bg-transparent"
            >
              <svg
                viewBox="0 0 32 32"
                className="w-16 h-16 sm:w-44 sm:h-44 text-white fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M29 12.256h-1.88c-0.198-0.585-0.405-1.072-0.643-1.541l0.031 0.067 1.338-1.324c0.35-0.3 0.57-0.742 0.57-1.236 0-0.406-0.149-0.778-0.396-1.063l0.002 0.002-3.178-3.178c-0.283-0.246-0.654-0.395-1.061-0.395-0.494 0-0.937 0.221-1.234 0.57l-0.002 0.002-1.332 1.33c-0.402-0.206-0.888-0.413-1.39-0.586l-0.082-0.025 0.009-1.88c0.003-0.040 0.005-0.086 0.005-0.133 0-0.854-0.66-1.554-1.498-1.617l-0.005-0h-4.496c-0.844 0.063-1.505 0.763-1.505 1.617 0 0.047 0.002 0.093 0.006 0.139l-0-0.006v1.879c-0.585 0.198-1.071 0.404-1.54 0.641l0.067-0.031-1.324-1.336c-0.299-0.352-0.742-0.573-1.236-0.573-0.407 0-0.778 0.15-1.063 0.397l0.002-0.002-3.179 3.179c-0.246 0.283-0.396 0.655-0.396 1.061 0 0.494 0.221 0.937 0.57 1.234l0.002 0.002 1.329 1.329c-0.207 0.403-0.414 0.891-0.587 1.395l-0.024 0.082-1.88-0.009c-0.040-0.003-0.086-0.005-0.133-0.005-0.854 0-1.554 0.661-1.617 1.499l-0 0.005v4.495c0.062 0.844 0.763 1.505 1.617 1.505 0.047 0 0.093-0.002 0.139-0.006l-0.006 0h1.88c0.198 0.585 0.404 1.072 0.642 1.541l-0.030-0.066-1.335 1.32c-0.351 0.3-0.572 0.744-0.572 1.239 0 0.407 0.149 0.779 0.396 1.064l-0.002-0.002 3.179 3.178c0.249 0.246 0.591 0.399 0.97 0.399 0.007 0 0.014-0 0.021-0h-0.001c0.515-0.013 0.977-0.231 1.308-0.576l0.001-0.001 1.33-1.33c0.403 0.207 0.891 0.414 1.395 0.587l0.082 0.025-0.009 1.878c-0.003 0.040-0.005 0.086-0.005 0.132 0 0.854 0.661 1.555 1.499 1.617l0.005 0h4.496c0.843-0.064 1.503-0.763 1.503-1.617 0-0.047-0.002-0.093-0.006-0.139l0 0.006v-1.881c0.585-0.198 1.073-0.405 1.543-0.643l-0.067 0.031 1.321 1.333c0.332 0.344 0.793 0.562 1.304 0.574l0.002 0h0.002c0.006 0 0.013 0 0.019 0 0.378 0 0.72-0.151 0.971-0.395l3.177-3.177c0.244-0.249 0.395-0.591 0.395-0.968 0-0.009-0-0.017-0-0.026l0 0.001c-0.012-0.513-0.229-0.973-0.572-1.304l-0.001-0.001-1.331-1.332c0.206-0.401 0.412-0.887 0.586-1.389l0.025-0.083 1.879 0.009c0.040 0.003 0.086 0.005 0.132 0.005 0.855 0 1.555-0.661 1.617-1.5l0-0.005v-4.495c-0.063-0.844-0.763-1.504-1.618-1.504-0.047 0-0.093 0.002-0.138 0.006l0.006-0zM29.004 18.25l-2.416-0.012c-0.020 0-0.037 0.010-0.056 0.011-0.198 0.024-0.372 0.115-0.501 0.249l-0 0c-0.055 0.072-0.103 0.153-0.141 0.24l-0.003 0.008c-0.005 0.014-0.016 0.024-0.020 0.039-0.24 0.844-0.553 1.579-0.944 2.264l0.026-0.049c-0.054 0.1-0.086 0.218-0.086 0.344 0 0.001 0 0.003 0 0.004v-0c-0 0.016 0.003 0.028 0.004 0.045 0.006 0.187 0.080 0.355 0.199 0.481l-0-0 0.009 0.023 1.707 1.709c0.109 0.109 0.137 0.215 0.176 0.176l-3.102 3.133c-0.099-0.013-0.186-0.061-0.248-0.13l-0-0-1.697-1.713c-0.008-0.009-0.022-0.005-0.030-0.013-0.121-0.112-0.28-0.183-0.456-0.193l-0.002-0c-0.020-0.003-0.044-0.005-0.068-0.006l-0.001-0c-0.125 0-0.243 0.032-0.345 0.088l0.004-0.002c-0.636 0.362-1.373 0.676-2.146 0.903l-0.074 0.019c-0.015 0.004-0.025 0.015-0.039 0.020-0.096 0.042-0.179 0.092-0.255 0.149l0.003-0.002c-0.035 0.034-0.066 0.071-0.093 0.11l-0.002 0.002c-0.027 0.033-0.053 0.070-0.075 0.11l-0.002 0.004c-0.033 0.081-0.059 0.175-0.073 0.274l-0.001 0.007c-0.001 0.016-0.010 0.031-0.010 0.047v2.412c0 0.15-0.055 0.248 0 0.25l-4.41 0.023c-0.052-0.067-0.084-0.153-0.084-0.246 0-0.008 0-0.016 0.001-0.024l-0 0.001 0.012-2.412c0-0.017-0.008-0.032-0.010-0.048-0.005-0.053-0.015-0.102-0.030-0.149l0.001 0.005c-0.012-0.053-0.028-0.1-0.048-0.145l0.002 0.005c-0.052-0.86-0.109-0.16-0.173-0.227l0 0c-0.029-0.024-0.062-0.046-0.096-0.066l-0.004-0.002c-0.044-0.030-0.093-0.056-0.146-0.076l-0.005-0.002c-0.014-0.005-0.024-0.016-0.039-0.020-0.847-0.241-1.585-0.554-2.272-0.944l0.051 0.026c-0.099-0.054-0.216-0.086-0.341-0.086h-0c-0.022-0.001-0.040 0.004-0.062 0.005-0.18 0.008-0.342 0.080-0.465 0.193l0.001-0c-0.008 0.008-0.021 0.004-0.029 0.012l-1.705 1.705c-0.107 0.107-0.216 0.139-0.178 0.178l-3.134-3.101c0.012-0.1 0.060-0.187 0.13-0.25l0-0 1.714-1.695 0.011-0.026c0.115-0.123 0.189-0.286 0.197-0.466l0-0.002c0.001-0.021 0.005-0.037 0.005-0.058 0-0.001 0-0.002 0-0.003 0-0.126-0.032-2.45-0.088-0.348l0.002 0.004c-0.365-0.636-0.679-1.371-0.903-2.145l-0.018-0.072c-0.004-0.015-0.016-0.026-0.021-0.041-0.042-0.094-0.090-0.176-0.146-0.25l0.002 0.003c-0.065-0.061-0.136-0.117-0.212-0.165l-0.006-0.003c-0.051-0.025-0.109-0.045-0.171-0.057l-0.005-0.001c-0.029-0.009-0.065-0.016-0.102-0.021l-0.004-0c-0.020-0.002-0.037-0.012-0.058-0.012h-2.412c-0.152 0.002-0.248-0.055-0.25-0.002l-0.022-4.409c0.067-0.052 0.151-0.084 0.244-0.084 0.009 0 0.017 0 0.026 0.001l-0.001-0 2.416 0.012c0.152-0.004 0.292-0.054 0.407-0.136l-0.002 0.002c0.024-0.014 0.044-0.028 0.064-0.043l-0.002 0.001c0.109-0.088 0.191-0.206 0.235-0.341l0.001-0.005c0.003-0.010 0.014-0.014 0.017-0.025 0.242-0.847 0.555-1.583 0.946-2.27l-0.026 0.050c0.054-0.1 0.086-0.218 0.086-0.344 0-0.001 0-0.001 0-0.002v0c0.001-0.019-0.003-0.033-0.004-0.052-0.007-0.184-0.080-0.35-0.197-0.475l0 0-0.010-0.024-1.705-1.705c-0.108-0.11-0.142-0.221-0.176-0.178l3.102-3.134c0.101 0.008 0.189 0.058 0.248 0.131l0.001 0.001 1.697 1.713c0.018 0.018 0.046 0.011 0.065 0.027 0.125 0.121 0.295 0.196 0.483 0.196 0.13 0 0.251-0.036 0.355-0.098l-0.003 0.002c0.636-0.364 1.372-0.677 2.145-0.902l0.072-0.018c0.014-0.004 0.24-0.015 0.038-0.019 0.057-0.021 0.105-0.047 0.151-0.077l-0.003 0.002c0.163-0.090 0.281-0.244 0.321-0.427l0.001-0.004c0.014-0.043 0.025-0.093 0.030-0.145l0-0.003c0.001-0.016 0.009-0.030 0.009-0.046v-2.412c0-0.151 0.056-0.249 0.001-0.25l4.41-0.023c0.052 0.067 0.083 0.152 0.083 0.245 0 0.009-0 0.017-0.001 0.026l0-0.001-0.012 2.412c-0 0.016 0.008 0.030 0.009 0.047 0.005 0.055 0.015 0.106 0.031 0.155l-0.001-0.005c0.071 0.234 0.243 0.419 0.464 0.506l0.005 0.002c0.014 0.005 0.025 0.016 0.039 0.020 0.845 0.242 1.58 0.555 2.265 0.945l-0.050-0.026c0.105 0.060 0.231 0.096 0.366 0.096 0 0 0.001 0 0.001 0h-0c0.183-0.008 0.347-0.082 0.471-0.198l-0 0c0.017-0.015 0.043-0.008 0.059-0.024l1.709-1.705c0.105-0.106 0.213-0.137 0.176-0.176l3.133 3.102c-0.012 0.1-0.059 0.186-0.129 0.249l-0 0-1.715 1.697-0.011 0.026c-0.116 0.123-0.19 0.287-0.198 0.468l-0 0.002c-0.001 0.020-0.005 0.036-0.005 0.056 0 0.001 0 0.002 0 0.003 0 0.126 0.032 0.245 0.088 0.348l-0.002-0.004c0.365 0.636 0.679 1.371 0.902 2.144l0.018 0.071c0.003 0.012 0.016 0.017 0.019 0.028 0.046 0.137 0.127 0.253 0.232 0.339l0.001 0.001c0.019 0.015 0.041 0.030 0.063 0.043l0.003 0.002c0.112 0.080 0.252 0.13 0.402 0.134l0.001 0h2.412c0.152-0.001 0.248 0.057 0.25 0.001l0.021 4.409c-0.065 0.053-0.149 0.085-0.24 0.085-0.010 0-0.019-0-0.029-0.001l0.001 0zM16 11.25c-2.623 0-4.75 2.127-4.75 4.75s2.127 4.75 4.75 4.75c2.623 0 4.75-2.127 4.75-4.75v0c-0.003-2.622-2.128-4.747-4.75-4.75h-0zM16 19.25c-1.795 0-3.25-1.455-3.25-3.25s1.455-3.25 3.25-3.25c1.795 0 3.25 1.455 3.25 3.25v0c-0.002 1.794-1.456 3.248-3.25 3.25h-0z" />
              </svg>
            </motion.div>
          </div>

          {/* 🌌 ORBITING CIRCULAR NODES & INSTANT EXPANDING CARDS */}
          {timelineData.map((index_item, index) => {
            const item = index_item;
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = !!expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto cursor-pointer transition-transform duration-300 ease-out transform-gpu will-change-transform"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* ⚪ CIRCULAR NODE BUTTON WITH BOLD WHITE SVG ICON */}
                <motion.div
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative z-20
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                    ${
                      isExpanded
                        ? "bg-[#8a1c1c] text-white border-white shadow-xl scale-125"
                        : isRelated
                        ? "bg-[#8a1c1c] text-white border-white/90"
                        : "bg-[#8a1c1c] text-white border-white/80 shadow-md shadow-black/50"
                    }
                    border-2 
                    transition-all duration-300 transform-gpu will-change-transform
                  `}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3.2] text-white" />
                </motion.div>

                {/* Node Label Title Below Button (z-20 so text sits in front of hanging string) */}
                <div
                  className={`
                    absolute top-11 sm:top-14 left-1/2 -translate-x-1/2 z-20
                    max-w-[105px] sm:max-w-none text-center leading-tight whitespace-normal sm:whitespace-nowrap
                    font-roboto-mono text-xs sm:text-base font-extrabold tracking-wide
                    transition-all duration-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]
                    ${isExpanded ? "text-white scale-115" : "text-white/95"}
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

                {/* ⚡ INSTANTLY OPENING EXPANDABLE GLASS CARD HANGING FROM NODE BUTTON */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6, y: 15 }}
                      transition={{ type: "spring", stiffness: 320, damping: 24, mass: 0.6 }}
                      className="absolute top-2 sm:top-16 left-1/2 -translate-x-1/2 w-[92vw] max-w-[360px] md:max-w-3xl lg:max-w-4xl z-[9999] pointer-events-auto transform-gpu will-change-transform"
                    >
                      {/* 🌟 Ultra-Premium White Glassmorphic Card Container */}
                      <div className="relative bg-white/95 backdrop-blur-xl border-2 border-white shadow-2xl shadow-black/30 rounded-3xl p-5 sm:p-8 text-slate-900 flex flex-col max-h-[78vh] sm:max-h-none overflow-y-auto custom-scrollbar">
                        
                        {/* Top Floating Glass Close Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(item.id);
                          }}
                          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/90 text-[#8a1c1c] hover:bg-[#8a1c1c] hover:text-white transition-colors flex items-center justify-center shadow-md"
                          aria-label="Close card"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Smooch Sans Title Header (Centered at top in Terracotta Red) */}
                        <div className="flex items-center justify-center border-b border-[#8a1c1c]/20 pb-2.5 mb-3 sm:mb-6 w-full">
                          <h3 className="font-smooch text-4xl sm:text-6xl md:text-7xl font-semibold text-[#8a1c1c] tracking-wide whitespace-nowrap text-center leading-none">
                            {item.title}
                          </h3>
                        </div>

                        {/* Card Content Layout: 2-Column Horizontal Side-by-Side Grid on PC, Stacked on Mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center w-full">
                          
                          {/* Image Box (Left Column on PC) */}
                          {item.imageSrc && (
                            <div className="md:col-span-5 w-full h-40 sm:h-64 md:h-72 rounded-2xl overflow-hidden border-2 border-white/80 shadow-lg bg-slate-100/50 relative group">
                              <img
                                src={item.imageSrc}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          )}

                          {/* Description Paragraph (Right Column on PC) */}
                          <div className={`${item.imageSrc ? "md:col-span-7" : "md:col-span-12"} flex flex-col space-y-4 text-left`}>
                            {(item.description || item.content) && (
                              <p className="font-jakarta text-xs sm:text-sm md:text-base text-slate-800/90 leading-relaxed font-medium">
                                {item.description || item.content}
                              </p>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
