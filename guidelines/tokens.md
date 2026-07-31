# Tokens & CSS

The active design tokens for this project live in **`src/styles/theme.css`**. They are shadcn-style semantic tokens defined as CSS custom properties on `:root` (light) and `.dark` (dark), then mapped to Tailwind v4 utilities via `@theme inline`.

The user updates styling by editing `src/styles/theme.css`. All generated UI MUST consume tokens through the Tailwind utilities listed below — never hardcode hex/rgb/oklch values, and never set raw `font-size`, `font-weight`, `line-height`, `border-radius`, or `color` to literals.

```tsx
// DO — semantic, dark-mode safe, user-editable
<div className="bg-card text-card-foreground border border-border rounded-lg p-4" />

// DON'T — hardcoded
<div style={{ background: "#ffffff", color: "#030213", padding: 16 }} />
<div className="bg-white text-black border-gray-200" />
```

> Note: `@figma/astraui` is installed and exposes a different token vocabulary (`bg-brand-tertiary`, `text-text-primary`, etc.). When using bare `@figma/astraui` components, let them style themselves. For all **custom** UI and wrappers, use the shadcn-style tokens defined below — they are the source of truth for the project.

## Token format

- **Definition**: CSS variables in `:root { … }` and `.dark { … }` inside `src/styles/theme.css`.
- **Tailwind mapping**: `@theme inline { --color-foo: var(--foo); }` exposes each variable as a Tailwind utility.
- **Consumption**: Tailwind utility classes (`bg-*`, `text-*`, `border-*`, `ring-*`, `rounded-*`).
- **Dark mode**: opt-in via the `.dark` class on `<html>`; the `dark:` variant works because `theme.css` declares `@custom-variant dark (&:is(.dark *));`.

## Color tokens

Every color is a semantic pair (`<role>` for the surface, `<role>-foreground` for text/icons on that surface).

### Surfaces & text

| Variable | Tailwind utility | Use for |
|---|---|---|
| `--background` / `--foreground` | `bg-background` / `text-foreground` | Page canvas + default body text (applied by base layer on `<body>`) |
| `--card` / `--card-foreground` | `bg-card` / `text-card-foreground` | Cards, panels, raised surfaces |
| `--popover` / `--popover-foreground` | `bg-popover` / `text-popover-foreground` | Popovers, menus, dropdowns, tooltips |
| `--muted` / `--muted-foreground` | `bg-muted` / `text-muted-foreground` | Subtle bg fills; secondary/helper text |
| `--accent` / `--accent-foreground` | `bg-accent` / `text-accent-foreground` | Hover and selected states |

### Actions & status

| Variable | Tailwind utility | Use for |
|---|---|---|
| `--primary` / `--primary-foreground` | `bg-primary` / `text-primary-foreground` | Primary buttons, primary accents |
| `--secondary` / `--secondary-foreground` | `bg-secondary` / `text-secondary-foreground` | Secondary buttons, secondary accents |
| `--destructive` / `--destructive-foreground` | `bg-destructive` / `text-destructive-foreground` | Errors, delete actions |

### Borders, inputs, focus

| Variable | Tailwind utility | Use for |
|---|---|---|
| `--border` | `border-border` | All borders (separators, card outlines, dividers) |
| `--input` | `border-input` | Form input borders |
| `--input-background` | `bg-input-background` | Form input fill (light mode `#f3f3f5`) |
| `--switch-background` | `bg-switch-background` | Switch off-state track |
| `--ring` | `ring-ring`, `outline-ring` | Focus rings (default 50% opacity via base layer) |

The base layer applies `* { @apply border-border outline-ring/50; }` — bare borders and focus outlines already use the correct tokens.

### Charts

| Variable | Tailwind utility |
|---|---|
| `--chart-1` … `--chart-5` | `bg-chart-1` / `text-chart-5` etc. |

Use these for chart series colors (recharts, etc.). Do not reach for arbitrary palette colors.

### Sidebar

A dedicated sub-palette for sidebar surfaces:

| Variable | Tailwind utility |
|---|---|
| `--sidebar` / `--sidebar-foreground` | `bg-sidebar` / `text-sidebar-foreground` |
| `--sidebar-primary` / `--sidebar-primary-foreground` | `bg-sidebar-primary` / `text-sidebar-primary-foreground` |
| `--sidebar-accent` / `--sidebar-accent-foreground` | `bg-sidebar-accent` / `text-sidebar-accent-foreground` |
| `--sidebar-border` | `border-sidebar-border` |
| `--sidebar-ring` | `ring-sidebar-ring` |

### Color decision tree

| Need | Class |
|---|---|
| Page canvas | `bg-background` (applied to `<body>` by base layer) |
| Card / panel surface | `bg-card text-card-foreground` |
| Popover / dropdown / menu / tooltip | `bg-popover text-popover-foreground` |
| Primary action | `bg-primary text-primary-foreground` |
| Secondary action | `bg-secondary text-secondary-foreground` |
| Destructive action | `bg-destructive text-destructive-foreground` |
| Hover / selected row | `bg-accent text-accent-foreground` |
| Helper / disabled text | `text-muted-foreground` |
| Muted background tint | `bg-muted` |
| Divider / outline | `border-border` |
| Input field | `bg-input-background border border-input` |
| Focus ring | `ring-ring` (with `ring-2 ring-offset-2`) |
| Sidebar surface | `bg-sidebar text-sidebar-foreground` |

## Typography

`theme.css` styles bare HTML elements inside `@layer base`. Because the rules are in `base`, Tailwind utilities still override them — but you should rarely need to override.

| Element | Font size | Font weight |
|---|---|---|
| `html` | `var(--font-size)` (16px) | — |
| `h1` | `var(--text-2xl)` | `--font-weight-medium` (500) |
| `h2` | `var(--text-xl)` | `--font-weight-medium` |
| `h3` | `var(--text-lg)` | `--font-weight-medium` |
| `h4` | `var(--text-base)` | `--font-weight-medium` |
| `label` | `var(--text-base)` | `--font-weight-medium` |
| `button` | `var(--text-base)` | `--font-weight-medium` |
| `input` | `var(--text-base)` | `--font-weight-normal` (400) |
| `p`, span, etc. | inherited (`--text-base`, weight `normal`) | — |

Line height is `1.5` for all base elements.

### Font weights

Only two are defined:

| Variable | Value | Tailwind |
|---|---|---|
| `--font-weight-normal` | 400 | `font-normal` |
| `--font-weight-medium` | 500 | `font-medium` |

Do NOT introduce 300, 600, 700, 800, or 900.

### Font family

`src/styles/fonts.css` is currently empty — no `@font-face` rules and no `--font-family` override. That means the system uses the Tailwind v4 / browser default sans stack inherited via `font-sans`. For typography, **ONLY use the font faces declared in `src/styles/fonts.css`**:

- Do NOT `@import url('https://fonts.googleapis.com/...')` in any component or CSS file.
- Do NOT set `font-family: 'SomeFont'` in JSX or CSS.
- If a new font is needed, add a single `@font-face` block (or font import) to `src/styles/fonts.css` and use the inherited default everywhere else.

### Typography rules

- Use semantic HTML (`<h1>` … `<h4>`, `<p>`, `<label>`) — the base layer styles them correctly.
- Avoid Tailwind sizing/weight utilities (`text-xl`, `font-bold`, `leading-7`) on standard typographic elements unless you specifically need to override the design system default. They will silently undo theme styling.
- When you DO need a different size, use the Tailwind v4 default scale aliases (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, …) which resolve to `--text-*` variables — never raw pixel values.
- Color text via tokens: `text-foreground` (default), `text-muted-foreground` (secondary), `text-primary` (links/active), `text-destructive` (errors).

## Border radius

Radius is derived from one source — `--radius` (default `0.625rem` / 10px). Edit `--radius` to rescale the whole system.

| Variable | Tailwind | Formula |
|---|---|---|
| `--radius-sm` | `rounded-sm` | `calc(var(--radius) - 4px)` |
| `--radius-md` | `rounded-md` | `calc(var(--radius) - 2px)` |
| `--radius-lg` | `rounded-lg` | `var(--radius)` |
| `--radius-xl` | `rounded-xl` | `calc(var(--radius) + 4px)` |

Defaults:
- Cards / panels → `rounded-lg`
- Inputs, buttons, badges → `rounded-md`
- Small badges, chips → `rounded-sm`
- Pill / circle → `rounded-full` (Tailwind default; not a project token)

Do NOT use arbitrary `rounded-[12px]` values.

## Shadows / elevation

`theme.css` does not define custom shadow tokens. Use Tailwind v4 defaults sparingly:

| Class | Use for |
|---|---|
| (none) | Default — most surfaces use background color contrast, not shadow |
| `shadow-sm` | Slight lift on a card |
| `shadow-md` | Popover, dropdown |
| `shadow-lg` | Modal, floating dialog |

Avoid `shadow-xl` and `shadow-2xl` unless the design specifically calls for them.

## Focus rings

The base layer sets `* { @apply outline-ring/50; }` so default outlines use the right color. For interactive elements that need a stronger focus indicator:

```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

- Always use `focus-visible`, not `focus`.
- Use `ring-ring` for the color; do not pick arbitrary palette colors.
- Do NOT remove focus styles without replacing them.

## Theming (light / dark)

- Default mode is light (`:root` tokens).
- Dark mode activates when an ancestor has the `.dark` class.

```ts
document.documentElement.classList.toggle('dark');
```

Every token defined in `:root` has a matching value in `.dark`, so flipping the class re-themes the whole UI. The `dark:` Tailwind variant is wired up via `@custom-variant dark (&:is(.dark *));` at the top of `theme.css`.

If you also wrap the app in `@figma/astraui`'s `ThemeProvider`, it will manage the `.dark` class for you. Don't toggle the class manually in that case.

## DO / DON'T

```tsx
// DO — tokens, dark-mode safe, edits propagate from theme.css
<main>
  <div className="bg-card text-card-foreground border border-border rounded-lg p-4">
    <h2>Account</h2>
    <p className="text-muted-foreground">Update your info.</p>
    <button className="bg-primary text-primary-foreground rounded-md px-4 py-2">Save</button>
  </div>
</main>

// DON'T — hardcoded colors / sizes
<div style={{ background: "#fff", color: "#030213", padding: 16, borderRadius: 10 }}>...</div>

// DON'T — Tailwind palette colors instead of semantic tokens
<div className="bg-gray-100 text-gray-900 border-gray-200">...</div>

// DON'T — set typography on semantic elements without a real reason
<h1 className="text-4xl font-bold">Account</h1>

// DON'T — pick raw chart palette colors
<Line stroke="#ff6b6b" />
// DO
<Line stroke="var(--chart-1)" />
```
