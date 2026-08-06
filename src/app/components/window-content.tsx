import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  FileText,
  Github,
  ExternalLink,
  Award,
  X,
  Star,
  Check,
} from "lucide-react";
// Certificate assets — only the ones actually shown are imported, so unused
// files in CERTIFICATES/ are not bundled. (Filenames have spaces; Vite resolves.)
import certStrideWin from "./CERTIFICATES/KDISC STRIDE Hackathon Winner Top.jpg";
import certStridePS from "./CERTIFICATES/KDISC STRIDE Hackathon Winner-PS.jpg";
import certStrideInnov from "./CERTIFICATES/KDISC STRIDE Innovation Day.png";
import certDrone from "./CERTIFICATES/NIELIT DRONE Workshop.png";
import certIntelAI from "./CERTIFICATES/Intel AI Certificate.png";
import certSpokenCpp from "./CERTIFICATES/Spoken CPP.png";
import certSpokenGit from "./CERTIFICATES/Spoken Git.png";
import certRos2 from "./CERTIFICATES/ROS2 Workshop.jpg";
import certWadhwani from "../../imports/Wadhwani.png";
import certNit from "./CERTIFICATES/Internship NIT Calicut Certificate.jpg";
import certPython from "./CERTIFICATES/Python Internship.jpeg";
import certSecretary from "./CERTIFICATES/IEEE Sahrdaya SB Secretary Certificate.jpg";
import certChair from "./CERTIFICATES/IEEE Sahrdaya SB NPSS Chairperson.jpg";
import certVolunteering from "./CERTIFICATES/IEEE CS Kerala Chapter Volunteering Certificate.png";
import certTechXInfinia from "./CERTIFICATES/TechXInfinia Volunteer (IEEE Flagship Event).png";
import certInfinia2 from "../../imports/Brigit Thomas_Infinia 2.0_page-0001.jpg";
import certIcraIdea from "../../imports/ICRA IDEA.jpeg";
import certEcc from "../../imports/ECC CERTIFICATE.png";
import certCompile1 from "../../imports/COMPILE '25-Edition 1.pdf";
import certCompile2 from "../../imports/COMPILE NEWSLETTER.pdf";
import certCompile1Cover from "../../imports/COMPILE BROWN.jpg";
import certCompile2Cover from "../../imports/COMPILE BLUE.png";

export function SectionGrid({ children }: { children: ReactNode }) {
  // Two columns on wide windows — items are `items-start` so an expanded
  // accordion does not stretch its neighbour.
  return <div className="grid items-start gap-4 lg:grid-cols-2">{children}</div>;
}

/* Certificate lookup keyed by the file name referenced from App.tsx. */
const certImageMap: Record<string, string> = {
  "KDISC STRIDE Hackathon Winner Top.jpg": certStrideWin,
  "KDISC STRIDE Hackathon Winner-PS.jpg": certStridePS,
  "KDISC STRIDE Innovation Day.png": certStrideInnov,
  "NIELIT DRONE Workshop.png": certDrone,
  "Intel AI Certificate.png": certIntelAI,
  "Spoken CPP.png": certSpokenCpp,
  "Spoken Git.png": certSpokenGit,
  "ROS2 Workshop.jpg": certRos2,
  "Wadhwani.png": certWadhwani,
  "COMPILE BROWN.jpg": certCompile1Cover,
  "COMPILE BLUE.png": certCompile2Cover,
  "Internship NIT Calicut Certificate.jpg": certNit,
  "Python Internship.jpeg": certPython,
  "IEEE Sahrdaya SB Secretary Certificate.jpg": certSecretary,
  "IEEE Sahrdaya SB NPSS Chairperson.jpg": certChair,
  "IEEE CS Kerala Chapter Volunteering Certificate.png": certVolunteering,
  "TechXInfinia Volunteer (IEEE Flagship Event).png": certTechXInfinia,
  "Brigit Thomas_Infinia 2.0_page-0001.jpg": certInfinia2,
  "ICRA IDEA.jpeg": certIcraIdea,
  "ECC CERTIFICATE.png": certEcc,
};
const certPdfMap: Record<string, string> = {
  "COMPILE '25-Edition 1.pdf": certCompile1,
  "COMPILE NEWSLETTER.pdf": certCompile2,
};

export function getCertAsset(
  file?: string,
): { url: string; isPdf: boolean } | undefined {
  if (!file) return undefined;
  if (certImageMap[file]) return { url: certImageMap[file], isPdf: false };
  if (certPdfMap[file]) return { url: certPdfMap[file], isPdf: true };
  return undefined;
}

export function ExpandableItem({
  title,
  meta,
  children,
  // expanded by default — the detail is the point of these windows; the header
  // still collapses an item if the reader wants to scan
  defaultOpen = true,
}: {
  title: string;
  meta?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-brand/20 bg-brand-soft/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-brand-soft/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex-1">
          <div className="text-foreground">{title}</div>
          {meta && (
            <div className="text-muted-foreground text-xs mt-0.5">{meta}</div>
          )}
        </div>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="text-brand-deep"
        >
          <ChevronRight className="size-4" strokeWidth={1.8} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-t border-brand/15 px-4 py-4 text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CertificateAttachment({
  name,
  issuer,
  onClick,
}: {
  name: string;
  issuer: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg border border-brand/20 bg-brand-soft/10 px-3 py-2 text-left transition hover:bg-brand-soft/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex size-10 items-center justify-center rounded-md bg-brand-soft/50">
        <Award className="size-5 text-brand-deep" strokeWidth={1.6} />
      </div>
      <div className="flex-1">
        <div className="text-foreground text-sm">{name}</div>
        <div className="text-muted-foreground text-xs">{issuer} · View</div>
      </div>
      <FileText className="size-4 text-muted-foreground transition group-hover:text-brand-deep" strokeWidth={1.6} />
    </button>
  );
}

/* A certificate shown inside a rectangle; click opens the full clear view. */
export function CertThumb({
  name,
  issuer,
  image,
  onOpen,
  caption = true,
}: {
  name: string;
  issuer?: string;
  image?: string;
  onOpen: () => void;
  caption?: boolean;
}) {
  const asset = getCertAsset(image);
  return (
    <button
      onClick={onOpen}
      className="group block w-full overflow-hidden rounded-lg border border-border bg-card text-left transition hover:border-brand/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`View certificate: ${name}`}
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        {asset && !asset.isPdf ? (
          <img
            src={asset.url}
            alt={name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {asset?.isPdf ? (
              <FileText className="size-8 text-brand-deep" strokeWidth={1.5} />
            ) : (
              <Award className="size-8 text-brand-deep/60" strokeWidth={1.5} />
            )}
          </div>
        )}
        <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-foreground/20 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
          <span className="rounded-md bg-white/85 px-2 py-0.5 text-[11px] font-medium text-brand-deep">
            View ↗
          </span>
        </div>
      </div>
      {caption && (
        <div className="p-2.5">
          <div className="text-foreground text-sm leading-snug">{name}</div>
          {issuer && (
            <div className="text-muted-foreground text-xs">{issuer}</div>
          )}
        </div>
      )}
    </button>
  );
}

/* Certificate row: cert on the left, description + keywords on the right. */
export function CertRow({
  name,
  issuer,
  image,
  pdf,
  desc,
  keywords,
  onOpen,
}: {
  name: string;
  issuer?: string;
  image?: string;
  pdf?: string; // if set, card shows `image` as cover but click opens this PDF
  desc?: string;
  keywords?: string[];
  onOpen: () => void;
}) {
  const asset = getCertAsset(image);
  const pdfAsset = getCertAsset(pdf);
  // The PDF target is either an explicit `pdf` cover-image pairing, or an
  // `image` that is itself a PDF.
  const pdfTarget = pdfAsset ?? (asset?.isPdf ? asset : undefined);
  const isPdf = !!pdfTarget;
  // PDFs open inline in the browser's native viewer (new tab), never download.
  // Images open in the in-page preview modal.
  const handleOpen = () => {
    if (pdfTarget) window.open(pdfTarget.url, "_blank", "noopener,noreferrer");
    else onOpen();
  };
  return (
    // h-full so every card fills its grid cell — rows then sit flush
    <div className="flex h-full flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row">
      {/* left — the certificate */}
      <button
        onClick={handleOpen}
        aria-label={isPdf ? `Open PDF: ${name}` : `View certificate: ${name}`}
        className="group relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:w-2/5"
      >
        {asset && !asset.isPdf ? (
          <img
            src={asset.url}
            alt={name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : asset?.isPdf ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-soft/20">
            <FileText className="size-9 text-brand-deep" strokeWidth={1.4} />
            <span className="text-brand-deep text-xs font-medium">
              Open PDF ↗
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Award className="size-8 text-brand-deep/60" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-foreground/15 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium text-brand-deep">
            {isPdf ? "Open ↗" : "View ↗"}
          </span>
        </div>
      </button>

      {/* right — description + keywords */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="font-display leading-snug" style={{ fontSize: "1.05rem" }}>
          {name}
        </h4>
        {issuer && (
          <div
            className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--ink)" }}
          >
            {issuer}
          </div>
        )}
        {desc && (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {desc}
          </p>
        )}
        {keywords && keywords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {keywords.slice(0, 4).map((k) => (
              <span
                key={k}
                className="rounded-md border border-border bg-muted px-2 py-0.5 text-muted-foreground text-xs"
              >
                {k}
              </span>
            ))}
            {keywords.length > 4 && (
              <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                +{keywords.length - 4}
              </span>
            )}
          </div>
        )}
        <button
          onClick={handleOpen}
          className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-medium text-brand-deep transition hover:brightness-110"
        >
          {isPdf ? "Open PDF ↗" : "View certificate ↗"}
        </button>
      </div>
    </div>
  );
}

export function CertificatePreview({
  cert,
  onClose,
}: {
  cert: { name: string; issuer: string; image?: string } | null;
  onClose: () => void;
}) {
  const asset = getCertAsset(cert?.image);
  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-foreground/70 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.button
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-5 right-5 z-10 flex size-9 items-center justify-center rounded-full border border-brand/30 bg-white/70 text-brand-deep backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close preview"
          >
            <X className="size-4" strokeWidth={1.8} />
          </motion.button>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="relative z-10 aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            {asset ? (
              <img
                src={asset.url}
                alt={cert.name}
                className="h-full w-full bg-white object-contain"
              />
            ) : (
              <div
                className="flex h-full flex-col items-center justify-center gap-4 p-12 text-center"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, color-mix(in oklch, var(--chart-4) 25%, transparent), transparent 60%), radial-gradient(circle at 80% 80%, color-mix(in oklch, var(--chart-2) 22%, transparent), transparent 60%), var(--card)",
                }}
              >
                <div
                  className="text-xs font-semibold tracking-[0.3em]"
                  style={{ color: "var(--ink)" }}
                >
                  CERTIFICATE OF ACHIEVEMENT
                </div>
                <h2 className="font-display max-w-xl" style={{ fontSize: "2rem", letterSpacing: "-0.02em" }}>
                  {cert.name}
                </h2>
                <div className="text-muted-foreground">
                  Issued by {cert.issuer}
                </div>
                <div
                  className="mt-6 h-[3px] w-24 rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--ink-deep), var(--ink-soft))" }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProjectBlock({
  title,
  date,
  category,
  problem,
  tech,
  outcomes,
  github,
  demo,
  featured,
  image,
  pdf,
  index,
}: {
  title: string;
  /** 1-based position; renders a large 01/02/… numeral above the title */
  index?: number;
  date?: string;
  category?: string; // e.g. "AI · Full-Stack · Accessibility"
  problem: ReactNode;
  tech: string[];
  outcomes: ReactNode[];
  github?: string;
  demo?: string;
  featured?: boolean; // main projects get a highlighted card + badge
  image?: string; // optional cover art (cert-map key), e.g. a newsletter cover
  pdf?: string; // optional PDF (cert-map key); opens inline in a new tab
}) {
  const cover = getCertAsset(image);
  const pdfAsset = getCertAsset(pdf);
  const openPdf = () =>
    pdfAsset && window.open(pdfAsset.url, "_blank", "noopener,noreferrer");
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-background/40 p-5 sm:p-6"
    >
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {index != null && (
            <div
              className="mb-2 font-mono text-sm font-bold tracking-[0.2em]"
              style={{ color: "var(--ink-soft)" }}
            >
              {String(index).padStart(2, "0")}
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-lg leading-tight sm:text-xl">
              {title}
            </h3>
            {featured && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: "var(--ink)", color: "#FFFFFF" }}
              >
                <Star className="size-2.5" fill="currentColor" strokeWidth={0} />
                Featured
              </span>
            )}
            {date && (
              <span className="text-muted-foreground text-xs">{date}</span>
            )}
          </div>
          {category && (
            <div
              className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--ink)" }}
            >
              {category}
            </div>
          )}
        </div>
        {(github || demo || pdfAsset) && (
          <div className="flex shrink-0 gap-2">
            {pdfAsset && (
              <a
                href={pdfAsset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="size-3.5" strokeWidth={1.6} /> Open PDF
              </a>
            )}
            {github && (
              <a
                href={github}
                className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Github className="size-3.5" strokeWidth={1.6} /> Code
              </a>
            )}
            {demo && (
              <a
                href={demo}
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="size-3.5" strokeWidth={1.6} /> Demo
              </a>
            )}
          </div>
        )}
      </div>

      {/* optional cover art (opens the PDF inline in a new tab) */}
      {cover && (
        <button
          onClick={openPdf}
          aria-label={`Open ${title}`}
          className="group/cover mt-4 flex w-full items-center justify-center overflow-hidden rounded-md border border-border bg-muted p-2"
        >
          <img
            src={cover.url}
            alt={title}
            loading="lazy"
            className="max-h-72 w-auto object-contain transition group-hover/cover:brightness-105"
          />
        </button>
      )}

      {/* summary */}
      <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
        {problem}
      </p>

      {/* outcomes */}
      <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
        {outcomes.map((o, i) => (
          <li key={i} className="flex gap-2.5">
            <Check
              className="mt-0.5 size-4 shrink-0"
              strokeWidth={2.6}
              style={{ color: "var(--ink)" }}
            />
            <span className="leading-relaxed">{o}</span>
          </li>
        ))}
      </ul>

      {/* tech footer */}
      <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border pt-4">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded-md border border-border bg-muted px-2 py-0.5 text-muted-foreground text-xs"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
