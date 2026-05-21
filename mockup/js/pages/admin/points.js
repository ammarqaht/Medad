import { Icons } from '../../components/icons.js';

export function AdminGeneralPoints(store) {
    const state = store.getState();
    const sortedStudents = [...(state.students || state.adminStudentList || [])];

    window.exportLeaderboardExcel = async function() {
        const btn = document.getElementById('export-excel-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'جاري التصدير...'; }
        try {
            const res = await fetch('/api/leaderboard/export');
            if (!res.ok) throw new Error('Export failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hilyah-leaderboard-${new Date().toISOString().split('T')[0]}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            alert('فشل تصدير التقرير، يرجى المحاولة مجدداً');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'تصدير التقرير (Excel)'; }
        }
    };

    window.toggleStudentTasks = async function(studentId) {
        const detailRow = document.getElementById(`tasks-detail-${studentId}`);
        const chevron = document.getElementById(`chevron-${studentId}`);
        if (!detailRow) return;

        const isOpen = detailRow.style.display !== 'none';
        if (isOpen) {
            detailRow.style.display = 'none';
            if (chevron) chevron.style.transform = 'rotate(0deg)';
            return;
        }

        detailRow.style.display = 'table-row';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        detailRow.querySelector('.tasks-grid-container').innerHTML = `
            <div style="padding: 20px; color: var(--text-secondary); text-align: center; font-size: 0.95rem;">جاري التحميل...</div>
        `;

        try {
            const res = await fetch(`/api/students/${studentId}/tasks`);
            if (!res.ok) throw new Error('fetch failed');
            const tasks = await res.json();

            const taskItems = tasks.map(task => {
                let icon, color, label;
                if (task.submissionStatus === 'approved') {
                    icon = '✅'; color = '#22c55e';
                    label = task.grade !== null ? `${task.grade} / ${task.maxPoints} نقطة` : 'مقبول';
                } else if (task.submissionStatus === 'pending') {
                    icon = '⏳'; color = '#f59e0b';
                    label = 'قيد المراجعة';
                } else if (task.submissionStatus === 'rejected') {
                    icon = '❌'; color = '#ef4444';
                    label = 'مرفوض';
                } else {
                    icon = '○'; color = 'var(--text-tertiary)';
                    label = 'لم يُسلَّم';
                }

                return `
                    <div style="
                        background: var(--bg-surface);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius-md);
                        padding: 10px 12px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        min-width: 0;
                    ">
                        <span style="font-size: 1rem; flex-shrink: 0;">${icon}</span>
                        <div style="min-width: 0; flex: 1; overflow: hidden;">
                            <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${task.title}">${task.title}</div>
                            <div style="font-size: 0.73rem; color: ${color}; margin-top: 2px;">${label}</div>
                        </div>
                    </div>
                `;
            }).join('');

            detailRow.querySelector('.tasks-grid-container').innerHTML = `
                <div class="student-tasks-grid" style="
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    padding: 20px 32px;
                ">
                    ${taskItems || '<div style="color: var(--text-secondary); font-size: 0.9rem;">لا توجد مهام بعد</div>'}
                </div>
            `;
        } catch {
            detailRow.querySelector('.tasks-grid-container').innerHTML = `
                <div style="padding: 20px; color: #ef4444; text-align: center; font-size: 0.9rem;">فشل تحميل المهام</div>
            `;
        }
    };

    const rows = sortedStudents.map((student, index) => `
        <tr
            style="border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background var(--transition-fast);"
            onclick="window.toggleStudentTasks('${student.id}')"
            onmouseover="this.style.background='var(--bg-main)'"
            onmouseout="this.style.background='transparent'"
        >
            <td style="padding: 24px 32px; text-align: center; font-weight: 800; font-size: 1.1rem; color: ${index === 0 ? 'var(--color-primary-light)' : index === 1 ? '#A1A5AB' : index === 2 ? '#CD7F32' : 'var(--text-tertiary)'};">
                #${index + 1}
            </td>
            <td style="padding: 24px 32px; font-weight: 600; font-size: 1.05rem; color: var(--text-primary);">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${index < 3 ? 'var(--bg-surface)' : 'var(--bg-surface-hover)'}; border: 1px solid ${index === 0 ? 'var(--color-primary-light)' : 'var(--border-color)'}; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; color: ${index === 0 ? 'var(--color-primary-light)' : 'var(--text-secondary)'}; flex-shrink: 0;">
                        ${student.name?.charAt(0) || '؟'}
                    </div>
                    <span>${student.name}</span>
                    <span id="chevron-${student.id}" style="margin-left: auto; color: var(--text-tertiary); font-size: 0.8rem; transition: transform 0.25s ease; display: inline-block;">▼</span>
                </div>
            </td>
            <td style="padding: 24px 32px; color: var(--text-secondary); font-size: 1.05rem;">
                ${student.completedTasks || 0} مهمة
            </td>
            <td style="padding: 24px 32px; font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">
                ${student.totalPoints || 0} 🌟
            </td>
        </tr>
        <tr id="tasks-detail-${student.id}" style="display: none; border-bottom: 1px solid var(--border-color);">
            <td colspan="4" style="padding: 0; background: var(--bg-main);">
                <div class="tasks-grid-container"></div>
            </td>
        </tr>
    `).join('');

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <div class="header-responsive" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                    <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(232, 194, 109, 0.15); color: var(--color-primary-light); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(232, 194, 109, 0.3);">
                        ${Icons.Points}
                    </div>
                    <div>
                        <h1 style="margin: 0; font-size: 2.25rem;">النقاط العامة ولوحة الشرف</h1>
                        <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">استعرض درجات الطلاب ورتبهم بناءً على أدائهم الفعلي من قاعدة البيانات.</p>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; flex-wrap: wrap; width: 100%;">
                    <input type="text" class="form-input" placeholder="ابحث باسم الطالب..." style="flex: 1; min-width: 240px; padding: 12px 16px; font-size: 1.05rem;" />
                    <button id="export-excel-btn" class="btn btn-secondary" onclick="window.exportLeaderboardExcel()" style="padding: 12px 24px; font-size: 1.05rem; font-weight: 600; border: 1px solid var(--border-color);">
                        تصدير التقرير (Excel)
                    </button>
                </div>
            </div>

            <!-- Premium Podium -->
            <div class="admin-podium-wrapper responsive-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 48px; align-items: end;">
                <!-- Silver (2nd) -->
                <div class="card admin-rank-2" style="text-align: center; background: linear-gradient(180deg, rgba(161, 165, 171, 0.05) 0%, rgba(161, 165, 171, 0.15) 100%); border-color: rgba(161, 165, 171, 0.3); padding: 40px 24px; position: relative; overflow: hidden; height: 85%;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #A1A5AB;"></div>
                    <div style="font-size: 2.5rem; margin-bottom: 16px; filter: drop-shadow(0 4px 8px rgba(161, 165, 171, 0.4));">🥈</div>
                    <div style="font-weight: 800; font-size: 1.3rem; color: var(--text-primary); margin-bottom: 8px;">${sortedStudents[1]?.name || '---'}</div>
                    <div style="color: var(--text-secondary); font-size: 1.05rem; font-weight: 600;">${sortedStudents[1]?.totalPoints || 0} نقطة</div>
                </div>

                <!-- Gold (1st) -->
                <div class="card admin-rank-1" style="text-align: center; background: linear-gradient(180deg, rgba(232, 194, 109, 0.1) 0%, rgba(232, 194, 109, 0.25) 100%); border-color: rgba(232, 194, 109, 0.5); padding: 48px 24px; position: relative; overflow: hidden; transform: translateY(-16px); box-shadow: 0 12px 32px rgba(232, 194, 109, 0.2);">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, var(--color-primary-light), #FFD700);"></div>
                    <div style="font-size: 3.5rem; margin-bottom: 16px; filter: drop-shadow(0 4px 12px rgba(232, 194, 109, 0.5));">👑</div>
                    <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-primary-light); margin-bottom: 8px;">${sortedStudents[0]?.name || '---'}</div>
                    <div style="color: var(--text-primary); font-size: 1.15rem; font-weight: 700;">${sortedStudents[0]?.totalPoints || 0} نقطة</div>
                </div>

                <!-- Bronze (3rd) -->
                <div class="card admin-rank-3" style="text-align: center; background: linear-gradient(180deg, rgba(205, 127, 50, 0.05) 0%, rgba(205, 127, 50, 0.15) 100%); border-color: rgba(205, 127, 50, 0.3); padding: 32px 24px; position: relative; overflow: hidden; height: 75%;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #CD7F32;"></div>
                    <div style="font-size: 2rem; margin-bottom: 16px; filter: drop-shadow(0 4px 8px rgba(205, 127, 50, 0.4));">🥉</div>
                    <div style="font-weight: 800; font-size: 1.2rem; color: var(--text-primary); margin-bottom: 8px;">${sortedStudents[2]?.name || '---'}</div>
                    <div style="color: var(--text-secondary); font-size: 1rem; font-weight: 600;">${sortedStudents[2]?.totalPoints || 0} نقطة</div>
                </div>
            </div>

            <div class="card" style="padding: 0; overflow: hidden; border-radius: var(--radius-xl);">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: right;">
                        <thead style="background: var(--bg-surface-hover);">
                            <tr>
                                <th style="padding: 20px 32px; font-weight: 600; color: var(--text-secondary); width: 100px; text-align: center; border-bottom: 1px solid var(--border-color);">الترتيب</th>
                                <th style="padding: 20px 32px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">اسم الطالب</th>
                                <th style="padding: 20px 32px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">المهام المنجزة</th>
                                <th style="padding: 20px 32px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">إجمالي النقاط</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <style>
            @media (max-width: 768px) {
                .admin-podium-wrapper {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: 16px !important;
                }
                .admin-rank-1 { order: 1; transform: translateY(0) !important; width: 100% !important; max-width: 320px !important; margin-bottom: 8px; }
                .admin-rank-2 { order: 2; height: auto !important; width: 100% !important; max-width: 320px !important; margin-bottom: 8px; }
                .admin-rank-3 { order: 3; height: auto !important; width: 100% !important; max-width: 320px !important; }
                .student-tasks-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    padding: 16px !important;
                }
            }
        </style>
    `;
}
