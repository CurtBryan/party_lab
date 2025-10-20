# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5 application using the App Router, React 19, TypeScript, and Tailwind CSS v4. The project uses Turbopack for faster builds and development. It includes shadcn/ui components (New York style) for the UI component library.

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
  - `page.tsx` - Main page component
  - `layout.tsx` - Root layout with Geist fonts
  - `globals.css` - Global styles with Tailwind and custom CSS variables
- `components/` - React components
  - `ui/` - shadcn/ui component library (e.g., Button)
- `lib/` - Utility functions
  - `utils.ts` - Contains `cn()` for merging Tailwind classes

### Styling System

The project uses **Tailwind CSS v4** with the new configuration format:
- Styles are defined in `app/globals.css` using `@import` and `@theme inline`
- CSS variables define the design system (colors, radius, etc.)
- Dark mode uses a custom variant: `@custom-variant dark (&:is(.dark *))`
- Base color scheme: neutral
- Border radius: 0.625rem (10px)
- Colors use OKLCH color space for better perceptual uniformity

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

### TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- Path alias: `@/*` maps to project root

### Fonts

The project uses Vercel's Geist font family loaded via `next/font`:
- Geist Sans (variable: `--font-geist-sans`)
- Geist Mono (variable: `--font-geist-mono`)

## Key Dependencies

- **UI Framework**: React 19.1.0, Next.js 15.5.3
- **Styling**: Tailwind CSS v4, tw-animate-css
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Adding New Components

When adding shadcn/ui components, they should be placed in `components/ui/` and use:
- The `cn()` utility from `@/lib/utils` for className merging
- Class Variance Authority (cva) for component variants
- Radix UI primitives where applicable
- Path aliases for imports

## CSS Custom Properties

Theme colors and design tokens are defined as CSS variables in `app/globals.css`. Both light and dark themes are configured. When creating new components, reference these CSS variables rather than hardcoding colors.
