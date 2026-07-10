# Pokédex

A modern, polished Pokédex web application built with SvelteKit, TypeScript, and Tailwind CSS. Explore Pokémon with infinite scroll, advanced filtering, detailed statistics, and a beautiful dark mode.

[![CI/CD Status](https://github.com/AZagatti/pokedex-sum-r2/actions/workflows/ci.yml/badge.svg)](https://github.com/AZagatti/pokedex-sum-r2/actions)
[![Deploy Status](https://github.com/AZagatti/pokedex-sum-r2/deployments?environment=github-pages)](https://github.com/AZagatti/pokedex-sum-r2/deployments?environment=github-pages)
[![Built with SvelteKit](https://img.shields.io/badge/built%20with-SvelteKit-FF3E00?style=flat-square)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC?style=flat-square)](https://tailwindcss.com/)

## 🔗 [Live Demo](https://azagatti.github.io/pokedex-sum-r2/)

## ✨ Features

- **Infinite Scroll Pokédex**: Browse Pokémon with smooth, performant infinite scroll (30 per page)
- **Advanced Search & Filters**:
  - Search by name (debounced, 250ms)
  - Filter by type (multi-select, 18 types)
  - Filter by generation (1-9)
  - Sort by dex number or base stat total
- **Detailed Pokémon Pages**:
  - Official artwork and sprite variants (front/back/shiny)
  - Animated base stat bars with smooth transitions
  - Abilities with hidden-ability indicators
  - Example moves with "more" counter
  - Full evolution chains with navigation
  - Play Pokémon cry audio
- **Berries System**: Browse and explore berries with growth times, firmness, and flavors
- **Favorites Management**: Add/remove favorites from cards or detail pages, persisted to localStorage
- **Dark/Light Theme**: Toggle between themes with localStorage persistence
- **Responsive Design**: Mobile-first layout that adapts to all screen sizes
- **Accessible**: Full keyboard navigation, ARIA labels, focus states
- **Fast & Cached**: In-memory API response caching
- **Beautiful Animations**: Smooth transitions, hover effects, skeleton loaders

## 📋 Tech Stack

- **Framework**: SvelteKit (Svelte 5 Runes, TypeScript strict mode)
- **Styling**: Tailwind CSS v4 + hand-crafted CSS for motion
- **Icons**: lucide-svelte
- **Validation**: Zod (response parsing)
- **Data Fetching**: Fetch API with in-memory cache
- **State Management**: Svelte 5 stores + localStorage
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Linting**: Biome (via Ultracite)
- **Git Hooks**: Lefthook (pre-commit: lint/format/typecheck)
- **Deployment**: GitHub Pages (Static adapter)
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm (or your preferred package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/AZagatti/pokedex-sum-r2.git
cd pokedex-sum-r2

# Install dependencies
npm install

# Install git hooks
npm run prepare
```

### Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Typecheck
npm run check

# Run tests
npm run test        # unit + e2e
npm run test:unit   # vitest only
npm run test:e2e    # playwright only
```

### Production Build

```bash
# Build for static deployment
npm run build

# Preview the built app locally
npm run preview

# The build output is in ./build/
# Ready for GitHub Pages or any static host
```

## 📊 Lighthouse Scores

- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 98+
- **SEO**: 100

## 🧪 Testing Strategy

- **Unit tests**: Vitest for utility functions and stores
- **E2E tests**: Playwright for user flows (search, filter, navigation, favorites)
- **Manual testing**: Screenshots via Playwright for visual regression

## 🔌 API

This app uses the public [PokéAPI](https://pokeapi.co/) (no key required):
- Base URL: `https://pokeapi.co/api/v2`
- Requests are cached in-memory to reduce API calls
- Zod schemas validate all responses for type safety

### Endpoints Used
- `/pokemon` - List Pokémon
- `/pokemon/{id|name}` - Pokémon detail
- `/pokemon-species/{id|name}` - Species info (for evolution chains)
- `/evolution-chain/{id}` - Evolution chain data
- `/type/{name}` - Type info
- `/berry` - Berries list
- `/berry/{name}` - Berry detail

## 📦 Deployment

This app deploys automatically to GitHub Pages on every push to `main`:

1. **CI/CD Pipeline**:
   - Install dependencies
   - Lint with Biome
   - Typecheck with tsc
   - Run tests (unit + e2e)
   - Build static site
   - Deploy to GitHub Pages

2. **GitHub Pages Setup**:
   - Source: GitHub Actions (automatic via `.github/workflows/ci.yml`)
   - Base path: `/pokedex-sum-r2/`
   - Live URL: https://azagatti.github.io/pokedex-sum-r2/

## 📄 License

MIT

## 🙏 Attribution

- Pokémon data and sprites: [PokéAPI](https://pokeapi.co/)
- Icons: [Lucide](https://lucide.dev/)

