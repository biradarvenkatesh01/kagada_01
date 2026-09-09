"use client";

import { useEffect, useRef, useCallback, memo } from "react";

// ─── LED Pixel Configuration ───────────────────────────────────────────────
const GRID_SPACING = 8;
const DOT_SIZE = 1.1;
const BLOOM_SIZE = 3.2;

// Opacity ranges — softened visible field for balanced, elegant brightness
const BASE_OPACITY_MIN = 0.28;
const BASE_OPACITY_MAX = 0.42;

// Animated pixel targets (softened luminous highlights)
const DIM_TARGET_MIN = 0.10;
const DIM_TARGET_MAX = 0.20;
const BRIGHT_TARGET_MIN = 0.52;
const BRIGHT_TARGET_MAX = 0.65;

// ─── Animation Frequency & Dynamic Movement ──────────────────────────────
const TWINKLE_MIN_INTERVAL = 150;
const TWINKLE_MAX_INTERVAL = 800;

// Clusters: frequent burst groupings
const CLUSTER_INTERVAL_MIN = 180;
const CLUSTER_INTERVAL_MAX = 500;
const CLUSTER_RADIUS = 56;
const CLUSTER_DOT_COUNT = 18;
const CLUSTERS_PER_FIRE = 5;

// Travels: rapid streaming comet beams darting across the grid
const TRAVEL_INTERVAL_MIN = 50;
const TRAVEL_INTERVAL_MAX = 150;
const TRAVEL_LENGTH = 72;           // long journeys across screen (~570px)
const TRAVEL_STEP_DELAY = 22;       // swift 22ms per step
const TRAVELS_PER_FIRE = 5;         // 5 streams spawn concurrently
const MAX_ACTIVE_TRAVELS = 65;      // up to 65 streams actively gliding simultaneously

// Wave pulse: rapid expanding luminous ripples
const WAVE_INTERVAL_MIN = 450;
const WAVE_INTERVAL_MAX = 1000;
const WAVE_SPEED = 320;             // swift expanding ripples
const WAVE_WIDTH = 65;              // wide visible ring
const WAVE_MAX_RADIUS = 420;

// Sweep wave: diagonal flowing light wash across screen
const SWEEP_INTERVAL_MIN = 1000;
const SWEEP_INTERVAL_MAX = 2200;
const SWEEP_SPEED = 420;            // swift wash
const SWEEP_WIDTH = 90;             // broad luminous wave band

// Per-dot spontaneous animation chance
const ANIMATE_CHANCE = 0.0035;
const UPDATE_ANIMATE_CHANCE = 0.55;

// Warm white LED color (UNCHANGED)
const LED_R = 255;
const LED_G = 249;
const LED_B = 238;

// ─── Types ─────────────────────────────────────────────────────────────────
interface LEDPixel {
  x: number;
  y: number;
  col: number;
  row: number;
  baseOpacity: number;
  opacity: number;
  targetOpacity: number;
  speed: number;
  nextUpdate: number;
  glowIntensity: number;
  animating: boolean;
}

interface WavePulse {
  cx: number;
  cy: number;
  radius: number;
  maxRadius: number;
  speed: number;
  startTime: number;
}

interface SweepWave {
  progress: number;
  maxProgress: number;
  speed: number;
  startTime: number;
}

// ─── Precomputed Color Palette (zero string allocations at runtime) ──────────
const COLOR_LUT: string[] = [];
const BLOOM_LUT: string[] = [];
for (let i = 0; i <= 100; i++) {
  const alpha = i / 100;
  COLOR_LUT.push(`rgba(${LED_R},${LED_G},${LED_B},${alpha.toFixed(2)})`);
  BLOOM_LUT.push(`rgba(${LED_R},${LED_G},${LED_B},${(alpha * 0.18).toFixed(2)})`);
}

// ─── Utility ───────────────────────────────────────────────────────────────
function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}
function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// ─── Component ─────────────────────────────────────────────────────────────
function LEDPixelGridInner({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<LEDPixel[]>([]);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const nextClusterRef = useRef(0);
  const nextTravelRef = useRef(0);
  const nextWaveRef = useRef(0);
  const nextSweepRef = useRef(0);
  const isVisibleRef = useRef(true);
  const activeTravelsRef = useRef<{
    startCol: number;
    startRow: number;
    dirCol: number;
    dirRow: number;
    step: number;
    maxSteps: number;
    lastStepTime: number;
  }[]>([]);
  const activeWavesRef = useRef<WavePulse[]>([]);
  const activeSweepsRef = useRef<SweepWave[]>([]);

  const buildGrid = useCallback((w: number, h: number) => {
    const cols = Math.ceil(w / GRID_SPACING) + 1;
    const rows = Math.ceil(h / GRID_SPACING) + 1;
    colsRef.current = cols;
    rowsRef.current = rows;

    const now = performance.now();
    const pixels: LEDPixel[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const base = rand(BASE_OPACITY_MIN, BASE_OPACITY_MAX);
        pixels.push({
          x: col * GRID_SPACING,
          y: row * GRID_SPACING,
          col,
          row,
          baseOpacity: base,
          opacity: base,
          targetOpacity: base,
          speed: rand(0.0006, 0.0018),
          nextUpdate: now + rand(200, TWINKLE_MAX_INTERVAL),
          glowIntensity: 0,
          animating: false,
        });
      }
    }

    pixelsRef.current = pixels;
    nextClusterRef.current = now + rand(CLUSTER_INTERVAL_MIN, CLUSTER_INTERVAL_MAX);
    nextTravelRef.current = now + rand(TRAVEL_INTERVAL_MIN, TRAVEL_INTERVAL_MAX);
    nextWaveRef.current = now + rand(WAVE_INTERVAL_MIN, WAVE_INTERVAL_MAX);
    nextSweepRef.current = now + rand(SWEEP_INTERVAL_MIN, SWEEP_INTERVAL_MAX);
    activeTravelsRef.current = [];
    activeWavesRef.current = [];
    activeSweepsRef.current = [];
  }, []);

  const returnToBase = useCallback((p: LEDPixel, now: number) => {
    p.targetOpacity = p.baseOpacity + rand(-0.04, 0.04);
    p.speed = rand(0.0003, 0.001);
    p.nextUpdate = now + rand(TWINKLE_MIN_INTERVAL, TWINKLE_MAX_INTERVAL);
    p.animating = false;
  }, []);

  const animatePixel = useCallback((p: LEDPixel, now: number, mode: "brighten" | "dim" | "random") => {
    p.animating = true;
    if (mode === "brighten" || (mode === "random" && Math.random() < 0.55)) {
      p.targetOpacity = rand(BRIGHT_TARGET_MIN, BRIGHT_TARGET_MAX);
      p.speed = rand(0.0008, 0.003);
    } else {
      p.targetOpacity = rand(DIM_TARGET_MIN, DIM_TARGET_MAX);
      p.speed = rand(0.0006, 0.0018);
    }
    p.nextUpdate = now + rand(300, 1000);
  }, []);

  const triggerCluster = useCallback((now: number) => {
    const pixels = pixelsRef.current;
    if (!pixels.length) return;
    const center = pixels[randInt(0, pixels.length - 1)];
    let count = 0;
    for (const p of pixels) {
      if (count >= CLUSTER_DOT_COUNT) break;
      const d = dist(p.x, p.y, center.x, center.y);
      if (d < CLUSTER_RADIUS && Math.random() < 0.45) {
        animatePixel(p, now, Math.random() < 0.7 ? "brighten" : "dim");
        count++;
      }
    }
  }, [animatePixel]);

  const startTravel = useCallback((now: number) => {
    const cols = colsRef.current;
    const rows = rowsRef.current;
    if (!cols || !rows) return;
    if (activeTravelsRef.current.length >= MAX_ACTIVE_TRAVELS) return;

    const startCol = randInt(0, cols - 1);
    const startRow = randInt(0, rows - 1);
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [-1, -1], [1, -1], [-1, 1],
      [2, 1], [-2, 1], [1, 2], [-1, -2],
      [2, -1], [-2, -1], [1, -2], [-1, 2],
      [3, 1], [-3, 1], [1, 3], [-1, -3],
    ];
    const [dirCol, dirRow] = dirs[randInt(0, dirs.length - 1)];
    activeTravelsRef.current.push({
      startCol, startRow, dirCol, dirRow,
      step: 0,
      maxSteps: randInt(Math.floor(TRAVEL_LENGTH * 0.5), TRAVEL_LENGTH),
      lastStepTime: now,
    });
  }, []);

  const startWave = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    activeWavesRef.current.push({
      cx: rand(w * 0.1, w * 0.9),
      cy: rand(h * 0.1, h * 0.9),
      radius: 0,
      maxRadius: rand(WAVE_MAX_RADIUS * 0.6, WAVE_MAX_RADIUS),
      speed: rand(WAVE_SPEED * 0.8, WAVE_SPEED * 1.3),
      startTime: now,
    });
  }, []);

  const startSweep = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    activeSweepsRef.current.push({
      progress: 0,
      maxProgress: w + h * 0.8 + 100,
      speed: rand(SWEEP_SPEED * 0.85, SWEEP_SPEED * 1.25),
      startTime: now,
    });
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!isVisibleRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dt = lastTimeRef.current ? Math.min(50, timestamp - lastTimeRef.current) : 16;
    lastTimeRef.current = timestamp;

    const pixels = pixelsRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const len = pixels.length;
    const cols = colsRef.current;
    const rows = rowsRef.current;

    // ── Update wave pulses (expanding luminous ripples) ─────────────
    const waves = activeWavesRef.current;
    for (let wi = waves.length - 1; wi >= 0; wi--) {
      const wave = waves[wi];
      wave.radius += wave.speed * (dt / 1000);
      if (wave.radius > wave.maxRadius) {
        waves.splice(wi, 1);
        continue;
      }

      const rMax = wave.radius + WAVE_WIDTH;
      const colStart = Math.max(0, Math.floor((wave.cx - rMax) / GRID_SPACING));
      const colEnd = Math.min(cols - 1, Math.ceil((wave.cx + rMax) / GRID_SPACING));
      const rowStart = Math.max(0, Math.floor((wave.cy - rMax) / GRID_SPACING));
      const rowEnd = Math.min(rows - 1, Math.ceil((wave.cy + rMax) / GRID_SPACING));

      for (let r = rowStart; r <= rowEnd; r++) {
        const rowOffset = r * cols;
        for (let c = colStart; c <= colEnd; c++) {
          const p = pixels[rowOffset + c];
          if (!p || p.animating) continue;
          const d = dist(p.x, p.y, wave.cx, wave.cy);
          const ringDist = Math.abs(d - wave.radius);
          if (ringDist < WAVE_WIDTH) {
            const influence = 1 - ringDist / WAVE_WIDTH;
            const waveBright = p.baseOpacity + influence * 0.20;
            if (waveBright > p.targetOpacity) {
              p.targetOpacity = waveBright;
              p.speed = rand(0.003, 0.007);
              p.nextUpdate = timestamp + rand(160, 420);
              p.animating = true;
            }
          }
        }
      }
    }

    // ── Update sweep waves (diagonal flowing light wash) ─────────────
    const sweeps = activeSweepsRef.current;
    for (let si = sweeps.length - 1; si >= 0; si--) {
      const sweep = sweeps[si];
      sweep.progress += sweep.speed * (dt / 1000);
      if (sweep.progress > sweep.maxProgress) {
        sweeps.splice(si, 1);
        continue;
      }

      // Sweep coordinates: diagonal band (x + y * 0.8)
      const bandMin = sweep.progress - SWEEP_WIDTH;
      const bandMax = sweep.progress + SWEEP_WIDTH;
      const colStart = Math.max(0, Math.floor((bandMin - h * 0.8) / GRID_SPACING));
      const colEnd = Math.min(cols - 1, Math.ceil(bandMax / GRID_SPACING));

      for (let c = colStart; c <= colEnd; c++) {
        const pxX = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const diagPos = pxX + (r * GRID_SPACING) * 0.8;
          const bandDist = Math.abs(diagPos - sweep.progress);
          if (bandDist < SWEEP_WIDTH) {
            const p = pixels[r * cols + c];
            if (p && !p.animating) {
              const inf = 1 - bandDist / SWEEP_WIDTH;
              const bright = p.baseOpacity + inf * 0.18;
              if (bright > p.targetOpacity) {
                p.targetOpacity = bright;
                p.speed = rand(0.003, 0.006);
                p.nextUpdate = timestamp + rand(140, 360);
                p.animating = true;
              }
            }
          }
        }
      }
    }

    // ── Advance active travels (crisp comet beams with trailing light) ─
    const travels = activeTravelsRef.current;
    for (let t = travels.length - 1; t >= 0; t--) {
      const tr = travels[t];
      if (timestamp - tr.lastStepTime >= TRAVEL_STEP_DELAY) {
        tr.step++;
        tr.lastStepTime = timestamp;
        if (tr.step > tr.maxSteps) {
          travels.splice(t, 1);
          continue;
        }

        const headCol = tr.startCol + tr.dirCol * tr.step;
        const headRow = tr.startRow + tr.dirRow * tr.step;

        // Animate head and 5 fading comet tail steps
        for (let tail = 0; tail <= 5; tail++) {
          const c = headCol - tr.dirCol * tail;
          const r = headRow - tr.dirRow * tail;
          if (c >= 0 && c < cols && r >= 0 && r < rows) {
            const p = pixels[r * cols + c];
            if (p) {
              p.animating = true;
              p.targetOpacity = tail === 0 ? 0.70 : tail === 1 ? 0.60 : tail === 2 ? 0.50 : tail === 3 ? 0.40 : tail === 4 ? 0.32 : 0.24;
              p.speed = 0.012;
              p.glowIntensity = tail === 0 ? 0.55 : tail === 1 ? 0.38 : tail === 2 ? 0.22 : tail === 3 ? 0.12 : tail === 4 ? 0.05 : 0;
              p.nextUpdate = timestamp + (tail === 0 ? 140 : tail === 1 ? 110 : tail === 2 ? 90 : tail === 3 ? 70 : tail === 4 ? 55 : 40);
            }
          }
        }

        // Clean up tail trail behind
        const clearC = headCol - tr.dirCol * 6;
        const clearR = headRow - tr.dirRow * 6;
        if (clearC >= 0 && clearC < cols && clearR >= 0 && clearR < rows) {
          const clearP = pixels[clearR * cols + clearC];
          if (clearP && clearP.animating) {
            returnToBase(clearP, timestamp);
          }
        }
      }
    }

    // ── Update pixel states ──────────────────────────────────────────
    for (let i = 0; i < len; i++) {
      const p = pixels[i];

      // Fast, fluid opacity transition
      const diff = p.targetOpacity - p.opacity;
      if (Math.abs(diff) > 0.001) {
        p.opacity += diff * Math.min(1, p.speed * dt * 4.8);
      } else {
        p.opacity = p.targetOpacity;
      }

      // Glow tracks brightness above base
      const glowTarget = p.opacity > 0.45 ? (p.opacity - 0.45) * 1.5 : 0;
      p.glowIntensity += (glowTarget - p.glowIntensity) * 0.15;

      // When nextUpdate fires:
      if (timestamp >= p.nextUpdate) {
        if (p.animating) {
          returnToBase(p, timestamp);
        } else {
          if (Math.random() < UPDATE_ANIMATE_CHANCE) {
            animatePixel(p, timestamp, "random");
          } else {
            p.targetOpacity = p.baseOpacity + rand(-0.04, 0.04);
            p.nextUpdate = timestamp + rand(TWINKLE_MIN_INTERVAL, TWINKLE_MAX_INTERVAL);
          }
        }
      }

      // Spontaneous pulse
      if (!p.animating && Math.random() < ANIMATE_CHANCE * (dt / 16)) {
        animatePixel(p, timestamp, "random");
      }
    }

    // ── Cluster events (bursts of grouped activity) ───────────────────
    if (timestamp >= nextClusterRef.current) {
      const count = randInt(1, CLUSTERS_PER_FIRE);
      for (let c = 0; c < count; c++) {
        triggerCluster(timestamp);
      }
      nextClusterRef.current = timestamp + rand(CLUSTER_INTERVAL_MIN, CLUSTER_INTERVAL_MAX);
    }

    // ── Travel sequences (multiple comet beams gliding across screen) ──
    if (timestamp >= nextTravelRef.current) {
      const count = randInt(1, TRAVELS_PER_FIRE);
      for (let t = 0; t < count; t++) {
        startTravel(timestamp);
      }
      nextTravelRef.current = timestamp + rand(TRAVEL_INTERVAL_MIN, TRAVEL_INTERVAL_MAX);
    }

    // ── Wave pulses (expanding ripples) ──────────────────────────────
    if (timestamp >= nextWaveRef.current) {
      startWave(timestamp);
      nextWaveRef.current = timestamp + rand(WAVE_INTERVAL_MIN, WAVE_INTERVAL_MAX);
    }

    // ── Sweep waves (diagonal flowing light wash) ─────────────────────
    if (timestamp >= nextSweepRef.current) {
      startSweep(timestamp);
      nextSweepRef.current = timestamp + rand(SWEEP_INTERVAL_MIN, SWEEP_INTERVAL_MAX);
    }

    // ── Render with Precomputed LUT (Zero garbage collection) ───────
    ctx.clearRect(0, 0, w, h);

    // Continuous flowing ambient matrix current (gentle rhythmic diagonal and cross-wave undulation)
    const flowT = timestamp * 0.0035;

    for (let i = 0; i < len; i++) {
      const p = pixels[i];
      if (p.opacity < 0.005) continue;

      let displayOpacity = p.opacity;
      if (!p.animating) {
        // Continuous dual wave undulation across the whole background
        const wave1 = Math.sin(p.col * 0.075 + p.row * 0.038 - flowT);
        const wave2 = Math.cos(p.col * 0.042 - p.row * 0.065 + flowT * 0.75);
        const combinedWave = wave1 * 0.07 + wave2 * 0.04;
        displayOpacity = Math.min(0.65, Math.max(0.12, p.opacity + combinedWave));
      }

      // Subtle bloom for bright pixels
      if (p.glowIntensity > 0.04) {
        const bloomIdx = Math.min(100, Math.max(0, (p.glowIntensity * 100) | 0));
        ctx.fillStyle = BLOOM_LUT[bloomIdx];
        ctx.fillRect(
          p.x - BLOOM_SIZE * 0.5,
          p.y - BLOOM_SIZE * 0.5,
          BLOOM_SIZE,
          BLOOM_SIZE
        );
      }

      // Core LED micro-dot
      const opacityIdx = Math.min(100, Math.max(0, (displayOpacity * 100) | 0));
      ctx.fillStyle = COLOR_LUT[opacityIdx];
      ctx.fillRect(
        p.x - DOT_SIZE * 0.5,
        p.y - DOT_SIZE * 0.5,
        DOT_SIZE,
        DOT_SIZE
      );
    }

    animRef.current = requestAnimationFrame(animate);
  }, [returnToBase, animatePixel, triggerCluster, startTravel, startWave, startSweep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (ctx) ctx.scale(dpr, dpr);
      buildGrid(rect.width, rect.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    lastTimeRef.current = 0;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // IntersectionObserver: automatically sleep animation when off-screen to save 100% CPU
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisibleRef.current = true;
          lastTimeRef.current = performance.now();
          cancelAnimationFrame(animRef.current);
          if (!prefersReducedMotion) {
            animRef.current = requestAnimationFrame(animate);
          } else {
            // Render single static frame for reduced motion users
            animate(performance.now());
          }
        } else {
          isVisibleRef.current = false;
          cancelAnimationFrame(animRef.current);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    if (!prefersReducedMotion) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      animate(performance.now());
    }

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, [buildGrid, animate]);

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
