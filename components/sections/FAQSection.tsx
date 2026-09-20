'use client'

import * as React from 'react'
import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'

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

export default function FAQSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Direct 100% native DOM event handler (Matches the vanilla JS snippet exactly)
  // No React state updates during click -> 0ms latency, 0 dropped frames on mobile
  const handleItemClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    const currentItem = btn.closest('.accordion__item') as HTMLElement | null
    const currentContent = btn.nextElementSibling as HTMLElement | null
    if (!currentItem || !currentContent) return

    const isCurrentlyActive = currentItem.classList.contains('active')

    // Collapse any other open accordion item instantly
    if (containerRef.current) {
      const allActiveItems = containerRef.current.querySelectorAll('.accordion__item.active')
      allActiveItems.forEach((item) => {
        if (item !== currentItem) {
          item.classList.remove('active')
          const headerBtn = item.querySelector('.item__header')
          headerBtn?.setAttribute('aria-expanded', 'false')
          const content = item.querySelector('.item__content') as HTMLElement | null
          if (content) {
            content.style.maxHeight = '0px'
          }
        }
      })
    }

    // Toggle current item with native CSS 300ms transition
    if (isCurrentlyActive) {
      currentItem.classList.remove('active')
      btn.setAttribute('aria-expanded', 'false')
      currentContent.style.maxHeight = '0px'
    } else {
      currentItem.classList.add('active')
      btn.setAttribute('aria-expanded', 'true')
      currentContent.style.maxHeight = `${currentContent.scrollHeight}px`
    }
  }

  return (
    <section
      id="faq"
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none px-4 py-8 sm:py-12 scroll-mt-6 z-10"
      style={{ contain: 'paint' }}
    >
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

      {/* FAQ Accordion List (Vanilla DOM Architecture) */}
      <div className="w-full">
        <div ref={containerRef} className="w-full flex flex-col">
          {FAQS.map((faq, idx) => (
            <div
              key={`faq-${idx}`}
              className="accordion__item"
            >
              <button
                type="button"
                onClick={handleItemClick}
                className="item__header"
                aria-expanded="false"
                aria-controls={`faq-answer-${idx}`}
                id={`faq-btn-${idx}`}
              >
                <h3 className="item__question">{faq.question}</h3>
                <div className="item__icon">
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>

              <div
                id={`faq-answer-${idx}`}
                role="region"
                aria-labelledby={`faq-btn-${idx}`}
                className="item__content"
              >
                <div className="item__body">
                  <p className="item__answer">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
