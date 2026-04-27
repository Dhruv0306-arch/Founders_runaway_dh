# 🚀 The Founder's Runway

> **Know your burn. Own your future.**  
> A startup runway calculator built for founders who treat cash as their most important metric.

---

## What Is This?

**The Founder's Runway** is a frontend-only web application that helps entrepreneurs calculate exactly how long their startup can survive with its current cash and burn rate.

The core formula is simple:

```
Runway (Months) = Total Cash on Hand ÷ Monthly Burn Rate
```

But the tool goes far beyond the math — it provides financial health diagnosis, strategic advice, scenario analysis, and visual clarity that help founders act before it's too late.

---

## Features

### Core Calculator
- **Total Cash on Hand** input with automatic comma-formatting
- **Monthly Burn Rate** input with `/mo` label and real-time feedback
- Full input validation with clear error messages
- Edge case handling:
  - `Burn Rate = 0` → Detected as infinite runway (profitable/pre-revenue)
  - `Cash = 0` → Emergency state with red alert
  - Negative values → Rejected with validation error
  - Empty inputs → Validated on blur with clear guidance
  - Very large values → Short-form display (e.g., `$2.5M`, `$1.2B`)

### Visual Health Status
| Runway | Status | Color |
|--------|--------|-------|
| ≥ 6 months | ✅ Safe Zone | Emerald green |
| 3–6 months | ⚠️ Warning Zone | Amber yellow |
| < 3 months | 🚨 Danger Zone | Red |

### Result Dashboard
- **Runway in months** — displayed in a huge, bold Bebas Neue typeface for instant legibility
- **Days to zero** — calculated at 30.44 days/month (calendar-accurate average)
- **Key metrics** — Cash on Hand, Monthly Burn, Annual Burn
- **Runway Meter** — a visual progress bar with milestone markers at 3, 6, 12, 18, 24 months
- **Cash Consumption Timeline** — shows remaining cash at Month 1, 3, 6, 12
- **Burn Rate Insights** — weekly burn, daily burn, daily cost, burn ratio as % of cash
- **Strategic Advice** — 4 actionable tips tailored to your status (safe / warning / danger)

### Scenario Analysis ("What If?")
- Three automatic scenarios: **-10%**, **-20%**, **-30%** monthly burn reduction
- Each scenario shows: new burn amount, new runway, months gained
- Visual comparison bars: current vs. scenario
- Status color-codes each scenario independently

---

## Design Decisions

### Typography
- **Bebas Neue** for all large display numbers and headings — a condensed, ultra-bold font that communicates urgency and precision. The runway number needs to be legible at a glance.
- **Outfit** for all body text — modern, readable, and warm. Avoids the generic "startup SaaS" feel of Inter.
- **JetBrains Mono** for all numeric data — monospace fonts make numbers visually stable and easier to scan.

### Color System
- **Background**: `#020617` (slate-950) — deep, near-black that gives a premium feel without being harsh.
- **Cards**: `#0f172a` (slate-900) — slightly lighter for visual layering without the flatness of full-black.
- **Primary Accent**: Cyan (`#06b6d4`) — energetic, financial, futuristic. Used for interactive elements and the CTA.
- **Safe State**: Emerald green — unambiguously positive in finance contexts.
- **Warning State**: Amber — internationally recognized as "caution" without panic.
- **Danger State**: Red — triggers urgency. The animated dot pulse adds to the effect.

### Interaction Design
- **Inputs validate on blur** (not on type) — avoids jarring errors mid-keystroke.
- **Results appear with `animate-slide-in`** — signals a meaningful state change, not just a re-render.
- **The runway meter animates on mount** via CSS `animate-fill-bar` — draws the eye to the result.
- **Danger state dot pulses faster** than safe/warning — a subtle but effective urgency cue.

### Layout
- Two-column input grid on desktop, single column on mobile.
- Results use a `lg:grid-cols-[auto_1fr]` layout — the big number on the left, detail metrics on the right.
- Scenario cards are self-contained rows, easy to scan vertically.

### No Libraries Policy
- **No charting library** (Recharts, Chart.js, etc.) — the runway meter and comparison bars are pure CSS, keeping bundle size small and load time fast.
- **No animation library** (Framer Motion, etc.) — all animations are CSS keyframes or Tailwind utilities.
- **No form library** — custom validation is 20 lines of clear JavaScript; no need for react-hook-form or formik for a two-field form.
- **No router** — single-page design with anchor navigation; a router would be overkill.

---

## Folder Structure

```
founders-runway/
├── index.html                   # Entry HTML, Google Fonts import
├── package.json                 # Dependencies
├── vite.config.js               # Vite config
├── tailwind.config.js           # Tailwind config with custom fonts
├── postcss.config.js            # PostCSS
├── README.md                    # This file
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Root component
    ├── index.css                # Tailwind imports, global styles, animations
    ├── components/
    │   ├── Navbar.jsx           # Fixed navbar, scroll-aware blur
    │   ├── Hero.jsx             # Landing hero with headline + stats
    │   ├── RunwayCalculator.jsx # Main section: inputs + state + results
    │   ├── ResultCard.jsx       # Result display: number, meter, advice
    │   ├── ScenarioCard.jsx     # Burn reduction scenario comparison
    │   └── Footer.jsx           # Footer with disclaimer
    └── utils/
        ├── calculations.js      # Core formula, status, scenarios, advice
        └── formatters.js        # Currency, months, days, input formatting
```

---

## Setup & Development

### Prerequisites
- Node.js 18+ and npm

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for production
```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview production build locally
```bash
npm run preview
```

---

## Deploying to Vercel

**Option 1: Via Vercel CLI**
```bash
npm install -g vercel
vercel
```
Follow the prompts. Vercel auto-detects Vite. No config needed.

**Option 2: Via Vercel Dashboard**
1. Push this repo to GitHub (public repository).
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import your GitHub repository.
4. Vercel auto-detects the framework as **Vite**.
5. Leave all settings as default and click **Deploy**.
6. Your app will be live in ~30 seconds.

**No environment variables needed** — this is a fully frontend-only app with no secrets.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.2 | UI framework |
| Vite | 5.1 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Bebas Neue | — | Display typeface (Google Fonts) |
| Outfit | — | Body typeface (Google Fonts) |
| JetBrains Mono | — | Numeric data typeface (Google Fonts) |

No backend. No database. No authentication. No cookies.

---

## License
MIT. Built for the E-Cell IIT Task Submission challenge.
