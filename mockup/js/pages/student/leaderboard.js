import { Icons } from '../../components/icons.js';

/**
 * Student Leaderboard View — Displays students ranked by points
 * Features a "Premium" podium for Top 3 and a sleek list for others.
 */
export function LeaderboardView(store) {
    const state = store.getState();
    const allStudents = [...(state.students || [])];
    const currentUser = state.user;

    // Sorting students descending by totalPoints
    const sortedStudents = allStudents.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    
    // Split Top 3 and ranks 4–10
    const top3 = sortedStudents.slice(0, 3);
    const others = sortedStudents.slice(3, 10);

    // If the current user is outside the top 10, we'll append their row separately
    const currentUserIndex = currentUser
        ? sortedStudents.findIndex(s => s.id === currentUser.id)
        : -1;
    const currentUserOutsideTop10 = currentUserIndex >= 10;
    const currentUserRow = currentUserOutsideTop10 ? sortedStudents[currentUserIndex] : null;

    const renderPodiumCard = (student, index) => {
        const rank = index + 1;
        let color, shadow, badge, height, scale, glow;
        
        if (rank === 1) { // Gold
            color = 'linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #C89116 100%)';
            shadow = '0 15px 40px rgba(253, 185, 49, 0.4)';
            badge = '🥇';
            height = '290px';
            scale = 'scale(1.08)';
            glow = 'radial-gradient(circle, rgba(253, 185, 49, 0.2) 0%, transparent 70%)';
        } else if (rank === 2) { // Silver
            color = 'linear-gradient(135deg, #E0E0E0 0%, #C0C0C0 50%, #8E8E8E 100%)';
            shadow = '0 12px 30px rgba(142, 142, 142, 0.25)';
            badge = '🥈';
            height = '265px';
            scale = 'scale(1.0)';
            glow = 'radial-gradient(circle, rgba(142, 142, 142, 0.15) 0%, transparent 70%)';
        } else { // Bronze
            color = 'linear-gradient(135deg, #E29555 0%, #CD7F32 50%, #8B4513 100%)';
            shadow = '0 10px 25px rgba(160, 82, 45, 0.2)';
            badge = '🥉';
            height = '260px';
            scale = 'scale(0.97)';
            glow = 'radial-gradient(circle, rgba(160, 82, 45, 0.15) 0%, transparent 70%)';
        }

        const isCurrentUser = student.id === currentUser?.id;
        const textCol = (rank === 1) ? '#5d4304' : (rank === 2) ? '#333333' : '#4a2608';
        const textShadow = '0 1px 1px rgba(255,255,255,0.4)';

        return `
            <div class="podium-card podium-rank-${rank}" style="
                display: flex; flex-direction: column; align-items: center; 
                width: 100%; max-width: 220px; transform: ${scale}; z-index: ${4 - rank};
                position: relative;
                animation: podiumEntrance 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
                animation-delay: ${0.1 * rank}s; opacity: 0;
            ">
                <!-- Background Glow -->
                <div style="position: absolute; top: -20px; width: 200px; height: 200px; background: ${glow}; pointer-events: none; z-index: -1;"></div>

                <!-- Avatar Circle -->
                <div style="
                    width: 76px; height: 76px; border-radius: 50%; border: 4px solid white;
                    background: var(--bg-surface); overflow: hidden; margin-bottom: 20px;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;
                    font-size: 1.75rem; font-weight: 900; color: var(--text-primary); position: relative;
                ">
                    ${student.name.charAt(0)}
                    ${isCurrentUser ? `
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: var(--color-primary); color: white; font-size: 0.7rem; font-weight: 700; text-align: center; padding: 3px 0; letter-spacing: 0.05em;">أنت</div>
                    ` : ''}
                </div>

                <!-- Podium Block -->
                <div style="
                    width: 100%; height: ${height}; background: ${color}; 
                    border-radius: 24px 24px 16px 16px; box-shadow: ${shadow};
                    display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
                    padding: 24px 12px; color: ${textCol}; text-align: center;
                    border: 1px solid rgba(255,255,255,0.5);
                ">
                    <div style="font-size: 2rem; line-height: 1; margin-bottom: 8px; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.15));">${badge}</div>
                    <div style="font-weight: 950; font-size: 1.1rem; width: 100%; word-break: break-word; white-space: normal; line-height: 1.3; letter-spacing: -0.01em; text-shadow: ${textShadow}; margin-bottom: 12px; padding: 0 4px;">${student.name}</div>
                    
                    <div style="display:flex; flex-direction:column; gap:4px; margin-top: auto; padding-bottom: 12px;">
                        <div style="font-size: 2.3rem; font-weight: 950; line-height: 1; text-shadow: ${textShadow};">${student.totalPoints}</div>
                        <div style="font-size: 0.85rem; font-weight: 800; opacity: 0.85;">نقطة مستحقة</div>
                        ${student.completedTasks !== undefined ? `
                             <div style="font-size: 0.7rem; font-weight: 700; margin-top: 8px; background: rgba(0,0,0,0.06); padding: 4px 8px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.05);">${student.completedTasks} مهمة</div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    };

    const renderListRow = (student, index, rankOverride) => {
        const rank = rankOverride ?? (index + 4);
        const isCurrentUser = student.id === currentUser?.id;
        
        return `
            <div class="leaderboard-row-new" style="
                display: grid; grid-template-columns: 80px 1fr 140px;
                align-items: center; padding: 20px 32px;
                background: var(--bg-surface);
                border-radius: var(--radius-xl);
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-sm);
                transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                margin-bottom: 16px;
                animation: slideRightFade 0.6s ease forwards; animation-delay: ${0.05 * (index + 4)}s; opacity: 0;
                position: relative; overflow: hidden;
                ${isCurrentUser ? 'border: 2px solid var(--color-primary); background: linear-gradient(90deg, rgba(92,196,129,0.05) 0%, var(--bg-surface) 100%);' : ''}
            ">
                ${isCurrentUser ? `
                    <div style="position: absolute; top:0; right:0; height:100%; width: 4px; background: var(--color-primary);"></div>
                ` : ''}

                <div style="font-size: 1.4rem; font-weight: 900; color: var(--text-tertiary); opacity: 0.5;">
                    #${rank}
                </div>
                
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--bg-main); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; font-weight: 800; border: 1px solid var(--border-color); font-size: 1.15rem;">
                        ${student.name.charAt(0)}
                    </div>
                    <div>
                        <div style="font-weight: 800; color: var(--text-primary); font-size: 1.15rem;">
                            ${student.name}
                            ${isCurrentUser ? '<span style="font-size: 0.75rem; background: var(--color-primary); color: white; padding: 3px 12px; border-radius: 20px; margin-right: 12px; font-weight: 700;">أنت</span>' : ''}
                        </div>
                        <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 2px;">الباحث عن التميز ✨</div>
                    </div>
                </div>

                <div style="text-align: left; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                    <div style="font-weight: 900; font-size: 1.5rem; color: var(--color-primary);">
                        ${student.totalPoints} <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-tertiary);">نقطة</span>
                    </div>
                    ${student.completedTasks !== undefined ? `
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); opacity: 0.7;">${student.completedTasks} مهمة مكتملة</div>
                    ` : ''}
                </div>
            </div>
        `;
    };

    const emptyState = `
        <div class="card" style="text-align: center; padding: 100px 40px; color: var(--text-tertiary); background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-xl);">
            <div style="font-size: 5rem; margin-bottom: 24px; filter: grayscale(0.5); transform: rotate(-5deg);">🏆</div>
            <h3 style="font-size: 2rem; margin-bottom: 16px; color: var(--text-primary); font-weight: 800;">في انتظار الأبطال!</h3>
            <p style="font-size: 1.25rem; max-width: 500px; margin: 0 auto; line-height: 1.7; opacity: 0.8;">الترتيب سيظهر بمجرد اعتماد المشرفين للنقاط المكتسبة من المهام. ابدأ اليوم لتكون في القمة!</p>
        </div>
    `;

    const podiumOrder = [];
    if (top3[1]) podiumOrder.push(top3[1]);
    if (top3[0]) podiumOrder.push(top3[0]);
    if (top3[2]) podiumOrder.push(top3[2]);

    return `
        <div style="animation: slideUpFade var(--transition-slow); position: relative;">
            
            <!-- Premium Background Elements -->
            <div style="position: fixed; inset: 0; background-image: radial-gradient(circle at 50% 10%, rgba(92, 196, 129, 0.05) 0%, transparent 60%); pointer-events: none; z-index: -1;"></div>
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 600px; background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%); pointer-events: none; z-index: -1;"></div>

            <!-- Page Header -->
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 80px; padding-top: 20px;">
                <div style="width: 80px; height: 80px; border-radius: 24px; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(92, 196, 129, 0.4); margin-bottom: 24px; font-size: 2.25rem; animation: bounce 3s infinite ease-in-out;">
                    ${Icons.Winner}
                </div>
                <h1 style="margin: 0; font-size: 3.5rem; font-weight: 950; letter-spacing: -0.03em; color: var(--text-primary);">لوحة الشرف</h1>
                <p style="margin: 12px 0 0; color: var(--text-secondary); font-size: 1.3rem; max-width: 600px; line-height: 1.6;">سجل الخالدين لفرسان برنامج حِلْيَة المتميزين، حيثُ يُكافأ كل جهد ويُثمن كل إنجاز.</p>
                <div style="margin-top: 32px; font-size: 0.95rem; font-weight: 700; color: var(--text-tertiary); background: var(--bg-surface-hover); padding: 8px 24px; border-radius: 40px; border: 1px solid var(--border-color);">
                    🕒 آخر تحديث للبيانات: ${new Date().toLocaleTimeString('ar-SA')}
                </div>
            </div>

            <div style="max-width: 1000px; margin: 0 auto; padding: 0 20px 100px;">
                ${top3.length > 0 ? `
                    <!-- Podium Section -->
                    <div class="podium-wrapper" style="display: flex; justify-content: center; align-items: flex-end; gap: 32px; margin-bottom: 100px; padding: 20px;">
                        ${podiumOrder.map((s, idx) => {
                            const origIndex = top3.indexOf(s);
                            return renderPodiumCard(s, origIndex);
                        }).join('')}
                    </div>

                    <!-- Ranks 4–10 List -->
                    ${others.length > 0 ? `
                        <div style="margin-top: 60px;">
                            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 40px;">
                                <h3 style="margin:0; font-size: 1.5rem; color: var(--text-primary); font-weight: 850; white-space: nowrap;">أفضل 10 فرسان</h3>
                                <div style="height: 2px; flex: 1; background: linear-gradient(90deg, var(--border-color), transparent);"></div>
                            </div>
                            <div class="leaderboard-list">
                                ${others.map((s, i) => renderListRow(s, i)).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Viewer's rank (shown only when outside the top 10) -->
                    ${currentUserRow ? `
                        <div style="margin-top: 48px;">
                            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
                                <h3 style="margin:0; font-size: 1.25rem; color: var(--text-primary); font-weight: 850; white-space: nowrap;">ترتيبك الحالي</h3>
                                <div style="height: 2px; flex: 1; background: linear-gradient(90deg, var(--border-color), transparent);"></div>
                            </div>
                            <div style="position: relative;">
                                <div style="position: absolute; top: -14px; right: 24px; background: var(--color-primary); color: white; font-size: 0.75rem; font-weight: 800; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.05em; z-index: 1; box-shadow: 0 4px 10px rgba(92,196,129,0.35);">أنت</div>
                                ${renderListRow(currentUserRow, 0, currentUserIndex + 1)}
                            </div>
                        </div>
                    ` : ''}
                ` : emptyState}
            </div>

            <style>
                .leaderboard-row-new:hover {
                    box-shadow: 0 12px 24px rgba(0,0,0,0.06);
                    border-color: var(--color-primary);
                    transform: translateY(-4px) scale(1.01);
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes podiumEntrance {
                    from { transform: translateY(100px) scale(0.8); opacity: 0; }
                    to { transform: rotate(0) scale(var(--scale)); opacity: 1; }
                }
                @keyframes slideRightFade {
                    from { transform: translateX(30px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @media (max-width: 768px) {
                    .podium-wrapper { 
                        flex-direction: column !important; 
                        align-items: center !important; 
                        gap: 40px !important;
                    }
                    .podium-rank-1 { order: 1; margin-bottom: 24px; }
                    .podium-rank-2 { order: 2; margin-bottom: 8px; }
                    .podium-rank-3 { order: 3; }
                    
                    /* Lower the huge podium blocks on mobile so they look like normal cards */
                    .podium-card > div:last-child {
                        height: auto !important;
                        min-height: 160px;
                        justify-content: center;
                    }
                    .podium-card {
                        width: 100% !important;
                        max-width: 320px !important;
                        transform: scale(1) !important;
                    }
                    .podium-card [style*="font-size: 2.3rem"] {
                        font-size: 1.8rem !important;
                    }
                    .podium-card [style*="font-size: 1.1rem"] {
                        font-size: 1.2rem !important;
                    }
                    [style*="font-size: 3.5rem"] { font-size: 2.2rem !important; }
                }
            </style>
        </div>
    `;
}
