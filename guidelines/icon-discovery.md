# Icon Discovery

All icons in this design system come from `lucide-react`. Do NOT import icons from `@figma/astraui`, and do NOT create inline SVGs.

```tsx
import { Home, Search, Settings } from "lucide-react";
```

## Icon package

- **Package**: `lucide-react`
- **Import path**: `lucide-react` (named exports)
- **Source directory**: `node_modules/lucide-react/dist/esm/icons/`
- **File count**: ~1500 icon files (do not enumerate)

## Naming convention

- **Files**: kebab-case `.js` (e.g. `arrow-up.js`, `chevron-down.js`, `more-horizontal.js`)
- **Imports**: PascalCase, derived from the file name (`arrow-up.js` → `ArrowUp`)
- **No size prefix**: lucide icons are size-agnostic; size is controlled via the `size` prop at runtime.

| File | Import |
|---|---|
| `home.js` | `Home` |
| `arrow-up.js` | `ArrowUp` |
| `chevron-down.js` | `ChevronDown` |
| `more-horizontal.js` | `MoreHorizontal` |
| `trash-2.js` | `Trash2` |

## Available sizes

Size is a prop, not part of the import name. All icons accept any pixel value via `size`. Conventions for this design system:

| Pixel size | Use case |
|---|---|
| `16` | Input prefix/suffix, button `iconStart`/`iconEnd`, compact inline UI (~15%) |
| `24` | Toolbar items, segmented controls, video controls — default (~60%) |
| `20` | Sidebar/secondary nav (rendered via `className="size-full"` on parent) (~20%) |
| `32` | Large feature icons, empty states (~5%) |

## Props

| Prop | Default | Notes |
|---|---|---|
| `size` | `24` | Pixel dimensions |
| `color` | `"currentColor"` | Prefer parent text color class instead |
| `strokeWidth` | `2` | Use `1.5` for nav icons |
| `className` | — | `"size-full"` when parent controls size |

Icons inherit color from `currentColor`. Drive icon color via the parent's text class (`text-text-primary`, `text-brand-primary`, `text-danger`, etc.).

## Common modifiers / suffixes

Lucide uses suffixes to indicate variants:

| Suffix | Meaning | Example |
|---|---|---|
| `-2`, `-3` | Alternate style | `Trash2`, `Share2`, `Grid3X3` |
| `-off` | Negated / muted state | `BellOff`, `EyeOff`, `MicOff` |
| `-up`, `-down`, `-left`, `-right` | Directional | `ArrowUp`, `ChevronDown` |
| `-circle` | Circular variant | `AlertCircle`, `CheckCircle`, `HelpCircle` |
| `-square` | Square variant | `MessageSquare` |

There are no `-filled`, `-color`, `-large`, or `-inverted` variants — lucide is a single stroke style.

## Standard Astra icons

Prefer these for consistency with the design system's built-in components:

| Icon | Where used |
|---|---|
| `Home`, `Film`, `Book`, `Folder` | `SidebarNavigation` primary nav |
| `Settings` | `SidebarNavigation` footer |
| `Search` | `SearchComponent`, `InputField` prefix |
| `Send` | `PromptInput` |
| `X` | Close/dismiss |
| `User`, `CreditCard`, `Bell` | `SecondaryNav` (Profile, Billing, Notifications) |
| `Star` | `FavoriteButton` |

## How to find icons at code-generation time

When searching for icons, locate the icon folder and use targeted Glob patterns with keywords (e.g. `*chevron*`, `*bell*`). Before listing or searching any directory, first check the number of entries (e.g. `ls <dir> | wc -l`). If there are more than ~50 files, narrow your search pattern or use `head` to limit results. Never dump hundreds of filenames or Grep results into your context — large tool results persist and bloat every subsequent turn.

Do NOT use Grep to search icon file contents — icon filenames are descriptive, so Glob on filenames is sufficient.

Do NOT list an entire large directory without first checking its size. If you get a result with hundreds of lines, you have made a mistake.

### Practical search pattern

```bash
# Find icons matching a keyword (kebab-case file names)
ls node_modules/lucide-react/dist/esm/icons/ | grep -i chevron | head -20
ls node_modules/lucide-react/dist/esm/icons/ | grep -i arrow | head -20
```

Then convert kebab-case → PascalCase for the import (`arrow-up-right.js` → `ArrowUpRight`).

## Rules

- IMPORTANT: Do NOT guess icon names. Always verify the file exists in `node_modules/lucide-react/dist/esm/icons/` before importing.
- Always import from `lucide-react` — never from `@figma/astraui`.
- Never create inline SVGs.
- Use consistent sizes within the same context — do not mix 16px and 24px in the same toolbar.
- For icons inside `SidebarButton` / `SecondaryNavItem`, use `className="size-full"` and `strokeWidth={1.5}`.
- Control icon color via the parent's text color class, not the `color` prop.
- If the icon you want does not exist, pick a similar one that does and verify it.
