# Design Decisions

## Why SvelteKit?

**Decision**: Use SvelteKit as the framework.

**Rationale**:
- Svelte 5's runes provide elegant reactivity without boilerplate.
- SvelteKit's file-based routing scales cleanly for multiple pages.
- Static adapter with SPA fallback is perfect for GitHub Pages deployment.
- Smaller bundle size than React/Next due to compiler-driven approach.

**Alternatives Considered**:
- Next.js: Would require Vercel or a Node server; overkill for a static site.
- Astro: Great for static content, but Pokédex has dynamic client-side state (favorites, theme).
- Vanilla + frameworks: Would lose out on SSR/build-time optimizations and routing.

---

## Why Tailwind CSS v4?

**Decision**: Use Tailwind CSS v4 for layout and utilities; hand-write CSS for animations.

**Rationale**:
- Tailwind's utility classes rapidly build responsive layouts.
- Hand-written CSS for animations keeps them readable and allows `prefers-reduced-motion` override.
- Tailwind v4's `@tailwindcss/vite` plugin integrates cleanly with Vite.

**Alternatives Considered**:
- Styled-components / CSS-in-JS: Would increase runtime bundle size.
- Pure CSS: Would lose Tailwind's consistency and responsiveness helpers.
- Animate.css: Overkill for simple transitions; hand-crafted CSS is lighter and more controllable.

---

## Why Zod for Validation?

**Decision**: Use Zod to parse and validate PokeAPI responses.

**Rationale**:
- Runtime validation catches API schema changes or unexpected data.
- TypeScript integration: `.parse()` infers types automatically.
- Lightweight (~7KB gzipped) compared to Joi or Yup.
- Declarative schema definitions are easy to read and maintain.

**Alternatives Considered**:
- No validation: Risky; PokeAPI could change. Type assertions alone don't catch runtime mismatches.
- Runtime type guards: More verbose than Zod; harder to maintain.
- GraphQL: Overkill for a single REST API; adds complexity and external dependency.

---

## Why In-Memory Cache (not localStorage or IndexedDB)?

**Decision**: Use a simple `Map<URL, response>` in-memory cache.

**Rationale**:
- Session-only cache is sufficient; users expect fresh data on new sessions.
- Simpler than IndexedDB setup and no storage limits.
- Faster lookups than localStorage (no JSON parse/stringify).
- Avoids stale-data issues with IndexedDB syncing.

**Tradeoff**: Cache is cleared on page reload. Users browsing back/forth within a session get instant results; new visits fetch fresh data.

---

## Why Infinite Scroll?

**Decision**: Use IntersectionObserver-based infinite scroll instead of pagination.

**Rationale**:
- Modern, smooth UX; no button clicks needed.
- IntersectionObserver is efficient; doesn't spam network on scroll.
- Simplifies the UI (no page numbers or "next" buttons).
- Better on mobile: natural scrolling feels native.

**Tradeoff**: Harder to jump to a specific page; no "go to page 5" shortcut. For 1000+ Pokémon, it's acceptable.

---

## Why Svelte 5 Runes for Local State?

**Decision**: Use Svelte 5 runes (`$state`, `$effect`, `$derived`) for component state.

**Rationale**:
- Runes are reactive by default; no need for `reactive()` wrapper or three-statement lifecycle hooks.
- Less boilerplate than Vue Composition API or React hooks.
- Integrates seamlessly with Svelte's reactivity system.
- Clear signal that a variable is state (`$state`) vs. derived (`$derived`).

**Stores Only For**:
- Theme (needs persistence across pages)
- Favorites (needs persistence across sessions)

---

## Why Favorites via Set + localStorage?

**Decision**: Persist favorites as a Set of Pokémon names in localStorage.

**Rationale**:
- Set provides O(1) add/remove/check operations.
- localStorage is simple, no server needed.
- Serializable to JSON (stored as array, deserialized back to Set).
- Survives browser restarts.

**Alternatives Considered**:
- IndexedDB: Overkill; favorites list is small (~50-100 items max).
- Backend API: Would require a server; defeats the static-site goal.
- SessionStorage: Lost on browser close; bad UX.

---

## Why `prefers-reduced-motion`?

**Decision**: Respect `prefers-reduced-motion` media query for all animations.

**Rationale**:
- Accessibility requirement; some users experience motion sickness.
- Simple CSS rule: `@media (prefers-reduced-motion: reduce) { animation: none; }`.
- Costs nothing; benefits users with vestibular disorders.

---

## Why GitHub Pages + GitHub Actions?

**Decision**: Deploy to GitHub Pages with automated CI/CD via GitHub Actions.

**Rationale**:
- Free static hosting, integrated with GitHub repo.
- GitHub Actions is free for public repos; no external CI service needed.
- 404 fallback strategy enables SPA routing on static host.
- "Push to deploy" workflow is ideal for small projects.

**Alternatives Considered**:
- Vercel: Free tier available, but overkill for static content; designed for Next.js.
- Netlify: Also free, slightly better DX, but GitHub Pages is simpler (no external config).
- Self-hosted: Not worth the maintenance burden.

---

## Why `adapter-static` with `fallback: '404.html'`?

**Decision**: Use SvelteKit's static adapter configured to serve `404.html` as a fallback for all unmatched routes.

**Rationale**:
- Enables client-side routing on a static host.
- When browser requests `/pokemon/pikachu` (not prerendered), GitHub Pages serves `404.html`.
- `404.html` is actually the full SvelteKit app; JavaScript hydrates and routes.
- All dynamic routes (`/pokemon/[name]`, `/berries/[name]`, `/favorites`) work without a server.

**SSR=false Setting**:
- Disabled because all rendering is client-side.
- Reduces build size; no Node.js runtime code included.

---

## Why Lefthook (not Husky)?

**Decision**: Use Lefthook for git hooks.

**Rationale**:
- Faster than Husky; written in Go, minimal overhead.
- Language-agnostic; works with any project setup.
- `lefthook.yml` is simple and clear.

**Hooks Configured**:
- **pre-commit**: lint, format, typecheck on staged files
- **pre-push**: run full test suite

---

## Why Biome (via Ultracite)?

**Decision**: Use Biome for linting and formatting via Ultracite.

**Rationale**:
- Biome is a Rust-based, all-in-one linter + formatter; much faster than ESLint + Prettier.
- Ultracite provides a CLI wrapper and sensible defaults for Svelte/TypeScript.
- Single configuration file; no need to juggle .eslintrc, .prettierrc, etc.

---

## Why Vitest + Playwright (not Jest + Cypress)?

**Decision**: Use Vitest for unit tests and Playwright for e2e tests.

**Rationale**:
- **Vitest**: Vite-native test runner; uses same config as dev environment. Faster than Jest.
- **Playwright**: Cross-browser e2e testing; very fast and reliable. Integrates with Vite.
- Both are modern, lightweight, and well-maintained.

**What We Test**:
- Unit: Utility functions, store logic
- E2E: User flows (search, filter, navigate detail, toggle favorites, theme)

---

## Why Not Server-Side Rendering?

**Decision**: Render everything client-side (CSR only).

**Rationale**:
- All content depends on client-side state (favorites, theme).
- PokeAPI is public and fast; no benefit to pre-fetching on server.
- Static deployment simplifies hosting; no Node.js server needed.
- GitHub Pages doesn't support dynamic servers.

**Tradeoff**: Slightly slower first paint (JS must hydrate), but acceptable for a data-rich app like this.

---

## Summary Table

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | SvelteKit | Svelte 5 runes, static adapter, small bundle |
| Styling | Tailwind + CSS | Utilities + custom animations, respects prefers-reduced-motion |
| Validation | Zod | Type safety at API boundary, lightweight |
| Caching | In-memory Map | Fast, session-scoped, simple |
| Lists | Infinite scroll | Modern UX, efficient loading |
| State | Runes + stores | Runes for local, stores for globals (theme, favorites) |
| Persistence | localStorage | Simple, sufficient for favorites + theme |
| Rendering | CSR only | Matches static deployment, all state is client-side |
| Deploy | GitHub Pages + Actions | Free, integrated, "push to deploy" |
| Hooks | Lefthook | Fast, language-agnostic |
| Linting | Biome | All-in-one, Rust-fast, Svelte-aware |
| Testing | Vitest + Playwright | Vite-native, modern, reliable |
