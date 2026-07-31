# Styles, Spacing & Layout

This project uses **Tailwind v4** with project tokens defined in `src/styles/theme.css`. Spacing, sizing, and layout work uses **Tailwind v4's default spacing scale** (no custom space tokens are defined in `theme.css`). Color, radius, and typography tokens come from `theme.css` — see `tokens.md`.

**Never hardcode pixel values** in JSX (`style={{ padding: 16 }}`) or arbitrary Tailwind values (`p-[14px]`). Always pick from the scale below.

## Spacing scale

Tailwind v4 default scale, derived from `--spacing: 0.25rem` (4px). Use `p-*`, `m-*`, `gap-*`, `space-*`, `w-*`, `h-*`, `size-*` utilities.

| Class | Value |
|---|---|
| `*-0` | 0 |
| `*-px` | 1px |
| `*-0.5` | 2px |
| `*-1` | 4px |
| `*-2` | 8px |
| `*-3` | 12px |
| `*-4` | 16px |
| `*-5` | 20px |
| `*-6` | 24px |
| `*-8` | 32px |
| `*-10` | 40px |
| `*-12` | 48px |
| `*-16` | 64px |
| `*-20` | 80px |
| `*-24` | 96px |

Defaults to reach for:
- Inside a card: `p-4` or `p-6`
- Between fields in a form: `gap-3` (12px) or `gap-4` (16px)
- Between section cards: `gap-6` (24px) or `gap-8` (32px)
- Page-level padding: `p-6` or `p-8`
- Tight inline gap (icon + label): `gap-2`

## Layout primitives

No `Stack`, `Inline`, `Box`, or `Container` components are shipped. Build layouts with plain `<div>` + Tailwind flex/grid utilities.

### Vertical stack

```tsx
<div className="flex flex-col gap-3">
  <Input />
  <Input />
  <Textarea />
</div>
```

### Horizontal row (side-by-side)

```tsx
<div className="flex gap-4">
  <div className="flex-1"><Input /></div>
  <div className="flex-1"><Input /></div>
</div>
```

### Card

```tsx
<div className="bg-card text-card-foreground rounded-lg border border-border p-6">
  <h2>Profile</h2>
  <p className="text-muted-foreground">Manage your account</p>
</div>
```

### Stack of section cards

```tsx
<div className="flex flex-col gap-6 max-w-3xl">
  <div className="bg-card border border-border rounded-lg p-6">...</div>
  <div className="bg-card border border-border rounded-lg p-6">...</div>
</div>
```

### Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((i) => <Card key={i.id} {...i} />)}
</div>
```

### Page shell

```tsx
<main className="min-h-screen bg-background text-foreground p-6 md:p-8">
  <header className="mb-6">
    <h1>Dashboard</h1>
    <p className="text-muted-foreground">Welcome back</p>
  </header>
  <div className="flex flex-col gap-6 max-w-5xl">
    {/* section cards */}
  </div>
</main>
```

(`<body>` already gets `bg-background text-foreground` from the base layer, so the `<main>` background is optional.)

## Responsive patterns

Use Tailwind v4 default breakpoints — no custom breakpoints are defined.

| Prefix | Min width |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

Apply mobile-first: write the base classes for mobile, then add `md:` / `lg:` overrides for larger screens.

```tsx
<div className="flex flex-col gap-3 md:flex-row md:gap-6">
  <div className="flex-1">...</div>
  <div className="flex-1">...</div>
</div>

<h1 className="text-2xl md:text-3xl">Welcome</h1>
```

## CSS methodology

- **Tailwind v4 utility classes** are the only sanctioned styling layer for components.
- **Tokens live in `src/styles/theme.css`** as CSS variables, exposed to Tailwind via `@theme inline`.
- **No `tailwind.config.js`** — Tailwind v4 reads configuration from CSS.
- **No CSS modules, styled-components, or inline `style={{}}` for design tokens.** Inline `style` is acceptable only for truly dynamic values (e.g. computed positions, animations driven by JS state).
- **Project-wide CSS** belongs in `src/styles/globals.css` (currently empty) — keep it minimal.
- **`@source` is configured in `tailwind.css`** to pick up classes from `../**/*.{js,ts,jsx,tsx}`. Do not duplicate.

## Combining the design system with custom elements

When you need a one-off element that isn't a design-system component:

1. Use semantic color tokens (`bg-card`, `text-foreground`, `border-border`) — never raw palette names like `bg-gray-100`.
2. Use radius tokens (`rounded-md`, `rounded-lg`) — never `rounded-[12px]`.
3. Use the default Tailwind spacing scale (`p-4`, `gap-3`) — never arbitrary values.
4. Use semantic HTML (`<h2>`, `<label>`, `<button>`) so the base layer typography applies.
5. For interactive elements: add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`, `tabIndex={0}`, and a proper ARIA role.

```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handle}
  onKeyDown={(e) => e.key === "Enter" && handle()}
  className="
    bg-card text-card-foreground border border-border rounded-lg p-6
    cursor-pointer hover:bg-accent hover:text-accent-foreground
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  "
>
  <h3>Custom card</h3>
  <p className="text-muted-foreground mt-1">Description</p>
</div>
```

## DO / DON'T

```tsx
// DO — token-backed classes from the default scale
<main className="bg-background p-6">
  <div className="flex flex-col gap-6 max-w-3xl">
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col gap-3">{/* fields */}</div>
    </div>
  </div>
</main>

// DON'T — hardcoded pixels
<main style={{ padding: 24 }}>
  <div style={{ marginBottom: 16 }}>...</div>
</main>

// DON'T — arbitrary Tailwind values
<div className="p-[18px] gap-[7px] rounded-[10px]">...</div>

// DON'T — Tailwind palette colors instead of tokens
<div className="bg-slate-50 border-gray-200 text-zinc-700">...</div>

// DON'T — touching layouts (no gap)
<div className="flex flex-col">
  <Input />
  <Input />
</div>

// DON'T — set typography on a heading without a reason
<h1 className="text-3xl font-bold">...</h1>
```

## Rules

- Spacing is NOT optional. If cards or fields touch with no gap, the layout is broken — always use `flex` + `gap-*`.
- Always pick from the Tailwind v4 default spacing scale; do not use `p-[14px]` or `gap-[7px]`.
- Always use semantic color tokens from `theme.css`; do not use `bg-gray-*`, `text-slate-*`, etc.
- Always use radius tokens (`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`).
- For typography, prefer semantic HTML and let the base layer style it. Only add Tailwind sizing/weight utilities when overriding the default is genuinely needed.
- No `tailwind.config.js` — all configuration lives in `src/styles/`.
