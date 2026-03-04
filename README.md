# Anime & Manga Eye-Comfort Theme Pack

VS Code theme extension with five anime/manga-inspired dark variants designed for long coding sessions:

- low-glare backgrounds
- controlled saturation
- clear token contrast without harsh neon

## Theme Variants

- `Anime Comfort: One Piece`
  Nautical navy base with warm gold accents.
- `Anime Comfort: Pokemon`
  Dark crimson core with indigo contrast (pokeball-inspired split energy).
- `Anime Comfort: Dragon Ball`
  Namek-style greens with orange energy highlights.
- `Anime Comfort: Demon Slayer`
  Charcoal/teal foundation with crimson breathing accents.
- `Anime Comfort: Jujutsu Kaisen`
  Deep cursed violet with cyan cursed-energy highlights.

## Quick Start

```bash
npm install
```

## Run Preview (Port 4000)

```bash
npm run dev
```

Preview URL: `http://localhost:4000`

The preview shows a code sample, palette swatches, and a variant selector to compare themes quickly.

## Use in VS Code (Extension Development Host)

1. Open this folder in VS Code.
2. Press `F5` to launch the Extension Development Host.
3. In the new window, open Command Palette.
4. Run `Preferences: Color Theme`.
5. Choose any `Anime Comfort: ...` variant.

## Build Preview

```bash
npm run build
```

## Project Structure

- `package.json` VS Code theme contribution + preview scripts
- `themes/*.json` five theme definitions
- `index.html` preview entry
- `preview/src/main.js` interactive variant switching
- `preview/src/styles.css` preview visuals and layout
