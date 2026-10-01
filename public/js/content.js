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
    { id: 'ai', label: 'AI agents' },
    { id: 'data', label: 'Data & automation' },
    { id: 'platform', label: 'Enterprise platforms' },
  ],

  /*
    Project fields
      id        short, unique, used in the URL (#plan-b)
      featured  true = shown large in "Selected work"
      category  one of the category ids above
      client    who it was for. Keep it generic unless you have permission to name them.
      status    Live · Deployed · In delivery · Demo · Delivered · Handed over
      image     optional screenshot/photo. Without one, a diagram cover is drawn
      cover     diagram used when there's no image: agents, pipeline, workflow, web,
                chart, map, voice, brief, migrate, chat, calendar, house, cards, trio
      links     [{ label, url }]
  */
  projects: [
    {
      id: 'insurer-agent',
      featured: true,
      title: 'AI sales agent for a health insurer',
      client: 'Health insurer · subcontract',
      year: '2026',
      status: 'In delivery',
      category: 'ai',
      cover: 'chat',
      summary:
        'A sales agent that qualifies people interested in health cover, built to run inside the insurer’s own cloud. It follows a fixed, compliance-approved script: the model works out what the person meant and returns structured data, but it never writes what the agent says. I’m the lead engineer.',
      highlights: [
        'The model only classifies intent into a small JSON result; every line the agent speaks comes from an approved script, so a prompt injection can’t change what it says',
        'Medical and budget answers never reach the model. They go straight to the database, and deterministic redaction runs on every step’s output',
        'A consent gate enforced in code comes before any personal question. A “no” ends the conversation and marks the person do-not-contact',
        '474 tests, including a 23-case prompt-injection suite, and a clean scan against the client’s 302-rule code-quality profile',
        'Nine vendor-neutral integration interfaces (LLM, CRM, telephony, messaging, speech, search and more), each with a test double',
      ],
      role: 'Lead engineer',
      stack: ['Python', 'LangGraph', 'FastAPI', 'PostgreSQL', 'Claude API', 'HubSpot API', 'Docker', 'Azure DevOps'],
      links: [],
    },
    {
      id: 'lead-pipeline',
      featured: true,
      title: 'Multi-agent lead pipeline in Traditional Chinese',
      client: 'Migration consultancy · Hong Kong',
      year: '2026',
      status: 'Live',
      category: 'ai',
      cover: 'agents',
      summary:
        'Three agents work in sequence. One searches Hong Kong forums, social platforms and the open web for people showing signs they plan to emigrate. One screens and scores each lead with written reasoning. One drafts a personal reply in Traditional Chinese for the client’s staff to send. It runs on the client’s own server.',
      highlights: [
        'Discovery across LIHKG, Threads, Instagram and open-web search (Serper, Brave)',
        'Every lead gets a score, a confidence value and the model’s reasoning, so staff can see why it was picked',
        'Replies are drafted in Cantonese-style Traditional Chinese and sent by a person through a one-click link, not by a bot',
        'Leads the model can’t score go to a review queue; opt-out and do-not-contact lists live alongside the pipeline',
      ],
      role: 'Architecture, delivery and client lead',
      stack: ['Multi-agent pipeline', 'Kimi API', 'Serper', 'Brave Search', 'Google Sheets API', 'VPS'],
      links: [],
    },
    {
      id: 'bank-erp',
      featured: true,
      title: 'Procurement ERP for a commercial bank',
      client: 'Commercial bank · Bangladesh · tender',
      year: '2026',
      status: 'Demo',
      category: 'platform',
      cover: 'workflow',
      summary:
        'A working procurement ERP built for a bank tender, so the bank could test it instead of reading about it. A purchase moves from requisition through approvals, tender, bid evaluation and invoice matching to payment. Every control is enforced in code and written to a tamper-evident audit trail. I also wrote the technical bid.',
      highlights: [
        'Six internal roles plus an external vendor portal',
        '34 automated checks on the controls: maker-checker, three-way match, quantity matching, tamper detection',
        'A navigation sweep signs in as every role and opens all 92 screens; a 24-step browser test runs the whole demo, requisition to payment',
        'Money stored as exact integers; a stateless app with signed-cookie sessions, so it can run as several copies behind a load balancer',
        'The bid: 25 modules, a three-tier architecture with production, DR and far-DR sites, and a 90-working-day rollout plan',
      ],
      role: 'Technical bid and demo',
      stack: ['Next.js', 'TypeScript', 'React', 'Prisma', 'SQLite', 'Tailwind', 'Playwright'],
      links: [],
    },
    {
      id: 'construction-agents',
      featured: true,
      title: 'Three AI agents for a construction company',
      client: 'Construction company',
      year: '2026',
      status: 'Handed over',
      category: 'ai',
      cover: 'trio',
      summary:
        'An executive assistant that triages email and drafts replies, a subcontractor agent that runs calls from a French script and updates Monday.com, and a project coordinator that reads WhatsApp groups and pulls out tasks and owners. They run on OpenClaw on the client’s Mac mini and were tested in a sandbox before any production credentials went in.',
      highlights: [
        'Email sorted into urgent, follow-up and information, with nothing sent without approval',
        'Subcontractor calls: French script, answer capture (Oui / Non / À confirmer), a call-queue state machine and bilingual escalation',
        'WhatsApp group monitoring with strict separation between projects; extracted tasks go to Monday.com',
        'n8n webhook contracts between the agents and every integration; 16 of 16 sandbox tests passing',
        'Production credentials injected at deploy time and never stored in the repo',
      ],
      role: 'Implementation and technical support',
      stack: ['OpenClaw', 'Claude API', 'Python', 'n8n', 'Docker', 'Monday.com', 'WhatsApp'],
      links: [],
    },
    {
      id: 'merchant-onboarding',
      title: 'Merchant onboarding platform for a bank',
      client: 'Commercial bank · Bangladesh · evaluation demo',
      year: '2026',
      status: 'Demo',
      category: 'platform',
      cover: 'web',
      summary:
        'A bank-grade merchant onboarding platform built as a working demo the bank’s own team could log into and test. Admins change the onboarding form without code, and approvals follow a maker-checker rule the database itself enforces. I led the engagement: the proposal, the build plan and the capability matrix.',
      highlights: [
        'Config-driven forms: one field registry drives both the form and the server-side validation',
        'Maker-checker enforced in the interface, the API and a database CHECK constraint',
        'Weighted risk score with a per-factor breakdown; append-only audit trail with before and after values',
        'Argon2id passwords, server-held sessions and rate-limited login; 16 bank integrations behind swappable simulators',
        '244 of 351 required controls live in the demo, assessed one by one against the code',
      ],
      role: 'Engagement lead',
      stack: ['PostgreSQL', 'Docker Compose', 'Argon2id', 'Solution architecture'],
      links: [],
    },
    {
      id: 'foreclosure-crm',
      title: 'Foreclosure-to-CRM pipeline',
      client: 'Real estate investor · Georgia, US',
      year: '2026',
      status: 'Deployed',
      category: 'data',
      cover: 'pipeline',
      summary:
        'Watches public foreclosure notices in Savannah, Georgia, pulls structured fields out of each notice, skip-traces the owner through the SmartSkip API and writes the finished lead into the client’s REsimpli CRM, where their team works it by phone and text.',
      highlights: [
        'Document extraction from public notices',
        'Owner contact details found through the SmartSkip API',
        'Finished leads written straight into REsimpli',
        'Architected, built and deployed solo',
      ],
      role: 'Solo build',
      stack: ['Python', 'Document extraction', 'SmartSkip API', 'REsimpli'],
      links: [],
    },
    {
      id: 'outreach-migration',
      title: 'Lead outreach system, migrated mid-build',
      client: 'Client project',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'migrate',
      summary:
        'A lead outreach system built on OpenClaw. Partway through the build we lost access to the client’s infrastructure, so we moved the whole system onto our own servers, switched the model provider to the Kimi API and still delivered on the original date.',
      highlights: [
        'Full infrastructure migration in the middle of the project',
        'Model provider swapped without changing what the client saw',
        'Delivered on the original deadline',
      ],
      role: 'Delivery lead',
      stack: ['OpenClaw', 'Kimi API', 'Infrastructure migration'],
      links: [],
    },
    {
      id: 'early-openclaw',
      title: 'Three-agent OpenClaw setup, at launch',
      client: 'Construction client',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'trio',
      summary: 'A three-agent OpenClaw setup built for the same client right after OpenClaw was released. Full write-up coming soon.',
      highlights: [],
      role: '',
      stack: ['OpenClaw'],
      links: [],
    },
    {
      id: 'tommy-lead-gen',
      title: 'Lead generation system',
      client: 'Client project',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'pipeline',
      summary: 'A lead generation system built for a client. Full write-up coming soon.',
      highlights: [],
      role: '',
      stack: ['Lead generation'],
      links: [],
    },
    {
      id: 'site-selection',
      title: 'Site-selection heatmap',
      client: 'Commercial client · Tennessee, US',
      year: '2026',
      status: 'Delivered',
      category: 'data',
      cover: 'map',
      summary:
        'A ranked heatmap of Williamson County, Tennessee, combining demographic and location data to show where a new site would have the most opportunity.',
      highlights: ['Demographic and location data combined into one score per area', 'Ranked output the client could act on'],
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
      category: 'data',
      cover: 'house',
      summary:
        'An AI assistant for a family that works over a structured notes vault and their Google account, bringing scheduling, tasks and household coordination into one place, under a strict permission model.',
      highlights: [
        'Notes vault with a morning brief, a weekly dashboard and a written security-and-permissions policy',
        'Read-only acceptance tests check it can reach only approved sources and can’t send, edit, delete or pay for anything',
        'Google OAuth credentials kept in the macOS Keychain, not in files',
      ],
      role: 'Setup and acceptance testing',
      stack: ['Claude', 'Google OAuth', 'macOS Keychain', 'zsh'],
      links: [],
    },
    {
      id: 'seller-agents',
      title: 'Seller acquisition agents',
      client: 'Jewellery marketplace · US',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'cards',
      summary:
        'A finder agent that sources independent jewellery sellers in the US and a qualifier agent that verifies them before they reach the sales team, built to hit a weekly qualified-lead target.',
      highlights: ['Finder and qualifier agents working as a pair', 'Entity verification before anything reaches a person', 'Built against a weekly throughput target'],
      role: 'Engineer',
      stack: ['Multi-agent', 'Entity verification', 'Lead scoring'],
      links: [],
    },
    {
      id: 'health-chatbot',
      title: 'Knowledge base chatbot',
      client: 'Consumer health brand',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'brief',
      summary:
        'A chatbot that answers from the brand’s own documents rather than the open internet: document ingestion, indexing and grounded answers over a curated library.',
      highlights: ['Document ingestion and indexing', 'Answers grounded in the brand’s own material'],
      role: 'Engineer',
      stack: ['RAG', 'Knowledge base indexing', 'Grounded generation'],
      links: [],
    },
  ],

  // ---- About page ----------------------------------------------------------
  about: {
    photo: '', // e.g. '/images/jaiden.jpg'
    intro: [
      'I’m 17 and a senior at Hong Kong International School. In 2025 I co-founded Autoploy, an AI automation agency, and I run its engineering: architecture, building, deployment, and keeping systems working after handover.',
      'Our clients range from independent operators to a national health insurer, and we bid for enterprise banking work. I scope projects with clients directly, write the proposals, and lead a team spread across Hong Kong, Tokyo, Lahore and New York.',
      'Outside work I play competitive chess and spent four years as software lead on my school’s VEX robotics team.',
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
