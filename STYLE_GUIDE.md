# QUANTA Style Guide

This document defines the visual design system for QUANTA's marketing site (qsub.net).

---

## Typography

### Font Stack

QUANTA uses three font families, each with a specific purpose:

| Font | Purpose | Usage |
|------|---------|-------|
| **Outfit** | Body text | All general content, paragraphs, UI elements |
| **Space Grotesk** | Branding & Headings | Logo "Q", wordmark "QUANTA", page titles containing "QUANTA" |
| **JetBrains Mono** | Monospace/Code | Slide counters, code snippets, technical values |

> **Note:** The "Q" inside the logo rectangle uses **Space Grotesk** for legibility at small sizes. For email signatures, use the hosted PNG at `https://qsub.net/images/quanta-logo-44.png`.

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@200;300;400;500;600;700&display=swap');
```

Or as a `<link>` tag:

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Font Family Declarations

```css
/* Body text - primary font */
font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;

/* Branding & headings */
font-family: 'Space Grotesk', sans-serif;

/* Monospace / code */
font-family: 'JetBrains Mono', monospace;
```

### Font Weights Used

- **Outfit**: 200, 300, 400, 500, 600, 700
- **Space Grotesk**: 300, 400, 500, 600, 700
- **JetBrains Mono**: 400, 500

---

## Color Palette

### Brand Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **QUANTA Gold** | `#d4af37` | 212, 175, 55 | Primary accent, logo, CTAs |
| **QUANTA Gold Light** | `#f4d03f` | 244, 208, 63 | Gradient endpoint |
| **Dark Background** | `#0d0d14` | 13, 13, 20 | Primary dark bg |
| **Dark Secondary** | `#151520` | 21, 21, 32 | Gradient midpoint |
| **Alt Dark** | `#0a0a0f` | 10, 10, 15 | Alternative dark bg |
| **Alt Dark Secondary** | `#1a1a2e` | 26, 26, 46 | Alternative gradient |

### Text Colors (Dark Theme)

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#f0f0f5` or `#ffffff` | Main text |
| Secondary | `#e8e6e3` | Body text |
| Muted | `rgba(255,255,255,0.5)` | Subtle text |
| Gold accent | `#d4af37` | Links, highlights |

### Status Colors

| Status | Hex | Usage |
|--------|-----|-------|
| Success | `#22c55e` | Positive values, confirmations |
| Warning | `#d97706` | Caution states |
| Error | `#dc2626` | Errors, negative values |

---

## Logo

### Q Icon

The QUANTA logo is a gold "Q" inside a rounded square. The Q uses **Space Grotesk** for better legibility at small sizes.

```css
.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #0d0d14;
  font-size: 1.1rem;
  font-family: 'Space Grotesk', sans-serif;
}
```

### Logo PNG Assets

Pre-rendered PNG versions are available for contexts where custom fonts aren't supported (email signatures, external embeds):

| Size | URL | Usage |
|------|-----|-------|
| 44x44 | `/images/quanta-logo-44.png` | Email signatures |
| 64x64 | `/images/quanta-logo-64.png` | Small icons |
| 128x128 | `/images/quanta-logo-128.png` | Medium icons |
| 512x512 | `/images/quanta-logo-512.png` | Large/retina displays |

Generate new PNGs: `node tools/generate-logo-png.cjs`

### Logo Text

```css
.logo-text {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  font-family: 'Space Grotesk', sans-serif;
}
```

### Size Variants

| Context | Icon Size | Border Radius |
|---------|-----------|---------------|
| Header/Nav | 32-36px | 6-10px |
| Hero/Large | 64px | 12px |
| Favicon | 16px | 3px |

---

## Gradients

### Primary Backgrounds

```css
/* Standard dark gradient */
background: linear-gradient(135deg, #0d0d14 0%, #151520 50%, #0d0d14 100%);

/* Alternative dark gradient */
background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);

/* Vertical dark gradient */
background: linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%);
```

### Gold Gradient (CTAs, Buttons)

```css
background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
```

### Ambient Background Effect

```css
.container::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(52, 152, 219, 0.04) 0%, transparent 50%);
  pointer-events: none;
}
```

---

## Buttons

### Primary Button (Gold)

```css
.btn-primary {
  padding: 0.85rem 1.75rem;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  border: none;
  border-radius: 8px;
  color: #0d0d14;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}
```

### Secondary Button (Outline)

```css
.btn-secondary {
  padding: 0.85rem 1.75rem;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 8px;
  color: #d4af37;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(212, 175, 55, 0.1);
}
```

---

## Spacing

### Standard Spacing Scale

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight gaps |
| sm | 8px | Element padding |
| md | 16px | Section padding |
| lg | 24px | Major sections |
| xl | 32px | Page padding |
| 2xl | 48px | Large gaps |
| 3xl | 64px | Hero spacing |

### Common Paddings

- **Header**: `1rem 2rem` (16px 32px)
- **Slide content**: `20px 60px 100px`
- **Mobile slide content**: `16px 20px 100px`
- **Cards**: `1.5rem` (24px)

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | 4px | Badges, chips |
| Medium | 6-8px | Buttons, inputs |
| Large | 10-12px | Logo, cards |
| XL | 16px | Modal, large cards |
| Full | 50% / 9999px | Pills, avatars |

---

## Shadows

### Card Shadow

```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
```

### Elevated Shadow

```css
box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
```

### Glow Effect

```css
box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
```

---

## Borders

### Standard Border

```css
border: 1px solid rgba(212, 175, 55, 0.2);
```

### Subtle Border

```css
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Divider Line

```css
.divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  margin: 16px auto;
}
```

---

## Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| Base | 0 | Default content |
| Dropdown | 10 | Dropdown menus |
| Sticky | 50 | Sticky headers |
| Fixed | 100 | Fixed navigation |
| Modal | 200 | Modal overlays |
| Toast | 300 | Notifications |

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Touch devices */
@media (hover: none) { }
```

---

## Component Patterns

### Header/Navigation

- Fixed position at top
- Semi-transparent background with blur
- Logo left, navigation right
- Gold border-bottom on hover states

### Slide-Based Pages

- Full viewport height slides
- Scrollable content within fixed container
- Keyboard navigation (arrow keys, space)
- Mouse wheel navigation with smart scroll detection

### Cards

- Dark background (`rgba(0,0,0,0.3)` or similar)
- Subtle border (`rgba(212,175,55,0.2)`)
- Rounded corners (12px)
- Hover: slight lift or glow effect

---

## Files Reference

Typography is standardized across these files:

| File | Component |
|------|-----------|
| `src/components/QuantaPitchDeck.jsx` | Full pitch deck |
| `src/components/QuantaPitchDeckLite.jsx` | Lite pitch deck |
| `src/components/QuantaFAQ.jsx` | FAQ page |
| `src/components/QuantaResources.jsx` | Resources page |
| `src/components/ContactForm.jsx` | Contact page |
| `src/components/quanta-litepaper.jsx` | Interactive litepaper |
| `src/pages/index.astro` | Join/waitlist page |
| `src/pages/dash.astro` | Network dashboard |

---

## Changelog

- **2025-12-25**: Reverted logo Q to Space Grotesk (better legibility). Added PNG logo assets for email signatures. Updated email signature templates to use hosted PNG.
- **2025-12-25**: Added Space Grotesk to "QUANTA Resources" page title.
- **2025-12-25**: Initial style guide created. Standardized typography to use Outfit as body font across all components.
