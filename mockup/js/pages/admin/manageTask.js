import { Icons } from '../../components/icons.js';

/**
 * Admin Manage Tasks — full CRUD: view, edit, delete, disable/enable tasks
 */

const TRACK_COLORS = {
    'الثقافي': { bg: 'rgba(232,194,109,0.12)', text: 'var(--color-primary-light)', border: 'rgba(232,194,109,0.35)' },
    'مسار تقني': { bg: 'rgba(81,173,173,0.12)', text: 'var(--color-primary-dark)', border: 'rgba(81,173,173,0.35)' },
    'الذاكرة الحديدية': { bg: 'rgba(155,114,207,0.12)', text: '#9B72CF', border: 'rgba(155,114,207,0.35)' },
    'الاجتماعي': { bg: 'rgba(92,196,129,0.12)', text: 'var(--color-primary)', border: 'rgba(92,196,129,0.35)' },
    'اجتماعي': { bg: 'rgba(92,196,129,0.12)', text: 'var(--color-primary)', border: 'rgba(92,196,129,0.35)' },
    'منوع': { bg: 'rgba(160,160,160,0.12)', text: '#777', border: 'rgba(160,160,160,0.35)' },
    'مسار إعلامي': { bg: 'rgba(66,165,245,0.12)', text: '#42A5F5', border: 'rgba(66,165,245,0.35)' },
};

const trackBadge = (track) => {
    const c = TRACK_COLORS[track] || { bg: 'var(--bg-surface-hover)', text: 'var(--text-secondary)', border: 'var(--border-color)' };
    return `<span style="background:${c.bg}; color:${c.text}; border:1px solid ${c.border}; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600; white-space:nowrap;">${track}</span>`;
};

const statusBadge = (isActive) => {
    if (isActive === false) return `<span style="background:rgba(239,68,68,0.1); color:#EF4444; border:1px solid rgba(239,68,68,0.3); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600;">معطّلة</span>`;
    return `<span style="background:rgba(92,196,129,0.12); text:var(--color-primary); border:1px solid rgba(92,196,129,0.3); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600; white-space:nowrap;">نشر مستمر</span>`;
};

const visibilityBadge = (task) => {
    if (task.visibility !== 'restricted') return '';
    const count = Array.isArray(task.visibleToIds) ? task.visibleToIds.length : 0;
    return `<span title="مخصصة لطلاب محددين" style="display:inline-flex; align-items:center; gap:4px; background:rgba(155,114,207,0.12); color:#9B72CF; border:1px solid rgba(155,114,207,0.35); padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:700; margin-right:6px; vertical-align:middle;">👥 ${count} طالب</span>`;
};

export function AdminManageTask(store) {
    const state = store.getState();
    const tasks = state.tasks;
    const submissions = state.submissions || [];
    const admins = state.admins || [];
    const tracks = [...new Set(tasks.map(t => t.track))];
    const pendingEvals = submissions.filter(s => s.status === 'pending').length;

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Page header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(81,173,173,0.15); color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(81,173,173,0.3);">
                        ${Icons.Tasks}
                    </div>
                    <div>
                        <h1 style="margin: 0; font-size: 2.25rem;">إدارة المهام</h1>
                        <p style="margin: 4px 0 0; color: var(--text-secondary); font-size: 1.05rem;">استعرض وعدّل وحذف جميع المهام المنشورة على المنصة.</p>
                    </div>
                </div>
                <a href="#/admin/add-task" class="btn btn-primary" style="padding: 12px 28px; font-weight: 700; font-size: 1.05rem; text-decoration: none;">+ إضافة مهمة جديدة</a>
            </div>

            <!-- Filters bar -->
            <div class="card" style="padding: 20px 28px; border-radius: var(--radius-xl); margin-bottom: 28px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px;">
                    <input type="text" id="task-search" class="form-input" placeholder="🔍  ابحث باسم المهمة..." style="width: 100%; padding: 10px 16px; font-size: 1rem;" />
                </div>
                <select id="task-track-filter" class="form-input" style="padding: 10px 16px; font-size: 1rem; min-width: 160px;">
                    <option value="all">كل المسارات</option>
                    ${tracks.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
                <select id="task-sort" class="form-input" style="padding: 10px 16px; font-size: 1rem; min-width: 180px;">
                    <option value="default">الترتيب الافتراضي</option>
                    <option value="deadline-asc">الموعد (الأقرب أولاً)</option>
                    <option value="deadline-desc">الموعد (الأبعد أولاً)</option>
                    <option value="points-desc">النقاط (الأعلى أولاً)</option>
                </select>
            </div>

            <!-- Stats summary -->
            <div class="responsive-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px;">
                ${[
                    { label: 'إجمالي المهام', value: tasks.length, color: 'var(--color-primary-dark)' },
                    { label: 'مهام مُفَعّلة', value: tasks.filter(t=>t.isActive !== false).length, color: 'var(--color-primary)' },
                    { label: 'بانتظار التقييم', value: pendingEvals, color: 'var(--color-primary-light)' },
                    { label: 'مهام معطّلة', value: tasks.filter(t=>t.isActive === false).length, color: '#EF4444' },
                ].map(s => `
                    <div class="card" style="text-align:center; padding:20px 16px;">
                        <div style="font-size:2rem; font-weight:800; color:${s.color};">${s.value}</div>
                        <div style="font-size:0.9rem; color:var(--text-secondary); margin-top:4px;">${s.label}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Tasks table -->
            <div class="card responsive-table-wrapper" style="padding:0; overflow:hidden; border-radius:var(--radius-xl);" id="tasks-table-container">
                <table style="width:100%; border-collapse:collapse; text-align:right;" id="manage-tasks-table">
                    <thead style="background:var(--bg-surface-hover);">
                        <tr>
                            <th style="padding:18px 28px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">المهمة</th>
                            <th style="padding:18px 20px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">المسار</th>
                            <th style="padding:18px 20px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">النقاط</th>
                            <th style="padding:18px 20px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">الموعد</th>
                            <th style="padding:18px 20px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color); text-align:center;">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="manage-tasks-body">
                        ${tasks.map(task => renderTaskRow(task)).join('')}
                    </tbody>
                </table>
            </div>

            <!-- ===== Visibility Modal (activate / deactivate scope) ===== -->
            <div id="task-visibility-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.55); backdrop-filter:blur(8px); align-items:center; justify-content:center;">
                <div class="responsive-modal" style="background:var(--bg-surface); border-radius:var(--radius-xl); padding:36px 40px; width:680px; max-width:94vw; max-height:90vh; overflow-y:auto; box-shadow:var(--shadow-lg); direction:rtl;">
                    <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:8px;">
                        <div>
                            <h3 id="vis-modal-title" style="margin:0 0 4px; font-size:1.4rem;">تعديل نطاق المهمة</h3>
                            <p id="vis-modal-task-label" style="margin:0; color:var(--text-secondary); font-size:0.95rem;"></p>
                        </div>
                        <button id="vis-modal-close" style="background:none; border:none; cursor:pointer; font-size:1.4rem; color:var(--text-tertiary); line-height:1;">✕</button>
                    </div>

                    <!-- Step 1: pick scope -->
                    <div id="vis-step-scope" style="margin-top:24px;">
                        <div id="vis-scope-cards" style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                            <button type="button" id="vis-scope-all" class="vis-scope-card" data-scope="all" style="
                                text-align:right; padding:20px 22px; border-radius:var(--radius-lg);
                                background:var(--bg-main); border:2px solid var(--border-color);
                                cursor:pointer; transition:all 0.18s; display:flex; flex-direction:column; gap:6px;">
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <div style="width:36px; height:36px; border-radius:50%; background:rgba(92,196,129,0.15); color:var(--color-primary); display:flex; align-items:center; justify-content:center; font-size:1.1rem;">🌐</div>
                                    <div id="vis-scope-all-title" style="font-weight:700; font-size:1rem; color:var(--text-primary);">لجميع الطلاب</div>
                                </div>
                                <div id="vis-scope-all-desc" style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">يطبَّق التغيير على كل الطلاب الذين يرون هذه المهمة.</div>
                            </button>
                            <button type="button" id="vis-scope-some" class="vis-scope-card" data-scope="restricted" style="
                                text-align:right; padding:20px 22px; border-radius:var(--radius-lg);
                                background:var(--bg-main); border:2px solid var(--border-color);
                                cursor:pointer; transition:all 0.18s; display:flex; flex-direction:column; gap:6px;">
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <div style="width:36px; height:36px; border-radius:50%; background:rgba(155,114,207,0.15); color:#9B72CF; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">👥</div>
                                    <div id="vis-scope-some-title" style="font-weight:700; font-size:1rem; color:var(--text-primary);">لطلاب محددين</div>
                                </div>
                                <div id="vis-scope-some-desc" style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">اختر بالتحديد من يرى هذه المهمة.</div>
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: student picker -->
                    <div id="vis-step-pick" style="display:none; margin-top:20px;">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; flex-wrap:wrap;">
                            <input type="text" id="vis-student-search" placeholder="🔍 ابحث باسم الطالب..." class="form-input" style="flex:1; min-width:200px; padding:11px 14px; font-size:0.95rem;" />
                            <div style="display:flex; gap:8px;">
                                <button type="button" id="vis-select-all" class="btn" style="padding:9px 14px; background:rgba(81,173,173,0.1); color:var(--color-primary-dark); border:1px solid rgba(81,173,173,0.3); font-weight:600; font-size:0.85rem;">تحديد الكل</button>
                                <button type="button" id="vis-clear-all" class="btn" style="padding:9px 14px; background:var(--bg-surface-hover); color:var(--text-secondary); border:1px solid var(--border-color); font-weight:600; font-size:0.85rem;">مسح</button>
                            </div>
                        </div>
                        <div id="vis-student-list" style="max-height:340px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-main);">
                            <!-- populated dynamically -->
                        </div>
                        <div id="vis-selected-count" style="margin-top:12px; font-size:0.9rem; color:var(--text-secondary); font-weight:600;">لم يتم اختيار أي طالب</div>
                    </div>

                    <!-- Footer actions -->
                    <div class="responsive-actions" style="display:flex; gap:12px; justify-content:space-between; align-items:center; margin-top:28px; flex-wrap:wrap;">
                        <button id="vis-modal-back" class="btn" style="padding:11px 18px; background:var(--bg-surface-hover); border:1px solid var(--border-color); color:var(--text-secondary); font-weight:600; display:none;">← رجوع</button>
                        <div style="display:flex; gap:10px; margin-right:auto;">
                            <button id="vis-modal-cancel" class="btn btn-secondary" style="padding:11px 22px;">إلغاء</button>
                            <button id="vis-modal-confirm" class="btn btn-primary" style="padding:11px 28px; font-weight:700; display:none;">تأكيد</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== Submissions Modal ===== -->
            <div id="task-submissions-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.55); backdrop-filter:blur(8px); align-items:center; justify-content:center;">
                <div class="responsive-modal" style="background:var(--bg-surface); border-radius:var(--radius-xl); padding:36px 40px; width:780px; max-width:94vw; max-height:90vh; overflow-y:auto; box-shadow:var(--shadow-lg); direction:rtl;">
                    <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:8px;">
                        <div>
                            <h3 style="margin:0 0 4px; font-size:1.4rem;">تسليمات المهمة</h3>
                            <p id="subs-modal-task-label" style="margin:0; color:var(--text-secondary); font-size:0.95rem;"></p>
                        </div>
                        <button id="subs-modal-close" style="background:none; border:none; cursor:pointer; font-size:1.4rem; color:var(--text-tertiary); line-height:1;">✕</button>
                    </div>

                    <!-- Stats strip -->
                    <div id="subs-stats" style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin:18px 0 16px;">
                        <div style="background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px; text-align:center;">
                            <div id="subs-stat-total" style="font-size:1.4rem; font-weight:800; color:var(--text-primary);">0</div>
                            <div style="font-size:0.78rem; color:var(--text-tertiary); margin-top:2px;">إجمالي</div>
                        </div>
                        <div style="background:var(--bg-main); border:1px solid rgba(92,196,129,0.25); border-radius:var(--radius-md); padding:12px; text-align:center;">
                            <div id="subs-stat-submitted" style="font-size:1.4rem; font-weight:800; color:var(--color-primary);">0</div>
                            <div style="font-size:0.78rem; color:var(--text-tertiary); margin-top:2px;">مسلّمون</div>
                        </div>
                        <div style="background:var(--bg-main); border:1px solid rgba(255,167,38,0.25); border-radius:var(--radius-md); padding:12px; text-align:center;">
                            <div id="subs-stat-pending" style="font-size:1.4rem; font-weight:800; color:#FFA726;">0</div>
                            <div style="font-size:0.78rem; color:var(--text-tertiary); margin-top:2px;">بانتظار التقييم</div>
                        </div>
                        <div style="background:var(--bg-main); border:1px solid rgba(239,68,68,0.2); border-radius:var(--radius-md); padding:12px; text-align:center;">
                            <div id="subs-stat-missing" style="font-size:1.4rem; font-weight:800; color:#EF4444;">0</div>
                            <div style="font-size:0.78rem; color:var(--text-tertiary); margin-top:2px;">لم يسلّموا</div>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div style="display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap; align-items:center;">
                        <input type="text" id="subs-search" placeholder="🔍 ابحث باسم الطالب..." class="form-input" style="flex:1; min-width:200px; padding:11px 14px; font-size:0.95rem;" />
                        <select id="subs-filter" class="form-input" style="padding:11px 14px; font-size:0.95rem; min-width:160px;">
                            <option value="all">جميع الطلاب</option>
                            <option value="submitted">المسلّمون فقط</option>
                            <option value="missing">لم يسلّموا فقط</option>
                        </select>
                    </div>

                    <div id="subs-list" style="border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-main); overflow:hidden;">
                        <div style="padding:32px 16px; text-align:center; color:var(--text-tertiary); font-size:0.9rem;">جارٍ التحميل...</div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                        <button id="subs-modal-done" class="btn btn-primary" style="padding:11px 28px; font-weight:700;">إغلاق</button>
                    </div>
                </div>
            </div>

            <!-- Edit Modal -->
            <div id="admin-task-edit-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.55); backdrop-filter:blur(6px); align-items:center; justify-content:center;">
                <div class="responsive-modal" style="background:var(--bg-surface); border-radius:var(--radius-xl); padding:48px; width:640px; max-width:92vw; box-shadow:var(--shadow-lg); direction:rtl; max-height:90vh; overflow-y:auto;">
                    <h3 style="margin:0 0 32px; font-size:1.5rem;">تعديل المهمة</h3>
                    <input type="hidden" id="admin-edit-task-id" />
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
                        <div class="form-group" style="margin:0; grid-column:1/-1;">
                            <label class="form-label">عنوان المهمة</label>
                            <input type="text" id="admin-edit-task-title" class="form-input" style="width:100%; padding:12px 16px;" />
                        </div>
                        <div class="form-group" style="margin:0; grid-column:1/-1;">
                            <label class="form-label">الوصف</label>
                            <textarea id="admin-edit-task-desc" class="form-input" rows="3" style="width:100%; resize:vertical; padding:12px 16px; font-family:inherit;"></textarea>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">المسار</label>
                            <select id="admin-edit-task-track" class="form-input" style="width:100%; padding:12px 16px;">
                                <option value="مسار تقني">مسار تقني</option>
                                <option value="الذاكرة الحديدية">الذاكرة الحديدية</option>
                                <option value="مسار إعلامي">مسار إعلامي</option>
                                <option value="الثقافي">الثقافي</option>
                                <option value="منوع">منوع</option>
                                <option value="اجتماعي">اجتماعي</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">طريقة التسليم</label>
                            <select id="admin-edit-task-submission" class="form-input" style="width:100%; padding:12px 16px;">
                                <option value="رفع ملف">رفع ملف (صورة / كود / PDF)</option>
                                <option value="إقرار بالإنجاز">إقرار بالإنجاز فقط</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">النقاط</label>
                            <input type="number" id="admin-edit-task-points" class="form-input" min="1" style="width:100%; padding:12px 16px;" />
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">الموعد النهائي</label>
                            <input type="date" id="admin-edit-task-deadline" class="form-input" style="width:100%; padding:12px 16px;" />
                        </div>
                        <div class="form-group" style="margin:0; grid-column:1/-1;">
                            <label class="form-label">المشرف المسؤول عن التقييم</label>
                            <p style="margin:0 0 10px; color:var(--text-tertiary); font-size:0.85rem;">اختر مشرفاً أو أكثر. "جميع المشرفين" يعني جميعهم.</p>
                            <div id="admin-edit-admin-chips" style="display:flex; flex-wrap:wrap; gap:8px;">
                                <button type="button" class="admin-chip admin-chip-all" data-admin-id="" style="padding:8px 16px; border-radius:999px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-primary); font-weight:600; cursor:pointer; font-size:0.9rem;">
                                    جميع المشرفين
                                </button>
                                ${admins.map(a => `
                                    <button type="button" class="admin-chip" data-admin-id="${a.id}" style="padding:8px 16px; border-radius:999px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-primary); font-weight:600; cursor:pointer; font-size:0.9rem;">
                                        ${a.name}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="responsive-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top:8px;">
                        <button id="admin-task-cancel" class="btn btn-secondary" style="padding:12px 24px;">إلغاء</button>
                        <button id="admin-task-save" class="btn btn-primary" style="padding:12px 32px; font-weight:700;">حفظ التعديلات</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTaskRow(task) {
    return `
        <tr data-task-id="${task.id}" data-task-track="${task.track}" data-task-title="${task.title}"
            style="border-bottom:1px solid var(--border-color); transition:background var(--transition-fast); ${task.isActive === false ? 'opacity:0.5; background:rgba(0,0,0,0.02);' : ''}"
            onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
            <td style="padding:20px 28px;">
                <div style="font-weight:600; font-size:1rem; color:var(--text-primary); margin-bottom:4px;">
                    ${visibilityBadge(task)}${task.title}
                </div>
                <div style="font-size:0.85rem; color:var(--text-tertiary);">${task.description?.substring(0, 60)}...</div>
            </td>
            <td style="padding:20px 20px;">${trackBadge(task.track)}</td>
            <td style="padding:20px 20px; font-weight:700; font-size:1.05rem; color:var(--text-primary);">${task.points} 🌟</td>
            <td style="padding:20px 20px; font-size:0.95rem; color:var(--text-secondary);">${task.displayDeadline || '—'}</td>
            <td style="padding:20px 20px; text-align:center;">
                <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
                    <button class="btn task-edit-btn" data-id="${task.id}"
                        style="padding:7px 14px; background:rgba(81,173,173,0.1); color:var(--color-primary-dark); border:1px solid rgba(81,173,173,0.3); font-weight:600; font-size:0.85rem;">
                        تعديل
                    </button>
                    <button class="btn task-toggle-btn" data-id="${task.id}"
                        style="padding:7px 14px; background:${task.isActive === false ? 'rgba(92,196,129,0.1)' : 'rgba(255,167,38,0.1)'}; color:${task.isActive === false ? 'var(--color-primary)' : '#FFA726'}; border:1px solid ${task.isActive === false ? 'rgba(92,196,129,0.3)' : 'rgba(255,167,38,0.3)'}; font-weight:600; font-size:0.85rem;">
                        ${task.isActive === false ? 'تفعيل' : 'تعطيل'}
                    </button>
                    <button class="btn task-scope-btn" data-id="${task.id}" title="تخصيص الطلاب الذين يرون المهمة"
                        style="padding:7px 14px; background:rgba(155,114,207,0.1); color:#9B72CF; border:1px solid rgba(155,114,207,0.3); font-weight:600; font-size:0.85rem;">
                        النطاق
                    </button>
                    <button class="btn task-submissions-btn" data-id="${task.id}" title="عرض وإدارة تسليمات الطلاب"
                        style="padding:7px 14px; background:rgba(81,173,173,0.1); color:var(--color-primary-dark); border:1px solid rgba(81,173,173,0.3); font-weight:600; font-size:0.85rem;">
                        تسليمات
                    </button>
                    <button class="btn task-delete-btn" data-id="${task.id}"
                        style="padding:7px 14px; background:rgba(239,68,68,0.1); color:#EF4444; border:1px solid rgba(239,68,68,0.3); font-weight:600; font-size:0.85rem;">
                        حذف
                    </button>
                </div>
            </td>
        </tr>
    `;
}

    AdminManageTask.attachEvents = (store) => {
        console.log('Attaching Admin Manage Task events...');
        const modal = document.getElementById('admin-task-edit-modal');
        if (!modal) return;

        // ── Admin assignment chip picker (edit modal) ─────────────────────────
        const chipsWrap = document.getElementById('admin-edit-admin-chips');
        const setChipActive = (btn, active) => {
            if (active) {
                btn.classList.add('active');
                btn.style.background = 'var(--color-primary)';
                btn.style.color = 'white';
                btn.style.borderColor = 'var(--color-primary)';
            } else {
                btn.classList.remove('active');
                btn.style.background = 'var(--bg-surface)';
                btn.style.color = 'var(--text-primary)';
                btn.style.borderColor = 'var(--border-color)';
            }
        };
        const setChipSelection = (ids) => {
            if (!chipsWrap) return;
            const allChip = chipsWrap.querySelector('.admin-chip-all');
            const others = chipsWrap.querySelectorAll('.admin-chip:not(.admin-chip-all)');
            const selected = new Set(ids || []);
            if (selected.size === 0) {
                setChipActive(allChip, true);
                others.forEach(c => setChipActive(c, false));
            } else {
                setChipActive(allChip, false);
                others.forEach(c => setChipActive(c, selected.has(c.getAttribute('data-admin-id'))));
            }
        };
        chipsWrap?.querySelectorAll('.admin-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const isAll = chip.classList.contains('admin-chip-all');
                const allChip = chipsWrap.querySelector('.admin-chip-all');
                const others = chipsWrap.querySelectorAll('.admin-chip:not(.admin-chip-all)');
                if (isAll) {
                    setChipActive(allChip, true);
                    others.forEach(c => setChipActive(c, false));
                } else {
                    setChipActive(chip, !chip.classList.contains('active'));
                    const anyIndividual = Array.from(others).some(c => c.classList.contains('active'));
                    setChipActive(allChip, !anyIndividual);
                }
            });
        });
        const collectAssignedAdmins = () => {
            if (!chipsWrap) return [];
            const allChip = chipsWrap.querySelector('.admin-chip-all');
            if (allChip?.classList.contains('active')) return [];
            return Array.from(chipsWrap.querySelectorAll('.admin-chip:not(.admin-chip-all).active'))
                .map(c => c.getAttribute('data-admin-id'))
                .filter(Boolean);
        };
    
        // --- Modal close/cancel ---
        const closeModal = () => {
            modal.style.display = 'none';
            store.setPauseNotifications(false); // Resume UI updates
        };

        const closeBtn = document.getElementById('admin-task-cancel');
        if (closeBtn) {
            closeBtn.onclick = (e) => {  e.preventDefault(); closeModal(); };
        }
    
        // --- Modal save ---
        const saveBtn = document.getElementById('admin-task-save');
        if (saveBtn) {
            saveBtn.onclick = async (e) => {
                e.preventDefault();
                const id = document.getElementById('admin-edit-task-id').value;
                try {
                    const success = await store.updateTask(id, {
                        title: document.getElementById('admin-edit-task-title').value,
                        description: document.getElementById('admin-edit-task-desc').value,
                        track: document.getElementById('admin-edit-task-track').value,
                        submissionMethod: document.getElementById('admin-edit-task-submission').value,
                        points: parseInt(document.getElementById('admin-edit-task-points').value) || 0,
                        deadline: document.getElementById('admin-edit-task-deadline').value,
                        assignedAdmins: collectAssignedAdmins(),
                    });
                    
                    if (success) {
                        alert('✅ تم حفظ التعديلات بنجاح');
                        closeModal();
                    }
                } catch (err) {
                    console.error('Update failed:', err);
                    alert('❌ فشل حفظ التعديلات: ' + (err.message || 'خطأ غير معروف'));
                }
            };
        }

    // ── Visibility / scope modal ────────────────────────────────────────────
    const visModal = document.getElementById('task-visibility-modal');
    let visStudentsCache = null;
    let visState = { taskId: null, mode: null, scope: null, selected: new Set() };

    const fetchStudentsForPicker = async () => {
        if (visStudentsCache) return visStudentsCache;
        try {
            const res = await fetch(`/api/students?v=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
                visStudentsCache = await res.json();
            } else {
                visStudentsCache = [];
            }
        } catch {
            visStudentsCache = [];
        }
        return visStudentsCache;
    };

    const setScopeCardActive = (cardId, active) => {
        const card = document.getElementById(cardId);
        if (!card) return;
        if (active) {
            card.style.borderColor = 'var(--color-primary)';
            card.style.background = 'rgba(92,196,129,0.06)';
            card.style.boxShadow = '0 0 0 4px rgba(92,196,129,0.12)';
        } else {
            card.style.borderColor = 'var(--border-color)';
            card.style.background = 'var(--bg-main)';
            card.style.boxShadow = 'none';
        }
    };

    const renderStudentList = (filter = '') => {
        const list = document.getElementById('vis-student-list');
        if (!list) return;
        const q = filter.trim().toLowerCase();
        const items = (visStudentsCache || [])
            .filter(s => !q || (s.name || '').toLowerCase().includes(q) || (s.username || '').toLowerCase().includes(q));
        if (items.length === 0) {
            list.innerHTML = `<div style="padding:32px 16px; text-align:center; color:var(--text-tertiary); font-size:0.9rem;">لا يوجد طلاب مطابقون.</div>`;
        } else {
            list.innerHTML = items.map(s => {
                const checked = visState.selected.has(s.id);
                return `
                    <label class="vis-student-row" data-id="${s.id}" style="display:flex; align-items:center; gap:12px; padding:12px 16px; border-bottom:1px solid var(--border-color); cursor:pointer; transition:background 0.15s; ${checked ? 'background:rgba(92,196,129,0.06);' : ''}">
                        <input type="checkbox" data-id="${s.id}" ${checked ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer; accent-color:var(--color-primary);" />
                        <div style="flex:1;">
                            <div style="font-weight:600; font-size:0.95rem; color:var(--text-primary);">${s.name || ''}</div>
                            <div style="font-size:0.78rem; color:var(--text-tertiary);">${s.username || ''}</div>
                        </div>
                    </label>
                `;
            }).join('');
        }
        // Wire row checkbox toggling
        list.querySelectorAll('.vis-student-row').forEach(row => {
            const id = row.getAttribute('data-id');
            const cb = row.querySelector('input[type="checkbox"]');
            row.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    cb.checked = !cb.checked;
                }
                if (cb.checked) visState.selected.add(id);
                else visState.selected.delete(id);
                row.style.background = cb.checked ? 'rgba(92,196,129,0.06)' : '';
                updateSelectedCount();
            });
        });
    };

    const updateSelectedCount = () => {
        const el = document.getElementById('vis-selected-count');
        if (!el) return;
        const n = visState.selected.size;
        el.textContent = n === 0 ? 'لم يتم اختيار أي طالب' : `تم اختيار ${n} طالب`;
        const confirm = document.getElementById('vis-modal-confirm');
        if (confirm) confirm.disabled = (visState.scope === 'restricted' && n === 0);
    };

    const showStep = (step) => {
        document.getElementById('vis-step-scope').style.display = step === 'scope' ? '' : 'none';
        document.getElementById('vis-step-pick').style.display = step === 'pick' ? '' : 'none';
        document.getElementById('vis-modal-back').style.display = step === 'pick' ? '' : 'none';
        document.getElementById('vis-modal-confirm').style.display = (step === 'pick' || (step === 'scope' && visState.scope === 'all')) ? '' : 'none';
    };

    const openVisibilityModal = (task, mode) => {
        if (!visModal) return;
        store.setPauseNotifications(true);
        // Pre-fill selection: for 'disable' restricted, the picker chooses
        // students to REMOVE (start empty). For 'enable'/'scope', it edits
        // the existing allowlist.
        const initialSelected = mode === 'disable' ? new Set() : new Set(task.visibleToIds || []);
        visState = { taskId: task.id, mode, scope: null, selected: initialSelected };

        const titleEl = document.getElementById('vis-modal-title');
        const labelEl = document.getElementById('vis-modal-task-label');
        const allTitle = document.getElementById('vis-scope-all-title');
        const someTitle = document.getElementById('vis-scope-some-title');
        const allDesc = document.getElementById('vis-scope-all-desc');
        const someDesc = document.getElementById('vis-scope-some-desc');

        if (mode === 'disable') {
            titleEl.textContent = 'تعطيل المهمة';
            allTitle.textContent = 'تعطيل لجميع الطلاب';
            allDesc.textContent = 'تختفي المهمة عن كل الطلاب فوراً.';
            someTitle.textContent = 'تعطيل لطلاب محددين';
            someDesc.textContent = 'تظل المهمة نشطة، لكن لن يراها الطلاب الذين تختارهم.';
        } else if (mode === 'enable') {
            titleEl.textContent = 'تفعيل المهمة';
            allTitle.textContent = 'تفعيل لجميع الطلاب';
            allDesc.textContent = 'تظهر المهمة لكل الطلاب فوراً.';
            someTitle.textContent = 'تفعيل لطلاب محددين';
            someDesc.textContent = 'تظهر المهمة فقط للطلاب الذين تختارهم.';
        } else {
            titleEl.textContent = 'تخصيص نطاق المهمة';
            allTitle.textContent = 'مرئية لجميع الطلاب';
            allDesc.textContent = 'إزالة أي تخصيص — يراها الجميع.';
            someTitle.textContent = 'مرئية لطلاب محددين';
            someDesc.textContent = 'يراها فقط من تختارهم.';
        }
        labelEl.textContent = task.title || '';

        setScopeCardActive('vis-scope-all', false);
        setScopeCardActive('vis-scope-some', false);
        document.getElementById('vis-student-search').value = '';
        showStep('scope');
        updateSelectedCount();

        visModal.style.display = 'flex';

        // Pre-fetch students for snappy step-2
        fetchStudentsForPicker().then(() => {
            renderStudentList('');
        });
    };

    const closeVisibilityModal = () => {
        visModal.style.display = 'none';
        store.setPauseNotifications(false);
    };

    document.getElementById('vis-modal-close')?.addEventListener('click', closeVisibilityModal);
    document.getElementById('vis-modal-cancel')?.addEventListener('click', closeVisibilityModal);
    visModal?.addEventListener('click', e => { if (e.target === visModal) closeVisibilityModal(); });

    document.getElementById('vis-scope-all')?.addEventListener('click', () => {
        visState.scope = 'all';
        setScopeCardActive('vis-scope-all', true);
        setScopeCardActive('vis-scope-some', false);
        document.getElementById('vis-modal-confirm').style.display = '';
        document.getElementById('vis-modal-confirm').disabled = false;
    });

    document.getElementById('vis-scope-some')?.addEventListener('click', async () => {
        visState.scope = 'restricted';
        setScopeCardActive('vis-scope-all', false);
        setScopeCardActive('vis-scope-some', true);
        await fetchStudentsForPicker();
        renderStudentList('');
        showStep('pick');
        updateSelectedCount();
    });

    document.getElementById('vis-modal-back')?.addEventListener('click', () => {
        showStep('scope');
    });

    document.getElementById('vis-student-search')?.addEventListener('input', e => {
        renderStudentList(e.target.value || '');
    });

    document.getElementById('vis-select-all')?.addEventListener('click', () => {
        const q = (document.getElementById('vis-student-search')?.value || '').trim().toLowerCase();
        (visStudentsCache || []).forEach(s => {
            if (!q || (s.name || '').toLowerCase().includes(q) || (s.username || '').toLowerCase().includes(q)) {
                visState.selected.add(s.id);
            }
        });
        renderStudentList(q);
        updateSelectedCount();
    });

    document.getElementById('vis-clear-all')?.addEventListener('click', () => {
        visState.selected.clear();
        renderStudentList(document.getElementById('vis-student-search')?.value || '');
        updateSelectedCount();
    });

    document.getElementById('vis-modal-confirm')?.addEventListener('click', async () => {
        const { taskId, mode, scope } = visState;
        if (!taskId || !scope) return;
        const confirmBtn = document.getElementById('vis-modal-confirm');
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.7';

        const updates = {};
        // 'isActive' only changes for explicit enable/disable flows. 'scope'
        // mode is for visibility editing without flipping the active flag.
        if (mode === 'disable') {
            if (scope === 'all') {
                updates.isActive = false;
                updates.visibility = 'all';
                updates.visibleToIds = [];
            } else {
                // Disable for *specific* students = task stays active, but
                // those students lose access. Save the COMPLEMENT as the
                // visibleToIds allowlist (everyone except the selected).
                const all = await fetchStudentsForPicker();
                const removed = visState.selected;
                const remaining = (all || []).filter(s => !removed.has(s.id)).map(s => s.id);
                updates.isActive = true;
                updates.visibility = 'restricted';
                updates.visibleToIds = remaining;
            }
        } else if (mode === 'enable') {
            updates.isActive = true;
            if (scope === 'all') {
                updates.visibility = 'all';
                updates.visibleToIds = [];
            } else {
                updates.visibility = 'restricted';
                updates.visibleToIds = Array.from(visState.selected);
            }
        } else {
            // 'scope' mode — visibility-only edit.
            if (scope === 'all') {
                updates.visibility = 'all';
                updates.visibleToIds = [];
            } else {
                updates.visibility = 'restricted';
                updates.visibleToIds = Array.from(visState.selected);
            }
        }

        try {
            const ok = await store.updateTask(taskId, updates);
            if (ok) {
                closeVisibilityModal();
                applyFilters();
            }
        } catch (err) {
            console.error('Visibility update failed:', err);
            alert('❌ فشل حفظ التغيير');
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
        }
    });

    // ── Task submissions modal ──────────────────────────────────────────────
    const subsModal = document.getElementById('task-submissions-modal');
    let subsState = { taskId: null, task: null, students: [], submissionsByUser: {}, search: '', filter: 'all' };

    const fetchAllStudentsForSubs = async () => {
        try {
            const res = await fetch(`/api/students?v=${Date.now()}`, { cache: 'no-store' });
            return res.ok ? await res.json() : [];
        } catch { return []; }
    };

    const renderSubmissionsList = () => {
        const list = document.getElementById('subs-list');
        if (!list) return;
        const q = (subsState.search || '').trim().toLowerCase();
        const filter = subsState.filter || 'all';
        let totalSub = 0, totalPending = 0, totalMissing = 0;

        const rows = subsState.students.map(s => {
            const sub = subsState.submissionsByUser[s.id];
            const submitted = !!sub;
            if (submitted) {
                totalSub++;
                if (sub.status === 'pending') totalPending++;
            } else {
                totalMissing++;
            }
            return { student: s, sub, submitted };
        });

        document.getElementById('subs-stat-total').textContent = subsState.students.length;
        document.getElementById('subs-stat-submitted').textContent = totalSub;
        document.getElementById('subs-stat-pending').textContent = totalPending;
        document.getElementById('subs-stat-missing').textContent = totalMissing;

        const visible = rows.filter(r => {
            if (q && !((r.student.name || '').toLowerCase().includes(q) || (r.student.username || '').toLowerCase().includes(q))) return false;
            if (filter === 'submitted' && !r.submitted) return false;
            if (filter === 'missing' && r.submitted) return false;
            return true;
        });

        if (visible.length === 0) {
            list.innerHTML = `<div style="padding:32px 16px; text-align:center; color:var(--text-tertiary); font-size:0.9rem;">لا توجد نتائج.</div>`;
            return;
        }

        list.innerHTML = visible.map(({ student, sub, submitted }) => {
            let statusBadge = '';
            let actionBtn = '';
            if (submitted) {
                if (sub.status === 'approved') {
                    statusBadge = `<span style="background:rgba(92,196,129,0.12); color:var(--color-primary); border:1px solid rgba(92,196,129,0.3); padding:3px 10px; border-radius:14px; font-size:0.78rem; font-weight:700;">مقبولة · ${sub.grade ?? 0}/${sub.taskMaxPoints} 🌟</span>`;
                } else if (sub.status === 'rejected') {
                    statusBadge = `<span style="background:rgba(239,68,68,0.1); color:#EF4444; border:1px solid rgba(239,68,68,0.3); padding:3px 10px; border-radius:14px; font-size:0.78rem; font-weight:700;">مردودة</span>`;
                } else {
                    statusBadge = `<span style="background:rgba(255,167,38,0.1); color:#FFA726; border:1px solid rgba(255,167,38,0.3); padding:3px 10px; border-radius:14px; font-size:0.78rem; font-weight:700;">بانتظار التقييم</span>`;
                }
                if (sub.fileUrl === 'admin://manual-mark') {
                    statusBadge += ` <span style="background:rgba(155,114,207,0.12); color:#9B72CF; border:1px solid rgba(155,114,207,0.35); padding:3px 8px; border-radius:14px; font-size:0.72rem; font-weight:700; margin-right:4px;">يدوي</span>`;
                }
                actionBtn = `<button class="btn subs-remove-btn" data-sub-id="${sub.id}" data-student-name="${(student.name || '').replace(/"/g, '&quot;')}" style="padding:6px 14px; background:rgba(239,68,68,0.08); color:#EF4444; border:1px solid rgba(239,68,68,0.25); font-weight:700; font-size:0.8rem;">إزالة التسليم</button>`;
            } else {
                statusBadge = `<span style="background:var(--bg-surface-hover); color:var(--text-tertiary); border:1px solid var(--border-color); padding:3px 10px; border-radius:14px; font-size:0.78rem; font-weight:700;">لم يسلّم</span>`;
                actionBtn = `<button class="btn subs-mark-btn" data-student-id="${student.id}" data-student-name="${(student.name || '').replace(/"/g, '&quot;')}" style="padding:6px 14px; background:rgba(92,196,129,0.1); color:var(--color-primary); border:1px solid rgba(92,196,129,0.3); font-weight:700; font-size:0.8rem;">وضع كمسلّم</button>`;
            }
            return `
                <div style="display:flex; align-items:center; gap:14px; padding:14px 18px; border-bottom:1px solid var(--border-color);">
                    <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--color-primary-light),var(--color-primary)); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; flex-shrink:0;">${(student.name || '?').charAt(0)}</div>
                    <div style="flex:1; min-width:0;">
                        <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${student.name || ''}</div>
                        <div style="font-size:0.78rem; color:var(--text-tertiary); margin-top:2px;">${student.username || ''}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
                        ${statusBadge}
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join('');

        // Wire row buttons
        list.querySelectorAll('.subs-mark-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const studentId = btn.getAttribute('data-student-id');
                const studentName = btn.getAttribute('data-student-name') || 'الطالب';
                if (!confirm(`هل تريد وضع "${studentName}" كمسلّم لهذه المهمة؟\nسيدخل التقييم في انتظار المراجعة.`)) return;
                btn.disabled = true; btn.style.opacity = '0.6';
                const ok = await store.markStudentSubmitted(subsState.taskId, studentId);
                if (ok) {
                    await reloadSubmissions();
                } else {
                    btn.disabled = false; btn.style.opacity = '1';
                }
            });
        });
        list.querySelectorAll('.subs-remove-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const subId = btn.getAttribute('data-sub-id');
                const studentName = btn.getAttribute('data-student-name') || 'الطالب';
                if (!confirm(`⚠️ سيتم حذف تسليم "${studentName}" وأي نقاط مُمنوحة عليه نهائياً.\nهل أنت متأكد؟`)) return;
                btn.disabled = true; btn.style.opacity = '0.6';
                const ok = await store.deleteSubmission(subId);
                if (ok) {
                    await reloadSubmissions();
                } else {
                    btn.disabled = false; btn.style.opacity = '1';
                }
            });
        });
    };

    const reloadSubmissions = async () => {
        const subs = await store.fetchTaskSubmissions(subsState.taskId);
        const map = {};
        (subs || []).forEach(s => { if (s.userId) map[s.userId] = s; });
        subsState.submissionsByUser = map;
        renderSubmissionsList();
    };

    const openSubmissionsModal = async (task) => {
        if (!subsModal) return;
        store.setPauseNotifications(true);
        subsState = { taskId: task.id, task, students: [], submissionsByUser: {}, search: '', filter: 'all' };
        document.getElementById('subs-modal-task-label').textContent = task.title || '';
        document.getElementById('subs-search').value = '';
        document.getElementById('subs-filter').value = 'all';
        document.getElementById('subs-list').innerHTML = `<div style="padding:32px 16px; text-align:center; color:var(--text-tertiary); font-size:0.9rem;">جارٍ التحميل...</div>`;
        subsModal.style.display = 'flex';

        subsState.students = await fetchAllStudentsForSubs();
        await reloadSubmissions();
    };

    const closeSubmissionsModal = () => {
        subsModal.style.display = 'none';
        store.setPauseNotifications(false);
    };

    document.getElementById('subs-modal-close')?.addEventListener('click', closeSubmissionsModal);
    document.getElementById('subs-modal-done')?.addEventListener('click', closeSubmissionsModal);
    subsModal?.addEventListener('click', e => { if (e.target === subsModal) closeSubmissionsModal(); });
    document.getElementById('subs-search')?.addEventListener('input', e => {
        subsState.search = e.target.value || '';
        renderSubmissionsList();
    });
    document.getElementById('subs-filter')?.addEventListener('change', e => {
        subsState.filter = e.target.value || 'all';
        renderSubmissionsList();
    });

    // --- Filters ---
    const applyFilters = () => {
        const search = document.getElementById('task-search')?.value?.toLowerCase() || '';
        const track = document.getElementById('task-track-filter')?.value || 'all';
        const sort = document.getElementById('task-sort')?.value || 'default';

        let tasks = [...store.getState().tasks];
        if (search) tasks = tasks.filter(t => t.title?.toLowerCase().includes(search));
        if (track !== 'all') tasks = tasks.filter(t => t.track === track);

        if (sort === 'deadline-asc') tasks.sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));
        if (sort === 'deadline-desc') tasks.sort((a, b) => (b.deadline || '').localeCompare(a.deadline || ''));
        if (sort === 'points-desc') tasks.sort((a, b) => (b.points || 0) - (a.points || 0));

        const tbody = document.getElementById('manage-tasks-body');
        if (tbody) {
            tbody.innerHTML = tasks.map(t => renderTaskRow(t)).join('');
            attachRowButtons();
        }
    };

    const sInp = document.getElementById('task-search'); if (sInp) sInp.oninput = applyFilters;
    const tFil = document.getElementById('task-track-filter'); if (tFil) tFil.onchange = applyFilters;
    const sFil = document.getElementById('task-sort'); if (sFil) sFil.onchange = applyFilters;

    // --- Row action buttons ---
    const attachRowButtons = () => {
        // Edit button
        document.querySelectorAll('.task-edit-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const task = store.getState().tasks.find(t => t.id === id);
                if (!task) return;
                
                // Pause UI refreshes while we are editing in the modal
                store.setPauseNotifications(true);

                document.getElementById('admin-edit-task-id').value = id;
                document.getElementById('admin-edit-task-title').value = task.title || '';
                document.getElementById('admin-edit-task-desc').value = task.description || '';
                document.getElementById('admin-edit-task-track').value = task.track || '';
                document.getElementById('admin-edit-task-submission').value = task.submissionMethod || '';
                document.getElementById('admin-edit-task-points').value = task.points || 0;
                document.getElementById('admin-edit-task-deadline').value = task.deadline || '';
                setChipSelection(task.assignedAdmins || []);
                modal.style.display = 'flex';
            };
        });

        // Toggle (activate/deactivate) — opens scope modal
        document.querySelectorAll('.task-toggle-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const task = store.getState().tasks.find(t => t.id === id);
                if (!task) return;
                openVisibilityModal(task, task.isActive === false ? 'enable' : 'disable');
            };
        });

        // Scope button — opens picker without changing isActive
        document.querySelectorAll('.task-scope-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const task = store.getState().tasks.find(t => t.id === id);
                if (!task) return;
                openVisibilityModal(task, 'scope');
            };
        });

        // Submissions button — opens task submissions modal
        document.querySelectorAll('.task-submissions-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const task = store.getState().tasks.find(t => t.id === id);
                if (!task) return;
                openSubmissionsModal(task);
            };
        });

        // Delete button
        document.querySelectorAll('.task-delete-btn').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.getAttribute('data-id');
                const task = store.getState().tasks.find(t => t.id === id);
                if (confirm(`⚠️ هل أنت متأكد من حذف مهمة "${task?.title}" نهائياً؟\nهذا الإجراء سيحذف كافة تسليمات الطلاب المتعلقة بها ولا يمكن التراجع عنه.`)) {
                    const success = await store.deleteTask(id);
                    if (success) {
                        alert('✅ تم حذف المهمة بنجاح');
                        applyFilters();
                    }
                }
            };
        });
    };

    attachRowButtons();
};
