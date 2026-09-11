import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Outfit, Roboto_Mono } from "next/font/google";
import SmoothScroll from "@/components/ui/smooth-scroll";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    "What is KAGADA and when is it? KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 10th October, 2026 at UVCE, Bengaluru.",
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
      "What is KAGADA and when is it? KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 10th October, 2026 at UVCE, Bengaluru.",
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
      "What is KAGADA and when is it? KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 10th October, 2026 at UVCE, Bengaluru.",
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
      "What is KAGADA and when is it? KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 10th October, 2026 at UVCE, Bengaluru.",
    startDate: "2026-10-10T09:00:00+05:30",
    endDate: "2026-10-10T18:00:00+05:30",
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
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${outfit.variable} ${robotoMono.variable} h-full antialiased dark`}
    >
      <head>
        {/* Preload critical hero background image for instant display */}
        <link rel="preload" as="image" href="/hero-bg.jpg" fetchPriority="high" />
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
      <body className="min-h-full flex flex-col text-slate-100 selection:bg-[#8a1c1c] selection:text-white overflow-x-hidden font-jakarta">
        {/* Google Analytics (gtag.js) placed in body for optimal Next.js hydration */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-F242B7FH1S"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-F242B7FH1S');
          `}
        </Script>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
