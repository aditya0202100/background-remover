# Design Brief

## Direction
Clean Clarity — a minimal, focused image processing tool where the interface recedes and the transformation is the hero.

## Tone
Crisp and efficient. No visual flair or decoration—maximum clarity for the core task of background removal and preview.

## Differentiation
Split-screen side-by-side before/after comparison preview with drag-drop upload prominence and smooth interaction feedback throughout the workflow.

## Color Palette

| Token      | OKLCH           | Role                          |
| ---------- | --------------- | ----------------------------- |
| background | 0.98 0.006 240  | Cool off-white base           |
| foreground | 0.18 0.015 230  | High-contrast text            |
| card       | 1.0 0.004 240   | Elevated surfaces             |
| primary    | 0.48 0.15 245   | Deep blue-cyan, processing    |
| accent     | 0.62 0.18 155   | Fresh emerald, success/done   |
| muted      | 0.94 0.01 240   | Subtle backgrounds            |
| destructive| 0.55 0.22 25    | Warm red for clarity          |

## Typography
- Display: Space Grotesk — bold, confident headings
- Body: Plus Jakarta Sans — modern, friendly UI text
- Scale: `text-4xl font-bold` (hero), `text-lg font-semibold` (labels), `text-base` (body)

## Elevation & Depth
Subtle shadow hierarchy: input surfaces have soft 8px blur, cards have 10px blur, background is flat. No depth gradients.

## Structural Zones

| Zone    | Background      | Border       | Notes                       |
| ------- | --------------- | ------------ | --------------------------- |
| Header  | bg-background   | border-b     | Minimal title + meta        |
| Content | bg-background   | —            | Two-column preview on >md   |
| Footer  | bg-muted/20     | border-t     | Actions: download + reset   |

## Spacing & Rhythm
Spacious layout with 2rem gaps between major sections. 1rem padding within cards. Compact form spacing (0.5rem) inside inputs for density contrast.

## Component Patterns
- **Buttons**: primary (blue), accent (emerald), outline (border only). 8px radius, medium padding.
- **Cards**: 1px subtle border, 6px radius, card shadow. No fill—transparent or 1% darker than background.
- **Upload Zone**: dashed border, striped hover state, centered content. Drag-over changes to filled state.
- **Preview**: split 1:1 on >md, stacked on mobile. Labeled "Before" and "After" with small uppercase labels.

## Motion
- Entrance: 300ms ease-out fade-in for preview images on load.
- Hover: 200ms color transition on buttons, slight scale lift on interactive elements.
- Processing: Pulsing loader overlay on image during ML inference.

## Constraints
- No full-page gradients or decorative elements.
- Inputs and upload zones use 1px borders, not shadows.
- Text contrast always AA+ (verified by OKLCH lightness difference).
- Mobile-first responsive: stack upload, preview, and controls vertically on <md.

## Signature Detail
The upload zone uses a dashed border that transforms to solid + fill on drag-over—subtle visual feedback that feels effortless and confirms the drop target is active.
