import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  pauseOnHover?: boolean
  direction?: "left" | "right"
  speed?: number
}

export function Marquee({
  children,
  pauseOnHover = false,
  direction = "left",
  speed = 30,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div 
      className={cn(
        "w-full overflow-hidden z-10 py-2 select-none",
        className
      )} 
      {...props}
    >
      <div className="relative flex w-full overflow-hidden py-4 sm:py-6 select-none">
        <div 
          className={cn(
            "flex w-max transform-gpu will-change-transform",
            direction === "right" ? "animate-marquee-reverse" : "animate-marquee",
            pauseOnHover && "marquee-pause-hover hover:[animation-play-state:paused]"
          )}
          style={{ "--duration": `${speed}s` } as React.CSSProperties}
        >
          {/* Block 1: Exactly 50% of the total flex container width */}
          <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0">
            {children}
          </div>
          {/* Block 2: Identical 50% duplicate for 100% seamless GPU looping */}
          <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marquee
