"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden z-0 select-none", className)}>
      {/* Deep Terracotta Base Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1c0404] via-[#120202] to-black" />

      {/* Aurora Orb 1: Primary Red Crimson Flow (Faster & Wider Travel) */}
      <motion.div
        animate={{
          x: [0, 200, -180, 120, 0],
          y: [0, -180, 160, -90, 0],
          scale: [1, 1.4, 0.8, 1.25, 1],
          rotate: [0, 90, -60, 45, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] sm:w-[900px] sm:h-[900px] rounded-full bg-gradient-to-tr from-[#991b1b]/60 via-[#b91c1c]/45 to-transparent blur-[110px] sm:blur-[150px] transform-gpu will-change-transform"
      />

      {/* Aurora Orb 2: Deep Crimson Radial Light Beam */}
      <motion.div
        animate={{
          x: [0, -220, 180, -100, 0],
          y: [0, 190, -170, 110, 0],
          scale: [1, 0.75, 1.35, 0.9, 1],
          rotate: [0, -90, 70, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[25%] right-[-10%] w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full bg-gradient-to-br from-[#7f1d1d]/55 via-[#450a0a]/60 to-transparent blur-[100px] sm:blur-[140px] transform-gpu will-change-transform"
      />

      {/* Aurora Orb 3: Warm Amber Accent Glow */}
      <motion.div
        animate={{
          x: [0, 160, -140, 90, 0],
          y: [0, -140, 150, -80, 0],
          scale: [1, 1.3, 0.8, 1.15, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[55%] left-[15%] w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full bg-gradient-to-tr from-amber-600/25 via-[#8a1c1c]/45 to-transparent blur-[90px] sm:blur-[130px] transform-gpu will-change-transform"
      />

      {/* Aurora Orb 4: Bottom Hero Ambient Glow */}
      <motion.div
        animate={{
          x: [0, -180, 150, -90, 0],
          y: [0, 160, -130, 90, 0],
          scale: [1, 1.25, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] sm:w-[800px] sm:h-[800px] rounded-full bg-gradient-to-tl from-[#991b1b]/50 via-amber-600/20 to-transparent blur-[110px] sm:blur-[150px] transform-gpu will-change-transform"
      />

      {/* Aurora Orb 5: Center Vibrant Light Beam */}
      <motion.div
        animate={{
          x: [0, -120, 140, 0],
          y: [0, 100, -110, 0],
          scale: [0.9, 1.2, 0.95, 0.9],
          opacity: [0.3, 0.7, 0.4, 0.3],
        }}
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[40%] left-[40%] w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-r from-red-600/35 via-amber-500/20 to-rose-700/30 blur-[80px] sm:blur-[120px] transform-gpu will-change-transform"
      />

      {/* Subtle Noise / Radial Vignette Overlay for Depth */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/80 pointer-events-none" />
    </div>
  );
}

export default AuroraBackground;
