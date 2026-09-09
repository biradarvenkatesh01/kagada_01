import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Outfit, Roboto_Mono } from "next/font/google";
import SmoothScroll from "@/components/ui/smooth-scroll";
import "./globals.css";

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
  title: "KAGADA 2026 | Annual National-Level Technical Student Conference",
  description:
    "Official website for KAGADA 2026 - 22nd Annual National-Level Technical Student Conference & Competition organized by IEEE UVCE at University Visvesvaraya College of Engineering, Bengaluru.",
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
    title: "KAGADA 2026 | IEEE UVCE National Technical Conference",
    description:
      "Annual National-Level Technical Student Conference conducted by IEEE UVCE on 10th October, 2026 at UVCE, KR Circle.",
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
    icon: "/logo1.png",
    shortcut: "/logo1.png",
    apple: "/logo1.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAGADA 2026 | IEEE UVCE National Technical Conference",
    description:
      "22nd Annual National-Level Technical Student Conference conducted by IEEE UVCE on 10th October, 2026 at UVCE, Bengaluru.",
    images: ["/logo1.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
      </head>
      <body className="min-h-full flex flex-col bg-[#8a1c1c] text-slate-100 selection:bg-[#8a1c1c] selection:text-white overflow-x-hidden font-jakarta">
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
