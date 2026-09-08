"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden z-0 select-none", className)}>
      {/* Signature UVCE Red Brick Building Base Atmosphere (#8a1c1c) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8a1c1c] via-[#6d1616] to-[#480d0d]" />

      {/* Balanced Golden Radiant Top Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-yellow-500/10 via-[#8a1c1c]/40 to-transparent" />

      {/* 🌟 1. Top-Left Sweeping Gold Light Orb (Traverses to Top-Right & Center) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 0.95, 1.18, 1],
          opacity: [0.28, 0.48, 0.3, 0.45, 0.28],
          x: [0, 380, 200, -80, 0],
          y: [0, 180, 420, 150, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-20 -left-20 w-[420px] h-[420px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-br from-amber-400/40 via-yellow-500/22 to-transparent blur-[90px] sm:blur-[125px] transform-gpu will-change-transform"
      />

      {/* 🌟 2. Top-Right Sweeping Amber Gold Orb (Traverses to Top-Left & Bottom) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 0.9, 1.15, 1],
          opacity: [0.25, 0.45, 0.28, 0.4, 0.25],
          x: [0, -420, -220, 100, 0],
          y: [0, 280, 500, 120, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-20 -right-20 w-[420px] h-[420px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-bl from-amber-300/35 via-yellow-400/22 to-transparent blur-[90px] sm:blur-[125px] transform-gpu will-change-transform"
      />

      {/* 🌟 3. Bottom-Right Sweeping Gold Orb (Traverses to Bottom-Left & Top) */}
      <motion.div
        animate={{
          scale: [0.95, 1.25, 0.9, 1.12, 0.95],
          opacity: [0.22, 0.42, 0.25, 0.38, 0.22],
          x: [0, -380, -180, 80, 0],
          y: [0, -320, -520, -150, 0],
        }}
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-20 -right-20 w-[420px] h-[420px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-tl from-amber-400/35 via-yellow-500/20 to-transparent blur-[90px] sm:blur-[125px] transform-gpu will-change-transform"
      />

      {/* 🌟 4. Bottom-Left Sweeping Crimson & Gold Core Orb (Traverses to Center & Top-Right) */}
      <motion.div
        animate={{
          scale: [1, 1.22, 0.92, 1.15, 1],
          opacity: [0.3, 0.5, 0.32, 0.45, 0.3],
          x: [0, 420, 220, -60, 0],
          y: [0, -350, -180, -280, 0],
        }}
        transition={{
          duration: 9.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-20 -left-20 w-[420px] h-[420px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#7a1818]/50 via-amber-500/25 to-transparent blur-[95px] transform-gpu will-change-transform"
      />

      {/* Balanced Golden Radial Texture Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(251,191,36,0.1)_0%,rgba(245,158,11,0.04)_30%,transparent_55%)] pointer-events-none" />

      {/* 👾 GLOBAL TRANSLUCENT WHITE PIXEL GRID OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 sm:opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Crect x='0' y='0' width='3' height='3' fill='rgba(255,255,255,0.35)'/%3E%3C/svg%3E")`,
          backgroundSize: "18px 18px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Soft Top/Bottom Depth Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25 pointer-events-none" />
    </div>
  );
}

export default AuroraBackground;
