/*
  Everything on the site comes from this file. Edit text here; you should not
  need to touch the HTML or app.js to add a project, swap a photo or add the video.

  Images go in public/images/ (projects in public/images/projects/).
  Reference them with a leading slash, e.g. "/images/projects/plan-b.jpg".
*/
window.SITE = {
  name: 'Jaiden Lau',
  role: 'AI systems engineer · Co-founder, Autoploy',
  location: 'Hong Kong & Tokyo',

  links: {
    email: 'jaiden@autoploy.us',
    linkedin: 'https://www.linkedin.com/in/jaidenlau/',
    github: 'https://github.com/Jaidenlau',
    company: 'https://autoploy.us/',
    // Optional: drop a PDF in public/ and set e.g. '/jaiden-lau-cv.pdf'
    resume: '',
  },

  // ---- Projects & Work page ------------------------------------------------
  // Only paid client work goes in `projects`. Side projects stay off this site.
  hero: {
    line: '17 · Hong Kong · Co-founder of Autoploy',
    lede:
      'I co-founded Autoploy in 2025 and I’ve been building AI systems for clients ever since. This is where I keep that work. Only projects someone paid me to build go here, and I’ll keep adding to it for as long as I’m doing this.',
    // Shown next to the "Selected work" heading.
    paidNote: 'Paid client work only',
  },

  introVideo: {
    // Option A: put the file in public/media/ and set src to '/media/intro.mp4'
    src: '',
    poster: '', // optional still frame, e.g. '/media/intro-poster.jpg'
    // Option B: an unlisted YouTube video id (the part after watch?v=)
    youtube: '',
    // '16 / 9' for landscape, '9 / 16' if you film vertically on a phone
    aspect: '16 / 9',
  },

  categories: [
    { id: 'ai', label: 'AI systems' },
    { id: 'platform', label: 'Enterprise platforms' },
    { id: 'teaching', label: 'Teaching' },
  ],

  /*
    Project fields
      id        short, unique, used in the URL (#plan-b)
      featured  true = shown large in "Selected work"
      category  one of the category ids above
      client    who it was for. Keep it generic unless you have permission to name them.
      status    Live · Deployed · In delivery · Demo · Delivered · Built · Ongoing
      image     optional screenshot/photo. Without one, a diagram cover is drawn
      cover     diagram used when there's no image: agents, pipeline, workflow, web,
                chart, map, voice, brief, community, migrate, chat, calendar, house, cards
      links     [{ label, url }]
  */
  projects: [
    {
      id: 'insurer-agents',
      featured: true,
      title: 'Two AI agent platforms for a national health insurer',
      client: 'National health insurer · Ecuador',
      year: '2026',
      status: 'In delivery',
      category: 'ai',
      cover: 'agents',
      summary:
        'Two agent platforms built in parallel under one 16-week enterprise contract: a sales agent pilot and a team of marketing agents. I lead the integration layer that connects the agent runtime to the insurer’s existing systems.',
      highlights: [
        'Two platforms, one contract, one 16-week delivery schedule',
        'Integration layer between the agent runtime and the client’s own systems on Azure',
        'Built to the insurer’s code-quality, versioning and cloud standards',
        'Engineering team spread across four time zones',
      ],
      role: 'Lead engineer, integration',
      stack: ['Agent orchestration', 'System integration', 'Azure', 'Enterprise delivery'],
      links: [],
    },
    {
      id: 'bank-erp',
      featured: true,
      title: 'Procurement ERP for a commercial bank',
      client: 'Commercial bank · Bangladesh · tender demo',
      year: '2026',
      status: 'Demo',
      category: 'platform',
      cover: 'workflow',
      summary:
        'A working ERP built for a bank tender, so the bank could test the product instead of reading about it. A purchase moves from requisition through approvals, tender, bid evaluation and invoice matching to payment, with every control enforced in code and recorded in a tamper-evident audit trail.',
      highlights: [
        'Six internal roles plus an external vendor portal',
        '34 automated checks on the controls: maker-checker, three-way match, tamper detection',
        'A navigation sweep signs in as every role and opens all 92 screens',
        'A 24-step browser test runs the full demo, requisition to payment',
      ],
      role: 'Technical proposal and build',
      stack: ['Next.js', 'TypeScript', 'Prisma', 'Workflow engine', 'Audit trail'],
      links: [],
    },
    {
      id: 'plan-b',
      featured: true,
      title: 'Plan B: multi-agent lead pipeline',
      client: 'Migration consultancy · Hong Kong',
      year: '2026',
      status: 'Deployed',
      category: 'ai',
      cover: 'pipeline',
      summary:
        'A three-stage agent system (discovery, screening, nurture) that finds people in Hong Kong signalling they plan to emigrate, qualifies them, and runs personalised outreach in Traditional Chinese. It runs on the client’s own server.',
      highlights: [
        'Discovery, screening and nurture run as separate agents with handoffs between them',
        'Outreach written in Traditional Chinese',
        'Deployed to the client’s VPS so their data stays on their infrastructure',
        'I led the architecture, the delivery and the client relationship',
      ],
      role: 'Architecture and delivery lead',
      stack: ['Multi-agent pipeline', 'Python', 'VPS deployment', 'Multilingual generation'],
      links: [],
    },
    {
      id: 'autoploy-academy',
      featured: true,
      title: 'Autoploy Academy',
      client: 'My own community',
      year: '2026',
      status: 'Live',
      category: 'teaching',
      cover: 'community',
      summary:
        'A paid learning community where I teach people to build with AI. I wrote and recorded a multi-day lead generation masterclass that ships with a working Python pipeline. A second course, on building software with Claude Code, is in production.',
      highlights: [
        '800+ members',
        'Multi-day lead generation masterclass with written material and working code',
        'Second course on AI-assisted development in production',
      ],
      role: 'Founder, curriculum, instruction',
      stack: ['Curriculum design', 'Python', 'Community'],
      links: [{ label: 'Visit the community', url: 'https://www.skool.com/the-ai-free-tools-community-5548/about' }],
    },
    {
      id: 'merchant-onboarding',
      title: 'Merchant onboarding platform for a bank',
      client: 'Commercial bank · Bangladesh · proposal',
      year: '2026',
      status: 'Demo',
      category: 'platform',
      cover: 'workflow',
      summary:
        'A bank-grade merchant onboarding platform, demonstrated before it was contracted. I was engagement lead: I wrote the technical proposal and led the four-week demo build, and our capability matrix was assessed control by control against the delivered code.',
      highlights: [
        'Forms, configurable workflow, role-based access and a full audit trail',
        'Bank’s own team gets credentials to test the demo after the presentation',
        'Capability matrix generated from the build, not from a plan',
      ],
      role: 'Engagement lead, technical proposal',
      stack: ['Solution architecture', 'Technical writing', 'Enterprise scoping'],
      links: [],
    },
    {
      id: 'seller-agents',
      title: 'Seller acquisition agents',
      client: 'Jewellery marketplace · US',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'agents',
      summary:
        'Paired finder and qualifier agents that source independent jewellery sellers in the US and verify them before they reach the sales team, built to hit a weekly qualified-lead target.',
      highlights: [
        'Finder agent sources candidates; qualifier agent verifies and scores them',
        'Entity verification before anything reaches a human',
        'Built against a weekly throughput target',
      ],
      role: 'Engineer',
      stack: ['Agent pairing', 'Entity verification', 'Lead scoring'],
      links: [],
    },
    {
      id: 'foreclosure-crm',
      title: 'Foreclosure-to-CRM pipeline',
      client: 'Real estate investor · Georgia, US',
      year: '2026',
      status: 'Deployed',
      category: 'ai',
      cover: 'pipeline',
      summary:
        'Watches public foreclosure notices in Savannah, Georgia, pulls structured fields out of each notice, skip-traces the owner through the SmartSkip API and writes the finished record into the client’s REsimpli CRM.',
      highlights: [
        'Document extraction from public notices',
        'Skip tracing through the SmartSkip API',
        'Completed records written straight into REsimpli',
        'Architected, built and deployed solo',
      ],
      role: 'Solo build',
      stack: ['Python', 'Document extraction', 'Third-party APIs', 'CRM integration'],
      links: [],
    },
    {
      id: 'hutong-recovery',
      title: 'Mid-build migration, shipped on deadline',
      client: 'Client project',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'migrate',
      summary:
        'Partway through a build we lost access to the client’s infrastructure. We moved the whole system onto Autoploy servers, switched the model provider to the Kimi API, and still delivered on the original date.',
      highlights: [
        'Full infrastructure migration mid-project',
        'Model provider swapped without changing what the client saw',
        'Delivered on the original deadline',
      ],
      role: 'Delivery lead',
      stack: ['Infrastructure migration', 'Kimi API', 'Model provider abstraction'],
      links: [],
    },
    {
      id: 'rag-chatbot',
      title: 'Knowledge base chatbot',
      client: 'Consumer health brand',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'chat',
      summary:
        'A chatbot that answers from the brand’s own documents rather than the open internet: document ingestion, indexing and grounded answers over a curated library.',
      highlights: ['Document ingestion and indexing', 'Answers grounded in the brand’s own material'],
      role: 'Engineer',
      stack: ['RAG', 'Knowledge base indexing', 'Grounded generation'],
      links: [],
    },
    {
      id: 'site-selection',
      title: 'Site-selection heatmap',
      client: 'Commercial client · Tennessee, US',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'map',
      summary:
        'A ranked heatmap of Williamson County, Tennessee, combining demographic and location data to show where a new site would have the most opportunity.',
      highlights: ['Combined demographic and location data', 'Ranked output the client could act on'],
      role: 'Data and visualisation',
      stack: ['Geospatial analysis', 'Data modelling', 'Visualisation'],
      links: [],
    },
    {
      id: 'family-os',
      title: 'Family operating system',
      client: 'Private client',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'house',
      summary: 'Scheduling, tasks and household coordination for a family, pulled into one automated system.',
      highlights: ['Scheduling, tasks and coordination in one place', 'Automations replace the manual back-and-forth'],
      role: 'Design and build',
      stack: ['Workflow automation', 'System design'],
      links: [],
    },
  ],

  // ---- About page ----------------------------------------------------------
  about: {
    photo: '', // e.g. '/images/jaiden.jpg'
    intro: [
      'I’m 17 and a senior at Hong Kong International School. In 2025 I co-founded Autoploy, an AI automation agency, and I run its engineering: architecture, building, deployment, and keeping systems working after handover.',
      'Our clients range from independent operators to a national health insurer, and we bid for enterprise banking work. I scope projects with clients directly, write the proposals, and lead a team spread across Hong Kong, Tokyo, Lahore and New York.',
      'Outside work I play competitive chess, spent four years as software lead on my school’s VEX robotics team, and teach what I’ve learned to 800+ people in an online community.',
    ],
    facts: [
      { label: 'Based in', value: 'Hong Kong & Tokyo' },
      { label: 'School', value: 'HKIS, Class of 2027' },
      { label: 'Company', value: 'Autoploy, since 2025' },
      { label: 'Focus', value: 'Agents, data pipelines, automation' },
    ],
    experience: [
      {
        org: 'Autoploy',
        title: 'Co-founder & Lead Engineer',
        period: '2025 – present',
        place: 'Hong Kong · Tokyo · Lahore · New York',
        points: [
          'Own engineering across concurrent client projects: architecture, implementation, deployment and maintenance',
          'Lead a distributed team across four time zones',
          'Run technical scoping, proposals and handover directly with clients',
          'Work spans multi-agent systems, retrieval, data extraction and API integration',
        ],
      },
      {
        org: 'Autoploy Academy',
        title: 'Founder & Instructor',
        period: '2025 – present',
        place: 'Online',
        points: [
          'Subscription learning community with 800+ members',
          'Wrote and recorded a multi-day lead generation masterclass with a working Python pipeline',
          'Second course on AI-assisted development with Claude Code in production',
        ],
      },
    ],
    activities: [
      {
        title: 'VEX Robotics, HKIS',
        detail:
          'Four years on the team as software and coding lead, responsible for autonomous routines and driver control. Competed at the APAC Championship in Shanghai, the Macau Open qualifiers and the Hong Kong world qualifiers. Trained new members on the team codebase.',
      },
      {
        title: 'Chess',
        detail:
          'Nationally ranked in Hong Kong. Competed at the 7th Asian Youth Chess Championship. Chess club leader since sophomore year.',
      },
      {
        title: 'Voice for Prisoners',
        detail: 'Organised and taught chess sessions at a Hong Kong correctional facility through Voice for Prisoners.',
      },
      {
        title: 'Game Development & Coding Club',
        detail: 'Member since sophomore year, club leader as a senior.',
      },
    ],
    education: {
      school: 'Hong Kong International School',
      period: 'Class of 2027',
      detail:
        'AP Calculus AB, AP Physics C, AP Computer Science Principles, AI & Machine Learning. Previously AP Biology, AP Microeconomics, AP Macroeconomics, AP Physics 1, AP French.',
    },
    stack: [
      { group: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'Google Apps Script'] },
      {
        group: 'AI & agents',
        items: ['Claude API', 'OpenAI API', 'Kimi API', 'Whisper', 'RAG', 'Multi-agent orchestration', 'Tool use'],
      },
      { group: 'Data', items: ['Document extraction', 'Public-record scraping', 'Enrichment APIs', 'Geospatial analysis'] },
      { group: 'Infrastructure', items: ['Linux VPS', 'Railway', 'Azure', 'Scheduled jobs', 'CRM integration'] },
    ],
  },
};
