import { getCertAsset } from "../components/window-content";

/**
 * Image lookup for content that references a file by name.
 *
 * Two sources, in order:
 *  1. `getCertAsset` — the certificates/awards already imported by the folder
 *     windows, so reusing one of those costs nothing extra.
 *  2. a glob over `src/app/data/updates/` — the drop-folder for new photos.
 *
 * Why a glob at all: a static `import` of a file that does not exist fails the
 * Vite build, and this content references photos the owner has not supplied
 * yet. A glob simply yields nothing for a missing name, and dropping the file
 * in makes it resolve with no code change.
 *
 * The glob is deliberately scoped to that one folder and to image extensions —
 * globbing the whole CERTIFICATES directory eagerly pulled ~25 MB of unused
 * certificate scans into the bundle.
 */
const dropped = import.meta.glob<string>(
  "./updates/*.{png,jpg,jpeg,webp,avif,svg}",
  { eager: true, query: "?url", import: "default" },
);

const byName: Record<string, string> = {};
for (const [path, url] of Object.entries(dropped)) {
  const name = path.split("/").pop();
  if (name) byName[name] = url;
}

export function resolveAsset(filename?: string): string | undefined {
  if (!filename) return undefined;
  const existing = getCertAsset(filename);
  if (existing && !existing.isPdf) return existing.url;
  return byName[filename];
}
