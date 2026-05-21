import { Icons } from '../../components/icons.js';
import { supabase } from '../../store/supabase.js';

/**
 * Student Tasks — view tasks and submit with content
 */

const TARGET_BYTES = 500 * 1024;
const MAX_DIMENSION = 1920;

async function compressImage(file) {
    if (!file.type.startsWith('image/')) return file;
    if (file.size <= TARGET_BYTES) return file;

    const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = dataUrl;
    });

    let width = img.width;
    let height = img.height;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    let blob = null;
    let quality = 0.85;

    // Iteratively drop quality, then dimensions, until under target
    for (let attempt = 0; attempt < 8; attempt++) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
        if (blob && blob.size <= TARGET_BYTES) break;

        if (quality > 0.5) {
            quality -= 0.1;
        } else {
            width = Math.round(width * 0.85);
            height = Math.round(height * 0.85);
        }
    }

    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '');
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
}

export function StudentTasks(store) {
    const state = store.getState();
    const tasks = state.tasks.filter(t => t.isActive !== false);
    const submissions = state.submissions || [];
    const user = state.user;
    const admins = state.admins || [];
    const adminsById = Object.fromEntries(admins.map(a => [a.id, a]));
    const assignedLabel = (task) => {
        const ids = Array.isArray(task.assignedAdmins) ? task.assignedAdmins : [];
        if (ids.length === 0) return 'جميع المشرفين';
        const names = ids.map(id => adminsById[id]?.name).filter(Boolean);
        return names.length ? names.join('، ') : 'جميع المشرفين';
    };
    const c = (key, fb) => state.content[key] || fb;

    // Find this student's submission for a task
    const mySubmission = (taskId) => submissions.find(s => s.taskId === taskId);

    const renderBadge = (status) => {
        if (status === 'completed') return `<span style="background:rgba(92,196,129,0.15); color:var(--color-primary); padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700;">مكتملة ✓</span>`;
        if (status === 'submitted') return `<span style="background:rgba(255,167,38,0.12); color:#FFA726; padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700;">قيد المراجعة</span>`;
        if (status === 'rejected') return `<span style="background:rgba(239,68,68,0.12); color:#EF4444; padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700;">مرفوضة</span>`;
        return `<span style="background:rgba(81,173,173,0.12); color:var(--color-primary-dark); padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700;">قيد الانتظار</span>`;
    };

    const TRACK_COLORS = {
        'الثقافي': { grad: 'var(--color-primary-light),var(--color-primary-dark)' },
        'مسار تقني': { grad: 'var(--color-primary-dark),var(--color-primary)' },
        'الذاكرة الحديدية': { grad: '#9B72CF,var(--color-primary-dark)' },
        'الاجتماعي': { grad: 'var(--color-primary),var(--color-primary-dark)' },
    };
    const trackGrad = (t) => (TRACK_COLORS[t] || TRACK_COLORS['الثقافي']).grad;

    const renderCard = (task) => {
        const sub = mySubmission(task.id);
        const derivedStatus = sub ? (sub.status === 'approved' ? 'completed' : sub.status === 'rejected' ? 'rejected' : 'submitted') : 'pending';

        return `
            <div class="card task-compact-card" data-id="${task.id}" style="display:flex; flex-direction:column; position:relative; overflow:hidden; border-radius:var(--radius-lg); transition:all 0.3s; cursor:pointer;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--shadow-sm)'">
                <!-- Track accent bar -->
                <div style="position:absolute; top:0; right:0; width:6px; height:100%; background:linear-gradient(to bottom, ${trackGrad(task.track)});"></div>

                <div class="task-card-header" style="flex:1; display:flex; flex-direction:column; gap:8px;">
                    <span style="display:inline-block; font-size:0.75rem; color:white; background:linear-gradient(135deg, ${trackGrad(task.track)}); padding:4px 10px; border-radius:12px; font-weight:700; width:fit-content; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;">
                        ${task.track}
                    </span>
                    <h3 class="task-card-title" style="margin:0; color:var(--text-primary); font-weight:700; font-size:1.1rem; line-height:1.4; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${task.title}</h3>
                </div>

                <div class="task-card-footer" style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">
                    <div style="font-size:0.78rem; color:var(--text-tertiary); display:flex; align-items:center; gap:6px;">
                        <span style="font-weight:700;">المشرف:</span>
                        <span style="color:var(--text-secondary); font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${assignedLabel(task)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-weight:700; color:var(--color-primary-light); font-size:0.95rem;">
                            ${task.points} 🌟
                        </div>
                        ${renderBadge(derivedStatus)}
                    </div>
                </div>
            </div>
        `;
    };

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:40px;">
                <div style="width:56px; height:56px; border-radius:var(--radius-md); background:rgba(81,173,173,0.15); color:var(--color-primary-dark); display:flex; align-items:center; justify-content:center; border:1px solid rgba(81,173,173,0.3);">
                    ${Icons.Tasks}
                </div>
                <div>
                    <h1 style="margin:0; font-size:2.25rem;">${c('tasks.page.title', 'المهام الحالية')}</h1>
                    <p style="margin:4px 0 0; color:var(--text-secondary); font-size:1.05rem;">${c('tasks.page.subtitle', 'استعرض وسلّم مهامك')}</p>
                </div>
            </div>

            ${tasks.length > 0 ? `
                <div class="tasks-grid">
                    ${tasks.map(t => renderCard(t)).join('')}
                </div>
            ` : `
                <div class="card responsive-padding-huge" style="text-align:center; padding:80px;">
                    <div style="font-size:3rem; margin-bottom:16px;">📋</div>
                    <p style="color:var(--text-secondary);">لا توجد مهام متاحة حالياً.</p>
                </div>
            `}
        </div>

        <!-- Task Detail Modal -->
        <div id="task-detail-modal" style="display:none; position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s; padding:16px;">
            <div id="task-detail-modal-content" class="responsive-modal" style="background:var(--bg-surface); width:100%; max-width:600px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 10px 40px rgba(0,0,0,0.2); transition:transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); transform:translateY(50px);">
                <!-- Header -->
                <div style="padding:20px 24px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.02);">
                    <h3 style="margin:0; font-size:1.25rem;">تفاصيل المهمة</h3>
                    <button id="close-task-modal" class="btn" style="padding:8px; background:var(--bg-surface-hover); border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer;">✕</button>
                </div>
                <!-- Body -->
                <div id="task-modal-body" style="padding:24px; overflow-y:auto; flex:1;">
                </div>
            </div>
        </div>
    `;
}

StudentTasks.attachEvents = (store) => {
    const state = store.getState();
    const tasks = state.tasks.filter(t => !t.disabled);
    const submissions = state.submissions || [];
    const user = state.user;
    const admins = state.admins || [];
    const adminsById = Object.fromEntries(admins.map(a => [a.id, a]));
    const assignedLabel = (task) => {
        const ids = Array.isArray(task.assignedAdmins) ? task.assignedAdmins : [];
        if (ids.length === 0) return 'جميع المشرفين';
        const names = ids.map(id => adminsById[id]?.name).filter(Boolean);
        return names.length ? names.join('، ') : 'جميع المشرفين';
    };
    const c = (key, fb) => state.content[key] || fb;

    const mySubmission = (taskId) => submissions.find(s => s.taskId === taskId);

    const modal = document.getElementById('task-detail-modal');
    const modalContent = document.getElementById('task-detail-modal-content');
    const modalBody = document.getElementById('task-modal-body');
    const closeBtn = document.getElementById('close-task-modal');

    const closeModal = () => {
        if (modal) {
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(50px)';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 200);
        }
    };

    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    const TRACK_COLORS = {
        'الثقافي': { grad: 'var(--color-primary-light),var(--color-primary-dark)' },
        'مسار تقني': { grad: 'var(--color-primary-dark),var(--color-primary)' },
        'الذاكرة الحديدية': { grad: '#9B72CF,var(--color-primary-dark)' },
        'الاجتماعي': { grad: 'var(--color-primary),var(--color-primary-dark)' },
    };
    const trackGrad = (t) => (TRACK_COLORS[t] || TRACK_COLORS['الثقافي']).grad;

    const renderBadge = (status) => {
        if (status === 'completed') return `<span style="background:rgba(92,196,129,0.15); color:var(--color-primary); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">مكتملة ✓</span>`;
        if (status === 'submitted') return `<span style="background:rgba(255,167,38,0.12); color:#FFA726; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">قيد المراجعة</span>`;
        if (status === 'rejected') return `<span style="background:rgba(239,68,68,0.12); color:#EF4444; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">مرفوضة</span>`;
        return `<span style="background:rgba(81,173,173,0.12); color:var(--color-primary-dark); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">قيد الانتظار</span>`;
    };

    const openModal = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        const sub = mySubmission(task.id);
        const derivedStatus = sub ? (sub.status === 'approved' ? 'completed' : sub.status === 'rejected' ? 'rejected' : 'submitted') : 'pending';
        const isSubmitted = derivedStatus === 'submitted';
        const isCompleted = derivedStatus === 'completed';
        const isPending = derivedStatus === 'pending';
        const isRejected = derivedStatus === 'rejected';
        const canSubmit = isPending || isRejected;
        const rejectionNote = sub?.feedback || sub?.adminComment || '';

        modalBody.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header Info -->
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <span style="font-size:0.85rem; color:var(--text-tertiary); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; display:inline-block; margin-bottom:4px;">${task.track}</span>
                        <h2 style="font-size:1.5rem; margin:0; color:var(--text-primary); font-weight:700; line-height:1.4;">${task.title}</h2>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                        <div style="background:rgba(232,194,109,0.1); border:1px solid rgba(232,194,109,0.3); padding:5px 14px; border-radius:20px; font-weight:700; color:var(--color-primary-light); white-space:nowrap;">
                            ${task.points} 🌟
                        </div>
                        ${renderBadge(derivedStatus)}
                    </div>
                </div>

                <!-- Description -->
                <div style="background:var(--bg-main); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
                    <p style="margin:0; color:var(--text-secondary); font-size:1rem; line-height:1.7;">${task.description.replace(/\n/g, '<br>')}</p>
                </div>

                <!-- Task Image (optional) -->
                ${task.imageUrl ? `
                <div style="border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-color);">
                    <img src="${task.imageUrl}" alt="صورة المهمة" style="width:100%; height:auto; display:block;" />
                </div>
                ` : ''}

                <!-- Resource Link (optional) -->
                ${task.resourceLink ? `
                <a href="${task.resourceLink}" target="_blank" rel="noopener noreferrer" style="
                    display:flex; align-items:center; gap:10px; padding:14px 20px;
                    background:rgba(81,173,173,0.08); border:1px solid rgba(81,173,173,0.3);
                    border-radius:var(--radius-md); text-decoration:none; font-weight:700;
                    color:var(--color-primary-dark); font-size:0.95rem; transition:background 0.2s;
                " onmouseover="this.style.background='rgba(81,173,173,0.15)'" onmouseout="this.style.background='rgba(81,173,173,0.08)'">
                    <span style="font-size:1.2rem;">🔗</span> افتح الرابط المرجعي
                </a>
                ` : ''}

                <!-- Meta Info -->
                <div style="display:flex; flex-direction:column; gap:8px; padding:16px; background:var(--bg-surface-hover); border-radius:var(--radius-md);">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--text-secondary); font-size:0.9rem;">طريقة التسليم:</span>
                        <strong style="color:var(--text-primary); font-size:0.95rem;">${task.submissionMethod}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--text-secondary); font-size:0.9rem;">آخر موعد:</span>
                        <strong style="color:var(--text-primary); font-size:0.95rem;">${task.deadline}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--text-secondary); font-size:0.9rem;">المشرف المسؤول:</span>
                        <strong style="color:var(--text-primary); font-size:0.95rem;">${assignedLabel(task)}</strong>
                    </div>
                </div>

                <!-- Show result if approved -->
                ${isCompleted && sub?.grade !== undefined ? `
                    <div style="background:rgba(92,196,129,0.08); border:1px solid rgba(92,196,129,0.25); border-radius:var(--radius-sm); padding:14px 16px;">
                        <div style="font-weight:700; color:var(--color-primary); font-size:1rem; margin-bottom:4px;">🏅 نقاطك: ${sub.grade} / ${task.points}</div>
                        ${sub.feedback ? `<div style="font-size:0.88rem; color:var(--text-secondary); font-style:italic;">"${sub.feedback}"</div>` : ''}
                    </div>
                ` : ''}

                <!-- Show rejection note (student can resubmit below) -->
                ${isRejected ? `
                    <div style="background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.25); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px;">
                        <div style="font-weight:700; color:#EF4444; font-size:0.95rem;">❌ تم رد المهمة — يمكنك إعادة التسليم</div>
                        ${rejectionNote ? `<div style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6;"><strong style="color:var(--text-primary);">ملاحظة المشرف:</strong> "${rejectionNote}"</div>` : '<div style="font-size:0.88rem; color:var(--text-tertiary);">لم يترك المشرف ملاحظة.</div>'}
                    </div>
                ` : ''}

                <!-- Submission form -->
                ${canSubmit ? (task.submissionMethod === 'إقرار بالإنجاز' ? `
                    <div style="margin-top:8px;">
                        ${task.assignedAdmins.length === 0 ? `
                        <div style="margin-bottom:16px; background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
                            <label style="display:block; font-weight:700; color:var(--text-primary); margin-bottom:10px; font-size:0.95rem;">اختر المشرف المسؤول عنك:</label>
                            <select id="modal-admin-picker" class="form-input" style="width:100%; padding:10px 14px; font-size:0.95rem; border-radius:var(--radius-sm);">
                                <option value="">-- اختر مشرفك --</option>
                                ${admins.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
                            </select>
                        </div>
                        ` : ''}
                        <div style="background:rgba(81,173,173,0.06); border:1px solid rgba(81,173,173,0.25); border-radius:var(--radius-md); padding:20px; text-align:center;">
                            <div style="font-size:2.5rem; margin-bottom:12px;">🤝</div>
                            <div style="font-weight:700; color:var(--text-primary); margin-bottom:6px;">${isRejected ? 'إعادة الإقرار بالإنجاز' : 'الإقرار بالإنجاز'}</div>
                            <p style="margin:0 0 16px; color:var(--text-secondary); font-size:0.92rem; line-height:1.6;">
                                بالضغط على الزر أدناه، أنت تؤكد أمام المشرف بأنك أنجزت هذه المهمة.
                            </p>
                            <button id="modal-acknowledge-btn" class="btn btn-primary" style="padding:14px 32px; font-size:1.05rem; font-weight:700;">
                                ✓ ${isRejected ? 'إعادة الإقرار بالإنجاز' : 'أقر بأنني أنجزت المهمة'}
                            </button>
                        </div>
                    </div>
                ` : `
                    <div style="margin-top:8px;">
                        ${task.assignedAdmins.length === 0 ? `
                        <div style="margin-bottom:16px; background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
                            <label style="display:block; font-weight:700; color:var(--text-primary); margin-bottom:10px; font-size:0.95rem;">اختر المشرف المسؤول عنك:</label>
                            <select id="modal-admin-picker" class="form-input" style="width:100%; padding:10px 14px; font-size:0.95rem; border-radius:var(--radius-sm);">
                                <option value="">-- اختر مشرفك --</option>
                                ${admins.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
                            </select>
                        </div>
                        ` : ''}
                        <label style="display:block; font-weight:700; margin-bottom:12px; color:var(--text-primary);">${isRejected ? 'إرفاق إثبات جديد (سيتم استبدال الملف السابق)' : 'إرفاق إثبات الإنجاز (صورة، فيديو، أو PDF)'}</label>

                        <div id="drop-zone" class="responsive-padding-huge" style="
                            border: 2px dashed var(--border-color);
                            border-radius: var(--radius-lg);
                            padding: 40px 20px;
                            text-align: center;
                            cursor: pointer;
                            transition: all 0.2s;
                            background: var(--bg-surface-hover);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 12px;
                        " onmouseover="this.style.borderColor='var(--color-primary)'; this.style.background='rgba(92,196,129,0.05)'" onmouseout="this.style.borderColor='var(--border-color)'; this.style.background='var(--bg-surface-hover)'">
                            <div style="font-size: 2.5rem; color: var(--color-primary);">${Icons.Upload || '📁'}</div>
                            <div>
                                <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">اسحب الملف هنا أو اضغط للاختيار</div>
                                <div style="font-size: 0.85rem; color: var(--text-secondary);">الحد الأقصى: 10 ميجابايت (JPG, PNG, JPEG, DOCX, PDF)</div>
                            </div>
                            <input type="file" id="task-file-input" style="display: none;" accept="image/*,video/*,.pdf,.docx" />
                        </div>

                        <div id="upload-status" style="display: none; margin-top: 20px;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px;">
                                <span id="file-name" style="color: var(--text-primary); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%;"></span>
                                <span id="upload-percent" style="color: var(--color-primary); font-weight: 700;">0%</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: var(--border-color); border-radius: 3px; overflow: hidden;">
                                <div id="progress-bar" style="width: 0%; height: 100%; background: var(--color-primary); transition: width 0.3s;"></div>
                            </div>
                        </div>

                        <button id="modal-submit-task-btn" class="btn btn-primary" style="width:100%; padding:14px; font-size:1.05rem; font-weight:700; margin-top: 24px;" disabled>
                            ↑ ${isRejected ? 'إعادة التسليم' : c('ui.submit.task', 'إرسال التسليم')}
                        </button>
                    </div>
                `) : ''}
            </div>
        `;

        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';
        // Trigger flow
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        });

        // Attach submit event listener inside modal
        const submitBtn = modalBody.querySelector('#modal-submit-task-btn');
        const fileInput = modalBody.querySelector('#task-file-input');
        const dropZone = modalBody.querySelector('#drop-zone');
        const uploadStatus = modalBody.querySelector('#upload-status');
        const fileNameEl = modalBody.querySelector('#file-name');
        const uploadPercentEl = modalBody.querySelector('#upload-percent');
        const progressBar = modalBody.querySelector('#progress-bar');

        let selectedFile = null;

        const formatSize = (bytes) => {
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
            return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
        };

        const handleFileSelect = async (file) => {
            if (!file) return;
            if (file.size > 10 * 1024 * 1024 && !file.type.startsWith('image/')) {
                alert('عذراً، حجم الملف كبير جداً (الأقصى 10 ميجا)');
                return;
            }

            uploadStatus.style.display = 'block';
            submitBtn.disabled = true;
            dropZone.style.borderColor = 'var(--color-primary)';
            dropZone.style.background = 'rgba(92,196,129,0.05)';

            const isImage = file.type.startsWith('image/');
            const originalSize = file.size;
            let processed = file;

            if (isImage && originalSize > TARGET_BYTES) {
                fileNameEl.textContent = `جاري ضغط الصورة... (${formatSize(originalSize)})`;
                uploadPercentEl.textContent = '';
                try {
                    processed = await compressImage(file);
                } catch (err) {
                    console.error('Image compression failed:', err);
                    processed = file;
                }
            }

            if (processed.size > 10 * 1024 * 1024) {
                alert('عذراً، حجم الملف كبير جداً (الأقصى 10 ميجا)');
                uploadStatus.style.display = 'none';
                return;
            }

            selectedFile = processed;
            const compressedNote = (isImage && processed.size < originalSize)
                ? ` (مضغوط من ${formatSize(originalSize)} إلى ${formatSize(processed.size)})`
                : '';
            fileNameEl.textContent = `${processed.name}${compressedNote}`;
            uploadPercentEl.textContent = '0%';
            submitBtn.disabled = false;
        };

        dropZone?.addEventListener('click', () => fileInput.click());
        fileInput?.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));

        // Drag and drop events
        dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--color-primary)'; });
        dropZone?.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border-color)'; });
        dropZone?.addEventListener('drop', (e) => {
            e.preventDefault();
            handleFileSelect(e.dataTransfer.files[0]);
        });

        // Acknowledgement flow — no file upload, post sentinel directly
        const ackBtn = modalBody.querySelector('#modal-acknowledge-btn');
        if (ackBtn) {
            ackBtn.addEventListener('click', async () => {
                const adminPicker = modalBody.querySelector('#modal-admin-picker');
                if (adminPicker && !adminPicker.value) {
                    alert('يرجى اختيار المشرف المسؤول عنك أولاً');
                    return;
                }
                if (!confirm('هل تؤكد إقرارك بإنجاز هذه المهمة؟ سيتم إرسال الإقرار للمشرف للمراجعة.')) return;
                ackBtn.disabled = true;
                const originalText = ackBtn.innerText;
                ackBtn.innerText = 'جاري الإرسال...';
                const selectedAdminId = adminPicker?.value || null;
                try {
                    const response = await fetch('/api/submissions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ taskId: task.id, fileUrl: 'acknowledgement://confirmed', ...(selectedAdminId ? { selectedAdminId } : {}) })
                    });
                    if (response.ok) {
                        alert(isRejected ? 'تم إعادة الإقرار بنجاح! 🎉' : 'تم إرسال الإقرار بنجاح! 🎉');
                        closeModal();
                        await store.fetchTasks();
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        alert(errorData.message || 'حدث خطأ أثناء إرسال الإقرار');
                        ackBtn.disabled = false;
                        ackBtn.innerText = originalText;
                    }
                } catch (err) {
                    console.error('Acknowledgement error:', err);
                    alert('تعذر إرسال الإقرار، يرجى المحاولة مرة أخرى.');
                    ackBtn.disabled = false;
                    ackBtn.innerText = originalText;
                }
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                if (!selectedFile) return;
                const adminPicker = modalBody.querySelector('#modal-admin-picker');
                if (adminPicker && !adminPicker.value) {
                    alert('يرجى اختيار المشرف المسؤول عنك أولاً');
                    return;
                }
                const selectedAdminId = adminPicker?.value || null;

                // 1. Loading state
                submitBtn.innerText = 'جاري رفع الملف...';
                submitBtn.disabled = true;

                try {
                    // 2. Upload to Supabase Storage
                    const fileExt = selectedFile.name.split('.').pop();
                    const fileName = `${user.id}_${task.id}_${Date.now()}.${fileExt}`;
                    const filePath = `${fileName}`;

                    // We use the storage client directly
                    const { data, error } = await supabase.storage
                        .from('submissions')
                        .upload(filePath, selectedFile, {
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (error) throw error;

                    // Update progress visually (since upload is done here)
                    progressBar.style.width = '100%';
                    uploadPercentEl.textContent = '100%';
                    submitBtn.innerText = 'جاري الحفظ في القاعدة...';

                    // 3. Get Public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('submissions')
                        .getPublicUrl(filePath);

                    // 4. Save to database via our API
                    const response = await fetch('/api/submissions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            taskId: task.id,
                            fileUrl: publicUrl,
                            ...(selectedAdminId ? { selectedAdminId } : {})
                        })
                    });

                    if (response.ok) {
                        const result = await response.json().catch(() => ({}));

                        // Clean up the superseded file on resubmit. Best-effort:
                        // a failure here doesn't block the success UX.
                        if (result.oldFileUrl) {
                            try {
                                const oldPath = result.oldFileUrl.split('/submissions/').pop();
                                if (oldPath) {
                                    await supabase.storage.from('submissions').remove([oldPath]);
                                }
                            } catch (cleanupErr) {
                                console.warn('Old submission file cleanup failed:', cleanupErr);
                            }
                        }

                        alert(isRejected ? 'تم إعادة التسليم بنجاح! 🎉' : 'تم تسليم المهمة بنجاح! 🎉');
                        closeModal();
                        await store.fetchTasks();
                    } else {
                        const errorData = await response.json();
                        alert(errorData.message || 'حدث خطأ أثناء حفظ التسليم');
                    }
                } catch (err) {
                    console.error('Submission error:', err);
                    alert('خطأ في الرفع: يرجى التأكد من إضافة مفتاح API الخاص بـ Supabase في ملف js/store/supabase.js');
                } finally {
                    submitBtn.innerText = 'إرسال التسليم';
                    submitBtn.disabled = false;
                }
            });
        }
    };

    document.querySelectorAll('.task-compact-card').forEach(card => {
        card.addEventListener('click', () => {
            const taskId = card.getAttribute('data-id');
            openModal(taskId);
        });
    });
};
