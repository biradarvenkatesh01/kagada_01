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
} from "react";

const flipUnitVariants = cva(
  "relative subpixel-antialiased perspective-[1000px] rounded-md overflow-hidden",
  {
    variants: {
      size: {
        sm: "w-8 min-w-8 h-12 text-2xl sm:w-10 sm:min-w-10 sm:h-14 sm:text-3xl", // Small
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
  "absolute inset-x-0 overflow-hidden h-1/2 bg-inherit text-inherit",
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
      setFlipping(true);
      const timer = setTimeout(() => {
        setFlipping(false);
        setPrevDigit(digit);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [digit, prevDigit]);

  return (
    <div className={cn(flipUnitVariants({ size, variant }), className)}>
      {/* 1. Background Top */}
      <div className={cn(commonCardStyle, "rounded-t-lg top-0")}>
        <DigitSpan position="top">{digit}</DigitSpan>
      </div>

      {/* 2. Background Bottom */}
      <div className={cn(commonCardStyle, "rounded-b-lg translate-y-full")}>
        <DigitSpan position="bottom">{prevDigit}</DigitSpan>
      </div>

      {/* 3. Top Flap */}
      <div
        className={cn(
          commonCardStyle,
          "z-20 origin-bottom backface-hidden rounded-t-lg",
          flipping && "animate-flip-top",
        )}
      >
        <DigitSpan position="top">{prevDigit}</DigitSpan>
      </div>

      {/* 4. Bottom Flap */}
      <div
        className={cn(
          commonCardStyle,
          "z-10 origin-top backface-hidden rounded-b-lg translate-y-full",
          flipping && "animate-flip-bottom",
        )}
        style={{ transform: "rotateX(90deg)" }}
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
        "absolute left-0 right-0 w-full flex items-center justify-center h-[200%]",
      )}
      style={{
        top: position === "top" ? "0%" : "-100%",
      }}
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
    <div className="flex h-12 sm:h-14 items-center justify-center">
      <span
        className={cn(
          "text-center text-[#8a1c1c]/80 font-bold leading-none px-0.5 self-center",
          heightMap[size],
        )}
      >
        :
      </span>
    </div>
  );
}

const FlipClock = ({
  countdown = false,
  targetDate,
  size = "sm",
  variant = "default",
  showDays = "auto",
  className,
  ...props
}: FlipClockProps) => {
  const [time, setTime] = useState<TimeLeft>(getTime(countdown, targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const nextTime = getTime(countdown, targetDate);

      setTime((prev) => {
        if (
          prev.seconds === nextTime.seconds &&
          prev.minutes === nextTime.minutes
        ) {
          return prev;
        }
        return nextTime;
      });
    }, 250);

    return () => clearInterval(timer);
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
      className={cn("relative flex items-start justify-center space-x-1.5 sm:space-x-3 font-mono font-medium", className)}
      aria-live="polite"
      {...props}
    >
      <span className="sr-only absolute">
        {`${time.days} days ${time.hours}:${time.minutes}:${time.seconds}`}
      </span>

      {/* Days Group */}
      {shouldShowDays && (
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1">
            {daysStr.split("").map((digit, i) => (
              <FlipUnit
                key={`d-${i}`}
                digit={digit}
                size={size}
                variant={variant}
              />
            ))}
          </div>
          <span className="font-roboto-mono text-[0.6rem] sm:text-xs font-bold text-[#8a1c1c]/80 mt-1.5 tracking-widest uppercase select-none">
            DAYS
          </span>
        </div>
      )}

      {shouldShowDays && <ClockSeparator size={size} />}

      {/* Hours Group */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-1">
          {hoursStr.split("").map((digit, index) => (
            <FlipUnit
              key={`hour-${index}`}
              digit={digit}
              size={size}
              variant={variant}
            />
          ))}
        </div>
        <span className="font-roboto-mono text-[0.6rem] sm:text-xs font-bold text-[#8a1c1c]/80 mt-1.5 tracking-widest uppercase select-none">
          HOURS
        </span>
      </div>

      <ClockSeparator size={size} />

      {/* Minutes Group */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-1">
          {minutesStr.split("").map((digit, index) => (
            <FlipUnit
              key={`minute-${index}`}
              digit={digit}
              size={size}
              variant={variant}
            />
          ))}
        </div>
        <span className="font-roboto-mono text-[0.6rem] sm:text-xs font-bold text-[#8a1c1c]/80 mt-1.5 tracking-widest uppercase select-none">
          MINS
        </span>
      </div>

      <ClockSeparator size={size} />

      {/* Seconds Group */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-1">
          {secondsStr.split("").map((digit, index) => (
            <FlipUnit
              key={`second-${index}`}
              digit={digit}
              size={size}
              variant={variant}
            />
          ))}
        </div>
        <span className="font-roboto-mono text-[0.6rem] sm:text-xs font-bold text-[#8a1c1c]/80 mt-1.5 tracking-widest uppercase select-none">
          SECS
        </span>
      </div>

      {/* Keyframe Animations */}
      <style jsx global>{`
        .animate-flip-top {
          animation: flip-top-anim 0.6s ease-in forwards;
        }
        .animate-flip-bottom {
          animation: flip-bottom-anim 0.6s ease-out forwards;
        }

        @keyframes flip-top-anim {
          0% {
            transform: rotateX(0deg);
            z-index: 30;
          }
          50%,
          100% {
            transform: rotateX(-90deg);
            z-index: 10;
          }
        }

        @keyframes flip-bottom-anim {
          0%,
          50% {
            transform: rotateX(90deg);
            z-index: 10;
          }
          100% {
            transform: rotateX(0deg);
            z-index: 30;
          }
        }
      `}</style>
    </div>
  );
};

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
