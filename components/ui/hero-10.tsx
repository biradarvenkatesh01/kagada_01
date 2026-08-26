'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Balancer from 'react-wrap-balancer'
import { ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Cpu, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Cta, type CtaProps } from '@/components/ui/hero-10-utils/cta'

export interface Hero10Props {
  title?: string
  titleLine2Prefix?: string
  titleHighlight?: string
  description?: string
  socialProof?: string
  images?: string[]
  imageAlts?: string[]
  animation?: 'none' | 'subtle'
  primaryCTA?: CtaProps
  secondaryCTA?: CtaProps
  variant?: 'standard' | 'compact'
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function Reveal({
  active,
  variants,
  className,
  children,
}: Readonly<{
  active: boolean
  variants?: Variants
  className?: string
  children: React.ReactNode
}>) {
  if (!active) return <div className={className}>{children}</div>

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  )
}

function InteractiveCardFan() {
  const [activeCard, setActiveCard] = useState(0)
  const [exitDir, setExitDir] = useState<'next' | 'prev'>('next')
  const [animatingCard, setAnimatingCard] = useState<number | null>(null)

  // 3 Winner Track Red-Tinted Glass Cards
  const cards = [
    {
      id: 0,
      title: "Paper Presentation",
      icon: FileText,
    },
    {
      id: 1,
      title: "Poster Presentation",
      icon: ImageIcon,
    },
    {
      id: 2,
      title: "Project Presentation",
      icon: Cpu,
    },
  ]

  const handleNext = () => {
    setExitDir('next')
    setAnimatingCard(activeCard)
    setActiveCard((prev) => (prev + 1) % 3)
  }

  const handlePrev = () => {
    setExitDir('prev')
    setAnimatingCard(activeCard)
    setActiveCard((prev) => (prev - 1 + 3) % 3)
  }

  const handleCardClick = (i: number) => {
    if (i === activeCard) return
    setExitDir('next')
    setAnimatingCard(activeCard)
    setActiveCard(i)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl my-2 sm:my-6 px-4">
      {/* 3D Stack Container */}
      <div className="relative flex w-full items-center justify-center min-h-[360px] sm:min-h-[440px] md:min-h-[480px]">
        {cards.map((card, i) => {
          // Calculate relative position offset in stack (0 = top active, 1 = middle peeking, 2 = bottom peeking)
          const offset = (i - activeCard + 3) % 3
          const isActive = offset === 0
          const isExitingToBack = i === animatingCard && offset === 2

          const swingDistance = exitDir === 'next' ? 260 : -260
          const swingRotate = exitDir === 'next' ? 12 : -12

          const animateProps = isExitingToBack
            ? {
                x: [0, swingDistance, 0],
                y: [0, 16, 44],
                rotate: [0, swingRotate, 4],
                scale: [1, 0.94, 0.88],
                opacity: [1, 0.95, 0.7],
                zIndex: [35, 5, 10],
              }
            : {
                x: 0,
                y: offset * 22,
                rotate: offset === 1 ? -4 : offset === 2 ? 4 : 0,
                scale: 1 - offset * 0.06,
                opacity: 1 - offset * 0.15,
                zIndex: 30 - offset * 10,
              }

          const transitionProps = isExitingToBack
            ? {
                duration: 0.65,
                ease: [0.25, 1, 0.5, 1],
                times: [0, 0.45, 1],
              }
            : {
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.8,
              }

          return (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(i)}
              initial={false}
              animate={animateProps as any}
              transition={transitionProps as any}
              className={cn(
                "absolute w-[90vw] max-w-[350px] sm:w-[480px] md:w-[580px] h-[340px] sm:h-[400px] md:h-[440px]",
                "rounded-3xl border-2 border-white/80 shadow-2xl backdrop-blur-2xl bg-[#8a1c1c]/40",
                "p-6 sm:p-8 flex flex-col justify-between items-center overflow-hidden transform-gpu select-none cursor-pointer transition-colors duration-300",
                isActive
                  ? "ring-2 ring-white/90 shadow-black/45 bg-[#8a1c1c]/55"
                  : "hover:bg-[#8a1c1c]/50 hover:opacity-100 shadow-black/25"
              )}
              style={{
                willChange: "transform, opacity",
              }}
            >
              {/* Subtle Glass Interior Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/30 pointer-events-none" />

              {/* Card Header: Title Centered Horizontally */}
              <div className="flex items-center justify-center w-full z-10 text-center">
                <h3 className="font-smooch text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-wide drop-shadow-md text-center leading-none">
                  {card.title}
                </h3>
              </div>

              {/* Center Prominent Red Glass SVG Icon Badge */}
              <div className="flex-1 my-3 sm:my-5 flex items-center justify-center z-10">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-[#8a1c1c]/45 backdrop-blur-xl border-2 border-white/80 text-white flex items-center justify-center shadow-2xl shadow-black/30 transform-gpu hover:scale-105 transition-transform">
                  <card.icon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 stroke-[1.8] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" />
                </div>
              </div>

              {/* Bottom CTA Red Glass Button */}
              <div className="w-full z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-[#8a1c1c]/45 backdrop-blur-md border border-white/80 text-white font-jakarta text-sm sm:text-base font-extrabold tracking-wide hover:bg-[#8a1c1c]/65 active:scale-[0.98] transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2 group/btn cursor-pointer"
                >
                  <span>Explore Winners</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Red Glass Arrow Controls Below */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 z-40">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Card"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#8a1c1c]/40 backdrop-blur-xl border-2 border-white/80 text-white flex items-center justify-center shadow-xl shadow-black/30 hover:bg-[#8a1c1c]/65 hover:scale-105 active:scale-95 transition-all cursor-pointer transform-gpu"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] drop-shadow-sm" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Card"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#8a1c1c]/40 backdrop-blur-xl border-2 border-white/80 text-white flex items-center justify-center shadow-xl shadow-black/30 hover:bg-[#8a1c1c]/65 hover:scale-105 active:scale-95 transition-all cursor-pointer transform-gpu"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] drop-shadow-sm" />
        </button>
      </div>
    </div>
  )
}

export function Hero10({
  title,
  titleLine2Prefix,
  titleHighlight,
  description,
  socialProof,
  animation = 'none',
  primaryCTA,
  secondaryCTA,
}: Readonly<Hero10Props>) {
  const reduce = useReducedMotion()
  const animate = animation === 'subtle' && !reduce

  const titleElement = title && (
    <h1 className="text-white font-saman font-normal tracking-tight text-balance drop-shadow-lg text-3xl sm:text-4xl md:text-5xl">
      <Balancer>{title}</Balancer>
      {(titleLine2Prefix || titleHighlight) && (
        <>
          <br />
          <Balancer>
            {titleLine2Prefix && <span>{titleLine2Prefix} </span>}
            {titleHighlight && (
              <span className="text-white">{titleHighlight}</span>
            )}
          </Balancer>
        </>
      )}
    </h1>
  )

  const descriptionElement = description && (
    <p className="text-white/90 font-jakarta font-medium drop-shadow-sm max-w-lg text-sm sm:text-base">
      <Balancer>{description}</Balancer>
    </p>
  )

  const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
      {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
      {secondaryCTA?.ctaEnabled && (
        <Cta
          cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? 'outline' }}
        />
      )}
    </div>
  )

  const socialProofElement = socialProof && (
    <p className="text-white/80 font-roboto-mono text-xs font-semibold uppercase tracking-wider drop-shadow-sm">{socialProof}</p>
  )

  return (
    <section className="relative isolate w-full overflow-hidden">
      <motion.div
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 text-center py-4 sm:py-8"
        variants={animate ? container : undefined}
        initial={animate ? 'hidden' : false}
        whileInView={animate ? 'visible' : undefined}
        viewport={{ once: true, margin: '-80px' }}
      >
        {(titleElement || descriptionElement) && (
          <Reveal
            active={animate}
            className="flex w-full max-w-2xl flex-col items-center gap-4"
          >
            {titleElement}
            {descriptionElement}
          </Reveal>
        )}

        {(ctasElement || socialProofElement) && (
          <Reveal active={animate} className="flex flex-col items-center gap-4">
            {ctasElement}
            {socialProofElement}
          </Reveal>
        )}

        <div className="mx-auto w-full flex items-center justify-center">
          <InteractiveCardFan />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero10;
