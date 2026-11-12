// Everything the site says lives here: one place to update copy, prices and links.
// Keep the company details identical to the GST registration and the Meta business
// portfolio, which check this site against what they were given.

export const SITE = {
  name: "Anvionix Labs",
  url: "https://anvionixlabs.com",
  tagline: "Software, built like an experiment and shipped like a product.",
  description:
    "Anvionix Labs designs and builds web apps, mobile apps and backends for startups and brands, and helps teams fix the systems they already have. Founder-led, from Delhi NCR, working worldwide.",
  calendly: "https://calendly.com/anvionixlabs/intro",
  email: "hello@anvionixlabs.com",
  phone: "+91 88029 24304",
  phoneHref: "tel:+918802924304",
  legalName: "Anvionix Labs",
  gstin: "09GRRPS7325N2ZJ",
  address: {
    street: "Flat A-5, 1st Floor, Plot No. 230, Niti Khand I, Indirapuram",
    locality: "Ghaziabad",
    region: "Uttar Pradesh",
    postalCode: "201014",
    country: "IN",
    lines: ["Flat A-5, 1st Floor, Plot No. 230", "Niti Khand I, Indirapuram", "Ghaziabad, Uttar Pradesh 201014", "India"],
  },
  social: {
    linkedin: "https://www.linkedin.com/in/anuj9196/",
    github: "https://github.com/anuj9196",
  },
  brands: [{ name: "Satyakod", url: "https://satyakod.com" }],
} as const;

/** Facts that are true by construction: nothing here needs a source. */
export const FACTS = [
  { value: "5", label: "products live today" },
  { value: "4", label: "platforms: web, Android, iOS, cloud" },
  { value: "2016", label: "writing production software since" },
  { value: "1", label: "team from idea to on-call" },
] as const;

export type Experiment = {
  slug: string;
  no: string;
  name: string;
  kind: string;
  url?: string;
  urlLabel?: string;
  client?: string;
  image: string;
  imageAlt: string;
  summary: string;
  problem: string;
  hypothesis: string;
  build: string[];
  stack: string[];
  results: { label: string; value: string }[];
  /** Long-form report sections for /work/[slug]. */
  report: { h: string; p: string[] }[];
  services: ServiceSlug[];
};

export const EXPERIMENTS: Experiment[] = [
  {
    slug: "satyakod",
    no: "001",
    name: "Satyakod",
    kind: "Anti-counterfeiting SaaS",
    url: "https://satyakod.com",
    urlLabel: "satyakod.com",
    image: "/work/satyakod.jpg",
    imageAlt: "The Satyakod website: a printed code scanned and verified as genuine",
    summary:
      "Brand protection for manufacturers: a signed code on every unit, a verdict on every scan, counterfeits flagged the moment they surface.",
    problem:
      "A counterfeit pack can look identical to the real one, and an ordinary QR code is copied as easily as the box it is printed on. Brands find out about fakes from angry customers, months late.",
    hypothesis:
      "If every unit carries its own cryptographically signed code, and every scan is checked against where and how often that code has been seen, a copy gives itself away the first time it is scanned twice.",
    build: [
      "Signing service that issues a unique code per unit, printed as QR, DataMatrix or GS1 Digital Link",
      "Verification in the browser: a customer scans with the phone camera, no app to install",
      "Clone and grey-market detection from scan patterns, with alerts to the brand",
      "Brand dashboard for batches, print runs, scans and investigations",
      "WhatsApp assistant that verifies a code or a photo of it in chat",
    ],
    stack: ["Django", "PostgreSQL", "Celery", "Redis", "Next.js", "Expo", "GS1 Digital Link", "WhatsApp Cloud API"],
    results: [
      { label: "Status", value: "Live" },
      { label: "Verdict languages", value: "8" },
      { label: "Time to a verdict", value: "< 1 s" },
      { label: "Channels", value: "Web · WhatsApp · Mobile" },
    ],
    report: [
      {
        h: "Why codes, and why signed",
        p: [
          "Holograms and tamper seals can be reproduced by anyone with a good printer. A plain QR code is worse: it is just a link, and a counterfeiter can copy it along with the pack. Satyakod treats the code itself as the security feature. Each unit gets its own serial, signed with the brand's key, so a code cannot be made up, and each scan is recorded, so a code that is copied shows up as one serial in two places.",
        ],
      },
      {
        h: "Verification without an app",
        p: [
          "Asking a shopper to install an app before checking a product loses most of them. The scanner runs in the phone's browser, reads the code from the camera, and answers in the shopper's language: genuine, already verified before, or not genuine. The same check works by sending the code or a photo of it on WhatsApp.",
        ],
      },
      {
        h: "What the brand sees",
        p: [
          "Every scan lands on the brand's dashboard with its place and time. Patterns that point to a clone (the same serial scanned in two cities, or far more often than a genuine unit would be) raise an alert, so the brand hears about counterfeits from its own data rather than from complaints.",
        ],
      },
      {
        h: "How it was built",
        p: [
          "A Django and PostgreSQL backend issues and verifies codes, with Celery workers for print runs, alerts and messaging. The brand dashboard and the consumer scanner are Next.js apps sharing one typed API contract; the mobile app is Expo. Everything, from code signing to deployment, monitoring and support tooling, was designed and run by one team.",
        ],
      },
    ],
    services: ["web-apps", "backend-apis", "mobile-apps"],
  },
  {
    slug: "elektron-battery-tester",
    no: "002",
    name: "Elektron Battery Tester",
    kind: "Hardware companion app",
    client: "Elektron India",
    url: "https://play.google.com/store/apps/details?id=in.elektronindia.app.blt",
    urlLabel: "Google Play",
    image: "/work/elektron.jpg",
    imageAlt: "Elektron BLT on Google Play: battery load test app screens",
    summary:
      "A Flutter app that drives a battery load tester over Bluetooth and turns each test into a finished report on site.",
    problem:
      "Technicians load-testing telecom and UPS battery banks read values off the tester, wrote them down, and built the report later. It was slow, and every hand-copied number was a chance for an error in a report someone would rely on.",
    hypothesis:
      "If the phone talks to the tester directly, the test, the data and the report can happen in one place, and the technician leaves the site with the report already sent.",
    build: [
      "Bluetooth link to the tester that reconnects on its own if the technician walks out of range",
      "Live voltage and current chart while the test runs",
      "Battery registration by scanning its barcode or QR code",
      "PDF and CSV reports with stage-by-stage readings and photos from the test",
      "Sharing by email or chat, and printing straight from the app",
    ],
    stack: ["Flutter", "Dart", "Bluetooth LE", "PDF", "Android", "iOS"],
    results: [
      { label: "Google Play rating", value: "5.0 ★" },
      { label: "Verified reviews", value: "22" },
      { label: "From test to report", value: "On site" },
      { label: "Client", value: "Elektron India" },
    ],
    report: [
      {
        h: "The job in the field",
        p: [
          "A load test discharges a battery bank under a controlled current and records how its voltage falls over time. The readings decide whether a site's backup power can be trusted, so the report matters as much as the test.",
        ],
      },
      {
        h: "What the app does",
        p: [
          "The app pairs with Elektron India's tester over Bluetooth, starts and follows the test, and charts voltage and current live. The technician registers the battery by scanning its code, adds photos, and the app produces a PDF and CSV report the moment the test ends, ready to share or print.",
        ],
      },
      {
        h: "Built to survive a battery room",
        p: [
          "Battery rooms are noisy for radios and technicians move around. The connection reconnects by itself and the test data is kept on the phone, so walking out of range does not lose a test.",
        ],
      },
    ],
    services: ["mobile-apps"],
  },
  {
    slug: "feedal",
    no: "003",
    name: "Feedal",
    kind: "AI form builder",
    url: "https://feedal.io",
    urlLabel: "feedal.io",
    image: "/work/feedal.jpg",
    imageAlt: "The Feedal website: build forms and analyse responses with AI",
    summary: "Forms for feedback, surveys and contact, with AI that reads the responses so a team does not have to.",
    problem:
      "Collecting responses is easy. Reading hundreds of them and deciding what to do is where feedback dies: the spreadsheet grows and nobody opens it.",
    hypothesis:
      "If the tool that collects the responses also reads them, summarising themes, sentiment and outliers, feedback turns into decisions instead of a backlog.",
    build: [
      "Drag-and-drop form builder with an embeddable script for any website",
      "Response analysis with AI: themes, sentiment and summaries per form",
      "AI chat over a form's responses, answered live",
      "Responses sent on to CRMs and tools like Slack, HubSpot and WhatsApp",
      "Plans, trials and upgrades built into the product",
    ],
    stack: ["Django", "Celery", "OpenAI", "WebSockets", "Next.js", "React", "PostgreSQL"],
    results: [
      { label: "Status", value: "Live" },
      { label: "Free plan", value: "Yes" },
      { label: "Embeds on", value: "Any website" },
      { label: "Analysis", value: "AI, per form" },
    ],
    report: [
      {
        h: "From forms to findings",
        p: [
          "Feedal is a form builder first: build a form, share it or embed it, collect responses. The difference is what happens next. Each form's responses are analysed with AI into themes and sentiment, and a team can ask questions of its responses in a chat instead of exporting them.",
        ],
      },
      {
        h: "How it was built",
        p: [
          "A Django backend with Celery workers handles collection and analysis, calling OpenAI's models and streaming chat answers over WebSockets. The builder and dashboard are a Next.js app; a small script embeds forms on any site.",
        ],
      },
    ],
    services: ["web-apps", "backend-apis"],
  },
  {
    slug: "tapbeep",
    no: "004",
    name: "TapBeep",
    kind: "Online assessment platform",
    url: "https://tapbeep.com",
    urlLabel: "tapbeep.com",
    image: "/work/tapbeep.jpg",
    imageAlt: "The TapBeep website: secure online assessments",
    summary: "Secure online assessments: schedule sessions, follow candidates' progress live, and manage results in one place.",
    problem:
      "Running assessments online means juggling scheduling, invigilation and results across tools that were not built for exams, and trusting that what happened in the session is what the result says.",
    hypothesis:
      "One platform that owns the whole session, from scheduling to live monitoring to results, makes online assessment both simpler to run and easier to trust.",
    build: [
      "Assessment builder with customisable formats",
      "Session scheduling for candidates and groups",
      "Real-time progress monitoring during a session",
      "Results and reporting for organisers",
    ],
    stack: ["Django", "PostgreSQL", "Next.js", "React"],
    results: [
      { label: "Status", value: "Live" },
      { label: "Monitoring", value: "Real time" },
      { label: "Scheduling", value: "Built in" },
      { label: "Focus", value: "Secure assessment" },
    ],
    report: [
      {
        h: "One place for the whole session",
        p: [
          "TapBeep covers an assessment from start to finish: build it, schedule who takes it and when, watch progress while it runs, and review results after. Keeping all of it in one system is what makes the result defensible.",
        ],
      },
    ],
    services: ["web-apps", "backend-apis"],
  },
  {
    slug: "tapxreality",
    no: "005",
    name: "TapXReality",
    kind: "Augmented reality platform",
    url: "https://tapxreality.com",
    urlLabel: "tapxreality.com",
    image: "/work/tapxreality.jpg",
    imageAlt: "The TapXReality website: create augmented reality experiences",
    summary: "Create and share augmented reality with 3D models, images and video: image-based, marker-based or location-based.",
    problem:
      "Augmented reality campaigns usually mean a custom app and an agency. Most brands and creators want the effect without building software.",
    hypothesis:
      "If AR is something you upload and publish, like a web page, anyone can put a 3D model, image or video into the real world and share it with a link or a code.",
    build: [
      "Upload 3D models, images and videos as AR content",
      "Image-based, marker-based and location-based AR experiences",
      "Shareable links and QR codes that open the experience",
    ],
    stack: ["Next.js", "React", "PostgreSQL", "AWS"],
    results: [
      { label: "Status", value: "Live" },
      { label: "AR modes", value: "3" },
      { label: "Content", value: "3D · image · video" },
      { label: "App needed", value: "None" },
    ],
    report: [
      {
        h: "AR as a publishing problem",
        p: [
          "TapXReality treats augmented reality like publishing: upload the content, choose how it is triggered (an image, a marker or a place), and share the link or code. Viewers open it in the browser.",
        ],
      },
    ],
    services: ["web-apps"],
  },
];

export type ServiceSlug = "web-apps" | "backend-apis" | "mobile-apps" | "consulting";

export type Service = {
  slug: ServiceSlug;
  no: string;
  name: string;
  title: string;
  short: string;
  intro: string;
  includes: string[];
  stack: string[];
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "web-apps",
    no: "01",
    name: "Web apps",
    title: "Web app development: SaaS, dashboards and portals",
    short: "SaaS products, dashboards and customer portals in Next.js and React, fast on any device and easy to change.",
    intro:
      "We build web products that people use every day: SaaS platforms, internal dashboards, customer portals and the marketing sites around them. Next.js and React on the front, a real backend behind, and the same team from the first sketch to the release.",
    includes: [
      "Product and UX design with clickable prototypes",
      "Next.js and React apps, server-rendered for speed and SEO",
      "Authentication, roles, billing and payments",
      "Dashboards, reporting and data visualisation",
      "Multi-language interfaces",
      "Hosting, monitoring and analytics set up for you",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Cloudflare"],
    faq: [
      {
        q: "Do you build from a design or design it too?",
        a: "Either. We can work from your designs or design the product with you, starting from clickable prototypes before any code.",
      },
      {
        q: "Will we own the code?",
        a: "Yes. The code is in your repository from the first day, and you own it outright. No lock-in to us.",
      },
      {
        q: "Can you take over an existing web app?",
        a: "Yes. We start with a short audit so we know what we are taking on, then fix the risky parts before adding features.",
      },
    ],
  },
  {
    slug: "backend-apis",
    no: "02",
    name: "Backend & APIs",
    title: "Backend and API development: Django, Python and cloud",
    short: "Django and Python backends, APIs, integrations and payments, built to stay up and easy to extend.",
    intro:
      "The part of the product nobody sees and everybody relies on. We design and build backends and APIs in Django and Python: data models that hold up, integrations with the services you use, background jobs, and deployment that does not need a person awake at 3 a.m.",
    includes: [
      "REST APIs and typed API contracts",
      "Django and Python backends with PostgreSQL",
      "Integrations: payments, WhatsApp, email, ERP and third-party APIs",
      "Background jobs, queues and scheduled work",
      "AI features: search, summaries, assistants and automation",
      "Cloud deployment, CI/CD, backups and monitoring",
    ],
    stack: ["Python", "Django", "PostgreSQL", "Celery", "Redis", "Docker", "AWS"],
    faq: [
      {
        q: "Which cloud do you deploy to?",
        a: "Whichever fits the product and budget: AWS, Google Cloud, DigitalOcean or a single well-run server. We set up deploys, backups and monitoring either way.",
      },
      {
        q: "Can you add AI to our existing product?",
        a: "Yes, where it earns its place: summarising, classifying, searching or answering over your own data, with costs and failure cases worked out up front.",
      },
    ],
  },
  {
    slug: "mobile-apps",
    no: "03",
    name: "Mobile apps",
    title: "Mobile app development: iOS and Android",
    short: "iOS and Android apps in React Native or Flutter, including apps that talk to hardware over Bluetooth.",
    intro:
      "One codebase, both stores. We build mobile apps in React Native (Expo) or Flutter, from consumer apps to field tools that connect to hardware, and take care of the store listings, releases and updates.",
    includes: [
      "iOS and Android apps from one codebase",
      "Bluetooth and hardware integration",
      "Camera, barcode and QR scanning",
      "Offline-first data and sync",
      "Push notifications",
      "App Store and Google Play releases",
    ],
    stack: ["React Native", "Expo", "Flutter", "Dart", "TypeScript", "Firebase"],
    faq: [
      {
        q: "React Native or Flutter?",
        a: "Both work well. If your team or web app is in React, React Native shares the most. Flutter is a strong choice for hardware-heavy or design-heavy apps. We recommend one after the intro call.",
      },
      {
        q: "Do you publish to the stores?",
        a: "Yes. We prepare the listings, handle review and set up releases, under your developer accounts so the apps stay yours.",
      },
    ],
  },
  {
    slug: "consulting",
    no: "04",
    name: "Consulting & audits",
    title: "Technical consulting, code audits and fractional CTO",
    short: "Architecture and code audits, security reviews and a fractional CTO for teams that need senior judgement.",
    intro:
      "Sometimes what a team needs is not more code but a clear view: what is risky, what to fix first, what to build next and who to hire. We audit systems, review architecture and security, and act as a fractional CTO for startups that are not ready for a full-time one.",
    includes: [
      "Architecture, code and performance audits with a written report",
      "Security review of applications and cloud setup",
      "Technical due diligence before fundraising or acquisition",
      "Fractional CTO: roadmap, hiring and vendor decisions",
      "Rescue plans for stalled or failing projects",
      "Cloud cost review",
    ],
    stack: ["Architecture", "Security", "AWS", "CI/CD", "Hiring"],
    faq: [
      {
        q: "What do we get from an audit?",
        a: "A written report ranked by risk, with what to fix, why and roughly how long it takes, and a call to walk through it. The fee counts towards a build if you go ahead with us.",
      },
      {
        q: "How much time does a fractional CTO take?",
        a: "Usually about four hours a week: a planning session, reviews and being on hand for decisions. It scales up around launches or hiring.",
      },
    ],
  },
];

export type Engagement = {
  id: string;
  name: string;
  line: string;
  inr: string;
  usd: string;
  per?: string;
  scope: string[];
  timeline: string;
};

/** "From" prices, set against 2025–26 market rates for senior boutique teams. */
export const ENGAGEMENTS: Engagement[] = [
  {
    id: "audit",
    name: "Audit",
    line: "Find out what you have",
    inr: "₹1,50,000",
    usd: "$4,000",
    scope: ["Architecture, code and security review", "Written report ranked by risk", "Walk-through call", "Fee credited to a build"],
    timeline: "1–2 weeks",
  },
  {
    id: "mvp",
    name: "MVP build",
    line: "From idea to launched product",
    inr: "₹8,00,000",
    usd: "$18,000",
    scope: ["Discovery and prototype", "Web or mobile app with backend", "Weekly demos", "Launch and two weeks of support"],
    timeline: "6–10 weeks",
  },
  {
    id: "retainer",
    name: "Product retainer",
    line: "A team on call for your product",
    inr: "₹2,50,000",
    usd: "$6,000",
    per: "month",
    scope: ["About 80 hours a month", "Features, fixes and upkeep", "Monitoring and on-call", "Monthly plan and report"],
    timeline: "Monthly, cancel any time",
  },
  {
    id: "cto",
    name: "Fractional CTO",
    line: "Senior judgement, part time",
    inr: "₹1,25,000",
    usd: "$3,500",
    per: "month",
    scope: ["About 4 hours a week", "Roadmap and architecture", "Hiring and vendor decisions", "Reviews and on-hand advice"],
    timeline: "Monthly, cancel any time",
  },
];

export const PROCESS = [
  { no: "01", name: "Observe", text: "An intro call and a short discovery: what you need, who it is for, what already exists and what success looks like." },
  { no: "02", name: "Hypothesise", text: "A written plan with scope, approach, timeline and price, and a clickable prototype before anything is built." },
  { no: "03", name: "Build", text: "Short cycles with a working demo every week. You see the product grow and can steer it as it does." },
  { no: "04", name: "Measure", text: "Launch with analytics, error monitoring and alerts in place, so we know how it behaves with real users." },
  { no: "05", name: "Hand over", text: "Code, infrastructure and documentation in your accounts. Stay with us on a retainer, or take it in-house." },
] as const;

export const PROMISES = [
  { h: "A demo every week", p: "You see working software every week, not a status report." },
  { h: "You own everything", p: "Code, accounts and infrastructure are yours from day one." },
  { h: "Fixed scope, fixed price", p: "Builds are quoted up front. Changes are agreed before they cost anything." },
  { h: "Senior hands only", p: "The person you talk to is the person who builds it." },
] as const;

export const FOUNDER = {
  name: "Anuj Sharma",
  role: "Founder, Anvionix Labs",
  photo: "/logos/avatar.jpeg",
  intro:
    "Anuj has been writing production software since 2016: backends in Django, front ends in Angular, React and Next.js, mobile apps in Flutter and React Native, and the cloud infrastructure they run on.",
  story: [
    "For most of that time he has led engineering on a global SaaS platform, taking it from a single server to a containerised, security-first architecture on AWS, upgrading it across a decade of framework versions, and building the CI/CD behind zero-downtime deployments.",
    "Alongside that he built and runs his own products, Satyakod, Feedal, TapBeep and TapXReality, and builds for clients, including the Elektron Battery Tester. Anvionix Labs is where all of it comes together: the same care for clients' products as for his own.",
  ],
  previously: [{ name: "Scanova", role: "Senior Team Lead, Engineering: led engineering of the QR code platform", url: "https://scanova.io" }],
  awards: ["Engineering Leadership Award, 2025", "Star Leader, 2021"],
  skills: [
    "Python", "Django", "TypeScript", "Next.js", "React", "Angular", "Flutter", "React Native", "PostgreSQL", "AWS", "Docker", "CI/CD", "AI integration", "Application security",
  ],
} as const;

export const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/engage", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const experimentBySlug = (slug: string) => EXPERIMENTS.find((e) => e.slug === slug);
