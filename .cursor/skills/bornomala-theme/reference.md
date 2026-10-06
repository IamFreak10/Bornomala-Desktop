# Bornomala Theme — Full Token Reference

Values from `src/index.css`. Tailwind classes map via `@theme inline`.

## Semantic UI tokens

| Role | Tailwind | Light | Dark |
|------|----------|-------|------|
| Page canvas | `bg-background` | `#faf8f4` | `#0a121c` |
| Main text | `text-foreground` | `oklch(0.28 0.04 250)` | `#efe9df` |
| Card surface | `bg-card` | `#ffffff` | `#121c28` |
| Card text | `text-card-foreground` | same as fg | `#efe9df` |
| Popover | `bg-popover` | `#ffffff` | `#121c28` |
| Popover text | `text-popover-foreground` | same as fg | `#efe9df` |
| Primary CTA | `bg-primary` | `#23588e` (navy) | `#3d7ab5` |
| On primary | `text-primary-foreground` | `#ffffff` | `#ffffff` |
| Secondary | `bg-secondary` | `#f4efe6` | `#152231` |
| On secondary | `text-secondary-foreground` | `#1b3a5b` | `#efe9df` |
| Muted fill | `bg-muted` | soft cream-gray | `#152231` |
| Muted text | `text-muted-foreground` | mid gray-blue | `#93a4b8` |
| Accent / hover | `bg-accent` | sky + white mix | `#1a2a3c` |
| On accent | `text-accent-foreground` | `#1b3a5b` | `#efe9df` |
| Destructive | `bg-destructive` | red oklch | brighter red |
| Border | `border-border` | warm light | white 14% |
| Input | `border-input` / `bg-input` | warm light | white 18% |
| Focus ring | `ring-ring` | `#1d6aa5` | `#4a8fc4` |

### Dark surface stack

```
#0a121c  background  (deepest)
#121c28  card / popover
#152231  muted / secondary / paper
#1a2a3c  accent hover
```

## Brand tokens

| Token | Tailwind | Light | Dark | Use |
|-------|----------|-------|------|-----|
| Navy | `brand-navy` | `#23588e` | `#3d7ab5` | Strong brand blue |
| Blue | `brand-blue` | `#1d6aa5` | `#4a8fc4` | Links, mid blue |
| Sky | `brand-sky` | `#9ac2db` | `#7eb0d0` | Soft glow |
| Saffron | `brand-saffron` | `#ea8024` | `#f0953a` | Orange accent |
| Cream | `brand-cream` | `#fbf8f3` | `#1a2533` | Prefer `background` for pages |
| Ink | `brand-ink` | `#1b3a5b` | `#e8eef4` | Or use `foreground` |
| Paper | `brand-paper` | `#f4efe6` | `#152231` | Soft paper |

### Safe opacity recipes

- Badge: `bg-brand-saffron/10 border-brand-saffron/25 text-brand-saffron`
- Glow: `bg-brand-saffron/20` or `bg-brand-sky/30`
- Gradient word: `from-brand-saffron to-brand-blue bg-clip-text text-transparent`

## Navbar tokens (header only)

| Tailwind | Light | Dark |
|----------|-------|------|
| `bg-navbar-top` | `#f7f3ec` | `#101a27` |
| `text-navbar-top-fg` | ink | `#efe9df` |
| `text-navbar-top-muted` | muted ink | cream 78% |
| `hover:text-navbar-top-hover` | navy | `#ffffff` |
| `bg-navbar-surface` | `#fffdfa` | `#152231` |
| `text-navbar-link` | ink | `#efe9df` |
| `text-navbar-link-muted` | `#5a6f82` | `#93a4b8` |
| `border-navbar-border` | navy on warm | sky on dark |
| `bg-navbar-accent` | saffron | saffron |
| `text-navbar-accent-fg` | `#ffffff` | `#0a121c` |
| `bg-navbar-icon-btn` | navy 9% | white 10% |
| `bg-navbar-actions` | sky wash | white 8% |
| `bg-navbar-logo-stage` | cream white | `#f4efe6` (stays light) |

## Sidebar / charts

| Token | Notes |
|-------|-------|
| `bg-sidebar` | Cream light / `#121c28` dark |
| `bg-sidebar-primary` | Navy light / saffron dark |
| `bg-chart-1` … `bg-chart-5` | Brand sequence for charts |

## Radius

`--radius: 0.625rem` → `rounded-sm` … `rounded-4xl` via theme scale.

## Typography

- Body UI Bangla: `'Hind Siliguri', sans-serif` on `body`
- Sans token: Geist Variable (`font-sans`)

## Theme mechanism

- Class strategy: `@custom-variant dark (&:is(.dark *));`
- Provider: `src/components/theme-provider.jsx`
- Storage key: `vite-ui-theme` (`light` | `dark` | `system`)
- FOUC script in `index.html` sets class before paint
- `color-scheme: light|dark` for native controls
