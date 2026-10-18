import { Marked } from "marked";

/**
 * Blog posts are plain Markdown files in ./blog/ — one file per post, the file
 * name (minus .md) is the URL slug: blog/my-first-post.md → /blog/my-first-post.
 * See ./blog/README.md for the front-matter fields.
 */
export type BlogPost = {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  excerpt: string;
  tags: string[];
  /** resolved image URL, if the post sets `cover:` */
  cover?: string;
  /** drafts render in `npm run dev` only, never in the production build */
  draft: boolean;
  readingMinutes: number;
  html: string;
};

const sources = import.meta.glob<string>(
  ["./blog/*.md", "!./blog/README.md"],
  { query: "?raw", import: "default", eager: true },
);
// Images kept next to the posts (e.g. blog/images/foo.jpg) are bundled and
// referenced from Markdown by relative path: ![alt](images/foo.jpg)
const images = import.meta.glob<string>(
  "./blog/**/*.{png,jpg,jpeg,webp,gif,svg}",
  { query: "?url", import: "default", eager: true },
);

function resolveImage(src: string): string {
  if (/^(https?:|data:|\/)/.test(src)) return src;
  const key = "./blog/" + src.replace(/^\.\//, "");
  return images[key] ?? src;
}

const marked = new Marked({
  gfm: true,
  walkTokens(token) {
    if (token.type === "image") token.href = resolveImage(token.href);
  },
  renderer: {
    // external links open in a new tab; in-site links stay put
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:/.test(href);
      const t = title ? ` title="${title}"` : "";
      const target = external ? ` target="_blank" rel="noopener noreferrer"` : "";
      return `<a href="${href}"${t}${target}>${text}</a>`;
    },
  },
});

/** Minimal `key: value` front matter between --- fences. */
function splitFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    meta[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return { meta, body: raw.slice(match[0].length) };
}

function parsePost(path: string, raw: string): BlogPost {
  const slug = path.replace(/^\.\/blog\//, "").replace(/\.md$/, "");
  const { meta, body } = splitFrontMatter(raw);
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    excerpt: meta.excerpt || "",
    tags: (meta.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    cover: meta.cover ? resolveImage(meta.cover) : undefined,
    draft: meta.draft === "true",
    readingMinutes: Math.max(1, Math.round(words / 200)),
    html: marked.parse(body, { async: false }),
  };
}

/** Newest first. */
export const POSTS: BlogPost[] = Object.entries(sources)
  .map(([path, raw]) => parsePost(path, raw))
  .filter((p) => import.meta.env.DEV || !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
