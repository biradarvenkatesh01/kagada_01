'use client'

import * as React from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'

export interface CtaProps {
  ctaEnabled?: boolean
  text?: string
  link?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
}

export function Cta({ cta }: Readonly<{ cta: CtaProps }>) {
  if (!cta?.ctaEnabled || !cta.text) return null

  return (
    <Button
      asChild
      variant={cta.variant ?? 'default'}
      size={cta.size ?? 'default'}
      className="bg-white/40 backdrop-blur-md border border-white/80 text-white hover:bg-white/60 shadow-lg shadow-black/10 transition-all font-semibold"
    >
      <a href={cta.link || '#'}>{cta.text}</a>
    </Button>
  )
}
