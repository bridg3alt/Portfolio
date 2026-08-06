/**
 * Single source for content that appears in BOTH a scrolling page section and a
 * folder window. The windows keep their own detailed bullet lists; what lives
 * here is the condensed form the sections render, plus the award/volunteering
 * records the achievements rail and the achievements window now share.
 */

export type TimelineEntry = {
  id: string;
  period: string;
  title: string;
  org: string;
  /** kept for reference; the timeline renders position only */
  blurb?: string;
};

export const LEADERSHIP: TimelineEntry[] = [
  {
    id: "procomm",
    period: "Mar 2026 — Present",
    title: "Initiative Lead",
    org: "IEEE ProComm–TEMS Kerala Joint Chapter",
    blurb:
      "Leading statewide initiatives in professional communication, technology leadership, and engineering management for students and young professionals.",
  },
  {
    id: "ecc",
    period: "Jan 2025 — Jan 2026",
    title: "Electronic Communications Coordinator",
    org: "IEEE Computer Society Kerala Chapter",
    blurb:
      "Ran communications and digital outreach for statewide technical events, and published the chapter newsletter COMPILE (Editions 1 & 2).",
  },
  {
    id: "secretary",
    period: "Jan 2025 — Jan 2026",
    title: "Secretary",
    org: "IEEE Student Branch, Sahrdaya College of Engineering & Technology",
    blurb:
      "Coordinated branch operations, technical events, hackathons and workshops, plus documentation, scheduling and stakeholder communication.",
  },
  {
    id: "npss",
    period: "Dec 2023 — Dec 2024",
    title: "Chairperson",
    org: "IEEE Nuclear & Plasma Sciences Society Student Chapter",
    blurb:
      "Led chapter operations and organised technical talks, workshops and awareness programs on emerging technologies.",
  },
];

export const INTERNSHIPS: TimelineEntry[] = [
  {
    id: "stride",
    period: "Jan 2026 — Jul 2026",
    title: "Project Head, STRIDE SLT",
    org: "Social Technology and Research for Inclusive Design Excellence, K-DISC",
    blurb:
      "Leading accessibility-driven initiatives in inclusive technology — planning hackathons, workshops and community programs around assistive tech.",
  },
  {
    id: "nitc",
    period: "Jun 2025 — Jul 2025",
    title: "Summer Intern",
    org: "Centre for IT Research & Automation (CITRA), NIT Calicut",
    blurb:
      "Built a JavaFX desktop application visualising real-time circuit breaker parameters, with configurable dashboards for fault monitoring.",
  },
  {
    id: "revertech",
    period: "Apr 2024 — May 2024",
    title: "Intern — Python & Machine Learning",
    org: "Revertech IT Solutions",
    blurb:
      "Applied Python fundamentals to automation problems and worked through data preprocessing, model development and evaluation.",
  },
];

/** The three columns of the Education section. */
export type EducationColumn = {
  id: string;
  period: string;
  institution: string;
  detail: string;
  stat: string;
};

export const EDUCATION_COLUMNS: EducationColumn[] = [
  {
    id: "btech",
    period: "2023 — 2027",
    institution: "Sahrdaya College of Engineering & Technology, Thrissur",
    detail:
      "B.Tech in Computer Science & Engineering · Autonomous, affiliated to APJ Abdul Kalam Technological University",
    stat: "CGPA: 8.2 / 10",
  },
  {
    id: "hss",
    period: "2021 — 2023",
    institution: "Kerala DHSE",
    detail: "Higher Secondary — Physics, Chemistry, Maths with Computer Science",
    stat: "98.5%",
  },
  {
    id: "icse",
    period: "2021",
    institution: "ICSE",
    detail: "Secondary School Certificate",
    stat: "96%",
  },
];

export type AwardEntry = {
  name: string;
  issuer: string;
  /** shown on the achievements grid card, aligned to the card foot */
  date: string;
  /** blog write-up; placeholder "#" until the Medium URLs land */
  link: string;
  /** still used by the achievements window via CertRow */
  image?: string;
  desc: string;
  keywords: string[];
  /** picks the card icon: see ICONS in components/achievements.tsx */
  icon?: "award" | "travel" | "idea" | "people";
};

export const AWARDS: AwardEntry[] = [
  {
    name: "IDEA Travel Support Recipient — IEEE ICRA 2026",
    issuer: "IEEE Robotics & Automation Society",
    date: "Jun 2026",
    link: "#",
    icon: "travel",
    image: "ICRA IDEA.jpeg",
    desc: "Awarded the IDEA Travel Support to attend IEEE ICRA 2026, one of the world's leading conferences in robotics and automation. Gained first-hand exposure to cutting-edge research, industry innovations, and emerging trends in robotics, AI, and assistive technologies while connecting with researchers and professionals from across the globe.",
    keywords: [
      "Global Research Exposure",
      "Cross-Cultural Collaboration",
      "Robotics",
      "AI & Automation",
      "Emerging Technologies",
      "Research Communication",
    ],
  },
  {
    name: "STRIDE Makethon 2025 — Best Viable Idea Award",
    issuer: "K-DISC, Kerala",
    date: "2025",
    link: "#",
    icon: "award",
    image: "STRIDE 50000.jpeg",
    desc: "Winner (one of the Top 8 teams) of STRIDE Makethon 2025 for the best viable assistive prototype, “ÓL — Empowering Independence”.",
    keywords: ["Assistive Tech", "Prototyping", "Innovation", "Hackathon"],
  },
  {
    name: "STRIDE — Powerful Story Award",
    issuer: "K-DISC, Kerala",
    date: "2025",
    link: "#",
    icon: "idea",
    image: "STRIDE AWARD DIST.jpeg",
    desc: "Recognised for the most compelling storytelling of the STRIDE Designathon & Makethon 2025 journey — creativity, authenticity, and social-media engagement.",
    keywords: ["Social Impact", "Creativity", "Storytelling"],
  },
];

export const VOLUNTEERING: AwardEntry[] = [
  {
    name: "Infinia 2.0 — Co-Lead",
    issuer: "IEEE Sahrdaya Student Branch",
    date: "Sept 2025",
    link: "#",
    icon: "people",
    image: "Brigit Thomas_Infinia 2.0_page-0001.jpg",
    desc: "Co-Lead for Infinia 2.0, a national-level flagship event organized by IEEE Sahrdaya Student Branch — helped drive planning and execution, contributing to the event's success.",
    keywords: ["Leadership", "Event Coordination", "Volunteering"],
  },
  {
    name: "Associate Designer — IEEE Computer Society Kerala",
    issuer: "IEEE CS Kerala Chapter",
    date: "2025",
    link: "#",
    icon: "idea",
    image: "IEEE CS Kerala Chapter Volunteering Certificate.png",
    desc: "Volunteered as Associate Designer for IEEE Computer Society Kerala — designed the official Compile technical newsletter, visual identity, and event/design assets.",
    keywords: ["Graphic Design", "Editorial Design", "Newsletter", "Branding", "Figma"],
  },
  {
    name: "STRIDE Innovation Day",
    issuer: "K-DISC, Kerala",
    date: "2025",
    link: "#",
    icon: "people",
    image: "KDISC STRIDE Innovation Day.png",
    desc: "Showcased assistive-technology innovation at the K-DISC STRIDE Innovation Day.",
    keywords: ["Event Coordination", "Team Management", "Public Speaking"],
  },
  {
    name: "TechXInfinia (Infinia 1.0) — Event Management Team",
    issuer: "IEEE Sahrdaya Student Branch",
    date: "Sept 2024",
    link: "#",
    icon: "people",
    image: "TechXInfinia Volunteer (IEEE Flagship Event).png",
    desc: "Served on the event management team for TechXInfinia (Infinia 1.0), the international summit and flagship event of IEEE Sahrdaya Student Branch.",
    keywords: ["Event Management", "Volunteering", "Teamwork"],
  },
];

/**
 * Cards shown in the Recognitions & Achievements grid — awards only.
 * VOLUNTEERING still feeds the Achievements window, just not this section.
 */
export const ACHIEVEMENT_CARDS: AwardEntry[] = AWARDS;

/** One card on the auto-scrolling achievements rail. */
export type AchievementStat = {
  value: string;
  title: string;
  description: string;
  /** Filename resolved through src/app/data/assets.ts. */
  image?: string;
};

/** Condensed headline form of AWARDS / VOLUNTEERING / LEADERSHIP. */
export const ACHIEVEMENT_STATS: AchievementStat[] = [
  {
    value: "ICRA 2026",
    title: "IDEA Travel Support Recipient",
    description:
      "Selected by the IEEE Robotics & Automation Society to attend ICRA 2026 in Vienna.",
    image: "-2.png",
  },
  {
    value: "2x",
    title: "STRIDE Makethon — Best Viable Idea",
    description:
      "Winning team for ÓL, an assistive water bottle pairing IoT hardware with a caregiver app.",
    image: "STRIDE 50000.jpeg",
  },
  {
    value: "Powerful Story",
    title: "STRIDE — Powerful Story Award",
    description:
      "Recognised for the most compelling storytelling of the STRIDE Designathon & Makethon 2025 journey.",
    image: "STRIDE AWARD DIST.jpeg",
  },
  {
    value: "Rexa",
    title: "Humanoid & Line-Tracking Robot",
    description:
      "High-school robotics project — an interactive humanoid robot and an autonomous line-tracking AGV.",
    image: "ROBOT.jpeg",
  },
  {
    value: "IEEE Sahrdaya SB",
    title: "Execom Recognition",
    description:
      "Recognised at an IEEE Sahrdaya Student Branch Execom ceremony for leadership contributions.",
    image: "IEEE AWARD GIVING 1.jpeg",
  },
  {
    value: "NIT Calicut",
    title: "Summer Research Internship — CITRA",
    description:
      "Completed a research internship at the Centre for IT Research & Automation, NIT Calicut.",
    image: "CITRA CERTIFICATE.jpeg",
  },
];

export type UpdateEntry = {
  id: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  /**
   * Filename resolved through src/app/data/assets.ts. Drop the file into
   * src/app/components/CERTIFICATES/ and it appears — no code change needed.
   * A name with no matching file falls back to a typographic card.
   */
  image?: string;
};

/** Edit freely — this is the only place the Profile cards come from. */
export const UPDATES: UpdateEntry[] = [
  {
    id: "icra-vienna",
    date: "Jun 2026",
    category: "Travel",
    title: "Vienna, after hours",
    excerpt:
      "Walking the old town between ICRA sessions — a first conference abroad, and a first city to get lost in.",
    image: "-1.png",
  },
  {
    id: "icra-gala",
    date: "Jun 2026",
    category: "Recognition",
    title: "ICRA 2026 Awards Night",
    excerpt:
      "The IDEA Travel Support awardees' evening at the Hofburg — celebrating inclusion, diversity and accessibility in robotics.",
    image: "-3.png",
  },
  {
    id: "speaking",
    date: "2025",
    category: "Speaking",
    title: "On the mic",
    excerpt:
      "Hosting and speaking at student branch events — the part of leadership that happens in a room, not a document.",
    image: "-4.jpeg",
  },
  {
    id: "olvia",
    date: "2025",
    category: "Project",
    title: "Building ÓL",
    excerpt:
      "Prototyping the assistive smart water bottle with the team — the STRIDE Makethon idea that became a working build.",
    image: "OLVIA.jpeg",
  },
];

export const SKILL_CHIPS = [
  "Full-Stack",
  "Accessibility",
  "IEEE Leader",
  "Human-Centered",
  "Assistive Tech",
];
