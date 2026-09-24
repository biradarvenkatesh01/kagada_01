"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface OrigamiConfig {
  stagger: number;
  durMin: number;
  durVar: number;
  density: number;
  jitter: number;
  focal: { x: number; y: number };
}

const PHONE_CFG: OrigamiConfig = {
  stagger: 4.2,
  durMin: 2.95,
  durVar: 0.95,
  density: 5.6,
  jitter: 0.3,
  focal: { x: 0.5, y: 0.66 },
};

const DESKTOP_CFG: OrigamiConfig = {
  stagger: 4.3,
  durMin: 2.9,
  durVar: 0.95,
  density: 7.5,
  jitter: 0.3,
  focal: { x: 0.5, y: 0.66 },
};

interface Point {
  x: number;
  y: number;
}

interface Piece {
  pts: Point[];
  cx: number;
  cy: number;
  d: number;
  rank: number;
  p: number;
  delay: number;
  dur: number;
  sx: number;
  sy: number;
  qx: number;
  qy: number;
  rot0: number;
  scale0: number;
  bx: number;
  by: number;
  bw: number;
  bh: number;
  tile: HTMLCanvasElement;
}

interface OrigamiIntroProps {
  onComplete: () => void;
}

export default function OrigamiIntro({ onComplete }: OrigamiIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Easing utilities
  const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
  const easeInOutCub = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
  const easeInOutSin = (t: number) => 0.5 * (1 - Math.cos(Math.PI * t));

  const handleFinish = useCallback(() => {
    if (hasSkipped) return;
    setHasSkipped(true);
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [hasSkipped, onComplete]);

  useEffect(() => {
    const stage = containerRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isMobile = window.innerWidth < 768;
    let CFG = isMobile ? PHONE_CFG : DESKTOP_CFG;
    const imgSrc = isMobile ? "/optimized/hero-bg-mobile-2x.webp" : "/optimized/hero-bg-desktop-2x.webp";

    const img = new Image();
    img.src = imgSrc;

    let animId = 0;
    let running = false;
    let ready = false;
    let start = 0;
    let seed = 0;
    let rng = Math.random;

    let W = 0;
    let H = 0;
    let DPR = 1;
    let cover = { s: 1, ox: 0, oy: 0, dw: 0, dh: 0 };
    let pieces: Piece[] = [];
    let order: number[] = [];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function seedRng(s: number) {
      let v = s >>> 0;
      rng = function () {
        v = (v + 0x6d2b79f5) | 0;
        let t = Math.imul(v ^ (v >>> 15), 1 | v);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    const rand = (a: number, b: number) => a + rng() * (b - a);

    function measure() {
      if (!stage || !canvas) return;
      const raw = window.devicePixelRatio || 1;
      DPR = Math.min(raw, 2);
      const rect = stage.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";

      const iw = img.naturalWidth || 1;
      const ih = img.naturalHeight || 1;
      const s = Math.max(W / iw, H / ih);
      const dw = iw * s;
      const dh = ih * s;
      const ox = (W - dw) / 2;
      const oy = (H - dh) / 2;
      cover = { s, ox, oy, dw, dh };
    }

    function buildMesh() {
      pieces = [];
      const target = Math.max(72, Math.min(W, H) / CFG.density);
      const cols = Math.min(20, Math.max(5, Math.round(W / target)));
      const rows = Math.min(24, Math.max(5, Math.round(H / target)));
      const cw = W / cols;
      const ch = H / rows;

      const V: Point[][] = [];
      for (let r = 0; r <= rows; r++) {
        V[r] = [];
        for (let c = 0; c <= cols; c++) {
          const edge = r === 0 || c === 0 || r === rows || c === cols;
          const jx = edge ? 0 : (rng() - 0.5) * cw * CFG.jitter;
          const jy = edge ? 0 : (rng() - 0.5) * ch * CFG.jitter;
          V[r][c] = {
            x: Math.max(0, Math.min(W, c * cw + jx)),
            y: Math.max(0, Math.min(H, r * ch + jy)),
          };
        }
      }

      const focal = {
        x: cover.ox + CFG.focal.x * cover.dw,
        y: cover.oy + CFG.focal.y * cover.dh,
      };
      const halfDiag = Math.hypot(W, H) / 2;

      const add = (a: Point, b: Point, c: Point) => {
        const cx = (a.x + b.x + c.x) / 3;
        const cy = (a.y + b.y + c.y) / 3;
        const d = Math.hypot(cx - focal.x, cy - focal.y);
        pieces.push({
          pts: [a, b, c],
          cx,
          cy,
          d,
          rank: 0,
          p: 0,
          delay: 0,
          dur: 0,
          sx: 0,
          sy: 0,
          qx: 0,
          qy: 0,
          rot0: 0,
          scale0: 0,
          bx: 0,
          by: 0,
          bw: 0,
          bh: 0,
          tile: null as unknown as HTMLCanvasElement,
        });
      };

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = V[r][c];
          const b = V[r][c + 1];
          const d = V[r + 1][c + 1];
          const e = V[r + 1][c];
          if ((r + c) % 2 === 0) {
            add(a, b, d);
            add(a, d, e);
          } else {
            add(a, b, e);
            add(b, d, e);
          }
        }
      }

      const byDist = pieces.map((_, i) => i).sort((i, j) => pieces[i].d - pieces[j].d);
      const last = Math.max(1, byDist.length - 1);
      byDist.forEach((origIdx, rank) => {
        pieces[origIdx].rank = rank / last;
      });

      for (const p of pieces) {
        bakeTile(p);
        planFlight(p, halfDiag);
      }

      order = pieces.map((_, i) => i);
    }

    function bakeTile(p: Piece) {
      const [a, b, c] = p.pts;
      const pad = 2;
      const bx = Math.floor(Math.min(a.x, b.x, c.x) - pad);
      const by = Math.floor(Math.min(a.y, b.y, c.y) - pad);
      const bw = Math.ceil(Math.max(a.x, b.x, c.x) + pad) - bx;
      const bh = Math.ceil(Math.max(a.y, b.y, c.y) + pad) - by;

      const tile = document.createElement("canvas");
      tile.width = Math.max(1, Math.round(bw * DPR));
      tile.height = Math.max(1, Math.round(bh * DPR));
      const g = tile.getContext("2d");
      if (!g) return;

      g.setTransform(DPR, 0, 0, DPR, 0, 0);
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = "high";

      const grow = 1.15;
      const out = p.pts.map((v) => {
        const dx = v.x - p.cx;
        const dy = v.y - p.cy;
        const m = Math.hypot(dx, dy) || 1;
        return {
          x: v.x + (dx / m) * grow - bx,
          y: v.y + (dy / m) * grow - by,
        };
      });

      g.beginPath();
      g.moveTo(out[0].x, out[0].y);
      g.lineTo(out[1].x, out[1].y);
      g.lineTo(out[2].x, out[2].y);
      g.closePath();
      g.clip();

      const { s, ox, oy } = cover;
      g.drawImage(img, ox - bx, oy - by, (img.naturalWidth || 1) * s, (img.naturalHeight || 1) * s);

      p.tile = tile;
      p.bx = bx;
      p.by = by;
      p.bw = bw;
      p.bh = bh;
    }

    function planFlight(p: Piece, halfDiag: number) {
      p.rot0 = rand(-2.2, 2.2);
      p.scale0 = rand(0.55, 0.85);

      const ang = Math.atan2(p.cy - H / 2, p.cx - W / 2) + rand(-0.42, 0.42);
      const dist = halfDiag * rand(1.1, 1.85);
      const sx = W / 2 + Math.cos(ang) * dist;
      const sy = H / 2 + Math.sin(ang) * dist;

      const mx = (sx + p.cx) / 2;
      const my = (sy + p.cy) / 2;
      const vx = p.cx - sx;
      const vy = p.cy - sy;
      const vl = Math.hypot(vx, vy) || 1;
      const bend = rand(-0.3, 0.3) * vl;
      const nx = -vy / vl;
      const ny = vx / vl;
      const qx = mx + nx * bend;
      const qy = my + ny * bend;

      p.sx = sx;
      p.sy = sy;
      p.qx = qx;
      p.qy = qy;
      p.delay = p.rank * CFG.stagger + rand(0, 0.3);
      p.dur = CFG.durMin + rng() * CFG.durVar;
    }

    function drawFinal() {
      if (!ctx) return;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.drawImage(img, cover.ox, cover.oy, cover.dw, cover.dh);
    }

    function frame(now: number) {
      if (!running || !ctx) return;
      const t = (now - start) / 1000;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);

      let landed = 0;
      for (const p of pieces) {
        p.p = clamp01((t - p.delay) / p.dur);
        if (p.p >= 1) landed++;
      }

      order.sort((i, j) => {
        const a = pieces[i].p;
        const b = pieces[j].p;
        if (a >= 1 && b >= 1) return i - j;
        if (a >= 1) return -1;
        if (b >= 1) return 1;
        return b - a;
      });

      for (const idx of order) {
        const p = pieces[idx];
        if (p.p <= 0 || !p.tile) continue;

        const e = 0.62 * easeInOutSin(p.p) + 0.38 * easeInOutCub(p.p);
        const e2 = easeOutQuint(clamp01(p.p * 1.12));
        const u = 1 - e;
        const k = 1 - e;

        const x = k * k * p.sx + 2 * k * e * p.qx + e * e * p.cx;
        const y = k * k * p.sy + 2 * k * e * p.qy + e * e * p.cy;

        const rot = p.rot0 * (1 - e2);
        const sc = p.scale0 + (1 - p.scale0) * e2;
        const lift = u * u;

        ctx.save();
        ctx.globalAlpha = Math.min(1, easeOutCubic(clamp01(p.p / 0.18)));
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(sc, sc);
        ctx.translate(-p.cx, -p.cy);
        if (lift > 0.004) {
          ctx.shadowColor = "rgba(72,52,30,0.30)";
          ctx.shadowBlur = 5 + lift * 30;
          ctx.shadowOffsetY = 2 + lift * 20;
        }
        ctx.drawImage(p.tile, p.bx, p.by, p.bw, p.bh);
        ctx.restore();
      }

      if (landed === pieces.length) {
        drawFinal();
        running = false;
        setIsDone(true);
        // Small graceful pause so user can admire the completed artwork before hero components arrive
        setTimeout(() => {
          handleFinish();
        }, 650);
        return;
      }
      animId = requestAnimationFrame(frame);
    }

    function play() {
      if (!ready) return;
      setIsDone(false);
      seed = (Math.random() * 1e9) | 0;
      seedRng(seed);
      measure();
      buildMesh();
      if (reduced) {
        drawFinal();
        setIsDone(true);
        handleFinish();
        return;
      }
      start = performance.now();
      running = true;
      animId = requestAnimationFrame(frame);
    }

    function boot() {
      ready = true;
      play();
    }

    if (img.complete && img.naturalWidth) {
      boot();
    } else {
      img.addEventListener("load", boot, { once: true });
    }

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nextIsMobile = window.innerWidth < 768;
        if (nextIsMobile !== isMobile) {
          isMobile = nextIsMobile;
          CFG = isMobile ? PHONE_CFG : DESKTOP_CFG;
          img.src = isMobile ? "/optimized/hero-bg-mobile-2x.webp" : "/optimized/hero-bg-desktop-2x.webp";
          return;
        }
        if (!ready) return;
        if (running) {
          seedRng(seed);
          measure();
          buildMesh();
        } else {
          measure();
          drawFinal();
        }
      }, 180);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleFinish]);

  return (
    <motion.div
      ref={containerRef}
      data-lenis-prevent="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      className={`fixed inset-0 w-full h-[100dvh] min-h-[100dvh] z-[99999] overflow-hidden bg-[#f3ede1] select-none touch-none ${
        isDone ? "origami-done" : ""
      }`}
    >
      {/* Seamless Pulp Paper Sheet Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: "#f3ede1",
          backgroundImage: `
            radial-gradient(ellipse 115% 85% at 50% 27%, rgba(255,252,244,.72), rgba(255,252,244,0) 66%),
            radial-gradient(ellipse 150% 115% at 50% 104%, rgba(146,120,84,.13), rgba(146,120,84,0) 58%),
            url("/textures/paper-pulp-tile.png")
          `,
          backgroundSize: "100% 100%, 100% 100%, 512px 512px",
          backgroundRepeat: "no-repeat, no-repeat, repeat",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 126% 110% at 50% 44%, transparent 64%, rgba(96,78,54,.11) 100%)",
          }}
        />
      </div>

      {/* Assembly Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full block transform transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isDone ? "scale(1)" : "scale(1.014)",
        }}
      />

      {/* Finishing Vignette & Grain */}
      <div
        className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply transition-opacity duration-[1400ms]"
        style={{
          opacity: isDone ? 0.04 : 0,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\' viewBox=\'0 0 160 160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.65\'/%3E%3C/svg%3E")',
        }}
      />
      <div
        className="absolute inset-0 z-21 pointer-events-none transition-opacity duration-[1600ms]"
        style={{
          opacity: isDone ? 1 : 0,
          background:
            "radial-gradient(ellipse at 50% 46%, transparent 58%, rgba(74,58,38,.16) 100%)",
        }}
      />

      {/* Top Right Skip Button (Architectural Square Style) */}
      <button
        onClick={handleFinish}
        type="button"
        className="intro-skip-btn absolute top-6 right-6 z-30 px-3.5 py-1.5 min-[360px]:px-4 min-[360px]:py-2 !rounded-none bg-[#F5F0E6] text-[#5A182B] border-2 border-[#5A182B]/30 hover:border-[#5A182B] shadow-md transition-all duration-200 cursor-pointer flex items-center gap-2 group hover:bg-white"
        aria-label="Skip intro animation"
      >
        <span className="font-roboto-mono text-xs font-bold uppercase tracking-wider text-[#5A182B]">
          Skip
        </span>
        <span className="text-[#5A182B] text-xs transition-transform duration-200 group-hover:translate-x-0.5">
          &rarr;
        </span>
      </button>
    </motion.div>
  );
}
