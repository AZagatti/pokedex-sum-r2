# Architecture

## Overview

This Pokédex is a single-page application (SPA) built with SvelteKit and deployed as static HTML/CSS/JS to GitHub Pages. All data fetching happens client-side via the PokéAPI.

## High-Level Data Flow

```
Browser (SvelteKit app)
  ↓
[Svelte Components]
  ↓
[Store: favorites, theme]
  ↓
[API layer with cache]
  ↓
[PokéAPI (https://pokeapi.co/api/v2)]
```

## Project Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── index.ts         # High-level fetch wrappers (fetchPokemon*, fetchBerry*)
│   │   ├── cache.ts         # In-memory Map-based cache
│   │   └── schemas.ts       # Zod validation schemas
│   ├── components/
│   │   ├── PokemonCard.svelte       # Grid card for Pokémon list/favorites
│   │   ├── PokemonCardSkeleton.svelte # Loading skeleton
│   │   ├── PokemonImage.svelte       # Image with lazy loading fallback
│   │   └── TypeBadge.svelte          # Type badge with color coding
│   ├── stores/
│   │   ├── theme.ts         # Light/dark theme (persisted to localStorage)
│   │   └── favorites.ts     # Set of favorited Pokémon names (localStorage)
│   └── utils.ts             # Utilities: typeColors, capitalizeFirst, getPokemonNumber
├── routes/
│   ├── +layout.svelte       # Root layout (header, nav, footer, theme toggle)
│   ├── +layout.ts           # CSR + SSR config (CSR=true, SSR=false)
│   ├── +page.svelte         # List page with infinite scroll, search, filters
│   ├── +page.ts             # Prerender config
│   ├── +error.svelte        # 404 error page
│   ├── pokemon/
│   │   └── [name]/
│   │       └── +page.svelte # Detail page (stats, abilities, moves, evolutions)
│   ├── berries/
│   │   ├── +page.svelte     # Berries list
│   │   └── [name]/
│   │       └── +page.svelte # Berry detail
│   └── favorites/
│       └── +page.svelte     # Favorited Pokémon grid
├── app.html                 # HTML template (title, meta, favicon)
└── app.d.ts                 # TypeScript declarations

static/
└── robots.txt               # SEO

build/                       # (Generated) Static HTML output
├── index.html               # Root (rendered by SvelteKit)
├── 404.html                 # SPA fallback (served for all unknown routes)
├── pokedex-sum-r2/          # Base path for GitHub Pages
└── _app/                    # Bundled JS/CSS
```

## Key Architectural Decisions

### 1. Static Adapter with SPA Mode

- **Why**: GitHub Pages requires static files. SvelteKit's `adapter-static` with `fallback: '404.html'` enables client-side routing for dynamic routes.
- **Tradeoff**: All route resolution happens in the browser; no server-side rendering.

### 2. In-Memory Cache

- **Why**: PokeAPI has rate limits (max ~20 req/sec). Caching responses reduces redundant calls when users navigate back and forth.
- **Implementation**: Simple `Map<URL, response>` in `cache.ts`. Cleared on page reload.
- **Tradeoff**: No persistent caching; users see fresh data on new sessions.

### 3. Zod Validation

- **Why**: Ensures type safety at the boundary. Catches API schema changes early.
- **Implementation**: One schema per API endpoint shape.

### 4. Svelte 5 Runes

- **Why**: Svelte 5's reactive runes are the modern syntax for state management, replacing stores where possible.
- **Stores**: Used only for global state (theme, favorites) that needs persistence.

### 5. Infinite Scroll via IntersectionObserver

- **Why**: Performant, battery-efficient, no manual pagination needed.
- **Implementation**: Sentinel div at the end of the list; when it enters the viewport, load more.

### 6. Tailwind + Hand-Crafted CSS

- **Why**: Tailwind handles layout/utilities; custom CSS for animations (transitions, keyframes) keeps animations readable and respects `prefers-reduced-motion`.

## Caching Strategy

```typescript
// src/lib/api/cache.ts
const cache = new Map<string, any>();

export function getCached<T>(url: string, fetcher: () => Promise<T>): Promise<T> {
  if (cache.has(url)) return Promise.resolve(cache.get(url));
  return fetcher().then(data => {
    cache.set(url, data);
    return data;
  });
}
```

- **Keyed by**: Full API URL
- **Persists for**: Entire session (cleared on reload)
- **Used by**: All `fetch*` functions in `api/index.ts`

## Route Structure

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Dynamic (CSR) | List page with infinite scroll + filters |
| `/pokemon/[name]` | Dynamic (CSR) | Detail page for a specific Pokémon |
| `/berries` | Dynamic (CSR) | Berries list page |
| `/berries/[name]` | Dynamic (CSR) | Berry detail page |
| `/favorites` | Dynamic (CSR) | Favorited Pokémon grid |

All routes are rendered client-side because the list is infinite and detail routes depend on URL params.

## State Management

### Stores

```typescript
// theme.ts
export const themeStore = writable<'light' | 'dark'>(loadTheme());
themeStore.subscribe(theme => saveTheme(theme)); // Persist

// favorites.ts  
export const favoritesStore = {
  add(name: string) { ... },
  remove(name: string) { ... },
  isFavorite(name: string) { ... },
  subscribe(cb: (faves: Set<string>) => void) { ... }
}
```

### Local State

Component-level state uses Svelte 5 runes:
```svelte
<script>
  let pokemonList = $state([]);
  let isLoading = $state(false);
</script>
```

## Performance

- **Code splitting**: SvelteKit automatically splits by route
- **Image optimization**: PokeAPI serves optimized sprites; we apply `max-width: 100%`
- **Lazy loading**: Details pages load evolution chain on-demand
- **Debounced search**: 250ms debounce on search input
- **Skeleton loaders**: Provide visual feedback during infinite scroll loads

## Accessibility

- **Keyboard navigation**: All interactive elements are keyboard-accessible
- **ARIA labels**: Cards, buttons, and icons have descriptive labels
- **Focus visible**: Outline on focused elements
- **Reduced motion**: CSS respects `prefers-reduced-motion` media query
- **Semantic HTML**: Proper heading hierarchy, alt text on images

## Deployment

1. Push to `main`
2. GitHub Actions workflow runs (`.github/workflows/ci.yml`)
3. Tests pass
4. Build runs: `npm run build` → outputs to `build/`
5. Deploy pages action uploads to GitHub Pages
6. Live at `https://azagatti.github.io/pokedex-sum-r2/`

The `404.html` file ensures all unknown routes fall back to the SPA shell, which hydrates and routes client-side.
