/**
 * Authentication Pages (Student and Admin)
 * Luxury design requested by user.
 */

// Shared auth card layout
const AuthCard = (title, children, bottomLink) => `
    <div class="auth-card" style="animation: slideInRight var(--transition-slow);">
        <div class="auth-logo-container">
            <img src="حلية.svg" alt="Hilyah Logo" class="auth-logo" />
        </div>
        <h2 class="auth-title">${title}</h2>
        ${children}
        <div class="auth-bottom-link mt-8" style="text-align: center;">
            ${bottomLink}
        </div>
    </div>
    
    <!-- Creator Footer for Auth -->
    <footer style="
        position: absolute; bottom: 0; left: 0; right: 0;
        padding: 48px 24px max(32px, calc(16px + env(safe-area-inset-bottom))); 
        display: flex; flex-direction: column; align-items: center; gap: 32px; text-align: center;
    ">
        <img src="حلية.svg" alt="Hilyah Logo" style="height: 72px; width: auto; opacity: 0.9;" />
        <div>
            <div style="font-size:0.85rem; color:var(--text-tertiary); margin-bottom:12px; font-weight:600;">
                تم صناعة هذا النظام بواسطة
            </div>
            <img src="Ammar.png" alt="Ammar Logo" style="height: 48px; width: auto; opacity: 0.85;" />
        </div>
    </footer>
`;

export function LoginPage() {
    return AuthCard(
        "تسجيل دخول الطالب",
        `
        <form id="student-login-form" class="auth-form mt-8">
            <div id="student-login-error" style="display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.95rem; font-weight: 600; text-align: center;"></div>
            <div class="form-group">
                <label class="form-label">اسم الطالب / رقم الهوية</label>
                <input type="text" id="username" class="form-input" placeholder="أدخل اسمك" required />
            </div>
            <div class="form-group">
                <label class="form-label">كلمة المرور</label>
                <input type="password" id="password" class="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary w-full mt-4" style="padding: 14px; font-size: 1.1rem;">
                دخول
            </button>
        </form>
        `,
        `<a href="#/admin-login" class="text-secondary" style="font-size: 0.9rem;">دخول المشرفين</a>`
    );
}

// Attach event listeners after render
LoginPage.attachEvents = (store) => {
    const form = document.getElementById('student-login-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const submitBtn = form.querySelector('button[type="submit"]');

            // Setup UI states
            const errorBox = document.getElementById('student-login-error');
            errorBox.style.display = 'none';
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'جاري التحميل...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const userData = await response.json();
                    
                    // Strict Role Check for Student Login
                    if (userData.role !== 'student') {
                        errorBox.innerText = 'عذراً، هذا الحساب ليس حساب طالب. يرجى استخدام بوابة المشرفين.';
                        errorBox.style.display = 'block';
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                        return;
                    }

                    // Update global state (UI persistence handled by store)
                    store.login(userData);
                    
                    // Redirect
                    window.location.hash = '#/student';
                } else {
                    const error = await response.json();
                    let errorMsg = error.message;
                    if (errorMsg === 'Invalid credentials' || response.status === 401 || response.status === 404) {
                        errorMsg = 'الحساب غير موجود أو بيانات الدخول خاطئة';
                    } else if (response.status === 400) {
                        errorMsg = 'الرجاء إدخال اسم المستخدم وكلمة المرور';
                    }
                    errorBox.innerText = errorMsg || 'خطأ في تسجيل الدخول';
                    errorBox.style.display = 'block';
                }
            } catch (err) {
                console.error('Login error:', err);
                errorBox.innerText = 'حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً';
                errorBox.style.display = 'block';
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
};

export function AdminLoginPage() {
    return AuthCard(
        "تسجيل دخول المشرف",
        `
        <form id="admin-login-form" class="auth-form mt-8">
            <div id="admin-login-error" style="display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.95rem; font-weight: 600; text-align: center;"></div>
            <div class="form-group">
                <label class="form-label">اسم المستخدم المشرف</label>
                <input type="text" id="admin-username" class="form-input" placeholder="أدخل اسم المشرف" required />
            </div>
            <div class="form-group">
                <label class="form-label">كلمة المرور</label>
                <input type="password" id="admin-password" class="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary w-full mt-4" style="padding: 14px; font-size: 1.1rem; background: linear-gradient(135deg, #1A1D20, #5E636A);">
                دخول للإدارة
            </button>
        </form>
        `,
        `<a href="#/login" class="text-secondary" style="font-size: 0.9rem;">العودة لدخول الطلاب</a>`
    );
}

AdminLoginPage.attachEvents = (store) => {
    const form = document.getElementById('admin-login-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            const submitBtn = form.querySelector('button[type="submit"]');

            const errorBox = document.getElementById('admin-login-error');
            errorBox.style.display = 'none';

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'جاري التحميل...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const userData = await response.json();
                    
                    // Ensure admin login actually is an admin
                    if (userData.role !== 'admin') {
                         errorBox.innerText = 'عذراً، هذا الحساب ليس حساب مشرف. يرجى استخدام بوابة الطلاب.';
                         errorBox.style.display = 'block';
                         submitBtn.innerText = originalBtnText;
                         submitBtn.disabled = false;
                         return;
                    }

                    store.login(userData);
                    window.location.hash = '#/admin';
                } else {
                    const error = await response.json();
                    let errorMsg = error.message;
                    if (errorMsg === 'Invalid credentials' || response.status === 401 || response.status === 404) {
                        errorMsg = 'حساب المشرف غير موجود أو بيانات الدخول خاطئة';
                    }
                    errorBox.innerText = errorMsg || 'خطأ في تسجيل الدخول';
                    errorBox.style.display = 'block';
                }
            } catch (err) {
                console.error('Login error:', err);
                errorBox.innerText = 'حدث خطأ في الاتصال بالخادم';
                errorBox.style.display = 'block';
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
};
