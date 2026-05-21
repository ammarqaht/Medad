import { Icons } from '../../components/icons.js';

export function StudentPoints(store) {
    const state = store.getState();
    const allTasks = state.tasks;
    const submissions = state.submissions || [];
    
    // Only count tasks that have an 'approved' submission
    const approvedSubmissions = submissions.filter(s => s.status === 'approved');
    
    // Create completed tasks list with mapped grade and feedback
    const completedTasks = approvedSubmissions.map(sub => {
        const task = allTasks.find(t => t.id === sub.taskId);
        if(!task) return null;
        return {
            ...task,
            earnedPoints: sub.grade,
            adminComment: sub.feedback
        };
    }).filter(t => t !== null);

    const totalPoints = completedTasks.reduce((sum, task) => {
        const earned = task.earnedPoints !== undefined ? task.earnedPoints : task.points;
        return sum + earned;
    }, 0);
    const progressPerc = Math.min((totalPoints / 160) * 100, 100);
    
    // Group points by category
    const categoryTotals = {
        "مسار تقني": 0, "الثقافي": 0, "الذاكرة الحديدية": 0, "عاجل": 0, "اجتماعي": 0, "منوع": 0, "مسار إعلامي": 0
    };
    completedTasks.forEach(t => {
        if (categoryTotals[t.track] !== undefined) categoryTotals[t.track] += t.points;
        else categoryTotals[t.track] = t.points; // Fallback
    });

    const categories = [
        { name: "مسار تقني", points: categoryTotals["مسار تقني"], color: "var(--color-primary-dark)" },
        { name: "الثقافي", points: categoryTotals["الثقافي"], color: "var(--color-primary-light)" },
        { name: "الذاكرة الحديدية", points: categoryTotals["الذاكرة الحديدية"], color: "var(--color-primary)" },
        { name: "اجتماعي", points: categoryTotals["اجتماعي"], color: "#FFA726" },
    ].filter(c => c.points > 0); // Only show active tracks or we can show all

    // Make sure we have defaults if empty
    if (categories.length === 0) categories.push({ name: "لا توجد نقاط موزعة بعد", points: 0, color: "var(--text-tertiary)" });

    // Unsubmitted Tasks: Inactive tasks without a submission
    const unsubmittedTasks = allTasks.filter(task => {
        const sub = submissions.find(s => s.taskId === task.id);
        const isExpired = task.isActive === false;
        return isExpired && !sub;
    });

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 40px;">
                <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(255, 167, 38, 0.15); color: #FFA726; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 167, 38, 0.3);">
                    ${Icons.Points}
                </div>
                <div>
                    <h1 style="margin: 0; font-size: 2.25rem;">النقاط والإنجازات</h1>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">تابع تقدمك وأوسمتك في برنامج حِلْيَة</p>
                </div>
            </div>

            <!-- Top Analytics Cards -->
            <div style="display: flex; justify-content: center; margin-bottom: 40px;">
                <div class="card responsive-padding" style="text-align: center; padding: 48px 32px; display: flex; flex-direction: column; justify-content: center; min-width: 320px;">
                    <h3 style="color: var(--text-secondary); font-size: 1.15rem; margin-bottom: 16px; font-weight: 500;">إجمالي النقاط المكتسبة</h3>
                    <div style="font-size: 5rem; font-weight: 800; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;">
                        ${totalPoints}
                    </div>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="responsive-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-bottom: 40px;">
                <!-- Latest History Table -->
                <div class="card" style="padding: 0; overflow: hidden;">
                    <div style="padding: 24px 32px; border-bottom: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin: 0; font-size: 1.3rem;">✅ المهام المنجزة والمقيّمة</h3>
                    </div>
                    ${completedTasks.length > 0 ? `
                        <div class="responsive-table-wrapper">
                        <table style="width: 100%; border-collapse: collapse; text-align: right;">
                            <thead style="background: var(--bg-surface-hover);">
                                <tr>
                                    <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">المهمة</th>
                                    <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">النقاط</th>
                                    <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">التعليق</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[...completedTasks].reverse().map(t => {
                                    const earned = t.earnedPoints !== undefined ? t.earnedPoints : t.points;
                                    return `
                                    <tr style="border-bottom: 1px solid var(--border-color); transition: background var(--transition-fast);" onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
                                        <td style="padding: 18px 32px;">
                                            <div style="font-weight: 600; color: var(--text-primary);">${t.title}</div>
                                            <div style="font-size:0.75rem; color:var(--text-tertiary);">${t.track}</div>
                                        </td>
                                        <td style="padding: 18px 32px;">
                                            <span style="background: rgba(92,196,129,0.12); color: var(--color-primary); padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size:0.9rem;">+${earned}</span>
                                        </td>
                                        <td style="padding: 18px 32px; font-size:0.85rem; font-style:italic; color:var(--text-tertiary); max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${t.adminComment || ''}">
                                            ${t.adminComment || '—'}
                                        </td>
                                    </tr>
                                `}).join('')}
                            </tbody>
                        </table>
                        </div>
                    ` : `
                        <div style="padding: 48px 32px; text-align: center; color: var(--text-tertiary);">لا توجد مهام منجزة بعد.</div>
                    `}
                </div>

                <!-- Points by Category -->
                <div class="card responsive-padding" style="padding: 32px;">
                    <h3 style="margin-bottom: 32px; font-size: 1.3rem;">📊 النقاط حسب المسار</h3>
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        ${categories.map(cat => `
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 11px;">
                                    <span style="font-weight: 600; color: var(--text-primary); font-size: 1rem;">${cat.name}</span>
                                    <span style="font-weight: 700; color: ${cat.color};">${cat.points} نقطة</span>
                                </div>
                                <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${(totalPoints > 0 ? (cat.points / totalPoints) * 100 : 0)}%; height: 100%; background: ${cat.color}; border-radius: 4px;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Unsubmitted Tasks Section -->
            <div class="card" style="padding: 0; overflow: hidden; border: 1px solid rgba(239, 68, 68, 0.15);">
                <div style="padding: 24px 32px; border-bottom: 1px solid rgba(239, 68, 68, 0.1); background: rgba(239, 68, 68, 0.03);">
                    <h3 style="margin: 0; font-size: 1.3rem; color: #EF4444;">❌ مهام لم يتم تسليمها</h3>
                </div>
                ${unsubmittedTasks.length > 0 ? `
                    <div class="responsive-table-wrapper">
                    <table style="width: 100%; border-collapse: collapse; text-align: right;">
                        <thead style="background: rgba(239, 68, 68, 0.02);">
                            <tr>
                                <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">المهمة المنتهية</th>
                                <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">المسار</th>
                                <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">تاريخ الانتهاء</th>
                                <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">النقاط المفقودة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${unsubmittedTasks.map(t => `
                                <tr style="border-bottom: 1px solid var(--border-color); opacity:0.8;">
                                    <td style="padding: 16px 32px; font-weight: 600; color: var(--text-primary); text-decoration:line-through;">${t.title}</td>
                                    <td style="padding: 16px 32px; color: var(--text-secondary);">${t.track}</td>
                                    <td style="padding: 16px 32px; color: var(--text-tertiary);">${t.displayDeadline || t.deadline}</td>
                                    <td style="padding: 16px 32px; color: #EF4444; font-weight: 700;">-${t.points} 🌟</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    </div>
                ` : `
                    <div style="padding: 40px 32px; text-align: center; color: var(--text-tertiary); font-size: 0.95rem;">ممتاز! لقد سلمت جميع المهام التي انتهت حتى الآن.</div>
                `}
            </div>
        </div>
    `;
}
