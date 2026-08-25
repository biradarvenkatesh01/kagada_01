# 🏛️ KAGADA 2026 — IEEE UVCE Technical Symposium

> **Kagada 2026** is the annual national-level technical paper presentation, project exhibition, poster competition, and WIE conference organized by the **IEEE UVCE Student Branch** at UVCE, Bengaluru.

---

## 🌟 Key Features & Highlights

- **🎬 Fullscreen Video Intro Experience**: High-impact full-viewport portrait intro video with audio playback and automatic 1.8-second film-grade dissolve transition.
- **🏛️ UVCE Heritage Building Visuals**: High-resolution background featuring the iconic red UVCE heritage building with a custom retro white grid overlay.
- **🖋️ Custom Typography**:
  - Calligraphic **Saman** font for **"Kagada 2026"** with custom letter-kerning.
  - **Roboto Mono** monospace font for the *"Annual National-Level Technical Student Conference"* subtitle.
- **💎 Floating Glassmorphism Navbar**: Animated floating glass pill navigation header with slide-down entrance physics.
- **📊 Competition Tracks**: Paper Presentation, Live Project Exhibition, Poster Presentation, and Women in Engineering (WIE) tracks.
- **📱 Fully Responsive**: Tailored layouts for both mobile devices and widescreen desktop viewports.

---

## 🛠️ Technology Stack

| Technology | Purpose | Version |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.3.2` |
| **Library** | React | `19.2.8` |
| **Styling** | Tailwind CSS v4 | `^4.0.0` |
| **Language** | TypeScript | `^5.0.0` |
| **Icons** | Lucide React | `^1.34.0` |
| **Fonts** | Custom Saman TTF, Roboto Mono, Glacial Indifference | Local & Web |

---

## 📁 Repository Structure

```
kagada_01/
├── app/
│   ├── globals.css         # Font-face declarations, Tailwind v4 imports, retro grid styles
│   ├── layout.tsx          # Root Next.js layout configuration
│   └── page.tsx            # Fullscreen intro video -> Hero section transition component
├── components/
│   ├── EventTracks.tsx     # Competition tracks & prize details
│   ├── Footer.tsx          # IEEE UVCE contact & venue details
│   ├── IntroVideo.tsx      # Video player components & cinema mode
│   ├── Navbar.tsx          # Glassmorphic floating header
│   ├── RegistrationSection.tsx # Abstract submission & entry form
│   └── Timeline.tsx        # Event schedule & key dates
├── public/
│   ├── fonts/
│   │   └── SAMAN___.TTF    # Custom Saman calligraphy font
│   ├── hero-bg.jpg         # High-resolution UVCE red heritage building photograph
│   └── video-intro.mp4     # Intro video asset
├── .gitignore              # Configured repository exclusions
└── package.json            # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation & Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd kagada_01
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **View in browser**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 License & Organizers

Organized with ❤️ by **IEEE UVCE Student Branch**, University Visvesvaraya College of Engineering (UVCE), K.R. Circle, Bengaluru.
