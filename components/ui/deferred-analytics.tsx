"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Vercel Analytics and Speed Insights, mounted only once the page has gone idle.
 *
 * Both are no-ops in local development and only actually do work on a Vercel
 * deployment, which makes them invisible in dev and a real cost in production --
 * the exact shape of "it is smooth on localhost but not after deploying".
 * Speed Insights in particular installs PerformanceObservers, including event
 * timing for INP, so it has handlers attached to the same interactions whose
 * smoothness is being complained about.
 *
 * Deferring to idle keeps both of them (no telemetry is lost -- they report
 * Core Web Vitals from buffered entries, which are recorded by the browser
 * before these scripts ever run) while getting their setup off the critical
 * path and out of the way of the first interaction.
 */
export default function DeferredAnalytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // requestIdleCallback is still missing on Safari below 17.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const start = () => setReady(true);
    const handle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 5000 })
      : window.setTimeout(start, 2500);
    return () => {
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
