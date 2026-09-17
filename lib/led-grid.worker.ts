/// <reference lib="webworker" />
/**
 * Runs the LED grid simulation against a transferred OffscreenCanvas so none of
 * its ~33k draw calls per frame touch the main thread. Dedicated workers expose
 * a vsync-aligned requestAnimationFrame in current browsers; a timer fallback
 * keeps it working where they don't.
 */
import { createLEDGridEngine, type LEDGridEngine } from "./led-grid-engine";

type InboundMessage =
  | { type: "init"; canvas: OffscreenCanvas; width: number; height: number; dpr: number }
  | { type: "resize"; width: number; height: number; dpr: number }
  | { type: "run"; running: boolean }
  | { type: "dispose" };

let engine: LEDGridEngine | null = null;
let canvas: OffscreenCanvas | null = null;
let running = false;
let rafId: number | null = null;
let timerId: ReturnType<typeof setTimeout> | null = null;

const hasRaf = typeof requestAnimationFrame === "function";

function schedule(cb: (t: number) => void) {
  if (hasRaf) {
    rafId = requestAnimationFrame(cb);
  } else {
    timerId = setTimeout(() => cb(performance.now()), 16);
  }
}

function unschedule() {
  if (rafId !== null && hasRaf) cancelAnimationFrame(rafId);
  if (timerId !== null) clearTimeout(timerId);
  rafId = null;
  timerId = null;
}

function loop(timestamp: number) {
  if (!running || !engine) return;
  engine.frame(timestamp);
  schedule(loop);
}

function start() {
  if (running || !engine || !engine.ready()) return;
  running = true;
  schedule(loop);
}

function stop() {
  running = false;
  unschedule();
}

function applySize(width: number, height: number, dpr: number) {
  if (!canvas || !engine) return;
  if (width <= 0 || height <= 0) return;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  engine.resize(width, height, dpr);
}

self.onmessage = (event: MessageEvent<InboundMessage>) => {
  const msg = event.data;
  switch (msg.type) {
    case "init": {
      canvas = msg.canvas;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;
      engine = createLEDGridEngine(ctx);
      applySize(msg.width, msg.height, msg.dpr);
      // Paint one frame immediately so the grid is correct even while parked.
      engine.frame(performance.now());
      break;
    }
    case "resize":
      applySize(msg.width, msg.height, msg.dpr);
      if (engine && !running) engine.frame(performance.now());
      break;
    case "run":
      if (msg.running) start();
      else stop();
      break;
    case "dispose":
      stop();
      engine = null;
      canvas = null;
      break;
  }
};
