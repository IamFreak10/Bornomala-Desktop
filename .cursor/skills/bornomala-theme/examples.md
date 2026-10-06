# Bornomala Theme — Examples

## Hero (canonical)

File: `src/components/Landing/Hero.jsx`

| Element | Classes |
|---------|---------|
| Section | `bg-background` |
| Glow | `bg-brand-saffron/20`, `bg-brand-sky/30` |
| Badge | `border-brand-saffron/25 bg-brand-saffron/10 text-brand-saffron` |
| H1 | `text-foreground` |
| Gradient span | `from-brand-saffron to-brand-blue bg-clip-text text-transparent` |
| Body | `text-muted-foreground` |
| Primary CTA | `bg-primary text-primary-foreground` |
| Secondary CTA | `border-border bg-card text-foreground hover:bg-accent` |
| Media frame | `border-border bg-card/70` |
| Placeholder | `border-border bg-muted/70 text-muted-foreground` |

## Navbar action icon

```jsx
className="rounded-full p-2 text-navbar-top-muted hover:bg-navbar-icon-btn hover:text-navbar-top-hover"
```

## Mode toggle (in navbar)

```jsx
className="h-9 w-9 rounded-full text-navbar-top-muted hover:bg-navbar-icon-btn hover:text-navbar-top-hover"
```

## Before → After map

| Never | Use instead |
|-------|-------------|
| `bg-[#FAFAF8]` / `bg-white` | `bg-background` / `bg-card` |
| `text-slate-900` | `text-foreground` |
| `text-slate-600` | `text-muted-foreground` |
| `bg-orange-600` | `bg-primary` or `bg-brand-saffron` |
| `text-orange-700` | `text-brand-saffron` |
| `border-slate-200` | `border-border` |
| `bg-slate-100` | `bg-muted` |
| `hover:bg-slate-50` | `hover:bg-accent` |

## New page checklist

1. Section: `bg-background text-foreground`
2. Titles: `text-foreground`
3. Copy: `text-muted-foreground`
4. Boxes: `bg-card border-border`
5. CTAs: `bg-primary text-primary-foreground`
6. Accents: `brand-saffron` / `brand-navy` sparingly
7. Toggle dark mode and verify contrast
