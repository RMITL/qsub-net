# CLAUDE.md

This file provides guidance to Claude Code when working with the qsub.net codebase.

## Project Overview

qsub.net is the marketing/landing site for QUANTA (Quantitative Autonomous Network for Trading Alpha), a Bittensor subnet for decentralized portfolio-based alpha signal generation. The site includes:

- **Landing page** (`/`) - Email capture/waitlist signup
- **Pitch deck** (`/pitch`) - Full interactive investor presentation
- **Pitch deck lite** (`/pitch-lite`) - Simplified overview presentation
- **FAQ** (`/faq`) - Frequently asked questions with concepts and glossary
- **Contact** (`/contact`) - Contact form

## Tech Stack

- **Framework**: Astro (static site generator)
- **UI Components**: React (JSX) with client-side hydration
- **Charts**: Recharts for data visualizations in pitch decks
- **Styling**: CSS-in-JS (inline styles in React components)
- **Server**: Python (FastAPI/Starlette) for API endpoints
- **Email**: SparkPost/Bird API for contact form submissions
- **Process Manager**: PM2

## Common Commands

```bash
# Development
npm run dev              # Start Astro dev server

# Build
npm run build            # Build static site to dist/

# Production (PM2)
pm2 restart qsub-net     # Restart the production server
pm2 logs qsub-net        # View server logs

# PDF Generation
node tools/generate-pdf.cjs   # Generate PDF from markdown spec
```

## Directory Structure

```
src/
├── components/          # React components
│   ├── QuantaPitchDeck.jsx      # Full pitch deck (25 slides)
│   ├── QuantaPitchDeckLite.jsx  # Simplified pitch deck
│   ├── QuantaFAQ.jsx            # FAQ page with accordion sections
│   ├── ContactForm.jsx          # Contact form component
│   └── quanta-litepaper.jsx     # Litepaper component
├── pages/               # Astro page routes
│   ├── index.astro      # Landing/join page
│   ├── pitch.astro      # Full pitch deck
│   ├── pitch-lite.astro # Lite pitch deck
│   ├── faq.astro        # FAQ page
│   └── contact.astro    # Contact page
tools/
├── generate-pdf.cjs     # PDF generator script
├── academic-style.css   # PDF styling
└── *.md, *.pdf          # Technical specification documents
server.py                # Python server for API endpoints
```

## Key Design Patterns

### Branding
- **Logo**: Gold "Q" in rounded square (`#d4af37` to `#f4d03f` gradient)
- **Font**: Space Grotesk for QUANTA branding, system fonts for body
- **Colors**: Dark theme with gold accents
  - Background: `#0d0d14` to `#151520`
  - Gold: `#d4af37`
  - Text: `#e8e6e3`

### Component Structure
- Each major page is a single React component with embedded CSS
- Slides use fade-in animations (disabled due to hydration issues)
- Mobile responsive with hamburger menus on smaller screens

### API Endpoints
- `POST /api/contact` - Contact form submission (SparkPost)
- `POST /api/join` - Waitlist signup

## Important Notes

1. **Hydration**: React components use `client:load` directive. Animations were disabled to prevent double-render flashing.

2. **Pitch Deck Tokenomics**: The interactive model in the pitch deck has configurable parameters. Key values:
   - Network rake: 0-8% (governance-tunable, currently set to 0% - under consideration)
   - Emission split: 41% validators, 41% miners, 18% owner
   - Horizon weights: 7-day (30%), 30-day (40%), 90-day (30%)

3. **Contact Info**: Primary contact is `info@qsub.net`

4. **Technical Spec**: The authoritative technical specification is in `tools/QUANTA_Technical_Specification_v5.md`

## Testing Changes

After making changes:
1. Run `npm run build` to verify build succeeds
2. Run `pm2 restart qsub-net` to deploy
3. Test at https://qsub.net (via Cloudflare tunnel)
