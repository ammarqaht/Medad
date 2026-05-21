/**
 * المكتبة الرقمية — Digital Library Page
 * Displays curated books and resources for the student
 */

export function DigitalLibrary(store) {
    const state = store.getState();

    const books = [
        {
            title: 'فن اللامبالاة',
            author: 'مارك مانسون',
            category: 'تطوير ذات',
            cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
            rating: 4.5,
            pages: 224,
            description: 'كتاب يتحدث عن كيفية اختيار ما يستحق الاهتمام في حياتنا والتوقف عن السعي وراء الإيجابية الزائفة.',
            downloadUrl: '#',
            isNew: true,
        },
        {
            title: 'العادات الذرية',
            author: 'جيمس كلير',
            category: 'إنتاجية',
            cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
            rating: 4.8,
            pages: 320,
            description: 'دليل عملي لبناء عادات جيدة والتخلص من العادات السيئة من خلال تغييرات صغيرة تحقق نتائج مذهلة.',
            downloadUrl: '#',
            isNew: false,
        },
        {
            title: 'فكر وازدد ثراء',
            author: 'نابليون هيل',
            category: 'ريادة أعمال',
            cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400',
            rating: 4.3,
            pages: 256,
            description: 'من أشهر كتب التنمية البشرية، يقدم ١٣ خطوة لتحقيق النجاح المالي والشخصي.',
            downloadUrl: '#',
            isNew: false,
        },
        {
            title: 'قوة الآن',
            author: 'إيكهارت تول',
            category: 'روحانيات',
            cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400',
            rating: 4.6,
            pages: 236,
            description: 'رحلة في اكتشاف الذات والعيش في اللحظة الحاضرة بعيداً عن قلق الماضي والمستقبل.',
            downloadUrl: '#',
            isNew: true,
        },
        {
            title: 'تحدث كما يفعل تيد',
            author: 'كارمين غالو',
            category: 'مهارات',
            cover: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&q=80&w=400',
            rating: 4.2,
            pages: 288,
            description: 'أسرار أفضل العروض التقديمية في العالم وكيف تصبح متحدثاً مؤثراً ومقنعاً.',
            downloadUrl: '#',
            isNew: false,
        },
        {
            title: 'الأب الغني والأب الفقير',
            author: 'روبرت كيوساكي',
            category: 'مالية',
            cover: 'https://images.unsplash.com/photo-1553729459-afe8f2e2ed65?auto=format&fit=crop&q=80&w=400',
            rating: 4.4,
            pages: 336,
            description: 'يكسر هذا الكتاب الأسطورة التي تقول إنك بحاجة لراتب مرتفع لتصبح غنياً.',
            downloadUrl: '#',
            isNew: false,
        },
    ];

    const articles = [
        { title: 'كيف تبني روتيناً صباحياً مثالياً؟', source: 'مجلة الإنتاجية', readTime: '5 دقائق', url: '#' },
        { title: '10 مهارات يحتاجها كل شاب في 2026', source: 'مدونة حلية', readTime: '8 دقائق', url: '#' },
        { title: 'فن إدارة الوقت: دليل عملي للطلاب', source: 'منصة تعلّم', readTime: '6 دقائق', url: '#' },
        { title: 'مقدمة في الذكاء الاصطناعي للمبتدئين', source: 'أكاديمية التقنية', readTime: '12 دقيقة', url: '#' },
    ];

    const categoryColors = {
        'تطوير ذات': '#9B72CF',
        'إنتاجية': '#5CC481',
        'ريادة أعمال': '#E8C26D',
        'روحانيات': '#51ADAD',
        'مهارات': '#FFA726',
        'مالية': '#EF4444',
    };

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        let stars = '';
        for (let i = 0; i < full; i++) stars += '★';
        if (half) stars += '☆';
        return stars;
    };

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Header -->
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 40px;">
                <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(155, 114, 207, 0.15); color: #9B72CF; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(155, 114, 207, 0.3);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div>
                    <h1 style="margin: 0; font-size: 2.25rem;">المكتبة الرقمية</h1>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">مجموعة كتب ومصادر مختارة لإثراء معرفتك</p>
                </div>
            </div>

            <!-- Stats Bar -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
                <div class="card" style="padding: 24px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 800; color: var(--color-primary);">${books.length}</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">كتاب متاح</div>
                </div>
                <div class="card" style="padding: 24px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 800; color: #E8C26D;">${articles.length}</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">مقال مقترح</div>
                </div>
                <div class="card" style="padding: 24px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 800; color: #9B72CF;">${books.filter(b => b.isNew).length}</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">إضافة جديدة</div>
                </div>
            </div>

            <!-- Books Grid -->
            <h2 style="font-size: 1.5rem; margin-bottom: 24px;">📚 الكتب المقترحة</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-bottom: 48px;">
                ${books.map(book => `
                    <div class="card card-interactive" style="padding: 0; overflow: hidden; cursor: pointer;">
                        <div style="position: relative; height: 160px; overflow: hidden;">
                            <img src="${book.cover}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
                            ${book.isNew ? `<span style="position: absolute; top: 12px; right: 12px; background: var(--color-primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">جديد</span>` : ''}
                            <span style="position: absolute; top: 12px; left: 12px; background: ${categoryColors[book.category] || '#5CC481'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">${book.category}</span>
                        </div>
                        <div style="padding: 24px;">
                            <h3 style="font-size: 1.2rem; margin-bottom: 6px;">${book.title}</h3>
                            <p style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 12px;">${book.author} · ${book.pages} صفحة</p>
                            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px;">${book.description}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #E8C26D; font-size: 1.1rem; letter-spacing: 2px;">${renderStars(book.rating)} <span style="color: var(--text-tertiary); font-size: 0.8rem; letter-spacing: normal;">${book.rating}</span></span>
                                <button class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;" onclick="alert('📖 هذه نسخة عرض تجريبية — التحميل غير متاح حالياً.')">تحميل PDF</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Articles Section -->
            <h2 style="font-size: 1.5rem; margin-bottom: 24px;">📰 مقالات مقترحة</h2>
            <div class="card" style="padding: 0; overflow: hidden;">
                ${articles.map((article, i) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 28px; ${i < articles.length - 1 ? 'border-bottom: 1px solid var(--border-color);' : ''} transition: background var(--transition-fast); cursor: pointer;" onmouseover="this.style.background='var(--bg-surface-hover)'" onmouseout="this.style.background='transparent'" onclick="alert('📰 هذه نسخة عرض تجريبية — المقال غير متاح حالياً.')">
                        <div>
                            <h4 style="font-size: 1.05rem; margin-bottom: 4px;">${article.title}</h4>
                            <span style="font-size: 0.85rem; color: var(--text-tertiary);">${article.source} · ${article.readTime}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
