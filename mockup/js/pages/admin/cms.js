import { Icons } from '../../components/icons.js';
import { supabase } from '../../store/supabase.js';

/**
 * Admin Content Management — per-feature content editing + visibility toggles
 */

// The 4 controllable platform features
const PLATFORM_FEATURES = [
    {
        key: 'idea',
        icon: Icons.Idea,
        label: 'فكرة البرنامج',
        color: 'rgba(232, 194, 109, 0.15)',
        colorBorder: 'rgba(232, 194, 109, 0.4)',
        colorText: 'var(--color-primary-light)',
        description: 'الصفحة التعريفية التي توضح فلسفة وأهداف البرنامج.',
        contentKeys: [
            { key: 'card.idea.title', label: 'عنوان البطاقة (لوحة الطالب)' },
            { key: 'card.idea.description', label: 'وصف البطاقة (لوحة الطالب)' },
            { key: 'idea.page.title', label: 'عنوان الصفحة' },
            { key: 'idea.main.heading', label: 'العنوان الرئيسي' },
            { key: 'idea.main.heading.highlight', label: 'الجزء المميز من العنوان' },
            { key: 'idea.main.quote', label: 'الاقتباس التعريفي' },
            { key: 'idea.pillar1.title', label: 'ركيزة 1 — العنوان' },
            { key: 'idea.pillar1.description', label: 'ركيزة 1 — الوصف' },
            { key: 'idea.pillar2.title', label: 'ركيزة 2 — العنوان' },
            { key: 'idea.pillar2.description', label: 'ركيزة 2 — الوصف' },
            { key: 'idea.pillar3.title', label: 'ركيزة 3 — العنوان' },
            { key: 'idea.pillar3.description', label: 'ركيزة 3 — الوصف' },
        ]
    },
    {
        key: 'calendar',
        icon: Icons.Calendar,
        label: 'التقويم',
        color: 'rgba(92, 196, 129, 0.15)',
        colorBorder: 'rgba(92, 196, 129, 0.4)',
        colorText: 'var(--color-primary)',
        description: 'صفحة التقويم الأسبوعي للعادات والمهام.',
        contentKeys: [
            { key: 'card.calendar.title', label: 'عنوان البطاقة (لوحة الطالب)' },
            { key: 'card.calendar.description', label: 'وصف البطاقة (لوحة الطالب)' },
            { key: 'calendar.page.title', label: 'عنوان الصفحة' },
            { key: 'calendar.page.subtitle', label: 'وصف الصفحة' },
        ]
    },
    {
        key: 'tasks',
        icon: Icons.Tasks,
        label: 'المهام',
        color: 'rgba(81, 173, 173, 0.15)',
        colorBorder: 'rgba(81, 173, 173, 0.4)',
        colorText: 'var(--color-primary-dark)',
        description: 'صفحة عرض وتسليم المهام للطلاب.',
        contentKeys: [
            { key: 'card.tasks.title', label: 'عنوان البطاقة (لوحة الطالب)' },
            { key: 'card.tasks.description', label: 'وصف البطاقة (لوحة الطالب)' },
            { key: 'tasks.page.title', label: 'عنوان الصفحة' },
            { key: 'tasks.page.subtitle', label: 'وصف الصفحة' },
            { key: 'ui.submit.task', label: 'نص زر تسليم المهمة' },
        ]
    },
    {
        key: 'points',
        icon: Icons.Points,
        label: 'النقاط',
        color: 'rgba(255, 167, 38, 0.15)',
        colorBorder: 'rgba(255, 167, 38, 0.4)',
        colorText: '#FFA726',
        description: 'صفحة تتبع النقاط والإنجازات الشخصية.',
        contentKeys: [
            { key: 'card.points.title', label: 'عنوان البطاقة (لوحة الطالب)' },
            { key: 'card.points.description', label: 'وصف البطاقة (لوحة الطالب)' },
            { key: 'points.page.title', label: 'عنوان الصفحة' },
            { key: 'points.page.subtitle', label: 'وصف الصفحة' },
        ]
    },
    {
        key: 'leaderboard',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
        label: 'الترتيب',
        color: 'rgba(92, 196, 129, 0.15)',
        colorBorder: 'rgba(92, 196, 129, 0.4)',
        colorText: 'var(--color-primary)',
        description: 'لوحة شرف الطلاب مرتبة حسب النقاط.',
        contentKeys: [
            { key: 'nav.leaderboard', label: 'تسمية الرابط في القائمة' },
        ]
    }
];

// Additional hero/general content
const GENERAL_KEYS = [
    { key: 'hero.title', label: 'مقدمة شاشة الترحيب' },
    { key: 'hero.subtitle', label: 'نص شاشة الترحيب' },
    { key: 'dashboard.guide.title', label: 'عنوان قسم البطاقات' },
];

export function AdminCMS(store) {
    const content = store.getState().content;
    const visibility = store.getState().featureVisibility;

    const renderToggle = (featKey, isVisible) => `
        <label class="vis-toggle" data-feat="${featKey}" style="display: flex; align-items: center; gap: 12px; cursor: pointer; user-select: none;">
            <div style="
                position: relative; width: 52px; height: 28px;
                background: ${isVisible ? 'var(--color-primary)' : 'var(--bg-surface-hover)'};
                border-radius: 14px; border: 1px solid ${isVisible ? 'var(--color-primary)' : 'var(--border-color)'};
                transition: all 0.3s;
            ">
                <div style="
                    position: absolute; top: 3px; 
                    ${isVisible ? 'left: 26px' : 'left: 3px'};
                    width: 20px; height: 20px; background: white; border-radius: 50%;
                    transition: all 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.25);
                "></div>
            </div>
            <span style="font-weight: 600; font-size: 0.95rem; color: ${isVisible ? 'var(--color-primary)' : 'var(--text-tertiary)'};">
                ${isVisible ? 'ظاهر للطلاب' : 'مخفي مؤقتاً'}
            </span>
        </label>
    `;

    const renderFeaturePanel = (feat) => {
        const isVisible = visibility[feat.key] !== false;
        return `
            <div class="card" style="padding: 0; overflow: hidden; border-radius: var(--radius-xl);" id="feat-panel-${feat.key}">
                <!-- Feature Header -->
                <div style="
                    padding: 28px 36px; background: var(--bg-surface-hover);
                    border-bottom: 1px solid var(--border-color);
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 16px;
                ">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="
                            width: 48px; height: 48px; border-radius: var(--radius-sm);
                            background: ${feat.color}; color: ${feat.colorText};
                            border: 1px solid ${feat.colorBorder};
                            display: flex; align-items: center; justify-content: center;
                        ">
                            ${feat.icon}
                        </div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.25rem;">${feat.label}</h3>
                            <p style="margin: 4px 0 0; color: var(--text-secondary); font-size: 0.9rem;">${feat.description}</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <!-- Visibility toggle -->
                        ${renderToggle(feat.key, isVisible)}
                        <!-- Expand/collapse -->
                        <button class="btn feat-expand-btn" data-feat="${feat.key}" style="
                            padding: 8px 18px; background: transparent;
                            border: 1px solid var(--border-color); font-weight: 600;
                            color: var(--text-secondary);
                        ">تعديل المحتوى</button>
                    </div>
                </div>

                <!-- Content editing rows (collapsed by default) -->
                <div class="feat-content-rows" data-feat="${feat.key}" style="display: none;">
                    ${feat.contentKeys.map(ck => `
                        <div style="
                            display: grid; grid-template-columns: 220px 1fr auto;
                            align-items: start; gap: 16px;
                            padding: 18px 36px; border-bottom: 1px solid var(--border-color);
                            transition: background var(--transition-fast);
                        " onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
                            <div style="padding-top: 10px; font-size: 0.95rem; font-weight: 500; color: var(--text-secondary);">${ck.label}</div>
                            <textarea class="cms-input form-input" data-key="${ck.key}" rows="2"
                                style="width: 100%; resize: vertical; font-size: 0.95rem; font-family: inherit; padding: 10px 14px; line-height: 1.5;">${content[ck.key] || ''}</textarea>
                            <div style="display: flex; gap: 8px; padding-top: 6px; flex-shrink: 0;">
                                <button class="btn cms-save-btn" data-key="${ck.key}"
                                    style="padding: 8px 14px; background: rgba(92,196,129,0.1); color: var(--color-primary); border: 1px solid rgba(92,196,129,0.3); font-weight: 600; white-space: nowrap;">حفظ</button>
                                <button class="btn cms-reset-btn" data-key="${ck.key}"
                                    style="padding: 8px 12px; background: transparent; color: var(--text-tertiary); border: 1px solid var(--border-color);" title="إعادة للافتراضي">↺</button>
                            </div>
                        </div>
                    `).join('')}
                    <div style="padding: 20px 36px; background: var(--bg-main);">
                        <button class="btn cms-save-section-btn" data-feat="${feat.key}"
                            style="padding: 10px 24px; background: var(--color-primary); color: white; border: none; font-weight: 700;">
                            حفظ تعديلات ${feat.label}
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    // Hidden-feature warning banner
    const hiddenCount = Object.values(visibility).filter(v => v === false).length;

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(92, 196, 129, 0.15); color: var(--color-primary); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(92, 196, 129, 0.3);">
                        ${Icons.Idea}
                    </div>
                    <div>
                        <h1 style="margin: 0; font-size: 2.25rem;">إدارة المحتوى</h1>
                        <p style="margin: 4px 0 0; color: var(--text-secondary); font-size: 1.05rem;">تحكم في محتوى وإظهار كل قسم من أقسام المنصة.</p>
                    </div>
                </div>
            </div>

            ${hiddenCount > 0 ? `
                <div style="padding: 16px 24px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius-md); margin-bottom: 28px; display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.2rem;">⚠️</span>
                    <span style="color: #EF4444; font-weight: 600;">${hiddenCount} قسم مخفي حالياً عن الطلاب</span>
                </div>
            ` : ''}

            <!-- General Content -->
            <div class="card" style="padding: 0; overflow: hidden; border-radius: var(--radius-xl); margin-bottom: 32px;">
                <div style="padding: 24px 36px; background: var(--bg-surface-hover); border-bottom: 1px solid var(--border-color);">
                    <h3 style="margin: 0;">المحتوى العام للمنصة</h3>
                </div>
                ${GENERAL_KEYS.map(ck => `
                    <div style="display: grid; grid-template-columns: 220px 1fr auto; align-items: start; gap: 16px; padding: 18px 36px; border-bottom: 1px solid var(--border-color);" onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
                        <div style="padding-top: 10px; font-size: 0.95rem; font-weight: 500; color: var(--text-secondary);">${ck.label}</div>
                        <textarea class="cms-input form-input" data-key="${ck.key}" rows="2"
                            style="width: 100%; resize: vertical; font-size: 0.95rem; font-family: inherit; padding: 10px 14px;">${content[ck.key] || ''}</textarea>
                        <div style="display: flex; gap: 8px; padding-top: 6px;">
                            <button class="btn cms-save-btn" data-key="${ck.key}" style="padding: 8px 14px; background: rgba(92,196,129,0.1); color: var(--color-primary); border: 1px solid rgba(92,196,129,0.3); font-weight: 600;">حفظ</button>
                            <button class="btn cms-reset-btn" data-key="${ck.key}" style="padding: 8px 12px; background: transparent; color: var(--text-tertiary); border: 1px solid var(--border-color);" title="إعادة للافتراضي">↺</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Slider Management -->
            <div class="card" style="padding: 0; overflow: hidden; border-radius: var(--radius-xl); margin-bottom: 32px;">
                <div style="padding: 24px 36px; background: var(--bg-surface-hover); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                    <h3 style="margin: 0;">إدارة السلايدرز (أدب الأسبوع)</h3>
                    <label class="slider-active-toggle" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                        <input type="checkbox" id="slider-active-checkbox" ${store.getState().weeklySlider.active ? 'checked' : ''} style="display:none;">
                        <div class="vis-toggle-proxy" style="
                            position: relative; width: 52px; height: 28px;
                            background: ${store.getState().weeklySlider.active ? 'var(--color-primary)' : 'var(--bg-surface-hover)'};
                            border-radius: 14px; border: 1px solid ${store.getState().weeklySlider.active ? 'var(--color-primary)' : 'var(--border-color)'};
                            transition: all 0.3s;
                        ">
                            <div style="
                                position: absolute; top: 3px; 
                                ${store.getState().weeklySlider.active ? 'left: 26px' : 'left: 3px'};
                                width: 20px; height: 20px; background: white; border-radius: 50%;
                                transition: all 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.25);
                            "></div>
                        </div>
                        <span style="font-weight: 600; font-size: 0.95rem;">تفعيل السلايدر</span>
                    </label>
                </div>
                <div style="padding: 28px 36px; display: flex; flex-direction: column; gap: 24px;">
                    <div style="display: grid; grid-template-columns: 220px 1fr; align-items: start; gap: 20px;">
                        <span style="font-weight: 500; color: var(--text-secondary); padding-top: 10px;">معاينة الأجهزة</span>
                        <div style="display: flex; gap: 32px; flex-wrap: wrap; background: var(--bg-main); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                            <!-- Laptop Preview -->
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                                <div class="preview-laptop">
                                    <img id="slider-preview-desktop" src="${store.getState().weeklySlider.image}" style="width: 100%; height: 100%; object-fit: cover; display: ${store.getState().weeklySlider.image ? 'block' : 'none'};" />
                                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; font-size: 0.75rem;">شاشة اللابتوب</div>
                                </div>
                                <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-tertiary);">معاينة اللابتوب</span>
                            </div>

                            <!-- Mobile Preview -->
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                                <div class="preview-mobile">
                                    <img id="slider-preview-mobile" src="${store.getState().weeklySlider.imageMobile || store.getState().weeklySlider.image}" style="width: 100%; height: 100%; object-fit: contain; background: #000; display: ${(store.getState().weeklySlider.imageMobile || store.getState().weeklySlider.image) ? 'block' : 'none'};" />
                                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; font-size: 0.6rem; text-align: center;">شاشة الجوال</div>
                                </div>
                                <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-tertiary);">معاينة الجوال</span>
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 220px 1fr; align-items: start; gap: 20px;">
                        <span style="font-weight: 500; color: var(--text-secondary); padding-top: 10px;">صور السلايدر</span>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <!-- Desktop Upload -->
                            <div id="slider-drop-zone-desktop" class="upload-box" style="
                                border: 2px dashed var(--border-color); border-radius: var(--radius-lg); padding: 20px; text-align: center; cursor: pointer; background: rgba(92,196,129,0.02);
                            ">
                                <div style="font-size: 1.5rem; color: var(--color-primary);">${Icons.Upload || '📁'}</div>
                                <div style="font-weight: 700; font-size: 0.85rem; margin-top: 8px;">صورة اللابتوب</div>
                                <div style="font-size: 0.7rem; color: var(--text-tertiary);">1920x800 أو عرضية</div>
                                <input type="file" id="slider-file-input-desktop" style="display: none;" accept="image/*" />
                            </div>

                            <!-- Mobile Upload -->
                            <div id="slider-drop-zone-mobile" class="upload-box" style="
                                border: 2px dashed var(--border-color); border-radius: var(--radius-lg); padding: 20px; text-align: center; cursor: pointer; background: rgba(81, 173, 173, 0.02);
                            ">
                                <div style="font-size: 1.5rem; color: var(--color-primary-dark);">${Icons.Upload || '📁'}</div>
                                <div style="font-weight: 700; font-size: 0.85rem; margin-top: 8px;">صورة الجوال</div>
                                <div style="font-size: 0.7rem; color: var(--text-tertiary);">صورة مربعه</div>
                                <input type="file" id="slider-file-input-mobile" style="display: none;" accept="image/*" />
                            </div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 220px 1fr; align-items: center; gap: 20px;">
                        <span style="font-weight: 500; color: var(--text-secondary);">عنوان السلايدر</span>
                        <input type="text" id="slider-title-input" class="form-input" value="${store.getState().weeklySlider.title}">
                    </div>
                    <div style="display: grid; grid-template-columns: 220px 1fr; align-items: start; gap: 20px;">
                        <span style="font-weight: 500; color: var(--text-secondary); padding-top: 10px;">النص الفرعي</span>
                        <textarea id="slider-subtitle-input" class="form-input" rows="3">${store.getState().weeklySlider.subtitle}</textarea>
                    </div>
                    <div style="margin-top: 8px; border-top: 1px solid var(--border-color); padding-top: 24px;">
                        <button id="save-slider-btn" class="btn" style="background: var(--color-primary); color: white; padding: 12px 32px; font-weight: 700; border:none;">حفظ تغييرات السلايدر</button>
                    </div>
                </div>
            </div>

            <!-- Per-feature panels -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
                ${PLATFORM_FEATURES.map(f => renderFeaturePanel(f)).join('')}
            </div>

            <!-- Save toast -->
            <div id="cms-toast" style="display: none; position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: var(--color-primary); color: white; padding: 14px 28px; border-radius: 30px; font-weight: 600; z-index: 9999; box-shadow: var(--shadow-md); white-space: nowrap;">
                ✓ تم حفظ التغييرات
            </div>
        </div>
    `;
}

AdminCMS.attachEvents = (store) => {
    const showToast = (msg = '✓ تم الحفظ') => {
        const t = document.getElementById('cms-toast');
        if (!t) return;
        t.textContent = msg;
        t.style.display = 'block';
        setTimeout(() => { t.style.display = 'none'; }, 2500);
    };

    // Individual save
    document.querySelectorAll('.cms-save-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            const inp = document.querySelector(`.cms-input[data-key="${key}"]`);
            if (inp) { store.updateContent(key, inp.value); showToast(`✓ تم حفظ: ${key.split('.').pop()}`); }
        });
    });

    // Individual reset
    document.querySelectorAll('.cms-reset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            if (confirm('إعادة هذا النص للقيمة الافتراضية؟')) {
                store.resetContent(key);
                const inp = document.querySelector(`.cms-input[data-key="${key}"]`);
                if (inp) inp.value = store.getState().content[key] || '';
                showToast('↺ تمت إعادة التعيين');
            }
        });
    });

    // Save whole section
    document.querySelectorAll('.cms-save-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const featKey = btn.getAttribute('data-feat');
            const rows = document.querySelectorAll(`.feat-content-rows[data-feat="${featKey}"] .cms-input`);
            const updates = {};
            rows.forEach(inp => { updates[inp.getAttribute('data-key')] = inp.value; });
            store.batchUpdateContent(updates);
            showToast('✓ تم حفظ تعديلات القسم');
        });
    });

    // Expand/collapse content rows
    document.querySelectorAll('.feat-expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const featKey = btn.getAttribute('data-feat');
            const rows = document.querySelector(`.feat-content-rows[data-feat="${featKey}"]`);
            const isOpen = rows.style.display !== 'none';
            rows.style.display = isOpen ? 'none' : 'block';
            btn.textContent = isOpen ? 'تعديل المحتوى' : 'إغلاق';
        });
    });

    // Visibility toggles
    document.querySelectorAll('.vis-toggle').forEach(label => {
        label.addEventListener('click', () => {
            const featKey = label.getAttribute('data-feat');
            const current = store.getState().featureVisibility[featKey] !== false;
            store.setFeatureVisibility(featKey, !current);
            showToast(!current ? `✓ تم إظهار "${featKey}" للطلاب` : `⚠️ تم إخفاء "${featKey}" عن الطلاب`);
            // Re-render just this panel by re-dispatching hashchange
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
    });

    // Slider Management Events
    const sliderActiveCheckbox = document.getElementById('slider-active-checkbox');
    const sliderActiveToggle = document.querySelector('.slider-active-toggle');
    if (sliderActiveToggle && sliderActiveCheckbox) {
        sliderActiveToggle.addEventListener('click', (e) => {
            if (e.target.id === 'slider-active-checkbox') return; // let checkbox handle itself
            const current = store.getState().weeklySlider.active;
            store.updateWeeklySlider({ active: !current });
            showToast(!current ? '✓ تم تفعيل السلايدر' : '⚠️ تم إيقاف السلايدر');
            window.dispatchEvent(new HashChangeEvent('hashchange')); // Re-render
        });
    }

    const saveSliderBtn = document.getElementById('save-slider-btn');
    if (saveSliderBtn) {
        saveSliderBtn.addEventListener('click', () => {
            const title = document.getElementById('slider-title-input').value;
            const subtitle = document.getElementById('slider-subtitle-input').value;
            const imgDesktop = document.getElementById('slider-preview-desktop').src;
            const imgMobile = document.getElementById('slider-preview-mobile').src;
            store.updateWeeklySlider({
                image: imgDesktop,
                imageMobile: imgMobile,
                title,
                subtitle
            });
            showToast('✓ تم حفظ بيانات السلايدر (لابتوب وجوال)');
        });
    }

    // ── Slider File Upload ──────────────────────────────────────────────────
    const handleFileUpload = async (file, type = 'desktop') => {
        if (!file || !file.type.startsWith('image/')) {
            alert('الرجاء اختيار صورة صالحة');
            return;
        }

        const overlay = document.getElementById('slider-upload-overlay');
        if (overlay) overlay.style.display = 'flex';

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `slider_${type}_${Date.now()}.${fileExt}`;
            const filePath = `sliders/${fileName}`;

            // 1. Upload to Supabase 'assets' bucket
            const { data, error } = await supabase.storage
                .from('assets')
                .upload(filePath, file);

            if (error) throw error;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            // 3. Update Previews
            if (type === 'desktop') {
                const p = document.getElementById('slider-preview-desktop');
                if (p) { p.src = publicUrl; p.style.display = 'block'; }
            } else {
                const p = document.getElementById('slider-preview-mobile');
                if (p) { p.src = publicUrl; p.style.display = 'block'; }
            }

            // 4. Persist immediately to backend (state + /api/settings) so the
            // dashboard picks up the new URL on its next sync, even if the
            // admin forgets to click the save button.
            const field = type === 'desktop' ? 'image' : 'imageMobile';
            await store.updateWeeklySlider({ [field]: publicUrl });

            showToast('✓ تم رفع الصورة وحفظها');
        } catch (err) {
            console.error('Slider upload error:', err);
            alert('⚠️ فشل الرفع');
        } finally {
            if (overlay) overlay.style.display = 'none';
        }
    };

    const inputDesktop = document.getElementById('slider-file-input-desktop');
    const dropDesktop = document.getElementById('slider-drop-zone-desktop');
    const inputMobile = document.getElementById('slider-file-input-mobile');
    const dropMobile = document.getElementById('slider-drop-zone-mobile');

    dropDesktop?.addEventListener('click', () => inputDesktop.click());
    inputDesktop?.addEventListener('change', (e) => handleFileUpload(e.target.files[0], 'desktop'));

    dropMobile?.addEventListener('click', () => inputMobile.click());
    inputMobile?.addEventListener('change', (e) => handleFileUpload(e.target.files[0], 'mobile'));

    // Desktop Drag/Drop
    dropDesktop?.addEventListener('dragover', (e) => { e.preventDefault(); dropDesktop.style.borderColor = 'var(--color-primary)'; });
    dropDesktop?.addEventListener('dragleave', () => { dropDesktop.style.borderColor = 'var(--border-color)'; });
    dropDesktop?.addEventListener('drop', (e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files[0], 'desktop'); });

    // Mobile Drag/Drop
    dropMobile?.addEventListener('dragover', (e) => { e.preventDefault(); dropMobile.style.borderColor = 'var(--color-primary)'; });
    dropMobile?.addEventListener('dragleave', () => { dropMobile.style.borderColor = 'var(--border-color)'; });
    dropMobile?.addEventListener('drop', (e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files[0], 'mobile'); });
};
