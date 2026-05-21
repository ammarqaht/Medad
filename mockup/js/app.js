import { router } from './core/router.js';
import { store } from './store/state.js';
import { renderApp } from './core/renderer.js';

// Application Entrypoint
class HilyahApp {
  constructor() {
    this.appElement = document.getElementById('app');
    this.init();
  }

  async init() {
    // Check initial route
    router.init();

    // Fetch initial data (Atomic initialization for stability)
    store.initialize();
    
    if (store.getState().user?.role === 'admin') {
      store.fetchAdminSubmissions();
    }
    
    // Subscribe to route changes
    router.subscribe(this.onRouteChange.bind(this));
    
    // Subscribe to store changes to trigger reactivity
    store.subscribe(() => {
      this.onRouteChange(router.getCurrentRoute());
    });
    
    // Initial Render
    this.onRouteChange(router.getCurrentRoute());
    
    // Add event listeners for global interactive elements
    this.setupGlobalListeners();
  }

  onRouteChange(route) {
    // Render the appropriate layout and page based on state and route
    renderApp(this.appElement, route, store);
  }

  setupGlobalListeners() {
    // Event delegation for internal links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#/"]');
      if (link) {
        e.preventDefault();
        router.navigate(link.getAttribute('href'));
      }
    });

    this.setupInactivityTimer();
  }

  setupInactivityTimer() {
    let timeout;
    const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes

    const resetTimer = () => {
      clearTimeout(timeout);
      
      // Only run timer if a user is actually logged in
      if (!store.getState().user) return;

      // Update persistent activity timestamp
      store.recordActivity();

      timeout = setTimeout(() => {
        console.log('Session timed out due to inactivity.');
        store.logout();
      }, TIMEOUT_DURATION);
    };

    // Important for mobile: check when app is resumed from background
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (store.isSessionExpired()) {
          console.log('Session expired while in background.');
          store.logout();
        } else {
          resetTimer();
        }
      }
    });

    // Listen for any significant user interaction
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(name => {
      document.addEventListener(name, resetTimer, { passive: true });
    });

    // Handle background sync/initial check
    if (store.isSessionExpired()) {
      store.logout();
    } else {
      resetTimer();
    }
  }
}

// Bootstrap app immediately (DOM is already ready when this module runs via Next.js)
window.app = new HilyahApp();
