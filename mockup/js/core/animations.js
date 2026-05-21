/**
 * Premium animation layer — runs after each page render.
 *
 * Components:
 *   • Typewriters       — [data-typewriter] elements type their text char-by-char
 *   • Scroll reveal     — .reveal-on-scroll fades/slides in when in viewport
 *   • Stagger           — sets --i on .stagger-grid children for CSS-delayed entrance
 *   • Hero parallax     — rAF-gated mousemove → translates .parallax-layer by data-depth (desktop only)
 */

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Typewriter ─────────────────────────────────────────────────────────────
function initTypewriters(root) {
    const nodes = root.querySelectorAll('[data-typewriter]');
    nodes.forEach(el => {
        if (el.dataset.typewriterStarted === '1') return;
        const text = el.dataset.typewriter || '';
        if (!text) return;
        el.dataset.typewriterStarted = '1';

        const cursor = el.parentElement?.querySelector('.typewriter-cursor');
        el.textContent = '';

        if (prefersReducedMotion()) {
            el.textContent = text;
            cursor?.classList.add('is-done');
            return;
        }

        const baseSpeed = parseInt(el.dataset.speed, 10) || 55;
        const initialDelay = parseInt(el.dataset.delay, 10) || 250;
        const chars = Array.from(text);
        let i = 0;

        const step = () => {
            if (i >= chars.length) {
                cursor?.classList.add('is-done');
                return;
            }
            el.textContent += chars[i++];
            // Slight variance to feel human (±20%)
            const jitter = baseSpeed * (0.8 + Math.random() * 0.4);
            setTimeout(step, jitter);
        };
        setTimeout(step, initialDelay);
    });
}

// ── Scroll reveal ──────────────────────────────────────────────────────────
let scrollObserver = null;
function initScrollReveal(root) {
    if (!('IntersectionObserver' in window)) {
        root.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-visible'));
        return;
    }
    // Reset observer each render — old targets may be gone
    if (scrollObserver) scrollObserver.disconnect();
    scrollObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    root.querySelectorAll('.reveal-on-scroll:not(.is-visible)').forEach(el => {
        scrollObserver.observe(el);
    });
}

// ── Stagger index setter ───────────────────────────────────────────────────
function initStagger(root) {
    root.querySelectorAll('.stagger-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.style.setProperty('--i', i);
        });
    });
}

// ── Hero parallax (desktop only) ───────────────────────────────────────────
function initHeroParallax(root) {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const hero = root.querySelector('.hero-section');
    if (!hero) return;

    const layers = hero.querySelectorAll('.parallax-layer');
    if (!layers.length) return;

    let raf = null;
    let pending = null;

    const apply = () => {
        raf = null;
        if (!pending) return;
        const { x, y } = pending;
        layers.forEach(layer => {
            const depth = parseFloat(layer.dataset.depth || '8');
            layer.style.transform = `translate3d(${(-x * depth).toFixed(1)}px, ${(-y * depth).toFixed(1)}px, 0)`;
        });
    };

    const onMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
        pending = { x, y };
        if (!raf) raf = requestAnimationFrame(apply);
    };

    const reset = () => {
        pending = { x: 0, y: 0 };
        if (!raf) raf = requestAnimationFrame(apply);
    };

    hero.addEventListener('mousemove', onMove, { passive: true });
    hero.addEventListener('mouseleave', reset, { passive: true });
}

// ── Orchestrator — called from renderer after each page mount ──────────────
export function initAnimations(root = document) {
    initStagger(root);
    initScrollReveal(root);
    initTypewriters(root);
    initHeroParallax(root);
}
