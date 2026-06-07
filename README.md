# Sanskar Tiwari — Portfolio v3 & Interactive WebGL Experience

An immersive, high-performance web portfolio featuring a full 3D WebGL driving experience built with React Three Fiber, React Three Cannon, and Vite.

## 🚀 Features

- **Standardized Architecture**: Scalable, maintainable folder structure separating sections, UI components, and game logic.
- **Immersive 3D Experience**: Driveable 3D vehicle utilizing physics engines directly in the browser.
- **Premium Aesthetics**: High-end visual design with meticulous typography and micro-interactions.
- **Performance Optimized**: Assets compressed to WebP, Draco compressed 3D models, and lazy-loaded components.
- **Live Leaderboards**: Integration with Supabase to track game scores and lap times.

## 🛠 Tech Stack

- **Framework**: React 18 & Vite
- **3D Rendering**: Three.js, React Three Fiber (@react-three/fiber), Drei (@react-three/drei)
- **Physics**: React Three Cannon (@react-three/cannon)
- **Styling**: TailwindCSS & Framer Motion
- **State Management**: Zustand
- **Backend / Auth**: Supabase

## 📁 Folder Structure

```text
src/
├── app/                  # App routing and root layout
├── components/           # Reusable components
│   ├── ui/               # Base UI elements (buttons, loaders, cursors)
│   ├── layout/           # Navbar, layout wrappers
│   ├── animations/       # Shared animation primitives
│   └── shared/           # Common components
├── sections/             # Page sections (Hero, About, Projects, Contact)
├── game/                 # Complex 3D game logic and UI
│   ├── models/           # 3D models loader components
│   ├── controls/         # Keyboard/Touch controls
│   ├── effects/          # Post-processing and particle effects
│   └── ui/               # Game specific overlay UI
├── hooks/                # Custom React hooks
├── context/              # React Context providers (ThemeContext)
├── utils/                # Helper functions
├── types/                # TypeScript interfaces
├── stores/               # Zustand global state (gameStore)
├── assets/               # Local assets imported via JS
├── styles/               # Global CSS
└── lib/                  # Third-party integrations
```

## ⚙️ Installation & Setup

1. **Clone the repository**
2. **Navigate to the portfolio directory:**
   ```bash
   cd portfolio
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your Supabase credentials if you want the leaderboard to work.
   ```bash
   cp .env.example .env
   ```
5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Vercel)

This project is fully configured for deployment on Vercel.

1. Connect your GitHub repository to Vercel.
2. Set the **Framework Preset** to `Vite`.
3. Set the **Root Directory** to `portfolio`.
4. Add your Environment Variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Vercel dashboard.
5. Deploy!

### Build Command
```bash
npm run build
```

### Output Directory
```bash
dist
```

## 🎨 Performance Notes

- We use **Suspense** to lazy-load the `<GamePage />` only when requested.
- All high-resolution `.jpg` and `.png` textures have been converted to `.webp` format for faster loading times.
- Avoid importing unused 3D models. Ensure any new `.glb` files are optimized using `gltf-pipeline` or Draco compression before adding them to `public/models/`.

---

*Designed and engineered by Sanskar Tiwari.*
