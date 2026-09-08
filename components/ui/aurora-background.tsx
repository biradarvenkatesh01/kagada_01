"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden z-0 select-none", className)}>
      {/* Signature UVCE Red Brick Building Base Atmosphere (#8a1c1c) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8a1c1c] via-[#6d1616] to-[#480d0d]" />

      {/* Balanced Golden Radiant Top Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/28 via-yellow-500/15 via-[#8a1c1c]/40 to-transparent" />

      {/* Top-Left Floating Gold Light Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 0.92, 1.1, 1],
          opacity: [0.25, 0.42, 0.28, 0.38, 0.25],
          x: [0, 40, -20, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-20 -left-20 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full bg-gradient-to-br from-amber-400/35 via-yellow-500/20 to-transparent blur-[130px] sm:blur-[170px] transform-gpu will-change-transform"
      />

      {/* Center Floating Warm Golden Light Orb */}
      <motion.div
        animate={{
          scale: [1, 1.25, 0.95, 1.15, 1],
          opacity: [0.22, 0.4, 0.25, 0.35, 0.22],
          y: [0, 40, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] sm:w-[980px] sm:h-[980px] rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-transparent blur-[140px] sm:blur-[180px] transform-gpu will-change-transform"
      />

      {/* Bottom-Right Floating Warm Amber Gold Orb */}
      <motion.div
        animate={{
          scale: [0.9, 1.15, 0.95, 1.08, 0.9],
          opacity: [0.18, 0.35, 0.22, 0.3, 0.18],
          x: [0, -30, 20, 0],
          y: [0, 25, -15, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-2/3 -right-20 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full bg-gradient-to-bl from-amber-400/30 via-yellow-500/18 to-transparent blur-[130px] sm:blur-[170px] transform-gpu will-change-transform"
      />

      {/* Crimson Deep Core Accent Orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.9, 1],
          opacity: [0.3, 0.45, 0.3, 0.3],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#7a1818]/40 via-[#8a1c1c]/30 to-transparent blur-[140px] transform-gpu will-change-transform"
      />

      {/* Balanced Golden Radial Texture Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(251,191,36,0.11)_0%,rgba(245,158,11,0.05)_45%,transparent_75%)] pointer-events-none" />

      {/* Soft Top/Bottom Depth Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25 pointer-events-none" />
    </div>
  );
}

export default AuroraBackground;
