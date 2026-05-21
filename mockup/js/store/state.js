/**
 * Simple Reactive Data Store — CMS v2 + Submission System
 */

const defaultContent = {
    'hero.title': 'مرحباً بك،',
    'hero.subtitle': 'في برنامج حِلْيَة، نبني الانضباط والمعرفة والأخلاق النبيلة. استمر في تقدمك نحو التميز.',
    'nav.home': 'الرئيسية',
    'nav.idea': 'فكرة البرنامج',
    'nav.calendar': 'التقويم',
    'nav.tasks': 'المهام',
    'nav.points': 'النقاط',
    'nav.leaderboard': 'الترتيب',
    'dashboard.guide.title': 'لوحة التوجيه',
    'card.idea.title': 'فكرة البرنامج',
    'card.idea.description': 'تعرف على فلسفة وأهداف برنامج حلية لبناء الأخلاق والمهارات.',
    'card.calendar.title': 'التقويم',
    'card.calendar.description': 'جدولك الأسبوعي للمهام والمناشط المخطط لها بدقة.',
    'card.tasks.title': 'المهام',
    'card.tasks.description': 'استعرض، سلم، وتابع مهامك مقسمة حسب المسارات المختلفة.',
    'card.points.title': 'النقاط والإنجازات',
    'card.points.description': 'راقب تقدمك الحيازي وإنجازاتك وترتيبك بين أقرانك.',
    'idea.page.title': 'فكرة البرنامج',
    'idea.main.heading': 'رؤية تجمع بين الأصالة والمعاصرة',
    'idea.main.heading.highlight': 'لبناء شخصية متكاملة.',
    'idea.main.quote': '"حِلْيَة هو برنامج صُمم لمساعدة الطلاب على العيش بأخلاق نبيلة وعادات هادفة. من خلال التحديات المنظمة، الاستكشاف الفكري، والمسؤولية الاجتماعية، يبني الطلاب الانضباط، يوسعون مداركهم، ويهذبون شخصياتهم."',
    'idea.pillar1.title': 'التعلّم المستمر',
    'idea.pillar1.description': 'تشجيع فضول المعرفة كنمط حياة عبر مسارات قرائية وثقافية تلائم تطلعات الشباب المتجددة، ليكونوا قادة الفكر في المستقبل.',
    'idea.pillar2.title': 'المساهمة الاجتماعية',
    'idea.pillar2.description': 'صناعة الأثر في المحيط المباشر وتنمية جسور التواصل البنّاء مع كافة فئات المجتمع، لتحقيق المواطنة الإيجابية والفعلية.',
    'idea.pillar3.title': 'التميز الشخصي',
    'idea.pillar3.description': 'الارتقاء بالذات، وتنمية الذاكرة الحديدية والمهارات التقنية والإعلامية التي يتطلبها العصر لتسريع عجلة الابتكار.',
    'tasks.page.title': 'المهام الحالية',
    'tasks.page.subtitle': 'استعرض وسلّم مهامك في المسارات المختلفة',
    'points.page.title': 'النقاط والإنجازات',
    'points.page.subtitle': 'تابع تقدمك وأوسمتك في برنامج حِلْيَة',
    'calendar.page.title': 'التقويم',
    'calendar.page.subtitle': 'خطط لمهامك وعاداتك شهرياً',
    'ui.submit.task': 'تسليم المهمة',
    'ui.logout': 'تسجيل الخروج',
    'ui.leaderboard.title': 'النقاط العامة ولوحة الشرف',
    'admin.dashboard.title': 'لوحة تحكم المشرف',
    'admin.dashboard.subtitle': 'نظرة عامة على أداء وإنجازات الطلاب.',
};

const defaultFeatureVisibility = { idea: true, calendar: true, tasks: true, points: true, leaderboard: true };

class Store {
    constructor() {
        const savedState = localStorage.getItem('hilyah_state');
        const defaultState = {
            theme: localStorage.getItem('theme') || 'light',
            user: null,
            editMode: false,
            content: defaultContent,
            featureVisibility: defaultFeatureVisibility,
            tasks: [],
            submissions: [],
            weeklySlider: {
                image: 'https://images.unsplash.com/photo-1540317580114-ed684c15ff71?auto=format&fit=crop&q=80&w=1400',
                imageMobile: '', // New field for mobile-specific slider image
                title: 'أدب الأسبوع',
                subtitle: 'احرص على بشاشة الوجه وإلقاء السلام على من عرفت ومن لم تعرف، فالسلام من أسباب المودة.',
                active: true
            },
            features: [],
            students: [],
            admins: [],
            lastActivity: Date.now(),
        };

        if (savedState) {
            const parsed = JSON.parse(savedState);
            this.state = {
                ...defaultState,
                ...parsed,
                content: { ...defaultContent, ...(parsed.content || {}) },
                featureVisibility: { ...defaultFeatureVisibility, ...(parsed.featureVisibility || {}) },
                weeklySlider: { ...defaultState.weeklySlider, ...(parsed.weeklySlider || {}) },
                // CRITICAL: Never load these from localStorage to prevent staleness
                tasks: [],
                submissions: [],
                students: [], 
                features: parsed.features || [],
                editMode: false,
                lastActivity: parsed.lastActivity || Date.now(),
            };

            // Session check on boot
            const TIMEOUT_DURATION = 5 * 60 * 1000;
            if (this.state.user && (Date.now() - this.state.lastActivity > TIMEOUT_DURATION)) {
                console.log('Session expired on boot');
                this.state.user = null;
                this.state.editMode = false;
                // Redirect will be handled by router after initialization if needed
            }
            // Ensure newly added features have a visibility state (migration for old localStorage)
            if (this.state.featureVisibility.leaderboard === undefined) {
                this.state.featureVisibility.leaderboard = true;
            }
        } else {
            this.state = defaultState;
        }
        this.listeners = [];
    }

    getState() { return this.state; }
    getText(key) { return this.state.content[key] || key; }

    setState(newState) {
        this.state = { 
            ...this.state, 
            ...newState,
            lastActivity: Date.now() // Record activity on any state change
        };
        try {
            localStorage.setItem('hilyah_state', JSON.stringify(this.state));
        } catch (e) {
            console.warn('Could not save state to localStorage:', e);
        }
        this.notify();
    }

    recordActivity() {
        // Throttle to once every 30 seconds to save localStorage writes.
        // Update lastActivity in place without notifying — activity ticks
        // must never trigger a UI re-render.
        const now = Date.now();
        if (!this.state.lastActivity || (now - this.state.lastActivity > 30 * 1000)) {
            this.state.lastActivity = now;
            try {
                localStorage.setItem('hilyah_state', JSON.stringify(this.state));
            } catch (e) { /* ignore */ }
        }
    }

    isSessionExpired() {
        if (!this.state.user) return false;
        const TIMEOUT_DURATION = 5 * 60 * 1000;
        return (Date.now() - this.state.lastActivity > TIMEOUT_DURATION);
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    notify(force = false) { 
        if (this.pauseNotifications && !force) {
            console.log('Notifications paused (modal active)');
            return;
        }
        this.listeners.forEach(l => l(this.state)); 
    }

    setPauseNotifications(val) {
        this.pauseNotifications = val;
        if (!val) this.notify(); // Catch up on unpause
    }

    async fetchTasks() {
        try {
            const user = this.state.user;
            
            if (user && user.role === 'student') {
                await this.fetchStudentSubmissions();
            }

            const timestamp = Date.now();
            const url = (!user || user.role !== 'admin')
                ? `/api/tasks?activeOnly=true&v=${timestamp}`
                : `/api/tasks?v=${timestamp}`;

            const res = await fetch(url, { cache: 'no-store' });
            if (res.ok) {
                const tasks = await res.json();

                const mappedTasks = tasks.map(t => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    track: t.track || "عام",
                    submissionMethod: t.submissionMethod || "كتابة ملخص",
                    maxPoints: t.maxPoints || 0,
                    points: t.maxPoints || 0, // Keep for backward compatibility in UI
                    assignedAdmins: Array.isArray(t.assignedAdmins) ? t.assignedAdmins : [],
                    isActive: t.isActive !== false,
                    deadline: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : "",
                    displayDeadline: t.dueDate ? new Date(t.dueDate).toLocaleDateString('ar-SA') : "غير محدد",
                    disabled: t.isActive === false,
                    imageUrl: t.imageUrl || null,
                    resourceLink: t.resourceLink || null,
                    visibility: t.visibility || 'all',
                    visibleToIds: Array.isArray(t.visibleToIds) ? t.visibleToIds : [],
                }));

                // Only trigger notify if there is a fundamental length change, OR we explicitly requested a force update.
                this.state.tasks = mappedTasks; // Update memory directly
                this.notify();
            } else {
                console.error("Fetch tasks failed with status:", res.status);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            alert("حدث خطأ في تحميل المهام من قاعدة البيانات: " + error.message);
        }
    }

    async fetchAdminSubmissions() {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            const res = await fetch(`/api/submissions?v=${Date.now()}`);
            
            if (res.ok) {
                const data = await res.json();
                
                const mappedSubmissions = data.map(s => ({
                    id: s.id,
                    studentName: s.userName,
                    taskId: s.taskId,
                    taskTitle: s.taskTitle,
                    taskTrack: s.taskTrack,
                    taskMaxPoints: s.taskMaxPoints,
                    taskAssignedAdmins: Array.isArray(s.taskAssignedAdmins) ? s.taskAssignedAdmins : [],
                    submissionContent: s.fileUrl,
                    status: s.status,
                    submittedAt: s.submittedAt,
                    earnedPoints: s.grade,
                    adminComment: s.feedback
                }));

                this.setState({ submissions: mappedSubmissions });
            }
        } catch (error) {
            console.error('Failed to fetch admin submissions:', error);
        }
    }
    async fetchStudentSubmissions() {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'student') return;

            const res = await fetch(`/api/submissions?v=${Date.now()}`);
            
            if (res.ok) {
                const data = await res.json();
                this.setState({ submissions: data });
            }
        } catch (error) {
            console.error('Failed to fetch student submissions:', error);
        }
    }

    login(user) { 
        this.setState({ user }); 
        if (user && user.role === 'admin') {
            this.fetchAdminSubmissions();
            this.fetchStudents(); // Fetch real students list for admin dashboard
            this.fetchAdmins();   // List of admin users for assignment UI
        } else if (user && user.role === 'student') {
            this.fetchStudentSubmissions();
            this.fetchAdmins();
        }
        // Refetch tasks so the backend can apply the correct visibility rules
        // based on the newly logged-in user's role and ID.
        this.fetchTasks();
    }

    async fetchAdmins() {
        try {
            const user = this.state.user;
            if (!user) return;
            const res = await fetch(`/api/admins?v=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
                const admins = await res.json();
                this.setState({ admins });
            }
        } catch (error) {
            console.error('Failed to fetch admins:', error);
        }
    }

    async fetchStudents() {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;
            const res = await fetch(`/api/students?v=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
                const adminStudentList = await res.json();
                // Save in separate key — do NOT overwrite 'students' (leaderboard data with totalPoints)
                this.setState({ adminStudentList });
            } else {
                console.error('fetchStudents failed:', res.status);
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
        }
    }
    async logout() { 
        // Destroy server-side session (cookie will be cleared by the server)
        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch(e) { /* ignore */ }
        this.setState({ user: null, editMode: false, tasks: [], submissions: [] }); 
        window.location.hash = '#/login'; 
    }
    toggleTheme() {
        const t = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', t);
        this.setState({ theme: t });
        document.documentElement.setAttribute('data-theme', t);
    }

    // ── CMS & Settings ──────────────────────────────────────────────────────────

    async initialize() {
        // Pause notifications so the 4+ setState calls below commit as a
        // single render, avoiding the UI flashing on every fetch.
        this.setPauseNotifications(true);
        try {
            await this._initializeInner();
        } finally {
            this.setPauseNotifications(false);
        }
    }

    async _initializeInner() {
        // Clear old stale state if necessary (simple migration)
        const version = '3.0';
        if (localStorage.getItem('hilyah_version') !== version) {
            console.log('Migrating state to version', version);
            // We don't clear everything, just ensure new flags are correct
            const saved = localStorage.getItem('hilyah_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.featureVisibility) {
                    parsed.featureVisibility.leaderboard = true;
                }
                localStorage.setItem('hilyah_state', JSON.stringify(parsed));
            }
            localStorage.setItem('hilyah_version', version);
        }

        try {
            const v = Date.now();
            
            // 1. Fetch Settings (Priority)
            try {
                const settingsRes = await fetch(`/api/settings?v=${v}`);
                if (settingsRes.ok) {
                    const settings = await settingsRes.json();
                    const content = { ...this.state.content };
                    const featureVisibility = { ...this.state.featureVisibility };
                    const weeklySlider = { ...this.state.weeklySlider };

                    settings.forEach(s => {
                        if (s.key.startsWith('vis.')) {
                            featureVisibility[s.key.replace('vis.', '')] = s.value === 'true';
                        } else if (s.key.startsWith('slider.')) {
                            const k = s.key.replace('slider.', '');
                            if (k === 'active') weeklySlider.active = (s.value === 'true' || s.value === true);
                            else weeklySlider[k] = s.value;
                        } else {
                            content[s.key] = s.value;
                        }
                    });
                    this.setState({ content, featureVisibility, weeklySlider });
                }
            } catch (e) { console.error('Settings sync failed', e); }

            // 2. Verify session (cookie-based) and update user state
            try {
                const meRes = await fetch(`/api/auth/me?v=${v}`);
                if (meRes.ok) {
                    const verifiedUser = await meRes.json();
                    if (!this.state.user || this.state.user.id !== verifiedUser.id) {
                        this.setState({ user: verifiedUser });
                    }
                } else if (this.state.user) {
                    // Session expired or invalid — clear user
                    console.log('Session invalid, clearing user state');
                    this.setState({ user: null, editMode: false });
                }
            } catch (e) { console.error('Session verify failed', e); }

            // 3. Fetch Tasks (cookie sent automatically by browser)
            try {
                const tasksRes = await fetch(`/api/tasks?v=${v}`);
                if (tasksRes.ok) {
                    const tasks = await tasksRes.json();
                    const mappedTasks = Array.isArray(tasks) ? tasks.map(t => ({
                        id: t.id, title: t.title, description: t.description,
                        track: t.track || "عام", submissionMethod: t.submissionMethod || "كتابة ملخص",
                        maxPoints: t.maxPoints || 0, points: t.maxPoints || 0,
                        assignedAdmins: Array.isArray(t.assignedAdmins) ? t.assignedAdmins : [],
                        isActive: t.isActive !== false,
                        deadline: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : "",
                        displayDeadline: t.dueDate ? new Date(t.dueDate).toLocaleDateString('ar-SA') : "غير محدد",
                        disabled: t.isActive === false,
                        imageUrl: t.imageUrl || null,
                        resourceLink: t.resourceLink || null,
                        visibility: t.visibility || 'all',
                        visibleToIds: Array.isArray(t.visibleToIds) ? t.visibleToIds : [],
                    })) : [];
                    this.setState({ tasks: mappedTasks });
                }
            } catch (e) { console.error('Tasks sync failed', e); }

            // 3. Fetch Leaderboard
            try {
                const leaderboardRes = await fetch(`/api/leaderboard?v=${v}`);
                if (leaderboardRes.ok) {
                    const leaderboard = await leaderboardRes.json();
                    this.setState({ students: leaderboard, lastLeaderboardSync: Date.now() });
                }
            } catch (e) { console.error('Leaderboard sync failed', e); }

            // 4. Fetch Features
            try {
                const featuresRes = await fetch(`/api/features?v=${v}`);
                if (featuresRes.ok) {
                    const features = await featuresRes.json();
                    this.setState({ features });
                }
            } catch (e) { console.error('Features sync failed', e); }

            // 5. Sync logged-in user data (awaited so they fall under the
            // notification pause and don't trigger separate re-renders)
            const user = this.state.user;
            if (user) {
                if (user.role === 'admin') {
                    await this.fetchAdminSubmissions();
                    await this.fetchStudents();
                    await this.fetchAdmins();
                } else if (user.role === 'student') {
                    await this.fetchStudentSubmissions();
                    await this.fetchAdmins();
                }
            }
            
            console.log('✅ تم مزامنة البيانات بنجاح (نظام مرن)');
        } catch (err) {
            console.error('Initialization failed:', err);
        }
    }

    async fetchSettings() {
        try {
            const res = await fetch(`/api/settings?v=${Date.now()}`);
            if (res.ok) {
                const config = await res.json();
                
                // Extract featureVisibility if it exists in the flat object
                const featureVisibility = { ...defaultFeatureVisibility };
                const content = { ...defaultContent };
                const weeklySlider = { ...this.state.weeklySlider };

                Object.entries(config).forEach(([key, value]) => {
                    if (key.startsWith('vis.')) {
                        featureVisibility[key.replace('vis.', '')] = value === 'true';
                    } else if (key.startsWith('slider.')) {
                        const sKey = key.replace('slider.', '');
                        if (sKey === 'active') weeklySlider.active = value === 'true';
                        else weeklySlider[sKey] = value;
                    } else {
                        content[key] = value;
                    }
                });

                this.setState({ content, featureVisibility, weeklySlider });
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    }

    async fetchLeaderboard() {
        try {
            const res = await fetch(`/api/leaderboard?v=${Date.now()}`);
            if (res.ok) {
                const students = await res.json();
                this.setState({ 
                    students, 
                    lastLeaderboardSync: Date.now() 
                });
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        }
    }

    async fetchFeatures() {
        try {
            const res = await fetch('/api/features');
            if (res.ok) {
                const features = await res.json();
                this.setState({ features });
            }
        } catch (error) {
            console.error('Fetch features error:', error);
        }
    }

    async updateContent(key, value) {
        this.setState({ content: { ...this.state.content, [key]: value } });
        await this.syncSettings({ [key]: value });
    }

    async batchUpdateContent(updates) {
        this.setState({ content: { ...this.state.content, ...updates } });
        await this.syncSettings(updates);
    }

    async resetContent(key) {
        const val = defaultContent[key] || key;
        this.setState({ content: { ...this.state.content, [key]: val } });
        await this.syncSettings({ [key]: val });
    }

    async setFeatureVisibility(featureKey, visible) {
        this.setState({ featureVisibility: { ...this.state.featureVisibility, [featureKey]: visible } });
        await this.syncSettings({ [`vis.${featureKey}`]: String(visible) });
    }

    async updateWeeklySlider(updates) {
        const newSlider = { ...this.state.weeklySlider, ...updates };
        this.setState({ weeklySlider: newSlider });
        
        const apiUpdates = {};
        Object.entries(updates).forEach(([k, v]) => {
            apiUpdates[`slider.${k}`] = String(v);
        });
        await this.syncSettings(apiUpdates);
    }

    async syncSettings(updates) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
        } catch (error) {
            console.error('Failed to sync settings:', error);
        }
    }

    // Tasks CRUD
    async addTask(task) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            const payload = {
                title: task.title,
                description: task.description,
                track: task.track,
                submissionMethod: task.submissionMethod,
                maxPoints: task.points,
                assignedAdmins: Array.isArray(task.assignedAdmins) ? task.assignedAdmins : [],
                dueDate: task.deadline ? new Date(task.deadline).toISOString() : new Date().toISOString(),
                ...(task.imageUrl ? { imageUrl: task.imageUrl } : {}),
                ...(task.resourceLink ? { resourceLink: task.resourceLink } : {}),
            };

            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                await this.fetchTasks();
            } else {
                const err = await res.json();
                alert(err.message || 'فشل في إضافة المهمة');
            }
        } catch (error) {
            console.error('Add task error:', error);
        }
    }

    async updateTask(id, updates) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            const payload = {};
            if (updates.title !== undefined) payload.title = updates.title;
            if (updates.description !== undefined) payload.description = updates.description;
            if (updates.track !== undefined) payload.track = updates.track;
            if (updates.submissionMethod !== undefined) payload.submissionMethod = updates.submissionMethod;
            if (updates.assignedAdmins !== undefined) {
                payload.assignedAdmins = Array.isArray(updates.assignedAdmins) ? updates.assignedAdmins : [];
            }
            if (updates.points !== undefined) payload.maxPoints = updates.points;
            if (updates.maxPoints !== undefined) payload.maxPoints = updates.maxPoints;
            
            if (updates.deadline !== undefined) {
                const parsed = new Date(updates.deadline);
                if (!isNaN(parsed)) payload.dueDate = parsed.toISOString();
            }
            if (updates.isActive !== undefined) payload.isActive = Boolean(updates.isActive);
            if (updates.disabled !== undefined) payload.isActive = !updates.disabled;
            if (updates.imageUrl !== undefined) payload.imageUrl = updates.imageUrl;
            if (updates.resourceLink !== undefined) payload.resourceLink = updates.resourceLink;
            if (updates.visibility !== undefined) {
                payload.visibility = updates.visibility === 'restricted' ? 'restricted' : 'all';
            }
            if (updates.visibleToIds !== undefined) {
                payload.visibleToIds = Array.isArray(updates.visibleToIds) ? updates.visibleToIds : [];
            }

            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                await this.fetchTasks();
                return true;
            } else {
                const err = await res.json();
                alert(`خطأ في التحديث: ${err.message}`);
                return false;
            }
        } catch (error) {
            console.error('Update task error:', error);
            alert('حدث خطأ فني أثناء التحديث');
            return false;
        }
    }

    async deleteTask(id) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            const res = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await this.fetchTasks();
                return true;
            } else {
                const err = await res.json();
                alert(`فشل الحذف من قاعدة البيانات: ${err.message}`);
                return false;
            }
        } catch (error) {
            console.error('Delete task error:', error);
            alert('حدث خطأ أثناء محاولة الحذف');
            return false;
        }
    }
    async toggleTaskDisabled(id) {
        try {
            const task = this.state.tasks.find(t => t.id === id);
            if (!task) return;
            const currentActive = task.isActive === false ? false : true;
            await this.updateTask(id, { isActive: !currentActive });
        } catch (error) {
            console.error('Toggle task disabled error:', error);
        }
    }

    // Dynamic Features CRUD
    async addFeature(feature) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            const res = await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: feature.name,
                    description: feature.description,
                    icon: feature.icon,
                    color: feature.color,
                    visible: true
                })
            });

            if (res.ok) {
                await this.fetchFeatures();
            }
        } catch (error) {
            console.error('Add feature error:', error);
        }
    }

    async updateFeature(id, updates) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            const res = await fetch(`/api/features/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                await this.fetchFeatures();
            }
        } catch (error) {
            console.error('Update feature error:', error);
        }
    }

    async deleteFeature(id) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            const res = await fetch(`/api/features/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await this.fetchFeatures();
            }
        } catch (error) {
            console.error('Delete feature error:', error);
        }
    }

    // ── Submission System ──────────────────────────────────────────────────────

    /**
     * Student submits a task with optional content text.
     * Creates a submission record and marks task as 'submitted'.
     */
    submitTask(taskId, submissionContent = '') {
        const user = this.state.user;
        const task = this.state.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newSubmission = {
            id: Date.now(),
            taskId,
            studentId: user.id || 'guest',
            studentName: user.name || 'الطالب',
            taskTitle: task.title,
            taskTrack: task.track,
            taskMaxPoints: task.points,
            submissionContent,
            submittedAt: new Date().toISOString(),
            status: 'pending', // pending | approved | rejected
            earnedPoints: null,
            adminComment: '',
        };

        this.setState({
            submissions: [...this.state.submissions, newSubmission],
            tasks: this.state.tasks.map(t => t.id === taskId ? { ...t, status: 'submitted' } : t),
        });
    }

    async approveSubmission(submissionId, earnedPoints, adminComment = '') {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            const sub = this.state.submissions.find(s => s.id === submissionId);
            if (!sub) return;

            const clampedPoints = Math.max(0, Math.min(sub.taskMaxPoints, earnedPoints));

            const res = await fetch(`/api/submissions/${submissionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'approved',
                    grade: clampedPoints,
                    feedback: adminComment
                })
            });

            if (res.ok) {
                await this.fetchAdminSubmissions();
                await this.fetchLeaderboard();
            } else {
                const err = await res.json();
                alert(err.message || 'فشل تقييم المهمة');
            }
        } catch (error) {
            console.error('Approve submission error:', error);
        }
    }
    async fetchTaskSubmissions(taskId) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return [];
            const res = await fetch(`/api/submissions?taskId=${encodeURIComponent(taskId)}&v=${Date.now()}`, {
                cache: 'no-store',
            });
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error('fetchTaskSubmissions failed:', error);
            return [];
        }
    }

    async markStudentSubmitted(taskId, studentId) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return false;
            const res = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: studentId,
                    taskId,
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'فشل وضع الطالب كمسلّم');
                return false;
            }
            await this.fetchAdminSubmissions();
            return true;
        } catch (error) {
            console.error('markStudentSubmitted failed:', error);
            return false;
        }
    }

    async deleteSubmission(submissionId) {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return false;
            const res = await fetch(`/api/submissions/${submissionId}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'فشل حذف التسليم');
                return false;
            }
            await this.fetchAdminSubmissions();
            await this.fetchLeaderboard();
            return true;
        } catch (error) {
            console.error('deleteSubmission failed:', error);
            return false;
        }
    }

    async rejectSubmission(submissionId, adminComment = '') {
        try {
            const user = this.state.user;
            if (!user || user.role !== 'admin') return;

            const res = await fetch(`/api/submissions/${submissionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'rejected',
                    feedback: adminComment
                })
            });

            if (res.ok) {
                await this.fetchAdminSubmissions();
            } else {
                const err = await res.json();
                alert(err.message || 'فشل رفض التقييم');
            }
        } catch (error) {
            console.error('Reject submission error:', error);
        }
    }

    // Edit Mode
    toggleEditMode() { this.setState({ editMode: !this.state.editMode }); }
}

export const store = new Store();
window._hilyahStore = store;
document.documentElement.setAttribute('data-theme', store.getState().theme);
