# Changelog

## [1.4.0] - 2026-11-06

### Added

- **The Apothecary Diaries (light):** Maomao-inspired pale celadon surfaces with pine text, jade functions, plum keywords, and ochre constants and types. Includes semantic highlighting, a full terminal palette, and matching workbench controls.
- **Gachiakuta (dark):** Warm soot and chalk with rust keywords, weathered sage strings, dusty ochre types, and yellow-green focus and active indicators. Keeps the series’ raw character within MangaMode’s restrained editor style.
- **UI-state contrast checks:** Automated coverage for selection, search and occurrence highlights, layered diff backgrounds, inlay hints, buttons, lists, menus, tabs, and focus indicators. Alpha colors are composited before checking; missing required state colors fail the check.
- **Generated previews:** One command captures all ten Marketplace images from the website’s expanded editor renderer. Source and image hashes prevent stale previews from passing release checks.

### Changed

- **State readability:** Softened highlight fills, strengthened focus borders, and adjusted muted text and bracket colors where UI states fell below the contrast target. Added explicit foregrounds for selected suggestions and workbench lists.
- **Website:** Expanded the shelf to ten volumes, including live syntax previews, editor chrome, contrast tables, and tuning controls for both new themes. Updated theme counts and descriptions.
- **Contrast:** Both new palettes clear WCAG AA for syntax and muted editor text; syntax remains readable on their editor selection backgrounds.

## [1.3.0] - 2026-09-07

### Added

- **Death Note (high contrast):** First `hc-black` variant. Near-black canvas with off-white text, apple-red keywords, shinigami-gold functions, parchment strings and Ryuk grey-blue types. Every token is at or above WCAG AAA (7:1); gold cursor and borders keep focus visible without relying on color alone.
- **Contrast check:** `bun run test` (or `node scripts/check-contrast.mjs`) fails if any text color in any theme drops below WCAG AA, or AAA for high contrast themes.

### Changed

- **Icon:** New manga-style mark: white code tag inside a crimson brush ring with speed lines on near-black. Reads cleanly at sidebar size and no longer favours one variant's palette.

### Improved

- **Inlay hints:** Removed the alpha that pushed hint text under 3:1 in every theme; hints now match the parameter color at 5–6:1.
- **Line numbers:** Nudged above 4.5:1 where they sat just under (One Piece, Pokémon, Dragon Ball, DanDaDan).
- **Sailor Moon:** Darkened every syntax color, line number, inlay hint and inactive tab so all text meets 4.5:1 on the cream canvas. Hues unchanged.
- **Find & occurrences:** Current find match now has an accent border; selection-occurrence highlights are translucent so syntax color stays visible through them.
- **Cursor and errors:** Cursor no longer shares the keyword color (One Piece, Demon Slayer, Dragon Ball, DanDaDan, Pokémon); error squiggles in One Piece and Demon Slayer use a distinct red.
- **Pokémon:** Functions and types move from neutral grey to a soft Poké-blue so roles separate by hue, not lightness alone.
- **UI coverage:** ~40 new UI colors per theme (command palette, find widget, buttons, links, menus, notifications, git decorations, gutter, ghost text, remote status item, title bar, peek view) so VS Code's default blue and grey no longer leak into the palette.

## [1.2.0] - 2026-03-27

### Added

- **Sailor Moon (light):** The pack’s first light variant—warm cream editor canvas, pastel syntax, and `vs` chrome so the UI matches a proper light theme. Keywords and accents use a softened Sailor-pink; functions stay in navy; strings in teal; structural tokens in lavender; constants in amber gold.

## [1.1.0] - 2026-03-27

### Improved

- **Bracket colors:** Reduced from 6 distinct hues to 3 tonal shades per theme, cutting visual noise in deeply nested code
- **Diff editor:** Added soft, palette-matched insertion/deletion backgrounds so diff views no longer clash with theme colors
- **UI borders:** Sidebar and tab strip borders now blend into the background, reducing peripheral distraction
- **Scrollbar & minimap:** Lowered scrollbar opacity and pinned minimap background to editor background for a quieter scroll experience
- **Semantic highlighting:** Widened the color gap between "callable" tokens (class, function, method) and "structural" tokens (interface, enum, readonly) so the distinction is intentional, not ambiguous
