'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Code, Mail } from 'lucide-react'

const SOCIALS = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/ieeeuvce",
    iconKey: "instagram",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/ieee-uvce-66563332/",
    iconKey: "linkedin",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/ieeeuvce",
    iconKey: "facebook",
  },
  {
    name: "Email",
    url: "mailto:ieeeuvce.ac.in",
    iconKey: "email",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/UCt9I0q7BzuuRBcJKvMcdpow",
    iconKey: "youtube",
  },
]

const DEVELOPERS = [
  {
    name: "Shravya Hegde",
    url: "https://www.linkedin.com/in/shravya-hegde-732ba7311",
  },
  {
    name: "Venkatesh Biradar",
    url: "https://www.linkedin.com/in/venkateshbiradar/",
  },
]

// Inline Social Icons
const SocialIcons: Record<string, () => React.JSX.Element> = {
  instagram: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  linkedin: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  facebook: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
    </svg>
  ),
  email: () => <Mail className="w-5 h-5 stroke-[2]" />,
  youtube: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186c-.273-.997-1.056-1.77-2.054-2.043-1.815-.494-9.081-.494-9.081-.494s-7.266 0-9.08.494c-.998.273-1.78 1.046-2.054 2.043-.495 1.832-.495 5.655-.495 5.655s0 3.823.495 5.655c.274.997 1.056 1.77 2.054 2.043 1.814.494 9.08.494 9.08.494s7.266 0 9.08-.494c.999-.273 1.781-1.046 2.055-2.043.494-1.832.494-5.655.494-5.655s0-3.823-.494-5.655zm-13.918 8.847v-6.064l5.882 3.032-5.882 3.032z" />
    </svg>
  ),
}

export function Footer() {
  return (
    <footer className="relative w-full border-t-2 border-white/80 bg-white/20 backdrop-blur-2xl shadow-2xl z-20 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      {/* Subtle Glass Interior Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
        {/* Left side - Developer credit */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
          <div className="flex items-center gap-3 text-base sm:text-lg lg:text-xl font-roboto-mono font-bold text-white drop-shadow-sm">
            <Code className="text-white stroke-[2.5] w-5 h-5 sm:w-6 sm:h-6" />
            <span>Developed by</span>
            <span className="font-extrabold text-white">
              Software Development SIG
            </span>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 font-roboto-mono text-sm sm:text-base font-semibold text-white/90">
            {DEVELOPERS.map((dev, idx) => (
              <span key={dev.name} className="flex items-center gap-x-3">
                <a
                  href={dev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white hover:text-red-200 hover:underline font-bold transition-colors drop-shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>{dev.name}</span>
                </a>
                {idx < DEVELOPERS.length - 1 && (
                  <span className="text-red-200 font-extrabold px-0.5">&</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Right side - Social icons */}
        <div className="flex justify-center sm:justify-end">
          <div className="flex gap-3 sm:gap-4">
            {SOCIALS.map((social) => {
              const IconComponent = SocialIcons[social.iconKey]
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/30 backdrop-blur-xl border border-white/80 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:bg-white hover:text-[#8a1c1c] shadow-lg shadow-black/20"
                  aria-label={social.name}
                  title={social.name}
                >
                  <IconComponent />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
