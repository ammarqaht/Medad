import { LoginPage, AdminLoginPage } from '../pages/auth.js';
import { DashboardLayout } from '../components/layout.js';
import { initAnimations } from './animations.js';
import { StudentDashboard } from '../pages/student/dashboard.js';
import { ProgramIdea } from '../pages/student/idea.js';
import { CalendarView } from '../pages/student/calendar.js';
import { StudentTasks } from '../pages/student/tasks.js';
import { StudentPoints } from '../pages/student/points.js';
import { LeaderboardView } from '../pages/student/leaderboard.js';
import { DigitalLibrary } from '../pages/student/library.js';
import { BadgesPage } from '../pages/student/badges.js';
import { CommunityPage } from '../pages/student/community.js';

import { AdminDashboard } from '../pages/admin/dashboard.js';
import { AdminTasks } from '../pages/admin/tasks.js';
import { AdminAddTask } from '../pages/admin/addTask.js';
import { AdminGeneralPoints } from '../pages/admin/points.js';
import { AdminCMS } from '../pages/admin/cms.js';
import { AdminManageTask } from '../pages/admin/manageTask.js';
import { AdminReviewLog } from '../pages/admin/reviewLog.js';
import { AdminOverview } from '../pages/admin/overview.js';

const components = {
    'Login': LoginPage,
    'AdminLogin': AdminLoginPage,
    'StudentDashboard': StudentDashboard,
    'ProgramIdea': ProgramIdea,
    'CalendarView': CalendarView,
    'StudentTasks': StudentTasks,
    'StudentPoints': StudentPoints,
    'LeaderboardView': LeaderboardView,
    'DigitalLibrary': DigitalLibrary,
    'BadgesPage': BadgesPage,
    'CommunityPage': CommunityPage,
    'AdminDashboard': AdminDashboard,
    'AdminTasks': AdminTasks,
    'AdminAddTask': AdminAddTask,
    'AdminGeneralPoints': AdminGeneralPoints,
    'AdminCMS': AdminCMS,
    'AdminManageTask': AdminManageTask,
    'AdminReviewLog': AdminReviewLog,
    'AdminOverview': AdminOverview,
    'HomeRedirect': () => '<div style="display:none">Redirecting...</div>',
    'NotFound': () => '<div style="text-align:center; padding: 100px;"><h1>404</h1><p>الصفحة غير موجودة</p><a href="#/" class="btn btn-primary mt-4">العودة للرئيسية</a></div>'
};

export function renderApp(rootElement, route, store) {
    if (route.componentName === 'HomeRedirect') {
        const user = store.getState().user;
        if (!user) { window.location.hash = '#/login'; return; }
        window.location.hash = user.role === 'admin' ? '#/admin' : '#/student';
        return;
    }

    const Component = components[route.componentName] || components['NotFound'];
    let html = '';

    if (route.layout === 'dashboard') {
        const user = store.getState().user;
        if (!user) { 
            window.location.hash = '#/login'; 
            return; 
        }

        // Strict Role-Based Access Guards
        if (route.path.startsWith('/admin') && user.role !== 'admin') {
            window.location.hash = '#/student';
            return;
        }
        if (route.path.startsWith('/student') && user.role !== 'student') {
            window.location.hash = '#/admin';
            return;
        }

        html = DashboardLayout(Component(store), user, route, store);
    } else {
        html = `<div class="${route.layout === 'auth' ? 'auth-layout' : ''}">${Component(store)}</div>`;
    }

    // Skip the DOM swap if the rendered output is byte-identical to what's
    // already mounted. Avoids the visible flash when background syncs commit
    // state changes that don't affect the current page.
    if (rootElement._lastHtml === html) return;
    rootElement._lastHtml = html;
    rootElement.innerHTML = html;

    setTimeout(() => {
        if (typeof Component.attachEvents === 'function') Component.attachEvents(store);
        if (route.layout === 'dashboard' && typeof DashboardLayout.attachEvents === 'function') DashboardLayout.attachEvents(store);
        initAnimations(rootElement);
    }, 0);
}
