/**
 * Mock data for the مداد showcase mockup.
 * Provides a rich, fully-populated example dataset so the حِلْيَة-style
 * dashboard renders every feature without a backend.
 */

// ── CMS content (mirrors the app's defaults) ──────────────────────────────────
const content = {
  'hero.title': 'مرحباً بك،',
  'hero.subtitle': 'في برنامج حِلْيَة، نبني الانضباط والمعرفة والأخلاق النبيلة. استمر في تقدمك نحو التميز.',
  'nav.home': 'الرئيسية',
  'nav.idea': 'فكرة البرنامج',
  'nav.calendar': 'التقويم',
  'nav.tasks': 'المهام',
  'nav.points': 'النقاط',
  'nav.leaderboard': 'الترتيب',
  'dashboard.guide.title': 'لوحة التوجيه',
  'card.idea.title': 'فكرة البرنامج',
  'card.idea.description': 'تعرف على فلسفة وأهداف البرنامج لبناء الأخلاق والمهارات.',
  'card.calendar.title': 'التقويم',
  'card.calendar.description': 'جدولك الأسبوعي للمهام والمناشط المخطط لها بدقة.',
  'card.tasks.title': 'المهام',
  'card.tasks.description': 'استعرض، سلم، وتابع مهامك مقسمة حسب المسارات المختلفة.',
  'card.points.title': 'النقاط والإنجازات',
  'card.points.description': 'راقب تقدمك الحيازي وإنجازاتك وترتيبك بين أقرانك.',
  'idea.page.title': 'فكرة البرنامج',
  'idea.main.heading': 'رؤية تجمع بين الأصالة والمعاصرة',
  'idea.main.heading.highlight': 'لبناء شخصية متكاملة.',
  'idea.main.quote': '"حِلْيَة هو برنامج صُمم لمساعدة الطلاب على العيش بأخلاق نبيلة وعادات هادفة. من خلال التحديات المنظمة، الاستكشاف الفكري، والمسؤولية الاجتماعية، يبني الطلاب الانضباط، يوسعون مداركهم، ويهذبون شخصياتهم."',
  'idea.pillar1.title': 'التعلّم المستمر',
  'idea.pillar1.description': 'تشجيع فضول المعرفة كنمط حياة عبر مسارات قرائية وثقافية تلائم تطلعات الشباب المتجددة، ليكونوا قادة الفكر في المستقبل.',
  'idea.pillar2.title': 'المساهمة الاجتماعية',
  'idea.pillar2.description': 'صناعة الأثر في المحيط المباشر وتنمية جسور التواصل البنّاء مع كافة فئات المجتمع، لتحقيق المواطنة الإيجابية والفعلية.',
  'idea.pillar3.title': 'التميز الشخصي',
  'idea.pillar3.description': 'الارتقاء بالذات، وتنمية الذاكرة الحديدية والمهارات التقنية والإعلامية التي يتطلبها العصر لتسريع عجلة الابتكار.',
  'tasks.page.title': 'المهام الحالية',
  'tasks.page.subtitle': 'استعرض وسلّم مهامك في المسارات المختلفة',
  'points.page.title': 'النقاط والإنجازات',
  'points.page.subtitle': 'تابع تقدمك وأوسمتك في البرنامج',
  'calendar.page.title': 'التقويم',
  'calendar.page.subtitle': 'خطط لمهامك وعاداتك شهرياً',
  'ui.submit.task': 'تسليم المهمة',
  'ui.logout': 'تسجيل الخروج',
  'ui.leaderboard.title': 'النقاط العامة ولوحة الشرف',
  'admin.dashboard.title': 'لوحة تحكم المشرف',
  'admin.dashboard.subtitle': 'نظرة عامة على أداء وإنجازات الطلاب.',
};

// ── Supervisors ───────────────────────────────────────────────────────────────
const admins = [
  { id: 'a1', name: 'أ. سلطان القحطاني' },
  { id: 'a2', name: 'أ. خالد المطيري' },
  { id: 'a3', name: 'أ. ريان العتيبي' },
  { id: 'a4', name: 'أ. ماجد الدوسري' },
  { id: 'a5', name: 'أ. فهد الشمري' },
];

// ── Tasks (across every track + submission method) ────────────────────────────
const tasks = [
  { id: 't1', title: 'قراءة كتاب "فن اللامبالاة" وكتابة ملخص', track: 'الثقافي', submissionMethod: 'كتابة ملخص', points: 25,
    description: 'اقرأ الكتاب كاملاً ثم اكتب ملخصاً لا يقل عن ٣٠٠ كلمة يتناول أبرز الأفكار وأثرها عليك.\nركّز على ما يمكن تطبيقه عملياً في حياتك.', assignedAdmins: ['a1'], isActive: true, deadline: '2026-06-10', resourceLink: 'https://example.com/book' },
  { id: 't2', title: 'تلخيص مقال فكري ومناقشته', track: 'الثقافي', submissionMethod: 'رفع ملف', points: 20,
    description: 'اختر مقالاً فكرياً من مصدر موثوق، ولخّصه في ملف PDF مع إبداء رأيك النقدي.', assignedAdmins: ['a1', 'a2'], isActive: true, deadline: '2026-06-12' },
  { id: 't3', title: 'بناء صفحة ويب تعريفية', track: 'مسار تقني', submissionMethod: 'رفع ملف', points: 30,
    description: 'صمّم صفحة ويب بسيطة تعرّف بنفسك باستخدام HTML و CSS، وارفع لقطة من النتيجة.', assignedAdmins: ['a3'], isActive: true, deadline: '2026-06-15',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=900', resourceLink: 'https://developer.mozilla.org' },
  { id: 't4', title: 'إكمال دورة في أساسيات البرمجة', track: 'مسار تقني', submissionMethod: 'إقرار بالإنجاز', points: 30,
    description: 'أكمل دورة تأسيسية في البرمجة (لا تقل عن ٤ ساعات) ثم أقرّ بإنجازها أمام المشرف.', assignedAdmins: [], isActive: true, deadline: '2026-06-18' },
  { id: 't5', title: 'حفظ ٢٠ مصطلحاً علمياً', track: 'الذاكرة الحديدية', submissionMethod: 'إقرار بالإنجاز', points: 15,
    description: 'احفظ ٢٠ مصطلحاً علمياً مع تعريفاتها، وكن مستعداً لاختبار شفهي سريع.', assignedAdmins: ['a4'], isActive: true, deadline: '2026-06-09' },
  { id: 't6', title: 'تمرين تقنية القصر الذهني', track: 'الذاكرة الحديدية', submissionMethod: 'كتابة ملخص', points: 15,
    description: 'طبّق تقنية "قصر الذاكرة" لحفظ قائمة من ١٥ عنصراً، واكتب تجربتك ونتائجها.', assignedAdmins: ['a4'], isActive: true, deadline: '2026-06-20' },
  { id: 't7', title: 'تنظيم مبادرة تطوعية صغيرة', track: 'الاجتماعي', submissionMethod: 'رفع ملف', points: 28,
    description: 'نظّم مبادرة تطوعية في محيطك (أسرة، حي، مدرسة) ووثّقها بالصور في ملف.', assignedAdmins: ['a2', 'a5'], isActive: true, deadline: '2026-06-22' },
  { id: 't8', title: 'زيارة دار المسنين', track: 'الاجتماعي', submissionMethod: 'إقرار بالإنجاز', points: 20,
    description: 'قم بزيارة لدار المسنين أو أحد المراكز الاجتماعية، وأقرّ بإتمام الزيارة.', assignedAdmins: ['a5'], isActive: true, deadline: '2026-06-25' },
  { id: 't9', title: 'تصميم بوستر توعوي', track: 'مسار إعلامي', submissionMethod: 'رفع ملف', points: 22,
    description: 'صمّم بوستراً توعوياً حول قضية مجتمعية تهمك، وارفع التصميم النهائي.', assignedAdmins: ['a3'], isActive: true, deadline: '2026-06-14',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=900' },
  { id: 't10', title: 'كتابة تقرير صحفي قصير', track: 'مسار إعلامي', submissionMethod: 'كتابة ملخص', points: 18,
    description: 'اكتب تقريراً صحفياً قصيراً عن حدث أو نشاط حضرته، بأسلوب إعلامي محترف.', assignedAdmins: ['a3'], isActive: true, deadline: '2026-06-28' },
  { id: 't11', title: 'مناقشة كتاب الشهر', track: 'الثقافي', submissionMethod: 'كتابة ملخص', points: 20,
    description: 'شارك في جلسة مناقشة كتاب الشهر، واكتب أبرز ما استفدته من النقاش.', assignedAdmins: ['a1'], isActive: false, deadline: '2026-04-30' },
  { id: 't12', title: 'مشروع تطبيق جوال (نموذج أولي)', track: 'مسار تقني', submissionMethod: 'رفع ملف', points: 30,
    description: 'صمّم نموذجاً أولياً لتطبيق جوال يحل مشكلة واقعية، وارفع التصميم.', assignedAdmins: ['a3'], isActive: false, deadline: '2026-04-20' },
  { id: 't13', title: 'حملة نظافة الحي', track: 'الاجتماعي', submissionMethod: 'كتابة ملخص', points: 16,
    description: 'شارك في حملة لنظافة حيّك، واكتب تجربتك وأثرها.', assignedAdmins: ['a5'], isActive: true, deadline: '2026-07-01' },
  { id: 't14', title: 'اختبار الذاكرة الأسبوعي', track: 'الذاكرة الحديدية', submissionMethod: 'إقرار بالإنجاز', points: 12,
    description: 'اجتز اختبار الذاكرة الأسبوعي، وأقرّ بإتمامه.', assignedAdmins: ['a4'], isActive: true, deadline: '2026-06-08' },
].map(t => ({
  ...t,
  maxPoints: t.points,
  displayDeadline: t.deadline,
  disabled: t.isActive === false,
  imageUrl: t.imageUrl || null,
  resourceLink: t.resourceLink || null,
  visibility: 'all',
  visibleToIds: [],
}));

// ── Students / leaderboard (sorted by points desc) ────────────────────────────
const students = [
  { id: 's1',  name: 'نواف الحربي',       totalPoints: 268, completedTasks: 12 },
  { id: 's2',  name: 'عبدالعزيز السبيعي', totalPoints: 254, completedTasks: 11 },
  { id: 's3',  name: 'عبدالله الزهراني',  totalPoints: 241, completedTasks: 11 },
  { id: 's4',  name: 'تركي العنزي',       totalPoints: 233, completedTasks: 10 },
  { id: 's5',  name: 'يزيد الغامدي',      totalPoints: 219, completedTasks: 10 },
  { id: 's6',  name: 'سلمان الرشيدي',     totalPoints: 205, completedTasks: 9  },
  { id: 's7',  name: 'بدر القرني',        totalPoints: 192, completedTasks: 9  },
  { id: 's8',  name: 'ريان المالكي',      totalPoints: 178, completedTasks: 8  },
  { id: 's9',  name: 'فيصل الحارثي',      totalPoints: 164, completedTasks: 8  },
  { id: 's10', name: 'ماجد البقمي',       totalPoints: 151, completedTasks: 7  },
  { id: 's11', name: 'سعود الشهري',       totalPoints: 133, completedTasks: 6  },
  { id: 's12', name: 'عمر العمري',        totalPoints: 119, completedTasks: 5  },
  { id: 's13', name: 'زياد الجهني',       totalPoints: 96,  completedTasks: 4  },
  { id: 's14', name: 'طلال الخالدي',      totalPoints: 72,  completedTasks: 3  },
];

// ── Weekly "أدب الأسبوع" slider ────────────────────────────────────────────────
const weeklySlider = {
  active: true,
  image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1400',
  imageMobile: '',
  title: 'أدب الأسبوع',
  subtitle: 'احرص على بشاشة الوجه وإلقاء السلام على من عرفت ومن لم تعرف، فالسلام من أسباب المودة.',
};

// ── Dynamic dashboard feature cards ───────────────────────────────────────────
const features = [
  { id: 'f1', name: 'المكتبة الرقمية', description: 'مجموعة كتب ومصادر مختارة لإثراء الطالب.', icon: 'Idea', color: '#9B72CF', visible: true },
  { id: 'f2', name: 'نظام الشارات', description: 'شارات تحفيزية تُمنح عند تحقيق الإنجازات.', icon: 'Winner', color: '#E8C26D', visible: true },
  { id: 'f3', name: 'مجتمع الطلاب', description: 'مساحة للنقاش وتبادل الخبرات بين المشاركين.', icon: 'Users', color: '#51ADAD', visible: true },
];

// ── Submissions for the logged-in student (raw shape) ─────────────────────────
const studentSubmissions = [
  { id: 1, taskId: 't1', status: 'approved', grade: 25, feedback: 'ملخص ممتاز وعميق، استمر على هذا المستوى.', fileUrl: 'ملخص مكتوب: تناول الكتاب فكرة انتقاء ما يستحق الاهتمام...' },
  { id: 2, taskId: 't2', status: 'approved', grade: 18, feedback: 'تحليل جيد، وكان بالإمكان التوسع أكثر في الرأي النقدي.', fileUrl: 'https://example.com/files/article-summary.pdf' },
  { id: 3, taskId: 't4', status: 'approved', grade: 30, feedback: 'إنجاز رائع، أتممت الدورة بتميز.', fileUrl: 'acknowledgement://confirmed' },
  { id: 4, taskId: 't5', status: 'approved', grade: 14, feedback: 'حفظ متقن.', fileUrl: 'acknowledgement://confirmed' },
  { id: 5, taskId: 't6', status: 'approved', grade: 13, feedback: 'تجربة موثقة بشكل واضح.', fileUrl: 'ملخص: طبقت التقنية على قائمة مشتريات...' },
  { id: 6, taskId: 't3', status: 'pending',  grade: null, feedback: '', fileUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=900' },
  { id: 7, taskId: 't9', status: 'pending',  grade: null, feedback: '', fileUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=900' },
  { id: 8, taskId: 't7', status: 'rejected', grade: null, feedback: 'يرجى إرفاق صور أوضح توثّق المبادرة وإعادة التسليم.', fileUrl: 'https://example.com/old.jpg' },
];

// ── All submissions for the supervisor (admin-mapped shape) ───────────────────
function adminSub(id, sName, taskId, status, opts = {}) {
  const t = tasks.find(x => x.id === taskId);
  return {
    id,
    studentName: sName,
    taskId,
    taskTitle: t.title,
    taskTrack: t.track,
    taskMaxPoints: t.maxPoints,
    taskAssignedAdmins: t.assignedAdmins,
    submissionContent: opts.content || 'ملخص نصي مكتوب من الطالب يوضح تنفيذ المهمة بالتفصيل.',
    status,
    submittedAt: opts.at || '2026-05-15T10:00:00.000Z',
    earnedPoints: opts.grade ?? null,
    adminComment: opts.comment || '',
  };
}

const adminSubmissions = [
  // pending — fill the review queue
  adminSub('p1', 'نواف الحربي',      't3',  'pending', { at: '2026-05-19T20:14:00Z', content: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=900' }),
  adminSub('p2', 'عبدالعزيز السبيعي', 't10', 'pending', { at: '2026-05-19T18:02:00Z' }),
  adminSub('p3', 'عبدالله الزهراني',  't3',  'pending', { at: '2026-05-18T22:40:00Z', content: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=900' }),
  adminSub('p4', 'تركي العنزي',       't8',  'pending', { at: '2026-05-18T16:25:00Z', content: 'acknowledgement://confirmed' }),
  adminSub('p5', 'يزيد الغامدي',      't2',  'pending', { at: '2026-05-17T11:10:00Z', content: 'https://example.com/files/report.pdf' }),
  adminSub('p6', 'بدر القرني',        't6',  'pending', { at: '2026-05-17T09:30:00Z' }),
  adminSub('p7', 'ريان المالكي',      't9',  'pending', { at: '2026-05-16T21:05:00Z', content: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=900' }),
  // approved
  adminSub('a01', 'نواف الحربي',      't1', 'approved', { grade: 25, comment: 'عمل متميز.', at: '2026-05-12T13:00:00Z' }),
  adminSub('a02', 'عبدالعزيز السبيعي', 't4', 'approved', { grade: 29, comment: 'ممتاز.', at: '2026-05-11T14:20:00Z', content: 'acknowledgement://confirmed' }),
  adminSub('a03', 'عبدالله الزهراني',  't1', 'approved', { grade: 25, comment: 'ملخص ممتاز.', at: '2026-05-10T17:00:00Z' }),
  adminSub('a04', 'تركي العنزي',       't5', 'approved', { grade: 14, comment: 'حفظ متقن.', at: '2026-05-09T08:45:00Z', content: 'acknowledgement://confirmed' }),
  adminSub('a05', 'سلمان الرشيدي',     't7', 'approved', { grade: 26, comment: 'مبادرة مؤثرة.', at: '2026-05-08T19:30:00Z' }),
  adminSub('a06', 'يزيد الغامدي',      't9', 'approved', { grade: 21, comment: 'تصميم جذاب.', at: '2026-05-07T12:10:00Z' }),
  // rejected
  adminSub('r1', 'فيصل الحارثي',  't7', 'rejected', { comment: 'الصور غير واضحة، يرجى إعادة التسليم.', at: '2026-05-13T15:00:00Z' }),
  adminSub('r2', 'سعود الشهري',   't2', 'rejected', { comment: 'الملخص قصير جداً ولا يفي بالمطلوب.', at: '2026-05-12T10:00:00Z' }),
];

// ── submissionsByDate (for the overview heatmap + navigator) ──────────────────
function buildSubmissionsByDate() {
  const out = [];
  const end = new Date('2026-05-20');
  for (let i = 70; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const dow = d.getDay();
    let base = 1 + Math.round(Math.abs(Math.sin(i * 1.3)) * 4);
    if (dow === 4) base += 3;            // Thursday spike
    if (dow === 5) base = Math.max(0, base - 2); // quieter Friday
    out.push({ date: d.toISOString().split('T')[0], count: base });
  }
  return out;
}

// ── Analytics payload for /api/analytics/overview ─────────────────────────────
const analytics = {
  hero: {
    totalStudents: 14, totalTasks: 14, totalSubmissions: 96, approvalRate: 97,
    avgPointsPerStudent: 178, totalPointsDistributed: 2492, programDurationDays: 84,
    participationRate: 91, programStart: '2026-02-20', programEnd: '2026-05-30',
  },
  funFacts: {
    mostActiveStudent: { name: 'نواف الحربي', count: 13 },
    busiestDay: { date: '٢٠٢٦/٠٤/١٦', count: 21 },
    nightSubmissionPercent: 34,
    mostActiveAdmin: { name: 'أ. سلطان القحطاني', reviewCount: 31 },
  },
  mostImproved: { name: 'زياد الجهني', improvement: 42 },
  mostConsistent: { name: 'عبدالعزيز السبيعي', completionPercent: 93 },
  statusDistribution: { approved: 84, rejected: 6, pending: 6 },
  submissionsByDate: buildSubmissionsByDate(),
  submissionsByDayOfWeek: [
    { day: 'الأحد', count: 18 }, { day: 'الإثنين', count: 14 }, { day: 'الثلاثاء', count: 11 },
    { day: 'الأربعاء', count: 9 }, { day: 'الخميس', count: 21 }, { day: 'الجمعة', count: 7 },
    { day: 'السبت', count: 16 },
  ],
  gradingDistribution: [
    { bin: '٠–٢٠', count: 3 }, { bin: '٢١–٤٠', count: 5 }, { bin: '٤١–٦٠', count: 12 },
    { bin: '٦١–٨٠', count: 28 }, { bin: '٨١–١٠٠', count: 48 },
  ],
  taskStats: tasks.map((t, i) => ({ title: t.title, track: t.track, completionRate: [93, 86, 71, 79, 88, 64, 57, 68, 74, 52, 100, 100, 45, 90][i] })),
  completionTiers: { all: 2, high: 5, mid: 3, low: 2, minimal: 1, zero: 1 },
  trackStats: [
    { track: 'الثقافي', taskCount: 3, submissionCount: 31, approvalRate: 96, totalPoints: 612 },
    { track: 'مسار تقني', taskCount: 3, submissionCount: 24, approvalRate: 92, totalPoints: 548 },
    { track: 'الذاكرة الحديدية', taskCount: 3, submissionCount: 22, approvalRate: 99, totalPoints: 421 },
    { track: 'الاجتماعي', taskCount: 3, submissionCount: 12, approvalRate: 95, totalPoints: 498 },
    { track: 'مسار إعلامي', taskCount: 2, submissionCount: 7, approvalRate: 100, totalPoints: 313 },
  ],
  studentStats: students.slice(0, 10).map(s => ({
    name: s.name, tasksCompleted: s.completedTasks,
    avgGradePercent: Math.min(99, 70 + Math.round(s.totalPoints / 12)), totalPoints: s.totalPoints,
  })),
  adminStats: [
    { name: 'أ. سلطان القحطاني', reviewCount: 31, approvalRate: 94, avgGradeGiven: 22 },
    { name: 'أ. خالد المطيري', reviewCount: 24, approvalRate: 88, avgGradeGiven: 19 },
    { name: 'أ. ريان العتيبي', reviewCount: 19, approvalRate: 91, avgGradeGiven: 24 },
    { name: 'أ. ماجد الدوسري', reviewCount: 14, approvalRate: 100, avgGradeGiven: 13 },
    { name: 'أ. فهد الشمري', reviewCount: 8, approvalRate: 87, avgGradeGiven: 21 },
  ],
  dropouts: [
    { name: 'طلال الخالدي', lastSub: '٢٠٢٦/٠٣/١٠', tasksCompleted: 3 },
    { name: 'زياد الجهني', lastSub: '٢٠٢٦/٠٣/٢٨', tasksCompleted: 4 },
  ],
  programSummary: {
    scoreGrade: 'A', scorePercent: 88,
    text: 'يسير البرنامج بأداء قوي ومستقر. نسبة القبول مرتفعة (٩٧٪) ومشاركة الطلاب فوق المتوسط. أكثر الأيام نشاطاً هو الخميس، وتتركز التسليمات في المسار الثقافي. هناك فرصة لرفع معدل الإنجاز في المسار الإعلامي.',
  },
  recommendations: [
    { type: 'positive', text: 'نسبة القبول العالية تعكس جودة تسليمات الطلاب ووضوح معايير التقييم.' },
    { type: 'positive', text: 'انتظام التسليمات على مدار الأسبوع مؤشر على التزام جيد بالمواعيد.' },
    { type: 'warning', text: 'عدد التسليمات في المسار الإعلامي منخفض — يُنصح بتحفيز المشاركة فيه.' },
    { type: 'warning', text: 'يوجد متدربان متوقفان عن التسليم — يُفضّل التواصل معهما مباشرة.' },
  ],
};

// per-student task breakdown for the admin "النقاط العامة" expandable rows
const studentTasksBreakdown = tasks.slice(0, 10).map((t, i) => ({
  title: t.title,
  submissionStatus: ['approved', 'approved', 'approved', 'pending', 'approved', 'rejected', 'approved', null, 'approved', null][i],
  grade: [t.maxPoints, t.maxPoints - 2, t.maxPoints, null, t.maxPoints - 1, null, t.maxPoints, null, t.maxPoints - 3, null][i],
  maxPoints: t.maxPoints,
}));

/**
 * Build the full reactive-store state for the given role.
 */
export function buildState(role) {
  const isAdmin = role === 'admin';
  return {
    theme: 'light',
    editMode: false,
    user: isAdmin
      ? { id: 'a1', name: 'أ. سلطان القحطاني', role: 'admin' }
      : { id: 's3', name: 'عبدالله الزهراني', role: 'student' },
    content,
    featureVisibility: { idea: true, calendar: true, tasks: true, points: true, leaderboard: true },
    tasks,
    submissions: isAdmin ? adminSubmissions : studentSubmissions,
    weeklySlider,
    features,
    students,
    admins,
    adminStudentList: students.map(s => ({ id: s.id, name: s.name })),
    lastActivity: Date.now(),
    // extras consumed by the mock fetch layer
    __analytics: analytics,
    __studentTasks: studentTasksBreakdown,
  };
}
