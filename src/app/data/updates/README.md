# Latest Updates photos

Drop image files here and they appear on the Latest Updates carousel — no code
change needed.

The filename must match the `image` field of the matching entry in
`../content.ts`. Currently awaited:

| entry     | expected filename   |
| --------- | ------------------- |
| `procomm` | `ProComm TEMS.jpg`  |
| `bubbles` | `Bubbles.png`       |

Supported extensions: `.png` `.jpg` `.jpeg` `.webp` `.avif` `.svg`

Until a file is present the card falls back to a typographic ink panel, so
nothing breaks. Entries can also reference any certificate already imported by
the folder windows (see `certImageMap` in `components/window-content.tsx`) —
those resolve without needing a copy here.
