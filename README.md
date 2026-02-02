# Playlist Cover Generator

> **⚠️ DISCLAIMER: VIBE CODED SLOP**  
> This project is "vibe coded slop". It is a purely personal project created for the aesthetics and the fun of it. It is **not** intended to be used, maintained, or supported for others. I built this for me. If it breaks, it breaks.

A mobile-first Progressive Web App (PWA) for generating stylized, halftone-duotone Spotify playlist covers.

[**Live Demo**](https://ferbfloo.github.io/playlist_covermaker/)

## ✨ Features

- **Wizard Workflow**: A step-by-step process (Title -> Color -> Image -> Edit) to keep things simple.
- **Halftone Engine**: Custom Canvas-based processing that converts images into a stylish duotone dot pattern.
- **Advanced Text Editor**:
  - Live text editing.
  - Variable font sizing and custom fonts (Bogart, Heavitas, etc.).
  - Alignment controls (Center, Bottom Left, etc.).
  - All-Caps toggle.
- **Image Tools**:
  - **Cropping**: Zoom and pan to get the perfect 1:1 square.
  - **Adjustments**: Brightness, Contrast, and Black/White Levels.
  - **Color**: Professional color wheel with "Vibe" presets.
- **PWA Ready**: Installable on iOS and Android for a native-like experience.

## 🛠️ Tech Stack

- **React** + **Vite**
- **react-easy-crop** (Image manipulation)
- **react-colorful** (Color selection)
- **Canvas API** (Image processing)

## 🏃‍♂️ Running Locally

If you really want to run this slop locally:

1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
