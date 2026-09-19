"use client";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import {
  FC,
  HTMLAttributes,
  memo,
  ReactNode,
  useEffect,
  useState,
  useRef,
} from "react";

const flipUnitVariants = cva(
  "relative subpixel-antialiased perspective-[1000px] rounded-md overflow-hidden transform-gpu",
  {
    variants: {
      size: {
        sm: "w-5 min-w-[1.25rem] h-7.5 text-xs min-[340px]:w-5.5 min-[340px]:min-w-[1.375rem] min-[340px]:h-8.5 min-[340px]:text-sm min-[380px]:w-7 min-[380px]:min-w-[1.75rem] min-[380px]:h-10 min-[380px]:text-base min-[430px]:w-8 min-[430px]:min-w-[2rem] min-[430px]:h-11.5 min-[430px]:text-xl sm:w-10 sm:min-w-10 sm:h-14 sm:text-3xl", // Fluid responsive Small
        md: "w-12 min-w-12 h-16 text-4xl sm:w-14 sm:min-w-14 sm:h-20 sm:text-5xl", // Medium
        lg: "w-14 min-w-14 h-20 text-5xl sm:w-17 sm:min-w-17 sm:h-24 sm:text-6xl", // Large
        xl: "w-20 min-w-20 h-28 text-7xl sm:w-22 sm:min-w-22 sm:h-32 sm:text-8xl", // Extra Large
      },
      variant: {
        default: "bg-[#8a1c1c]/80 text-white",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background text-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

interface FlipUnitProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flipUnitVariants> {
  digit: number | string;
}

const commonCardStyle = cn(
  "absolute inset-x-0 overflow-hidden h-1/2 bg-inherit text-inherit backface-hidden transform-gpu",
);

const FlipUnit: FC<FlipUnitProps> = memo(function FlipUnit({
  digit,
  size,
  variant,
  className,
}: FlipUnitProps) {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit) {
      let timer: NodeJS.Timeout | undefined;
      const raf = requestAnimationFrame(() => {
        setFlipping(true);
        timer = setTimeout(() => {
          setFlipping(false);
          setPrevDigit(digit);
        }, 550);
      });
      return () => {
        cancelAnimationFrame(raf);
        if (timer) clearTimeout(timer);
      };
    }
  }, [digit, prevDigit]);

  return (
    <div className={cn(flipUnitVariants({ size, variant }), className)} suppressHydrationWarning>
      {/* 1. Background Top */}
      <div className={cn(commonCardStyle, "rounded-t-lg top-0")} suppressHydrationWarning>
        <DigitSpan position="top">{digit}</DigitSpan>
      </div>

      {/* 2. Background Bottom */}
      <div className={cn(commonCardStyle, "rounded-b-lg translate-y-full")} suppressHydrationWarning>
        <DigitSpan position="bottom">{prevDigit}</DigitSpan>
      </div>

      {/* 3. Top Flap */}
      <div
        className={cn(
          commonCardStyle,
          "z-20 origin-bottom rounded-t-lg",
          flipping && "animate-flip-top",
        )}
        suppressHydrationWarning
      >
        <DigitSpan position="top">{prevDigit}</DigitSpan>
      </div>

      {/* 4. Bottom Flap */}
      <div
        className={cn(
          commonCardStyle,
          "z-10 origin-top rounded-b-lg translate-y-full",
          flipping && "animate-flip-bottom",
        )}
        style={{ transform: "rotateX(90deg)" }}
        suppressHydrationWarning
      >
        <DigitSpan position="bottom">{digit}</DigitSpan>
      </div>

      {/* Center Divider Shadow */}
      <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-black/30 z-30" />
    </div>
  );
});

interface DigitSpanProps {
  children: ReactNode;
  position?: "top" | "bottom";
}

function DigitSpan({ children, position }: DigitSpanProps) {
  return (
    <span
      className={cn(
        "absolute left-0 right-0 w-full flex items-center justify-center h-[200%] select-none",
      )}
      style={{
        top: position === "top" ? "0%" : "-100%",
      }}
      suppressHydrationWarning
    >
      {children}
    </span>
  );
}

interface FlipClockProps
  extends HTMLAttributes<HTMLDivElement> {
  countdown?: boolean;
  targetDate?: Date;
  showDays?: "auto" | "always" | "never";
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "secondary" | "destructive" | "outline" | "muted";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type FlipClockSize = "sm" | "md" | "lg" | "xl";

const heightMap: Record<FlipClockSize, string> = {
  sm: "text-2xl sm:text-3xl",
  md: "text-3xl sm:text-5xl",
  lg: "text-4xl sm:text-6xl",
  xl: "text-6xl sm:text-8xl",
};

function ClockSeparator({ size = "md" }: { size?: FlipClockSize }) {
  return (
    <div className="flex h-7.5 min-[340px]:h-8.5 min-[380px]:h-10 min-[430px]:h-11.5 sm:h-14 items-center justify-center shrink-0 px-0.5">
      <span
        className={cn(
          "text-center text-[#8a1c1c]/80 font-bold leading-none self-center select-none text-xs min-[340px]:text-sm min-[380px]:text-base min-[430px]:text-xl sm:text-3xl",
          size !== "sm" && heightMap[size],
        )}
      >
        :
      </span>
    </div>
  );
}

const FlipClock = memo(function FlipClock({
  countdown = false,
  targetDate,
  size = "sm",
  variant = "default",
  showDays = "auto",
  className,
  ...props
}: FlipClockProps) {
  const [time, setTime] = useState<TimeLeft>(getTime(countdown, targetDate));
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    const measure = () => {
      const containerW = el.clientWidth;
      const contentW = content.scrollWidth;
      if (containerW > 0 && contentW > 0) {
        if (contentW > containerW) {
          setScale(Math.max(0.65, (containerW - 4) / contentW));
        } else {
          setScale(1);
        }
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      const nextTime = getTime(countdown, targetDate);
      setTime((prev) => {
        if (
          prev.seconds === nextTime.seconds &&
          prev.minutes === nextTime.minutes &&
          prev.hours === nextTime.hours &&
          prev.days === nextTime.days
        ) {
          return prev;
        }
        return nextTime;
      });
    };

    // The page is statically prerendered, so the initial state was computed at
    // build time. Correct it immediately on mount instead of waiting up to a
    // full second for the first tick.
    update();

    let timer: NodeJS.Timeout | null = null;
    let isVisible = !document.hidden;
    let isInView = true;

    const startTimer = () => {
      if (!timer && isVisible && isInView) {
        update();
        timer = setInterval(update, 1000);
      }
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    startTimer();

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && isInView) {
        startTimer();
      } else {
        stopTimer();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    const el = containerRef.current;
    let io: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          isInView = entry.isIntersecting;
          if (isInView && isVisible) {
            startTimer();
          } else {
            stopTimer();
          }
        },
        { threshold: 0 }
      );
      io.observe(el);
    }

    return () => {
      stopTimer();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [countdown, targetDate]);

  // 2 digits for days (e.g. 44)
  const daysStr = String(time.days).padStart(2, "0");
  const hoursStr = String(time.hours).padStart(2, "0");
  const minutesStr = String(time.minutes).padStart(2, "0");
  const secondsStr = String(time.seconds).padStart(2, "0");

  const shouldShowDays =
    countdown &&
    (showDays === "always" || (showDays === "auto" && time.days > 0));

  return (
    <div
      ref={containerRef}
      className={cn("w-full max-w-full flex items-center justify-center overflow-hidden", className)}
      suppressHydrationWarning
    >
      <div
        ref={contentRef}
        style={{
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "center center",
        }}
        className="w-fit flex items-start justify-center space-x-0.5 min-[340px]:space-x-1 sm:space-x-2 md:space-x-3 font-mono font-medium shrink-0 transform-gpu transition-transform duration-100 ease-out"
        aria-live="polite"
        suppressHydrationWarning
        {...props}
      >
        <span className="sr-only absolute" suppressHydrationWarning>
          {`${time.days} days ${time.hours}:${time.minutes}:${time.seconds}`}
        </span>

        {/* Days Group */}
        {shouldShowDays && (
          <div className="flex flex-col items-center shrink-0" suppressHydrationWarning>
            <div className="flex items-center space-x-0.5 sm:space-x-1" suppressHydrationWarning>
              {daysStr.split("").map((digit, i) => (
                <FlipUnit
                  key={`d-${i}`}
                  digit={digit}
                  size={size}
                  variant={variant}
                />
              ))}
            </div>
            <span className="font-roboto-mono text-[0.48rem] min-[340px]:text-[0.55rem] min-[380px]:text-[0.62rem] sm:text-xs font-bold text-[#8a1c1c]/80 mt-0.5 sm:mt-1.5 tracking-wider sm:tracking-widest uppercase select-none">
              DAYS
            </span>
          </div>
        )}

        {shouldShowDays && <ClockSeparator size={size} />}

        {/* Hours Group */}
        <div className="flex flex-col items-center shrink-0" suppressHydrationWarning>
          <div className="flex items-center space-x-0.5 sm:space-x-1" suppressHydrationWarning>
            {hoursStr.split("").map((digit, index) => (
              <FlipUnit
                key={`hour-${index}`}
                digit={digit}
                size={size}
                variant={variant}
              />
            ))}
          </div>
          <span className="font-roboto-mono text-[0.48rem] min-[340px]:text-[0.55rem] min-[380px]:text-[0.62rem] sm:text-xs font-bold text-[#8a1c1c]/80 mt-0.5 sm:mt-1.5 tracking-wider sm:tracking-widest uppercase select-none">
            HOURS
          </span>
        </div>

        <ClockSeparator size={size} />

        {/* Minutes Group */}
        <div className="flex flex-col items-center shrink-0" suppressHydrationWarning>
          <div className="flex items-center space-x-0.5 sm:space-x-1" suppressHydrationWarning>
            {minutesStr.split("").map((digit, index) => (
              <FlipUnit
                key={`minute-${index}`}
                digit={digit}
                size={size}
                variant={variant}
              />
            ))}
          </div>
          <span className="font-roboto-mono text-[0.48rem] min-[340px]:text-[0.55rem] min-[380px]:text-[0.62rem] sm:text-xs font-bold text-[#8a1c1c]/80 mt-0.5 sm:mt-1.5 tracking-wider sm:tracking-widest uppercase select-none">
            MINS
          </span>
        </div>

        <ClockSeparator size={size} />

        {/* Seconds Group */}
        <div className="flex flex-col items-center shrink-0" suppressHydrationWarning>
          <div className="flex items-center space-x-0.5 sm:space-x-1" suppressHydrationWarning>
            {secondsStr.split("").map((digit, index) => (
              <FlipUnit
                key={`second-${index}`}
                digit={digit}
                size={size}
                variant={variant}
              />
            ))}
          </div>
          <span className="font-roboto-mono text-[0.48rem] min-[340px]:text-[0.55rem] min-[380px]:text-[0.62rem] sm:text-xs font-bold text-[#8a1c1c]/80 mt-0.5 sm:mt-1.5 tracking-wider sm:tracking-widest uppercase select-none">
            SECS
          </span>
        </div>
      </div>
    </div>
  );
});

function getTime(countdown: boolean, targetDate?: Date): TimeLeft {
  const now = new Date();

  if (!countdown) {
    return {
      days: 0,
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  }

  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const diff = Math.max(0, targetDate.getTime() - now.getTime());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default FlipClock;
