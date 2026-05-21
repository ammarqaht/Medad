/**
 * نظام الشارات — Badges System Page
 * Displays achievement badges earned by the student
 */

export function BadgesPage(store) {
    const state = store.getState();
    const user = state.user || {};

    const allBadges = [
        {
            id: 'b1',
            name: 'البداية القوية',
            description: 'سلّم أول مهمة في البرنامج',
            icon: '🚀',
            color: '#5CC481',
            earned: true,
            earnedDate: '2026-03-01',
            rarity: 'شائعة',
        },
        {
            id: 'b2',
            name: 'القارئ النهم',
            description: 'أكمل 3 مهام في المسار الثقافي',
            icon: '📖',
            color: '#9B72CF',
            earned: true,
            earnedDate: '2026-03-18',
            rarity: 'شائعة',
        },
        {
            id: 'b3',
            name: 'التقني الواعد',
            description: 'أنجز مهمة تقنية بدرجة كاملة',
            icon: '💻',
            color: '#51ADAD',
            earned: true,
            earnedDate: '2026-04-05',
            rarity: 'نادرة',
        },
        {
            id: 'b4',
            name: 'أسبوع الانضباط',
            description: 'سلّم جميع المهام في أسبوع واحد في وقتها',
            icon: '🔥',
            color: '#FFA726',
            earned: true,
            earnedDate: '2026-04-12',
            rarity: 'نادرة',
        },
        {
            id: 'b5',
            name: 'المتصدر',
            description: 'احتل المركز الأول في لوحة المتصدرين',
            icon: '👑',
            color: '#E8C26D',
            earned: false,
            earnedDate: null,
            rarity: 'أسطورية',
        },
        {
            id: 'b6',
            name: 'العقل الحديدي',
            description: 'أكمل 3 مهام في مسار الذاكرة الحديدية',
            icon: '🧠',
            color: '#EF4444',
            earned: false,
            earnedDate: null,
            rarity: 'نادرة',
        },
        {
            id: 'b7',
            name: 'صانع الأثر',
            description: 'نفّذ مبادرة تطوعية ناجحة',
            icon: '🤝',
            color: '#5CC481',
            earned: true,
            earnedDate: '2026-04-22',
            rarity: 'شائعة',
        },
        {
            id: 'b8',
            name: 'المبدع الإعلامي',
            description: 'صمّم بوستر حصل على درجة ممتازة',
            icon: '🎨',
            color: '#9B72CF',
            earned: false,
            earnedDate: null,
            rarity: 'نادرة',
        },
        {
            id: 'b9',
            name: 'الماراثوني',
            description: 'أكمل 10 مهام متتالية بدون رفض',
            icon: '🏃',
            color: '#51ADAD',
            earned: false,
            earnedDate: null,
            rarity: 'أسطورية',
        },
        {
            id: 'b10',
            name: 'الخاتمة المشرّفة',
            description: 'أكمل جميع مهام البرنامج بنجاح',
            icon: '🎓',
            color: '#E8C26D',
            earned: false,
            earnedDate: null,
            rarity: 'أسطورية',
        },
    ];

    const earnedCount = allBadges.filter(b => b.earned).length;
    const totalCount = allBadges.length;
    const progressPercent = Math.round((earnedCount / totalCount) * 100);

    const rarityColors = {
        'شائعة': '#5CC481',
        'نادرة': '#9B72CF',
        'أسطورية': '#E8C26D',
    };

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Header -->
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 40px;">
                <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(232, 194, 109, 0.15); color: #E8C26D; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(232, 194, 109, 0.3);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                </div>
                <div>
                    <h1 style="margin: 0; font-size: 2.25rem;">نظام الشارات</h1>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">شارات تحفيزية تُمنح عند تحقيق الإنجازات</p>
                </div>
            </div>

            <!-- Progress Overview -->
            <div class="card" style="padding: 32px; margin-bottom: 40px; background: linear-gradient(135deg, rgba(232,194,109,0.08) 0%, rgba(92,196,129,0.05) 100%);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                    <div>
                        <h3 style="font-size: 1.3rem; margin-bottom: 8px;">تقدمك في الشارات</h3>
                        <p style="color: var(--text-secondary); margin: 0;">حصلت على <strong style="color: var(--color-primary);">${earnedCount}</strong> من أصل <strong>${totalCount}</strong> شارات</p>
                    </div>
                    <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-primary);">${progressPercent}%</div>
                </div>
                <div style="height: 10px; background: var(--bg-surface-hover); border-radius: 20px; overflow: hidden;">
                    <div style="height: 100%; width: ${progressPercent}%; background: linear-gradient(90deg, var(--color-primary), #E8C26D); border-radius: 20px; transition: width 1s ease;"></div>
                </div>
            </div>

            <!-- Earned Badges -->
            <h2 style="font-size: 1.4rem; margin-bottom: 24px; color: var(--color-primary);">✨ الشارات المكتسبة (${earnedCount})</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 48px;">
                ${allBadges.filter(b => b.earned).map(badge => `
                    <div class="card card-interactive" style="padding: 28px; text-align: center; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 12px; left: 12px;">
                            <span style="background: ${rarityColors[badge.rarity]}22; color: ${rarityColors[badge.rarity]}; padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; border: 1px solid ${rarityColors[badge.rarity]}44;">${badge.rarity}</span>
                        </div>
                        <div style="font-size: 3rem; margin-bottom: 16px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">${badge.icon}</div>
                        <h3 style="font-size: 1.15rem; margin-bottom: 8px;">${badge.name}</h3>
                        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.6;">${badge.description}</p>
                        <div style="font-size: 0.78rem; color: var(--text-tertiary);">حصلت عليها في ${badge.earnedDate}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Locked Badges -->
            <h2 style="font-size: 1.4rem; margin-bottom: 24px; color: var(--text-tertiary);">🔒 شارات لم تُكتسب بعد (${totalCount - earnedCount})</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                ${allBadges.filter(b => !b.earned).map(badge => `
                    <div class="card" style="padding: 28px; text-align: center; opacity: 0.6; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 12px; left: 12px;">
                            <span style="background: ${rarityColors[badge.rarity]}22; color: ${rarityColors[badge.rarity]}; padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; border: 1px solid ${rarityColors[badge.rarity]}44;">${badge.rarity}</span>
                        </div>
                        <div style="font-size: 3rem; margin-bottom: 16px; filter: grayscale(100%) opacity(0.5);">${badge.icon}</div>
                        <h3 style="font-size: 1.15rem; margin-bottom: 8px; color: var(--text-tertiary);">${badge.name}</h3>
                        <p style="font-size: 0.88rem; color: var(--text-tertiary); margin-bottom: 12px; line-height: 1.6;">${badge.description}</p>
                        <div style="font-size: 0.78rem; color: var(--text-tertiary);">🔒 لم تُكتسب بعد</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
