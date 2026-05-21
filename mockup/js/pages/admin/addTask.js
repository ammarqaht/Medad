import { Icons } from '../../components/icons.js';
import { supabase } from '../../store/supabase.js';

export function AdminAddTask(store) {
    const state = store ? store.getState() : { admins: [] };
    const admins = state.admins || [];

    return `
        <div style="animation: slideUpFade var(--transition-slow); max-width: 900px; margin: 0 auto;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 40px;">
                <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(92, 196, 129, 0.1); color: var(--color-primary); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(92, 196, 129, 0.2);">
                    ${Icons.Idea}
                </div>
                <div>
                    <h1 style="margin: 0; font-size: 2.25rem;">إنشاء مهمة جديدة</h1>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">قم بإضافة المهام والتحديات لتظهر للطلاب.</p>
                </div>
            </div>

            <div class="card responsive-padding" style="padding: 48px; border-radius: var(--radius-xl);">
                <form id="add-task-form">
                    <div class="form-group" style="margin-bottom: 32px;">
                        <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">عنوان المهمة</label>
                        <input type="text" id="task-title" class="form-input" placeholder="مثال: قراءة فصل من كتاب..." required style="padding: 16px; font-size: 1.05rem;" />
                    </div>

                    <div class="form-group" style="margin-bottom: 32px;">
                        <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">الوصف المكتوب</label>
                        <textarea id="task-desc" class="form-input" rows="5" placeholder="اشرح للطلاب ما المطلوب إنجازه بالتفصيل..." required style="resize: vertical; padding: 16px; font-size: 1.05rem;"></textarea>
                    </div>

                    <div class="responsive-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">تصنيف / مسار المهمة</label>
                            <select id="task-track" class="form-input" required style="padding: 16px; font-size: 1.05rem;">
                                <option value="مسار تقني">مسار تقني</option>
                                <option value="الذاكرة الحديدية">الذاكرة الحديدية</option>
                                <option value="مسار إعلامي">مسار إعلامي</option>
                                <option value="الثقافي">الثقافي</option>
                                <option value="منوع">منوع</option>
                                <option value="اجتماعي">اجتماعي</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin: 0;">
                            <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">نقاط الإنجاز</label>
                            <input type="number" id="task-points" class="form-input" placeholder="مثال: 30" required min="1" style="padding: 16px; font-size: 1.05rem;" />
                        </div>
                    </div>

                    <div class="responsive-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">طريقة التسليم</label>
                            <select id="task-submethod" class="form-input" required style="padding: 16px; font-size: 1.05rem;">
                                <option value="رفع ملف">رفع ملف (صورة / كود / PDF)</option>
                                <option value="إقرار بالإنجاز">إقرار بالإنجاز فقط</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin: 0;">
                            <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">الموعد النهائي</label>
                            <input type="date" id="task-deadline" class="form-input" required style="padding: 16px; font-size: 1.05rem; font-family: inherit;" />
                        </div>
                    </div>

                    <!-- Optional: Task Image -->
                    <div class="form-group" style="margin-bottom: 32px;">
                        <label class="form-label" style="font-size: 1rem; margin-bottom: 6px;">إضافة صورة للمهمة <span style="color:var(--text-tertiary); font-weight:400; font-size:0.85rem;">(اختياري)</span></label>
                        <p style="margin: 0 0 12px; color:var(--text-tertiary); font-size:0.85rem;">تظهر أسفل الوصف في صفحة المهمة للطالب.</p>
                        <div id="task-img-dropzone" style="border:2px dashed var(--border-color); border-radius:var(--radius-md); padding:28px 20px; text-align:center; cursor:pointer; background:var(--bg-surface-hover); transition:all 0.2s;"
                            onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='var(--border-color)'">
                            <input type="file" id="task-img-input" accept="image/*" style="display:none;" />
                            <div id="task-img-placeholder">
                                <div style="font-size:2rem; margin-bottom:8px;">🖼️</div>
                                <div style="font-weight:600; color:var(--text-secondary); font-size:0.9rem;">اضغط لاختيار صورة</div>
                            </div>
                            <img id="task-img-preview" src="" alt="" style="display:none; max-height:200px; max-width:100%; border-radius:var(--radius-sm); object-fit:contain;" />
                        </div>
                        <div id="task-img-status" style="margin-top:8px; font-size:0.85rem; color:var(--text-secondary);"></div>
                    </div>

                    <!-- Optional: Resource Link -->
                    <div class="form-group" style="margin-bottom: 32px;">
                        <label class="form-label" style="font-size: 1rem; margin-bottom: 6px;">رابط مرجعي <span style="color:var(--text-tertiary); font-weight:400; font-size:0.85rem;">(اختياري)</span></label>
                        <p style="margin: 0 0 12px; color:var(--text-tertiary); font-size:0.85rem;">يظهر للطالب كزر "افتح الرابط" في تفاصيل المهمة.</p>
                        <input type="url" id="task-resource-link" class="form-input" placeholder="مثال: https://..." style="padding: 16px; font-size: 1.05rem;" />
                    </div>

                    <div class="form-group" style="margin-bottom: 40px;">
                        <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">المشرف المسؤول عن التقييم</label>
                        <p style="margin: 0 0 14px; color: var(--text-tertiary); font-size: 0.88rem;">اختر مشرفاً واحداً أو أكثر. اختيار "جميع المشرفين" يعني أن كل المشرفين مسؤولون.</p>
                        <div id="admin-chips" style="display: flex; flex-wrap: wrap; gap: 10px;">
                            <button type="button" class="admin-chip admin-chip-all active" data-admin-id="" style="padding: 10px 18px; border-radius: 999px; border: 1px solid var(--color-primary); background: var(--color-primary); color: white; font-weight: 700; cursor: pointer; font-size: 0.95rem;">
                                جميع المشرفين
                            </button>
                            ${admins.map(a => `
                                <button type="button" class="admin-chip" data-admin-id="${a.id}" style="padding: 10px 18px; border-radius: 999px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary); font-weight: 600; cursor: pointer; font-size: 0.95rem;">
                                    ${a.name}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="responsive-actions" style="margin-top: 48px; display: flex; gap: 16px; justify-content: flex-end; padding-top: 32px; border-top: 1px solid var(--border-color);">
                        <a href="#/admin" class="btn btn-secondary" style="padding: 14px 28px; font-size: 1.05rem; font-weight: 600;">إلغاء</a>
                        <button type="submit" class="btn btn-primary" style="padding: 14px 40px; font-size: 1.05rem; font-weight: 600;">نشر المهمة والتحدي</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

AdminAddTask.attachEvents = (store) => {
    const form = document.getElementById('add-task-form');
    const chipsWrap = document.getElementById('admin-chips');

    // ── Image upload ──────────────────────────────────────────────────────────
    let uploadedImageUrl = null;
    const imgDropzone = document.getElementById('task-img-dropzone');
    const imgInput = document.getElementById('task-img-input');
    const imgPreview = document.getElementById('task-img-preview');
    const imgPlaceholder = document.getElementById('task-img-placeholder');
    const imgStatus = document.getElementById('task-img-status');

    imgDropzone?.addEventListener('click', () => imgInput?.click());
    imgInput?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        imgStatus.style.color = 'var(--text-secondary)';
        imgStatus.textContent = 'جاري الرفع...';

        try {
            const ext = file.name.split('.').pop();
            const path = `task-images/${Date.now()}.${ext}`;
            const { error } = await supabase.storage.from('submissions').upload(path, file, { upsert: false });
            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(path);
            uploadedImageUrl = publicUrl;
            imgPreview.src = publicUrl;
            imgPreview.style.display = 'block';
            imgPlaceholder.style.display = 'none';
            imgStatus.style.color = 'var(--color-primary)';
            imgStatus.textContent = 'تم رفع الصورة بنجاح ✓';
        } catch (err) {
            imgStatus.style.color = '#ef4444';
            imgStatus.textContent = 'فشل رفع الصورة، حاول مجدداً';
        }
    });

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

    chipsWrap?.querySelectorAll('.admin-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const isAll = chip.classList.contains('admin-chip-all');
            const allChip = chipsWrap.querySelector('.admin-chip-all');
            const otherChips = chipsWrap.querySelectorAll('.admin-chip:not(.admin-chip-all)');

            if (isAll) {
                setChipActive(allChip, true);
                otherChips.forEach(c => setChipActive(c, false));
            } else {
                const nowActive = !chip.classList.contains('active');
                setChipActive(chip, nowActive);
                const anyIndividual = Array.from(otherChips).some(c => c.classList.contains('active'));
                setChipActive(allChip, !anyIndividual);
            }
        });
    });

    const collectAdmins = () => {
        const allChip = chipsWrap?.querySelector('.admin-chip-all');
        if (!chipsWrap || allChip?.classList.contains('active')) return [];
        return Array.from(chipsWrap.querySelectorAll('.admin-chip:not(.admin-chip-all).active'))
            .map(c => c.getAttribute('data-admin-id'))
            .filter(Boolean);
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const resourceLink = document.getElementById('task-resource-link').value.trim();
            const task = {
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-desc').value,
                track: document.getElementById('task-track').value,
                points: parseInt(document.getElementById('task-points').value),
                submissionMethod: document.getElementById('task-submethod').value,
                deadline: document.getElementById('task-deadline').value,
                assignedAdmins: collectAdmins(),
                ...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {}),
                ...(resourceLink ? { resourceLink } : {}),
            };

            await store.addTask(task);
            alert('تم نشر المهمة بنجاح!');
            window.location.hash = '#/admin/tasks';
        });
    }
};
