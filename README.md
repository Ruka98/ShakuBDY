# 🎉 Happy Birthday Shakuni — Interactive Gift Web App

A romantic, interactive birthday storybook website crafted with love by Rukmal for Shakuni.

---

## ✨ Features Included

1. **🎁 3D Gift Box Unboxing Experience**:
   - The first screen she sees on opening your link.
   - Touching/tapping the gift box bursts celebratory confetti, triggers soft music, and smoothly reveals the storybook.
2. **🎵 Dual-Engine Audio Player**:
   - Built-in soothing music-box lullaby synthesizer (plays reliably on any device without internet downloads).
   - Custom song support: Simply drop any MP3 named `music.mp3` into the `assets/` folder to play your favorite song!
   - Floating music toggle pill at the top-right corner with dancing equalizer bars.
3. **🌸 Floating Cherry Blossom & Hearts Canvas**:
   - Ambient falling petals and glowing pink hearts drifting softly across the screen.
   - Interactive touch: Tapping anywhere on the screen spawns floating mini hearts (`❤️`, `💖`, `✨`, `🌸`).
4. **📸 Chapter I — The Radiant You**:
   - Polaroid-style cards showcasing her beautiful portrait photos with tilt effects and handwritten captions.
5. **🎓 Chapter II — The Achiever & Our Pride**:
   - Celebrating her University of Ruhuna Convocation milestone with her gown, garland, bouquet, and bears.
6. **💖 Chapter III — Us, Hand in Hand**:
   - Memorable couple celebrations, the birthday flower bouquet, couch celebrations, and family smiles.
   - Tapping any photo opens a high-resolution lightbox view.
7. **🎂 Chapter IV — Interactive Birthday Cake**:
   - Multi-tier birthday cake with glowing, animated flickering candles.
   - **Interactive Candle Blow**: When she taps the candles or cake, the candles blow out with smoke puffs, a shower of confetti explodes, a musical chime sounds, and a celebratory wish banner appears!
8. **💌 Chapter V — 6 Reasons Why I Adore You**:
   - 3D interactive cards that flip over when tapped to reveal heartfelt love notes.
9. **📜 Chapter VI — Wax-Sealed Secret Letter**:
   - An antique wax-sealed envelope. Tapping the red seal opens an unfolded personal letter from Rukmal to Shakuni.

---

## 🚀 How to Test & Preview Locally

1. Simply double-click `index.html` in this folder to open it in your browser (Chrome, Edge, Safari, Brave, Firefox).
2. Click **"🎁 Tap to Unwrap Your Gift"** to experience the unboxing, music, and animations.

---

## 🌐 How to Host It for Free & Get a Shareable Link

Choose any of these free options to get a live URL to send to her WhatsApp:

### Option 1: Netlify Drop (Fastest — 30 Seconds, No Code Required)
1. Go to [Netlify Drop](https://app.netlify.com/drop) in your browser.
2. Drag and drop this whole `Shakuni` folder into the browser window.
3. Netlify will publish it immediately and give you a live link (e.g. `https://shakuni-birthday.netlify.app`)!
4. You can go to **Site Settings > Change site name** to give it a custom name like `shakuni-birthday.netlify.app`.

### Option 2: Vercel (Developer-friendly)
1. Open PowerShell in this folder:
   ```bash
   npx vercel
   ```
2. Follow the 3 prompts (hit Enter for defaults).
3. In 15 seconds, you get a live link like `https://shakuni-surprise.vercel.app`!

### Option 3: GitHub Pages
1. Create a repository on GitHub (e.g. `shakuni-birthday`).
2. Push this folder's code to the repository.
3. Go to **Settings > Pages**, choose `main` branch, and click **Save**.
4. Your link will be `https://<your-username>.github.io/shakuni-birthday/`.

---

## 🎨 How to Customize

- **Add Your Favorite Song**:
  - Download your favorite romantic song as an MP3 file, rename it to `music.mp3`, and place it in the `assets/` folder (`assets/music.mp3`).
  - The website will automatically play your custom song instead of the built-in synthesizer!
- **Edit the Secret Letter**:
  - Open `index.html` in your favorite code editor.
  - Search for `A Letter From The Heart` (around line 598) and edit the text to add any private nicknames, dates, or personal memories.
- **Edit the Flip Card Notes**:
  - Search for `Little Reasons Why I Adore You` (around line 415) to customize the 6 flip cards.
