/**
 * مجتمع الطلاب — Student Community Page
 * Discussion forum and knowledge sharing space
 */

export function CommunityPage(store) {
    const state = store.getState();
    const user = state.user || {};

    const discussions = [
        {
            id: 'd1',
            author: 'نواف الحربي',
            avatar: 'ن',
            avatarColor: '#5CC481',
            title: 'نصيحة: كيف تخطط لأسبوعك بفعالية 📝',
            content: 'بعد تجربة عدة طرق، وجدت أن أفضل طريقة هي تحديد 3 مهام أساسية كل يوم فقط. ركّز على الأهم أولاً وخلّ الباقي إضافي. شاركوني تجاربكم!',
            time: 'منذ ساعتين',
            likes: 12,
            replies: 5,
            tags: ['إنتاجية', 'نصائح'],
            isPinned: true,
        },
        {
            id: 'd2',
            author: 'عبدالعزيز السبيعي',
            avatar: 'ع',
            avatarColor: '#E8C26D',
            title: 'شاركوني: أفضل كتاب قرأته هذا الشهر 📚',
            content: 'أنا خلصت كتاب "العادات الذرية" والصراحة غيّر نظرتي لبناء العادات. الفكرة الرئيسية إنك تركز على تغييرات صغيرة ١٪ كل يوم. إيش أفضل كتاب قرأتوه؟',
            time: 'منذ 4 ساعات',
            likes: 18,
            replies: 8,
            tags: ['ثقافة', 'كتب'],
            isPinned: false,
        },
        {
            id: 'd3',
            author: 'تركي العنزي',
            avatar: 'ت',
            avatarColor: '#51ADAD',
            title: 'مساعدة: كيف أرفع ملف PDF بجودة عالية؟ 🤔',
            content: 'يا شباب عندي مشكلة في رفع الملفات، الملف يكون واضح عندي بس لما أرفعه يطلع مضغوط. أحد يعرف الحل؟',
            time: 'منذ 6 ساعات',
            likes: 3,
            replies: 2,
            tags: ['مساعدة', 'تقنية'],
            isPinned: false,
        },
        {
            id: 'd4',
            author: 'عبدالله الزهراني',
            avatar: 'ع',
            avatarColor: '#9B72CF',
            title: 'تجربتي في المبادرة التطوعية: دروس مستفادة 🤝',
            content: 'السلام عليكم، حبيت أشارككم تجربتي في تنظيم حملة نظافة الحي. كان التحدي الأكبر هو جمع المتطوعين بس بعد ما نشرت بالواتساب تفاجأت بالإقبال. النتيجة كانت مذهلة والحمدلله!',
            time: 'أمس',
            likes: 24,
            replies: 11,
            tags: ['تطوع', 'تجارب'],
            isPinned: false,
        },
        {
            id: 'd5',
            author: 'يزيد الغامدي',
            avatar: 'ي',
            avatarColor: '#FFA726',
            title: 'تحدي الأسبوع: احفظ 5 كلمات إنجليزية جديدة يومياً 🌟',
            content: 'بدأت تحدي حفظ 5 كلمات إنجليزية جديدة كل يوم وأكتبها بجمل. اللي يبي يشارك يكتب هنا عشان نتابع مع بعض!',
            time: 'أمس',
            likes: 15,
            replies: 7,
            tags: ['تحدي', 'لغات'],
            isPinned: false,
        },
    ];

    const activeMembers = [
        { name: 'نواف الحربي', avatar: 'ن', color: '#5CC481', posts: 23 },
        { name: 'عبدالعزيز السبيعي', avatar: 'ع', color: '#E8C26D', posts: 19 },
        { name: 'عبدالله الزهراني', avatar: 'ع', color: '#9B72CF', posts: 16 },
        { name: 'تركي العنزي', avatar: 'ت', color: '#51ADAD', posts: 14 },
        { name: 'يزيد الغامدي', avatar: 'ي', color: '#FFA726', posts: 11 },
    ];

    const tagColors = {
        'إنتاجية': '#5CC481',
        'نصائح': '#51ADAD',
        'ثقافة': '#9B72CF',
        'كتب': '#E8C26D',
        'مساعدة': '#EF4444',
        'تقنية': '#51ADAD',
        'تطوع': '#5CC481',
        'تجارب': '#FFA726',
        'تحدي': '#9B72CF',
        'لغات': '#E8C26D',
    };

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Header -->
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 40px;">
                <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(81, 173, 173, 0.15); color: #51ADAD; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(81, 173, 173, 0.3);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                    <h1 style="margin: 0; font-size: 2.25rem;">مجتمع الطلاب</h1>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">مساحة للنقاش وتبادل الخبرات بين المشاركين</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 320px; gap: 32px;">
                <!-- Main Feed -->
                <div>
                    <!-- New Post Card -->
                    <div class="card" style="padding: 24px; margin-bottom: 24px; border: 2px dashed var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary)); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; flex-shrink: 0;">
                                ${user.name ? user.name.charAt(0) : 'ط'}
                            </div>
                            <div style="flex: 1; padding: 12px 16px; background: var(--bg-main); border-radius: var(--radius-md); border: 1px solid var(--border-color); color: var(--text-tertiary); cursor: pointer;" onclick="alert('✍️ هذه نسخة عرض تجريبية — الكتابة غير متاحة حالياً.')">
                                شارك فكرة أو سؤال مع المجتمع...
                            </div>
                        </div>
                    </div>

                    <!-- Discussions -->
                    ${discussions.map(post => `
                        <div class="card" style="padding: 28px; margin-bottom: 16px; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='var(--border-color)'">
                            ${post.isPinned ? `<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px; font-size: 0.8rem; color: var(--color-primary); font-weight: 600;">📌 مثبّت</div>` : ''}
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                                <div style="width: 42px; height: 42px; border-radius: 50%; background: ${post.avatarColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.1rem; flex-shrink: 0;">
                                    ${post.avatar}
                                </div>
                                <div>
                                    <div style="font-weight: 700; font-size: 0.95rem;">${post.author}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-tertiary);">${post.time}</div>
                                </div>
                            </div>
                            <h3 style="font-size: 1.15rem; margin-bottom: 10px; line-height: 1.5;">${post.title}</h3>
                            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 16px;">${post.content}</p>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    ${post.tags.map(tag => `<span style="background: ${tagColors[tag] || '#5CC481'}18; color: ${tagColors[tag] || '#5CC481'}; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">${tag}</span>`).join('')}
                                </div>
                                <div style="display: flex; gap: 20px; color: var(--text-tertiary); font-size: 0.88rem;">
                                    <span style="cursor: pointer;" onclick="alert('❤️ هذه نسخة عرض تجريبية')">❤️ ${post.likes}</span>
                                    <span>💬 ${post.replies}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Sidebar -->
                <div>
                    <!-- Community Stats -->
                    <div class="card" style="padding: 24px; margin-bottom: 20px;">
                        <h3 style="font-size: 1.1rem; margin-bottom: 16px;">📊 إحصائيات المجتمع</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div style="text-align: center; padding: 16px; background: var(--bg-main); border-radius: var(--radius-md);">
                                <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary);">14</div>
                                <div style="font-size: 0.8rem; color: var(--text-tertiary);">عضو</div>
                            </div>
                            <div style="text-align: center; padding: 16px; background: var(--bg-main); border-radius: var(--radius-md);">
                                <div style="font-size: 1.5rem; font-weight: 800; color: #E8C26D;">47</div>
                                <div style="font-size: 0.8rem; color: var(--text-tertiary);">موضوع</div>
                            </div>
                            <div style="text-align: center; padding: 16px; background: var(--bg-main); border-radius: var(--radius-md);">
                                <div style="font-size: 1.5rem; font-weight: 800; color: #9B72CF;">128</div>
                                <div style="font-size: 0.8rem; color: var(--text-tertiary);">رد</div>
                            </div>
                            <div style="text-align: center; padding: 16px; background: var(--bg-main); border-radius: var(--radius-md);">
                                <div style="font-size: 1.5rem; font-weight: 800; color: #51ADAD;">89%</div>
                                <div style="font-size: 0.8rem; color: var(--text-tertiary);">مشاركة</div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Members -->
                    <div class="card" style="padding: 24px; margin-bottom: 20px;">
                        <h3 style="font-size: 1.1rem; margin-bottom: 16px;">🌟 الأعضاء الأكثر نشاطاً</h3>
                        ${activeMembers.map((member, i) => `
                            <div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; ${i < activeMembers.length - 1 ? 'border-bottom: 1px solid var(--border-color);' : ''}">
                                <div style="width: 36px; height: 36px; border-radius: 50%; background: ${member.color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9rem; flex-shrink: 0;">
                                    ${member.avatar}
                                </div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 0.9rem;">${member.name}</div>
                                    <div style="font-size: 0.78rem; color: var(--text-tertiary);">${member.posts} مشاركة</div>
                                </div>
                                ${i === 0 ? '<span style="font-size: 1.1rem;">🥇</span>' : i === 1 ? '<span style="font-size: 1.1rem;">🥈</span>' : i === 2 ? '<span style="font-size: 1.1rem;">🥉</span>' : ''}
                            </div>
                        `).join('')}
                    </div>

                    <!-- Popular Tags -->
                    <div class="card" style="padding: 24px;">
                        <h3 style="font-size: 1.1rem; margin-bottom: 16px;">🏷️ الوسوم الشائعة</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${Object.entries(tagColors).map(([tag, color]) => `
                                <span style="background: ${color}18; color: ${color}; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
