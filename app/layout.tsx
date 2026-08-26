import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://kagada2026.ieeeuvce.org"),
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
    url: "https://kagada2026.ieeeuvce.org",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-black text-slate-100 selection:bg-[#8a1c1c] selection:text-white overflow-x-hidden">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
