# Founder's Runway 🚀

> In the world of startups, Cash is King. Know exactly how many months you have before zero — and get the strategic clarity to act before it's too late.

![Founder's Runway](https://raw.githubusercontent.com/Dhruv0306-arch/Founders_runaway_dh/main/public/preview.png)

## Overview
**Founder's Runway** is a sleek, highly-interactive web application designed to help entrepreneurs instantly visualize their financial health. Born out of the E-Cell IT task challenge, this calculator goes beyond simple math to deliver a premium, actionable, and visually stunning user experience.

## ✨ "Cherry on Top" Features

We didn't just build a basic `Cash / Burn` calculator. We built a tool that founders would actually use.

1. **Net Burn & Profitability Logic (Advanced Formula)**
   - *Why:* Startups rarely have zero revenue. We added an optional **Monthly Revenue** field. The underlying formula calculates true runway using `Net Burn = Gross Burn - Revenue`. If Revenue > Burn, the UI dynamically shifts into a "Profitable" state, celebrating the user's infinite runway.

2. **Interactive Area Chart (Data Visualization)**
   - *Why:* Numbers are abstract; graphs are visceral. We implemented a beautiful, animated `Recharts` area chart that plots the exact path to $0 over the coming months. The glowing gradient fill provides immediate, impactful visual feedback of cash bleed.

3. **Dynamic Currency Selector**
   - *Why:* Global usability. A sleek, animated toggle allows users to instantly switch the entire application context between **US Dollars ($)** and **Indian Rupees (₹)** without breaking formatting or requiring a page reload.

4. **Scenario Analysis Engine**
   - *Why:* Actionable insights. Instead of just telling a founder they have 3 months left, the app automatically generates multiple cost-reduction scenarios (e.g., "What if you cut burn by 20%?"), calculating the exact extra months gained.

## 🎨 Design Philosophy & UI/UX Decisions

The UI was meticulously crafted to align with the **E-Cell Ramaiah** aesthetic while maintaining a professional, "FinTech" level of polish.

- **The Palette:** We used a deeply saturated dark mode (`#000000` base, `#120a2e` card backgrounds) accented by glowing E-Cell Purple (`#4526b1`) and Vibrant Orange (`#FD562A`). This high-contrast approach ensures readability while feeling cutting-edge.
- **Semantic Feedback:** The UI dynamically changes state based on the runway health:
  - 🟢 **Safe (≥6 mo):** Emerald glows, calm pulsing.
  - 🟡 **Warning (3–6 mo):** Amber borders, prompting caution.
  - 🔴 **Danger (<3 mo):** Red pulsing sirens, signaling immediate, critical action.
- **Micro-interactions:** From the smooth slide-in of the results card to the animated filling of the runway meter bar, every interaction is designed to feel alive and responsive.
- **Mobile First:** Fully responsive using Tailwind grids and flexbox.

## 🛠 Tech Stack
- **Framework:** React + Vite (Fast, modular, and component-driven)
- **Styling:** Tailwind CSS (Rapid, scalable utility classes)
- **Data Visualization:** Recharts (Declarative, responsive charting)
- **State Management:** React `useState` & `useMemo` for highly optimized, lag-free calculations.

## 🚀 Getting Started

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/Dhruv0306-arch/Founders_runaway_dh.git

# Navigate into the directory
cd founders-runway

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🧠 Why This Project Stands Out (Judging Criteria)

- **Attention to Detail:** Currency formatting uses proper localized thousands separators. The input fields automatically format numbers as you type (`500000` -> `500,000`).
- **Technical Pride:** Code is cleanly separated into modular components (`Hero`, `RunwayCalculator`, `ResultCard`, `ScenarioCard`, `RunwayChart`) and pure utility functions (`calculations.js`, `formatters.js`).
- **Creativity:** Handled edge cases explicitly (Zero Burn, Zero Cash, Profitable). 

---
*Built with passion for the E-Cell UI/UX Task.*
