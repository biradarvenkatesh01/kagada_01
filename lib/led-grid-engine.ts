/**
 * LED pixel-grid simulation + renderer.
 *
 * Extracted from the component so the identical code can run either inside a
 * Web Worker against an OffscreenCanvas (the normal path) or on the main thread
 * as a fallback. The simulation is unchanged from the original implementation —
 * only its host moved.
 *
 * Why: profiling a 4x-CPU-throttled fast scroll showed this loop was responsible
 * for *all* remaining long tasks (25 tasks / 1467ms). Removing it took dropped
 * frames from 24.7% to 5.1%. It draws ~33k dots per frame, which is inherent to
 * the approved 8px-spaced grid look, so the work cannot be reduced without
 * changing the visual — but it can be moved off the main thread entirely.
 */

// ─── LED Pixel Configuration ───────────────────────────────────────────────
const GRID_SPACING = 8;
const DOT_SIZE = 1.2;
const BLOOM_SIZE = 3.5;

/** Sentinel written into the per-pixel bucket buffer for dots too dim to draw. */
const SKIP_BUCKET = 255;

// Opacity ranges — modestly boosted for enhanced luminous clarity
const BASE_OPACITY_MIN = 0.35;
const BASE_OPACITY_MAX = 0.52;

// Animated pixel targets (soft luminous highlights)
const DIM_TARGET_MIN = 0.14;
const DIM_TARGET_MAX = 0.25;
const BRIGHT_TARGET_MIN = 0.65;
const BRIGHT_TARGET_MAX = 0.78;

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
const TRAVEL_LENGTH = 72;
const TRAVEL_STEP_DELAY = 22;
const TRAVELS_PER_FIRE = 5;
const MAX_ACTIVE_TRAVELS = 65;

// Wave pulse: rapid expanding luminous ripples
const WAVE_INTERVAL_MIN = 450;
const WAVE_INTERVAL_MAX = 1000;
const WAVE_SPEED = 320;
const WAVE_WIDTH = 65;
const WAVE_MAX_RADIUS = 420;

// Sweep wave: diagonal flowing light wash across screen
const SWEEP_INTERVAL_MIN = 1000;
const SWEEP_INTERVAL_MAX = 2200;
const SWEEP_SPEED = 420;
const SWEEP_WIDTH = 90;

// Per-dot spontaneous animation chance
const ANIMATE_CHANCE = 0.0035;
const UPDATE_ANIMATE_CHANCE = 0.55;

// Warm white LED color (UNCHANGED)
const LED_R = 255;
const LED_G = 249;
const LED_B = 238;

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
  /**
   * Precomputed constants for the ambient undulation. The two wave terms are
   * sin/cos of (per-pixel phase ± time), and the per-pixel phase never changes,
   * so the angle-addition identity replaces two trig calls per pixel per frame
   * with four multiplies. Mathematically identical output.
   */
  sinA: number;
  cosA: number;
  sinB: number;
  cosB: number;
}

interface WavePulse {
  cx: number;
  cy: number;
  radius: number;
  maxRadius: number;
  speed: number;
}

interface SweepWave {
  progress: number;
  maxProgress: number;
  speed: number;
}

interface Travel {
  startCol: number;
  startRow: number;
  dirCol: number;
  dirRow: number;
  step: number;
  maxSteps: number;
  lastStepTime: number;
}

// ─── Precomputed Color Palette (zero string allocations at runtime) ──────────
const COLOR_LUT: string[] = [];
const BLOOM_LUT: string[] = [];
for (let i = 0; i <= 100; i++) {
  const alpha = i / 100;
  COLOR_LUT.push(`rgba(${LED_R},${LED_G},${LED_B},${alpha.toFixed(2)})`);
  BLOOM_LUT.push(`rgba(${LED_R},${LED_G},${LED_B},${(alpha * 0.22).toFixed(2)})`);
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}
function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export interface LEDGridEngine {
  /** Rebuild the grid for a new CSS-pixel size / device pixel ratio. */
  resize(width: number, height: number, dpr: number): void;
  /** Advance the simulation and paint one frame. */
  frame(timestamp: number): void;
  /** True once a grid has been built (i.e. resize() ran with a valid size). */
  ready(): boolean;
}

export function createLEDGridEngine(ctx: Ctx2D): LEDGridEngine {
  let pixels: LEDPixel[] = [];
  let cols = 0;
  let rows = 0;
  let cssW = 0;
  let cssH = 0;
  let dpr = 1;
  let lastTime = 0;

  let nextCluster = 0;
  let nextTravel = 0;
  let nextWave = 0;
  let nextSweep = 0;

  let travels: Travel[] = [];
  let waves: WavePulse[] = [];
  let sweeps: SweepWave[] = [];

  // Draw-batching scratch buffers (allocated per grid build, never per frame)
  let bucketOf = new Uint8Array(0);
  let sorted = new Int32Array(0);
  const counts = new Int32Array(101);
  const starts = new Int32Array(101);
  const cursor = new Int32Array(101);

  function returnToBase(p: LEDPixel, now: number) {
    p.targetOpacity = p.baseOpacity + rand(-0.04, 0.04);
    p.speed = rand(0.0003, 0.001);
    p.nextUpdate = now + rand(TWINKLE_MIN_INTERVAL, TWINKLE_MAX_INTERVAL);
    p.animating = false;
  }

  function animatePixel(p: LEDPixel, now: number, mode: "brighten" | "dim" | "random") {
    p.animating = true;
    if (mode === "brighten" || (mode === "random" && Math.random() < 0.55)) {
      p.targetOpacity = rand(BRIGHT_TARGET_MIN, BRIGHT_TARGET_MAX);
      p.speed = rand(0.0008, 0.003);
    } else {
      p.targetOpacity = rand(DIM_TARGET_MIN, DIM_TARGET_MAX);
      p.speed = rand(0.0006, 0.0018);
    }
    p.nextUpdate = now + rand(300, 1000);
  }

  function triggerCluster(now: number) {
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
  }

  const TRAVEL_DIRS = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1],
    [2, 1], [-2, 1], [1, 2], [-1, -2],
    [2, -1], [-2, -1], [1, -2], [-1, 2],
    [3, 1], [-3, 1], [1, 3], [-1, -3],
  ];

  function startTravel(now: number) {
    if (!cols || !rows) return;
    if (travels.length >= MAX_ACTIVE_TRAVELS) return;
    const [dirCol, dirRow] = TRAVEL_DIRS[randInt(0, TRAVEL_DIRS.length - 1)];
    travels.push({
      startCol: randInt(0, cols - 1),
      startRow: randInt(0, rows - 1),
      dirCol,
      dirRow,
      step: 0,
      maxSteps: randInt(Math.floor(TRAVEL_LENGTH * 0.5), TRAVEL_LENGTH),
      lastStepTime: now,
    });
  }

  function startWave() {
    waves.push({
      cx: rand(cssW * 0.1, cssW * 0.9),
      cy: rand(cssH * 0.1, cssH * 0.9),
      radius: 0,
      maxRadius: rand(WAVE_MAX_RADIUS * 0.6, WAVE_MAX_RADIUS),
      speed: rand(WAVE_SPEED * 0.8, WAVE_SPEED * 1.3),
    });
  }

  function startSweep() {
    sweeps.push({
      progress: 0,
      maxProgress: cssW + cssH * 0.8 + 100,
      speed: rand(SWEEP_SPEED * 0.85, SWEEP_SPEED * 1.25),
    });
  }

  function resize(width: number, height: number, nextDpr: number) {
    cssW = width;
    cssH = height;
    dpr = nextDpr;
    cols = Math.ceil(width / GRID_SPACING) + 1;
    rows = Math.ceil(height / GRID_SPACING) + 1;

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const next: LEDPixel[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const base = rand(BASE_OPACITY_MIN, BASE_OPACITY_MAX);
        const a = col * 0.075 + row * 0.038;
        const b = col * 0.042 - row * 0.065;
        next.push({
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
          sinA: Math.sin(a),
          cosA: Math.cos(a),
          sinB: Math.sin(b),
          cosB: Math.cos(b),
        });
      }
    }
    pixels = next;
    bucketOf = new Uint8Array(pixels.length);
    sorted = new Int32Array(pixels.length);

    nextCluster = now + rand(CLUSTER_INTERVAL_MIN, CLUSTER_INTERVAL_MAX);
    nextTravel = now + rand(TRAVEL_INTERVAL_MIN, TRAVEL_INTERVAL_MAX);
    nextWave = now + rand(WAVE_INTERVAL_MIN, WAVE_INTERVAL_MAX);
    nextSweep = now + rand(SWEEP_INTERVAL_MIN, SWEEP_INTERVAL_MAX);
    travels = [];
    waves = [];
    sweeps = [];
    lastTime = 0;
  }

  function frame(timestamp: number) {
    if (!pixels.length) return;

    const dt = lastTime ? Math.min(50, timestamp - lastTime) : 16;
    lastTime = timestamp;
    const len = pixels.length;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ── Wave pulses (expanding luminous ripples) ─────────────
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
            const waveBright = p.baseOpacity + influence * 0.2;
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

    // ── Sweep waves (diagonal flowing light wash) ─────────────
    for (let si = sweeps.length - 1; si >= 0; si--) {
      const sweep = sweeps[si];
      sweep.progress += sweep.speed * (dt / 1000);
      if (sweep.progress > sweep.maxProgress) {
        sweeps.splice(si, 1);
        continue;
      }
      const bandMin = sweep.progress - SWEEP_WIDTH;
      const bandMax = sweep.progress + SWEEP_WIDTH;
      const colStart = Math.max(0, Math.floor((bandMin - cssH * 0.8) / GRID_SPACING));
      const colEnd = Math.min(cols - 1, Math.ceil(bandMax / GRID_SPACING));

      for (let c = colStart; c <= colEnd; c++) {
        const pxX = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const diagPos = pxX + r * GRID_SPACING * 0.8;
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

    // ── Advance active travels (comet beams with trailing light) ─
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

        for (let tail = 0; tail <= 5; tail++) {
          const c = headCol - tr.dirCol * tail;
          const r = headRow - tr.dirRow * tail;
          if (c >= 0 && c < cols && r >= 0 && r < rows) {
            const p = pixels[r * cols + c];
            if (p) {
              p.animating = true;
              p.targetOpacity =
                tail === 0 ? 0.7 : tail === 1 ? 0.6 : tail === 2 ? 0.5 : tail === 3 ? 0.4 : tail === 4 ? 0.32 : 0.24;
              p.speed = 0.012;
              p.glowIntensity =
                tail === 0 ? 0.55 : tail === 1 ? 0.38 : tail === 2 ? 0.22 : tail === 3 ? 0.12 : tail === 4 ? 0.05 : 0;
              p.nextUpdate =
                timestamp + (tail === 0 ? 140 : tail === 1 ? 110 : tail === 2 ? 90 : tail === 3 ? 70 : tail === 4 ? 55 : 40);
            }
          }
        }

        const clearC = headCol - tr.dirCol * 6;
        const clearR = headRow - tr.dirRow * 6;
        if (clearC >= 0 && clearC < cols && clearR >= 0 && clearR < rows) {
          const clearP = pixels[clearR * cols + clearC];
          if (clearP && clearP.animating) returnToBase(clearP, timestamp);
        }
      }
    }

    // ── Update pixel states ──────────────────────────────────────────
    for (let i = 0; i < len; i++) {
      const p = pixels[i];
      const diff = p.targetOpacity - p.opacity;
      if (Math.abs(diff) > 0.001) {
        p.opacity += diff * Math.min(1, p.speed * dt * 4.8);
      } else {
        p.opacity = p.targetOpacity;
      }

      const glowTarget = p.opacity > 0.45 ? (p.opacity - 0.45) * 1.5 : 0;
      p.glowIntensity += (glowTarget - p.glowIntensity) * 0.15;

      if (timestamp >= p.nextUpdate) {
        if (p.animating) {
          returnToBase(p, timestamp);
        } else if (Math.random() < UPDATE_ANIMATE_CHANCE) {
          animatePixel(p, timestamp, "random");
        } else {
          p.targetOpacity = p.baseOpacity + rand(-0.04, 0.04);
          p.nextUpdate = timestamp + rand(TWINKLE_MIN_INTERVAL, TWINKLE_MAX_INTERVAL);
        }
      }
    }

    // ── Spontaneous pulses ───────────────────────────────────────────
    // Sampling the expected number of pixels gives the same distribution of
    // twinkles as testing every pixel, for ~100 RNG calls instead of ~33k.
    const spontaneousExpected = len * ANIMATE_CHANCE * (dt / 16);
    let spontaneousCount = Math.floor(spontaneousExpected);
    if (Math.random() < spontaneousExpected - spontaneousCount) spontaneousCount++;
    for (let s = 0; s < spontaneousCount; s++) {
      const p = pixels[(Math.random() * len) | 0];
      if (p && !p.animating) animatePixel(p, timestamp, "random");
    }

    if (timestamp >= nextCluster) {
      const count = randInt(1, CLUSTERS_PER_FIRE);
      for (let c = 0; c < count; c++) triggerCluster(timestamp);
      nextCluster = timestamp + rand(CLUSTER_INTERVAL_MIN, CLUSTER_INTERVAL_MAX);
    }
    if (timestamp >= nextTravel) {
      const count = randInt(1, TRAVELS_PER_FIRE);
      for (let t = 0; t < count; t++) startTravel(timestamp);
      nextTravel = timestamp + rand(TRAVEL_INTERVAL_MIN, TRAVEL_INTERVAL_MAX);
    }
    if (timestamp >= nextWave) {
      startWave();
      nextWave = timestamp + rand(WAVE_INTERVAL_MIN, WAVE_INTERVAL_MAX);
    }
    if (timestamp >= nextSweep) {
      startSweep();
      nextSweep = timestamp + rand(SWEEP_INTERVAL_MIN, SWEEP_INTERVAL_MAX);
    }

    // ── Render ───────────────────────────────────────────────────────
    ctx.clearRect(0, 0, cssW, cssH);

    const flowT = timestamp * 0.0035;
    const cosFlow = Math.cos(flowT);
    const sinFlow = Math.sin(flowT);
    const cosFlow2 = Math.cos(flowT * 0.75);
    const sinFlow2 = Math.sin(flowT * 0.75);

    // Bloom is rare (only actively-glowing pixels), so it stays a direct draw.
    for (let i = 0; i < len; i++) {
      const p = pixels[i];
      if (p.opacity < 0.005) continue;
      if (p.glowIntensity > 0.04) {
        const bloomIdx = Math.min(100, Math.max(0, (p.glowIntensity * 100) | 0));
        ctx.fillStyle = BLOOM_LUT[bloomIdx];
        ctx.fillRect(p.x - BLOOM_SIZE * 0.5, p.y - BLOOM_SIZE * 0.5, BLOOM_SIZE, BLOOM_SIZE);
      }
    }

    // Core dots, batched by opacity bucket via counting sort: 101 state changes
    // and 101 path fills instead of ~33k fillStyle assignments + fillRect calls.
    counts.fill(0);
    for (let i = 0; i < len; i++) {
      const p = pixels[i];
      if (p.opacity < 0.005) {
        bucketOf[i] = SKIP_BUCKET;
        continue;
      }
      let displayOpacity = p.opacity;
      if (!p.animating) {
        const wave1 = p.sinA * cosFlow - p.cosA * sinFlow;
        const wave2 = p.cosB * cosFlow2 - p.sinB * sinFlow2;
        displayOpacity = Math.min(0.78, Math.max(0.16, p.opacity + wave1 * 0.07 + wave2 * 0.04));
      }
      const opacityIdx = Math.min(100, Math.max(0, (displayOpacity * 100) | 0));
      bucketOf[i] = opacityIdx;
      counts[opacityIdx]++;
    }

    let running = 0;
    for (let b = 0; b <= 100; b++) {
      starts[b] = running;
      running += counts[b];
    }
    cursor.set(starts);
    for (let i = 0; i < len; i++) {
      const b = bucketOf[i];
      if (b === SKIP_BUCKET) continue;
      sorted[cursor[b]++] = i;
    }

    const half = DOT_SIZE * 0.5;
    for (let b = 0; b <= 100; b++) {
      const count = counts[b];
      if (count === 0) continue;
      ctx.fillStyle = COLOR_LUT[b];
      ctx.beginPath();
      const begin = starts[b];
      const end = begin + count;
      for (let k = begin; k < end; k++) {
        const p = pixels[sorted[k]];
        ctx.rect(p.x - half, p.y - half, DOT_SIZE, DOT_SIZE);
      }
      ctx.fill();
    }
  }

  return { resize, frame, ready: () => pixels.length > 0 };
}
