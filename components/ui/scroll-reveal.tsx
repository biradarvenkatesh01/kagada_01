"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  x?: number;
  y?: number;
  scale?: number;
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  className,
  as: Component = "div",
  style,
  delay,
  duration,
  direction,
  x,
  y,
  scale,
  ...props
}: ScrollRevealProps) {
  void delay;
  void duration;
  void direction;
  void x;
  void y;
  void scale;
  return (
    <Component
      className={cn("scroll-reveal", className)}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}

export default ScrollReveal;
