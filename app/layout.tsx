import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Outfit, Roboto_Mono } from "next/font/google";
import SmoothScroll from "@/components/ui/smooth-scroll";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kagada2026.live"),
  title: "KAGADA 2026",
  description:
    "What is KAGADA and when is it? KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 24th October, 2026 at UVCE, Bengaluru.",
  keywords: [
    "KAGADA",
    "KAGADA 2026",
    "IEEE UVCE",
    "UVCE Conference",
    "Paper Presentation",
    "Poster Presentation",
    "Project Competition",
    "Bengaluru Engineering Conference",
  ],
  authors: [{ name: "IEEE UVCE Software Development SIG" }],
  openGraph: {
    title: "KAGADA 2026",
    description:
      "What is KAGADA and when is it? KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 24th October, 2026 at UVCE, Bengaluru.",
    url: "https://kagada2026.live",
    siteName: "KAGADA 2026",
    images: [
      {
        url: "/logo1.png",
        width: 1200,
        height: 630,
        alt: "KAGADA 2026 Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAGADA 2026",
    description:
      "What is KAGADA and when is it? KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 24th October, 2026 at UVCE, Bengaluru.",
    images: ["/logo1.png"],
  },
  alternates: {
    canonical: "https://kagada2026.live",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KAGADA 2026",
    alternateName: ["Kagada", "Kagada 2026", "IEEE UVCE Kagada"],
    url: "https://kagada2026.live/",
  },
  {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: "KAGADA 2026",
    description:
      "What is KAGADA and when is it? KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 24th October, 2026 at UVCE, Bengaluru.",
    startDate: "2026-10-24T09:00:00+05:30",
    endDate: "2026-10-24T18:00:00+05:30",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "University Visvesvaraya College of Engineering (UVCE)",
      address: {
        "@type": "PostalAddress",
        streetAddress: "K.R. Circle",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        postalCode: "560001",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "IEEE UVCE",
      url: "https://ieeeuvce.org",
      logo: "https://kagada2026.live/icon-192.png",
    },
    image: "https://kagada2026.live/logo1.png",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IEEE UVCE",
    url: "https://ieeeuvce.org",
    logo: "https://kagada2026.live/icon-192.png",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${outfit.variable} ${robotoMono.variable} h-full antialiased dark`}
    >
      <head>
        {/* Saman is a self-hosted @font-face in globals.css, so the browser only
            discovers it after the stylesheet parses AND an element that uses it
            is laid out. It sets every section heading on the page, so with
            `font-display: swap` that late discovery showed up as a visible
            re-layout of all of them. Preloading moves the request into the
            initial batch. */}
        <link
          rel="preload"
          as="font"
          type="font/ttf"
          href="/fonts/SAMAN___.TTF"
          crossOrigin="anonymous"
        />
        {/* Explicit Favicons for Google Search & Web Crawlers */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Schema.org Structured Data (WebSite Site Name + Event + Organization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col text-[#D8D3C7] bg-[#5A182B] selection:bg-[#5A182B] selection:text-[#D8D3C7] overflow-x-hidden font-jakarta">
        {/* Google Analytics (gtag.js) placed in body for optimal Next.js hydration */}
        {/* lazyOnload defers analytics until the page is idle. With
            afterInteractive it booted during hydration and showed up as ~197ms
            of scripting inside the first scroll in a CPU profile. Tracking is
            unaffected — gtag still initialises and sends the page_view. */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-F242B7FH1S"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-F242B7FH1S');
          `}
        </Script>
        <SmoothScroll>{children}</SmoothScroll>

        {/* Vercel Analytics (page views) and Speed Insights (Core Web Vitals).
            Both only transmit on Vercel deployments — locally they no-op, so
            they cost nothing in dev. Rendered last so their scripts queue
            behind the page's own content. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
