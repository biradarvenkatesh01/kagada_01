"use client";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import {
  HTMLAttributes,
  memo,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

const flipUnitVariants = cva(
  "flip-unit relative subpixel-antialiased !rounded-none overflow-hidden",
  {
    variants: {
      size: {
        sm: "w-5 min-w-[1.25rem] h-7.5 text-xs min-[340px]:w-5.5 min-[340px]:min-w-[1.375rem] min-[340px]:h-8.5 min-[340px]:text-sm min-[380px]:w-7 min-[380px]:min-w-[1.75rem] min-[380px]:h-10 min-[380px]:text-base min-[430px]:w-8 min-[430px]:min-w-[2rem] min-[430px]:h-11.5 min-[430px]:text-xl sm:w-10 sm:min-w-10 sm:h-14 sm:text-3xl", // Fluid responsive Small
        md: "w-12 min-w-12 h-16 text-4xl sm:w-14 sm:min-w-14 sm:h-20 sm:text-5xl", // Medium
        lg: "w-14 min-w-14 h-20 text-5xl sm:w-17 sm:min-w-17 sm:h-24 sm:text-6xl", // Large
        xl: "w-20 min-w-20 h-28 text-7xl sm:w-22 sm:min-w-22 sm:h-32 sm:text-8xl", // Extra Large
      },
      variant: {
        default: "bg-[#5A182B] text-[#D8D3C7]",
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

function FlipUnit({
  digit,
  size,
  variant,
  className,
}: FlipUnitProps) {
  return (
    <div
      className={cn(
        flipUnitVariants({ size, variant }),
        "flex items-center justify-center font-mono font-bold shadow-sm !rounded-none",
        className
      )}
    >
      <span className="leading-none select-none tracking-tight">
        {digit}
      </span>
    </div>
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
          "text-center text-[#5A182B]/80 font-bold leading-none self-center select-none text-xs min-[340px]:text-sm min-[380px]:text-base min-[430px]:text-xl sm:text-3xl",
          size !== "sm" && heightMap[size],
        )}
      >
        :
      </span>
    </div>
  );
}

// Module-level cache for server time drift calibration across all users globally
let globalServerOffset = 0;
let hasRequestedTimeSync = false;

function syncServerTime(onCalibrated?: () => void) {
  if (hasRequestedTimeSync || typeof window === "undefined") return;
  hasRequestedTimeSync = true;
  fetch("/api/time", { cache: "no-store" })
    .then((r) => r.json())
    .then((data) => {
      if (typeof data.now === "number") {
        globalServerOffset = data.now - Date.now();
        if (onCalibrated) {
          onCalibrated();
        }
      }
    })
    .catch(() => {
      // Fallback: local client clock
    });
}

function emptySubscribe() {
  return () => {};
}

function getClientMounted() {
  return true;
}

function getServerMounted() {
  return false;
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
  const isMounted = useSyncExternalStore(emptySubscribe, getClientMounted, getServerMounted);
  const [time, setTime] = useState<TimeLeft>(() =>
    isMounted ? getTime(countdown, targetDate) : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  useEffect(() => {
    const update = () => {
      setTime(getTime(countdown, targetDate));
    };

    update();
    syncServerTime(update);

    const timer = setInterval(update, 1000);

    const onVisibilityChange = () => {
      if (!document.hidden) {
        update();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [countdown, targetDate]);

  // Digits formatted with leading zeroes
  const daysStr = String(time.days).padStart(2, "0");
  const hoursStr = String(time.hours).padStart(2, "0");
  const minutesStr = String(time.minutes).padStart(2, "0");
  const secondsStr = String(time.seconds).padStart(2, "0");

  const displayDays = isMounted ? daysStr : "00";
  const displayHours = isMounted ? hoursStr : "00";
  const displayMinutes = isMounted ? minutesStr : "00";
  const displaySeconds = isMounted ? secondsStr : "00";

  const shouldShowDays =
    countdown &&
    (showDays === "always" || (showDays === "auto" && (time.days > 0 || !isMounted)));

  return (
    <div
      className={cn("w-full max-w-full flex items-center justify-center overflow-hidden", className)}
    >
      <div
        className="w-fit flex items-start justify-center space-x-0.5 min-[340px]:space-x-1 sm:space-x-2 md:space-x-3 font-mono font-medium shrink-0"
        aria-live="polite"
        {...props}
      >
        <span className="sr-only absolute">
          {`${displayDays} days ${displayHours}:${displayMinutes}:${displaySeconds}`}
        </span>

        {/* Days Group */}
        {shouldShowDays && (
          <div className="flex flex-col items-center shrink-0">
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {displayDays.split("").map((digit, i) => (
                <FlipUnit
                  key={`d-${i}`}
                  digit={digit}
                  size={size}
                  variant={variant}
                />
              ))}
            </div>
            <span className="font-roboto-mono text-[0.48rem] min-[340px]:text-[0.55rem] min-[380px]:text-[0.62rem] sm:text-xs font-bold text-[#5A182B]/80 mt-0.5 sm:mt-1.5 tracking-wider sm:tracking-widest uppercase select-none">
              DAYS
            </span>
          </div>
        )}

        {shouldShowDays && <ClockSeparator size={size} />}

        {/* Hours Group */}
        <div className="flex flex-col items-center shrink-0">
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            {displayHours.split("").map((digit, index) => (
              <FlipUnit
                key={`hour-${index}`}
                digit={digit}
                size={size}
                variant={variant}
              />
            ))}
          </div>
          <span className="font-roboto-mono text-[0.48rem] min-[340px]:text-[0.55rem] min-[380px]:text-[0.62rem] sm:text-xs font-bold text-[#5A182B]/80 mt-0.5 sm:mt-1.5 tracking-wider sm:tracking-widest uppercase select-none">
            HOURS
          </span>
        </div>

        <ClockSeparator size={size} />

        {/* Minutes Group */}
        <div className="flex flex-col items-center shrink-0">
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            {displayMinutes.split("").map((digit, index) => (
              <FlipUnit
                key={`minute-${index}`}
                digit={digit}
                size={size}
                variant={variant}
              />
            ))}
          </div>
          <span className="font-roboto-mono text-[0.48rem] min-[340px]:text-[0.55rem] min-[380px]:text-[0.62rem] sm:text-xs font-bold text-[#5A182B]/80 mt-0.5 sm:mt-1.5 tracking-wider sm:tracking-widest uppercase select-none">
            MINS
          </span>
        </div>

        <ClockSeparator size={size} />

        {/* Seconds Group */}
        <div className="flex flex-col items-center shrink-0">
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            {displaySeconds.split("").map((digit, index) => (
              <FlipUnit
                key={`second-${index}`}
                digit={digit}
                size={size}
                variant={variant}
              />
            ))}
          </div>
          <span className="font-roboto-mono text-[0.48rem] min-[340px]:text-[0.55rem] min-[380px]:text-[0.62rem] sm:text-xs font-bold text-[#5A182B]/80 mt-0.5 sm:mt-1.5 tracking-wider sm:tracking-widest uppercase select-none">
            SECS
          </span>
        </div>
      </div>
    </div>
  );
});

function getTime(countdown: boolean, targetDate?: Date): TimeLeft {
  const now = Date.now() + globalServerOffset;

  if (!countdown) {
    const nowDate = new Date(now);
    return {
      days: 0,
      hours: nowDate.getHours(),
      minutes: nowDate.getMinutes(),
      seconds: nowDate.getSeconds(),
    };
  }

  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const targetTime = targetDate.getTime();
  const diff = Math.max(0, targetTime - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default FlipClock;
