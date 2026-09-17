"use client";

import { useEffect, useRef, memo } from "react";
import { createLEDGridEngine, type LEDGridEngine } from "@/lib/led-grid-engine";

/**
 * Hero LED pixel field.
 *
 * The simulation itself lives in `lib/led-grid-engine` and normally runs inside
 * a Web Worker against an OffscreenCanvas. Profiling a CPU-throttled fast scroll
 * showed this loop produced *every* remaining long task on the page (25 tasks /
 * 1467ms); ablating it dropped frame drops from 24.7% to 5.1%. The ~33k draw
 * calls per frame are inherent to the approved 8px grid, so rather than change
 * the look the work was moved off the main thread entirely.
 *
 * This component now only owns sizing and visibility, and posts messages.
 */
function LEDPixelGridInner({
  className,
  active = true,
}: {
  className?: string;
  /**
   * When false the grid is built and painted once, but the animation loop stays
   * parked. The hero renders this at opacity 0 behind the opaque intro video,
   * where a full-rate loop is wasted work at the most load-sensitive moment.
   */
  active?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  // Main-thread fallback, used only when OffscreenCanvas/worker is unavailable.
  const engineRef = useRef<LEDGridEngine | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const shouldRunRef = useRef(false);
  // Assigned by the setup effect below; lets the `active` effect re-evaluate the
  // run decision without tearing down the worker (which owns the transferred
  // canvas and cannot be re-initialised).
  const applyRunRef = useRef<((run: boolean) => void) | null>(null);
  const syncRef = useRef<(() => void) | null>(null);

  // ── Set up the renderer once ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = () => {
      const parent = canvas.parentElement;
      const rect = canvas.getBoundingClientRect();
      return {
        width: Math.round(rect.width || parent?.clientWidth || window.innerWidth),
        height: Math.round(rect.height || parent?.clientHeight || window.innerHeight),
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      };
    };

    let disposed = false;
    const size = measure();
    let lastW = 0;
    let lastH = 0;

    const canUseWorker =
      typeof Worker !== "undefined" &&
      typeof OffscreenCanvas !== "undefined" &&
      typeof canvas.transferControlToOffscreen === "function";

    if (canUseWorker) {
      try {
        const worker = new Worker(new URL("@/lib/led-grid.worker.ts", import.meta.url));
        workerRef.current = worker;
        const offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({ type: "init", canvas: offscreen, ...size }, [offscreen]);
        lastW = size.width;
        lastH = size.height;
      } catch {
        workerRef.current = null;
      }
    }

    if (!workerRef.current) {
      // Fallback: identical engine, driven on the main thread.
      const ctx = canvas.getContext("2d", { alpha: true });
      if (ctx) {
        canvas.width = Math.round(size.width * size.dpr);
        canvas.height = Math.round(size.height * size.dpr);
        const engine = createLEDGridEngine(ctx);
        engine.resize(size.width, size.height, size.dpr);
        engine.frame(performance.now());
        engineRef.current = engine;
        lastW = size.width;
        lastH = size.height;
      }
    }

    const applyRun = (run: boolean) => {
      if (disposed) return;
      if (workerRef.current) {
        workerRef.current.postMessage({ type: "run", running: run });
        return;
      }
      const engine = engineRef.current;
      if (!engine) return;
      if (run && !runningRef.current) {
        runningRef.current = true;
        const loop = (t: number) => {
          if (!runningRef.current) return;
          engine.frame(t);
          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
      } else if (!run && runningRef.current) {
        runningRef.current = false;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    applyRunRef.current = applyRun;

    // ── Resize ────────────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const doResize = () => {
      const next = measure();
      if (next.width <= 0 || next.height <= 0) return;
      // Ignore sub-4px jitter (mobile URL-bar show/hide) to avoid rebuilding.
      if (Math.abs(next.width - lastW) < 4 && Math.abs(next.height - lastH) < 4) return;
      lastW = next.width;
      lastH = next.height;
      if (workerRef.current) {
        workerRef.current.postMessage({ type: "resize", ...next });
      } else if (engineRef.current) {
        canvas.width = Math.round(next.width * next.dpr);
        canvas.height = Math.round(next.height * next.dpr);
        engineRef.current.resize(next.width, next.height, next.dpr);
      }
    };
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doResize, 60);
    };

    const ro = new ResizeObserver(onResize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener("resize", onResize);

    // ── Visibility gating ─────────────────────────────────────────────
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let onScreen = false;

    const sync = () => {
      const run = onScreen && shouldRunRef.current && !document.hidden && !prefersReducedMotion;
      applyRun(run);
    };
    syncRef.current = sync;

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      io.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      runningRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (workerRef.current) {
        workerRef.current.postMessage({ type: "dispose" });
        workerRef.current.terminate();
        workerRef.current = null;
      }
      engineRef.current = null;
      applyRunRef.current = null;
      syncRef.current = null;
    };
  }, []);

  // Keep the run decision in sync with the `active` prop.
  useEffect(() => {
    shouldRunRef.current = active;
    syncRef.current?.();
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

const LEDPixelGrid = memo(LEDPixelGridInner);
export default LEDPixelGrid;
