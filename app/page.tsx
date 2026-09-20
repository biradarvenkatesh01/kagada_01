import OrigamiHeroExperience from "@/components/features/OrigamiHeroExperience";
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
import BurgundyTexturedBackground from "@/components/ui/burgundy-textured-background";
import BackToTop from "@/components/ui/back-to-top";
import OffscreenAnimationPause from "@/components/ui/marquee-auto-pause";

export default function Home() {
  return (
    <main className="relative w-full bg-[#5A182B] overflow-x-hidden min-h-screen">
      {/* Fixed Textured Burgundy Wallpaper (Completely detached from section height changes) */}
      <BurgundyTexturedBackground />

      {/* Responsive Origami Intro & Hero Experience (with same-tab reload guard) */}
      <OrigamiHeroExperience />

      {/* CONTINUOUS NON-HERO SECTIONS */}
      <div className="relative w-full overflow-hidden z-10">
        {/* Smooth Top Dissolve from Hero into Burgundy Sections */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-44 pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(35, 5, 11, 0.65) 0%, rgba(55, 8, 17, 0.25) 50%, transparent 100%)",
          }}
        />

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
 
      {/* FLOATING BACK TO TOP BUTTON */}
      <BackToTop />

      {/* Pauses the gallery/sponsor marquees and the Tracks gear while they are
          off-screen. Mounted globally so those sections stay Server Components. */}
      <OffscreenAnimationPause />
    </main>
  );
}
