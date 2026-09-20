/**
 * BurgundyTexturedBackground
 * 
 * Recreates a rich, tactile, handmade burgundy paper / fabric surface
 * inspired by the provided reference texture.
 * 
 * 4 Layers:
 * - Layer A: Base deep burgundy / maroon continuous gradient covering all non-hero sections
 * - Layer B: Asymmetrical tonal clouds with a 135° diagonal raking light flow
 * - Layer C: Code-generated woven cotton fabric weave texture
 * - Layer D: Soft lateral edge vignettes & gentle top dissolve from Hero
 */
export function BurgundyTexturedBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
      style={{
        backgroundColor: "#5A182B",
        // NOTE: deliberately NOT GPU-promoted. This element spans the full
        // height of every non-hero section (~9000px+), which exceeds the max
        // GPU texture dimension. Forcing it onto its own layer made the
        // compositor tile it and re-read the backdrop for each mix-blend
        // child, producing blank/white tiles during fast scrolling.
        // `isolation: isolate` keeps the identical blend group that
        // `contain: paint` used to provide, without allocating a layer.
        isolation: "isolate",
      }}
    >
      {/* ── Layer A: Base Rich Deep Burgundy Maroon Surface (#5A182B) ── */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(
            180deg,
            #440f1d 0%,
            #5A182B 12%,
            #681b32 25%,
            #5A182B 40%,
            #6b1d34 58%,
            #5A182B 72%,
            #641a30 85%,
            #400e1b 100%
          )`,
        }}
      />

      {/* ── Layer B1: 135° Diagonal Raking Light (Top-Right illumination to Bottom-Left deep wine shadows) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(180, 42, 64, 0.28) 0%,
            rgba(152, 30, 52, 0.16) 25%,
            rgba(110, 20, 36, 0.05) 50%,
            rgba(45, 6, 14, 0.22) 75%,
            rgba(28, 4, 9, 0.42) 100%
          )`,
        }}
      />

      {/* ── Layer B2: Organic Asymmetrical Ambient Clouds ─────────────── */}
      <div
        className="absolute inset-0 w-full h-full opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 45% at 85% 15%, rgba(188, 48, 72, 0.22) 0%, transparent 65%),
            radial-gradient(ellipse 70% 35% at 15% 35%, rgba(55, 7, 16, 0.35) 0%, transparent 60%),
            radial-gradient(ellipse 85% 40% at 80% 55%, rgba(180, 40, 62, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 75% 35% at 20% 75%, rgba(48, 6, 14, 0.32) 0%, transparent 60%),
            radial-gradient(ellipse 90% 45% at 75% 92%, rgba(175, 38, 58, 0.20) 0%, transparent 65%)
          `,
        }}
      />

      {/* ── Layer C: Code-Generated Woven Cotton Fabric Weave Texture ── */}
      <div className="absolute inset-0 w-full h-full opacity-65 kagada-fabric-bg-texture" />

      {/* ── Layer D1: Smooth Top Transition from Hero Section ───────── */}
      <div
        className="absolute top-0 inset-x-0 h-44 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(35, 5, 11, 0.65) 0%, rgba(55, 8, 17, 0.25) 50%, transparent 100%)",
        }}
      />

      {/* ── Layer D2: Soft Lateral Vignette (Subtle edge depth) ──────── */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: `linear-gradient(
            90deg,
            rgba(24, 3, 7, 0.38) 0%,
            rgba(24, 3, 7, 0.12) 4%,
            transparent 10%,
            transparent 90%,
            rgba(24, 3, 7, 0.12) 96%,
            rgba(24, 3, 7, 0.38) 100%
          )`,
        }}
      />
    </div>
  );
}

export default BurgundyTexturedBackground;
