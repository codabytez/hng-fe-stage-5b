# Lisan al Gaib — Developer Portfolio

An immersive, interactive developer portfolio built with **SvelteKit** featuring a real interactive terminal, particle animations, scroll-triggered reveals, and full dark/light theming.

## Quick Start

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:5174](http://localhost:5174).

## Architecture

```
src/
├── routes/
│   ├── +layout.svelte    # Root layout: Nav + Terminal + Footer
│   └── +page.svelte      # Single-page composition of all sections
└── lib/
    ├── components/
    │   ├── Hero.svelte       # Canvas particle system + typing animation
    │   ├── About.svelte      # Bio + stats card
    │   ├── Skills.svelte     # Animated skill bars by category
    │   ├── Projects.svelte   # Filterable project cards
    │   ├── Contact.svelte    # Validated contact form
    │   ├── Terminal.svelte   # Interactive CLI (main creative feature)
    │   ├── Nav.svelte        # Fixed nav with active-section tracking
    │   └── ThemeToggle.svelte
    ├── stores/
    │   ├── theme.ts          # Dark/light mode with localStorage persistence
    │   └── terminal.ts       # Terminal open/close state
    └── data/
        ├── projects.ts       # Project data
        └── skills.ts         # Skill categories & proficiency levels
```

## Key Features

### Interactive Terminal (Creative Feature)
The floating `$` button (bottom-right) or the navbar "terminal" button opens a fully functional CLI:

| Command | Description |
|---|---|
| `help` | List all commands |
| `whoami` | Display developer info |
| `ls` | List portfolio sections |
| `cd <section>` | Navigate to a section |
| `projects` | List all projects |
| `open <id>` | View project details |
| `skills` | Jump to skills section |
| `contact` | Show contact info |
| `theme dark\|light` | Switch theme |
| `git log` | Easter egg 🥚 |
| `sudo` | Another easter egg |

Supports: **↑↓ command history**, **Tab completion**, **Escape to close**.

### Animation Decisions
- **Hero entrance**: CSS `@keyframes` with staggered `animation-delay` — zero JS overhead on first paint
- **Particle system**: Canvas API (`requestAnimationFrame`) with 80 particles and proximity-based connecting lines
- **Typewriter**: Custom interval-based typing loop (no lib dependency)
- **Skill bars**: CSS `transition: width 1s` triggered by `IntersectionObserver` — GPU-composited, no layout thrash
- **Section reveals**: `IntersectionObserver` + CSS `opacity/transform` transitions for scroll-triggered entrance

### Performance Optimizations
- No heavy animation library (GSAP optional, not imported in final build)
- `requestAnimationFrame` for particle loop with cleanup on unmount
- `passive: true` on scroll listeners
- Fonts via Google Fonts with `display=swap`
- SvelteKit SSR for initial HTML payload
- Route-level code splitting via SvelteKit's adapter

### Accessibility
- **Skip link**: "Skip to main content" visible on focus
- **Semantic HTML**: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **ARIA**: `role="dialog"`, `aria-modal`, `aria-live`, `aria-expanded`, `aria-label`, `aria-invalid`
- **Focus management**: Terminal input is focused on open; `focus-visible` styles on all interactive elements
- **Reduced motion**: `@media (prefers-reduced-motion)` disables all transitions/animations
- **Keyboard navigation**: Full keyboard support — Tab, Enter, Escape, Arrow keys
- **Screen reader**: `aria-live="polite"` on typewriter text and terminal output

### Theming
- Persisted to `localStorage` and applied via `class="dark"` on `<html>`
- CSS custom properties (`--accent`, `--surface`, etc.) for instant zero-flash switching
- System preference detection on first load via `prefers-color-scheme`

## Trade-offs

| Decision | Rationale |
|---|---|
| Single-page vs multi-route | Smoother scroll UX; avoids page-load flicker between sections |
| Canvas particles vs CSS | Canvas gives more control over density/connections; acceptable perf on modern hardware |
| No GSAP import | Keeps bundle lean; native CSS transitions cover 95% of needs |
| Formspree placeholder | Avoids exposing secrets in public repo; drop-in replacement for real endpoint |

## Deployment

```bash
pnpm build
```

Deploy the `.svelte-kit/output` directory to **Vercel**, **Netlify**, or **Cloudflare Pages** — `@sveltejs/adapter-auto` detects the platform automatically.

For Vercel:
```bash
vercel --prod
```
