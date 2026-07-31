# Components

All components are exported from `@figma/astraui`. Never use raw HTML elements when a component exists. Use exact prop names — they do not match common conventions (e.g. `iconStart`/`iconEnd`, not `leftIcon`).

```tsx
import { Button, InputField, Avatar, Modal /* ... */ } from "@figma/astraui";
```

Common conventions:
- Form components use a simplified `onChange`: `(value) => void`, NOT the native event.
- Most components accept `className` and `disabled`.
- All callbacks return values, not events.

> Token note: `@figma/astraui` components consume their **own internal token vocabulary** (Astra `brand-*` / `surface-*` / `text-*`). When you wrap them in custom containers, style the wrapper with the **project shadcn-style tokens from `src/styles/theme.css`** (`bg-card`, `text-foreground`, `border-border`, etc.) — see `tokens.md`. Do not mix the two vocabularies on the same element, and do not pass Astra-style classes through `className` to override component internals.

---

## Buttons & Actions

### Button

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'neutral' \| 'subtle'` | `'primary'` |
| `size` | `'medium' \| 'small'` | `'medium'` |
| `iconStart` | `ReactNode` | — |
| `iconEnd` | `ReactNode` | — |
| `disabled` | `boolean` | `false` |

Variants: `primary` = main CTA (one per section); `neutral` = supporting / default; `subtle` = low emphasis. Do NOT invent `secondary`, `ghost`, `destructive`, or `link`.

```tsx
<Button variant="primary" iconStart={<Plus size={16} />}>Add Item</Button>
<Button variant="neutral">Cancel</Button>
```

### IconButton

| Prop | Type | Default |
|---|---|---|
| `icon` | `ReactNode` | required |
| `variant` | `'primary' \| 'neutral' \| 'subtle'` | `'primary'` |
| `size` | `'medium' \| 'small'` | `'medium'` |

Always circular. Pair with `Tooltip`. `medium` = 40×40, `small` = 32×32.

```tsx
<IconButton icon={<X size={16} />} variant="subtle" size="small" />
```

### ButtonGroup

| Prop | Type | Default |
|---|---|---|
| `align` | `'justify' \| 'start' \| 'end' \| 'center' \| 'stack'` | `'justify'` |

```tsx
<ButtonGroup align="end">
  <Button variant="neutral">Cancel</Button>
  <Button variant="primary">Save</Button>
</ButtonGroup>
```

### FavoriteButton

| Prop | Type | Default |
|---|---|---|
| `defaultFavorited` | `boolean` | `false` |
| `onChange` | `(favorited: boolean) => void` | — |

24px star toggle for content overlays.

---

## Data Entry (Forms)

All form fields accept `label`, `description`, `disabled`, `className`. `onChange` is simplified: `(value) => void`.

### InputField

| Prop | Type |
|---|---|
| `value` | `string` |
| `placeholder` | `string` |
| `label` | `string` |
| `description` | `string` |
| `prefix` | `ReactNode` |
| `suffix` | `ReactNode` |
| `onChange` | `(value: string) => void` |

```tsx
<InputField
  label="Email"
  description="Your primary contact email"
  prefix={<Search size={16} />}
  value={email}
  onChange={setEmail}
/>
```

### TextareaField

| Prop | Type | Default |
|---|---|---|
| `value` | `string` | — |
| `rows` | `number` | `3` |
| `onChange` | `(value: string) => void` | — |

### SelectField

| Prop | Type |
|---|---|
| `options` | `{ value: string, label: string }[]` |
| `value` | `string` |
| `onChange` | `(value: string) => void` |
| `placeholder` | `string` |

Options are objects, NOT children.

```tsx
<SelectField
  label="Format"
  options={[{ value: "mp4", label: "MP4" }, { value: "mov", label: "MOV" }]}
  value={format}
  onChange={setFormat}
/>
```

### SearchComponent

| Prop | Type | Default |
|---|---|---|
| `value` | `string` | `''` |
| `placeholder` | `string` | `'Search'` |
| `onChange` | `(value: string) => void` | — |
| `onSearch` | `(value: string) => void` | — |

### Checkbox

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — |
| `description` | `string` | — |
| `defaultChecked` | `boolean` | `false` |
| `onChange` | `(checked: boolean) => void` | — |

### RadioGroup

| Prop | Type |
|---|---|
| `options` | `{ value, label, description? }[]` |
| `value` / `defaultValue` | `string` (controlled / uncontrolled) |
| `onChange` | `(value: string) => void` |

### SwitchField

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | `'Label'` |
| `description` | `string` | `'Description'` |
| `defaultSelected` | `boolean` | `true` |
| `onChange` | `(selected: boolean) => void` | — |

### PromptInput

AI prompt input with send/attach for chat surfaces.

---

## Navigation

Hierarchy: `SidebarNavigation` (primary, always present) → `SecondaryNav` (sub-sections) → `Tabs` (content switching). Never skip a level.

### SidebarNavigation

| Prop | Type |
|---|---|
| `children` | `ReactNode` (SidebarButtons) |
| `footer` | `ReactNode` |

60px wide, full height, includes `AstraLogo` at the top. Pass `SidebarButton` as children — there is NO `navItems` prop. Footer items go in `footer` — there is NO `bottomNavItems` prop.

```tsx
<SidebarNavigation
  footer={
    <>
      <SidebarButton icon={<Settings className="size-full" strokeWidth={1.5} />} />
      <Avatar type="image" src="/user.jpg" size="medium" shape="circle" />
    </>
  }
>
  <SidebarButton icon={<Home className="size-full" strokeWidth={1.5} />} active />
  <SidebarButton icon={<Film className="size-full" strokeWidth={1.5} />} />
  <SidebarButton icon={<Book className="size-full" strokeWidth={1.5} />} />
  <SidebarButton icon={<Folder className="size-full" strokeWidth={1.5} />} />
</SidebarNavigation>
```

### SidebarButton

| Prop | Type |
|---|---|
| `icon` | `ReactNode` (required) |
| `active` | `boolean` |

Icons use `className="size-full"` and `strokeWidth={1.5}`.

### SecondaryNav

| Prop | Type |
|---|---|
| `title` | `string` (required) |
| `children` | `ReactNode` (SecondaryNavItems) |

~252px wide, `bg-surface-secondary-bg`.

### SecondaryNavItem

| Prop | Type |
|---|---|
| `icon` | `ReactNode` |
| `label` | `string` |
| `active` | `boolean` |

### Tabs

| Prop | Type |
|---|---|
| `tabs` | `{ id: string, label: string, content: ReactNode }[]` |
| `defaultTab` | `string` |
| `onChange` | `(tabId: string) => void` |

Tertiary navigation only.

### SegmentedControl

Inline icon switcher — compact alternative to Tabs.

---

## Data Display

### Avatar

| Prop | Type | Default |
|---|---|---|
| `type` | `'initial' \| 'image'` | `'image'` |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` |
| `shape` | `'circle' \| 'square'` | `'circle'` |
| `initials` | `string` | `'F'` |
| `src` | `string` | — |
| `alt` | `string` | `'Avatar'` |

No `'xl'` size. Always specify `type`.

### AvatarGroup

| Prop | Type | Default |
|---|---|---|
| `avatars` | `{ src, alt? }[]` | required |
| `maxVisible` | `number` | `3` |
| `spacing` | `'overlap' \| 'spaced'` | `'spaced'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `showOverflow` | `boolean` | `true` |

NOTE: AvatarGroup uses `sm`/`md`/`lg`, while Avatar uses `small`/`medium`/`large`.

### ItemCard

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | `'Item Title'` |
| `updated` | `string` | `'Edited 2m ago'` |
| `spec` | `string` | `'4K'` |
| `duration` | `string` | `'0:01:30'` |
| `thumbnail` | `ReactNode` | — |

### DurationBadge

Compact timecode label for video thumbnails.

### VideoControl

Video playback controls with seek bar.

### Badge

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | `'Label'` |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'brand' \| 'secondary'` | `'default'` |
| `removable` | `boolean` | `false` |
| `onRemove` | `() => void` | — |

IMPORTANT: Badge uses the `label` prop — NOT children.

```tsx
<Badge label="Active" variant="success" />
```

---

## Feedback

### Toast

| Prop | Type | Default |
|---|---|---|
| `message` | `string` | required |
| `progress` | `number` | `0` |
| `variant` | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'` |
| `showCancel` | `boolean` | `true` |
| `onCancel` / `onDismiss` | `() => void` | — |

### Tooltip

| Prop | Type | Default |
|---|---|---|
| `content` | `string` | required |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `delay` | `number` (ms) | `200` |
| `children` | `ReactNode` | required |

```tsx
<Tooltip content="Settings" position="bottom">
  <IconButton icon={<Settings size={16} />} variant="subtle" />
</Tooltip>
```

---

## Overlay

### Modal

| Prop | Type | Default |
|---|---|---|
| `isOpen` | `boolean` | required |
| `onClose` | `() => void` | required |
| `title` | `string` | — |
| `children` | `ReactNode` | required |
| `footer` | `ReactNode` | — |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` |

Sizes: small 360px, medium 480px, large 640px. Modal manages its own backdrop — do NOT add one.

```tsx
<Modal
  isOpen={open}
  onClose={close}
  title="Export"
  size="medium"
  footer={
    <>
      <Button variant="neutral" onClick={close}>Cancel</Button>
      <Button variant="primary">Export</Button>
    </>
  }
>
  <div className="flex flex-col gap-lg">
    <InputField label="File name" value={name} onChange={setName} />
  </div>
</Modal>
```

---

## Toolbar

`Toolbar` is a floating toolbar container with subtle shadow built in. Use `ToolbarItem` (icon button) as children.

---

## Prompt Chat

`AIVideoCreation`, `ChatBubbles`, `PromptInput`, `PromptPane` — chat surfaces for AI flows. `ChatBubbles` uses `bg-brand-secondary` for AI messages (built in).

---

## Layout & Utility

- `AstraLogo` — brand mark SVG (built into `SidebarNavigation`).
- `ThemeProvider` — required at app root. See `setup.md`.
- `useTheme()` — hook for reading/toggling theme.

---

## Icon usage in components

See `icon-discovery.md` for icon naming conventions, import paths, and search methodology. Quick reminder:
- All icons from `lucide-react`. Use `size={16}` for input/button icons, `size={24}` for toolbar items.
- `SidebarButton` / `SecondaryNavItem` icons: `className="size-full" strokeWidth={1.5}`.

## DO / DON'T

```tsx
// DO — design system component, correct props
<Button variant="primary" iconStart={<Plus size={16} />}>Add</Button>
<Badge label="Active" variant="success" />
<InputField label="Email" value={email} onChange={setEmail} />

// DON'T — raw HTML, made-up variants, wrong prop names
<button className="bg-purple-500">Add</button>
<Button variant="secondary">Add</Button>
<Button leftIcon={<Plus />}>Add</Button>
<Badge>Active</Badge>
<input type="email" />
<InputField onChange={(e) => setEmail(e.target.value)} />
```
