"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden z-0 select-none", className)}>
      {/* Signature UVCE Red Brick Building Base Atmosphere (#8a1c1c) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8a1c1c] via-[#6d1616] to-[#480d0d]" />

      {/* Radiant Top Light Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#a32222]/40 via-[#6d1616]/30 to-transparent" />

      {/* Centered Soft Ambient Glow Orb 1 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0.35, 0.55, 0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] sm:w-[1000px] sm:h-[1000px] rounded-full bg-gradient-to-tr from-[#8a1c1c]/40 via-[#a32222]/30 to-transparent blur-[140px] sm:blur-[180px] transform-gpu will-change-transform"
      />

      {/* Centered Soft Ambient Glow Orb 2 */}
      <motion.div
        animate={{
          scale: [0.9, 1.15, 0.95, 1],
          opacity: [0.3, 0.5, 0.35, 0.3],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] sm:w-[950px] sm:h-[950px] rounded-full bg-gradient-to-br from-[#7a1818]/35 via-[#8a1c1c]/30 to-transparent blur-[130px] sm:blur-[170px] transform-gpu will-change-transform"
      />

      {/* Soft Top/Bottom Depth Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25 pointer-events-none" />
    </div>
  );
}

export default AuroraBackground;
