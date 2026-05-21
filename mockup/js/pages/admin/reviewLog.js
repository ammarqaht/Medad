import { renderSubmissionRow, escAttr } from './tasks.js';

/**
 * Admin — Review log of previously decided submissions (approved/rejected).
 * Filters: student search, task, assigned admin, status.
 */

const filterState = { q: '', task: '', admin: '', status: '' };

export function AdminReviewLog(store) {
    const state = store.getState();
    const submissions = state.submissions || [];
    const admins = state.admins || [];
    const adminsById = Object.fromEntries(admins.map(a => [a.id, a]));

    const decided = submissions
        .filter(s => s.status !== 'pending')
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    const uniqueTasks = [...new Set(decided.map(s => s.taskTitle).filter(Boolean))].sort();

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Header -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:40px; flex-wrap:wrap; gap:16px;">
                <div style="display:flex; align-items:center; gap:16px;">
                    <div style="width:56px; height:56px; border-radius:var(--radius-md); background:rgba(155,114,207,0.15); color:#9B72CF; display:flex; align-items:center; justify-content:center; border:1px solid rgba(155,114,207,0.3); font-size:1.6rem;">📋</div>
                    <div>
                        <h1 style="margin:0; font-size:2.25rem;">سجل التقييمات السابقة</h1>
                        <p style="margin:4px 0 0; color:var(--text-secondary); font-size:1.05rem;">سجل كامل لجميع التسليمات التي تم قبولها أو ردّها.</p>
                    </div>
                </div>
                ${decided.length > 0 ? `<div style="background:rgba(155,114,207,0.1); border:1px solid rgba(155,114,207,0.3); border-radius:30px; padding:10px 20px; font-weight:700; color:#9B72CF;">${decided.length} تقييم</div>` : ''}
            </div>

            <!-- Filters -->
            ${decided.length > 0 ? `
                <div style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap; align-items:center;">
                    <input type="text" id="reviewlog-search" placeholder="🔍 ابحث باسم الطالب..."
                        value="${escAttr(filterState.q)}"
                        class="form-input"
                        style="flex:1; min-width:220px; padding:12px 16px; font-size:0.95rem; border-radius:var(--radius-md);" />
                    <select id="reviewlog-task-filter" class="form-input"
                        style="min-width:220px; padding:12px 16px; font-size:0.95rem; border-radius:var(--radius-md); cursor:pointer;">
                        <option value="" ${filterState.task === '' ? 'selected' : ''}>كل المهام</option>
                        ${uniqueTasks.map(t => {
                            const val = t.toLowerCase();
                            return `<option value="${escAttr(val)}" ${filterState.task === val ? 'selected' : ''}>${t}</option>`;
                        }).join('')}
                    </select>
                    <select id="reviewlog-admin-filter" class="form-input"
                        style="min-width:200px; padding:12px 16px; font-size:0.95rem; border-radius:var(--radius-md); cursor:pointer;">
                        <option value="" ${filterState.admin === '' ? 'selected' : ''}>كل المشرفين</option>
                        <option value="__all__" ${filterState.admin === '__all__' ? 'selected' : ''}>جميع المشرفين (غير محدد)</option>
                        ${admins.map(a => `<option value="${escAttr(a.id)}" ${filterState.admin === String(a.id) ? 'selected' : ''}>${a.name}</option>`).join('')}
                    </select>
                    <select id="reviewlog-status-filter" class="form-input"
                        style="min-width:180px; padding:12px 16px; font-size:0.95rem; border-radius:var(--radius-md); cursor:pointer;">
                        <option value="" ${filterState.status === '' ? 'selected' : ''}>كل الحالات</option>
                        <option value="approved" ${filterState.status === 'approved' ? 'selected' : ''}>مقبولة</option>
                        <option value="rejected" ${filterState.status === 'rejected' ? 'selected' : ''}>مردودة</option>
                    </select>
                    <button id="reviewlog-reset-filters" class="btn"
                        style="padding:12px 18px; background:var(--bg-surface-hover); border:1px solid var(--border-color); font-weight:600;">مسح</button>
                </div>
                <div id="reviewlog-empty-filter" style="display:none; text-align:center; padding:48px 24px; color:var(--text-tertiary); background:var(--bg-surface); border:1px dashed var(--border-color); border-radius:var(--radius-lg); margin-bottom:24px;">
                    لا توجد نتائج تطابق البحث.
                </div>
                ${decided.map(s => renderSubmissionRow(s, adminsById)).join('')}
            ` : `
                <div class="card" style="text-align:center; padding:80px 32px;">
                    <div style="font-size:3rem; margin-bottom:16px;">📋</div>
                    <h3 style="font-size:1.4rem; color:var(--text-primary); margin-bottom:8px;">لا توجد تقييمات سابقة</h3>
                    <p style="color:var(--text-secondary);">ستظهر هنا كافة التسليمات بمجرد مراجعتها.</p>
                </div>
            `}
        </div>
    `;
}

AdminReviewLog.attachEvents = (store) => {
    window.showEditPoints = (subId, currentPoints, maxPoints) => {
        document.getElementById(`points-edit-${subId}`).style.display = 'block';
        const input = document.getElementById(`points-input-${subId}`);
        if (input) { input.value = currentPoints; input.focus(); }
    };

    window.cancelEditPoints = (subId) => {
        document.getElementById(`points-edit-${subId}`).style.display = 'none';
        const status = document.getElementById(`points-save-status-${subId}`);
        if (status) status.textContent = '';
    };

    window.saveEditPoints = async (subId, maxPoints) => {
        const input = document.getElementById(`points-input-${subId}`);
        const statusEl = document.getElementById(`points-save-status-${subId}`);
        if (!input) return;

        const newGrade = parseInt(input.value, 10);
        if (isNaN(newGrade) || newGrade < 0 || newGrade > maxPoints) {
            if (statusEl) { statusEl.style.color = '#ef4444'; statusEl.textContent = `يجب أن تكون النقاط بين 0 و ${maxPoints}`; }
            return;
        }

        if (statusEl) { statusEl.style.color = 'var(--text-secondary)'; statusEl.textContent = 'جاري الحفظ...'; }

        try {
            const res = await fetch(`/api/submissions/${subId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grade: newGrade })
            });

            if (!res.ok) throw new Error('failed');

            // Update the display badge without re-render
            const display = document.getElementById(`points-display-${subId}`);
            if (display) display.innerHTML = `النقاط المُمنوحة: ${newGrade} / ${maxPoints} 🌟`;

            document.getElementById(`points-edit-${subId}`).style.display = 'none';
            if (statusEl) statusEl.textContent = '';

            // Refresh leaderboard in background so student sees new points immediately
            await store.fetchLeaderboard();
        } catch {
            if (statusEl) { statusEl.style.color = '#ef4444'; statusEl.textContent = 'فشل الحفظ، حاول مجدداً'; }
        }
    };

    const searchInput  = document.getElementById('reviewlog-search');
    const taskFilter   = document.getElementById('reviewlog-task-filter');
    const adminFilter  = document.getElementById('reviewlog-admin-filter');
    const statusFilter = document.getElementById('reviewlog-status-filter');
    const resetBtn     = document.getElementById('reviewlog-reset-filters');
    const emptyHint    = document.getElementById('reviewlog-empty-filter');

    const applyFilters = () => {
        const q      = (searchInput?.value || '').trim().toLowerCase();
        const task   = taskFilter?.value || '';
        const admin  = adminFilter?.value || '';
        const status = statusFilter?.value || '';

        const cards = document.querySelectorAll('.submission-card');
        let visible = 0;
        cards.forEach(card => {
            const studentMatch = !q || (card.dataset.student || '').includes(q);
            const taskMatch    = !task || card.dataset.task === task;
            const statusMatch  = !status || card.dataset.status === status;
            const assigned     = card.dataset.assigned || 'all';
            const adminMatch   = !admin
                ? true
                : admin === '__all__'
                    ? assigned === 'all'
                    : (assigned === 'all' || assigned.split(',').includes(admin));
            const show = studentMatch && taskMatch && adminMatch && statusMatch;
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
    statusFilter?.addEventListener('change', () => {
        filterState.status = statusFilter.value;
        applyFilters();
    });
    resetBtn?.addEventListener('click', () => {
        filterState.q = '';
        filterState.task = '';
        filterState.admin = '';
        filterState.status = '';
        if (searchInput) searchInput.value = '';
        if (taskFilter) taskFilter.value = '';
        if (adminFilter) adminFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        applyFilters();
    });

    applyFilters();
};
