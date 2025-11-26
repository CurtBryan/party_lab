# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5 application using the App Router, React 19, TypeScript, and Tailwind CSS v4. The project uses Turbopack for faster builds and development. It includes shadcn/ui components (New York style) for the UI component library.

The site is a marketing landing page for "The Partylab" - an Arizona-based inflatable nightclub rental service for kids' parties and events.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start
```

The development server runs at http://localhost:3000 with hot-reload enabled.

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `page.tsx` - Main landing page with all sections
  - `layout.tsx` - Root layout with SEO metadata, JSON-LD schema, and Geist fonts
  - `globals.css` - Global styles with Tailwind v4 and custom neon theme
  - `sitemap.ts` - Auto-generated sitemap configuration
  - `actions/` - Server actions
    - `submit-form.ts` - Contact form submission handler (uses Web3Forms API)
- `components/` - React components
  - `hero-section.tsx` - Hero with background image, CTAs, and social links
  - `features-section.tsx` - Product features grid
  - `packages-section.tsx` - Package selection with pricing
  - `email-form.tsx` - Contact/inquiry form
  - `faq-section.tsx` - FAQ accordion with JSON-LD schema
  - `ui/` - shadcn/ui component library (Button, Input, Card, Label)
- `lib/` - Utility functions
  - `utils.ts` - Contains `cn()` for merging Tailwind classes
- `public/` - Static assets (images, favicon, robots.txt)

### Page Structure

The main landing page (`app/page.tsx`) is composed of distinct sections in this order:
1. Hero Section - Full-screen with background image, logo, social links
2. Features Section - Grid of key benefits/features
3. Packages Section - Pricing tiers with package details
4. Curated Playlist Themes Section - Music theme options with $100 add-on
5. Email Form Section - Contact/inquiry form (id: "request-info")
6. FAQ Section - Accordion with structured data
7. Social Proof Section - Event type tags
8. Footer - Contact info, social links, company info

All sections use scroll-to navigation via `scrollIntoView` from hero CTA buttons.

### Styling System

The project uses **Tailwind CSS v4** with the new configuration format:
- Styles are defined in `app/globals.css` using `@import` and `@theme inline`
- CSS variables define the design system (colors, radius, etc.)
- Dark mode uses a custom variant: `@custom-variant dark (&:is(.dark *))`
- **Color scheme**: Neon nightclub theme with purple (#8B5CF6), pink (#EC4899), teal (#14B8A6)
- Colors use OKLCH color space for better perceptual uniformity
- **Custom utilities**:
  - `.glow-purple`, `.glow-pink`, `.glow-teal` - Box shadow effects
  - `.text-glow-purple`, `.text-glow-pink`, `.text-glow-teal` - Text shadow effects
  - `.gradient-purple-pink`, `.gradient-purple-teal`, etc. - Gradient backgrounds
  - `.animate-fade-in`, `.animate-slide-up`, `.animate-pulse-glow` - Animations

### Component Architecture

The project uses **shadcn/ui** with the following configuration:
- Style: "new-york"
- RSC: enabled (React Server Components)
- Icon library: lucide-react
- Path aliases:
  - `@/components` → components/
  - `@/lib` → lib/
  - `@/ui` → components/ui/
  - `@/hooks` → hooks/

All imports should use these path aliases via the `@/` prefix.

### SEO Architecture

Comprehensive SEO implementation across the site:

**Metadata (app/layout.tsx)**:
- Title, description, keywords optimized for "inflatable nightclub rental Arizona"
- OpenGraph tags for social media sharing
- Twitter Card tags
- JSON-LD structured data for LocalBusiness schema
- Service areas: Phoenix, Scottsdale, Mesa, Tempe, Chandler, Gilbert
- robots.txt in `/public/robots.txt`
- Sitemap configuration in `app/sitemap.ts`

**Important**: When updating business details, change these locations:
- Domain: `app/layout.tsx` line 46 (`metadataBase`)
- Phone/Email: `app/layout.tsx` lines 103-104 (JSON-LD) AND `app/page.tsx` lines 233, 240 (footer)
- Verification codes: `app/layout.tsx` line 86

**FAQ Structured Data**: `components/faq-section.tsx` includes JSON-LD schema for FAQPage to enable rich snippets in search results.

### Forms & Server Actions

Contact form uses **Web3Forms API** for email delivery:
- Server action: `app/actions/submit-form.ts`
- Required environment variable: `WEB3FORMS_ACCESS_KEY`
- Form fields: name, email, phone, eventType
- No database required - emails sent directly

### TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- Path alias: `@/*` maps to project root

### Fonts

The project uses Vercel's Geist font family loaded via `next/font`:
- Geist Sans (variable: `--font-geist-sans`)
- Geist Mono (variable: `--font-geist-mono`)
- Font display: swap (prevents FOIT)
- Preloaded for performance

## Key Dependencies

- **UI Framework**: React 19.1.0, Next.js 15.5.3
- **Styling**: Tailwind CSS v4, tw-animate-css
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Environment Variables

Required for production:
```
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

## Build Configuration

Next.js config (`next.config.ts`):
- Console logs removed in production
- Optimized package imports for lucide-react and Radix UI
- WebP image format
- Compression enabled
- X-Powered-By header removed

## Design Patterns

**Component Pattern**: Most components are client components (`"use client"`) for interactivity (scroll navigation, form handling, animations).

**Server Actions**: Form submission uses Next.js server actions pattern with `"use server"` directive.

**Image Optimization**: Use Next.js `<Image>` component with:
- `priority` prop for hero/above-fold images
- `loading="lazy"` for below-fold images
- Proper width/height for CLS prevention

**Smooth Scrolling**: Navigation uses `element.scrollIntoView({ behavior: "smooth" })` with section IDs.

## Adding New Components

When adding shadcn/ui components, they should be placed in `components/ui/` and use:
- The `cn()` utility from `@/lib/utils` for className merging
- Class Variance Authority (cva) for component variants
- Radix UI primitives where applicable
- Path aliases for imports

## CSS Custom Properties

Theme colors and design tokens are defined as CSS variables in `app/globals.css`. Both light and dark themes are configured (though the site primarily uses dark mode). When creating new components, reference these CSS variables rather than hardcoding colors.

## Contact Information

The site references these contact details (update in multiple locations when changed):
- Phone: (602) 799-5856
- Email: partylabaz@gmail.com
- Instagram: @partylabaz / https://instagram.com/partylabaz
- Facebook: https://www.facebook.com/people/Partylabaz/61579352249971
- Domain: partylabaz.com
