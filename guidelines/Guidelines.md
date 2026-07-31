<!-- make-kit-guidelines -->
## Design System Setup — MANDATORY

This project depends on `@figma/astraui-kit` packages. Before writing
any code:

1. Read guidelines/setup.md and guidelines/Guidelines.md by their exact
   path (e.g. node_modules/<scope>/<package>/guidelines/setup.md).
   This project uses pnpm, which symlinks packages — do NOT use
   `find`, `glob`, or `file_search` to discover files as they silently
   fail on symlinks. Instead use: reading files by exact path,
   `ls` (follows symlinks), `find -L` (`-L` follows symlinks), or `cat`.
2. Execute all setup instructions (install dependencies, config changes)
   against THIS project — not the package itself.
3. Do not skip, modify, or improvise any setup steps.
4. Read ALL other required .md files specified in guidelines/Guidelines.md.
5. Verify that all packages specified in setup.md appear in this
   project's package.json and that all required .md files have been read before proceeding.
<!-- /make-kit-guidelines -->

# Astra UI Design System — Guidelines Hub

This project uses the `@figma/astraui` design system. Read this file first, then the companion files listed below depending on the task.

## Product character

- **Style**: B2C SaaS, minimal, clean, simple
- **Density**: Breathable — generous whitespace, compact but not cramped
- **Surface strategy**: Layered — branded `brand-tertiary` canvas with `surface-bg` cards floating on top. Surface color creates hierarchy, not borders.
- **Color palette**: ~90% neutral surfaces. Brand color is used sparingly for primary actions, active states, and small accents.
- **Corners**: `corner-md` 8px default, `corner-lg` 16px for cards/overlays, `corner-full` for buttons/avatars
- **Elevation**: Surface-color-driven — shadows reserved for floating overlays only

## Reading order

Always read first:
- `Guidelines.md` — this file; the main hub and entry point
- `setup.md` — required project configuration, providers, and CSS imports
- `tokens.md` — foundational design tokens (color, typography, spacing)

Read on-demand:
- `components.md` — read BEFORE using any design-system component
- `icon-discovery.md` — read BEFORE using any icons
- `styles.md` — read when building page layouts or applying custom spacing

## Companion guideline files

All files below live alongside this `Guidelines.md` in the `/guidelines/` directory and should be consulted for their respective focus areas when building UIs with this design system.

| File | Focus |
|---|---|
| `components.md` | Component imports, props/API surfaces, variants, composition patterns, and usage examples |
| `icon-discovery.md` | Icon naming convention, import path, available sizes, and how to search for icons |
| `tokens.md` | Design tokens, color/typography/shadow/border tokens, theming, and CSS custom properties |
| `styles.md` | Spacing scales, layout primitives, responsive patterns, and CSS methodology |
| `setup.md` | Project setup instructions, provider configuration, required CSS imports, and peer dependency requirements |

## Hard rules

The active token system is the **shadcn-style theme defined in `src/styles/theme.css`**. The user updates styling by editing that file, and all generated UI must consume those tokens via the Tailwind utilities they expose.

- All color, border, radius, and focus utilities MUST resolve to variables in `src/styles/theme.css` — use semantic tokens (`bg-card`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`, `ring-ring`, etc.). Never hardcode hex/rgb/oklch values, and never use raw Tailwind palette colors like `bg-gray-100` or `text-slate-700`.
- For typography, ONLY use the font faces declared in `src/styles/fonts.css`. Do not import additional Google Fonts and do not set `font-family` to a literal stack.
- Prefer semantic HTML (`<h1>`–`<h4>`, `<p>`, `<label>`, `<button>`, `<input>`). The `@layer base` block in `theme.css` already styles them — avoid adding Tailwind sizing/weight classes unless you genuinely need to override the design system default.
- Use Tailwind v4's default spacing scale (`p-4`, `gap-3`, `gap-6`). Do not use arbitrary values (`p-[14px]`) or hardcoded pixels in `style={{}}`.
- Use radius tokens (`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`) — never `rounded-[12px]`.
- Dark mode is opt-in via the `.dark` class on `<html>`; all tokens flip automatically, and the `dark:` variant is wired up by `@custom-variant dark` in `theme.css`.
- Icons always come from `lucide-react` — never create inline SVGs, never guess icon names. See `icon-discovery.md`.
- If the `@figma/astraui` component library is used, let those components style themselves — they consume their own internal tokens. For **wrappers and custom UI**, use the shadcn-style tokens above. Do not mix `bg-brand-tertiary` / `text-text-primary` (Astra) with `bg-card` / `text-foreground` (project theme) on the same element.

## Workflows

### Before using a component
1. Read `components.md` for the component's props, variants, and rules.
2. Confirm it exists in `@figma/astraui` — do not invent components or variants.
3. Use exact prop names from the docs (e.g. `iconStart`/`iconEnd`, not `leftIcon`/`rightIcon`).

### Before using an icon
1. Check `icon-discovery.md` for available icons
2. Do NOT guess icon names — verify the icon exists first
3. If an icon doesn't exist, pick a different one and verify

## Verifying icons

IMPORTANT: Consult `icon-discovery.md` for how to search for icons and verify they exist. Do NOT guess icon names.

### When building a layout
1. Read `styles.md` for spacing and layout patterns.
2. Read `tokens.md` for surface and color choices.
3. Start with `SidebarNavigation` — every desktop page includes it.
4. Use `bg-brand-tertiary` for the page canvas, `bg-surface-bg` for elevated cards.
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
