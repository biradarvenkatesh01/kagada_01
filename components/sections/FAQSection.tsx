'use client'

import * as React from 'react'
import { useState, memo, useCallback, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: "What is KAGADA and when is it?",
    answer:
      "KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 24th October, 2026.",
  },
  {
    question: "What can I present in KAGADA?",
    answer:
      "KAGADA has 3 tracks: Paper Presentation, Poster Presentation and Project Presentation. You can choose any of these tracks.",
  },
  {
    question: "Why should I participate in KAGADA 2026?",
    answer:
      "As KAGADA is a national level technical student conference, one gets a national level platform to exhibit their innovative ideas and thoughts. This also provides an opportunity to showcase their presentation skills.",
  },
  {
    question: "What is the domain for presentation?",
    answer:
      "There is no specific domain for presentation but the sole purpose is to come up with ideas for the betterment of society.",
  },
  {
    question: "Where will KAGADA 2026 take place?",
    answer: "KAGADA 2026 will take place at UVCE, KR Circle.",
  },
  {
    question: "Can one participate in more than one track?",
    answer: "Yes, participants can take part in more than one track.",
  },
  {
    question: "What all events are there in KAGADA 2026?",
    answer: `KAGADA consists of two category events.\n\nThe Presentation tracks:\n• Paper Presentation\n• Poster Presentation\n• Project Presentation\n\nHumanitarian activities:\n• Ottige Kaliyona\n• Food for Cause`,
  },
]

const FAQCard = memo(function FAQCard({
  faq,
  idx,
  isOpen,
  onToggle,
}: {
  faq: FAQItem
  idx: number
  isOpen: boolean
  onToggle: (index: number) => void
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-2 !rounded-none",
        "kagada-paper-card border-white/90 shadow-md shadow-black/15",
        isOpen && "border-white"
      )}
    >
      {/* Accordion Header Trigger Button */}
      <button
        type="button"
        onClick={() => onToggle(idx)}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${idx}`}
        id={`faq-header-${idx}`}
        className="w-full relative z-10 flex items-center justify-between gap-3 py-3 px-4 sm:py-3.5 sm:px-5 cursor-pointer text-left select-none outline-none focus-visible:ring-2 focus-visible:ring-[#5A182B] bg-transparent border-0"
      >
        <h3 className="font-outfit font-bold text-base sm:text-lg text-[#5A182B] tracking-wide leading-snug">
          {faq.question}
        </h3>
        {/* Stable Circular Badge: stays perfectly round, never squishes */}
        <div
          className={cn(
            "w-7 h-7 sm:w-8 sm:h-8 !rounded-full shrink-0 flex items-center justify-center",
            "border shadow-sm transition-colors duration-200",
            isOpen
              ? "bg-[#5A182B] text-[#D8D3C7] border-[#5A182B]"
              : "bg-[#5A182B]/10 border-[#5A182B]/25 text-[#5A182B]"
          )}
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 stroke-[2.5] transition-transform duration-250 ease-out transform-gpu",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Accordion body with smooth hardware-accelerated grid transition */}
      <div
        id={`faq-panel-${idx}`}
        role="region"
        aria-labelledby={`faq-header-${idx}`}
        className={cn(
          "grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.25,1,0.5,1)]",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden min-h-0">
          <div className="px-4 pb-3.5 sm:px-5 sm:pb-4 pt-0 text-left">
            <div className="pt-2 sm:pt-2.5 border-t border-[#5A182B]/20">
              <p className="font-jakarta text-xs sm:text-sm md:text-base font-medium text-stone-800 leading-relaxed whitespace-pre-line select-text">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// The row's own `duration-[220ms]` open/close. Lenis is told to re-measure just
// after it, so it reads the settled document height.
const OPEN_MS = 220

export const FAQSection = memo(function FAQSection() {
  // All FAQs closed initially
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const resizeTimerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (resizeTimerRef.current !== null) window.clearTimeout(resizeTimerRef.current)
  }, [])

  const toggleAccordion = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))

    // Lenis measures the document once, so it needs telling when the page got
    // taller. Deferred past the transition so it measures the settled height.
    if (typeof window !== "undefined") {
      if (resizeTimerRef.current !== null) {
        window.clearTimeout(resizeTimerRef.current)
      }
      resizeTimerRef.current = window.setTimeout(() => {
        const lenis = (window as unknown as { __lenis?: { resize: () => void } }).__lenis
        lenis?.resize()
        resizeTimerRef.current = null
      }, OPEN_MS + 20)
    }
  }, [])

  return (
    <section id="faq" className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none px-4 py-8 sm:py-12 scroll-mt-6 z-10">
      {/* Main Section Title */}
      <div>
        <h2 data-reveal className="font-saman text-[#D8D3C7] text-5xl sm:text-7xl md:text-8xl tshadow-lg tracking-tight text-center select-none leading-tight mb-1.5 sm:mb-2">
          Frequently Asked <span className="text-amber-400 tshadow-md">Questions</span>
        </h2>
      </div>

      {/* Subtitle */}
      <div>
        <p data-reveal className="font-roboto-mono text-xs sm:text-sm font-semibold text-[#D8D3C7]/90 uppercase tracking-widest text-center tshadow-sm mb-4 sm:mb-6 max-w-2xl">
          Everything you need to know about KAGADA conference, tracks, and events.
        </p>
      </div>

      {/* Glassmorphic FAQ Accordion Container */}
      <div className="w-full">
        <div className="w-full flex flex-col gap-2.5 sm:gap-3">
          {FAQS.map((faq, idx) => (
            <FAQCard
              key={`faq-${idx}`}
              faq={faq}
              idx={idx}
              isOpen={openIndex === idx}
              onToggle={toggleAccordion}
            />
          ))}
        </div>
      </div>
    </section>
  )
});

export default FAQSection;
