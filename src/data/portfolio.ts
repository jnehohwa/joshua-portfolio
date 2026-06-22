export type ProjectLink = {
  label: string
  href: string
  external?: boolean
}

export type Project = {
  title: string
  type: string
  role: string
  timeline: string
  summary: string
  impact: string
  highlights: string[]
  stack: string[]
  links: {
    caseStudy?: string
    source?: string
    live?: string
  }
}

export type CaseStudyImage = {
  src: string
  alt: string
  caption: string
}

export type CaseStudySection = {
  title: string
  body: string[]
  bullets?: string[]
}

export type CaseStudy = {
  slug: string
  title: string
  type: string
  role: string
  timeline: string
  status: string
  summary: string
  stack: string[]
  metrics: Array<{
    label: string
    value: string
  }>
  links: ProjectLink[]
  heroImage?: CaseStudyImage
  gallery?: CaseStudyImage[]
  sections: CaseStudySection[]
}

export type TimelineItem = {
  date: string
  title: string
  description: string
}

export const profile = {
  name: 'Joshua Nehohwa',
  initials: 'JN',
  role: 'Software Engineering Student | Junior Software Developer | Eduvos Tutor',
  location: 'Cape Town, South Africa / GMT+2',
  headline: 'I build practical software systems and help students understand them.',
  summary:
    'I am completing a BSc in Information Technology, specializing in Software Engineering, with hands-on work across React, Next.js, TypeScript, Python, PHP/MySQL, Supabase, AWS, AI data evaluation, current Eduvos tutoring, and Nature\'s Valley community IT support.',
  availability: 'Open to junior software engineering, frontend, and full-stack roles',
  links: {
    email: 'mailto:nehohwajoshua@gmail.com',
    github: 'https://github.com/jnehohwa',
    linkedin: 'https://www.linkedin.com/in/joshua-nehohwa-b4b97b229/',
    cv: '/Joshua_Nehohwa_CV.pdf',
  },
}

export const navItems = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
]

export const metrics = [
  { label: 'Academic average', value: '86%' },
  { label: 'Current tutoring', value: 'ITMTA1-B22' },
  { label: 'Community support', value: 'KuCoNa + youth ambassadors' },
  { label: 'Leadership', value: 'Vossie DevClub Chair' },
  { label: 'GitHub', value: '9 public repos' },
]

export const focusAreas = [
  {
    title: 'Full-stack product building',
    description:
      'Building product screens and workflows with React, Next.js, TypeScript, PHP/MySQL, Supabase, and Clerk Auth.',
  },
  {
    title: 'AI and data quality',
    description:
      'Remote AI data annotation experience with complex guidelines, model response evaluation, and structured data handling.',
  },
  {
    title: 'Teaching and community support',
    description:
      'Currently leading Eduvos ITMTA1-B22 tutorial sessions and supporting Nature\'s Valley work involving KuCoNa IT setup and youth-ambassador coordination.',
  },
  {
    title: 'Cloud and security foundations',
    description:
      'Academic and project interest in AWS, network security, AI safety, applied cryptography, and secure intelligent systems.',
  },
]

export const projects: Project[] = [
  {
    title: 'KasiSwap Marketplace',
    type: 'PHP/MySQL C2C marketplace',
    role: 'Solo developer and evidence owner',
    timeline: '2026',
    summary:
      'A township-focused customer-to-customer marketplace with buyer, seller, and admin workflows built for a PHP/MySQL academic deliverable.',
    impact:
      'Shows full-stack delivery from problem framing and database design through role-based workflows, secure forms, deployment evidence, screenshots, and final submission documentation.',
    highlights: [
      'Live InfinityFree PHP/MySQL deployment with a seeded demo database and public GitHub source.',
      'Buyer flow covers listings, listing detail, protected checkout, order states, disputes, messages, and reviews.',
      'Admin flow covers users, seller verification, listings, disputes, and audit logs with RBAC protection.',
    ],
    stack: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Docker'],
    links: {
      caseStudy: '/case-studies/kasiswap-marketplace',
      live: 'https://kasiswap.free.nf/',
      source: 'https://github.com/jnehohwa/kasiswap-php-mysql-deliverable-2',
    },
  },
  {
    title: 'HackJam Innovation Platform',
    type: 'Campus innovation platform',
    role: 'Team leader and frontend contributor',
    timeline: '2025',
    summary:
      'A university HackJam prototype for idea submission, voting, mentor feedback, and gamified participation across campus.',
    impact:
      'Placed 4th in a university-wide HackJam while demonstrating leadership, user research, prototyping, product thinking, and a polished final pitch.',
    highlights: [
      'Led the team through scope decisions, user research, prototype direction, and final pitch preparation.',
      'Built React/Next.js interface concepts for idea submission, voting, feedback, badges, and mentor picks.',
      'Planned future AI scoring and feedback as an extension rather than forcing it into the core prototype too early.',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'UI Libraries'],
    links: {
      caseStudy: '/case-studies/hackjam-innovation-platform',
    },
  },
  {
    title: 'Innosimm ERP System',
    type: 'Business workflow system',
    role: 'Full-stack developer',
    timeline: '2025 - Ongoing',
    summary:
      'A custom ERP system for a vehicle and tyre business, designed around inventory, sales, purchasing, quotations, invoices, and finance tracking.',
    impact:
      'Turns manual spreadsheet and WhatsApp-based operations into authenticated, structured workflows with clearer data ownership and room for reporting.',
    highlights: [
      'Models real business objects such as stock movement, sales, quotations, invoices, and purchasing.',
      'Uses a modular Next.js architecture with Supabase persistence and Clerk authentication.',
      'Keeps the scope practical by prioritizing operational workflows before dashboards and automation.',
    ],
    stack: ['Next.js', 'Supabase', 'Clerk Auth', 'PostgreSQL', 'TypeScript'],
    links: {
      caseStudy: '/case-studies/innosimm-erp-system',
    },
  },
  {
    title: 'LedgerLite Expense Tracker',
    type: 'Desktop finance app',
    role: 'Python desktop app developer',
    timeline: '2025',
    summary:
      'A macOS desktop expense tracker with transaction CRUD, filtering, dashboards, charts, SQLite persistence, and clean application structure.',
    impact:
      'Demonstrates practical Python application architecture, local data modeling, UI design, and personal finance workflows outside the web stack.',
    highlights: [
      'Implemented local persistence with SQLite and SQLAlchemy instead of storing data only in memory.',
      'Built dashboard and chart views so transaction data becomes easier to scan and act on.',
      'Separated UI, data, and workflow concerns to keep the app maintainable as features grow.',
    ],
    stack: ['Python', 'PySide6', 'SQLite', 'SQLAlchemy', 'pandas', 'matplotlib'],
    links: {
      caseStudy: '/case-studies/ledgerlite-expense-tracker',
      source: 'https://github.com/jnehohwa/HexSoftware-Expense-Tracker',
    },
  },
]

export const caseStudies: CaseStudy[] = [
  {
    slug: 'kasiswap-marketplace',
    title: 'KasiSwap Marketplace',
    type: 'PHP/MySQL C2C marketplace',
    role: 'Solo developer and evidence owner',
    timeline: '2026',
    status: 'Live academic deliverable',
    summary:
      'KasiSwap is a customer-to-customer e-commerce prototype for South African township and informal-economy users. The build focuses on trust, low-data access, and complete buyer, seller, and admin workflows.',
    stack: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Docker', 'InfinityFree'],
    metrics: [
      { label: 'Evidence coverage', value: '18 screenshots' },
      { label: 'Core surfaces', value: 'Buyer, seller, admin' },
      { label: 'Security practices', value: 'RBAC, CSRF, hashing' },
      { label: 'Deployment', value: 'Live PHP/MySQL host' },
    ],
    links: [
      { label: 'Live site', href: 'https://kasiswap.free.nf/', external: true },
      {
        label: 'Source',
        href: 'https://github.com/jnehohwa/kasiswap-php-mysql-deliverable-2',
        external: true,
      },
      {
        label: 'CV',
        href: '/Joshua_Nehohwa_CV.pdf',
      },
    ],
    heroImage: {
      src: '/case-studies/kasiswap/main-marketplace-desktop.png',
      alt: 'KasiSwap marketplace desktop screenshot',
      caption: 'Marketplace desktop evidence from the Deliverable 2 screenshot set.',
    },
    gallery: [
      {
        src: '/case-studies/kasiswap/main-checkout-desktop.png',
        alt: 'KasiSwap protected checkout screenshot',
        caption: 'Protected order flow with sandbox payment-state handling.',
      },
      {
        src: '/case-studies/kasiswap/admin-dashboard-desktop.png',
        alt: 'KasiSwap admin dashboard screenshot',
        caption: 'Admin dashboard for moderation and operational review.',
      },
      {
        src: '/case-studies/kasiswap/main-website-evidence-sheet.png',
        alt: 'KasiSwap main website evidence sheet',
        caption: 'Generated submission evidence sheet covering the public marketplace screens.',
      },
      {
        src: '/case-studies/kasiswap/admin-website-evidence-sheet.png',
        alt: 'KasiSwap admin website evidence sheet',
        caption: 'Generated submission evidence sheet covering admin verification and moderation screens.',
      },
      {
        src: '/case-studies/kasiswap/eerd.png',
        alt: 'KasiSwap enhanced entity relationship diagram',
        caption: 'Database design evidence from the generated submission pack.',
      },
    ],
    sections: [
      {
        title: 'Problem',
        body: [
          'The project scenario focuses on township and informal traders who need a safer way to buy and sell online without relying only on screenshots, manual EFT proof, or off-platform chat.',
          'The implementation had to stay practical for mobile and data-sensitive users while still proving the database, admin, and security requirements expected in the academic rubric.',
        ],
      },
      {
        title: 'What I Built',
        body: [
          'I built the PHP/MySQL submission implementation around three user areas: the public marketplace, the seller workflow, and the admin website.',
          'The main flow includes searchable listings, listing detail, in-app messages, protected order states, sandbox payment confirmation, delivery, dispute handling, reviews, seller verification, and audit logging.',
        ],
        bullets: [
          'Buyer workflow: browse, inspect listing detail, create order, confirm payment, track order, dispute, and review.',
          'Seller workflow: maintain listings and mark shipped only after payment is confirmed in the platform state.',
          'Admin workflow: manage users, verification requests, listings, disputes, and audit trails.',
        ],
      },
      {
        title: 'Architecture and Security',
        body: [
          'The app uses PHP-rendered pages, MySQL tables with foreign keys, small JavaScript enhancements, and responsive CSS. Docker support keeps the local assessment environment repeatable.',
          'The security evidence includes prepared statements, password hashing verification, session regeneration, escaped output, CSRF-protected POST forms, role-based admin access, and guarded order-state transitions.',
        ],
      },
      {
        title: 'Recruiter Takeaway',
        body: [
          'This is the strongest portfolio proof of end-to-end delivery because it connects product reasoning, database design, secure workflow implementation, deployment, testing notes, diagrams, screenshots, and a final evidence pack.',
        ],
      },
    ],
  },
  {
    slug: 'hackjam-innovation-platform',
    title: 'HackJam Innovation Platform',
    type: 'Campus innovation platform',
    role: 'Team leader and frontend contributor',
    timeline: '2025',
    status: 'Competition prototype',
    summary:
      'A HackJam project for campus-wide idea submission, voting, mentor feedback, and gamified participation. The project placed 4th in a university-wide competition.',
    stack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Component Libraries'],
    metrics: [
      { label: 'Result', value: '4th place' },
      { label: 'Role', value: 'Team lead' },
      { label: 'Focus', value: 'Ideas and feedback' },
      { label: 'Year', value: '2025' },
    ],
    links: [{ label: 'CV', href: '/Joshua_Nehohwa_CV.pdf' }],
    sections: [
      {
        title: 'Problem',
        body: [
          'The campus needed a lightweight way for students to submit ideas, gather interest, and receive useful mentor feedback before a concept disappears after a pitch session.',
          'The product challenge was to make participation feel structured without turning the prototype into a heavy enterprise system.',
        ],
      },
      {
        title: 'What I Built and Led',
        body: [
          'I led the team through product direction, user research, prototyping, scope tradeoffs, and final pitching. On the implementation side, I contributed to the frontend concepts with React, Next.js, TypeScript, Tailwind CSS, and component libraries.',
        ],
        bullets: [
          'Idea submission and voting flow for student participation.',
          'Mentor feedback concepts to help ideas improve after submission.',
          'Gamification concepts such as points, badges, and mentor picks.',
          'Future AI scoring placeholders kept separate from the core workflow.',
        ],
      },
      {
        title: 'Tradeoffs',
        body: [
          'The main tradeoff was speed versus depth. For a competition prototype, I prioritized clear user journeys, a pitchable interface, and credible extension points over building every backend workflow completely.',
        ],
      },
      {
        title: 'Recruiter Takeaway',
        body: [
          'This case study shows leadership under time pressure, product judgment, communication, and the ability to keep a team focused on a demo that judges and users can understand quickly.',
        ],
      },
    ],
  },
  {
    slug: 'innosimm-erp-system',
    title: 'Innosimm ERP System',
    type: 'Business workflow system',
    role: 'Full-stack developer',
    timeline: '2025 - Ongoing',
    status: 'Ongoing private build',
    summary:
      'A custom ERP system for a vehicle and tyre business, designed to replace manual spreadsheet and WhatsApp-based processes with authenticated operational workflows.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Clerk Auth'],
    metrics: [
      { label: 'Domain', value: 'Vehicle and tyre operations' },
      { label: 'Workflow areas', value: 'Inventory, sales, purchasing' },
      { label: 'Auth', value: 'Clerk' },
      { label: 'Data layer', value: 'Supabase' },
    ],
    links: [{ label: 'CV', href: '/Joshua_Nehohwa_CV.pdf' }],
    sections: [
      {
        title: 'Problem',
        body: [
          'The business workflow spans inventory, sales, purchasing, quotations, invoices, and basic finance tracking. Keeping that information in scattered spreadsheets and WhatsApp messages makes status, ownership, and reporting difficult.',
        ],
      },
      {
        title: 'System Direction',
        body: [
          'I am designing the system around real operational objects rather than generic dashboard widgets. The priority is to model how stock moves, how quotations become invoices, and how user actions should be authenticated and persisted.',
        ],
        bullets: [
          'Inventory records for vehicle and tyre stock.',
          'Sales, purchasing, quotations, and invoices as first-class workflows.',
          'Supabase/PostgreSQL persistence for structured data.',
          'Clerk authentication to separate users and protect business actions.',
        ],
      },
      {
        title: 'Architecture Thinking',
        body: [
          'The implementation direction is modular Next.js with typed feature areas, shared data access patterns, and practical boundaries between UI, auth, and persistence.',
          'Because the project is ongoing, the case study is intentionally honest about status: workflow correctness comes before adding automation or analytics.',
        ],
      },
      {
        title: 'Recruiter Takeaway',
        body: [
          'This project shows business analysis, domain modeling, and full-stack planning in a realistic operational setting where maintainability matters more than novelty.',
        ],
      },
    ],
  },
  {
    slug: 'ledgerlite-expense-tracker',
    title: 'LedgerLite Expense Tracker',
    type: 'Desktop finance app',
    role: 'Python desktop app developer',
    timeline: '2025',
    status: 'Personal software project',
    summary:
      'A macOS desktop expense tracker that uses local persistence, CRUD workflows, filters, dashboards, and charting to make personal transactions easier to manage.',
    stack: ['Python', 'PySide6', 'SQLite', 'SQLAlchemy', 'pandas', 'matplotlib'],
    metrics: [
      { label: 'Platform', value: 'macOS desktop' },
      { label: 'Persistence', value: 'SQLite' },
      { label: 'Architecture', value: 'UI plus data layer' },
      { label: 'Focus', value: 'Finance workflows' },
    ],
    links: [
      {
        label: 'Source',
        href: 'https://github.com/jnehohwa/HexSoftware-Expense-Tracker',
        external: true,
      },
    ],
    sections: [
      {
        title: 'Problem',
        body: [
          'Personal finance tools are useful only when adding and reviewing transactions stays fast. This project focuses on a local desktop workflow where data remains available without a web backend.',
        ],
      },
      {
        title: 'What I Built',
        body: [
          'The app supports transaction CRUD, filtering, dashboard-style summaries, charting, and SQLite persistence. SQLAlchemy gives the project a cleaner data model than ad hoc file storage.',
        ],
        bullets: [
          'PySide6 user interface for a native desktop feel.',
          'SQLite and SQLAlchemy for local persistence.',
          'pandas and matplotlib for analysis and chart views.',
          'Separated application concerns so new reports can be added cleanly.',
        ],
      },
      {
        title: 'Recruiter Takeaway',
        body: [
          'LedgerLite shows that I can work outside browser-based stacks, structure a practical desktop application, and use data libraries to make stored information easier to understand.',
        ],
      },
    ],
  },
]

export const skills = [
  {
    group: 'Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Visual Basic', 'PHP'],
  },
  {
    group: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Responsive UI', 'Figma', 'Justinmind'],
  },
  {
    group: 'Backend and data',
    items: ['Node.js', 'PHP/MySQL', 'PostgreSQL', 'Supabase', 'Clerk Auth', 'REST APIs'],
  },
  {
    group: 'Cloud and workflow',
    items: ['AWS EC2', 'AWS S3', 'AWS IAM', 'AWS Lambda', 'Git', 'Linux', 'Docker basics'],
  },
  {
    group: 'Teaching and leadership',
    items: [
      'Tutorial facilitation',
      'Exam support',
      'Student mentoring',
      'Youth ambassador coordination',
      'Community IT support',
      'Technical workshops',
      'Campus leadership',
    ],
  },
]

export const timeline: TimelineItem[] = [
  {
    date: 'June 2026',
    title: 'Nature\'s Valley Trust community IT support',
    description:
      'Supporting Gavin on KuCoNa IT installation and coordinating a planned meeting with 10 youth ambassadors by connecting with Andrew.',
  },
  {
    date: 'May 2026 - Present',
    title: 'ITMTA1-B22 Tutor, Eduvos',
    description:
      'Lead weekly two-hour Teams tutorial sessions for ITMTA1-B22 students, including the June 19, 2026 scheduled session and live support for exam-related questions.',
  },
  {
    date: '2025 - Present',
    title: 'Chairperson, Vossie DevClub',
    description:
      'Lead technical workshops, school outreach, student developer programs, hackathons, mentorship initiatives, and campus innovation events.',
  },
  {
    date: '2023 - 2026',
    title: 'BSc Information Technology, Software Engineering',
    description:
      'Studying at Eduvos University, Mowbray Campus, with an 86% academic average and modules including software architecture, mobile development, cloud technologies, network security, data structures, and AI ethics.',
  },
  {
    date: '2024',
    title: 'Freelance AI Data Specialist',
    description:
      'Worked remotely on AI data annotation for Google and Microsoft contract work, transforming raw HTML/text data into high-quality annotations and evaluating model responses against detailed guidelines.',
  },
  {
    date: '2025',
    title: 'Golden Key and AWS credentials',
    description:
      'Recognized in the top 15% of the university cohort through Golden Key International Honour Society, with AWS Cloud Practitioner and AWS Solutions Architect Associate listed on the CV.',
  },
]
