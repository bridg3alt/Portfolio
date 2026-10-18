import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { pixelHover } from "./pixel-hover";
import { SectionShell } from "./section-shell";
import { GrainOverlay } from "./grain-overlay";
import { POSTS, getPost, formatPostDate, type BlogPost } from "../data/blog";

/** Shared chrome for /blog and /blog/:slug — same header language as the hero. */
function BlogFrame({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    document.title = title;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="relative min-h-screen w-full bg-background">
      <GrainOverlay />
      <header className="relative z-40 flex w-full items-center justify-between px-5 py-4 sm:px-6">
        <motion.span whileHover={pixelHover} className="inline-flex">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground/85 hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Portfolio
          </Link>
        </motion.span>
        <Link
          to="/"
          aria-label="Home"
          className="font-display text-foreground"
          style={{ fontSize: "1.5rem" }}
        >
          B.
        </Link>
      </header>
      {children}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground sm:px-12">
        © Brigit Thomas
      </footer>
    </div>
  );
}

function Meta({ post }: { post: BlogPost }) {
  return (
    <div
      className="font-mono text-[0.7rem] uppercase tracking-[0.2em]"
      style={{ color: "var(--ink-soft)" }}
    >
      {formatPostDate(post.date)} · {post.readingMinutes} min read
      {post.draft && (
        <span
          className="ml-3 rounded px-1.5 py-0.5 tracking-[0.15em]"
          style={{ background: "var(--ink)", color: "#FFFFFF" }}
        >
          Draft
        </span>
      )}
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function BlogIndex() {
  const allTags = useMemo(
    () => Array.from(new Set(POSTS.flatMap((p) => p.tags))).sort(),
    [],
  );
  const [tag, setTag] = useState<string | null>(null);
  const posts = tag ? POSTS.filter((p) => p.tags.includes(tag)) : POSTS;

  return (
    <BlogFrame title="Blog — Brigit Thomas">
      <SectionShell kicker="Blog" title="Notes &" accent="Writing" className="pt-12">
        {allTags.length > 1 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {[null, ...allTags].map((t) => {
              const active = tag === t;
              return (
                <button
                  key={t ?? "all"}
                  onClick={() => setTag(t)}
                  className="rounded-full border px-3 py-1 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={
                    active
                      ? { background: "var(--ink)", borderColor: "var(--ink)", color: "#FFFFFF" }
                      : { borderColor: "var(--border)", color: "var(--ink)" }
                  }
                >
                  {t ?? "All"}
                </button>
              );
            })}
          </div>
        )}

        {posts.length === 0 ? (
          <p className="max-w-xl text-muted-foreground">
            No posts yet — check back soon.
          </p>
        ) : (
          <div className="flex max-w-4xl flex-col">
            {posts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col gap-5 border-t border-border py-8 sm:flex-row sm:items-start"
                >
                  <div className="min-w-0 flex-1">
                    <Meta post={post} />
                    <h3
                      className="font-display mt-3 leading-tight transition group-hover:opacity-80"
                      style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)", color: "var(--ink)" }}
                    >
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <Tags tags={post.tags} />
                      <span
                        className="inline-flex items-center gap-1 text-sm font-medium transition group-hover:gap-2"
                        style={{ color: "var(--ink)" }}
                      >
                        Read <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                  {post.cover && (
                    <img
                      src={post.cover}
                      alt=""
                      loading="lazy"
                      className="aspect-[4/3] w-full shrink-0 rounded-lg border border-border object-cover sm:w-56"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </SectionShell>
    </BlogFrame>
  );
}

export function BlogPostPage() {
  const { slug = "" } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <BlogFrame title="Post not found — Brigit Thomas">
        <SectionShell kicker="Blog" title="Post not" accent="found" className="pt-12">
          <Link to="/blog" className="font-medium" style={{ color: "var(--ink)" }}>
            ← All posts
          </Link>
        </SectionShell>
      </BlogFrame>
    );
  }

  // POSTS is newest first: "newer" sits before, "older" after
  const i = POSTS.indexOf(post);
  const newer = POSTS[i - 1];
  const older = POSTS[i + 1];

  return (
    <BlogFrame title={`${post.title} — Brigit Thomas`}>
      <article className="mx-auto w-full max-w-2xl px-6 pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link
            to="/blog"
            className="font-mono text-[0.7rem] uppercase tracking-[0.3em] hover:opacity-70"
            style={{ color: "var(--ink-soft)" }}
          >
            ← Blog
          </Link>
          <h1
            className="font-display mt-6"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: "var(--ink)",
            }}
          >
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Meta post={post} />
            <Tags tags={post.tags} />
          </div>
          {post.cover && (
            <img
              src={post.cover}
              alt=""
              className="mt-10 w-full rounded-xl border border-border object-cover"
            />
          )}
        </motion.div>

        <div
          className="blog-prose mt-10"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {(newer || older) && (
          <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {older ? (
              <Link to={`/blog/${older.slug}`} className="group">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                  ← Older
                </div>
                <div className="font-display mt-1 text-lg group-hover:opacity-80" style={{ color: "var(--ink)" }}>
                  {older.title}
                </div>
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link to={`/blog/${newer.slug}`} className="group sm:text-right">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Newer →
                </div>
                <div className="font-display mt-1 text-lg group-hover:opacity-80" style={{ color: "var(--ink)" }}>
                  {newer.title}
                </div>
              </Link>
            )}
          </nav>
        )}
      </article>
    </BlogFrame>
  );
}
