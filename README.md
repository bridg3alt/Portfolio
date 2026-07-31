# Brigit Thomas — Portfolio

An interactive, desktop-OS-themed personal portfolio built as a single-page app. It opens with
an animated **puzzle-piece "B"** intro, then drops you into a macOS-style desktop where each
section (About, Education, Internships, Projects, IEEE, Skills, Achievements, Résumé) lives in a
draggable "folder" window.

> Live title: **Brigit Thomas — Portfolio** · fully static, client-side only.

---

## ✨ Highlights

- **Animated puzzle-B intro** — pieces scatter, flip, and assemble into a "B"; on hover the
  nearest pieces slide aside and magnify while a **blue spray-paint trail** follows the cursor;
  after ~3s (or on scroll) the pieces **scatter across the screen and fall** onto the portfolio.
- **Desktop / folders UI** — a dock of folder icons, draggable windows, and a wordmark hero.
- **Baby-blue "glass" theme** — frosted panels, brand-tinted borders, soft blue shadows.
- **Accessible** — respects `prefers-reduced-motion` (idle animation is frozen; interactions
  still respond).

## 🧰 Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | [Motion](https://motion.dev) (`motion/react`) |
| Icons | lucide-react |
| Fonts | Google Fonts — Manrope, Vollkorn, Baloo 2 |

The output is a **static bundle** (HTML/CSS/JS) — no server or backend required.

## 🚀 Getting started

**Prerequisites:** [Node.js](https://nodejs.org) 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Build a production bundle into dist/
npm run build

# 4. Preview the production build locally
npx vite preview
```

## 📁 Project structure

```
.
├── index.html                 # App entry (mounts src/main.tsx)
├── src/
│   ├── main.tsx               # React root
│   ├── app/
│   │   ├── App.tsx            # Page layout + all section windows (content lives here)
│   │   └── components/
│   │       ├── intro.tsx      # Puzzle-B intro (pieces, hover, spray, scatter-and-fall)
│   │       ├── hero.tsx       # Wordmark + folder dock
│   │       ├── window.tsx     # Draggable "MacWindow"
│   │       ├── window-content.tsx  # Expandable items, project blocks, certificate preview
│   │       └── …              # dock, desktop, folder-icon, cursor/grain overlays
│   ├── imports/               # Images, the B collage, and the résumé PDF
│   └── styles/                # theme.css, globals.css (brand tokens), fonts.css, tailwind.css
└── package.json
```

## ☁️ Deploy to AWS (S3 + CloudFront)

The build in `dist/` is a static site, so it's served from an **S3 bucket** behind a
**CloudFront** CDN (HTTPS + fast global delivery). Requires the
[AWS CLI](https://aws.amazon.com/cli/) configured with credentials (`aws configure`).

### One-time setup

1. **Build the site**
   ```bash
   npm run build
   ```
2. **Create a private S3 bucket** (keep Block Public Access ON — CloudFront reaches it via an
   Origin Access Control, so the bucket never needs to be public):
   ```bash
   aws s3 mb s3://your-portfolio-bucket
   ```
3. **Create a CloudFront distribution** (Console or CLI) with:
   - **Origin:** the S3 bucket, using **Origin Access Control (OAC)** — then attach the generated
     bucket policy so only CloudFront can read it.
   - **Default root object:** `index.html`
   - **Viewer protocol policy:** Redirect HTTP → HTTPS
   - **HTTPS certificate:** request one in **AWS Certificate Manager (ACM, us-east-1)** if you
     use a custom domain.
4. **Enable SPA routing** — because this is a single-page app, deep links / refreshes must fall
   back to `index.html`. In the distribution's **Error pages**, add two custom responses:

   | HTTP error code | Response page path | HTTP response code |
   | --- | --- | --- |
   | 403 | `/index.html` | 200 |
   | 404 | `/index.html` | 200 |

### Deploying updates

Vite fingerprints asset filenames (e.g. `index-ab12cd.js`), so assets can be cached
aggressively; only `index.html` needs to be refreshed. A typical deploy:

```bash
# build, upload, and bust the CDN cache
npm run build
aws s3 sync dist/ s3://your-portfolio-bucket --delete
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

You can save that as a script (e.g. `npm run deploy` via a `"deploy"` entry in `package.json`)
once your bucket name and distribution ID are set.

## 🎨 Customization

- **Content** — edit the section data in [`src/app/App.tsx`](src/app/App.tsx) (About stats,
  Education, Internships, Projects, IEEE, Skills, Achievements) and the intro in
  [`src/app/components/intro.tsx`](src/app/components/intro.tsx).
- **Theme colors** — the brand palette lives in
  [`src/styles/globals.css`](src/styles/globals.css) (`--brand`, `--brand-soft`, `--brand-deep`).
- **Résumé** — replace the PDF in `src/imports/` (it's a separate binary; update it there when
  your CV changes).
- **Intro feel** — tweak the puzzle size, hover radius/strength, spray colors, and 3s
  auto-advance timing inside `intro.tsx`.

## 🙏 Credits

- Fonts via **Google Fonts** (Manrope, Vollkorn, Baloo 2)
- Icons by **[lucide](https://lucide.dev)**
- Animation by **[Motion](https://motion.dev)**

---

© Brigit Thomas. Personal portfolio — all rights reserved.
