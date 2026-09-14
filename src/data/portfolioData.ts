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
      "Student-Code Subscription Engine (auto-expiring)",
      "Payments — Stripe + Egypt Gateways (Visa · e-wallet · InstaPay)",
    ],
    architectureAr: [
      "الطالب · المعلم · ولي الأمر · الإدارة",
      "مصادقة Clerk",
      "التحقق من الصلاحيات حسب الدور",
      "الخدمات الأساسية (التسجيل · الدروس · التقدم)",
      "قاعدة بيانات PostgreSQL",
      "محرك اشتراكات رموز الطلاب (تعطيل تلقائي)",
      "المدفوعات — Stripe + بوابات مصر (فيزا · محفظة · InstaPay)",
    ],
    problemEn: "The academy ran entirely on paper — enrollment, lesson records, homework and progress lived in physical documents, making progress tracking across memorization, revision and Tajweed programs slow and error-prone. Users span nationalities inside and outside Egypt, which demands a fully bilingual experience and payment realities a single gateway cannot serve. And Quran programs carry deep domain rules — page, surah and juz boundaries, mistake types, per-lesson sessions and multi-role workflows — that generic education tools do not model natively.",
    problemAr: "كانت الأكاديمية تعمل بالكامل على الورق — التسجيل وسجلات الدروس والواجبات ومتابعة التقدم كانت مستندات ورقية، فكان تتبع تقدم كل طالب عبر برامج الحفظ والمراجعة والتجويد بطيئاً وعرضة للأخطاء. قاعدة المستخدمين تمتد عبر جنسيات داخل مصر وخارجها، ما يتطلب تجربة ثنائية اللغة بالكامل وواقع دفع لا يخدمه مزوّد واحد. وتحمل برامج القرآن الكريم قواعد مجال دقيقة — حدود الصفحات والسور والجزء، أنواع الأخطاء، جلسات الدروس ومسارات العمل متعددة الأدوار — لا نموذج لها في أدوات التعليم العامة.",
    solutionEn: "Engineered a domain-native schema (35 Prisma models across 17 migrations) designed up-front, with role-based portals, a hardened API layer and a fully bilingual interface. The hardest design problem — the subscription engine — was solved with a student-code system: each code is bound to a package and auto-expires the moment the subscription lapses, wired directly into renewal notifications. Billing runs through two realities: Stripe for international customers, and direct Visa / e-wallet / InstaPay gateways for customers inside Egypt, with admin review reserved for exceptions. Clerk handles authentication and secure session/data handling rather than a custom auth stack, and the interface is fully bilingual (Arabic RTL + English) with instant language switching.",
    solutionAr: "تم بناء نموذج مجال من 35 نموذجاً عبر 17 ترحيلاً صُمم مسبقاً، مع بوابات أدوار مخصصة وطبقة واجهات محمية وواجهة ثنائية اللغة بالكامل. أصعب مسائل التصميم — محرك الاشتراكات — حُلّت عبر نظام «رموز الطلاب»: كل رمز يرتبط بباقة ويُعطَّل تلقائياً لحظة انتهاء الاشتراك، ويرتبط مباشرة بإشعارات التجديد. والدفع يعمل عبر واقعين: Stripe للعملاء الدوليين، وبوابات دفع مباشرة (فيزا / محفظة إلكترونية / InstaPay) للعملاء داخل مصر، والمراجعة الإدارية للاستثناءات فقط. تتولى Clerk المصادقة والتعامل الآمن مع الجلسات والبيانات بدلاً من بناء نظام مصادقة مخصص، مع واجهة ثنائية اللغة (عربية RTL + إنجليزية) وتبديل فوري بين اللغتين.",
    featuresEn: [
      "Auto-expiring subscription codes («student codes») — each code is bound to a package and deactivates the moment the subscription lapses, wired into renewal notifications",
      "Multi-gateway billing — Stripe for international payments; direct Visa / e-wallet / InstaPay inside Egypt; admin review reserved for exceptions",
      "Role-based portals for students, parents, teachers and administrators",
      "Bilingual interface: full Arabic (RTL) and English with instant language switching",
      "Memorization, revision, Tajweed and Ijazah program workflows",
      "Lesson scheduling, attendance, homework and lesson reports",
      "Notifications, in-app messaging and parent progress reports",
    ],
    featuresAr: [
      "رموز اشتراك تُلغّى تلقائياً («رموز الطلاب») — يرتبط كل رمز بباقة ويُعطَّل لحظة انتهاء الاشتراك، ويرتبط بإشعارات التجديد",
      "دفع متعدد البوابات — Stripe للمدفوعات الدولية؛ دفع مباشر عبر فيزا / محفظة إلكترونية / InstaPay داخل مصر؛ والمراجعة الإدارية للاستثناءات فقط",
      "بوابات مخصصة للطلاب وأولياء الأمور والمعلمين والإدارة",
      "واجهة ثنائية اللغة: عربية كاملة (RTL) وإنجليزية مع تبديل فوري",
      "مسارات عمل للحفظ والمراجعة والتجويد والإجازة",
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
          "Subscriptions with auto-expiring student codes & multi-gateway billing (Stripe + Egypt)",
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
          "اشتراكات برموز طلاب تُلغّى تلقائياً ودفع متعدد البوابات (Stripe + مصر)",
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
      "DB-backed rate limiting on API endpoints — subscription requests capped at 5/hour per user against spam & abuse",
      "Archive/soft-delete pattern (archivedAt / deletedAt) preserving referential integrity across lessons, students & reviews",
      "Centralized archival filtering — archived records hidden consistently so dashboard counts never inflate",
      "Conservative nonce-based CSP — rejected a hash-based variant that would restore caching but can't stay stable for Next.js's own internals",
      "Audit-logged admin & sensitive actions",
    ],
    securityAr: [
      "إدارة صلاحيات حسب الدور على المسارات والإجراءات المحمية",
      "مصادقة Clerk مع إدارة جلسات آمنة",
      "تحقق Zod من جانب الخادم وتنقية ناتج HTML",
      "تقييد معدل الطلبات المدعوم بقاعدة البيانات — طلبات الاشتراك 5/الساعة لكل مستخدم لمنع الإساءة والبريد العشوائي",
      "نمط الأرشفة/الحذف الناعم (archivedAt / deletedAt) يحفظ تكامل العلاقات بين الدروس والطلاب والمراجعات",
      "فلترة مركزية للسجلات المؤرشفة — تُخفى بشكل موحد كي لا تتضخم أعداد لوحات التحكم",
      "سياسة CSP صارمة بنمط Nonce — رُفضت بديلة Hash تعيد التخزين المؤقت لأنها غير مستقرة مع مكوّنات Next.js الداخلية",
      "تسجيل الإجراءات الحساسة في سجل التدقيق Audit Log",
    ],
    impactEn: "End-to-end engineering of a real academy's operational spine — enrollment, learning, payments and reporting — unified into one bilingual, multi-role, RTL-native system. The academy, previously run entirely on paper, went live on the platform, used it for a period and described it as «قوي» (strong); the system is currently in final editing ahead of renewed, continued use.",
    impactAr: "هندسة شاملة للعمود الفقري التشغيلي لأكاديمية حقيقية — التسجيل والتعلم والدفع والتقارير — في نظام واحد ثنائي اللغة متعدد الأدوار يدعم العربية بالكامل. الأكاديمية، التي كانت تُدار بالكامل على الورق، انطلقت على المنصة واستخدمتها لفترة ووصفها المسؤولون بأنها «قوية»؛ والنظام الآن في تعديلاته النهائية قبل استئناف الاستخدام.",
  },
  {
    id: "al-fath-education",
    category: "web",
    titleEn: "Al-Fath Education",
    titleAr: "منصة الفتح التعليمية",
    subtitleEn: "From website to scalable educational web application",
    subtitleAr: "تحويل الموقع إلى تطبيق ويب تعليمي متكامل وقابل للتوسع",
    descEn: "A high-performance educational platform featuring centralized role & resource-ownership authorization, server-enforced subscription access, and 731 passing unit tests across student, instructor and admin portals.",
    descAr: "منصة تعليمية عالية الأداء بتفويض مركزي حسب الدور وملكية الموارد، واشتراكات يُفرض وصولها من الخادم، و731 اختبار وحدة ناجحاً عبر بوابات الطالب والمعلم والإدارة.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Clerk", "PostgreSQL", "Vitest", "Cloudflare Workers"],
    metricsEn: "731/731 Unit Tests Passed",
    metricsAr: "731/731 اختبار وحدة بنجاح",
    architectureEn: ["React Frontend", "API Gateway", "Clerk Auth", "Centralized Authorization (role + ownership)", "Manual Payments · Admin Review", "PostgreSQL DB", "Cloudflare Workers", "Production Deployment"],
    architectureAr: ["واجهة React", "بوابة API", "مصادقة Clerk", "تفويض مركزي (دور + ملكية)", "مدفوعات يدوية · مراجعة إدارية", "قاعدة بيانات Postgres", "شبكة Cloudflare", "بيئة الإنتاج"],
    problemEn: "I built the platform's original version; later, an expansion was requested. As requirements grew — authentication, permissions, subscriptions, payments, notifications, dashboards — the old architecture became the bottleneck: extending it meant fragile session handling, authorization logic repeated in a dozen places, and no safety net against regressions. The system has to keep three worlds strictly separated: students (lessons, assignments, subscription tracking), instructors (managing only their own assigned students), and admins (users, content, payments).",
    problemAr: "بنيتُ النسخة الأولى من المنصة بنفسي، ثم طُلب لاحقاً توسعتها. ومع نمو المتطلبات — المصادقة، الصلاحيات، الاشتراكات، المدفوعات، الإشعارات، لوحات التحكم — أصبحت البنية القديمة نقطة الاختناق: فالتوسيع فوقها يعني جلسات هشّة، ومنطق صلاحيات مكرراً في أكثر من موضع، وغياب شبكة أمان ضد الأخطاء البرمجية. والمنصة مضطرة لإبقاء ثلاثة عوالم منفصلة بدقة: الطلاب (دروس وواجبات ومتابعة اشتراك)، والمعلمون (لا يديرون سوى طلابهم المعينين)، والإدارة (المستخدمون والمحتوى والمدفوعات).",
    solutionEn: "Restructured the core architecture instead of extending it: authorization logic duplicated across ~12 files was centralized into a single function that enforces both role and resource-ownership — an instructor can manage only their own assigned students. Access is verified server-side inside the server actions themselves, never by hiding UI controls. Payments are manual by design (bank transfer / Vodafone Cash / InstaPay) with admin review into Subscription/Payment records, and heavy payment-data aggregation was moved off the direct request path into a periodically-refreshed cache. The hardest performance challenge was architectural: reading headers to generate a CSP nonce forced every page — even static ones — to be recomputed on each request; a cache-restoring hash-based CSP was tested and rejected as unstable for Next.js's own scripts, keeping the conservative nonce approach rather than trading security for speed. 731 Vitest unit tests guard the whole system against silent cross-area regressions.",
    solutionAr: "أُعيد هيكلة البنية الأساسية بدلاً من التوسيع فوقها: منطق الصلاحيات المكرر عبر ~12 ملفاً جُمّع في دالة واحدة تفرض التحقق المزدوج — الدور + ملكية الموارد — فلا يدير المعلم سوى طلابه المعينين. الوصول يُتحقق من جانب الخادم داخل Server Actions نفسها، لا بإخفاء أزرار الواجهة. والدفع يدوي بتصميم مقصود (تحويل بنكي / فودافون كاش / InstaPay) مع مراجعة إدارية وسجلات Subscription/Payment، ونُقل تجميع بيانات المدفوعات الثقيل بعيداً عن مسار الطلب المباشر إلى كاش يُحدَّث دورياً. وكان أصعب تحدٍّ معماريّاً: سطر يقرأ الترويسات لتوليد Nonce لسياسة CSP يجبر كل صفحة — حتى الثابتة منها — على إعادة الحساب مع كل طلب؛ جُرّبت سياسة Hash كانت ستعيد التخزين المؤقت فقُوبلت بالرفض لعدم استقرارها مع سكربتات Next.js الداخلية، فأُبقي الحل المتحفظ بـ Nonce بدلاً من مقايضة الأمان بالسرعة. وتحرس 731 اختبار وحدة المنظومة كلها من رجعات صامتة تتسلل بين المناطق المختلفة.",
    featuresEn: [
      "Centralized authorization — one function replacing ~12 duplicated copies, enforcing role + resource-ownership (instructors manage only their own assigned students)",
      "Server-side access enforcement — subscription status checked inside the server actions, never by hiding UI",
      "Manual payment workflows — bank transfer / Vodafone Cash / InstaPay with admin review & approval",
      "Role-based dashboards for students, instructors and admins",
      "731/731 passing Vitest unit tests for zero-regression development",
      "Cached payment-data aggregation kept off the direct request path",
      "Interactive quiz engine with real-time score analytics",
    ],
    featuresAr: [
      "تفويض مركزي — دالة واحدة حلت محل ~12 نسخة مكررة، تفرض الدور + ملكية الموارد (المعلم يدير طلابه المعينين فقط)",
      "فرض الوصول من الخادم — تُتحقق حالة الاشتراك داخل Server Actions، لا بإخفاء عناصر الواجهة",
      "مسارات دفع يدوي — تحويل بنكي / فودافون كاش / InstaPay مع مراجعة وموافقة إدارية",
      "لوحات تحكم حسب الدور للطالب والمعلم والإدارة",
      "731/731 اختبار وحدة ناجحاً لتطوير بلا رجعات برمجية (Zero-Regression)",
      "تجميع بيانات المدفوعات في كاش محمّل دورياً خارج مسار الطلب المباشر",
      "محرك اختبارات تفاعلي مع تحليل فوري للنتائج",
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
    solutionAr: "تم دمج محرك تظليل الكود مع مكونات اختبار تفاعلية مخصصة للعرض الشاقولي على الشاشات الذكية.",
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
