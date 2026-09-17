"use client";

import { useEffect, useRef, memo } from "react";
import { createLEDGridEngine, type LEDGridEngine } from "@/lib/led-grid-engine";

/**
 * Hero LED pixel field.
 *
 * The simulation lives in `lib/led-grid-engine` and normally runs inside a Web
 * Worker against an OffscreenCanvas. Profiling a CPU-throttled fast scroll
 * showed this loop produced *every* remaining long task on the page (25 tasks /
 * 1467ms); ablating it dropped frame drops from 24.7% to 5.1%. The ~33k draw
 * calls per frame are inherent to the approved 8px grid, so rather than change
 * the look the work was moved off the main thread entirely.
 *
 * This component only owns sizing and visibility.
 */

type Renderer =
  | { kind: "worker"; worker: Worker }
  | { kind: "main"; engine: LEDGridEngine };

interface CanvasSize {
  width: number;
  height: number;
  dpr: number;
}

/**
 * A canvas's control can only be transferred to an OffscreenCanvas ONCE for the
 * lifetime of the element, and React Strict Mode deliberately runs effect
 * setup -> cleanup -> setup again against that same element in development.
 * Keying the renderer off the element means the second setup reuses the existing
 * worker instead of attempting a second transfer (which always throws, and
 * previously cascaded into a getContext() call on an already-transferred canvas
 * that took down the whole page in dev).
 */
const renderers = new WeakMap<HTMLCanvasElement, Renderer>();

function createRenderer(canvas: HTMLCanvasElement, size: CanvasSize): Renderer | null {
  const existing = renderers.get(canvas);
  if (existing) return existing;

  const canUseWorker =
    typeof Worker !== "undefined" &&
    typeof OffscreenCanvas !== "undefined" &&
    typeof canvas.transferControlToOffscreen === "function";

  if (canUseWorker) {
    // Construct the worker BEFORE transferring. If worker construction fails the
    // canvas is still untouched and the main-thread fallback below stays viable.
    let worker: Worker | null = null;
    try {
      worker = new Worker(new URL("@/lib/led-grid.worker.ts", import.meta.url));
    } catch {
      worker = null;
    }

    if (worker) {
      let transferred = false;
      try {
        const offscreen = canvas.transferControlToOffscreen();
        transferred = true;
        worker.postMessage({ type: "init", canvas: offscreen, ...size }, [offscreen]);
        const renderer: Renderer = { kind: "worker", worker };
        renderers.set(canvas, renderer);
        return renderer;
      } catch {
        worker.terminate();
        // Once the transfer has happened the canvas can never be drawn to from
        // the main thread, so fall back only if it definitely did not happen.
        if (transferred) return null;
      }
    }
  }

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;
  canvas.width = Math.round(size.width * size.dpr);
  canvas.height = Math.round(size.height * size.dpr);
  const engine = createLEDGridEngine(ctx);
  engine.resize(size.width, size.height, size.dpr);
  engine.frame(performance.now());
  const renderer: Renderer = { kind: "main", engine };
  renderers.set(canvas, renderer);
  return renderer;
}

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
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const shouldRunRef = useRef(active);
  const teardownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Assigned by the setup effect; lets the `active` effect re-evaluate the run
  // decision without tearing down the worker.
  const syncRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // A Strict Mode remount runs cleanup then immediately re-runs setup in the
    // same task. Cancelling the deferred teardown keeps the worker — and its
    // one-time canvas transfer — alive across that cycle.
    if (teardownRef.current !== null) {
      clearTimeout(teardownRef.current);
      teardownRef.current = null;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = (): CanvasSize => {
      const parent = canvas.parentElement;
      const rect = canvas.getBoundingClientRect();
      return {
        width: Math.round(rect.width || parent?.clientWidth || window.innerWidth),
        height: Math.round(rect.height || parent?.clientHeight || window.innerHeight),
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      };
    };

    const size = measure();
    const renderer = createRenderer(canvas, size);
    if (!renderer) return;

    let lastW = size.width;
    let lastH = size.height;

    const applyRun = (run: boolean) => {
      if (renderer.kind === "worker") {
        renderer.worker.postMessage({ type: "run", running: run });
        return;
      }
      const { engine } = renderer;
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

    // ── Resize ────────────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const doResize = () => {
      const next = measure();
      if (next.width <= 0 || next.height <= 0) return;
      // Ignore sub-4px jitter (mobile URL-bar show/hide) to avoid rebuilding.
      if (Math.abs(next.width - lastW) < 4 && Math.abs(next.height - lastH) < 4) return;
      lastW = next.width;
      lastH = next.height;
      if (renderer.kind === "worker") {
        renderer.worker.postMessage({ type: "resize", ...next });
      } else {
        canvas.width = Math.round(next.width * next.dpr);
        canvas.height = Math.round(next.height * next.dpr);
        renderer.engine.resize(next.width, next.height, next.dpr);
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
      applyRun(onScreen && shouldRunRef.current && !document.hidden && !prefersReducedMotion);
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
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      io.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      syncRef.current = null;

      // Park the animation straight away, but defer destroying the renderer by a
      // macrotask so a Strict Mode remount can reclaim it (see above). On a real
      // unmount nothing cancels this and the worker is terminated.
      applyRun(false);
      teardownRef.current = setTimeout(() => {
        teardownRef.current = null;
        runningRef.current = false;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        if (renderer.kind === "worker") {
          renderer.worker.postMessage({ type: "dispose" });
          renderer.worker.terminate();
        }
        renderers.delete(canvas);
      }, 0);
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
