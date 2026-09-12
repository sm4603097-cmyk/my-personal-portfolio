import type { ProjectCategory } from './projectCategories';

/**
 * Icon identifiers used by the flagship case study. Mapped to lucide-react
 * components inside the presentation layer so the data stays UI-independent.
 */
export type CaseStudyIcon =
  | 'Database'
  | 'GitBranch'
  | 'Users'
  | 'FileCheck2'
  | 'BookOpen'
  | 'LayoutDashboard'
  | 'Code2';

export interface Project {
  id: string;
  category: ProjectCategory;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  descEn: string;
  descAr: string;
  tech: string[];
  metricsEn?: string;
  metricsAr?: string;
  isFlagship?: boolean;
  architectureEn?: string[];
  architectureAr?: string[];
  problemEn?: string;
  problemAr?: string;
  solutionEn?: string;
  solutionAr?: string;
  featuresEn?: string[];
  featuresAr?: string[];
  imagePath?: string;
  githubUrl?: string;
  liveUrl?: string;
  /** Verified figures rendered as animated counters in the flagship case study. */
  statsEn?: { value: number; label: string; icon?: CaseStudyIcon }[];
  statsAr?: { value: number; label: string; icon?: CaseStudyIcon }[];
  /** Grouped capability matrix (Learning / Platform / Engineering …). */
  capabilitiesEn?: { title: string; icon?: CaseStudyIcon; items: string[] }[];
  capabilitiesAr?: { title: string; icon?: CaseStudyIcon; items: string[] }[];
  /** Evidence-oriented security engineering highlights. */
  securityEn?: string[];
  securityAr?: string[];
  /** Closing impact statement. */
  impactEn?: string;
  impactAr?: string;
}

export const projectsData: Project[] = [
  {
    id: "quran-learning-platform",
    category: "web",
    isFlagship: true,
    titleEn: "Quran Learning Platform",
    titleAr: "منصة تعلّم القرآن الكريم",
    subtitleEn: "Production-grade Quran memorization, revision & Tajweed learning — bilingual, multi-role, RTL-native.",
    subtitleAr: "منصة تعليمية متكاملة للحفظ والمراجعة والتجويد، ثنائية اللغة، متعددة الأدوار، مصممة للعربية بالكامل.",
    descEn: "A complete Quran academy operating online — memorization, revision, reading and Tajweed programs with lesson scheduling, homework and reports — across dedicated portals for students, parents, teachers and administrators.",
    descAr: "أكاديمية قرآن كاملة تعمل عبر الإنترنت — برامج الحفظ والمراجعة والقراءة والتجويد مع جدولة الدروس والواجبات والتقارير — عبر بوابات مخصصة للطلاب وأولياء الأمور والمعلمين والإدارة.",
    tech: ["Next.js App Router", "React", "TypeScript", "Prisma ORM", "PostgreSQL", "Clerk Auth", "Stripe", "Resend", "Zod", "next-intl", "Tailwind CSS", "Vitest", "Docker", "Vercel"],
    metricsEn: "35 Database Models · 17 Migrations · 6 Roles · 67 Vitest Test Files",
    metricsAr: "35 نموذجاً لقاعدة البيانات · 17 ترحيلاً · 6 أدوار · 67 ملف اختبار Vitest",
    architectureEn: [
      "Student · Teacher · Parent · Admin",
      "Clerk Authentication",
      "Role-Based Authorization",
      "Core Services (Enrollment · Lessons · Progress)",
      "PostgreSQL Database",
      "Payments · Notifications · Reports",
    ],
    architectureAr: [
      "الطالب · المعلم · ولي الأمر · الإدارة",
      "مصادقة Clerk",
      "التحقق من الصلاحيات حسب الدور",
      "الخدمات الأساسية (التسجيل · الدروس · التقدم)",
      "قاعدة بيانات PostgreSQL",
      "الدفع · الإشعارات · التقارير",
    ],
    problemEn: "Quran programs — memorization, revision and Tajweed — carry deep domain rules: page, surah and juz boundaries, mistake types, per-lesson sessions and multi-role workflows that generic education tools do not model natively.",
    problemAr: "برامج القرآن الكريم — الحفظ والمراجعة والتجويد — تحمل قواعد مجال دقيقة مثل حدود الصفحات والسور والجزء، أنواع الأخطاء، جلسات الدروس، ومسارات العمل متعددة الأدوار التي لا توفرها أدوات التعليم العامة.",
    solutionEn: "Engineered a domain-native data model (35 Prisma models across 17 migrations) with role-based portals, a fully Arabic-RTL bilingual interface, subscription and enrollment workflows, and a hardened API layer.",
    solutionAr: "تم بناء نموذج بيانات متخصص (35 نموذجاً عبر 17 ترحيلاً) مع بوابات تحكم حسب الأدوار، واجهة ثنائية اللغة داعمة للعربية RTL بالكامل، مسارات اشتراك وتسجيل، وطبقة حماية صارمة للواجهات.",
    featuresEn: [
      "Role-based portals for students, parents, teachers and administrators",
      "Bilingual interface: full Arabic (RTL) and English",
      "Memorization, revision, Tajweed and Ijazah program workflows",
      "Subscription plans with admin-reviewed enrollment and activation codes",
      "Lesson scheduling, attendance, homework and lesson reports",
      "Notifications, in-app messaging and parent progress reports",
    ],
    featuresAr: [
      "بوابات مخصصة للطلاب وأولياء الأمور والمعلمين والإدارة",
      "واجهة ثنائية اللغة: عربية كاملة (RTL) وإنجليزية",
      "مسارات عمل للحفظ والمراجعة والتجويد والإجازة",
      "خطط اشتراك مع تسجيل يُراجع إدارياً ورموز تفعيل",
      "جدولة الدروس والحضور والواجبات وتقارير الدروس",
      "إشعارات ورسائل داخلية وتقارير تقدم لأولياء الأمور",
    ],
    statsEn: [
      { value: 35, label: "Database Models", icon: "Database" },
      { value: 17, label: "Schema Migrations", icon: "GitBranch" },
      { value: 6, label: "Roles & Portals", icon: "Users" },
      { value: 67, label: "Vitest Test Files", icon: "FileCheck2" },
    ],
    statsAr: [
      { value: 35, label: "نموذج قاعدة بيانات", icon: "Database" },
      { value: 17, label: "ترحيلات المخطط", icon: "GitBranch" },
      { value: 6, label: "أدوار ولوحات تحكم", icon: "Users" },
      { value: 67, label: "ملفات اختبار Vitest", icon: "FileCheck2" },
    ],
    capabilitiesEn: [
      {
        title: "Learning",
        icon: "BookOpen",
        items: [
          "Memorization, revision, reading & Tajweed programs",
          "Page → ayah → surah → juz progress tracking",
          "Mistake logging (Tajweed, pronunciation, memory)",
          "Ijazah tracks & auto-generated completion certificates",
        ],
      },
      {
        title: "Platform",
        icon: "LayoutDashboard",
        items: [
          "Dedicated admin, teacher, student & parent portals",
          "Clerk authentication with webhook-synced users",
          "Subscriptions, plans, enrollment & activation codes",
          "Lessons, attendance, homework, reports & notifications",
        ],
      },
      {
        title: "Engineering",
        icon: "Code2",
        items: [
          "35-model Prisma + PostgreSQL schema, 17 migrations",
          "Server actions + REST APIs with rate limiting",
          "Server-side validation (Zod) & sanitized content",
          "Full Arabic RTL + English localization",
        ],
      },
    ],
    capabilitiesAr: [
      {
        title: "التعلم",
        icon: "BookOpen",
        items: [
          "برامج الحفظ والمراجعة والقراءة والتجويد",
          "تتبع التقدم من الصفحة إلى الآية والسورة والجزء",
          "تسجيل الأخطاء (تجويد، نطق، حفظ)",
          "مسارات الإجازة وشهادات إتمام تُولَّد تلقائياً",
        ],
      },
      {
        title: "المنصة",
        icon: "LayoutDashboard",
        items: [
          "بوابات مخصصة: إدارة، معلم، طالب، ولي أمر",
          "مصادقة Clerk مع مزامنة المستخدمين عبر الـ Webhooks",
          "اشتراكات وخطط وتسجيل برموز تفعيل",
          "دروس وحضور وواجبات وتقارير وإشعارات",
        ],
      },
      {
        title: "الهندسة",
        icon: "Code2",
        items: [
          "مخطط Prisma و PostgreSQL بـ 35 نموذجاً و17 ترحيلاً",
          "Server Actions و REST APIs مع تقييد معدل الطلبات",
          "تحقق من البيانات على الخادم (Zod) وتنقية المحتوى",
          "دعم كامل للعربية RTL والإنجليزية",
        ],
      },
    ],
    securityEn: [
      "Role-based access control on protected routes & server actions",
      "Clerk authentication with secure session handling",
      "Server-side Zod validation & sanitized HTML rendering",
      "DB-backed rate limiting on API endpoints",
      "Audit-logged admin & sensitive actions",
      "Soft-delete tombstones for safe user/data removal",
    ],
    securityAr: [
      "إدارة صلاحيات حسب الدور على المسارات والإجراءات المحمية",
      "مصادقة Clerk مع إدارة جلسات آمنة",
      "تحقق Zod من جانب الخادم وتنقية ناتج HTML",
      "تقييد معدل الطلبات المدعوم بقاعدة البيانات للواجهات",
      "تسجيل الإجراءات الحساسة في سجل التدقيق Audit Log",
      "حذف ناعم (Soft Delete) للبيانات مع استبقاء الأثر",
    ],
    impactEn: "End-to-end engineering of a real academy's operational spine — enrollment, learning, payments and reporting — unified into one bilingual, multi-role, RTL-native system.",
    impactAr: "هندسة شاملة للعمود الفقري التشغيلي لأكاديمية حقيقية — التسجيل والتعلم والدفع والتقارير — في نظام واحد ثنائي اللغة متعدد الأدوار يدعم العربية بالكامل.",
  },
  {
    id: "al-fath-education",
    category: "web",
    titleEn: "Al-Fath Education",
    titleAr: "منصة الفتح التعليمية",
    subtitleEn: "From website to scalable educational web application",
    subtitleAr: "تحويل الموقع إلى تطبيق ويب تعليمي متكامل وقابل للتوسع",
    descEn: "A high-performance educational platform featuring RBAC authorization, automated assessment suites, student dashboard, and hardened security controls.",
    descAr: "منصة تعليمية متكاملة عالية الأداء تتميز بنظام إدارة الصلاحيات RBAC، مجموعات التقييم الآلية، لوحة تحكم الطلاب، وأنظمة الأمان المحصنة.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Clerk", "PostgreSQL", "Vitest", "Playwright", "Cloudflare Workers"],
    metricsEn: "441/441 Unit Tests Passed · 104/104 E2E Tests Passed",
    metricsAr: "441/441 اختبار وحدة بنجاح · 104/104 اختبار E2E بنجاح",
    architectureEn: ["React Frontend", "API Gateway", "Clerk Auth", "RBAC Authorization", "PostgreSQL DB", "Cloudflare Workers", "Production Deployment"],
    architectureAr: ["واجهة React", "بوابة API", "مصادقة Clerk", "صلاحيات RBAC", "قاعدة بيانات Postgres", "شبكة Cloudflare", "بيئة الإنتاج"],
    problemEn: "Legacy educational websites suffered from fragile session states, slow page loads, unauthorized access to paid modules, and lack of automated testing.",
    problemAr: "كانت المواقع التعليمية التقليدية تعاني من هشاشة إدارة الجلسات، بطء التحميل، الوصول غير المصرح للمحتوى المدفوع، وغياب الاختبارات الآلية.",
    solutionEn: "Engineered a robust SPA frontend coupled with Cloudflare Workers API layer, multi-role auth guards, and 500+ automated unit & E2E tests enforcing zero-regression deployments.",
    solutionAr: "تم بناء واجهة SPA متطورة مدمجة مع طبقة Cloudflare Workers، قيود صلاحيات متعددة الأدوار، وأكثر من 500 اختبار آلي لمنع أي خطأ برمجي عند النشر.",
    featuresEn: [
      "Role-Based Access Control (Admin, Instructor, Student)",
      "Secure payment & enrollment verification flows",
      "Interactive quiz engine with real-time score analytics",
      "Vitest unit protection (441/441) and Playwright E2E suites (104/104)"
    ],
    featuresAr: [
      "نظام إدارة الصلاحيات حسب الدور (مسؤول، معلم، طالب)",
      "مسارات تحقق آمنة للتسجيل والاشتراكات",
      "محرك اختبارات تفاعلي مع تحليل فوري للنتائج",
      "اختبارات وحدات Vitest (441/441) واختبارات متصفح Playwright (104/104)"
    ]
  },
  {
    id: "adhan-muslim-pro",
    category: "android",
    titleEn: "Adhan & Prayer Companion",
    titleAr: "تطبيق الأذان والمواقيت",
    subtitleEn: "High-precision Islamic prayer times & notification engine",
    subtitleAr: "محرك دقيق لمواقيت الصلاة والتنبيهات المخصصة",
    descEn: "Native Android application providing offline prayer time calculations, GPS location updates, custom audio adhan triggers, and Qibla direction visualizer.",
    descAr: "تطبيق أندرويد أصيل يدعم حساب مواقيت الصلاة بدون إنترنت، تحديث الموقع الجغرافي GPS، تنبيهات الأذان الصوتية، وتحديد اتجاه القبلة.",
    tech: ["Kotlin", "Android SDK", "Room DB", "Location Services", "Foreground Services"],
    metricsEn: "Offline Calculation Engine · Zero Background Battery Drain",
    metricsAr: "محرك حسابات يعمل بدون إنترنت · ترشيد ممتاز لاستهلاك البطارية",
    problemEn: "Many prayer apps rely constantly on active internet connections and drain battery through poor background service management.",
    problemAr: "تعتمد معظم تطبيقات المواقيت على الاتصال المستمر بالإنترنت وتستهلك البطارية بسبب الإدارة الضعيفة للخدمات في الخلفية.",
    solutionEn: "Implemented local astronomical algorithms in Kotlin with scheduled Android AlarmManager triggers, guaranteeing accuracy without network overhead.",
    solutionAr: "تم خوارزميات فلكية محددة محلياً بلغة Kotlin مع تنبيهات مؤطرة بـ AlarmManager لضمان الدقة بدون استهلاك للشبكة.",
    featuresEn: ["Offline astronomical calculation", "Customizable audio adhan notifications", "Qibla compass integration", "Dark theme editorial layout"],
    featuresAr: ["حساب فلكي دقيق بدون إنترنت", "تنبيهات أذان صوتية مخصصة", "بوصلة تحديد اتجاه القبلة", "تصميم داكن عصري مريح للعين"]
  },
  {
    id: "azkar-hisn-almuslim",
    category: "android",
    titleEn: "Hisn Al-Muslim & Azkar",
    titleAr: "تطبيق الأذكار وحصن المسلم",
    subtitleEn: "Distraction-free daily Remembrance & Counter app",
    subtitleAr: "تطبيق الأذكار اليومية المسبحة الرقمية بدون إعلانات",
    descEn: "Minimalist Android application designed for morning/evening Azkar, counter tracking, categorized supplications, and customized reading reminders.",
    descAr: "تطبيق أندرويد أنيق مخصص لأذكار الصباح والمساء، المسبحة الرقمية، الأدعية المبوّبة، وتنبيهات القراءة اليومية.",
    tech: ["Kotlin", "Jetpack Compose", "DataStore", "Material 3"],
    metricsEn: "Smooth 60fps Typography · Local State Persistence",
    metricsAr: "خطوط عربية عالية النقاء 60 إطار/ثانية · حفظ الحالة محلياً",
    problemEn: "Cluttered UIs and intrusive popups disrupt spiritual focus during supplication reading.",
    problemAr: "تسبب الواجهات المزدحمة والإعلانات المزعجة تشتيت الانتباه أثناء قراءة الأذكار.",
    solutionEn: "Created a modern Jetpack Compose interface with fluid typography scaling, subtle haptic feedback counter, and zero external trackers.",
    solutionAr: "تم تطوير واجهة حديثة بـ Jetpack Compose مع تحكم مرن بحجم الخطوط، مسبحة تفاعلية بالاهتزاز اللمسي، وبدون أي تتبع خارجي.",
    featuresEn: ["Morning & Evening categorizations", "Haptic digital counter", "Adjustable Arabic typography", "Night mode focus"],
    featuresAr: ["تبويب أذكار الصباح والمساء", "مسبحة رقمية مع اهتزاز لمسي", "تحكم كامل بنوع وحجم الخط العربي", "وضع ليلي مريح للعين"]
  },
  {
    id: "quran-kareem-app",
    category: "android",
    titleEn: "Noble Quran Reader",
    titleAr: "تطبيق القرآن الكريم",
    subtitleEn: "Elegant Holy Quran reading & audio recitation app",
    subtitleAr: "قراءة وتلاوة القرآن الكريم بأسلوب عصري راقٍ",
    descEn: "Full-featured Android Quran application featuring clear vector typography, bookmarking, tafseer reference, and offline reciter playback.",
    descAr: "تطبيق أندرويد شامِل للقرآن الكريم يتميز بصفحات متجهة عالية النقاء، العلامات المرجعية، كتاب التفسير، والتلاوات الصوتية.",
    tech: ["Kotlin", "Android Media3", "Room Database", "Vector Graphics"],
    metricsEn: "High-Resolution Render · Offline Audio Cache",
    metricsAr: "عرض عالي الدقة بدون تشويه · ذاكرة استماع بدون إنترنت",
    problemEn: "Text pixelation on varied screen sizes and choppy audio playback during offline listening.",
    problemAr: "تأثر دقة النص عند تغيير حجم الشاشة والتقطيع في تشغيل الصوتيات بدون إنترنت.",
    solutionEn: "Engineered scalable vector page rendering with Media3 background audio queuing and instant bookmark index persistence.",
    solutionAr: "تم بناء محرك عرض صفحات بالرسومات المتجهة مدمج مع مشغل صوتيات Media3 في الخلفية وحفظ فوري للعلامات.",
    featuresEn: ["High-clarity vector page rendering", "Interactive verse selection & Tafseer", "Audio reciter downloads", "Search by Surah or Juz"],
    featuresAr: ["عرض عالي النقاء للصفحات", "تحديد الآيات وعرض التفسير الفوري", "تحميل تلاوات القراء", "بحث سريع بالسورة أو الجزء"]
  },
  {
    id: "workout-nutrition-suite",
    category: "android",
    titleEn: "Sports & Nutrition Coach",
    titleAr: "تطبيق اللياقة والتغذية الرياضية",
    subtitleEn: "Workout logging, macro calculator & progress engine",
    subtitleAr: "تسجيل التمارين، حساب الماكروز، ومتابعة التطور البدني",
    descEn: "Comprehensive mobile solution for tracking fitness routines, customized macro-nutrient breakdown, exercise execution guides, and weekly physical progress analytics.",
    descAr: "تطبيق هاتف مخصص لمتابعة التمارين الرياضية، حساب السعرات والماكروز، دليل أداء التمارين، وتحليلات التطور الأسبوعي.",
    tech: ["Kotlin", "MPAndroidChart", "Room DB", "Coroutines"],
    metricsEn: "Real-time Charting · Dynamic Calorie Targets",
    metricsAr: "رسوم بيانية فورية · أهداف سعرات ديناميكية",
    problemEn: "Users lose track of progressive overload and macro intake due to complicated manual logs.",
    problemAr: "يفقد المستخدمون متابعة زيادة الأحمال والماكروز اليومية بسبب تعقيد إدخال البيانات في التطبيقات التقليدية.",
    solutionEn: "Built a swift 3-tap exercise logger with instant progression curves and automated macronutrient goal adjustments.",
    solutionAr: "تم تصميم واجهة إدخال سريعة بـ 3 لمسات مع منحنيات تقدم فورية وحساب تلقائي للماكروز حسب الهدف.",
    featuresEn: ["Progressive overload logs", "Interactive exercise guide library", "Macro nutrient calculation", "Progress visualization charts"],
    featuresAr: ["سجل متابعة زيادة الأحمال", "مكتبة تمارين تفاعلية بالشرح", "حساب السعرات والماكروز", "رسوم بيانية لتطور الجسم"]
  },
  {
    id: "programming-edu-app",
    category: "android",
    titleEn: "Programming Education Hub",
    titleAr: "منصة تعليم البرمجة للهاتف",
    subtitleEn: "Interactive coding lessons & syntax quizzes on mobile",
    subtitleAr: "دروس تفاعلية واختبارات كود برمجي على الهاتف",
    descEn: "Android education portal delivering bite-sized programming lessons, interactive code snippets, instant syntax quizzes, and learner progress badges.",
    descAr: "تطبيق أندرويد تعليمي يقدم دروس برمجة قصيرة، أمثلة كود تفاعلية، اختبارات كود فورية، وأوسمة إنجاز للطلاب.",
    tech: ["Kotlin", "Highlighter Engine", "JSON Parser", "SharedPreferences"],
    metricsEn: "Syntax Highlighted Code · Micro Learning Flow",
    metricsAr: "تظليل الكود البرمجي · مسار تعلم متدرج",
    problemEn: "Reading programming tutorials on mobile screens is often tedious due to poor code formatting and lack of interactive feedback.",
    problemAr: "قراءة شروحات البرمجة على الهاتف غالباً ما تكون مزعجة بسبب سوء تنسيق الكود وغياب التفاعل الفوري.",
    solutionEn: "Implemented dynamic syntax syntax highlighters with quiz validation components optimized for portrait phone screens.",
    solutionAr: "تم دمج محرك تظليل الكود مع مكونات اختباري تفاعلية مخصصة للعرض الشاقولي على الشاشات الذكية.",
    featuresEn: ["Code syntax highlighting", "Interactive multiple-choice & fill-in quizzes", "Trackable module progress", "Offline lesson caching"],
    featuresAr: ["تنسيق وتظليل الكود البرمجي", "اختبارات تفاعلية فورية الإجابة", "متابعة نسبة إنجاز المسارات", "حفظ الدروس للمطالعة بدون إنترنت"]
  },
  {
    id: "ai-code-agent-hub",
    category: "ai",
    titleEn: "AI Engineering Workflow Pipeline",
    titleAr: "منظومة تسريع التطوير بالذكاء الاصطناعي",
    subtitleEn: "AI-assisted engineering automation & intelligent agent integration",
    subtitleAr: "أتمتة التطوير بمساعدة وكلاء الذكاء الاصطناعي واستدعاء الـ APIs",
    descEn: "Integration of modern LLM APIs and autonomous AI coding agents to accelerate architecture research, code refactoring, schema generation, and test suite synthesis.",
    descAr: "دمج واجهات الـ LLM ووكلاء البرمجة الأوتوماتيكية لتسريع أبحاث المعمارية، إعادة بناء الكود، إنشاء المخططات، وأتمتة كتابة الاختبارات.",
    tech: ["OpenAI API", "Anthropic Claude API", "Python Scripts", "Prompt Pipelines", "TypeScript Automation"],
    metricsEn: "10x Engineering Velocity · High-Precision Code Validation",
    metricsAr: "مضاعفة سرعة التطوير 10 مرات · تدقيق الكود بدقة عالية",
    problemEn: "Repetitive boilerplate generation and manual test scenario writing consume valuable engineering time.",
    problemAr: "تستهلك كتابة الكود النمطي سيناريوهات الاختبار اليدوية وقتاً كبيراً من جهد المهندس.",
    solutionEn: "Established specialized AI agent prompts and workflow scripts that validate generated schemas against real database rules before insertion.",
    solutionAr: "تم إعداد مسارات عمل وتوجيهات متخصصة لوكلاء الذكاء تدقق المخططات الناتجة مقابل قواعد البيانات الحقيقية قبل النشر.",
    featuresEn: ["Automated schema generation", "AI-assisted regression test generation", "Code smell detection & refactoring", "Secure prompt token optimization"],
    featuresAr: ["إنشاء مخططات قواعد البيانات تلقائياً", "كتابة اختبارات حافة Edge-cases بالذكاء الاصطناعي", "اكتشاف ونظافة الكود Refactoring", "ترشيد استهلاك الرموز Token Optimization"]
  },
  {
    id: "zero-trust-auth-security",
    category: "security",
    titleEn: "Hardened Zero-Trust Auth Architecture",
    titleAr: "بنية المصادقة والأمان بأسلوب Zero-Trust",
    subtitleEn: "Multi-layered security enforcement & API protection",
    subtitleAr: "منظومة حماية متعددة الطبقات وتأمين واجهات الـ API",
    descEn: "Security architecture design incorporating strict JWT token rotation, server-side payload schema validation, CORS origin policy rules, and rate-limiting guards.",
    descAr: "تصميم بنية أمنية مخصصة تشمل تدوير رموز JWT، تدقيق حمولة البيانات على الخادم، تحديد أصول CORS، وحماية من الهجمات التكرارية Rate-Limiting.",
    tech: ["JWT", "Zod Schemas", "CORS Hardening", "Rate Limit Guard", "HTTP Security Headers"],
    metricsEn: "100% Server-Side Enforced · OWASP Top 10 Protected",
    metricsAr: "تطبيق كامل من جانب الخادم 100% · حماية من ثغرات OWASP",
    problemEn: "Relying on frontend validation allows malicious users to bypass security rules by calling backend endpoints directly.",
    problemAr: "الاعتماد على تدقيق الواجهة الأمامية يتيح للمخترقين تجاوز الحماية واستدعاء نقاط الخادم مباشرة.",
    solutionEn: "Engineered a mandatory security middleware chain verifying identity, payload boundary, and RBAC permissions on every single HTTP request.",
    solutionAr: "تم بناء سلسلة طبقات وسيطة Middleware إجبارية تفحص الهوية، الحدود المعرفية للبيانات، وصلاحيات الدور لكل طلب HTTP قادم.",
    featuresEn: ["Server-side Zod payload sanitization", "Strict HTTP-only cookie session handling", "Role-based authorization guard matrix", "Rate-limiting middleware against brute-force"],
    featuresAr: ["تدقيق وتنقية المدخلات عبر Zod على الخادم", "إدارة جلسات آمنة عبر ملفات كوكيز HTTP-only", "مصفوفة فحص الصلاحيات بحسب الدور RBAC", "حماية نقاط الاتصال من هجمات التخمين Rate-limiting"]
  }
];
