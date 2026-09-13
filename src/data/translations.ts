export type Language = 'en' | 'ar';

export interface TranslationContent {
  nav: {
    work: string;
    proof: string;
    caseStudy: string;
    engineering: string;
    education: string;
    security: string;
    process: string;
    trust: string;
    contact: string;
    langBtn: string;
    brandStatus: string;
    home: string;
  };
  hero: {
    systemStatus: string;
    nameFirstName: string;
    nameLastName: string;
    headline: string;
    roles: string[];
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollHint: string;
    portraitLabel: string;
    portraitSub: string;
    metaLat: string;
    capabilities: string[];
    verifiedBadge: string;
    testsBadgeUnit: string;
    testsBadgeSub: string;
    whatsappLabel: string;
    callLabel: string;
  };
  proof: {
    badge: string;
    title: string;
    subtitle: string;
    filters: {
      id: string;
      label: string;
    }[];
    items: {
      id: string;
      value: string;
      label: string;
      desc: string;
      tech: string[];
      highlight: string;
    }[];
    verifiedStack: string;
    proofBadge: string;
    quote: string;
    detailDesc: string;
    highlights: string[];
  };
  caseStudy: {
    badge: string;
    unitTests: string;
    stackTitle: string;
    capabilitiesTitle: string;
    architectureTitle: string;
    architectureSub: string;
    verifiedArchitecture: string;
    securityTitle: string;
    securitySub: string;
    impactTitle: string;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterWeb: string;
    filterAndroid: string;
    filterAI: string;
    filterSecurity: string;
    viewCaseStudy: string;
    closeModal: string;
    flagship: string;
    emptyTitle: string;
    emptySubtitle: string;
    modalOverview: string;
    modalChallenge: string;
    modalSolution: string;
    modalPipeline: string;
    modalHighlights: string;
    modalStack: string;
    liveDemo: string;
    sourceCode: string;
  };
  engineering: {
    badge: string;
    title: string;
    subtitle: string;
    matrixBadge: string;
    skillsCountLabel: string;
    categories: {
      name: string;
      skills: { name: string; level: string; detail: string }[];
    }[];
  };
  education: {
    badge: string;
    title: string;
    subtitle: string;
    academicTitle: string;
    academicDegree: string;
    academicInstitution: string;
    academicDesc: string;
    academicHighlights: string[];
    marketingBadge: string;
    marketingCert: string;
    certsTitle: string;
    certList: {
      title: string;
      issuer: string;
      desc: string;
      badge: string;
    }[];
    marketingTitle: string;
    marketingDesc: string;
  };
  security: {
    badge: string;
    headline: string;
    subheadline: string;
    principleTitle: string;
    principleDesc: string;
    principles: string[];
    simulateLabel: string;
    simulatingLabel: string;
    auditBadge: string;
    flowTitle: string;
    flowSubtitle: string;
    progressLabel: string;
    flowSteps: {
      step: string;
      title: string;
      desc: string;
      status: string;
    }[];
  };
  process: {
    badge: string;
    title: string;
    subtitle: string;
    phase: string;
    verifiedMilestone: string;
    deliverableLabel: string;
    steps: {
      num: string;
      title: string;
      desc: string;
      deliverable: string;
    }[];
  };
  trust: {
    badge: string;
    title: string;
    subtitle: string;
    quote1: string;
    quote2: string;
    guaranteeDesc: string;
    platformsTitle: string;
    platforms: {
      name: string;
      role: string;
      badge: string;
      link: string;
    }[];
    githubHeadline: string;
    githubSub: string;
    engineeringBacking: string;
    postDeliverySupport: string;
    exploreRepos: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    scoperTitle: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    types: string[];
    budgets: string[];
    directContact: string;
    sendWhatsapp: string;
    sendEmail: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    phonePlaceholder: string;
    messageLabel: string;
    socialTitle: string;
    inquiryTitle: string;
    inquiryDesc: string;
    ctaWhatsapp: string;
    ctaTelegram: string;
    ctaCall: string;
    submitLabel: string;
    submittingLabel: string;
    submitError: string;
    rateLimit: string;
    whatsappInstant: string;
    telegramDirect: string;
    directCall: string;
    directEmail: string;
    availability: string;
    phoneAndWhatsapp: string;
    dockTitle: string;
  };
  footer: {
    rights: string;
    tagline: string;
    availability: string;
  };
}

export const translations: Record<Language, TranslationContent> = {
  en: {
    nav: {
      work: "Proof",
      proof: "Evidence",
      caseStudy: "Flagship",
      engineering: "Stack",
      education: "Profile",
      security: "Security",
      process: "Process",
      trust: "Commitment",
      contact: "Initiate",
      langBtn: "العربية",
      brandStatus: "FULL-STACK · SECURITY",
      home: "Home",
    },
    hero: {
      systemStatus: "PRODUCT ENGINEERING · OPEN FOR WORK",
      nameFirstName: "ALHASSAN",
      nameLastName: "MOHAMED",
      headline: "I BUILD COMPLETE DIGITAL PRODUCTS.",
      roles: ["WEB PLATFORMS", "ANDROID APPS", "AI SYSTEMS", "SECURITY ENGINEERING"],
      subheadline: "From architecture and database design to authentication, APIs, dashboards, payments, deployment, and security — I build products from the inside out.",
      ctaPrimary: "Explore Proof of Work",
      ctaSecondary: "Initiate Project",
      scrollHint: "SCROLL TO EXPLORE ARCHITECTURE",
      portraitLabel: "ALHASSAN MOHAMED",
      portraitSub: "The Engineer Behind The Systems",
      metaLat: "ZERO-TRUST SECURITY · 30.0444° N",
      capabilities: ["Web Platforms", "Android Native", "AI Pipelines", "Zero-Trust Security"],
      verifiedBadge: "VERIFIED",
      testsBadgeUnit: "TEST FILES",
      testsBadgeSub: "Automated Protection",
      whatsappLabel: "WhatsApp",
      callLabel: "Call Direct",
    },
    proof: {
      badge: "PROOF OF WORK",
      title: "BUILT, NOT CLAIMED.",
      subtitle: "Engineering maturity is measured by shipped output, robust codebases, and architectural resilience.",
      filters: [
        { id: "all", label: "All Evidence" },
        { id: "auth", label: "Web Systems (30+)" },
        { id: "android", label: "Android Suite" },
        { id: "security", label: "Zero-Trust Auth" }
      ],
      items: [
        {
          id: "projects",
          value: "30+",
          label: "Web & Digital Platforms",
          desc: "End-to-end applications built with modern frontend frameworks, scalable backends, and zero-trust security.",
          tech: ["React", "TypeScript", "Vite", "Node.js"],
          highlight: "Complete Production Web Systems"
        },
        {
          id: "velocity",
          value: "15+",
          label: "Projects Shipped (~2 Yrs)",
          desc: "Sustained high-velocity output delivering complex dashboards, client platforms, and educational portals.",
          tech: ["Tailwind CSS", "Clerk Auth", "Cloudflare Workers"],
          highlight: "Consistent Engineering Delivery"
        },
        {
          id: "android",
          value: "Native",
          label: "Android Product Suite",
          desc: "Purpose-built Android applications including Islamic utilities (Adhan, Azkar, Quran), Workout tracking, and Programming Education apps.",
          tech: ["Kotlin", "Android SDK", "Local Storage", "Material UI"],
          highlight: "Native Mobile Applications"
        },
        {
          id: "security",
          value: "Zero-Trust",
          label: "Security & Hardening",
          desc: "Architectural security controls, strict input validation schemas, role-based access, and authorization logic.",
          tech: ["JWT / Sessions", "Role RBAC", "API Validation"],
          highlight: "Protected Endpoint Logic"
        }
      ],
      verifiedStack: "KEY TECHNOLOGIES",
      proofBadge: "ARCHITECTURAL PROOF & CODE DISCIPLINE",
      quote: "Experience is demonstrated by output — not claims.",
      detailDesc: "Every project I deliver includes strict database migrations, schema boundary validations, server-side authorization guards, and regression testing.",
      highlights: ["30+ Shipped Apps", "Zero-Trust Validation", "500+ Passed Tests"]
    },
    caseStudy: {
      badge: "FEATURED PROJECT",
      unitTests: "67",
      stackTitle: "TECHNOLOGY STACK",
      capabilitiesTitle: "FEATURES & CAPABILITIES",
      architectureTitle: "SYSTEM ARCHITECTURE",
      architectureSub: "How the platform composes roles, services, and data into a single system",
      verifiedArchitecture: "VERIFIED ARCHITECTURE",
      securityTitle: "SECURITY ENGINEERING",
      securitySub: "Defense built into the architecture, not bolted on",
      impactTitle: "WHAT WAS BUILT",
    },
    projects: {
      badge: "PRODUCT PORTFOLIO",
      title: "SELECTED CASE STUDIES & SYSTEMS",
      subtitle: "Detailed breakdown of web applications, mobile products, AI workflows, and security implementations.",
      filterAll: "All Systems",
      filterWeb: "Web Platforms",
      filterAndroid: "Android Apps",
      filterAI: "AI Powered",
      filterSecurity: "Security Engineering",
      viewCaseStudy: "Inspect Case Study",
      closeModal: "Close Details",
      flagship: "FLAGSHIP",
      emptyTitle: "No projects in this category yet",
      emptySubtitle: "Switch to another category to explore the portfolio.",
      modalOverview: "OVERVIEW",
      modalChallenge: "THE CHALLENGE",
      modalSolution: "THE SOLUTION",
      modalPipeline: "HOW IT WORKS",
      modalHighlights: "ENGINEERING HIGHLIGHTS",
      modalStack: "TECHNOLOGY STACK",
      liveDemo: "View Live",
      sourceCode: "Source Code"
    },
    engineering: {
      badge: "TECHNICAL SKILLS",
      title: "SKILLS & TOOLS",
      subtitle: "A structured view of tools, technologies, databases, and infrastructure utilized across production environments.",
      matrixBadge: "USED IN PRODUCTION",
      skillsCountLabel: "{count} core engineering competencies",
      categories: [
        {
          name: "Frontend Systems",
          skills: [
            { name: "React", level: "Production", detail: "Component architecture, custom hooks, state management" },
            { name: "TypeScript", level: "Advanced", detail: "Strict type safety, generic interfaces, type narrowing" },
            { name: "Vite", level: "Advanced", detail: "Optimized build pipelines, bundle splitting, HMR" },
            { name: "Tailwind CSS", level: "Expert", detail: "Custom design systems, responsive typography, fluid grids" }
          ]
        },
        {
          name: "Backend & APIs",
          skills: [
            { name: "RESTful APIs", level: "Production", detail: "Clean endpoint design, versioning, status codes" },
            { name: "Node.js / Express", level: "Production", detail: "Server architecture, middleware stack, async pipelines" },
            { name: "Validation & Schema", level: "Advanced", detail: "Zod / Data sanitization, payload bounds verification" },
            { name: "Business Logic", level: "Production", detail: "Clean domain abstractions, decoupled service layers" }
          ]
        },
        {
          name: "Databases & Storage",
          skills: [
            { name: "PostgreSQL", level: "Production", detail: "Relational modeling, indexing, foreign keys, constraints" },
            { name: "Neon Serverless", level: "Production", detail: "Cloud Postgres management, branching workflows" },
            { name: "Prisma / SQL", level: "Advanced", detail: "Schema migrations, efficient queries, connection pooling" },
            { name: "Relational Design", level: "Advanced", detail: "Normalized tables, CASCADE rules, transactional integrity" }
          ]
        },
        {
          name: "Infrastructure & Security",
          skills: [
            { name: "Cloudflare Workers", level: "Production", detail: "Edge deployment, serverless handlers, cache headers" },
            { name: "Clerk Auth", level: "Production", detail: "JWT session handling, multi-factor auth, webhook sync" },
            { name: "Vercel / Git CI", level: "Production", detail: "Automated deployment triggers, environment configs" },
            { name: "Zero-Trust Security", level: "Core Mindset", detail: "Server-side enforcement, authorization guards, CORS" }
          ]
        }
      ]
    },
    education: {
      badge: "PROFESSIONAL BACKGROUND",
      title: "EDUCATION & CREDENTIALS",
      subtitle: "Computer engineering foundations coupled with continuous security and digital product training.",
      academicTitle: "Academic Foundation",
      academicDegree: "Computer Engineering Student",
      academicInstitution: "Faculty of Engineering · Computer & Systems Specialization",
      academicDesc: "Studying core computer engineering principles, data structures, algorithms, operating systems, networking, and software engineering architecture.",
      academicHighlights: ["Data Structures & Algorithms", "Systems Engineering", "Computer Networks"],
      marketingBadge: "PRODUCT & CONVERSION DISCOVERABILITY",
      marketingCert: "Google Digital Marketing Certified · Product SEO & UX Optimization",
      certsTitle: "Specialized Training & Certifications",
      certList: [
        {
          title: "Programming & Systems Engineering",
          issuer: "Verified Technical Training",
          desc: "Full-stack web architecture, modern frontend frameworks, RESTful API design, and asynchronous server workflows.",
          badge: "SOFTWARE ARCHITECTURE"
        },
        {
          title: "Database Architecture & Relational Modeling",
          issuer: "Database Engineering Course",
          desc: "Relational database design, PostgreSQL query optimization, transactions, foreign keys, and migration pipelines.",
          badge: "DATA SYSTEMS"
        },
        {
          title: "Security Training & Tooling",
          issuer: "Practical Security Course & Tooling",
          desc: "Security-aware software engineering, OWASP top 10 protection rules, and hands-on practice with Kali Linux security tools.",
          badge: "SECURITY AWARENESS"
        },
        {
          title: "English Language Certification",
          issuer: "Certified Language Proficiency",
          desc: "Professional technical communication, architectural documentation, and seamless collaboration with international clients.",
          badge: "COMMUNICATION"
        }
      ],
      marketingTitle: "Product Engineering & Conversion Value",
      marketingDesc: "Backed by Google Digital Marketing certifications, I build web platforms with a deep understanding of user experience, conversion paths, SEO optimization, and discoverability."
    },
    security: {
      badge: "SECURITY ARCHITECTURE",
      headline: "I DON'T TRUST THE CLIENT.",
      subheadline: "Security is built into the architecture from the first line of code, not added as a patch before launch.",
      principleTitle: "Zero-Trust Architecture Standard",
      principleDesc: "Every inbound HTTP request is treated as untrusted. Frontends only capture user intent; the server enforces identity, roles, validation schemas, and transactional boundary rules.",
      principles: ["Server-Side Enforcement", "Zero Client Trust", "RBAC Matrix", "Schema Validation"],
      simulateLabel: "RUN THE DEMO",
      simulatingLabel: "SIMULATING FLOW...",
      auditBadge: "ZERO-TRUST AUDIT",
      flowTitle: "HOW REQUESTS ARE PROTECTED",
      flowSubtitle: "Interactive simulation of a secure request passing through server-side verification layers.",
      progressLabel: "Request progress",
      flowSteps: [
        { step: "01", title: "Browser / Client", desc: "User triggers request with payload data", status: "Untrusted Input" },
        { step: "02", title: "Request Transport", desc: "TLS/HTTPS encryption in transit", status: "Encrypted Payload" },
        { step: "03", title: "Authentication", desc: "JWT token validation & active session check", status: "Identity Verified" },
        { step: "04", title: "Authorization", desc: "Role-based access matrix check (RBAC)", status: "Permission Granted" },
        { step: "05", title: "Input Validation", desc: "Strict schema sanitization & boundary checking", status: "Payload Sanitized" },
        { step: "06", title: "Business Logic", desc: "Domain rules execution & state verification", status: "Rules Executed" },
        { step: "07", title: "Database Layer", desc: "Parameterized SQL query execution", status: "Data Committed" }
      ]
    },
    process: {
      badge: "METHODOLOGY",
      title: "HOW I BUILD DIGITAL PRODUCTS",
      subtitle: "A systematic 7-phase engineering process designed for reliability, speed, and long-term codebase health.",
      phase: "PHASE",
      verifiedMilestone: "CHECKPOINT",
      deliverableLabel: "WHAT YOU GET",
      steps: [
        { num: "01", title: "Understand", desc: "Dissect business objectives, user requirements, technical constraints, and system specifications.", deliverable: "Technical Scope & Requirements" },
        { num: "02", title: "Architect", desc: "Design data models, API endpoint structures, security policies, and frontend state topology.", deliverable: "System Diagram & Schema Design" },
        { num: "03", title: "Build", desc: "Write type-safe frontend components, backend endpoints, database migrations, and clean integration logic.", deliverable: "Functional Prototype & APIs" },
        { num: "04", title: "Secure", desc: "Apply strict validation schemas, role checks, session timeouts, sanitization, and endpoint hardening.", deliverable: "Hardened Security Pipeline" },
        { num: "05", title: "Test", desc: "Execute automated unit suites, API contract validation, end-to-end browser flows, and edge-case testing.", deliverable: "Verified Test Suite (Vitest/Playwright)" },
        { num: "06", title: "Deploy", desc: "Configure production CDN edge nodes, environment variables, SSL certificates, and CI/CD pipelines.", deliverable: "Live Production Platform" },
        { num: "07", title: "Support", desc: "Monitor runtime performance, resolve post-launch questions, and support agreed project deliverables.", deliverable: "Post-Delivery Backing" }
      ]
    },
    trust: {
      badge: "RELIABILITY & STANDARDS",
      title: "I DON'T DISAPPEAR AFTER DELIVERY.",
      subtitle: "Engineering integrity means standing behind what is built.",
      quote1: "The project is delivered.",
      quote2: "The relationship isn't.",
      guaranteeDesc: "When a project is launched, I stand firmly behind the code delivered. Any issues related to agreed project scope are handled responsibly according to contract terms.",
      platformsTitle: "VERIFIED PROFILES",
      platforms: [
        { name: "Upwork", role: "Full-Stack & Android Developer", badge: "Verified Top Platform", link: "" },
        { name: "Khamsat", role: "Software Engineering Services", badge: "Verified Marketplace Provider", link: "" },
        { name: "Mostaql", role: "Web & Mobile Developer", badge: "Verified Freelance Engineer", link: "" },
        { name: "GitHub", role: "Engineering Repositories", badge: "Open Codebase & Contributions", link: "https://github.com/sm4603097-cmyk" }
      ],
      githubHeadline: "CODE IS PART OF THE PRODUCT.",
      githubSub: "Clean repository structures, commit history discipline, and maintainable codebase patterns.",
      engineeringBacking: "ENGINEERING BACKING",
      postDeliverySupport: "Responsible Post-Delivery Support",
      exploreRepos: "Explore Repositories"
    },
    contact: {
      badge: "START A CONVERSATION",
      title: "LET'S BUILD SOMETHING THAT EARNS ITS PLACE.",
      subtitle: "Direct access to WhatsApp, phone calls, Telegram, and social channels.",
      scoperTitle: "QUICK PROJECT BRIEF",
      step1Title: "1. What are you building?",
      step2Title: "2. Estimated Timeline?",
      step3Title: "3. Direct Contact Details",
      types: ["Web Application", "Android Mobile App", "AI Integration", "Security Hardening / Audit", "Full Digital Product"],
      budgets: ["1-2 Weeks", "3-4 Weeks", "1-2 Months", "Ongoing Support"],
      directContact: "DIRECT CONTACT & CALL CHANNELS",
      sendWhatsapp: "WhatsApp Direct: 01070471954",
      sendEmail: "Send Direct Email",
      nameLabel: "Your Name",
      emailLabel: "Your Email",
      phoneLabel: "Phone Number",
      phonePlaceholder: "Example: +20 1XX XXX XXXX",
      messageLabel: "Project Brief / Details",
      socialTitle: "CONNECT ACROSS PLATFORMS",
      inquiryTitle: "REQUEST READY",
      inquiryDesc: "Click below to instantly launch your preferred chat or direct line.",
      ctaWhatsapp: "WhatsApp",
      ctaTelegram: "Telegram",
      ctaCall: "Direct Call",
      submitLabel: "Send Message",
      submittingLabel: "Sending...",
      submitError: "Something went wrong. Please try again.",
      rateLimit: "Too many messages sent. Please try again later.",
      whatsappInstant: "WhatsApp Instant",
      telegramDirect: "Telegram Direct",
      directCall: "Direct Phone Call",
      directEmail: "Direct Email",
      availability: "Status: Available for production projects",
      phoneAndWhatsapp: "Direct Phone & WhatsApp: +20 107 047 1954",
      dockTitle: "Direct Channels"
    },
    footer: {
      rights: "ALHASSAN MOHAMED. All Rights Reserved.",
      tagline: "Full-Stack Web Developer · Android Developer · AI & Security",
      availability: "Available for new production projects"
    }
  },
  ar: {
    nav: {
      work: "إثبات العمل",
      proof: "الأدلة",
      caseStudy: "المشروع الرئيسي",
      engineering: "التقنيات",
      education: "الملف المهني",
      security: "الأمان",
      process: "منهجية العمل",
      trust: "الالتزام",
      contact: "تواصل معي",
      langBtn: "English",
      brandStatus: "مطور متكامل · هندسة الأمان",
      home: "الرئيسية",
    },
    hero: {
      systemStatus: "هندسة المنتجات · متاح للعمل",
      nameFirstName: "الحسن",
      nameLastName: "محمد",
      headline: "أنا أبني منتجات رقمية متكاملة.",
      roles: ["منصات الويب", "تطبيقات أندرويد", "أنظمة الذكاء الاصطناعي", "هندسة الأمان وحماية البيانات"],
      subheadline: "من بنية النظام وقواعد البيانات إلى تسجيل الدخول وواجهات الـAPI ولوحات التحكم والدفع والأمان والنشر — أبني المنتج من الفكرة حتى التشغيل الفعلي.",
      ctaPrimary: "استكشف إثبات العمل",
      ctaSecondary: "بدء مشروع جديد",
      scrollHint: "مرر لاستكشاف بنية الأنظمة",
      portraitLabel: "الحسن محمد",
      portraitSub: "المهندس خلف الأنظمة",
      metaLat: "أمان \u2066ZERO-TRUST\u2069 · الإحداثيات: \u206630.0444° N\u2069",
      capabilities: ["منصات الويب", "تطبيقات أندرويد", "أنظمة الذكاء الاصطناعي", "أمان Zero-Trust"],
      verifiedBadge: "تم التحقق",
      testsBadgeUnit: "ملف اختبار",
      testsBadgeSub: "حماية آلية",
      whatsappLabel: "واتساب",
      callLabel: "اتصال فوري",
    },
    proof: {
      badge: "إثبات العمل",
      title: "مبني بالأدلة، وليس مجرد ادعاءات.",
      subtitle: "النضج الهندسي يُقاس بالمنتجات التي تم إطلاقها فعلياً وجودة الكود وبنية النظام القوية.",
      filters: [
        { id: "all", label: "جميع الأدلة" },
        { id: "auth", label: "أنظمة الويب (30+)" },
        { id: "android", label: "تطبيقات أندرويد" },
        { id: "security", label: "مصادقة Zero-Trust" }
      ],
      items: [
        {
          id: "projects",
          value: "+30",
          label: "مشروع ومنصة رقمية",
          desc: "تطبيقات متكاملة تم بناؤها باستخدام أحدث أطر العمل، مع بنيات خلفية قابلة للتوسع وأمان كامل.",
          tech: ["React", "TypeScript", "Vite", "Node.js"],
          highlight: "أنظمة ويب فعلية بالإنتاج"
        },
        {
          id: "velocity",
          value: "+15",
          label: "مشروع خلال السنتين الأخيرة",
          desc: "إنتاجية عالية في تسليم لوحات تحكم معقدة ومنصات تعليمية وبوابات عملاء بانتظام.",
          tech: ["Tailwind CSS", "Clerk Auth", "Cloudflare Workers"],
          highlight: "تسليم برمجي متواصل"
        },
        {
          id: "android",
          value: "Native",
          label: "مجموعة تطبيقات أندرويد",
          desc: "تطبيقات أندرويد مخصصة تشمل التطبيقات الإسلامية (الأذان، الأذكار، القرآن)، وتطبيقات اللياقة البدنية والتعليم البرمجي.",
          tech: ["Kotlin", "Android SDK", "Local Storage", "Material UI"],
          highlight: "تطبيقات أندرويد أصيلة"
        },
        {
          id: "security",
          value: "Zero-Trust",
          label: "الأمان وحماية البيانات",
          desc: "أنظمة أمان معمارية، التحقق الصارم من مدخلات المستخدم، وإدارة الصلاحيات على مستوى الخادم.",
          tech: ["JWT / Sessions", "Role RBAC", "API Validation"],
          highlight: "حماية كاملة لنقاط الاتصال"
        }
      ],
      verifiedStack: "التقنيات الأساسية",
      proofBadge: "دليل معماري وانضباط في الكود",
      quote: "الخبرة تُبدى بالمخرجات، لا بالادعاءات.",
      detailDesc: "كل مشروع أسلّمه يتضمن ترحيلاً صارماً لقواعد البيانات، تحققاً من حدود المخططات، طبقات حماية على الخادم، واختبارات تراجع كاملة.",
      highlights: ["أكثر من 30 تطبيقاً تم إطلاقها", "تحقق وفق أسلوب Zero-Trust", "أكثر من 500 اختبار ناجح"]
    },
    caseStudy: {
      badge: "مشروع مميز",
      unitTests: "67",
      stackTitle: "التقنيات المستخدمة",
      capabilitiesTitle: "الإمكانات والقدرات",
      architectureTitle: "بنية النظام",
      architectureSub: "كيف يدمج النظام الأدوار والخدمات وقاعدة البيانات في منظومة واحدة",
      verifiedArchitecture: "بنية مؤكدة",
      securityTitle: "هندسة الأمان",
      securitySub: "حماية مبنية داخل البنية المعمارية، وليست إضافات لاحقة",
      impactTitle: "ما تم إنجازه",
    },
    projects: {
      badge: "معرض المنتجات",
      title: "أبرز المشاريع والأنظمة المنفذة",
      subtitle: "استعراض تفصيلي لتطبيقات الويب، تطبيقات الهاتف، حلول الذكاء الاصطناعي، والهندسة الأمنية.",
      filterAll: "جميع الأنظمة",
      filterWeb: "منصات الويب",
      filterAndroid: "تطبيقات أندرويد",
      filterAI: "الذكاء الاصطناعي",
      filterSecurity: "الهندسة الأمنية",
      viewCaseStudy: "فحص تفاصيل المشروع",
      closeModal: "إغلاق التفاصيل",
      flagship: "المشروع الرئيسي",
      emptyTitle: "لا توجد مشاريع في هذا التصنيف بعد",
      emptySubtitle: "اختر تصنيفاً آخر لاستكشاف المعرض.",
      modalOverview: "نظرة عامة",
      modalChallenge: "التحدي",
      modalSolution: "الحل",
      modalPipeline: "كيف يعمل النظام",
      modalHighlights: "أبرز النقاط الهندسية",
      modalStack: "التقنيات المستخدمة",
      liveDemo: "معاينة مباشرة",
      sourceCode: "الكود المصدري"
    },
    engineering: {
      badge: "المهارات التقنية",
      title: "المهارات والأدوات",
      subtitle: "عرض منظم للأدوات، التقنيات، قواعد البيانات، والبنية التحتية المستخدمة في بيئات الإنتاج الحقيقية.",
      matrixBadge: "مستخدمة في الإنتاج",
      skillsCountLabel: "إجمالي الكفاءات الهندسية: {count}",
      categories: [
        {
          name: "واجهات المستخدم Frontend",
          skills: [
            { name: "React", level: "بيئة إنتاج", detail: "بناء المكونات، الخطافات المخصصة Custom Hooks، وإدارة الحالة" },
            { name: "TypeScript", level: "متقدم", detail: "أمان كامل للأنواع Type safety والواجهات المتقدمة Interfaces" },
            { name: "Vite", level: "متقدم", detail: "تحسين عمليات البناء Bundling والتحديث الفوري HMR" },
            { name: "Tailwind CSS", level: "خبير", detail: "أنظمة تصميم مخصصة، شبكات مرنة وتصميم متجاوب" }
          ]
        },
        {
          name: "الخلفية وواجهات الـ API",
          skills: [
            { name: "RESTful APIs", level: "بيئة إنتاج", detail: "تصميم نقاط الاتصال، الإصدارات، وإدارات الاستجابة" },
            { name: "Node.js / Express", level: "بيئة إنتاج", detail: "بناء الخوادم، الطبقات الوسيطة Middleware، والمعالجة غير المتزامنة" },
            { name: "التحقق والمخططات Schema", level: "متقدم", detail: "تنقية البيانات وتدقيق الحدود عبر Zod schemas" },
            { name: "منطق الأعمال Business Logic", level: "بيئة إنتاج", detail: "فصل طبقات الخدمة ونمذجة النطاق بشكل مستقل" }
          ]
        },
        {
          name: "قواعد البيانات والتخزين",
          skills: [
            { name: "PostgreSQL", level: "بيئة إنتاج", detail: "النمذجة العلاقية، المفاتيح الأجنبية Foreign Keys، والروابط" },
            { name: "Neon Serverless", level: "بيئة إنتاج", detail: "إدارة قاعدة بيانات سحابية ومعالجة الفروع Branching" },
            { name: "Prisma / SQL", level: "متقدم", detail: "ترحيل المخططات Migrations، الاستعلامات المحسنة، وتجميع الاتصالات" },
            { name: "التصميم العلاقاتي", level: "متقدم", detail: "جداول منتظمة، قواعد التسلسل CASCADE، وسلامة المعاملات" }
          ]
        },
        {
          name: "البنية التحتية والأمان",
          skills: [
            { name: "Cloudflare Workers", level: "بيئة إنتاج", detail: "النشر على الـ Edge، المعالجات بدون خادم Serverless" },
            { name: "Clerk Auth", level: "بيئة إنتاج", detail: "إدارة جلسات JWT، المصادقة المتعددة، ومزامنة Webhooks" },
            { name: "Vercel / Git CI", level: "بيئة إنتاج", detail: "مسارات النشر التلقائية وإعدادات البيئات المختلفة" },
            { name: "أمان Zero-Trust", level: "منهجية أساسية", detail: "فرض الحماية على الخادم، قيود الصلاحيات، وإعدادات CORS" }
          ]
        }
      ]
    },
    education: {
      badge: "الخلفية المهنية والأكاديمية",
      title: "التعليم والاعتمادات البرمجية",
      subtitle: "أسس هندسة الحاسب المدمجة بالتطوير المستمر في مجالات الأمان، قواعد البيانات، وبناء المنتجات الرقمية.",
      academicTitle: "الأساس الأكاديمي",
      academicDegree: "طالب بهندسة الحاسبات والبرمجيات",
      academicInstitution: "كلية الهندسة · تخصص هندسة الحاسبات والأنظمة",
      academicDesc: "دراسة متعمقة لأساسيات هندسة الكمبيوتر، هياكل البيانات Data Structures، الخوارزميات، أنظمة التشغيل، الشبكات، وهندسة البرمجيات.",
      academicHighlights: ["هياكل البيانات والخوارزميات", "هندسة النظم", "شبكات الحاسوب"],
      marketingBadge: "قيمة المنتج وزيادة التحويل",
      marketingCert: "شهادة Google في التسويق الرقمي · تحسين SEO وتجربة المستخدم",
      certsTitle: "التدريب التخصصي والشهادات",
      certList: [
        {
          title: "هندسة وتطوير البرمجيات المتكاملة",
          issuer: "تدريب تقني متقدم",
          desc: "بناء تطبيقات الويب الكاملة، أطر العمل الحديثة، تصميم واجهات الـ API، والعمليات غير المتزامنة Asynchronous Workflows.",
          badge: "SOFTWARE ARCHITECTURE"
        },
        {
          title: "بنية قواعد البيانات والنمذجة العلاقية",
          issuer: "كورسات هندسة قواعد البيانات",
          desc: "تصميم قواعد البيانات العلاقية، تحسين استعلامات PostgreSQL، المعاملات Transactions، والمفاتيح الأجنبية Foreign Keys.",
          badge: "DATA SYSTEMS"
        },
        {
          title: "التدريب الأمني وأدوات الحماية",
          issuer: "تأمين البرمجيات واستخدام Kali Linux",
          desc: "هندسة البرمجيات بمراعاة معايير الأمان، تطبيق قواعد الحماية من ثغرات OWASP Top 10، واستخدام أدوات Kali Linux الأمنية.",
          badge: "SECURITY AWARENESS"
        },
        {
          title: "شهادة إتقان اللغة الإنجليزية",
          issuer: "اعتماد التواصل المهني",
          desc: "التواصل التقني المهني، كتابة وثائق البنية التحتية، والتواصل السلس مع العملاء والشركات الناشئة.",
          badge: "COMMUNICATION"
        }
      ],
      marketingTitle: "قيمة التسويق الرقمي وتجربة المستخدم",
      marketingDesc: "مدعوماً بشهادات Google في التسويق الرقمي، أبني منصات الويب بفهم عميق لمسارات تحويل الزوار (Conversion)، تحسين محركات البحث SEO، وسهولة الوصول."
    },
    security: {
      badge: "الهندسة الأمنية",
      headline: "أنا لا أثق في العميل.",
      subheadline: "الأمان هو جزء من بنية النظام منذ أول سطر كود، وليس مجرد رقعة تُضاف قبل الإطلاق.",
      principleTitle: "معيار الثقة المعدومة Zero-Trust",
      principleDesc: "كل طلب HTTP قادم يُعامل كطلب غير موثوق. الواجهة الأمامية تلتقط رغبة المستخدم فقط، بينما يتولى الخادم التحقق من الهوية، الصلاحيات، المخططات، وحدود المعاملات.",
      principles: ["فرض الحماية على الخادم", "عدم الثقة في العميل", "مصفوفة الصلاحيات RBAC", "تدقيق المخططات"],
      simulateLabel: "شغّل العرض التوضيحي",
      simulatingLabel: "جارٍ المحاكاة...",
      auditBadge: "تدقيق Zero-Trust",
      flowTitle: "كيف تُحمى الطلبات",
      flowSubtitle: "محاكاة تفاعلية لطلب آمن يمر عبر طبقات التحقق على الخادم.",
      progressLabel: "تقدم الطلب",
      flowSteps: [
        { step: "01", title: "المتصفح / العميل", desc: "المستخدم يرسل الطلب والبيانات", status: "مدخلات غير موثوقة" },
        { step: "02", title: "نقل البيانات", desc: "تشفير TLS/HTTPS أثناء النقل", status: "حمولة مشفرة" },
        { step: "03", title: "المصادقة (Auth)", desc: "التحقق من رمز JWT والجلسة النشطة", status: "تم التحقق من الهوية" },
        { step: "04", title: "الصلاحيات (Authorization)", desc: "فحص جدول الصلاحيات حسب الدور RBAC", status: "تم منح الإذن" },
        { step: "05", title: "تدقيق المدخلات", desc: "تنقية البيانات وتدقيق المخططات الصارمة", status: "بيانات منقاة ومفحوصة" },
        { step: "06", title: "منطق الأعمال", desc: "تنفيذ قواعد النظام والتحقق من الحالة", status: "تم تنفيذ القواعد" },
        { step: "07", title: "قاعدة البيانات", desc: "تنفيذ استعلام SQL المؤطَر المعزول", status: "تم حفظ البيانات بنجاح" }
      ]
    },
    process: {
      badge: "منهجية التطوير",
      title: "كيف أبني المنتجات الرقمية",
      subtitle: "منهجية هندسية من 7 مراحل مخصصة لضمان الاعتمادية، السرعة، ونقاء الكود على المدى الطويل.",
      phase: "المرحلة",
      verifiedMilestone: "نقطة مراجعة",
      deliverableLabel: "مخرجات هذه المرحلة",
      steps: [
        { num: "01", title: "الفهم والتحليل", desc: "تحليل الأهداف، متطلبات المستخدم، القيود التقنية، ومواصفات النظام.", deliverable: "وثيقة النطاق والمتطلبات" },
        { num: "02", title: "التصميم المعماري", desc: "تصميم نماذج البيانات، هيكلة نقاط الـ API، سياسات الأمان، وحالة الواجهات.", deliverable: "مخطط النظام وتصميم البيانات" },
        { num: "03", title: "البناء والتطوير", desc: "كتابة واجهات آمنة الأنواع، نقاط اتصال الخادم، ترحيل البيانات، والربط البرمجي.", deliverable: "النموذج الأولي والـ APIs" },
        { num: "04", title: "التأمين والحماية", desc: "تطبيق مخططات التدقيق الصارمة، فحص الصلاحيات، إعدادات الجلسات، وحماية الخادم.", deliverable: "منظومة الأمان المحصنة" },
        { num: "05", title: "الاختبار الشامل", desc: "تنفيذ وحدات الاختبار الآلية، تدقيق الـ API، اختبار المتصفح الشامل E2E، والحالات الخاصة.", deliverable: "مجموعة الاختبارات المعتمدة (Vitest/Playwright)" },
        { num: "06", title: "النشر والتشغيل", desc: "إعداد شبكة الـ CDN، متغيرات البيئة، شهادات الأمان SSL، ومسارات الـ CI/CD.", deliverable: "المنصة الحية ببيئة الإنتاج" },
        { num: "07", title: "الدعم والمتابعة", desc: "مراقبة الأداء، الإجابة عن التساؤلات بعد الإطلاق، ودعم مخرجات المشروع المتفق عليها.", deliverable: "التزام كامل بمخرجات التسليم" }
      ]
    },
    trust: {
      badge: "الاعتمادية والالتزام",
      title: "أنا لا أختفي بعد التسليم.",
      subtitle: "النزاهة الهندسية تعني الوقوف بثبات خلف ما تم بناؤه.",
      quote1: "تسليم المشروع هو البداية.",
      quote2: "والعلاقة المهنية مستمرة.",
      guaranteeDesc: "عند إطلاق المشروع، أقف تماماً خلف الكود والمخرجات التي تم تسليمها. أي استفسارات أو ملاحظات تتعلق بنطاق العمل المتفق عليه تُعالج بمسؤولية تامة وفقاً للشروط.",
      platformsTitle: "حساباتي المعتمدة",
      platforms: [
        { name: "Upwork", role: "مطوِّر متكامل وأندرويد Full-Stack", badge: "منصة عالمية معتمدة", link: "" },
        { name: "خمسات Khamsat", role: "خدمات الهندسة والبرمجيات", badge: "بائع خدمات معتمد", link: "" },
        { name: "مستقل Mostaql", role: "مطور تطبيقات ويب وهاتف", badge: "مهندس مستقل معتمد", link: "" },
        { name: "GitHub", role: "مستودعات البرمجة والمشاريع", badge: "كود مفتوح ومساهمات فعلية", link: "https://github.com/sm4603097-cmyk" }
      ],
      githubHeadline: "الكود هو جزء أساسي من المنتج.",
      githubSub: "هيكلة مستودعات ناعمة، انضباط في سجل التغييرات Commits، وأنظمة قابلة للصيانة.",
      engineeringBacking: "ضمان هندسي",
      postDeliverySupport: "دعم مسؤول بعد التسليم",
      exploreRepos: "استكشف المستودعات"
    },
    contact: {
      badge: "تواصل مباشر",
      title: "دعنا نبني شيئاً يستحق مكانته.",
      subtitle: "تواصل مباشر عبر الواتساب، المكالمات الهاتفية، التليجرام، ومنصات التواصل الاجتماعي.",
      scoperTitle: "موجز مشروع سريع",
      step1Title: "1. ما الذي تريد بناؤه؟",
      step2Title: "2. الجدول الزمني المتوقع؟",
      step3Title: "3. بيانات التواصل المباشر",
      types: ["تطبيق ويب متكامل", "تطبيق أندرويد", "دمج حلول الذكاء الاصطناعي", "فحص وتأمين الأمان", "منتج رقمي شامل"],
      budgets: ["أسبوع إلى أسبوعين", "3 إلى 4 أسابيع", "شهر إلى شهرين", "دعم واستشارات مستمرة"],
      directContact: "قنوات التواصل والمكالمات المباشرة",
      sendWhatsapp: "واتساب مباشر: 01070471954",
      sendEmail: "إرسال بريد إلكتروني مباشر",
      nameLabel: "الاسم الكريم",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف",
      phonePlaceholder: "مثال: +20 1XX XXX XXXX",
      messageLabel: "ملخص المشروع أو التفاصيل",
      socialTitle: "تواصل معي عبر المنصات الاجتماعية",
      inquiryTitle: "طلبك جاهز",
      inquiryDesc: "اضغط بالأسفل لإطلاق قناة الدردشة أو الاتصال المباشر المفضلة لديك فوراً.",
      ctaWhatsapp: "واتساب",
      ctaTelegram: "تليجرام",
      ctaCall: "اتصال مباشر",
      submitLabel: "إرسال الرسالة",
      submittingLabel: "جارٍ الإرسال...",
      submitError: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      rateLimit: "تم إرسال عدد كبير جداً من الرسائل. يرجى المحاولة لاحقاً.",
      whatsappInstant: "واتساب فوري",
      telegramDirect: "تليجرام مباشر",
      directCall: "اتصال هاتفي مباشر",
      directEmail: "بريد إلكتروني مباشر",
      availability: "الحالة: متاح لمشاريع الإنتاج الجديدة",
      phoneAndWhatsapp: "الهاتف والواتساب المباشر: +20 107 047 1954",
      dockTitle: "تواصل فوري ومباشر"
    },
    footer: {
      rights: "الحسن محمد — جميع الحقوق محفوظة.",
      tagline: "مطور ويب متكامل · مطور أندرويد · أنظمة ذكاء اصطناعي وأمان",
      availability: "متاح لمشاريع الإنتاج الجديدة"
    }
  }
};