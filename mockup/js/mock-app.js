/**
 * مداد — Mockup bootstrap.
 *
 * Reuses the REAL حِلْيَة frontend code (router + renderer + every page module)
 * but feeds it a mock store with rich example data instead of a live backend.
 * The role is chosen via `window.MOCK_ROLE` ('student' | 'admin').
 */
import { router } from './core/router.js';
import { renderApp } from './core/renderer.js';
import { buildState } from './mock-data.js';

const role = window.MOCK_ROLE === 'admin' ? 'admin' : 'student';
const state = buildState(role);

document.documentElement.setAttribute('data-theme', state.theme);

// ── Mock network layer ────────────────────────────────────────────────────────
// Intercepts the app's /api/* calls so analytics, exports and per-student
// drill-downs all return believable data without a server.
const realFetch = window.fetch.bind(window);
function mockResponse(data) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
    blob: async () => new Blob([JSON.stringify(data)], { type: 'application/json' }),
  };
}
window.fetch = async (url, opts) => {
  const u = String(url);
  if (u.includes('/api/analytics/overview')) return mockResponse(state.__analytics);
  if (/\/api\/students\/[^/]+\/tasks/.test(u)) return mockResponse(state.__studentTasks);
  if (u.includes('/api/auth/me')) return { ok: false, status: 401, json: async () => ({}) };
  if (u.includes('/api/')) return mockResponse([]);          // any other API call → empty/ok
  return realFetch(url, opts);
};

// ── Mock store ────────────────────────────────────────────────────────────────
let rerender = () => {};

const baseStore = {
  getState: () => state,
  getText: (key) => state.content[key] || key,
  subscribe: () => () => {},
  recordActivity: () => {},
  isSessionExpired: () => false,
  toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    rerender();
  },
  toggleEditMode() {
    state.editMode = !state.editMode;
    rerender();
  },
  logout() {
    alert('🔒 هذه نسخة عرض تجريبية (Mockup) — تسجيل الخروج معطّل هنا.');
  },
};

// Any store method the page code calls that we didn't implement becomes a
// harmless async no-op — keeps the demo from throwing on actions.
const store = new Proxy(baseStore, {
  get(target, prop) {
    if (prop in target) return target[prop];
    return async () => {
      console.info('[mockup] ignored store call:', String(prop));
      return [];
    };
  },
});

// ── Boot (mirrors the real app.js wiring) ─────────────────────────────────────
const appEl = document.getElementById('app');

function onRoute(route) {
  renderApp(appEl, route, store);
}
rerender = () => onRoute(router.getCurrentRoute());

router.init();
router.subscribe(onRoute);
onRoute(router.getCurrentRoute());

// Internal hash links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#/"]');
  if (link) {
    e.preventDefault();
    router.navigate(link.getAttribute('href'));
  }
});
