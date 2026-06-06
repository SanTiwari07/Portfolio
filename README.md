# Sanskar Tiwari — Portfolio v3

> **AI Systems Builder · Computer Vision Engineer · Software Engineer Intern**

Premium cinematic engineering portfolio built with React Three Fiber, GSAP, Framer Motion, and Lenis scroll.

---

## Project Structure

```
Sanskar Portfolio v3/
├── assets/                  # Source media assets
│   ├── car/                 # Porsche 911 Turbo S images + GLB model
│   └── awards/              # Hackathon award photographs
│       ├── techfiesta/
│       ├── pune-agri/
│       └── vois/
│
├── portfolio/               # React frontend application
│   ├── src/
│   │   ├── components/      # All section components
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── index.tsx
│   ├── public/
│   │   └── assets/          # Assets served by Vite (copied from root assets/)
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docs/                    # Content documentation
│   ├── Portfolio_Content.md
│   ├── LinkedIn_Data.md
│   ├── Achievement_Data.md
│   └── Project_Data.md
│
├── scripts/                 # Setup and utility scripts
│   ├── setup.bat            # One-click: install + copy assets + launch dev
│   ├── install_deps.bat     # Install npm dependencies only
│   └── copy_assets.bat      # Copy assets from assets/ to portfolio/public/assets/
│
├── .venv/                   # Python virtual environment
├── requirements.txt         # Python dependencies
├── .gitignore
└── README.md
```

---

## Quick Start

### 1. Setup (first time)

```bat
scripts\setup.bat
```

This will:
- Run `npm install` in the `portfolio/` directory
- Copy all assets from `assets/` to `portfolio/public/assets/`
- Start the dev server at `http://localhost:3000`

### 2. Development

```bat
cd portfolio
npm run dev
```

### 3. Python Environment

```bat
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| 3D | React Three Fiber + Drei + Three.js |
| Animation | GSAP + ScrollTrigger + Framer Motion |
| Scroll | Lenis |
| Styling | TailwindCSS v4 |
| Build | Vite 6 |

---

## Sections

| # | Section | Key Feature |
|---|---------|-------------|
| 01 | **Hero** | 3D GLB Porsche model, mouse-reactive camera |
| 02 | **Performance** | Animated counters, parallax car image |
| 03 | **Mission** | MindstriX internship editorial |
| 04 | **Tech Ecosystem** | Floating icon clusters with hover tooltips |
| 05 | **Control Center** | Cockpit dashboard with project hotspots |
| 06 | **Race Record** | Infinite award image marquee |
| 07 | **Track History** | Editorial milestone timeline |
| 08 | **Live Systems** | GitHub dashboard |
| 09 | **Journey Continues** | Cinematic rear-car finale + contact |

---

## Contact

**Sanskar Tiwari**  
Electronics & Telecom · PICT, Pune  
Software Engineer Intern · MindstriX Technologies  
[sanskartiwari.smt2@gmail.com](mailto:sanskartiwari.smt2@gmail.com)  
[LinkedIn](https://www.linkedin.com/in/sanskar-tiwari-b781a9315/) · [GitHub](https://github.com/SanTiwari07)
