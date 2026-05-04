# Design Brief

## Direction
Clean Clarity — a minimal, focused image processing tool where the interface recedes and the transformation is the hero. Extended with a 5-tab Background Editor panel and a Blog/Updates page featuring author branding.

## Tone
Crisp and efficient. No visual flair or decoration—maximum clarity for core task. Author card uses gradient accents sparingly for premium feel.

## Differentiation
Split-screen before/after comparison. 5-tab background editor panel (Preset Colors, RGB, Preset Images, Upload, AI Generator). Author gradient card (violet→green) on blog.

## Color Palette (Dark OKLCH)

| Token         | OKLCH           | Role                          |
| ------------- | --------------- | ----------------------------- |
| background    | 0.072 0.012 265 | Dark blue-ish base            |
| foreground    | 0.94 0.006 265  | High-contrast text            |
| primary       | 0.5 0.22 295    | Violet, active/focus states   |
| accent        | 0.72 0.17 162   | Green, success/highlights     |
| card          | 0.105 0.012 265 | Elevated surfaces             |
| muted         | 0.14 0.01 265   | Subtle backgrounds            |
| destructive   | 0.62 0.22 22    | Red, warnings                 |

## Typography
- Display/Body: Inter — consistent, modern, friendly UI
- Scale: `text-4xl font-bold` (hero), `text-lg font-semibold` (labels), `text-base` (body), `text-sm` (metadata)

## Elevation & Depth
Subtle shadow hierarchy: input surfaces soft 3px blur, cards 4px blur with 0.3 opacity. No depth gradients except gradient-accent-card (violet→green gradient on author card).

## Structural Zones

| Zone           | Background      | Border       | Notes                                |
| -------------- | --------------- | ------------ | ------------------------------------ |
| Header/Nav     | bg-background   | border-b     | Sticky, includes Blog link           |
| Editor Panel   | bg-card         | border       | 5 tabs (active: primary color)       |
| Blog Content   | bg-background   | —            | Grid + author card gradient overlay  |
| Footer         | bg-muted/20     | border-t     | Actions + links                      |

## Component Patterns
- **Tabs**: Minimal pill tabs; active uses primary color + underline. Smooth 300ms transition on hover.
- **Tab Content**: Card-style panels with 1px border, subtle shadow, 1rem internal padding.
- **Cards**: 1px subtle border, 6px radius, card shadow. Transparent or 1% darker than background.
- **Author Card**: gradient-accent-card (violet→green), white text, initials avatar (ASR) with semi-transparent gradient bg.
- **Blog Post**: Editorial grid, version badge (pill-style), feature highlights as bullet list.

## Motion
- Tab Switch: 200ms cross-fade on tab content.
- Entrance: 300ms ease-out fade-in for images.
- Hover: 200ms color transition on buttons + tabs.
- Author Card: Subtle lift on hover (2px translate-y).

## Constraints
- No full-page gradients; gradient-accent-card reserved for author card only.
- Tab focus rings use ring token (violet primary).
- Text contrast AA+ verified by OKLCH lightness difference.
- Mobile: Stack tabs vertically, author card full-width, blog single-column.

## New Utilities
- `.gradient-accent-card`: Violet→green gradient background for premium author branding.
- `.tab-indicator.active`: Violet underline + color for tab state.
- `.avatar-initials`: Centered, circular, semi-transparent gradient background for author initials.
