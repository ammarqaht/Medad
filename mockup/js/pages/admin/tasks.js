import { Icons } from '../../components/icons.js';

/**
 * Admin — Review submitted tasks with custom point assignment
 */

const filterState = { q: '', task: '', admin: '' };

export function escAttr(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

const TRACK_STYLE = {
    'الثقافي':         { bg: 'rgba(232,194,109,0.12)', text: 'var(--color-primary-light)', border: 'rgba(232,194,109,0.35)' },
    'مسار تقني':      { bg: 'rgba(81,173,173,0.12)',  text: 'var(--color-primary-dark)', border: 'rgba(81,173,173,0.35)' },
    'الذاكرة الحديدية':{ bg: 'rgba(155,114,207,0.12)', text: '#9B72CF', border: 'rgba(155,114,207,0.35)' },
    'الاجتماعي':      { bg: 'rgba(92,196,129,0.12)',  text: 'var(--color-primary)', border: 'rgba(92,196,129,0.35)' },
};

function trackBadge(track) {
    const s = TRACK_STYLE[track] || { bg: 'var(--bg-surface-hover)', text: 'var(--text-secondary)', border: 'var(--border-color)' };
    return `<span style="background:${s.bg}; color:${s.text}; border:1px solid ${s.border}; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">${track}</span>`;
}

export function renderSubmissionRow(sub, adminsById = {}) {
    const isPending  = sub.status === 'pending';
    const isApproved = sub.status === 'approved';
    const isRejected = sub.status === 'rejected';

    const assignedIds = Array.isArray(sub.taskAssignedAdmins) ? sub.taskAssignedAdmins : [];
    const assignedNames = assignedIds.map(id => adminsById[id]?.name).filter(Boolean);
    const assignedLabel = assignedIds.length === 0 ? 'جميع المشرفين' : (assignedNames.join('، ') || 'غير محدد');
    const assignedFilterAttr = assignedIds.length === 0 ? 'all' : assignedIds.join(',');

    const statusBadge = isApproved
        ? `<span style="background:rgba(92,196,129,0.1); color:var(--color-primary); border:1px solid rgba(92,196,129,0.3); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">مقبولة ✓</span>`
        : isRejected
        ? `<span style="background:rgba(239,68,68,0.1); color:#EF4444; border:1px solid rgba(239,68,68,0.3); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">مردودة ✗</span>`
        : `<span style="background:rgba(255,167,38,0.1); color:#FFA726; border:1px solid rgba(255,167,38,0.3); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">بانتظار المراجعة</span>`;

    const studentAttr = (sub.studentName || '').toLowerCase();
    const taskAttr = (sub.taskTitle || '').toLowerCase();

    return `
        <div class="submission-card" data-sub-id="${sub.id}" data-student="${studentAttr}" data-task="${taskAttr}" data-status="${sub.status}" data-assigned="${assignedFilterAttr}" style="
            background: var(--bg-surface); border: 1px solid var(--border-color);
            border-radius: var(--radius-xl); padding: 28px 32px; margin-bottom: 20px;
            transition: box-shadow 0.2s;
            ${isPending ? 'border-right: 4px solid #FFA726;' : isApproved ? 'border-right: 4px solid var(--color-primary);' : 'border-right: 4px solid #EF4444;'}
        ">
            <!-- Row 1: Student + Track + Status -->
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,var(--color-primary-light),var(--color-primary)); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:1.1rem; flex-shrink:0;">
                        ${sub.studentName?.charAt(0) || 'ط'}
                    </div>
                    <div>
                        <div style="font-weight:700; font-size:1rem; color:var(--text-primary);">${sub.studentName}</div>
                        <div style="font-size:0.82rem; color:var(--text-tertiary);">${new Date(sub.submittedAt).toLocaleDateString('ar-SA')}</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                    ${trackBadge(sub.taskTrack)}
                    ${statusBadge}
                </div>
            </div>

            <!-- Row 2: Task title + Max points -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                <h4 style="margin:0; font-size:1.15rem; color:var(--text-primary);">${sub.taskTitle}</h4>
                <div style="background:rgba(232,194,109,0.1); border:1px solid rgba(232,194,109,0.3); padding:5px 14px; border-radius:20px; font-weight:700; color:var(--color-primary-light);">
                    الحد الأقصى: ${sub.taskMaxPoints} 🌟
                </div>
            </div>

            <!-- Row 3: Assigned admins -->
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px; font-size:0.85rem; color:var(--text-tertiary); flex-wrap:wrap;">
                <span style="font-weight:700;">المشرف المسؤول:</span>
                <span style="color:var(--text-secondary); font-weight:600;">${assignedLabel}</span>
            </div>

            <!-- Submission content preview -->
            ${(() => {
                if (!sub.submissionContent) return '';
                const url = sub.submissionContent.trim();

                if (url === 'acknowledgement://confirmed') {
                    return `
                        <div style="margin-bottom:16px;">
                            <div style="font-size:0.78rem; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">طريقة التسليم</div>
                            <div style="background:rgba(81,173,173,0.06); border:1px solid rgba(81,173,173,0.25); border-radius:var(--radius-md); padding:16px 20px; display:flex; align-items:center; gap:14px;">
                                <div style="font-size:2rem;">🤝</div>
                                <div>
                                    <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">أقر الطالب بإنجاز المهمة</div>
                                    <div style="font-size:0.88rem; color:var(--text-secondary);">تم إرسال الإقرار بدون مرفقات — يرجى تقييم الإنجاز بناءً على المعرفة بالطالب.</div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                const isUrl = url.startsWith('http');
                const ext = url.split('.').pop()?.toLowerCase();
                
                const isImage = isUrl && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
                const isVideo = isUrl && ['mp4', 'webm', 'mov'].includes(ext);
                const isPdf   = isUrl && ext === 'pdf';

                if (isImage) {
                    return `
                        <div style="margin-bottom:16px;">
                            <div style="font-size:0.78rem; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">إثبات التسليم (صورة)</div>
                            <div style="width:100%; max-width:400px; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-color); cursor:zoom-in;">
                                <img src="${url}" style="width:100%; height:auto; display:block;" onclick="window.open('${url}', '_blank')" alt="الإنجاز" />
                            </div>
                        </div>
                    `;
                }

                if (isVideo) {
                    return `
                        <div style="margin-bottom:16px;">
                            <div style="font-size:0.78rem; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">إثبات التسليم (فيديو)</div>
                            <div style="width:100%; max-width:500px; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-color); background:black;">
                                <video controls style="width:100%; height:auto; display:block;">
                                    <source src="${url}" type="video/${ext === 'mov' ? 'quicktime' : 'mp4'}">
                                    المتصفح لا يدعم تشغيل الفيديو.
                                </video>
                            </div>
                        </div>
                    `;
                }

                if (isPdf) {
                    return `
                        <div style="margin-bottom:16px;">
                            <div style="font-size:0.78rem; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px;">إثبات التسليم (PDF)</div>
                            <a href="${url}" target="_blank" class="btn" style="
                                display:inline-flex; align-items:center; gap:10px; padding:12px 24px;
                                background:rgba(239,68,68,0.08); color:#EF4444; border:1px solid rgba(239,68,68,0.25);
                                text-decoration:none; font-weight:700; border-radius:var(--radius-md);
                            ">
                                📄 عرض ملف المستند (PDF)
                            </a>
                        </div>
                    `;
                }

                // Fallback for text
                return `
                    <div style="background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:14px 18px; margin-bottom:16px;">
                        <div style="font-size:0.78rem; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">محتوى التسليم</div>
                        <div style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6; white-space:pre-wrap;">${sub.submissionContent}</div>
                    </div>
                `;
            })()}

            <!-- Approval result (if decided) -->
            ${isApproved ? `
                <div style="display:flex; align-items:center; gap:16px; margin-bottom:14px; flex-wrap:wrap;">
                    <div id="points-display-${sub.id}" style="background:rgba(92,196,129,0.1); border:1px solid rgba(92,196,129,0.3); border-radius:var(--radius-sm); padding:10px 20px; font-weight:700; font-size:1.05rem; color:var(--color-primary);">
                        النقاط المُمنوحة: ${sub.earnedPoints} / ${sub.taskMaxPoints} 🌟
                    </div>
                    <button onclick="window.showEditPoints('${sub.id}', ${sub.earnedPoints}, ${sub.taskMaxPoints})"
                        style="background:rgba(232,194,109,0.1); border:1px solid rgba(232,194,109,0.3); color:var(--color-primary-light); padding:8px 16px; border-radius:var(--radius-sm); font-size:0.85rem; font-weight:700; cursor:pointer;">
                        ✏️ تعديل النقاط
                    </button>
                    ${sub.adminComment ? `<div style="font-size:0.9rem; color:var(--text-secondary); font-style:italic;">"${sub.adminComment}"</div>` : ''}
                </div>
                <div id="points-edit-${sub.id}" style="display:none; margin-bottom:14px;">
                    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px 18px;">
                        <label style="font-size:0.9rem; font-weight:700; color:var(--text-secondary);">النقاط الجديدة (0 – ${sub.taskMaxPoints}):</label>
                        <input id="points-input-${sub.id}" type="number" min="0" max="${sub.taskMaxPoints}" value="${sub.earnedPoints}"
                            style="width:90px; padding:8px 12px; border:1px solid var(--border-color); border-radius:var(--radius-sm); background:var(--bg-surface); color:var(--text-primary); font-size:1rem; text-align:center;" />
                        <button onclick="window.saveEditPoints('${sub.id}', ${sub.taskMaxPoints})"
                            style="background:rgba(92,196,129,0.15); border:1px solid rgba(92,196,129,0.4); color:var(--color-primary); padding:8px 18px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer;">
                            حفظ
                        </button>
                        <button onclick="window.cancelEditPoints('${sub.id}')"
                            style="background:var(--bg-surface-hover); border:1px solid var(--border-color); color:var(--text-secondary); padding:8px 14px; border-radius:var(--radius-sm); font-weight:600; cursor:pointer;">
                            إلغاء
                        </button>
                        <span id="points-save-status-${sub.id}" style="font-size:0.85rem;"></span>
                    </div>
                </div>
            ` : isRejected ? `
                <div style="margin-bottom:14px; color:#EF4444; font-size:0.9rem; font-style:italic;">
                    ${sub.adminComment ? `تعليق المشرف: "${sub.adminComment}"` : 'تم الرفض بدون تعليق.'}
                </div>
            ` : ''}

            <!-- Actions (only for pending) -->
            ${isPending ? `
                <div style="display:flex; gap:10px; margin-top:4px;">
                    <button class="btn review-sub-btn" data-sub-id="${sub.id}"
                        style="padding:10px 24px; background:rgba(92,196,129,0.1); color:var(--color-primary); border:1px solid rgba(92,196,129,0.3); font-weight:700;">
                        قبول وتقييم النقاط
                    </button>
                    <button class="btn reject-sub-btn" data-sub-id="${sub.id}"
                        style="padding:10px 20px; background:rgba(239,68,68,0.08); color:#EF4444; border:1px solid rgba(239,68,68,0.25); font-weight:700;">
                        رد المهمة
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

export function AdminTasks(store) {
    const state = store.getState();
    const submissions = state.submissions || [];
    const admins = state.admins || [];
    const adminsById = Object.fromEntries(admins.map(a => [a.id, a]));
    const pending   = submissions.filter(s => s.status === 'pending');

    const pendingCount = pending.length;

    const uniqueTasks = [...new Set(pending.map(s => s.taskTitle).filter(Boolean))].sort();

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Header -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:40px; flex-wrap:wrap; gap:16px;">
                <div style="display:flex; align-items:center; gap:16px;">
                    <div style="width:56px; height:56px; border-radius:var(--radius-md); background:rgba(81,173,173,0.15); color:var(--color-primary-dark); display:flex; align-items:center; justify-content:center; border:1px solid rgba(81,173,173,0.3);">
                        ${Icons.Tasks}
                    </div>
                    <div>
                        <h1 style="margin:0; font-size:2.25rem;">مراجعة التسليمات</h1>
                        <p style="margin:4px 0 0; color:var(--text-secondary); font-size:1.05rem;">اعتمد أو ارفض تسليمات الطلاب وامنح النقاط المناسبة.</p>
                    </div>
                </div>
                ${pendingCount > 0 ? `<div style="background:rgba(255,167,38,0.1); border:1px solid rgba(255,167,38,0.3); border-radius:30px; padding:10px 20px; font-weight:700; color:#FFA726;">${pendingCount} تسليم بانتظار المراجعة</div>` : ''}
            </div>

            <!-- Filters -->
            ${pending.length > 0 ? `
                <div style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap; align-items:center;">
                    <input type="text" id="submissions-search" placeholder="🔍 ابحث باسم الطالب..."
                        value="${escAttr(filterState.q)}"
                        class="form-input"
                        style="flex:1; min-width:220px; padding:12px 16px; font-size:0.95rem; border-radius:var(--radius-md);" />
                    <select id="submissions-task-filter" class="form-input"
                        style="min-width:220px; padding:12px 16px; font-size:0.95rem; border-radius:var(--radius-md); cursor:pointer;">
                        <option value="" ${filterState.task === '' ? 'selected' : ''}>كل المهام</option>
                        ${uniqueTasks.map(t => {
                            const val = t.toLowerCase();
                            return `<option value="${escAttr(val)}" ${filterState.task === val ? 'selected' : ''}>${t}</option>`;
                        }).join('')}
                    </select>
                    <select id="submissions-admin-filter" class="form-input"
                        style="min-width:200px; padding:12px 16px; font-size:0.95rem; border-radius:var(--radius-md); cursor:pointer;">
                        <option value="" ${filterState.admin === '' ? 'selected' : ''}>كل المشرفين</option>
                        <option value="__all__" ${filterState.admin === '__all__' ? 'selected' : ''}>جميع المشرفين (غير محدد)</option>
                        ${admins.map(a => `<option value="${escAttr(a.id)}" ${filterState.admin === String(a.id) ? 'selected' : ''}>${a.name}</option>`).join('')}
                    </select>
                    <button id="submissions-reset-filters" class="btn"
                        style="padding:12px 18px; background:var(--bg-surface-hover); border:1px solid var(--border-color); font-weight:600;">مسح</button>
                </div>
                <div id="submissions-empty-filter" style="display:none; text-align:center; padding:48px 24px; color:var(--text-tertiary); background:var(--bg-surface); border:1px dashed var(--border-color); border-radius:var(--radius-lg); margin-bottom:24px;">
                    لا توجد نتائج تطابق البحث.
                </div>
            ` : ''}

            <!-- Pending submissions -->
            ${pending.length > 0 ? `
                <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:16px;">
                    ⏳ بانتظار المراجعة (${pending.length})
                </h3>
                ${pending.map(s => renderSubmissionRow(s, adminsById)).join('')}
            ` : `
                <div class="card" style="text-align:center; padding:80px 32px; margin-bottom:32px;">
                    <div style="font-size:3rem; margin-bottom:16px;">✅</div>
                    <h3 style="font-size:1.4rem; color:var(--text-primary); margin-bottom:8px;">لا توجد تسليمات معلقة</h3>
                    <p style="color:var(--text-secondary);">جميع التسليمات تمت مراجعتها. راجع <a href="#/admin/review-log" style="color:var(--color-primary); font-weight:700;">سجل التقييمات السابقة</a> لعرض التقييمات المكتملة.</p>
                </div>
            `}
        </div>

        <!-- ===== APPROVAL MODAL ===== -->
        <div id="approval-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.55); backdrop-filter:blur(8px); align-items:center; justify-content:center;">
            <div class="responsive-modal" style="background:var(--bg-surface); border-radius:var(--radius-xl); padding:48px; width:560px; max-width:92vw; box-shadow:var(--shadow-lg); direction:rtl;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <h3 style="margin:0; font-size:1.4rem;">تقييم التسليم</h3>
                    <button id="approval-close-btn" style="background:none; border:none; cursor:pointer; font-size:1.4rem; color:var(--text-tertiary);">✕</button>
                </div>
                <p id="approval-task-label" style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:32px;"></p>

                <!-- Points input with range indicator -->
                <div class="form-group" style="margin-bottom:20px;">
                    <label class="form-label" style="margin-bottom:8px; display:block;">النقاط المُمنوحة</label>
                    <div style="display:flex; align-items:center; gap:16px;">
                        <input type="number" id="approval-points-input" class="form-input" min="0" style="width:140px; padding:14px 16px; font-size:1.2rem; font-weight:700; text-align:center;" />
                        <span id="approval-max-label" style="color:var(--text-tertiary); font-size:0.95rem;"></span>
                    </div>
                    <div id="approval-points-error" style="color:#EF4444; font-size:0.85rem; margin-top:6px; display:none;">القيمة يجب أن تكون بين 0 والحد الأقصى.</div>
                    <!-- Visual range bar -->
                    <div style="margin-top:14px;">
                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-tertiary); margin-bottom:6px;">
                            <span>0</span>
                            <span id="approval-max-bar-label"></span>
                        </div>
                        <div style="width:100%; height:8px; background:var(--bg-surface-hover); border-radius:4px; overflow:hidden;">
                            <div id="approval-range-fill" style="height:100%; background:linear-gradient(90deg, var(--color-primary), var(--color-primary-dark)); border-radius:4px; transition:width 0.3s; width:100%;"></div>
                        </div>
                    </div>
                    <!-- Quick presets -->
                    <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
                        <span style="font-size:0.8rem; color:var(--text-tertiary); align-self:center;">اختيار سريع:</span>
                        <button class="preset-btn btn" data-pct="100" style="padding:4px 12px; font-size:0.8rem; background:rgba(92,196,129,0.1); color:var(--color-primary); border:1px solid rgba(92,196,129,0.3); border-radius:16px;">كامل</button>
                        <button class="preset-btn btn" data-pct="75"  style="padding:4px 12px; font-size:0.8rem; background:rgba(81,173,173,0.1); color:var(--color-primary-dark); border:1px solid rgba(81,173,173,0.3); border-radius:16px;">75%</button>
                        <button class="preset-btn btn" data-pct="50"  style="padding:4px 12px; font-size:0.8rem; background:rgba(255,167,38,0.1); color:#FFA726; border:1px solid rgba(255,167,38,0.3); border-radius:16px;">50%</button>
                        <button class="preset-btn btn" data-pct="0"   style="padding:4px 12px; font-size:0.8rem; background:rgba(239,68,68,0.08); color:#EF4444; border:1px solid rgba(239,68,68,0.2); border-radius:16px;">صفر</button>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom:28px;">
                    <label class="form-label" style="margin-bottom:8px; display:block;">تعليق المشرف (اختياري)</label>
                    <textarea id="approval-comment-input" class="form-input" rows="3" placeholder="مثال: عمل جيد، لكن بعض الأجزاء تحتاج مزيداً من التفصيل." style="width:100%; padding:12px 16px; font-family:inherit; resize:vertical;"></textarea>
                </div>

                    <button id="approval-cancel-btn" class="btn btn-secondary" style="padding:12px 24px;">إلغاء</button>
                    <button id="approval-save-btn" class="btn btn-primary" style="padding:12px 32px; font-weight:700;">اعتماد وحفظ النقاط</button>
                </div>
            </div>
        </div>
    `;
}

AdminTasks.attachEvents = (store) => {
    // ── Filters ─────────────────────────────────────────────────────────────
    const searchInput  = document.getElementById('submissions-search');
    const taskFilter   = document.getElementById('submissions-task-filter');
    const adminFilter  = document.getElementById('submissions-admin-filter');
    const resetBtn     = document.getElementById('submissions-reset-filters');
    const emptyHint    = document.getElementById('submissions-empty-filter');

    const applyFilters = () => {
        const q = (searchInput?.value || '').trim().toLowerCase();
        const task = taskFilter?.value || '';
        const admin = adminFilter?.value || '';

        const cards = document.querySelectorAll('.submission-card');
        let visible = 0;
        cards.forEach(card => {
            const studentMatch = !q || (card.dataset.student || '').includes(q);
            const taskMatch = !task || card.dataset.task === task;
            const assigned = card.dataset.assigned || 'all';
            const adminMatch = !admin
                ? true
                : admin === '__all__'
                    ? assigned === 'all'
                    : (assigned === 'all' || assigned.split(',').includes(admin));
            const show = studentMatch && taskMatch && adminMatch;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });

        if (emptyHint) emptyHint.style.display = (cards.length > 0 && visible === 0) ? 'block' : 'none';
    };

    searchInput?.addEventListener('input', () => {
        filterState.q = searchInput.value;
        applyFilters();
    });
    taskFilter?.addEventListener('change', () => {
        filterState.task = taskFilter.value;
        applyFilters();
    });
    adminFilter?.addEventListener('change', () => {
        filterState.admin = adminFilter.value;
        applyFilters();
    });
    resetBtn?.addEventListener('click', () => {
        filterState.q = '';
        filterState.task = '';
        filterState.admin = '';
        if (searchInput) searchInput.value = '';
        if (taskFilter) taskFilter.value = '';
        if (adminFilter) adminFilter.value = '';
        applyFilters();
    });

    applyFilters();

    const modal         = document.getElementById('approval-modal');
    const pointsInput   = document.getElementById('approval-points-input');
    const maxLabel      = document.getElementById('approval-max-label');
    const maxBarLabel   = document.getElementById('approval-max-bar-label');
    const rangeFill     = document.getElementById('approval-range-fill');
    const pointsError   = document.getElementById('approval-points-error');
    const taskLabel     = document.getElementById('approval-task-label');
    const commentInput  = document.getElementById('approval-comment-input');
    let activeSubId     = null;
    let activeMaxPts    = 0;

    const closeModal = () => { modal.style.display = 'none'; activeSubId = null; };
    document.getElementById('approval-close-btn')?.addEventListener('click', closeModal);
    document.getElementById('approval-cancel-btn')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    // Update range bar as user types
    pointsInput?.addEventListener('input', () => {
        const v = parseFloat(pointsInput.value) || 0;
        const pct = activeMaxPts > 0 ? Math.min(100, Math.max(0, (v / activeMaxPts) * 100)) : 0;
        rangeFill.style.width = pct + '%';
        const valid = v >= 0 && v <= activeMaxPts;
        pointsError.style.display = valid ? 'none' : 'block';
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pct = parseInt(btn.getAttribute('data-pct'));
            const val = Math.round(activeMaxPts * pct / 100);
            pointsInput.value = val;
            rangeFill.style.width = pct + '%';
            pointsError.style.display = 'none';
        });
    });

    // Open approval modal
    document.querySelectorAll('.review-sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const subId = btn.getAttribute('data-sub-id');
            const sub = store.getState().submissions.find(s => s.id === subId);
            if (!sub) return;
            activeSubId = subId;
            activeMaxPts = sub.taskMaxPoints;
            taskLabel.textContent = `المهمة: ${sub.taskTitle} — ${sub.studentName} — الحد الأقصى: ${sub.taskMaxPoints} نقطة`;
            maxLabel.textContent = `من ${sub.taskMaxPoints}`;
            maxBarLabel.textContent = sub.taskMaxPoints;
            pointsInput.setAttribute('max', sub.taskMaxPoints);
            pointsInput.value = sub.taskMaxPoints; // default: full marks
            rangeFill.style.width = '100%';
            commentInput.value = '';
            pointsError.style.display = 'none';
            modal.style.display = 'flex';
            setTimeout(() => pointsInput.focus(), 80);
        });
    });

    // Save approval
    document.getElementById('approval-save-btn')?.addEventListener('click', () => {
        const pts = parseFloat(pointsInput.value);
        if (isNaN(pts) || pts < 0 || pts > activeMaxPts) {
            pointsError.style.display = 'block';
            return;
        }
        store.approveSubmission(activeSubId, pts, commentInput.value.trim());
        closeModal();
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    // Reject buttons
    document.querySelectorAll('.reject-sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const subId = btn.getAttribute('data-sub-id');
            const comment = prompt('تعليق على الرفض (اختياري):') || '';
            store.rejectSubmission(subId, comment);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
    });
};
