import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/sections/AboutSection";
import TracksSection from "@/components/sections/TracksSection";
import PrizePoolSection from "@/components/sections/PrizePoolSection";
import WinnersSection from "@/components/sections/WinnersSection";
import GallerySection from "@/components/sections/GallerySection";
import VideosSection from "@/components/sections/VideosSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import IntroExperience from "@/components/sections/IntroExperience";
import BurgundyTexturedBackground from "@/components/ui/burgundy-textured-background";
import BackToTop from "@/components/ui/back-to-top";
import OffscreenAnimationPause from "@/components/ui/marquee-auto-pause";

export default function Home() {
  return (
    // The height used to toggle between `h-screen overflow-hidden` and
    // `min-h-screen` when the intro video ended, which resized the document
    // from 100vh to ~10000px in one frame and forced a full relayout (plus a
    // Lenis re-measure) at the exact moment the hero faded in. The intro
    // overlay is a fixed, opaque, full-viewport layer, so keeping the height
    // static looks identical; scroll locking is done via body overflow instead.
    <main className="relative w-full bg-[#5A182B] overflow-x-hidden min-h-screen">
      <IntroExperience>
        {/* CONTINUOUS NON-HERO BURGUNDY TEXTURED CANVAS */}
        <div className="relative w-full overflow-hidden z-10">
          <BurgundyTexturedBackground />

          {/* SECTION 2: ABOUT US */}
          <AboutSection />

          {/* SECTION 3: TRACKS */}
          <TracksSection />

          {/* SECTION 4: PRIZE POOL */}
          <PrizePoolSection />

          {/* SECTION 5: PREVIOUS WINNERS */}
          <WinnersSection />

          {/* SECTION 6: GALLERY MARQUEE */}
          <GallerySection />

          {/* SECTION 7: AFTERMOVIES */}
          <VideosSection />

          {/* SECTION 8: SPONSORS */}
          <SponsorsSection />

          {/* SECTION 9: FAQ ACCORDION */}
          <FAQSection />

          {/* SECTION 10: CONTACT ORGANIZERS & MAP */}
          <ContactSection />

          {/* FOOTER */}
          <Footer />
        </div>
      </IntroExperience>

      {/* FLOATING BACK TO TOP BUTTON */}
      <BackToTop />

      {/* Pauses the gallery/sponsor marquees and the Tracks gear while they are
          off-screen. Mounted globally so those sections stay Server Components. */}
      <OffscreenAnimationPause />
    </main>
  );
}
