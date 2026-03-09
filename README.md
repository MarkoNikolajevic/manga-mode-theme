# Anime & Manga Eye-Comfort Theme Pack

A VS Code theme extension with six anime/manga-inspired dark variants designed for long coding sessions:

- Low-glare backgrounds
- Controlled saturation
- Clear token contrast without harsh neon

## Theme Variants

- **Dragon Ball**: A high-energy theme with bold oranges and deep blues. Designed for those "Power Level over 9000" coding sessions
- **One Piece**: Rich ocean teals and Straw Hat reds. Navigate through your most complex codebases like a Pirate King
- **Pokémon**: Sharp yellows and soft greys. Fast, recognizable, and "super effective" against eye strain
- **Demon Slayer**: Deep charcoal backgrounds with striking water-blue and fire-red accents. Elegant and sharp as Nichirin sword
- **Jujutsu Kaisen**: A "Hollow Purple" aesthetic featuring dark violets and neon cyans. Master the domain of your own logic
- **Dandadan**: A chaotic-cool mix of neon pinks, extraterrestrial greens, and occult purples. For the dev who likes things a bit weird

## Installation

### From VSIX (Offline)

1. Download the `.vsix` file from the [Releases](https://github.com/MarkoNikolajevic/anime-theme/releases) page
2. In VS Code, open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run **Extensions: Install from VSIX...**
4. Select the downloaded file

## Usage

1. Open Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Run **Preferences: Color Theme**
3. Select any `Anime Comfort: ...` variant

## Suggested Settings for Eye Strain & Eye Health

Pair this theme with these VS Code settings to reduce eye fatigue during long coding sessions. Merge these keys into your `settings.json` (File → Preferences → Open User Settings (JSON)):

```json
{
  "editor.fontSize": 15,
  "editor.fontFamily": "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.smoothScrolling": true,
  "editor.minimap.enabled": true,
  "editor.minimap.scale": 1,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true
}
```

**Tip:** Take regular breaks (e.g. 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds).

## Building

To create a `.vsix` package for distribution:

```bash
bun install
bun package
```

The `.vsix` file will be generated in the project root.

## License

MIT © [Marko Nikolajevic](https://github.com/MarkoNikolajevic)
