## Package Installation

**CRITICAL**: You MUST explicitly install every package listed below as a direct dependency, exactly as written.

Rules:
- Even if a package is already available as a transitive dependency (i.e., installed by another package), you MUST still add it as a direct dependency. Transitive availability does NOT count as installed.
- Use the **exact** package name shown. Packages with similar names (e.g., `@scope-a/foo` vs `@scope-b/foo`, or `foo` vs `foo-core`) are **different packages** and are NOT interchangeable. Never substitute one for another.
- This applies to your `import` statements too: import from these exact package names. Do NOT rewrite the scope to match the package this guideline ships inside, or any other scope you see in `node_modules/`. The packages below are upstream npm packages — they live under their own names, regardless of where this guideline file is located.
- Do not skip any package. Do not reorder, rename, or omit any entry.

Add the following to your `package.json` dependencies:

```json
{
  "dependencies": {
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.1",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cmdk": "1.1.1",
    "date-fns": "3.6.0",
    "embla-carousel-react": "8.6.0",
    "input-otp": "1.4.2",
    "lucide-react": "0.487.0",
    "motion": "12.23.24",
    "next-themes": "0.4.6",
    "react-day-picker": "8.10.1",
    "react-dnd": "16.0.1",
    "react-dnd-html5-backend": "16.0.1",
    "react-hook-form": "7.55.0",
    "react-popper": "2.3.0",
    "react-resizable-panels": "2.1.7",
    "react-responsive-masonry": "2.7.1",
    "react-router": "7.13.0",
    "react-slick": "0.31.0",
    "recharts": "2.15.2",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0",
    "tw-animate-css": "1.3.8",
    "vaul": "1.1.2",
    "@figma/astraui-kit": "0.1.3",
    "framer-motion": "latest",
    "framer-motion-carousel": "2.0.4",
    "framer-motion-hooks": "1.0.10",
    "framer-motion-scroll-to-hook": "latest",
    "goey-toast": "latest",
    "modern-tour": "latest",
    "own-animation": "latest",
    "svelte-motion": "latest",
    "tailwindcss-framer-motion": "latest"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "vite": "6.3.5"
  },
  "peerDependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

---

## Additional Required Package

`@figma/astraui-kit` depends on the runtime design system package `@figma/astraui`, which must ALSO be installed as a direct dependency (it is not listed above). Add it to `dependencies`:

```json
{
  "dependencies": {
    "@figma/astraui": "1.0.0"
  }
}
```

`@figma/astraui` is NOT the same as `@figma/astraui-kit`. You must install BOTH as direct dependencies. The kit package contains documentation/guidelines; the runtime components and styles are exported from `@figma/astraui`.

## Install Command

Use pnpm (the project's package manager). After editing `package.json` directly, run:

```bash
pnpm install
```

## Required CSS Imports

Import the design system stylesheet once at the top of your global stylesheet (e.g. `src/styles/globals.css`) so it is available app-wide:

```css
@import "@figma/astraui/styles.css";
```

Notes:
- The package ships **pre-compiled CSS** — consumers do NOT need Tailwind to be aware of its sources.
- Do **NOT** add `@source` directives for `@figma/astraui` in your Tailwind config.
- There is only one stylesheet; import order does not matter relative to other Astra files.
- Keep any project-local font imports in `src/styles/fonts.css` at the top of that file.

## Provider Setup

Wrap the app root with `ThemeProvider` from `@figma/astraui`. This is required for dark mode and theme persistence (the provider manages the `.dark` class on `<html>` and reads `localStorage('astra-theme')`, falling back to `prefers-color-scheme`).

```tsx
// src/app/App.tsx
import { ThemeProvider } from "@figma/astraui";

export default function App() {
  return (
    <ThemeProvider>
      {/* app content */}
    </ThemeProvider>
  );
}
```

Reading/toggling the theme from any descendant:

```tsx
import { useTheme } from "@figma/astraui";
import { Button } from "@figma/astraui";

function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme();
  return <Button onClick={toggleTheme}>{theme}</Button>;
}
```

`ThemeProvider` MUST be an ancestor of any component calling `useTheme()`.

## Build Tool Configuration

This project uses Vite 6 with the React plugin and the Tailwind v4 Vite plugin. A minimal `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Tailwind v4

- Tailwind v4 is configured via CSS, not a `tailwind.config.js`. Do NOT create `tailwind.config.js`.
- Astra tokens are exposed via `@theme inline` — use Tailwind utility classes that reference these tokens (e.g. `bg-brand-tertiary`, `gap-xl`, `text-fg-default`) rather than arbitrary values or raw hex codes.
- `tw-animate-css` provides additional animation utilities and is loaded through the design system stylesheet.

## TypeScript

No special `tsconfig.json` requirements beyond a standard React + Vite setup:
- `"jsx": "react-jsx"`
- `"moduleResolution": "bundler"` (or `"node16"`)
- `"types"` should include `"vite/client"` if you use Vite-specific imports.

Astra ships its own type definitions via the package `exports` map (`./dist/index.d.ts`).

## Peer Dependencies

- `react`: `18.3.1`
- `react-dom`: `18.3.1`

Both `@figma/astraui` and `@figma/astraui-kit` declare React 18.3.1 as a peer dependency. Do NOT upgrade to React 19 — peer resolution will fail and several Radix primitives bundled inside Astra rely on React 18 behavior.

Other transitive peer requirements satisfied by the install list above:
- `@emotion/react` + `@emotion/styled` (Emotion-styled internals)
- `@popperjs/core` (satisfied transitively by `react-popper`)

## Common Gotchas

- **Two packages, not one.** Installing only `@figma/astraui-kit` leaves runtime components and styles missing. You must also install `@figma/astraui`.
- **Do not substitute scopes.** `@figma/astraui` is the upstream npm package name. Do not rewrite imports to a different scope just because the guidelines file lives in a different package location.
- **No `tailwind.config.js`.** Tailwind v4 is configured through CSS. Adding a JS config can shadow the design tokens defined via `@theme inline`.
- **No `@source` for Astra.** The CSS ships pre-compiled. Adding `@source "../node_modules/@figma/astraui/**/*"` causes duplicated/conflicting utilities.
- **`ThemeProvider` is required.** Components that internally call `useTheme()` will throw at runtime if the provider is missing.
- **React version is pinned.** Use React/React-DOM 18.3.1 exactly — upgrading breaks peer dependency resolution.
- **Font imports go in `src/styles/fonts.css` only**, at the top of the file. Do not scatter `@import url(...)` across other CSS files.
- **Use design tokens, not raw values.** Always prefer Astra token-backed Tailwind classes over arbitrary hex/px values so theme changes propagate.
- **Do not run `vite build`** in this environment — the dev server is managed by the harness.

---

## Project Theme (`src/styles/theme.css`)

The user has added a project-local shadcn-style theme at `src/styles/theme.css`. This file is the **canonical source of design tokens for all custom UI** — colors, border radius, and typography defaults are defined here as CSS variables and exposed to Tailwind v4 via `@theme inline`. The user updates styling by editing this file, so all generated UI MUST consume these tokens through the corresponding Tailwind utilities rather than hardcoded values.

`src/styles/theme.css` defines:

- `@custom-variant dark (&:is(.dark *));` — enables the `dark:` Tailwind variant when an ancestor has the `.dark` class
- Light-mode tokens in `:root`, dark-mode overrides in `.dark`
- An `@theme inline` block that maps each CSS variable to a Tailwind token (`--color-*`, `--radius-*`)
- An `@layer base` block that sets root `font-size`, applies `bg-background text-foreground` to `<body>`, and gives default typography to `h1`–`h4`, `label`, `button`, `input`

### Required CSS import order

The project's CSS entrypoint is `src/styles/index.css`, which currently imports:

```css
@import './fonts.css';
@import './tailwind.css';
```

Add `theme.css` to this entrypoint after Tailwind is loaded so the `@theme inline` block can register tokens with Tailwind v4:

```css
/* src/styles/index.css */
@import './fonts.css';        /* font-face declarations only */
@import './tailwind.css';     /* @import 'tailwindcss', @source rules, tw-animate-css */
@import './theme.css';        /* :root tokens, .dark overrides, @theme inline, @layer base */
@import '@figma/astraui/styles.css';  /* Astra component styles (if using Astra components) */
@import './globals.css';      /* project-wide overrides — keep last */
```

Rules:
- `fonts.css` first — `@font-face` must be declared before any rule uses the family.
- `tailwind.css` second — establishes the Tailwind layer order.
- `theme.css` third — registers tokens via `@theme inline`.
- `globals.css` last — project overrides win.

### Color tokens

All colors are exposed as semantic Tailwind utilities. Use these classes — never hardcode hex/oklch values.

| CSS variable | Tailwind utility | Use for |
|---|---|---|
| `--background` / `--foreground` | `bg-background` / `text-foreground` | Page canvas and body text (applied by base layer) |
| `--card` / `--card-foreground` | `bg-card` / `text-card-foreground` | Card surfaces |
| `--popover` / `--popover-foreground` | `bg-popover` / `text-popover-foreground` | Popovers, menus, dropdowns |
| `--primary` / `--primary-foreground` | `bg-primary` / `text-primary-foreground` | Primary actions |
| `--secondary` / `--secondary-foreground` | `bg-secondary` / `text-secondary-foreground` | Secondary actions |
| `--muted` / `--muted-foreground` | `bg-muted` / `text-muted-foreground` | Muted surfaces, helper text |
| `--accent` / `--accent-foreground` | `bg-accent` / `text-accent-foreground` | Hover/selected states |
| `--destructive` / `--destructive-foreground` | `bg-destructive` / `text-destructive-foreground` | Errors, destructive actions |
| `--border` | `border-border` | All borders |
| `--input` / `--input-background` | `border-input` / `bg-input-background` | Form input borders and field background |
| `--switch-background` | `bg-switch-background` | Switch off-state track |
| `--ring` | `ring-ring`, `outline-ring` | Focus rings |
| `--chart-1` … `--chart-5` | `text-chart-1` … `bg-chart-5` | Chart series colors |
| `--sidebar*` | `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-primary`, `bg-sidebar-accent`, `border-sidebar-border`, `ring-sidebar-ring` | Sidebar surfaces |

### Border radius tokens

Radius is derived from a single `--radius` (default `0.625rem`). Use the Tailwind aliases — changing `--radius` updates the whole scale.

| Token | Tailwind | Formula |
|---|---|---|
| `--radius-sm` | `rounded-sm` | `calc(var(--radius) - 4px)` |
| `--radius-md` | `rounded-md` | `calc(var(--radius) - 2px)` |
| `--radius-lg` | `rounded-lg` | `var(--radius)` |
| `--radius-xl` | `rounded-xl` | `calc(var(--radius) + 4px)` |

### Typography

`theme.css` sets defaults on bare HTML elements inside `@layer base`. Because the rules are in `@layer base`, Tailwind utility classes (`text-sm`, `text-lg`, `font-bold`) automatically override them.

| Element | Size token | Weight |
|---|---|---|
| `html` | `var(--font-size)` (16px) | — |
| `h1` | `var(--text-2xl)` | `var(--font-weight-medium)` (500) |
| `h2` | `var(--text-xl)` | `var(--font-weight-medium)` |
| `h3` | `var(--text-lg)` | `var(--font-weight-medium)` |
| `h4` | `var(--text-base)` | `var(--font-weight-medium)` |
| `label`, `button` | `var(--text-base)` | `var(--font-weight-medium)` |
| `input` | `var(--text-base)` | `var(--font-weight-normal)` (400) |

Rules for typography:
- Use plain `<h1>`–`<h4>`, `<label>`, `<button>`, `<input>` — the base layer styles them correctly.
- **Do NOT add Tailwind sizing/weight classes (`text-sm`, `text-2xl`, `font-bold`) to typographic elements unless you explicitly need to override the design system defaults** — they will silently undo the design system styling.
- For typography, ONLY use the font families declared via `@font-face` in `src/styles/fonts.css`. Do not import additional Google Fonts or set `font-family` to a literal stack inline.
- Font weight is restricted to `--font-weight-normal` (400) and `--font-weight-medium` (500). Do not introduce 600/700/800/900.

### Dark mode

Dark mode is opt-in via a `.dark` class on any ancestor (typically `<html>`):

```ts
document.documentElement.classList.toggle('dark');
```

All tokens automatically flip via the `.dark { ... }` block. The `dark:` Tailwind variant works through the `@custom-variant` rule defined at the top of `theme.css`.

If you also wrap the app in `@figma/astraui`'s `ThemeProvider`, it will manage the `.dark` class for you — do not set it manually in that case.

### Common gotchas (project theme)

- **Editing `default_shadcn_theme.css` does nothing.** That file at the repo root is a reference snapshot (it carries a `KEEP_IN_SYNC` marker) and is not imported anywhere. Edit `src/styles/theme.css` to change tokens.
- **`globals.css` is currently empty.** Project-wide CSS rules belong there, imported last so they win over tokens.
- **Do not redeclare tokens in component CSS.** Override at `:root` / `.dark` in `theme.css` so light and dark modes stay in sync.
- **The base layer applies `bg-background text-foreground` to `<body>`.** Do not also set a page-level background on `<main>` or `<div id="root">` — it will mask theme changes.
- **`--input` is `transparent` in light mode.** Input fields rely on `--input-background` for their fill; use `bg-input-background border border-input` together.
- **Token names differ from `@figma/astraui` tokens.** Astra uses `bg-brand-tertiary`, `bg-surface-bg`, `text-text-primary`, etc. The project theme uses shadcn-style names (`bg-background`, `bg-card`, `text-foreground`). Pick one system per component and stay consistent; do not mix `bg-brand-tertiary` with `bg-card` on the same surface.
- **pnpm workspace.** `pnpm-workspace.yaml` declares this directory as the single workspace package — run all `pnpm` commands from the repo root.
