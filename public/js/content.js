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
    // Shown under the "Selected work" heading.
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

  // The record in the top right. Nothing plays until a visitor clicks it.
  // bloom.mp3 is the section of the song cut from the iMovie export: it plays
  // from introStart once, then loops loopStart→loopEnd (the song's 0:40→1:05)
  // with no gap for the rest of the visit. Times are in seconds within the file.
  music: {
    src: '/media/bloom.mp3',
    title: '', // shown beside the record while playing; leave empty for no label
    introStart: 0,
    loopStart: 15.4301,
    loopEnd: 39.988,
    volume: 0.04, // 0–1. Each halving of loudness to the ear is roughly ×0.32
  },

  categories: [
    { id: 'ai', label: 'AI agents' },
    { id: 'data', label: 'Data & automation' },
    { id: 'platform', label: 'Enterprise platforms' },
  ],

  /*
    Project fields
      id        short, unique, used in the URL (#lead-pipeline)
      category  one of the category ids above
      client    'Company name · detail'. The part before ' · ' shows on the one-line row.
                Keep it generic where a contract forbids naming the client.
      status    Live · Deployed · In delivery · Demo · Presented · Delivered · Handed over
      images    optional [{ src: '/images/projects/<id>/1.png', caption: '...' }]. The first is the
                main picture; on project pages the rest show as a gallery. Without any, a diagram is drawn
      cover     diagram used when there's no image: agents, pipeline, workflow, web,
                chart, map, voice, brief, migrate, chat, calendar, house, cards, trio
      links     [{ label, url }]

    Big projects get their own page at /projects/<id> instead of expanding in the list:
      page      true = the row links to its own page (no plus)
      tagline   one sentence under the title on that page
      video     optional { youtube: 'id' } or { src: '/media/x.mp4' }, plus aspect: '9 / 16' if vertical.
                Without one, the page shows the project's diagram.
      stats     [{ value, label }] big numbers across the top of the page
      sections  [{ heading, body, bullets: [] }] the long write-up
  */
  projects: [
    {
      id: 'insurer-agent',
      page: true,
      // Full write-up for /projects/insurer-agent, fact-checked against project emails, docs and repos.
      tagline: "A health-insurance sales agent where the model only interprets what people say, and code controls everything it says, stores or writes to the CRM.",
      stats: [
        {
          "value": "1,004",
          "label": "passing tests across the project repository (9 Oct 2026)"
        },
        {
          "value": "0",
          "label": "issues against the insurer's 302-rule SonarQube profile"
        },
        {
          "value": "23",
          "label": "prompt-injection test cases (19 attacks, 4 normal-speech checks)"
        },
        {
          "value": "9",
          "label": "vendor-neutral integration interfaces, each with a test double"
        }
      ],
      sections: [
        {
          "heading": "The problem",
          "body": "A health insurer wanted an agent to qualify people interested in cover and pass each outcome to its human sales team through the CRM. A chatbot that writes its own replies is a poor fit for that. It can be talked into saying things nobody approved, and the conversation collects health details, which are sensitive personal data. Autoploy is building it under a subcontract, to run inside the insurer's own cloud. I'm the lead engineer, and I wrote the security and architecture answers for the insurer's review teams.",
          "bullets": [
            "Every line the agent says must come from a script the insurer signed off",
            "Medical and budget answers must never reach an outside AI model",
            "Consent to the privacy policy comes before any personal question",
            "Code must pass the insurer's 302-rule SonarQube profile with zero issues",
            "Secrets live in the insurer's vault, and our team never holds them"
          ]
        },
        {
          "heading": "How it works",
          "body": "The agent runs a fixed qualifying conversation from the approved script. On each turn the model reads what the person said and returns a small JSON result describing their intent. Code takes it from there and picks the next step, the next approved line and what gets stored. LangGraph runs each turn and checkpoints the conversation state, and a FastAPI layer handles webhooks.",
          "bullets": [
            "The model returns intent only. It never writes a line the agent says",
            "There is one language-model call in the codebase. The restricted-data check runs just above it, and if it fires the model is never called and an audit entry is written",
            "Nine vendor-neutral interfaces (LLM, CRM, telephony, messaging, speech-to-text, search, secrets and more), each with a test double. Swapping the model or its provider touches one file",
            "Secured text channel for testers: access key checked in constant time, server-issued conversation IDs, off by default",
            "When a conversation ends, the HubSpot client writes the outcome, who follows up and when, and a repeat key. The contact ID survives a restart, so an interrupted conversation still writes to the right record"
          ]
        },
        {
          "heading": "Guardrails and personal data",
          "body": "Pattern detection catches the obvious prompt-injection families. A skilled tester will get past it, so we treat it as the soft layer. The hard layer is built into the structure and doesn't depend on spotting the attack. Personal data follows the same rule: the restricted fields are kept away from the model by construction, not by filtering.",
          "bullets": [
            "Caller text is wrapped and passed as data, and a test checks that typing the closing tag can't break out",
            "Replies are checked for leaked instructions before they go out. A leaking reply becomes a neutral deflection",
            "The lead's outcome is worked out in code, so nothing said in a conversation can change how it's classified",
            "Medical and budget answers go straight to PostgreSQL. The prompt builder takes an explicit allowlist of safe fields, and the build rejects a new profiling field until it is classified safe or restricted",
            "Code reads the consent answer: yes opens the questions, a clear no ends the conversation and marks do-not-contact, an unclear answer stores nothing. Second lock: nothing is stored unless consent is exactly 'accepted'",
            "The restricted-terms list flags disclosures, not topics, because a health-cover sales call mentions health all the time. Before it went in, we caught that the matcher searched inside words and would have blocked an everyday word, and fixed it"
          ]
        },
        {
          "heading": "Testing and supply chain",
          "body": "The insurer's SonarQube gate allows zero issues, and each failed review round costs about a day. So we mirrored their 302-rule profile locally. By mid-September it had raised 11 genuine findings in code that had passed our own linting and strict type checks. One was a database password left as a config default since the first commit. That setting now has to come from the environment, and the app refuses to start without it.",
          "bullets": [
            "474 tests at the end of September and 1,004 across the repository by 9 October, with the quality gate passing on zero issues",
            "23-case injection suite (19 attacks, 4 normal-speech checks). One test turns every message into an attack and checks the agent still says only approved lines",
            "CycloneDX 1.6 SBOM over 152 components and a clean pip-audit in September, both regenerated on every build",
            "Multi-stage, non-root image with no shell and no source or secrets inside. We call it CIS-aligned, not benchmark-verified",
            "I found that the Dockerfile said the base image was pinned by digest when it used a floating tag. I fixed it and reported it myself",
            "The restricted-terms list sent to reviewers is generated from the installed code, with its commit, so they check what actually runs"
          ]
        },
        {
          "heading": "Where it stands",
          "body": "In delivery. Coding started in September 2026. In early October we deployed the first infrastructure pass into the insurer's test environment from a template: seven Azure resources, including a Key Vault in RBAC mode and a container app with a system-assigned managed identity. That app runs a placeholder image for now. Ours goes in once the insurer's IT finishes the access grants, loads the secrets and sets up the build pipeline.",
          "bullets": [
            "The HubSpot client has only been tested against a stand-in. The first live write will be run by the insurer's IT, because our team never holds the token",
            "We wrote the script for that write: it checks each value against the real property type, writes, reads back and never prints the token",
            "An October self-audit found the retention purge had never deleted anything. Real runs left a field empty that the tests filled in by hand. It's fixed, and the tests now run full conversations",
            "The same audit found that what people said was being saved when it shouldn't have been. Fixed. Only test data has ever been in the system",
            "Full conversations run end to end over the secured text channel. Phone calls are not live yet",
            "The two consent lines are our drafts until the insurer approves the wording, and a test flags them"
          ]
        }
      ],
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
        '1,004 passing tests (as of 9 October 2026), including a 23-case prompt-injection suite, and zero issues against the client’s 302-rule code-quality profile',
        'Nine vendor-neutral integration interfaces (LLM, CRM, telephony, messaging, speech, search and more), each with a test double',
      ],
      role: 'Lead engineer',
      stack: ['Python', 'LangGraph', 'FastAPI', 'PostgreSQL', 'Claude API', 'HubSpot API', 'Docker', 'Azure DevOps'],
      links: [],
    },
    {
      id: 'lead-pipeline',
      page: true,
      // Full write-up for /projects/lead-pipeline, fact-checked against project emails, docs and repos.
      tagline: "A three-stage agent pipeline that finds people in Hong Kong planning to emigrate, scores each one with written reasoning, and drafts Traditional Chinese replies for staff to send.",
      stats: [
        {
          "value": "3",
          "label": "agents in sequence: discovery, screening, nurture"
        },
        {
          "value": "4",
          "label": "channels the main pipeline searches: LIHKG, Threads, Instagram, open web"
        },
        {
          "value": "30",
          "label": "fields in each prospect record"
        },
        {
          "value": "2",
          "label": "markets in the recruitment pipeline: Hong Kong and Taiwan"
        }
      ],
      sections: [
        {
          "heading": "The problem",
          "body": "John Hu Migration Consulting is a Hong Kong firm that helps people move to countries such as Australia, Canada, the UK and the US. Many people in Hong Kong talk through their emigration plans in public, on LIHKG, Threads and Instagram. The goal was a system that finds those posts, works out which ones are real prospects, and helps the firm's staff reply in a personal way. Opt-out and do-not-contact lists had to sit alongside it."
        },
        {
          "heading": "How it works",
          "body": "Three agents run in sequence: discovery, screening and nurture. Results land in one Google Sheet with separate tabs for prospects, assisted replies, a review queue, suppression and do-not-contact. Screening runs on the Kimi API, and the system runs on the client's own server.",
          "bullets": [
            "Discovery searches LIHKG, Threads, Instagram and the open web, with Serper and Brave as search sources. Every record keeps its source and source URL",
            "Each forum find gets a thread series key built from the thread's title, so different pages of the same LIHKG thread share one key",
            "Each find becomes a 30-field record, including segment, contactability, estimated age, budget, language and eligibility, possible programme routes, and flags for which details can be verified",
            "Every record gets a score, a separate confidence value and the model's written reasoning",
            "Nurture drafts a reply in Cantonese-style Traditional Chinese that picks up on what the person posted, such as how far along a visa application they are or which countries they are weighing, then introduces the firm",
            "Businesses found on public company contact pages are tagged for a separate outreach path from individual forum posters"
          ]
        },
        {
          "heading": "Engineering decisions",
          "body": "Several choices are about what happens when the model fails or is unsure, and about who presses send. Staff need to see why a lead was picked before they act on it.",
          "bullets": [
            "Score and confidence are separate fields. A lead can score well while the model is unsure, and staff see both numbers",
            "The model has to return structured JSON. If it doesn't, or the Kimi API rejects the request (it has rejected posts it considered high risk), the item goes to a review queue with the error recorded instead of being dropped",
            "Forum and social replies are sent by a person, not a bot. Each draft has a one-click link to the original post, and the sheet tracks who posted it and whether there was a reply",
            "Opt-outs logged in the suppression tab carry over to a do-not-contact list, which also holds people already marked as active leads. The client also shared its own sheet with a suppression tab in the same format",
            "We tested the opt-out path end to end: a test opt-out entered in suppression shows up on the do-not-contact list"
          ]
        },
        {
          "heading": "A second pipeline: recruiting on LinkedIn",
          "body": "For the firm's own hiring, we ran a one-off recruitment pipeline that writes into the same sheet. It finds public LinkedIn profiles of immigration sales staff in Hong Kong and Taiwan and gives each candidate a fit score with written reasoning.",
          "bullets": [
            "Searches ran through Serper in two ways: by sales job titles, and by the names of immigration firms",
            "Each candidate row holds current role and employer, years in immigration sales, programmes, languages, a numeric fit score and the model's screening reasoning",
            "Each row keeps the search query that matched it, so it is clear why a profile showed up",
            "The sheet has columns for the client's own decision and notes, who made contact, when, and the response"
          ]
        },
        {
          "heading": "My role and where it stands",
          "body": "I led the architecture, oversaw delivery and led the client relationship. Other Autoploy engineers built parts of the system. Work started in August 2026, it runs on the client's own server, and we were still adding to it in October 2026.",
          "bullets": [
            "In October we added a LinkedIn discovery feed for prospective clients. It flags profiles that pair seniority with a migration-interest signal, and each row is marked discovery only: not a qualified lead until the client's team reviews it",
            "Status: live and still being extended",
            "Stack: multi-agent pipeline, Kimi API, Serper, Brave Search, Google Sheets, client VPS",
            "Prospect and candidate data stay private. No names, handles or screenshots from the sheet are published here"
          ]
        }
      ],
      images: [
        { src: '/images/projects/lead-pipeline/1.webp', caption: 'Diagram of the pipeline: three agents find, score and draft; a person still sends each reply' },
        { src: '/images/projects/lead-pipeline/2.webp', caption: 'The Google Sheet the pipeline writes to, shown as tabs and column headers with every record removed' },
      ],
      title: 'Multi-agent lead pipeline in Traditional Chinese',
      client: 'John Hu Migration Consulting · Hong Kong',
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
        'A second pipeline scores public LinkedIn profiles of immigration sales staff in Hong Kong and Taiwan for the firm’s hiring, each with a fit score and reasoning',
      ],
      role: 'Architecture, delivery and client lead',
      stack: ['Multi-agent pipeline', 'Kimi API', 'Serper', 'Brave Search', 'LinkedIn', 'Google Sheets API', 'VPS'],
      links: [],
    },
    {
      id: 'bank-erp',
      page: true,
      // Full write-up for /projects/bank-erp, fact-checked against project emails, docs and repos.
      tagline: "I wrote the technical bid for Shahjalal Islami Bank's procurement ERP tender, then built a working demo of the system for the bank to test.",
      stats: [
        {
          "value": "52",
          "label": "control assertions, all passing"
        },
        {
          "value": "99",
          "label": "screen checks across six roles, zero errors"
        },
        {
          "value": "24/24",
          "label": "steps in the end-to-end browser test"
        },
        {
          "value": "222 / 298",
          "label": "tender line items with a working screen"
        }
      ],
      sections: [
        {
          "heading": "The problem and the bid",
          "body": "At Shahjalal Islami Bank, Common Services Division purchases start on paper and move between desks. Nobody can say where a request is, which supplier was used, at what price, or why. In July 2026 the bank put out a tender for ERP software with an integrated workflow system. It covered 25 modules, from requisitions and tenders to building management, transport and the canteen. We bid as the technical partner in a consortium, and I wrote the technical bid.",
          "bullets": [
            "Architecture: three tiers (application, database, middleware) on Ubuntu Server 22.04+, Node.js, TypeScript, NestJS and PostgreSQL 15+",
            "Production, DR and far-DR sites kept in sync, with a load-balanced application tier",
            "Point-by-point answers to the technical requirements (Annexure A) and to all 25 business modules (Annexure B)",
            "Payment-gateway items marked as needing customisation until the bank chooses a payment provider",
            "A 90-working-day rollout in five phases: requirements, build, integration, UAT, then training and go-live"
          ]
        },
        {
          "heading": "How it works",
          "body": "For the interview round after the tender, I built a working demo of the proposed system so the bank could test it, not just read about it. It runs one purchase end to end: requisition, approvals, tender, sealed bids, evaluation, work order, goods receipt, invoice and payment. Four days into the build, 222 of the tender's 298 line items had a working screen behind them.",
          "bullets": [
            "A requisition checks the store first: ask for 15 laptops with 3 in stock and 12 go to purchase. A work order for 15 is then refused, naming the item and both quantities",
            "Approvals route by value; an admin edits a threshold, watches the route redraw, then saves it as a new version",
            "A separate vendor portal with its own login and session; a bidder sees only its own bids, not who else bid or what they offered",
            "Two-envelope tendering: technical offers are judged first, and prices stay sealed until that evaluation is signed off",
            "Invoices are matched against the work order and goods receipt; if item, quantity or price disagree, the invoice cannot be paid",
            "Not in the tender, built anyway: the Shariah Supervisory Committee as its own approval authority, and seven procurement-integrity tests such as split purchases and price drift"
          ]
        },
        {
          "heading": "Engineering decisions",
          "body": "The controls the bank would test in the room are code paths that refuse, not buttons that are hidden. The demo is condensed onto one laptop with no network so it runs anywhere. Its About screen says so, and the production design stays the three-tier one in the bid.",
          "bullets": [
            "Maker-checker runs inside the database transaction, before the role check: no self-approval, even for a user holding every role",
            "Inside the bank, sealed prices have one read path. It checks the seal on every read, and while a tender is sealed the amounts never leave the data layer",
            "Workflows are versioned data: an edit creates a new version, and documents in flight keep a frozen copy of their steps",
            "Append-only audit log, SHA-256 hash-chained and written in the same transaction as each change",
            "Money stored as integer poisha in 64-bit columns and formatted only at display, in lakh grouping",
            "No CDN, webfonts or runtime network calls; a deterministic seed and a five-second reset that is safe while the app runs"
          ]
        },
        {
          "heading": "Testing",
          "body": "One command runs the type checker and a production build, restarts the app on that build, then runs every test layer. The whole suite passes on the final build. The seal test reads the sealed payload and confirms it holds no bid amount at all, rather than checking that the screen hides one.",
          "bullets": [
            "52 control assertions against the seeded database, rolled back afterwards so they are safe to run right before a demo",
            "Tamper tests: change one field in one audit record and verification names that record; delete a record and the chain fails",
            "Navigation sweep: signs in as six roles and opens every menu item, 99 screen checks, zero errors",
            "A 24-step browser test performs the whole demo, requisition to payment, ending with the audit chain verifying",
            "Offline check: 35 pages render with all network access blocked, and none attempts an external request",
            "Projector check: 10 key screens legible at 1280x720, no text under 11px"
          ]
        },
        {
          "heading": "Where it stands",
          "body": "I presented the demo to the bank in September 2026, in the interview round after the tender. It is a demonstration of the proposed system, not a production deployment. We mapped all 298 line items in the tender's module list against the build and gave the bank the counts, including what was not built yet.",
          "bullets": [
            "133 run end to end; 89 more are on screen with seeded data, their write actions due in the build phase",
            "64 are scheduled for the build phase; 12 were flagged in the bid as needing customisation or a workaround",
            "The integrations screen lists core banking, HRMS, DMS, IAM, email, SMS and payment gateway, each marked Not connected",
            "Demo stack: Next.js 15, React 19, TypeScript, Prisma, SQLite, Tailwind 4, Playwright",
            "Bid stack: Node.js, TypeScript, NestJS, PostgreSQL 15+, Docker, Ubuntu Server 22.04+"
          ]
        }
      ],
      images: [
        { src: '/images/projects/bank-erp/1.webp', caption: 'No-code approval workflow builder, with a live routing preview from the same engine the system runs on' },
        { src: '/images/projects/bank-erp/2.webp', caption: 'Maker-checker in action: the system refuses a self-approval and shows the rule it enforces' },
        { src: '/images/projects/bank-erp/3.webp', caption: 'Two-envelope tender: price offers stay sealed at the data layer until technical sign-off' },
        { src: '/images/projects/bank-erp/4.webp', caption: 'Bid comparative statement: the cheapest bid is blocked because it failed technical evaluation' },
        { src: '/images/projects/bank-erp/5.webp', caption: 'Invoice three-way match: work order, goods receipt and invoice must agree before payment' },
        { src: '/images/projects/bank-erp/6.webp', caption: 'Hash-chained audit trail: every record verified end to end' },
        { src: '/images/projects/bank-erp/7.webp', caption: 'One audit record: the field-level change beside its recomputed SHA-256 proof' },
        { src: '/images/projects/bank-erp/8.webp', caption: 'The proposed three-tier architecture from the bid' },
      ],
      title: 'Procurement ERP for a bank tender',
      client: 'Shahjalal Islami Bank · Bangladesh',
      year: '2026',
      status: 'Presented',
      category: 'platform',
      cover: 'workflow',
      summary:
        'A working procurement ERP built for Shahjalal Islami Bank’s tender, so the bank could test it instead of reading about it. A purchase moves from requisition through approvals, tender, bid evaluation and invoice matching to payment. Every control is enforced in code and written to a tamper-evident audit trail. I wrote the technical bid, and after we submitted the tender I presented the demo to the bank in the interview round.',
      highlights: [
        'Six internal roles plus an external vendor portal',
        '52 automated checks on the controls (maker-checker, three-way match, quantity matching, tamper detection), all passing',
        'A navigation sweep signs in as every role and checks 99 screens with zero errors; a 24-step browser test runs the whole demo, requisition to payment',
        'Money stored as exact integers; a stateless app with signed-cookie sessions, so it can run as several copies behind a load balancer',
        'The bid: 25 modules, a three-tier architecture with production, DR and far-DR sites, and a 90-working-day rollout plan',
      ],
      role: 'Technical bid, demo and presentation',
      stack: ['Next.js', 'TypeScript', 'React', 'Prisma', 'SQLite', 'Tailwind', 'Playwright'],
      links: [],
    },
    {
      id: 'construction-agents',
      page: true,
      // Full write-up for /projects/construction-agents, fact-checked against project emails, docs and repos.
      tagline: "Three OpenClaw agents for a construction company: email triage, subcontractor calls and project questions. Built with Synchro IA, sandbox-tested, handed over for go-live.",
      stats: [
        {
          "value": "3",
          "label": "OpenClaw agents: inbox, subcontractor calls, projects"
        },
        {
          "value": "16/16",
          "label": "sandbox tests passing, 0 failures"
        },
        {
          "value": "12/12",
          "label": "webhook event types delivered to Synchro IA's staging n8n"
        },
        {
          "value": "0",
          "label": "production credentials held by the build team"
        }
      ],
      sections: [
        {
          "heading": "The problem",
          "body": "Synchro IA ran this project for a construction company. The director's Outlook gets about 150 to 200 emails a day across three addresses, and project information is split across Outlook, SharePoint and Monday.com. Synchro IA scoped three agents with the client: one for the inbox, one to phone and qualify subcontractors before they are invited to bid, and one for project questions. We built the agent side with them. The project ran from April to June 2026, and my role was client-side implementation and technical support."
        },
        {
          "heading": "How it works",
          "body": "Three agents on OpenClaw, built to run on a dedicated Mac mini. The director talks to the two assistants over WhatsApp in Quebec French. No agent writes to an outside system itself. Each one emits a structured event, and Synchro IA's n8n workflows carry it to Monday.com, Outlook, Twilio or WhatsApp. The points below describe the agents as specified; the testing section says what actually ran.",
          "bullets": [
            "Executive assistant: sorts each email as Urgent, Follow-up required or Information, drafts replies and sends a 6:30 a.m. summary",
            "It reads [SUIVI-X] tags in subject lines to set follow-up dates, with a 5-day default, and sends nothing without approval",
            "Subcontractor agent: works a call queue one call at a time, weekdays 8 a.m. to 5 p.m., asking four go/no-go qualification questions",
            "If all four pass, it confirms an email and triggers the client's existing Monday invite-to-bid automation; two unanswered calls hand the row to a human",
            "Project assistant: answers questions per active project, indexes documents and reports the director sends, and pulls out tasks and owners"
          ]
        },
        {
          "heading": "Engineering decisions",
          "body": "Synchro IA set the specs with the client and runs the n8n side. We wrote the webhook contracts between the two and built the agent side against them. Because the agents sit behind that boundary, credentials, API versions and backends can change on Synchro IA's side without changing the agent contract.",
          "bullets": [
            "One envelope for all 12 event types in the contract: event ID, agent, project, correlation ID, payload",
            "The contract retries only timeouts, rate limits and server errors (408, 429, 500, 502 to 504), at 30 seconds, 2 minutes and 10 minutes, then flags the event for manual review",
            "Each project gets its own namespace and a question reads from one namespace only; the spec has the assistant ask which project when a question is ambiguous",
            "Six fixed call statuses: Prêt à appeler, Appelé, Intéressé, Pas disponible, À confirmer and Rappel requis; the spec treats any other transition as an error",
            "Inbound callers are matched against the subcontractor list; unknown numbers get an information-collection script and no project details",
            "One shared utility manages the executive assistant's priority and ignored senders and the project assistant's active projects, stored as local JSON in Phase 1"
          ]
        },
        {
          "heading": "Testing and safety",
          "body": "Everything ran on fictional, anonymised data. We never held a production credential: the repo carries only an .env template, and Synchro IA injects real keys at deployment. The sandbox logic is rule-based: keyword matching sorts the emails and call outcomes come from scripted scenarios. Claude-backed behaviour was planned to replace it once API access was in place.",
          "bullets": [
            "16 of 16 sandbox tests passing; a secret check found no real secrets in the repo",
            "12 sample webhook payloads validated, then delivered 12 of 12 to a local mock receiver and to Synchro IA's staging n8n",
            "Checked on our own dev accounts: an ElevenLabs French test clip, and a Monday.com item created from a project-assistant event",
            "Sandbox call cases: a caller asking to switch from French to English, an unknown caller, and a question about budget or other bidders that escalates to a human",
            "Drafts are flagged for approval, and project-assistant Monday updates wait for explicit confirmation"
          ]
        },
        {
          "heading": "Where it stands",
          "body": "We handed over the sandbox foundation with architecture, configuration and testing docs, plus the webhook contracts Synchro IA's n8n workflows build on. Go-live is Synchro IA's job: they inject the credentials and run the final live integration tests. Live reading of project WhatsApp groups was out of scope for Phase 1. At handover, these items were still open on Synchro IA's or the client's side.",
          "bullets": [
            "n8n receiver workflows for each agent",
            "Outlook, SharePoint and WhatsApp Business connections",
            "Live Twilio calls and the final ElevenLabs voice",
            "Production Monday.com board IDs and the Claude API key",
            "Final signatures, FAQ, call scripts and wording"
          ]
        }
      ],
      title: 'Three AI agents for a construction company',
      client: 'Synchro IA · for a construction company',
      year: '2026',
      status: 'Handed over',
      category: 'ai',
      cover: 'trio',
      summary:
        'Built with Synchro IA for one of their clients, a construction company. An executive assistant that triages email and drafts replies, a subcontractor agent that runs calls from a French script and updates Monday.com, and a project coordinator that reads WhatsApp groups and pulls out tasks and owners. They run on OpenClaw on the client’s Mac mini and were tested in a sandbox before any production credentials went in.',
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
      page: true,
      // Full write-up for /projects/merchant-onboarding, fact-checked against project emails, docs and repos.
      tagline: "A working merchant onboarding demo for UCB, where admins change the form without code and the database itself blocks self-approval.",
      stats: [
        {
          "value": "244 / 351",
          "label": "controls live in the demo, by our own control-by-control assessment"
        },
        {
          "value": "16",
          "label": "external integrations built behind adapters, all running on simulators"
        },
        {
          "value": "3",
          "label": "layers enforcing maker-checker: interface, API, database"
        },
        {
          "value": "4 weeks",
          "label": "demo build plan, with code freeze at the end of day 17"
        }
      ],
      sections: [
        {
          "heading": "The problem",
          "body": "UCB, a bank in Bangladesh, was looking for a platform for onboarding merchants. That means capturing a business's details and documents, scoring its risk, getting it approved and linking the account it gets paid into. Our answer was a working demo, built so the bank's own team could log in and test it themselves. It had to hold up under real use, not just a guided walkthrough.",
          "bullets": [
            "Back-office staff had to change the onboarding form without a developer",
            "Approvals needed a separate maker and checker, and that rule had to survive a crafted API request, not just the interface",
            "16 external systems to integrate with, from core banking to the SMS gateway, with no live endpoints for any of them",
            "A matrix of 351 controls covering features, security, architecture and integrations",
            "Four weeks to build it"
          ]
        },
        {
          "heading": "What we built",
          "body": "One field registry describes every field on the onboarding form: its type, whether it is mandatory, its validation rules and its English and Bangla labels. The form renderer and the server-side validator both read from it. An admin proposes a new field in the back office, a second admin approves it, and it appears on the live form with no code change.",
          "bullets": [
            "Assisted (staff-led) and self-service journeys, with server-side OTP, save and resume, and applicant status tracking",
            "Four settlement-account paths: an existing account, a new account through eKYC, a mobile financial services account, or another bank",
            "Ten workflow stages from draft to live, with document review, risk review and checker review in between",
            "A weighted risk score that shows each factor's contribution, recalculates when a contributing answer changes and sets the approval path by threshold",
            "Uploads checked by their leading bytes against a six-format allow-list, and held back until a scan step clears them; the scan fails closed",
            "An OCR prefill step where a person always confirms the extracted values; the OCR engine itself is simulated for now"
          ]
        },
        {
          "heading": "Engineering decisions",
          "body": "The rule throughout: the browser never decides what is valid or allowed. The server does. The plan's definition of done had four parts. A feature had to work in the interface, hold up against a crafted API request, write to the audit trail and give users without permission a clean denial instead of a stack trace.",
          "bullets": [
            "Maker-checker enforced in the interface, the API and a database CHECK constraint, with a proof script that bypasses the interface and is still refused",
            "Append-only audit trail with before and after values: the app's database role has no update or delete rights on it, and a trigger blocks those operations anyway",
            "Server-held sessions instead of JWTs, so an admin can end a session instantly and a password change logs out every other session",
            "Every external system sits behind an adapter with a simulator that follows the same contract, and each response says whether a simulator answered",
            "The staff-login simulators refuse by default, so one shipped by mistake locks people out instead of letting them in",
            "Argon2id password hashing, session-bound anti-forgery tokens, progressive delay on login, and errors that return only a correlation ID"
          ]
        },
        {
          "heading": "My role",
          "body": "I was the engagement lead. I wrote the technical proposal, led the four-week demo build plan and owned the capability matrix that tracks all 351 controls. Another Autoploy engineer owned the build.",
          "bullets": [
            "The plan put four things first: the config engine, one complete onboarding journey, the back office with real maker-checker, and security that holds up when the bank's team probes it",
            "Weekly checkpoints with me: login, access control and audit trail in week one; add-a-field and a full journey in week two; a full run-through with maker-checker in week three",
            "A do-not-build list, including native apps, dynamic QR generation and live connections to external systems",
            "I chased the open questions, such as the deployment target and the bank's security requirements",
            "The matrix I owned was regenerated against the delivered build, with live and simulated items marked separately"
          ]
        },
        {
          "heading": "Where it stands",
          "body": "The demo build was delivered in August 2026. By our own assessment, 244 of the 351 controls are live, above the plan's target. The whole stack comes up with one docker compose command, and a reset endpoint returns it to its seeded demo state without touching the audit trail.",
          "bullets": [
            "All 16 external integrations run against simulators. None are connected; each waits on the bank for an endpoint, credentials or a vendor choice",
            "OCR sits behind an engine-agnostic adapter and is simulated for now",
            "The malware scan step is a fail-closed heuristic; no anti-malware engine has been chosen yet",
            "OTP is issued and checked server-side; real SMS delivery needs the bank's gateway",
            "Each field holds English and Bangla labels, but only representative screens are translated"
          ]
        }
      ],
      title: 'Merchant onboarding platform for a bank',
      client: 'UCB · Bangladesh',
      year: '2026',
      status: 'Demo',
      category: 'platform',
      cover: 'web',
      summary:
        'A bank-grade merchant onboarding platform built as a working demo UCB’s own team could log into and test. Admins change the onboarding form without code, and approvals follow a maker-checker rule the database itself enforces. I led the engagement: the proposal, the build plan and the capability matrix.',
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
      id: 'brac-bank',
      title: 'Technical proposal and interview presentation',
      client: 'BRAC Bank · Bangladesh',
      year: '2026',
      status: 'Presented',
      category: 'platform',
      cover: 'web',
      summary: 'A technical proposal and interview presentation for BRAC Bank, for a different product from the Shahjalal ERP. Full write-up coming soon.',
      highlights: [],
      role: 'Technical proposal and presentation',
      stack: ['Solution architecture', 'Technical writing'],
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
      client: 'The Hutong',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'migrate',
      summary:
        'A lead outreach system for The Hutong, built on OpenClaw. Partway through the build the system had to move off the client’s infrastructure, so we moved all of it onto our own servers, switched the model provider to the Kimi API and still delivered on the original date.',
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
      client: 'Synchro IA',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'trio',
      summary: 'A separate three-agent OpenClaw setup for Synchro IA, built right after OpenClaw was released. Full write-up coming soon.',
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
      client: 'GemGem · US',
      year: '2026',
      status: 'Delivered',
      category: 'ai',
      cover: 'cards',
      summary:
        'For GemGem, a jewellery marketplace: a finder agent that sources independent jewellery sellers in the US and a qualifier agent that verifies them before they reach the sales team, built to hit a weekly qualified-lead target.',
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
};
