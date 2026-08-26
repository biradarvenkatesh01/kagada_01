'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GalleryItem {
  id: number
  src: string
  shape: string // Aspect-ratio matched CSS dimensions
}

// Row 1: 5 distinct Kagada event photos tailored to their natural aspect ratio
const row1Items: GalleryItem[] = [
  { id: 1, src: "/1 (1).jpg", shape: "w-[300px] sm:w-[390px] h-[190px] sm:h-[240px] rounded-3xl" },
  { id: 2, src: "/paper.png", shape: "w-[320px] sm:w-[420px] h-[180px] sm:h-[230px] rounded-3xl" },
  { id: 3, src: "/ottigekaliona.jpg", shape: "w-[320px] sm:w-[410px] h-[190px] sm:h-[240px] rounded-3xl" },
  { id: 4, src: "/1 (3).JPG", shape: "w-[320px] sm:w-[430px] h-[190px] sm:h-[240px] rounded-3xl" },
  { id: 5, src: "/1 (4).JPG", shape: "w-[300px] sm:w-[380px] h-[190px] sm:h-[240px] rounded-3xl" },
]

// Row 2: 6 distinct Kagada event photos tailored to their natural aspect ratio
const row2Items: GalleryItem[] = [
  { id: 6, src: "/1 (5).JPG", shape: "w-[310px] sm:w-[400px] h-[190px] sm:h-[240px] rounded-3xl" },
  { id: 7, src: "/poster.jpg", shape: "w-[220px] sm:w-[280px] h-[200px] sm:h-[250px] rounded-3xl" },
  { id: 8, src: "/1 (6).JPG", shape: "w-[330px] sm:w-[430px] h-[190px] sm:h-[240px] rounded-3xl" },
  { id: 9, src: "/FoodForCause.JPG", shape: "w-[320px] sm:w-[410px] h-[190px] sm:h-[240px] rounded-3xl" },
  { id: 10, src: "/1 (7).JPG", shape: "w-[310px] sm:w-[400px] h-[190px] sm:h-[240px] rounded-3xl" },
  { id: 11, src: "/project.jpg", shape: "w-[320px] sm:w-[410px] h-[190px] sm:h-[240px] rounded-3xl" },
]

function MarqueeRow({
  items,
  direction = 'left',
  speed = 20,
}: {
  items: GalleryItem[]
  direction?: 'left' | 'right'
  speed?: number
}) {
  const baseX = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)

  // Quadruple items to guarantee seamless infinite wrapping
  const loopItems = [...items, ...items, ...items, ...items]

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Half width is the exact length of 2 repeated sets
        setContentWidth(containerRef.current.scrollWidth / 2)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [items])

  // Framer Motion RAF ticker for 100% framerate-independent liquid smooth animation
  useAnimationFrame((_, delta) => {
    if (!contentWidth) return
    const moveBy = (direction === 'left' ? -1 : 1) * (speed * (delta / 1000))
    let newX = baseX.get() + moveBy

    if (direction === 'left' && newX <= -contentWidth) {
      newX += contentWidth
    } else if (direction === 'right' && newX >= 0) {
      newX -= contentWidth
    }

    baseX.set(newX)
  })

  return (
    <div className="flex w-full overflow-hidden py-2 select-none">
      <motion.div
        ref={containerRef}
        style={{ x: baseX }}
        className="flex items-center gap-5 sm:gap-8 w-max shrink-0 transform-gpu will-change-transform"
      >
        {loopItems.map((item, idx) => (
          <div
            key={`${direction}-${item.id}-${idx}`}
            className={cn(
              "relative shrink-0 overflow-hidden cursor-default",
              "bg-[#8a1c1c]/40 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/35",
              item.shape
            )}
          >
            {/* Image filling the glass card box edge-to-edge */}
            <img
              src={item.src}
              alt="Kagada Event Photo"
              className="w-full h-full object-cover transform-gpu select-none pointer-events-none"
            />

            {/* Subtle Glass Interior Reflective Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/30 pointer-events-none" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function GalleryMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-4 sm:py-8 flex flex-col gap-6 sm:gap-10 select-none min-h-[480px]">
      {/* ROW 1: Moves Continuously to the RIGHT at slow speed */}
      <MarqueeRow items={row1Items} direction="right" speed={22} />

      {/* ROW 2: Moves Continuously to the LEFT at slow speed */}
      <MarqueeRow items={row2Items} direction="left" speed={18} />
    </div>
  )
}

export default GalleryMarquee
