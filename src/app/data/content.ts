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
    period: "Jan 2026 — Present",
    title: "Project Head, STRIDE Student Leadership Team",
    org: "K-DISC",
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
    image: "KDISC STRIDE Hackathon Winner Top.jpg",
    desc: "Winner (one of the Top 8 teams) of STRIDE Makethon 2025 for the best viable assistive prototype, “ÓL — Empowering Independence”.",
    keywords: ["Assistive Tech", "Prototyping", "Innovation", "Hackathon"],
  },
  {
    name: "STRIDE — Powerful Story Award",
    issuer: "K-DISC, Kerala",
    date: "2025",
    link: "#",
    icon: "idea",
    image: "KDISC STRIDE Hackathon Winner-PS.jpg",
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

/** Edit freely — this is the only place the Latest Updates cards come from. */
export const UPDATES: UpdateEntry[] = [
  {
    id: "icra",
    date: "Jun 2026",
    category: "Recognition",
    title: "Heading to IEEE ICRA 2026",
    excerpt:
      "Awarded the IDEA Travel Support to attend one of the world's leading robotics and automation conferences.",
    image: "ICRA IDEA.jpeg",
  },
  {
    id: "procomm",
    date: "Mar 2026",
    category: "Leadership",
    title: "Initiative Lead at IEEE ProComm–TEMS Kerala",
    excerpt:
      "Now leading statewide programs on professional communication and technology leadership across the Kerala Section.",
    // awaiting photo — drop "ProComm TEMS.jpg" into components/CERTIFICATES/
    image: "ProComm TEMS.jpg",
  },
  {
    id: "stride",
    date: "Jan 2026",
    category: "Role",
    title: "Project Head, STRIDE at K-DISC",
    excerpt:
      "Driving accessibility-first initiatives — hackathons, workshops and community programs built around assistive technology.",
    image: "KDISC STRIDE Innovation Day.png",
  },
  {
    id: "compile",
    date: "2025",
    category: "Publication",
    title: "COMPILE Edition 2 shipped",
    excerpt:
      "Designed the layouts, illustrations and branding for the second edition of the IEEE CS Kerala technical newsletter.",
    image: "COMPILE BLUE.png",
  },
  {
    id: "makethon",
    date: "2025",
    category: "Award",
    title: "Best Viable Idea at STRIDE Makethon",
    excerpt:
      "Top-8 finish for ÓL — an IoT assistive water bottle pairing sensor hardware with a caregiver companion app.",
    image: "KDISC STRIDE Hackathon Winner Top.jpg",
  },
  {
    id: "bubbles",
    date: "Ongoing",
    category: "Project",
    title: "Building Bubbles",
    excerpt:
      "An accessibility-first EdTech platform for neurodivergent children — adaptive learning, conversational AI and computer vision.",
    // awaiting photo — drop "Bubbles.png" into components/CERTIFICATES/
    image: "Bubbles.png",
  },
];

export const SKILL_CHIPS = [
  "Accessibility",
  "AI/ML",
  "IEEE Leader",
  "UI/UX",
  "Assistive Tech",
  "Full-Stack",
];
