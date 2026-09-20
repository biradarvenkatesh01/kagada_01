'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

// ── FAQ data ────────────────────────────────────────────────────────────────
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

// ── Section ─────────────────────────────────────────────────────────────────
// Uses native <details name="..."> for an exclusive accordion group.
// The browser handles open/close natively — no React state, no JS animation.
export function FAQSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Tell Lenis the page height changed after a <details> toggles
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let timer: number | null = null

    const handleToggle = () => {
      if (timer !== null) clearTimeout(timer)
      timer = window.setTimeout(() => {
        const lenis = (window as unknown as { __lenis?: { resize: () => void } }).__lenis
        lenis?.resize()
        timer = null
      }, 60)
    }

    // The toggle event fires on the <details> element — use capture to catch it
    container.addEventListener('toggle', handleToggle, true)
    return () => {
      container.removeEventListener('toggle', handleToggle, true)
      if (timer !== null) clearTimeout(timer)
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

      {/* FAQ Accordion — native <details> exclusive group */}
      <div className="w-full" ref={containerRef}>
        <div className="w-full flex flex-col gap-2.5 sm:gap-3">
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              name="faq-accordion"
              className="faq-card kagada-paper-card border-2 border-white/90 !rounded-none group"
            >
              <summary
                id={`faq-header-${idx}`}
                className="w-full flex items-center justify-between gap-3 py-3 px-4 sm:py-3.5 sm:px-5 cursor-pointer text-left select-none outline-none focus-visible:ring-2 focus-visible:ring-[#5A182B] list-none [&::-webkit-details-marker]:hidden"
              >
                <h3 className="font-outfit font-bold text-base sm:text-lg text-[#5A182B] tracking-wide leading-snug">
                  {faq.question}
                </h3>
                <div className="faq-icon-box w-7 h-7 sm:w-8 sm:h-8 !rounded-none shrink-0 flex items-center justify-center border shadow-sm bg-[#5A182B]/10 border-[#5A182B]/25 text-[#5A182B]">
                  <ChevronDown className="faq-chevron w-4 h-4 stroke-[2.5] transform-gpu" />
                </div>
              </summary>
              <div className="px-4 pb-3.5 sm:px-5 sm:pb-4 pt-0 text-left">
                <div className="pt-2 sm:pt-2.5 border-t border-[#5A182B]/20">
                  <p className="font-jakarta text-xs sm:text-sm md:text-base font-medium text-stone-800 leading-relaxed whitespace-pre-line select-text">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
