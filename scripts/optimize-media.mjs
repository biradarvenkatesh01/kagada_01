/**
 * One-shot media optimisation for the public/ video assets.
 *
 * The source files were exported at wildly excessive bitrates (the 8s intro was
 * encoded at 22.5 Mbps — higher than Blu-ray — for 23.7 MB). Re-encoding at a
 * sane CRF keeps the same resolution, duration and footage while cutting the
 * transfer by roughly an order of magnitude.
 *
 * Also emits audio-stripped "preview" variants for the aftermovie cards, which
 * render the clips muted and looping — the audio track in those is downloaded
 * but can never be heard.
 *
 * Run with: npm run optimize:media
 */
import { execFileSync } from "node:child_process";
import { statSync, renameSync, existsSync } from "node:fs";
import { join } from "node:path";
import ffmpegPath from "ffmpeg-static";

const PUBLIC_DIR = join(process.cwd(), "public");
const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2) + " MB";

/** @type {{src:string,out:string,args:string[],label:string}[]} */
const JOBS = [
  {
    // Full-screen autoplaying intro. Portrait 1080x1920 is genuinely needed
    // (object-cover upscales it to 1440px wide on a desktop viewport), so the
    // resolution is preserved and only the absurd bitrate is corrected.
    src: "video-intro.mp4",
    out: "video-intro.opt.mp4",
    label: "intro (full-screen, has audio)",
    args: [
      "-c:v", "libx264", "-preset", "slow", "-crf", "24",
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-maxrate", "4M", "-bufsize", "8M",
      "-c:a", "aac", "-b:a", "128k",
      "-movflags", "+faststart",
    ],
  },
  {
    src: "kagada2024.mp4",
    out: "kagada2024.opt.mp4",
    label: "aftermovie 2024 (modal playback, keeps audio)",
    args: [
      "-c:v", "libx264", "-preset", "slow", "-crf", "26",
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "96k",
      "-movflags", "+faststart",
    ],
  },
  {
    src: "kagada2025.mp4",
    out: "kagada2025.opt.mp4",
    label: "aftermovie 2025 (modal playback, keeps audio)",
    args: [
      "-c:v", "libx264", "-preset", "slow", "-crf", "26",
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "96k",
      "-movflags", "+faststart",
    ],
  },
  {
    // Card previews: same footage and duration, but muted+looping in the UI, so
    // the audio track is pure waste. Encoded harder since it renders into a
    // ~490px-wide card.
    src: "kagada2024.mp4",
    out: "kagada2024-preview.mp4",
    label: "aftermovie 2024 card preview (silent)",
    args: [
      "-an",
      "-c:v", "libx264", "-preset", "slow", "-crf", "30",
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
    ],
  },
  {
    src: "kagada2025.mp4",
    out: "kagada2025-preview.mp4",
    label: "aftermovie 2025 card preview (silent)",
    args: [
      "-an",
      "-c:v", "libx264", "-preset", "slow", "-crf", "30",
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
    ],
  },
];

let before = 0;
let after = 0;

for (const job of JOBS) {
  const src = join(PUBLIC_DIR, job.src);
  const out = join(PUBLIC_DIR, job.out);
  if (!existsSync(src)) {
    console.log(`skip ${job.src} (missing)`);
    continue;
  }
  const srcSize = statSync(src).size;
  process.stdout.write(`encoding ${job.label} ... `);
  execFileSync(ffmpegPath, ["-y", "-i", src, ...job.args, out], {
    stdio: ["ignore", "ignore", "ignore"],
  });
  const outSize = statSync(out).size;
  console.log(`${mb(src)} -> ${mb(out)}  (${(100 - (outSize / srcSize) * 100).toFixed(1)}% smaller)`);
  before += srcSize;
  after += outSize;
}

// Replace the originals with the re-encoded masters.
for (const name of ["video-intro", "kagada2024", "kagada2025"]) {
  const opt = join(PUBLIC_DIR, `${name}.opt.mp4`);
  if (existsSync(opt)) renameSync(opt, join(PUBLIC_DIR, `${name}.mp4`));
}

console.log(
  `\nTotal: ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB`
);
