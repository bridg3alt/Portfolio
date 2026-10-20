import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { pixelHover } from "./components/pixel-hover";
import { AmbientBackground } from "./components/ambient-background";
import { GrainOverlay } from "./components/grain-overlay";
import { CursorGlow } from "./components/cursor-glow";
import { LogoReveal } from "./components/logo-reveal";
import { ArrowDown, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { Hero } from "./components/hero";
import { Journey } from "./components/journey";
import { Education } from "./components/education";
import { Profile } from "./components/profile";
import { AchievementRail } from "./components/achievement-rail";
import { Achievements } from "./components/achievements";
import { GetInTouch } from "./components/get-in-touch";
import { AWARDS, VOLUNTEERING } from "./data/content";
import { MacWindow } from "./components/window";
import resumePdf from "../imports/BRIGIT THOMAS_RESUME_CS.pdf";
// Background-removed portrait, cropped to the subject and downscaled from
// LINKEDIN.png (12640px) so percentage sizing maps to her, not to empty alpha.
import brigit from "../styles/LINKEDIN-cut.png";

type DockItem = { id: string; label: string; tint: string; paper: string };
import {
  SectionGrid,
  ExpandableItem,
  CertThumb,
  CertRow,
  CertificatePreview,
  ProjectBlock,
} from "./components/window-content";

// Social handles — shown on the splash and in the main header.
const SOCIALS = [
  { label: "GitHub", href: "https://github.com/bridg3alt", Icon: Github },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/brigit-thomas-manjooran/",
    Icon: Linkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/__brigit_thomas",
    Icon: Instagram,
  },
  { label: "Email", href: "mailto:brigitmanjooran@gmail.com", Icon: Mail },
];

// Charcoal ink — mirrors --ink in globals.css. Kept as a literal because the
// tint is interpolated into SVG gradient stops via color-mix(), not the cascade.
const FOLDER_TINT = "#373431";
const FOLDER_PAPER = "#FFFFFF";
const DOCK_ITEMS: DockItem[] = [
  // Paper is white across the board so every folder reads as charcoal + paper.
  { id: "about",          label: "About",          tint: FOLDER_TINT, paper: FOLDER_PAPER },
  { id: "internships",    label: "Internships",    tint: FOLDER_TINT, paper: FOLDER_PAPER },
  { id: "projects",       label: "Projects",       tint: FOLDER_TINT, paper: FOLDER_PAPER },
  { id: "ieee",           label: "Leadership",     tint: FOLDER_TINT, paper: FOLDER_PAPER },
  { id: "skills",         label: "Skills",         tint: FOLDER_TINT, paper: FOLDER_PAPER },
  { id: "certifications", label: "Certifications", tint: FOLDER_TINT, paper: FOLDER_PAPER },
  { id: "achievements",   label: "Achievements",   tint: FOLDER_TINT, paper: FOLDER_PAPER },
];

export default function App() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [cert, setCert] = useState<{
    name: string;
    issuer: string;
    image?: string;
  } | null>(null);

  const close = () => setOpenId(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);

  // Splash runs once per page load. It waits for a deliberate scroll/click, so
  // the reveal is never cut off mid-animation. Arriving here from inside the
  // site (e.g. back from the blog) skips it — "default" is the key of the
  // first location in a page load.
  const location = useLocation();
  const [introDone, setIntroDone] = useState(location.key !== "default");

  useEffect(() => {
    document.title = "Brigit Thomas — Portfolio";
  }, []);
  const touchStartY = useRef<number | null>(null);
  const dismissIntro = () => setIntroDone(true);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AmbientBackground />
      <GrainOverlay />
      <CursorGlow />

      {/* Splash — a one-shot overlay, not a scroll section. It holds after the
          reveal until the visitor scrolls or clicks the cue, then unmounts for
          the rest of the page load; a reload plays it again. */}
      <AnimatePresence>
        {!introDone && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-[#090908] px-6 py-5 sm:px-10 sm:py-7"
            onWheel={(e) => {
              if (e.deltaY > 0) dismissIntro();
            }}
            onTouchStart={(e) => {
              touchStartY.current = e.touches[0]?.clientY ?? null;
            }}
            onTouchMove={(e) => {
              const start = touchStartY.current;
              const y = e.touches[0]?.clientY;
              if (start != null && y != null && start - y > 30) dismissIntro();
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div className="relative z-20 flex items-center justify-end">
              <nav className="flex items-center gap-5 sm:gap-6">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="text-white/60 transition hover:text-white"
                    whileHover={pixelHover}
                  >
                    <Icon className="size-5" />
                  </motion.a>
                ))}
              </nav>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <LogoReveal size={360} />
            </div>

            <div className="relative z-20 flex items-end justify-end">
              <button
                type="button"
                onClick={dismissIntro}
                className="group flex shrink-0 items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
              >
                Scroll down
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <ArrowDown className="size-4" />
                </motion.span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* no scroll-snap: it fights the pinned horizontal achievements rail */}
      <div
        ref={scrollRef}
        className="h-screen scroll-smooth overflow-y-auto"
      >
        <section
          ref={pageRef}
          className="relative flex min-h-[100svh] w-full flex-col snap-start md:h-screen"
        >
          {/* Portrait — hoisted out of Hero so her box starts at the very top
              of the screen (behind the header) rather than below it, which is
              the only vertical room left. `object-contain` guarantees the whole
              photo is shown: it is scaled to fit, never cropped. */}
          {/* lg, not md: below ~1024px there is no horizontal room beside the
              copy, and she lands on top of the wordmark and the folder dock. */}
          <div className="pointer-events-none absolute top-[3rem] right-[2%] bottom-[4rem] z-10 hidden w-[44%] lg:block">
            <img
              src={brigit}
              alt="Brigit Thomas"
              className="h-full w-full select-none object-contain object-right-bottom"
            />
          </div>

          {/* Top navigation — Desktop3D-style */}
          <header className="relative z-40 flex w-full items-center justify-between px-5 py-4 sm:px-6">
            <nav className="hidden items-center gap-8 text-foreground/85 md:flex">
              <motion.a
                href={resumePdf}
                download="BRIGIT THOMAS_RESUME_CS.pdf"
                style={{ color: "var(--ink)", fontWeight: 600 }}
                whileHover={pixelHover}
              >
                Download CV
              </motion.a>
              <motion.span whileHover={pixelHover} className="inline-flex">
                <Link to="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </motion.span>
              <motion.a
                href="#contact"
                className="hover:text-foreground"
                whileHover={pixelHover}
              >
                Contact
              </motion.a>

              {/* Same handles as the splash, kept reachable once it is gone */}
              <span className="h-4 w-px bg-foreground/20" />
              {SOCIALS.map(({ label, href, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="text-foreground/60 transition hover:text-foreground"
                  whileHover={pixelHover}
                >
                  <Icon className="size-[1.05rem]" />
                </motion.a>
              ))}
            </nav>
            {/* the desktop nav is hidden below md, so keep the blog reachable */}
            <Link to="/blog" className="md:hidden text-foreground">
              Blog
            </Link>
            <div
              className="font-display text-foreground"
              style={{ fontSize: "1.5rem" }}
            >
              B.
            </div>
          </header>

          <main className="relative flex-1 min-h-0">
            <Hero files={DOCK_ITEMS} onOpen={setOpenId} />
          </main>
        </section>

        {/* Scrolling sections below the hero. The folder windows still hold the
            detailed version of this content — these are the scannable form. */}
        <Journey />
        <AchievementRail />
        <Education />
        <Profile />
        <Achievements />
        <GetInTouch
          links={[
            { label: "Mail", href: "mailto:brigitmanjooran@gmail.com" },
            {
              label: "LinkedIn",
              href: SOCIALS.find((s) => s.label === "LinkedIn")?.href ?? "#",
            },
            {
              label: "GitHub",
              href: SOCIALS.find((s) => s.label === "GitHub")?.href ?? "#",
            },
          ]}
        />
      </div>

      {/* ===== Windows ===== */}

      <MacWindow
        open={openId === "about"}
        onClose={close}
        layoutId="tile-about"
        title="About — Brigit Thomas"
        subtitle="Profile"
      >
        <div className="flex flex-col gap-5">
          <h3
            className="font-display"
            style={{
              fontSize: "2rem",
              letterSpacing: "-0.02em",
            }}
          >
            B.Tech CSE undergraduate · Inclusive product builder
          </h3>
          <p className="text-muted-foreground">
            Based in Thrissur, Kerala. I work across software
            development, AI/ML fundamentals, and UI/UX design —
            with a particular focus on assistive technology and
            accessible educational tools. I've shipped
            interactive dashboards, image-based ML pipelines,
            and inclusive mobile experiences through academic
            research and industry internships.
          </p>
          <p className="text-muted-foreground">
            Outside of code I lead IEEE chapters, design
            technical newsletters, and care deeply about
            impact-driven innovation.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
            {[
              { k: "8.2", v: "CGPA · Sem 6" },
              { k: "98.5%", v: "Kerala DHSE" },
              { k: "96%", v: "ICSE" },
              { k: "K-DISC", v: "Award '25" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-lg border border-border p-3"
              >
                <div
                  className="font-display"
                  style={{
                    fontSize: "1.5rem",
                    color: "var(--ink)",
                  }}
                >
                  {s.k}
                </div>
                <div className="text-muted-foreground text-xs">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MacWindow>

      <MacWindow
        open={openId === "internships"}
        onClose={close}
        layoutId="tile-internships"
        title="Internships"
        subtitle="Experience"
      >
        <SectionGrid>
          <ExpandableItem
            title="Project Head, STRIDE SLT"
            meta="Social Technology and Research for Inclusive Design Excellence, K-DISC · Jan 2026 – Jul 2026"
          >
            <ul className="flex flex-col gap-2">
              <li>
                · Lead <b>accessibility-driven initiatives</b> focused on{" "}
                <b>inclusive technology</b>, innovation, and student
                development.
              </li>
              <li>
                · Plan and organize <b>hackathons</b>, project-based programs,
                workshops, and community initiatives promoting{" "}
                <b>assistive technology</b>.
              </li>
              <li>
                · Coordinate <b>multidisciplinary teams</b>, manage{" "}
                <b>project execution</b>, and collaborate with{" "}
                <b>stakeholders</b> to deliver high-impact programs.
              </li>
            </ul>
            <a
              href="https://stride-kdisc.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition hover:brightness-105"
              style={{
                background: "color-mix(in srgb, var(--brand-soft) 55%, #fff)",
                color: "var(--ink)",
                border: "1px solid color-mix(in srgb, var(--brand) 22%, transparent)",
              }}
            >
              Visit STRIDE ↗
            </a>
          </ExpandableItem>
          <ExpandableItem
            title="Summer Intern — NIT Calicut"
            meta="Centre for IT Research & Automation (CITRA), NIT Calicut · 02 Jun 2025 – 04 Jul 2025"
          >
            <ul className="flex flex-col gap-2">
              <li>
                · Developed a <b>JavaFX</b>-based desktop
                application to visualize real-time circuit breaker
                parameters.
              </li>
              <li>
                · Built configurable dashboards using JavaFX Charts
                and custom UI components for efficient fault
                monitoring and data analysis.
              </li>
              <li>
                · Tested, debugged, and deployed the application
                using Apache NetBeans, collaborating with faculty
                mentors from the Department of Computer Science &
                Engineering.
              </li>
            </ul>
            <div className="mt-3 text-muted-foreground text-xs">
              Tech Stack: Java, JavaFX, Apache NetBeans
            </div>
            <div className="mt-3 max-w-[220px]">
              <CertThumb
                name="Internship Certificate"
                issuer="NIT Calicut · CITRA"
                image="CITRA CERTIFICATE.jpeg"
                onOpen={() =>
                  setCert({
                    name: "Summer Internship — NIT Calicut (CITRA)",
                    issuer: "NIT Calicut · 02 Jun 2025 – 04 Jul 2025",
                    image: "CITRA CERTIFICATE.jpeg",
                  })
                }
              />
            </div>
          </ExpandableItem>
          <ExpandableItem
            title="Intern — Revertech IT Solutions"
            meta="Revertech IT Solutions · 02 Apr 2024 – 02 May 2024"
          >
            <ul className="flex flex-col gap-2">
              <li>
                · Applied Python programming fundamentals to solve
                practical problems and implement basic automation
                tasks.
              </li>
              <li>
                · Explored machine learning concepts through
                hands-on exercises involving data preprocessing,
                model development, and evaluation.
              </li>
              <li>
                · Built a strong foundation in AI workflows by
                working with Python-based data analysis and
                introductory machine learning techniques.
              </li>
            </ul>
            <div className="mt-3 text-muted-foreground text-xs">
              1-month internship on Python &amp; ML
            </div>
            <div className="mt-3 max-w-[220px]">
              <CertThumb
                name="Certificate of Completion"
                issuer="Revertech IT Solutions"
                image="Python Internship.jpeg"
                onOpen={() =>
                  setCert({
                    name: "Python & ML Internship — Revertech IT Solutions",
                    issuer: "Revertech IT Solutions · 02 Apr 2024 – 02 May 2024",
                    image: "Python Internship.jpeg",
                  })
                }
              />
            </div>
          </ExpandableItem>
        </SectionGrid>
      </MacWindow>

      <MacWindow
        open={openId === "projects"}
        onClose={close}
        layoutId="tile-projects"
        title="Projects"
      >
        <div className="grid items-start gap-5 xl:grid-cols-2">
          <ProjectBlock
            index={1}
            title="Bubbles"
            category="AI · Full-Stack · Accessibility · EdTech"
            problem={
              <>
                Accessibility-first{" "}
                <b className="text-foreground">
                  EdTech platform for neurodivergent children
                </b>
                , combining adaptive learning, conversational AI, computer
                vision, and gamification.
              </>
            }
            tech={[
              "React",
              "Next.js",
              "TypeScript",
              "Firebase",
              "Tailwind CSS",
              "Framer Motion",
              "WebGL",
              "OpenCV",
              "TensorFlow",
            ]}
            outcomes={[
              <>
                Built a responsive{" "}
                <b className="text-foreground">React / Next.js</b> SPA with
                WCAG-aligned, accessibility-first components.
              </>,
              <>
                Integrated a conversational{" "}
                <b className="text-foreground">AI chatbot</b> and{" "}
                <b className="text-foreground">OpenCV / TensorFlow</b>{" "}
                interactions for personalised, gamified learning.
              </>,
              <>
                Implemented{" "}
                <b className="text-foreground">real-time progress tracking</b>{" "}
                and authentication with Firebase over REST APIs.
              </>,
            ]}
          />
          <ProjectBlock
            index={2}
            title="Eko — Game-Based AI Speech Therapy"
            date="Final Year Project · In Progress"
            category="AI · Explainable AI · Healthcare · Gamification"
            problem={
              <>
                An <b className="text-foreground">AI-powered speech-therapy app</b>{" "}
                that identifies the{" "}
                <b className="text-foreground">type of stutter</b> a person has
                and helps them practise through{" "}
                <b className="text-foreground">interactive games</b>.
              </>
            }
            tech={[
              "Flutter",
              "Python",
              "PyTorch",
              "FastAPI",
              "PostgreSQL",
              "Docker",
              "AWS",
              "SHAP",
              "RAG",
            ]}
            outcomes={[
              <>
                Identifies the{" "}
                <b className="text-foreground">type and severity of stutter</b>{" "}
                from the user's speech, then picks the exercises that suit it.
              </>,
              <>
                Turns those exercises into{" "}
                <b className="text-foreground">interactive games</b>, while an
                AI <b className="text-foreground">digital twin</b> follows each
                user's progress over time and adapts what comes next.
              </>,
              <>
                Uses <b className="text-foreground">Explainable AI</b> so
                therapists can see <b className="text-foreground">why</b> a
                result was given, with suggestions backed by real clinical
                sources on a secure <b className="text-foreground">cloud</b>{" "}
                backend.
              </>,
            ]}
          />
          <ProjectBlock
            index={3}
            title="MemoryBridge — Music That Brings Memories Back"
            category="AI · Machine Learning · Personalisation"
            problem={
              <>
                An AI-powered{" "}
                <b className="text-foreground">music recommendation system</b>{" "}
                that reconnects listeners with songs from the meaningful
                periods of their lives — personalised by age, language, genre,
                favourite artists and popularity.
              </>
            }
            tech={[
              "Python",
              "Altair AI Studio (RapidMiner)",
              "TurboPrep",
              "Random Forest",
              "Machine Learning",
            ]}
            outcomes={[
              <>
                Built a library of{" "}
                <b className="text-foreground">9,840 songs from 1950–2010</b>,
                mixing the Million Song Dataset with Hindi and Malayalam
                music.
              </>,
              <>
                Trained a{" "}
                <b className="text-foreground">Random Forest model</b> on the
                listening patterns of 300 simulated listeners to learn what
                each person would love.
              </>,
              <>
                Listeners share a memory or life period in{" "}
                <b className="text-foreground">Malayalam, Hindi or English</b>,
                and get songs that fit that moment.
              </>,
            ]}
          />
          <ProjectBlock
            index={4}
            title="Personal Portfolio Website"
            category="Frontend · Cloud"
            problem={
              <>
                Single-page portfolio built on a{" "}
                <b className="text-foreground">
                  component-driven React architecture
                </b>
                .
              </>
            }
            tech={[
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Vite",
              "Framer Motion",
              "AWS",
              "GitHub",
            ]}
            outcomes={[
              <>
                Responsive <b className="text-foreground">React + TypeScript</b>{" "}
                SPA with reusable, composable components.
              </>,
              <>
                <b className="text-foreground">GPU-accelerated WebGL / Canvas</b>{" "}
                motion graphics with Framer Motion transitions.
              </>,
              <>
                Deployed on <b className="text-foreground">AWS</b> (S3 +
                CloudFront) with a GitHub-based build / versioning workflow.
              </>,
            ]}
          />
          <ProjectBlock
            index={5}
            title="ÓL — Assistive Smart Water Bottle"
            category="IoT · Full-Stack · Assistive Tech"
            problem={
              <>
                <b className="text-foreground">IoT-enabled assistive system</b>{" "}
                pairing a sensor-driven smart water bottle with a React companion
                app over a Firebase real-time backend.
              </>
            }
            tech={["React", "Firebase", "IoT"]}
            outcomes={[
              <>
                <b className="text-foreground">Sensor integration</b> for
                hydration tracking and scheduled medication reminders.
              </>,
              <>
                React companion app with{" "}
                <b className="text-foreground">Firebase real-time sync</b> for
                remote caregiver monitoring.
              </>,
              "Accessibility-first UX for elderly and neurodivergent users.",
            ]}
          />
          <ProjectBlock
            index={6}
            title="Rexa"
            category="Robotics · Embedded Systems"
            problem={
              <>
                High-school robotics project — an interactive humanoid robot and
                an{" "}
                <b className="text-foreground">
                  autonomous line-tracking robot (AGV-style navigation)
                </b>
                .
              </>
            }
            tech={["Arduino", "Embedded C", "Sensors"]}
            outcomes={[
              <>
                Interactive humanoid robot with{" "}
                <b className="text-foreground">
                  sensor-based human–robot interaction (HRI)
                </b>
                .
              </>,
              <>
                <b className="text-foreground">Autonomous path-tracking robot</b>{" "}
                using an <b className="text-foreground">IR sensor array</b> for
                line following.
              </>,
              <>
                Hands-on foundation in{" "}
                <b className="text-foreground">embedded systems</b>, sensor
                integration, and control logic.
              </>,
            ]}
          />
          <ProjectBlock
            index={7}
            title="CS COMPILE — Edition 1"
            category="Editor · IEEE Computer Society Kerala Chapter · Quantum Computing"
            image="COMPILE BROWN.jpg"
            pdf="COMPILE '25-Edition 1.pdf"
            problem={
              <>
                Edited and curated{" "}
                <b className="text-foreground">CS COMPILE — Edition 1</b>,
                ensuring content quality, consistency, and readability across
                technical articles, chapter highlights, achievements, and member
                features.
              </>
            }
            tech={[
              "Editing",
              "Technical Writing",
              "Quantum Computing",
              "Publishing",
            ]}
            outcomes={[
              <>
                Collaborated with writers and the design team to{" "}
                <b className="text-foreground">structure the newsletter</b>,
                refine editorial flow, and deliver a cohesive publication aligned
                with the Chapter's vision.
              </>,
            ]}
          />
          <ProjectBlock
            index={8}
            title="CS COMPILE — Edition 2"
            category="Designer · IEEE Computer Society Kerala Chapter · Cloud Computing"
            image="COMPILE BLUE.png"
            pdf="COMPILE NEWSLETTER.pdf"
            problem={
              <>
                Designed creative assets and publication layouts for the second
                edition of <b className="text-foreground">CS COMPILE</b>,
                contributing to a modern visual identity and an improved reading
                experience.
              </>
            }
            tech={[
              "Editorial Design",
              "Layout",
              "Cloud Computing",
              "Figma",
            ]}
            outcomes={[
              <>
                Worked closely with the editorial and creative teams to develop{" "}
                <b className="text-foreground">
                  illustrations, page layouts, and branding elements
                </b>{" "}
                while maintaining design consistency throughout the publication.
              </>,
            ]}
          />
        </div>
      </MacWindow>

      <MacWindow
        open={openId === "ieee"}
        onClose={close}
        layoutId="tile-ieee"
        title="Leadership & Volunteering"
        subtitle="Roles & Community"
      >
        <SectionGrid>
          <ExpandableItem
            title="Initiative Lead — IEEE ProComm–TEMS Kerala Joint Chapter"
            meta="Mar 2026 – Present"
          >
            <ul className="flex flex-col gap-2">
              <li>
                · Lead statewide initiatives promoting{" "}
                <b>professional communication</b>,{" "}
                <b>technology leadership</b>, and{" "}
                <b>engineering management</b> among students and young
                professionals.
              </li>
              <li>
                · Plan and execute <b>technical events</b>, workshops, and{" "}
                <b>leadership programs</b> in collaboration with IEEE
                volunteers, Student Branches, and chapter leadership.
              </li>
              <li>
                · Coordinate <b>cross-functional teams</b> to strengthen{" "}
                <b>member engagement</b>, professional development, and
                chapter outreach across the IEEE Kerala Section.
              </li>
            </ul>
          </ExpandableItem>
          <ExpandableItem
            title="Electronic Communications Coordinator (ECC) — IEEE Computer Society Kerala Chapter"
            meta="Jan 2025 – Jan 2026"
          >
            <ul className="flex flex-col gap-2">
              <li>
                · Led communications and <b>digital outreach</b> for statewide
                technical events, conferences, workshops, and flagship
                initiatives.
              </li>
              <li>
                · Designed and published the official chapter newsletter,{" "}
                <b>Compile (Editions 1 &amp; 2)</b>, communicating technical
                content and chapter achievements.
              </li>
              <li>
                · Developed <b>promotional campaigns</b>, digital assets, and
                communication strategies to increase community engagement and
                event visibility.
              </li>
            </ul>
            <div className="mt-3 flex max-w-[460px] flex-wrap gap-3">
              <div className="w-[220px]">
                <CertThumb
                  name="ECC Certificate"
                  issuer="IEEE Computer Society Kerala"
                  image="ECC CERTIFICATE.png"
                  onOpen={() =>
                    setCert({
                      name: "Electronic Communications Coordinator — IEEE Computer Society Kerala",
                      issuer: "IEEE CS Kerala · Jan 2025 – Jan 2026",
                      image: "ECC CERTIFICATE.png",
                    })
                  }
                />
              </div>
              <div className="w-[220px]">
                <CertThumb
                  name="ECC — IEEE CS Kerala"
                  issuer="IEEE Computer Society Kerala"
                  image="ECC CSKS.jpeg"
                  onOpen={() =>
                    setCert({
                      name: "Electronic Communications Coordinator — IEEE Computer Society Kerala",
                      issuer: "IEEE CS Kerala · Jan 2025 – Jan 2026",
                      image: "ECC CSKS.jpeg",
                    })
                  }
                />
              </div>
            </div>
          </ExpandableItem>
          <ExpandableItem
            title="Secretary — IEEE Student Branch, Sahrdaya College of Engineering & Technology"
            meta="Jan 2025 – Jan 2026"
          >
            <ul className="flex flex-col gap-2">
              <li>
                · Coordinate branch operations, <b>technical events</b>,{" "}
                <b>hackathons</b>, workshops, and student engagement
                initiatives.
              </li>
              <li>
                · Manage <b>documentation</b>, event planning, scheduling,
                reporting, and <b>stakeholder communication</b>.
              </li>
              <li>
                · Support <b>volunteer management</b>, executive committee
                coordination, and strategic planning for student branch
                activities.
              </li>
            </ul>
            <div className="mt-3 flex max-w-[460px] flex-wrap gap-3">
              <div className="w-[220px]">
                <CertThumb
                  name="Certificate of Appreciation"
                  issuer="IEEE Sahrdaya SB · Execom'25"
                  image="IEEE Sahrdaya SB Secretary Certificate.jpg"
                  onOpen={() =>
                    setCert({
                      name: "Secretary — IEEE Student Branch, Sahrdaya",
                      issuer: "IEEE Sahrdaya SB · Jan 2025 – Jan 2026",
                      image: "IEEE Sahrdaya SB Secretary Certificate.jpg",
                    })
                  }
                />
              </div>
              <div className="w-[220px]">
                <CertThumb
                  name="Secretary — IEEE Sahrdaya SB"
                  issuer="IEEE Sahrdaya SB"
                  image="SECRETARY.jpeg"
                  onOpen={() =>
                    setCert({
                      name: "Secretary — IEEE Student Branch, Sahrdaya",
                      issuer: "IEEE Sahrdaya SB · Jan 2025 – Jan 2026",
                      image: "SECRETARY.jpeg",
                    })
                  }
                />
              </div>
            </div>
          </ExpandableItem>
          <ExpandableItem
            title="Chairperson — IEEE Nuclear & Plasma Sciences Society (NPSS) Student Chapter"
            meta="Dec 2023 – Dec 2024"
          >
            <ul className="flex flex-col gap-2">
              <li>
                · Led chapter operations and organized <b>technical talks</b>,
                workshops, and awareness programs on <b>emerging technologies</b>.
              </li>
              <li>
                · Coordinated volunteers, managed event logistics, and promoted
                student participation in IEEE technical activities.
              </li>
              <li>
                · Supported <b>membership development</b> and community
                engagement through chapter-led initiatives.
              </li>
            </ul>
            <div className="mt-3 max-w-[220px]">
              <CertThumb
                name="Certificate of Appreciation"
                issuer="IEEE Sahrdaya SB · Execom'24"
                image="IEEE Sahrdaya SB NPSS Chairperson.jpg"
                onOpen={() =>
                  setCert({
                    name: "Chairperson — IEEE NPSS Student Chapter, Sahrdaya",
                    issuer: "IEEE Sahrdaya SB · Dec 2023 – Dec 2024",
                    image: "IEEE Sahrdaya SB NPSS Chairperson.jpg",
                  })
                }
              />
            </div>
          </ExpandableItem>
        </SectionGrid>
      </MacWindow>

      <MacWindow
        open={openId === "skills"}
        onClose={close}
        layoutId="tile-skills"
        title="Skills"
        subtitle="Technical & Professional"
      >
        <div className="grid items-start gap-8 lg:grid-cols-2">
          {[
            {
              group: "Technical Skills",
              cats: [
                {
                  k: "Programming Languages",
                  v: ["Python", "Java", "C++", "JavaScript", "TypeScript"],
                },
                {
                  k: "Frontend Development",
                  v: [
                    "React",
                    "Next.js",
                    "HTML5",
                    "CSS3",
                    "Tailwind CSS",
                    "Framer Motion",
                    "WebGL",
                    "Responsive Web Design",
                  ],
                },
                {
                  k: "Backend & Cloud",
                  v: [
                    "Firebase",
                    "Firebase Authentication",
                    "Cloud Firestore",
                    "REST APIs",
                    "AWS",
                    "Amazon S3",
                    "Amazon CloudFront",
                  ],
                },
                {
                  k: "AI & Machine Learning",
                  v: [
                    "Artificial Intelligence",
                    "Machine Learning",
                    "TensorFlow",
                    "OpenCV",
                    "Computer Vision",
                    "Image Processing",
                    "AI Integration",
                  ],
                },
                {
                  k: "Data Science",
                  v: [
                    "Data Analysis",
                    "Data Preprocessing",
                    "Dataset Engineering",
                    "Feature Engineering",
                    "Random Forest",
                    "Recommendation Systems",
                    "Altair AI Studio (RapidMiner)",
                    "TurboPrep",
                  ],
                },
                {
                  k: "IoT & Embedded Systems",
                  v: ["Arduino", "Sensor Integration"],
                },
                {
                  k: "Developer Tools",
                  v: ["Git", "GitHub", "Apache NetBeans", "Figma", "Overleaf"],
                },
              ],
            },
            {
              group: "Professional Skills",
              cats: [
                {
                  k: "Leadership & Management",
                  v: [
                    "Leadership",
                    "Team Management",
                    "Volunteer Management",
                    "Project Coordination",
                    "Event Management",
                    "Strategic Planning",
                  ],
                },
                {
                  k: "Communication",
                  v: [
                    "Technical Communication",
                    "Public Speaking",
                    "Presentation Skills",
                    "Documentation",
                    "Content Creation",
                    "Technical Newsletter Design",
                  ],
                },
                {
                  k: "Collaboration",
                  v: [
                    "Cross-functional Collaboration",
                    "Stakeholder Coordination",
                    "Community Engagement",
                    "Teamwork",
                  ],
                },
                {
                  k: "Design & Research",
                  v: [
                    "Accessibility",
                    "Inclusive Design",
                    "Human-Centered Design",
                    "User Experience (UX)",
                  ],
                },
                {
                  k: "Problem Solving",
                  v: [
                    "Analytical Thinking",
                    "Critical Thinking",
                    "Problem Solving",
                    "Research",
                  ],
                },
              ],
            },
          ].map((section) => (
            <div key={section.group} className="flex flex-col gap-4">
              <h3 className="font-display" style={{ fontSize: "1.35rem" }}>
                {section.group}
              </h3>
              {section.cats.map((row) => (
                <div
                  key={row.k}
                  className="rounded-lg border border-border p-5"
                >
                  <div
                    className="text-xs tracking-[0.2em]"
                    style={{ color: "var(--ink)" }}
                  >
                    {row.k.toUpperCase()}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {row.v.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-muted px-2.5 py-1 text-foreground text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </MacWindow>

      <MacWindow
        open={openId === "certifications"}
        onClose={close}
        layoutId="tile-certifications"
        title="Certifications"
        subtitle="Courses & Workshops"
      >
        {/* no items-start: cells stretch so cards in a row match height */}
        <div className="grid gap-5 xl:grid-cols-2">
          {[
            {
              name: "Student Competition Winner — First Prize",
              issuer: "Siemens Empowers Education · 2026",
              image: "SIEMENS CERTIFICATE.png",
              desc: "Siemens digital badge for winning first prize in the Data Science Contest held with Siemens at IEDC Summit 2026.",
              keywords: ["Data Science", "Machine Learning", "Competition"],
            },
            {
              name: "AI Foundations",
              issuer: "Intel · 2025",
              image: "Intel AI Certificate.png",
              desc: "Foundations of Artificial Intelligence and Machine Learning.",
              keywords: ["Artificial Intelligence", "Machine Learning"],
            },
            {
              name: "IgniteX 1.0 — Entrepreneurship",
              issuer: "Wadhwani Foundation · Apr 2025",
              image: "Wadhwani.png",
              desc: "Wadhwani Foundation program (IgniteX 1.0) covering ideation, prototyping, business modeling, and financial planning.",
              keywords: ["Entrepreneurship", "Ideation", "Business Modeling"],
            },
            {
              name: "Spoken Tutorial — C++",
              issuer: "IIT Bombay",
              image: "Spoken CPP.png",
              desc: "Certified C++ programming course under the Spoken Tutorial project, IIT Bombay.",
              keywords: ["C++", "Programming"],
            },
            {
              name: "Spoken Tutorial — Git",
              issuer: "IIT Bombay",
              image: "Spoken Git.png",
              desc: "Certified Git version-control course under the Spoken Tutorial project, IIT Bombay.",
              keywords: ["Git", "Version Control"],
            },
            {
              name: "5-Day Bootcamp on Drone & Allied Technologies",
              issuer: "NIELIT Calicut · 2025",
              image: "NIELIT DRONE Workshop.png",
              desc: "Hands-on training in drone systems, data acquisition, and allied real-world technologies.",
              keywords: ["Drone Technology", "Embedded Systems", "IoT"],
            },
            {
              name: "ROS 2 Workshop",
              issuer: "Robotics · Workshop",
              image: "ROS2 Workshop.jpg",
              desc: "Hands-on workshop on the Robot Operating System (ROS 2).",
              keywords: ["Robotics", "ROS 2"],
            },
          ].map((c) => (
            <CertRow
              key={c.name}
              name={c.name}
              issuer={c.issuer}
              image={c.image}
              desc={c.desc}
              keywords={c.keywords}
              onOpen={() =>
                setCert({ name: c.name, issuer: c.issuer, image: c.image })
              }
            />
          ))}
        </div>
      </MacWindow>

      <MacWindow
        open={openId === "achievements"}
        onClose={close}
        layoutId="tile-achievements"
        title="Achievements & Volunteering"
        subtitle="Recognition & Community"
      >
        <div className="flex flex-col gap-5">
          {/* shared with the achievements rail — see src/app/data/content.ts */}
          <div className="grid gap-5 xl:grid-cols-2">
          {AWARDS.map((c) => (
            <CertRow
              key={c.name}
              name={c.name}
              issuer={c.issuer}
              image={c.image}
              desc={c.desc}
              keywords={c.keywords}
              onOpen={() =>
                setCert({ name: c.name, issuer: c.issuer, image: c.image })
              }
            />
          ))}
          </div>

          <div className="mt-2 border-t border-border pt-5">
            <h3 className="font-display" style={{ fontSize: "1.35rem" }}>
              Volunteering
            </h3>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
          {VOLUNTEERING.map((c) => (
            <CertRow
              key={c.name}
              name={c.name}
              issuer={c.issuer}
              image={c.image}
              desc={c.desc}
              keywords={c.keywords}
              onOpen={() =>
                setCert({ name: c.name, issuer: c.issuer, image: c.image })
              }
            />
          ))}
          </div>
        </div>
      </MacWindow>

      <CertificatePreview
        cert={cert}
        onClose={() => setCert(null)}
      />
    </div>
  );
}