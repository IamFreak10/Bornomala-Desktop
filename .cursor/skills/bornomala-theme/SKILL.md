---
name: bornomala-theme
description: >-
  Apply Bornomala frontend light/dark theme tokens, Tailwind semantic classes,
  brand/navbar colors, and component styling rules from src/index.css. Use when
  designing UI, building React components, styling pages, choosing colors,
  implementing dark mode, writing Tailwind classes, or editing Hero/Navbar/
  marketing layouts in the Bornomala frontend.
---

# Bornomala Theme Design System

Source of truth: `src/index.css` (`:root` = light, `.dark` = dark).  
Theme toggle sets `class="dark"` on `<html>` via `ThemeProvider`.

## Hard rules

1. **Never hardcode** `bg-white`, `text-slate-*`, `bg-orange-*`, `#hex`, or light-only palettes in components.
2. **Use semantic tokens** (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, etc.).
3. **Brand tokens** (`brand-*`) are accents only — not full page backgrounds.
4. **Navbar tokens** (`navbar-*`) only inside the header / nav.
5. Prefer fixing tokens in `index.css` over scattering `dark:` overrides.
6. After styling: mentally toggle dark mode — surfaces must still look intentional.

## Decision table

| Need | Tailwind classes |
|------|------------------|
| Page / section bg | `bg-background` |
| Main / heading text | `text-foreground` |
| Helper / secondary text | `text-muted-foreground` |
| Card / panel | `bg-card text-card-foreground border-border` |
| Dropdown / menu | `bg-popover text-popover-foreground` |
| Primary CTA | `bg-primary text-primary-foreground` |
| Soft / secondary control | `bg-secondary text-secondary-foreground` or `bg-card border-border hover:bg-accent` |
| Quiet inset / placeholder | `bg-muted text-muted-foreground` |
| Hover wash | `hover:bg-accent hover:text-accent-foreground` |
| Danger | `bg-destructive text-white` |
| Focus | `focus-visible:ring-ring` |
| Brand orange accent | `text-brand-saffron`, `bg-brand-saffron/10`, `border-brand-saffron/25` |
| Brand blue | `text-brand-navy`, `text-brand-blue`, `bg-brand-sky/20` |

## Component skeleton

```jsx
<section className="bg-background text-foreground">
  <h2 className="text-foreground">Title</h2>
  <p className="text-muted-foreground">Support copy</p>
  <div className="rounded-xl border border-border bg-card p-4 text-card-foreground">
    Content
  </div>
  <button className="rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">
    Primary
  </button>
  <button className="rounded-xl border border-border bg-card px-4 py-2 text-foreground hover:bg-accent">
    Secondary
  </button>
  <span className="rounded-full border border-brand-saffron/25 bg-brand-saffron/10 px-3 py-1 text-sm text-brand-saffron">
    Badge
  </span>
</section>
```

## Pairing rule

Always pair fill + text:

- `bg-primary` → `text-primary-foreground`
- `bg-card` → `text-card-foreground` (or `text-foreground`)
- `bg-muted` → `text-muted-foreground`
- `bg-destructive` → light text (`text-white`)

## Do not use

```
bg-white  bg-[#FAFAF8]  text-slate-900  text-slate-600
bg-orange-600  text-orange-700  border-slate-200  bg-amber-*
```

## Reference files

- Full light/dark hex + class map: [reference.md](reference.md)
- Applied examples (Hero pattern): [examples.md](examples.md)
- Visual PDF for humans: `docs/Bornomala-Theme-Cheat-Sheet.pdf`
