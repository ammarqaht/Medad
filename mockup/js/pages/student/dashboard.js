import { Icons } from '../../components/icons.js';

export function StudentDashboard(store) {
    const state = store.getState();
    const user = state.user || {};
    const c = (key) => state.content[key] || key;
    const vis = state.featureVisibility || {};

    const greeting = `${c('hero.title')} ${user.name || ''} ✨`;
    const greetingAttr = String(greeting).replace(/"/g, '&quot;');

    // Built-in dashboard cards
    const staticCards = [
        {
            href: '#/student/idea',
            visKey: 'idea',
            iconBg: 'rgba(232, 194, 109, 0.15)',
            iconColor: 'var(--color-primary-light)',
            iconBorder: 'rgba(232, 194, 109, 0.3)',
            icon: Icons.Idea,
            title: c('فكرة البرنامج'),
            desc: c('card.idea.description')
        },
        {
            href: '#/student/calendar',
            visKey: 'calendar',
            iconBg: 'rgba(92, 196, 129, 0.15)',
            iconColor: 'var(--color-primary)',
            iconBorder: 'rgba(92, 196, 129, 0.3)',
            icon: Icons.Calendar,
            title: c('التقويم'),
            desc: c('card.calendar.description')
        },
        {
            href: '#/student/tasks',
            visKey: 'tasks',
            iconBg: 'rgba(81, 173, 173, 0.15)',
            iconColor: 'var(--color-primary-dark)',
            iconBorder: 'rgba(81, 173, 173, 0.3)',
            icon: Icons.Tasks,
            title: c('المهام'),
            desc: c('card.tasks.description')
        },
        {
            href: '#/student/points',
            visKey: 'points',
            iconBg: 'rgba(255, 167, 38, 0.15)',
            iconColor: '#FFA726',
            iconBorder: 'rgba(255, 167, 38, 0.3)',
            icon: Icons.Points,
            title: c('النقاط'),
            desc: c('card.points.description')
        },
        {
            href: '#/student/leaderboard',
            visKey: 'leaderboard',
            iconBg: 'rgba(92, 196, 129, 0.15)',
            iconColor: 'var(--color-primary)',
            iconBorder: 'rgba(92, 196, 129, 0.3)',
            icon: Icons.Winner || Icons.Points,
            title: c('nav.leaderboard'),
            desc: c('ui.leaderboard.title')
        }
    ].filter(card => vis[card.visKey] !== false);

    // Route mapping for dynamic features
    const featureRoutes = {
        'f1': '#/student/library',    // المكتبة الرقمية
        'f2': '#/student/badges',     // نظام الشارات
        'f3': '#/student/community',  // مجتمع الطلاب
    };

    // Dynamic database-backed cards
    const dynamicCards = (state.features || [])
        .filter(f => f.visible)
        .map(f => ({
            href: featureRoutes[f.id] || '#',
            iconBg: `${f.color}22`,
            iconColor: f.color,
            iconBorder: `${f.color}44`,
            icon: Icons[f.icon] || Icons.Points,
            title: f.name,
            desc: f.description
        }));

    const allCards = [...staticCards, ...dynamicCards];

    const renderDesktopCard = (card, i) => `
        <a href="${card.href}" class="card card-interactive" style="display: flex; flex-direction: column; text-decoration: none; color: inherit; height: 100%;">
            <div class="float-icon" style="width: 56px; height: 56px; border-radius: var(--radius-md); background: ${card.iconBg}; color: ${card.iconColor}; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; border: 1px solid ${card.iconBorder}; --float-delay: ${(i * 0.6).toFixed(2)}s;">
                ${card.icon}
            </div>
            <h3 style="font-size: 1.3rem; margin-bottom: 12px;">${card.title}</h3>
            <p style="font-size: 0.95rem; margin: 0; color: var(--text-secondary); line-height: 1.5;">${card.desc}</p>
        </a>
    `;

    const renderMobileSquareCard = (card, i) => `
        <a href="${card.href}" class="card-interactive" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:20px 16px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-decoration:none; color:inherit;">
            <div class="float-icon" style="width:52px; height:52px; border-radius:26px; background:${card.iconBg}; color:${card.iconColor}; display:flex; align-items:center; justify-content:center; margin-bottom:12px; border:1px solid ${card.iconBorder}; --float-delay: ${(i * 0.4).toFixed(2)}s;">
                ${card.icon}
            </div>
            <span style="font-weight:700; font-size:0.95rem; color:var(--text-primary); text-align:center;">${card.title}</span>
        </a>
    `;

    const slider = state.weeklySlider || { active: false };

    const renderHeroSlideDesktop = () => `
        <div class="hero-section responsive-flex responsive-padding-huge" style="
            border-radius: var(--radius-xl);
            padding: 56px 64px; color: white;
            display: flex; align-items: center; justify-content: space-between;
            box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.2);
            position: relative; overflow: hidden;
            min-height: 380px; margin: 0;
        ">
            <!-- Background Image Alternative for Hero on Desktop -->
            <div style="position: absolute; inset: 0; background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%); z-index: 0;"></div>
            <div class="parallax-layer" data-depth="14" style="position: absolute; top: -50%; right: -10%; width: 400px; height: 400px; background: rgba(255,255,255,0.15); border-radius: 50%; filter: blur(60px); pointer-events: none;"></div>
            <div class="parallax-layer" data-depth="10" style="position: absolute; bottom: -50%; left: 10%; width: 300px; height: 300px; background: rgba(232, 194, 109, 0.25); border-radius: 50%; filter: blur(60px); pointer-events: none;"></div>
            <div class="parallax-layer" data-depth="5" style="position: absolute; top: 50%; right: 5%; transform: translateY(-50%); opacity: 0.12; pointer-events: none; z-index: 0;">
                <img src="حلية.svg" alt="" style="height: 180px; width: auto; filter: brightness(0) invert(1);" />
            </div>
            <div class="responsive-flex-item" style="position: relative; z-index: 1; min-width: 0; flex: 1;">
                <h1 style="color: white; font-size: 3rem; margin-bottom: 20px; letter-spacing: -0.02em;"><span data-typewriter="${greetingAttr}" data-speed="50" data-delay="280"></span><span class="typewriter-cursor" aria-hidden="true"></span></h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 1.2rem; max-width: 600px; line-height: 1.6;">${c('hero.subtitle')}</p>
            </div>
            <div class="responsive-flex-item" style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 16px; flex-shrink: 0;">
                <div class="hero-medallion" style="width: 180px; height: 180px; border-radius: 50%; background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4);">
                    <img src="حلية.svg" alt="Hilyah Logo" style="height: 130px; width: auto; filter: brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0,0,0,0.3));" />
                </div>
                <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.35); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 30px; padding: 8px 28px; color: white; font-size: 1.2rem; font-weight: 700;">حِلْيَة</div>
            </div>
        </div>
    `;

    const renderAdabSlide = () => {
        const isMobile = window.innerWidth <= 768;
        const imageUrl = (isMobile && slider.imageMobile) ? slider.imageMobile : (slider.image || '');

        if (isMobile) {
            // Mirror the .hero-section-mobile structure exactly so both slides
            // have identical dimensions in the slider.
            return `
                <div class="hero-section-mobile" style="
                    color: white;
                    padding: 28px 20px 32px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.2);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 18px;
                    text-align: center;
                    background: #141618;
                    height: 100%;
                    min-height: 100%;
                    box-sizing: border-box;
                ">
                    <img src="${imageUrl}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" onerror="this.style.display='none'">
                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.25) 100%); z-index: 1;"></div>

                    <!-- 1. Logo and Brand (top, centered) -->
                    <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                        <div style="width: 88px; height: 88px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 1.5px solid rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
                            <img src="حلية.svg" alt="Logo" style="height: 62px; width: auto; filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />
                        </div>
                        <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 20px; padding: 3px 14px; color: white; font-size: 0.8rem; font-weight: 700;">حِلْيَة</div>
                    </div>

                    <!-- 2. Adab Content (below) -->
                    <div style="position: relative; z-index: 2; width: 100%; display: flex; flex-direction: column; align-items: center;">
                        <span style="background: var(--color-primary); color: white; padding: 4px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-bottom: 10px;">أدب الأسبوع</span>
                        <h2 style="color: white; font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; line-height: 1.25; letter-spacing: -0.01em;">${slider.title}</h2>
                        <p style="color: rgba(255,255,255,0.95); font-size: 0.875rem; line-height: 1.6; margin: 0; max-width: 100%;">${slider.subtitle}</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="custom-slide responsive-padding-huge" style="
                position: relative;
                overflow: hidden;
                min-height: 450px !important;
                height: 450px !important;
            ">
                <img src="${imageUrl}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; background: #141618;" onerror="this.style.display='none'">
                <div class="custom-slide-overlay" style="z-index: 1; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);"></div>

                <div class="custom-slide-content" style="z-index: 2; position: relative; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 20px 40px;">
                    <!-- Branded Logo Section -->
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.22); border: 1.5px solid rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                            <img src="حلية.svg" alt="Logo" style="height: 38px; width: auto; filter: brightness(0) invert(1);" />
                        </div>
                        <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); border-radius: 20px; padding: 4px 14px; color: white; font-size: 0.8rem; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">حِلْيَة</div>
                    </div>

                    <!-- Bottom Content -->
                    <div style="margin-top: auto;">
                        <span class="custom-slide-tag" style="width: fit-content; margin-bottom: 12px;">أدب الأسبوع</span>
                        <h2 style="color: white; font-size: 2.8rem; margin-bottom: 12px; line-height: 1.2; font-weight: 800;">${slider.title}</h2>
                        <p style="color: rgba(255,255,255,0.95); font-size: 1.25rem; margin: 0; line-height: 1.6; max-width: 800px;">${slider.subtitle}</p>
                    </div>
                </div>
            </div>
        `;
    };

    const renderHeroSlideMobile = () => `
        <div class="hero-section-mobile" style="
            background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
            color: white;
            padding: 28px 20px 32px;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.2);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18px;
            text-align: center;
            height: 100%;
            min-height: 100%;
            box-sizing: border-box;
        ">
            <!-- Background Decoration -->
            <div class="float-blob" style="position: absolute; top: -10%; right: -10%; width: 180px; height: 180px; background: rgba(255,255,255,0.10); border-radius: 50%; filter: blur(40px); pointer-events: none; z-index: 0; --float-delay: 0s;"></div>
            <div class="float-blob" style="position: absolute; bottom: -20%; left: -10%; width: 160px; height: 160px; background: rgba(232, 194, 109, 0.20); border-radius: 50%; filter: blur(40px); pointer-events: none; z-index: 0; --float-delay: 1.8s;"></div>

            <!-- 1. Logo and Brand (top, centered) -->
            <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="width: 88px; height: 88px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 1.5px solid rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 8px 32px rgba(0,0,0,0.15);">
                    <img src="حلية.svg" alt="Hilyah Logo" style="height: 62px; width: auto; filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.2));" />
                </div>
                <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 20px; padding: 3px 14px; color: white; font-size: 0.8rem; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">حِلْيَة</div>
            </div>

            <!-- 2. Text Content (below) -->
            <div style="position: relative; z-index: 2; width: 100%;">
                <h1 style="color: white; font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; line-height: 1.25; letter-spacing: -0.01em;"><span data-typewriter="${greetingAttr}" data-speed="42" data-delay="200"></span><span class="typewriter-cursor" aria-hidden="true"></span></h1>
                <p style="color: rgba(255,255,255,0.95); font-size: 0.875rem; line-height: 1.6; margin: 0; max-width: 100%;">${c('hero.subtitle')}</p>
            </div>
        </div>
    `;

    const renderSlider = (isMobile) => {
        const slides = [];
        // Use the rich slider on both desktop and mobile, relying on responsive CSS
        if (isMobile) {
            slides.push(renderHeroSlideMobile());
        } else {
            slides.push(renderHeroSlideDesktop());
        }

        // Force active if it's explicitly true or string "true"
        if (slider.active === true || slider.active === 'true') {
            slides.push(renderAdabSlide());
        }

        if (slides.length === 1) return slides[0];

        return `
            <div class="slider-container" id="${isMobile ? 'mobile' : 'desktop'}-slider">
                <div class="slider-wrapper">
                    ${slides.map(s => `<div class="slider-slide">${s}</div>`).join('')}
                </div>
                <div class="slider-dots">
                    ${slides.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
                </div>
            </div>
        `;
    };

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            
            <!-- ── DESKTOP LAYOUT ── -->
            <div class="desktop-only">
                ${renderSlider(false)}

                <!-- Navigation Cards -->
                <div class="reveal-on-scroll" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
                    <h2 data-editable="dashboard.guide.title" style="font-size: 1.75rem; margin: 0;">${c('dashboard.guide.title')}</h2>
                </div>

                ${allCards.length > 0 ? `
                    <div class="stagger-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px;">
                        ${allCards.map(renderDesktopCard).join('')}
                    </div>
                ` : `
                    <div style="text-align:center; padding:80px; color:var(--text-tertiary);">
                        <div style="font-size:3rem; margin-bottom:16px;">⚙️</div>
                        <p style="font-size:1.1rem;">جميع الأقسام مخفية حالياً. تواصل مع المشرف.</p>
                    </div>
                `}
            </div>

            <!-- ── MOBILE LAYOUT (App-like) ── -->
            <div class="mobile-only">
                ${renderSlider(true)}

                <!-- 2x2 Square Grid -->
                ${allCards.length > 0 ? `
                    <div class="stagger-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top:24px;">
                        ${allCards.map(renderMobileSquareCard).join('')}
                    </div>
                ` : `
                    <div style="text-align:center; padding:40px; color:var(--text-tertiary); background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-color); margin-top:24px;">
                        <p style="font-size:1rem; margin:0;">الأقسام مخفية حالياً</p>
                    </div>
                `}
            </div>

        </div>
    `;
}

StudentDashboard.attachEvents = (store) => {
    const initSlider = (id) => {
        const container = document.getElementById(id);
        if (!container) return;

        const wrapper = container.querySelector('.slider-wrapper');
        const dots = container.querySelectorAll('.dot');
        const slides = container.querySelectorAll('.slider-slide');
        if (slides.length <= 1) return;

        let current = 0;
        let interval;
        let startX = 0;
        let isDragging = false;

        const goTo = (index) => {
            current = index;
            // Since it's RTL, the slides are laid out from right to left.
            // Move wrapper to the RIGHT by (index * 100%) to bring the next slide from the left into view.
            wrapper.style.transform = `translateX(${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        };

        const next = () => goTo((current + 1) % slides.length);
        const prev = () => goTo((current - 1 + slides.length) % slides.length);

        const start = () => {
            stop();
            interval = setInterval(next, 5000);
        };

        const stop = () => clearInterval(interval);

        // Touch Swipe Logic (RTL Friendly)
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            stop();
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;

            // In RTL: 
            // Swipe Left (diff < -50) means user wants next slide (which is to the left).
            // Swipe Right (diff > 50) means user wants previous slide (which is to the right).
            if (diff < -50) {
                next();
            } else if (diff > 50) {
                prev();
            }

            isDragging = false;
            start();
        }, { passive: true });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goTo(parseInt(dot.dataset.index));
                start();
            });
        });

        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);

        start();
    };

    initSlider('desktop-slider');
    initSlider('mobile-slider');
};
