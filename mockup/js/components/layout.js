import { Icons } from './icons.js';

/**
 * Dashboard Layout — sidebar with visibility-aware student nav + Admin Edit Mode toolbar
 */

export function DashboardLayout(children, user, route, store) {
    const isStudent = user.role === 'student';
    const isAdm = user.role === 'admin';
    const content = store.getState().content;
    const visibility = store.getState().featureVisibility || {};

    const c = (key, fallback) => content[key] || fallback;

    // ---- Student sidebar links: respect featureVisibility ----
    const studentLinks = [
        { path: '/student', label: c('nav.home', 'الرئيسية'), icon: Icons.Home, always: true },
        { path: '/student/idea', label: c('nav.idea', 'فكرة البرنامج'), icon: Icons.Idea, visKey: 'idea' },
        { path: '/student/calendar', label: c('nav.calendar', 'التقويم'), icon: Icons.Calendar, visKey: 'calendar' },
        { path: '/student/tasks', label: c('nav.tasks', 'المهام'), icon: Icons.Tasks, visKey: 'tasks' },
        { path: '/student/points', label: c('nav.points', 'النقاط'), icon: Icons.Points, visKey: 'points' },
        { path: '/student/leaderboard', label: c('nav.leaderboard', 'الترتيب'), icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`, visKey: 'leaderboard' },
        { path: '/student/library', label: 'المكتبة الرقمية', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`, always: true },
        { path: '/student/badges', label: 'الشارات', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`, always: true },
        { path: '/student/community', label: 'المجتمع', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, always: true },
    ].filter(l => l.always || visibility[l.visKey] !== false);

    // ---- Admin sidebar — grouped ----
    const adminLinks = [
        // Group: Overview
        { type: 'link', path: '/admin', label: 'لوحة التحكم', icon: Icons.Home },
        { type: 'link', path: '/admin/points', label: 'النقاط العامة', icon: Icons.Points },
        // Group: Tasks
        { type: 'divider', label: 'إدارة المهام' },
        { type: 'link', path: '/admin/tasks', label: 'المهام المسلّمة', icon: Icons.Tasks },
        { type: 'link', path: '/admin/review-log', label: 'سجل التقييمات', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>` },
        { type: 'link', path: '/admin/add-task', label: 'إضافة مهمة', icon: Icons.Idea },
        { type: 'link', path: '/admin/manage-tasks', label: 'إدارة المهام', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>` },
        // Group: Content
        { type: 'divider', label: 'إدارة المحتوى' },
        { type: 'link', path: '/admin/cms', label: 'إدارة المحتوى', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>` },
        // Analytics
        { type: 'divider', label: 'التحليلات' },
        { type: 'link', path: '/admin/overview', label: 'نظرة عامة', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>` },
    ];

    const currentHash = window.location.hash.slice(1);

    const renderLink = (item) => {
        if (item.type === 'divider') {
            return `
                <div style="height: 1px; background: var(--border-color); margin: 12px 16px 8px;"></div>
                <div style="padding: 2px 20px 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary);">${item.label}</div>
            `;
        }
        const isActive = currentHash === item.path;
        return `
            <a href="#${item.path}" class="nav-link ${isActive ? 'active' : ''}" style="
                display: flex; align-items: center; gap: 12px;
                padding: 10px 16px; border-radius: var(--radius-sm);
                color: ${isActive ? 'var(--color-primary)' : 'var(--text-secondary)'};
                background-color: ${isActive ? 'var(--bg-surface-hover)' : 'transparent'};
                font-weight: 500; margin-bottom: 4px;
                transition: all var(--transition-fast); text-decoration: none;
            ">
                <span style="display: flex; align-items: center; justify-content: center; width: 20px; flex-shrink: 0;">
                    ${item.icon}
                </span>
                ${item.label}
            </a>
        `;
    };

    const navItems = isStudent
        ? studentLinks.map(l => ({ type: 'link', ...l }))
        : adminLinks;

    const sidebarHtml = `
        <aside class="sidebar" style="
            width: var(--sidebar-width);
            background-color: var(--bg-surface);
            border-left: 1px solid var(--border-color);
            display: flex; flex-direction: column;
            padding: 24px 0; z-index: 1000;
        ">
            <div class="sidebar-header" style="padding: 0 24px; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between;">
                <a href="${isStudent ? '#/student' : '#/admin'}" id="sidebar-logo" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
                    <img src="حلية.svg" alt="Hilyah Logo" style="height: 52px; width: auto;" />
                </a>
                <button id="theme-toggle" class="btn desktop-only-flex" style="background: var(--bg-main); border: 1px solid var(--border-color); padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all 0.2s;" title="تبديل المظهر">
                    ${store.getState().theme === 'dark' ? Icons.Sun : Icons.Moon}
                </button>
            </div>
            
            <nav class="sidebar-nav" style="flex: 1; padding: 0 16px; overflow-y: auto;">
                ${navItems.map(renderLink).join('')}
            </nav>
            
            <div class="sidebar-footer" style="padding: 16px 24px; padding-bottom: max(20px, env(safe-area-inset-bottom, 20px)); border-top: 1px solid var(--border-color); margin-top: auto;">
                <div class="user-profile" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary)); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                        ${user.name.charAt(0)}
                    </div>
                    <div>
                        <div style="font-weight: 500; font-size: 0.95rem;">${user.name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-tertiary);">${isStudent ? 'طالب' : 'مشرف'}</div>
                    </div>
                </div>
                <button id="logout-btn" class="btn" style="width: 100%; justify-content: flex-start; background: rgba(239, 68, 68, 0.08); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.15); padding: 12px 16px; font-weight: 600; font-size: 0.95rem; border-radius: var(--radius-md); transition: all 0.2s;">
                    <span style="margin-left: 8px;">${Icons.Logout}</span> تسجيل الخروج
                </button>
            </div>
        </aside>
    `;



    const TopBar = () => `
        <header class="top-header mobile-only-flex" style="
            display: flex; align-items: center; justify-content: space-between;
            background-color: var(--bg-main);
            border-bottom: 1px solid var(--border-color);
            position: sticky; top: 0; z-index: 900;
        ">
            <div style="display: flex; align-items: center; gap: 16px;">
                <button id="mobile-menu-btn" class="btn" style="background: none; border: none; padding: 8px; flex-direction: column; gap: 4px; border-radius: 4px;">
                    <span style="display:block; width:22px; height:2px; background:var(--text-primary); border-radius:2px;"></span>
                    <span style="display:block; width:16px; height:2px; background:var(--text-primary); border-radius:2px;"></span>
                    <span style="display:block; width:22px; height:2px; background:var(--text-primary); border-radius:2px;"></span>
                </button>
                <a href="${isStudent ? '#/student' : '#/admin'}" id="header-logo" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
                    <img src="حلية.svg" alt="Hilyah Logo" style="height: 52px; width: auto;" />
                </a>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
                <button id="theme-toggle-mob" class="btn" style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all 0.2s;" title="تبديل المظهر">
                    ${store.getState().theme === 'dark' ? Icons.Sun : Icons.Moon}
                </button>
            </div>
        </header>
    `;

    const Footer = () => `
        <div style="position:relative; margin-top: auto; flex-shrink: 0; width: 100%;">
            <!-- Subtle wave or line separator could go here -->
            <div style="height: 1px; width: 80%; margin: 32px auto 0; background: linear-gradient(90deg, transparent, var(--border-color), transparent);"></div>
            
            <footer style="padding:48px 20px 32px; display:flex; flex-direction:column; align-items:center; gap:32px; text-align:center; position:relative; z-index:2; isolation:isolate;">
                <!-- Program Logo Signature -->
                <img src="حلية.svg" alt="Hilyah Logo" style="height: 72px; width: auto; opacity: 0.9;" />
                
                <!-- Creator Credit -->
                <div>
                    <div style="font-size:0.85rem; color:var(--text-tertiary); margin-bottom:12px; font-weight:600;">
                        تم صناعة هذا النظام بواسطة
                    </div>
                    <img src="Ammar.png" alt="Ammar Logo" style="height: 48px; width: auto; opacity: 0.85;" />
                </div>
            </footer>
        </div>
    `;

    return `
        <!-- Mobile sidebar overlay -->
        <div id="sidebar-overlay" style="pointer-events:none;"></div>
        <div class="dashboard-layout">
            ${sidebarHtml}
            <main class="main-content">
                ${TopBar()}
                <div class="page-container" style="padding:40px; flex: 1 0 auto; display: flex; flex-direction: column;">
                    ${children}
                </div>
                ${Footer()}
            </main>
        </div>
    `;
}

DashboardLayout.attachEvents = (store) => {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        if (confirm('هل أنت متأكد أنك تريد تسجيل الخروج؟')) {
            store.logout();
        }
    });
    const addThemeToggle = (id) => document.getElementById(id)?.addEventListener('click', () => store.toggleTheme());
    addThemeToggle('theme-toggle');
    addThemeToggle('theme-toggle-mob');

    // ── Mobile hamburger sidebar ──
    const menuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');

    const openMenu = () => {
        if (!sidebar) return;
        if (overlay) {
            overlay.style.display = 'block';
            requestAnimationFrame(() => overlay.classList.add('active'));
        }
        sidebar.classList.add('mobile-open');
        // DO NOT add 'open' class to button — user doesn't want the X
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        if (!sidebar) return;
        sidebar.classList.remove('mobile-open');
        document.body.style.overflow = '';
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => { if (!overlay.classList.contains('active')) overlay.style.display = 'none'; }, 340);
        }
    };

    // Hamburger: open only (X is hidden via CSS when open)
    menuBtn?.addEventListener('click', () => {
        if (!sidebar.classList.contains('mobile-open')) openMenu();
    });

    // Tap outside (overlay left-of-sidebar zone) → close
    const handleOverlayClose = (e) => { e.preventDefault(); closeMenu(); };
    overlay?.addEventListener('click',      handleOverlayClose);
    overlay?.addEventListener('touchstart', handleOverlayClose, { passive: false });

    // Nav links (and logos): close sidebar on tap
    // (Removed duplicate touchend to prevent event cancellation/unresponsiveness on mobile)
    document.querySelectorAll('.nav-link, #header-logo, #sidebar-logo').forEach(link => {
        if (!link) return;
        link.addEventListener('click', () => {
            closeMenu();
        });
    });





};
