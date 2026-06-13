# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Description |
|:---|:---|
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Production build to `./dist/` (includes Pagefind index) |
| `pnpm preview` | Preview production build locally |
| `pnpm check` / `pnpm astro check` | Astro type-check |
| `pnpm type-check` | Strict TypeScript check (`tsc --noEmit --isolatedDeclarations`) |
| `pnpm format` | Format with Biome (`biome format --write ./src`) |
| `pnpm lint` | Lint+format with Biome (`biome check --write ./src`) |
| `pnpm new-post <filename>` | Scaffold a new post in `src/content/posts/` |

**Package manager is pnpm** (enforced via `preinstall`). `@waline/client` is a devDependency — its CSS/JS is imported inline, not bundled by Astro during SSR.

## Path aliases (tsconfig)

```
@components/*  → src/components/*
@utils/*       → src/utils/*
@i18n/*        → src/i18n/*
@layouts/*     → src/layouts/*
@constants/*   → src/constants/*
@assets/*      → src/assets/*
@/*            → src/*
```

## Architecture

### Rendering: Astro 5 + SWUP + Svelte 5 islands

- **Astro 5** renders static HTML. SWUP (`@swup/astro`) layers SPA-like page transitions on top.
- **SWUP containers** are `main#swup-container` and `#toc`. On navigation, SWUP replaces content inside them and fires lifecycle hooks defined in `src/layouts/Layout.astro`.
- **Inline scripts** with `data-swup-reload-script` are re-executed by SWUP on every navigation. Scripts without this attribute only run once on initial page load.
- **Interactive islands** use Svelte 5 components with Astro `client:*` directives. However, `client:visible` islands are **NOT** automatically re-hydrated after SWUP navigation — SWUP replaces the DOM but doesn't re-run Astro's hydration scripts. For components that must work across page navigations, either use the `data-swup-reload-script` pattern or listen for SWUP events inside the framework component.

### Component patterns

- **Svelte 5 runes are available** (`$state`, `$props`, `$effect`) but existing components mix legacy Svelte 4 syntax (`$:`, `export let`, `on:click`). New components should use Svelte 5 runes for new code.
- **`<script is:inline>`** prevents Astro from bundling the script — it's emitted as-is in the HTML. Used for scripts that need to survive Astro's build process (e.g., analytics, Waline).
- **`<style is:global>`** makes CSS rules apply to the whole page. Use for CSS custom property overrides on third-party components.
- **`ConfigCarrier.astro`** embeds the hue value as a `data-hue` attribute so client-side JS can read it without a network request.

### Content pipeline

Posts live in `src/content/posts/` as Astro content collections (schema: `src/content/config.ts`). The remark/rehype plugin stack in `astro.config.mjs` adds:
- **Math** — `remark-math` → `rehype-katex`
- **Admonitions** — `remark-github-admonitions-to-directives` → custom `rehype-components` renderer (`src/plugins/rehype-component-admonition.mjs`)
- **GitHub cards** — custom directive → `src/plugins/rehype-component-github-card.mjs`
- **Reading time / excerpts** — `src/plugins/remark-reading-time.mjs`, `src/plugins/remark-excerpt.js`
- **Sectionize** — wraps headings+siblings in `<section>` tags
- **Code blocks** — `astro-expressive-code` with collapsible sections, line numbers, custom copy button, and language badge plugins

`src/utils/content-utils.ts` provides `getSortedPosts()` (with prev/next links wired), `getSortedPostsList()` (metadata only), and `getCategoryList()`.

### Config system

All site configuration is exported from `src/config.ts` — `siteConfig`, `navBarConfig`, `profileConfig`, `commentConfig`, `licenseConfig`, etc. Types are in `src/types/config.ts`. The config is imported at build time; client-side settings (theme, hue) persist through `localStorage` via `src/utils/setting-utils.ts`.

### Styling

- **Tailwind CSS 3** with `@tailwindcss/typography` and custom CSS variables (`--hue`, `--primary`, `--card-bg`, `--line-divider`, etc.). Nesting is enabled.
- **Stylus** (`.styl`) for markdown content styles (`markdown-extend.styl`).
- **OverlayScrollbars** for custom scrollbars (`scrollbar.css`, initialized in Layout.astro).
- **PhotoSwipe** for image lightbox (initialized in Layout.astro).
- Theme is applied via `html.dark` class toggle; dark mode CSS uses `html.dark` selector.

### i18n

Key-value translations in `src/i18n/`. Keys are defined as an enum in `src/i18n/i18nKey.ts`. Usage: `i18n(I18nKey.someKey)`.

### Deploy target: Cloudflare Pages

`wrangler.jsonc` configures a static asset deployment from `./dist/`. The build command runs Pagefind for client-side search indexing.
