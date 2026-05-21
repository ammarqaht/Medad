/* Overview Charts v2 */

export function animateCounter(el, target, dur = 1400) {
  const start = performance.now();
  const isInt = Number.isInteger(target);
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const v = (1 - Math.pow(1 - p, 3)) * target;
    el.textContent = (isInt ? Math.round(v).toLocaleString('ar-SA') : v.toFixed(1)) + (el.dataset.suffix || '');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function animateBars(container) {
  setTimeout(() => {
    container.querySelectorAll('[data-bw]').forEach(b => { b.style.width = b.dataset.bw + '%'; });
    container.querySelectorAll('[data-bh]').forEach(b => { b.style.height = b.dataset.bh + '%'; });
    container.querySelectorAll('[data-gradeh]').forEach(b => { b.style.height = b.dataset.gradeh + 'px'; });
  }, 300);
}

const TC = { 'الثقافي': '#E8C26D', 'الاجتماعي': '#5CC481', 'اجتماعي': '#5CC481', 'مسار تقني': '#51ADAD', 'الذاكرة الحديدية': '#9B72CF', 'منوع': '#999', 'مسار إعلامي': '#42A5F5' };
export const trackColor = (t) => TC[t] || '#51ADAD';

export function heroCards(h) {
  const items = [
    ['👥', 'إجمالي الطلاب', h.totalStudents, '#5CC481', ''],
    ['📋', 'المهام', h.totalTasks, '#51ADAD', ''],
    ['📦', 'التسليمات', h.totalSubmissions, '#E8C26D', ''],
    ['✅', 'نسبة القبول', h.approvalRate, '#5CC481', '%'],
    ['⭐', 'متوسط النقاط/طالب', h.avgPointsPerStudent, '#FFA726', ''],
    ['🏆', 'النقاط الموزعة', h.totalPointsDistributed, '#E8C26D', ''],
    ['📅', 'مدة البرنامج', h.programDurationDays, '#9B72CF', ' يوم'],
    ['📊', 'نسبة المشاركة', h.participationRate, '#51ADAD', '%'],
  ];
  return `<div class="ov-hero-grid">${items.map(([icon, label, val, color, suf]) =>
    `<div class="ov-card ov-hero-card" style="border-top:3px solid ${color}">
      <span class="ov-hero-icon">${icon}</span>
      <div class="ov-counter" data-target="${val}" data-suffix="${suf}">0</div>
      <div class="ov-hero-label">${label}</div>
    </div>`).join('')}</div>`;
}

export function donutChart(d) {
  const total = d.approved + d.rejected + d.pending; if (!total) return '';
  const ap = +(d.approved / total * 100).toFixed(1), rp = +(d.rejected / total * 100).toFixed(1);
  return `<div class="ov-card"><h3 class="ov-title">توزيع حالات التسليم</h3>
    <p class="ov-desc">نسبة التسليمات المقبولة والمرفوضة والمعلقة من إجمالي التسليمات</p>
    <div class="ov-donut-wrap">
      <div class="ov-donut" style="background:conic-gradient(#5CC481 0% ${ap}%,#EF4444 ${ap}% ${ap+rp}%,#FFA726 ${ap+rp}% 100%)">
        <div class="ov-donut-center">${total}</div>
      </div>
      <div class="ov-donut-legend">
        <span><i style="background:#5CC481"></i>مقبول: ${d.approved} (${ap}%)</span>
        <span><i style="background:#EF4444"></i>مرفوض: ${d.rejected} (${rp}%)</span>
        ${d.pending ? `<span><i style="background:#FFA726"></i>معلق: ${d.pending}</span>` : ''}
      </div>
    </div>
  </div>`;
}

/* Weekly/Monthly submissions navigator */
export function submissionsNavigator(byDate) {
  // Store full data on window for navigation
  window._ovSubsByDate = byDate;
  return `<div class="ov-card" id="ov-subs-nav-card">
    <div class="ov-nav-header">
      <h3 class="ov-title" style="margin:0">التسليمات حسب الفترة</h3>
      <div class="ov-nav-controls">
        <div class="ov-toggle-group">
          <button class="ov-toggle active" data-mode="week" onclick="window._ovSetMode('week')">أسبوعي</button>
          <button class="ov-toggle" data-mode="month" onclick="window._ovSetMode('month')">شهري</button>
        </div>
        <div class="ov-nav-arrows">
          <button class="ov-nav-btn" onclick="window._ovNavPrev()">→</button>
          <span id="ov-nav-label" class="ov-nav-label"></span>
          <button class="ov-nav-btn" onclick="window._ovNavNext()">←</button>
        </div>
      </div>
    </div>
    <div id="ov-subs-nav-body"></div>
  </div>`;
}

export function attachSubsNavigator() {
  const data = window._ovSubsByDate; if (!data || !data.length) return;
  const dateMap = {};
  data.forEach(d => { dateMap[d.date] = d.count; });
  let mode = 'week';
  let offset = 0;

  const dayNames = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  function render() {
    const body = document.getElementById('ov-subs-nav-body');
    const label = document.getElementById('ov-nav-label');
    if (!body) return;

    let days = [];
    const now = new Date();
    if (mode === 'week') {
      const ref = new Date(now); ref.setDate(ref.getDate() - ref.getDay() + (offset * 7));
      for (let i = 0; i < 7; i++) {
        const d = new Date(ref); d.setDate(ref.getDate() + i);
        const key = d.toISOString().split('T')[0];
        days.push({ label: dayNames[d.getDay()], sub: d.getDate() + '', count: dateMap[key] || 0 });
      }
      const endD = new Date(ref); endD.setDate(ref.getDate() + 6);
      label.textContent = `${ref.getDate()} ${monthNames[ref.getMonth()]} — ${endD.getDate()} ${monthNames[endD.getMonth()]}`;
    } else {
      const ref = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const daysInMonth = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(ref.getFullYear(), ref.getMonth(), i);
        const key = d.toISOString().split('T')[0];
        days.push({ label: i + '', sub: dayNames[d.getDay()], count: dateMap[key] || 0 });
      }
      label.textContent = `${monthNames[ref.getMonth()]} ${ref.getFullYear()}`;
    }

    const max = Math.max(...days.map(d => d.count), 1);
    body.innerHTML = `<div class="ov-subs-nav-chart ${mode === 'month' ? 'ov-month-mode' : ''}">
      ${days.map(d => {
        const h = max > 0 ? Math.max(d.count / max * 120, d.count > 0 ? 3 : 0) : 0;
        return `<div class="ov-snav-col">
          <div class="ov-snav-count">${d.count > 0 ? d.count : ''}</div>
          <div class="ov-snav-bar-wrap"><div class="ov-snav-bar" style="height:${h}px;background:linear-gradient(to top,#51ADAD,#5CC481)"></div></div>
          <div class="ov-snav-label">${d.label}</div>
          ${mode === 'week' && d.sub ? `<div class="ov-snav-sub">${d.sub}</div>` : ''}
        </div>`;
      }).join('')}
    </div>`;
  }

  window._ovSetMode = (m) => {
    mode = m; offset = 0;
    document.querySelectorAll('.ov-toggle').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    render();
  };
  window._ovNavPrev = () => { offset--; render(); };
  window._ovNavNext = () => { offset++; render(); };
  render();
}

export function dayChart(days) {
  const max = Math.max(...days.map(d => d.count), 1);
  return `<div class="ov-card"><h3 class="ov-title">التسليمات حسب اليوم</h3>
    <p class="ov-desc">عدد التسليمات موزعة على أيام الأسبوع لمعرفة أكثر الأيام نشاطاً</p>
    <div class="ov-bars-list">${days.map(d =>
      `<div class="ov-bar-row"><span class="ov-bar-label">${d.day}</span>
        <div class="ov-bar-track"><div class="ov-bar-fill" data-bw="${d.count/max*100}" style="background:linear-gradient(90deg,#51ADAD,#5CC481)"></div></div>
        <span class="ov-bar-num">${d.count}</span>
      </div>`).join('')}</div></div>`;
}

export function heatmap(data, startISO, endISO) {
  if (!data.length) return '';
  window._ovHeatData = data;
  window._ovHeatStart = startISO;
  window._ovHeatEnd = endISO;
  return `<div class="ov-card" id="ov-heatmap-card">
    <div class="ov-nav-header">
      <h3 class="ov-title" style="margin:0">خريطة النشاط اليومي</h3>
      <div class="ov-nav-arrows">
        <button class="ov-nav-btn" onclick="window._ovHeatPrev()">→</button>
        <span id="ov-heat-label" class="ov-nav-label"></span>
        <button class="ov-nav-btn" onclick="window._ovHeatNext()">←</button>
      </div>
    </div>
    <div id="ov-heatmap-body"></div>
    <div class="ov-heatmap-legend"><span>أقل</span>
      <div style="background:var(--bg-surface-hover)"></div>
      <div style="background:rgba(92,196,129,0.2)"></div>
      <div style="background:rgba(92,196,129,0.4)"></div>
      <div style="background:rgba(92,196,129,0.65)"></div>
      <div style="background:rgba(92,196,129,0.9)"></div>
      <span>أكثر</span>
    </div>
  </div>`;
}

export function attachHeatmap() {
  const data = window._ovHeatData; if (!data || !data.length) return;
  const dateMap = Object.fromEntries(data.map(d => [d.date, d.count]));
  const globalMax = Math.max(...data.map(d => d.count), 1);
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const dayLabels = ['أحد','إثن','ثلا','أرب','خمي','جمع','سبت'];
  const colors = ['var(--bg-surface-hover)','rgba(92,196,129,0.2)','rgba(92,196,129,0.4)','rgba(92,196,129,0.65)','rgba(92,196,129,0.9)'];

  // Open-ended navigation — start at current month
  let viewYear = new Date().getFullYear();
  let viewMonth = new Date().getMonth();

  function render() {
    const body = document.getElementById('ov-heatmap-body');
    const label = document.getElementById('ov-heat-label');
    if (!body) return;

    const m = { year: viewYear, month: viewMonth };
    label.textContent = `${monthNames[m.month]} ${m.year}`;

    const firstDay = new Date(m.year, m.month, 1);
    const daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
    const startDow = firstDay.getDay(); // 0=Sun

    // Build weeks grid
    const cells = [];
    // Pad start
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${m.year}-${String(m.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      cells.push({ day: d, count: dateMap[key] || 0 });
    }
    // Pad end
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    body.innerHTML = `<div class="ov-heat-month-grid">
      <div class="ov-heat-days-col">${dayLabels.map(l => `<span>${l}</span>`).join('')}</div>
      <div class="ov-heat-weeks">
        ${weeks.map(week => `<div class="ov-heat-week">${week.map(cell => {
          if (!cell) return '<div class="ov-hm-cell2 ov-hm-empty2"></div>';
          const lvl = cell.count === 0 ? 0 : Math.min(Math.ceil(cell.count / globalMax * 4), 4);
          return `<div class="ov-hm-cell2" style="background:${colors[lvl]}" title="${cell.day}: ${cell.count} تسليم">
            <span class="ov-hm-day">${cell.day}</span>
          </div>`;
        }).join('')}</div>`).join('')}
      </div>
    </div>`;
  }

  window._ovHeatPrev = () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); };
  window._ovHeatNext = () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); };
  render();
}

export function taskBars(tasks) {
  return `<div class="ov-card"><h3 class="ov-title">نسبة إتمام المهام</h3>
    <p class="ov-desc">نسبة الطلاب الذين سلّموا كل مهمة من إجمالي عدد الطلاب</p>
    <div class="ov-bars-list ov-scroll-area">${tasks.slice(0,20).map(t =>
      `<div class="ov-task-bar-item"><div class="ov-task-bar-head">
        <span class="ov-task-bar-name" title="${t.title}">${t.title}</span>
        <span class="ov-bar-num" style="color:${trackColor(t.track)}">${t.completionRate}%</span>
      </div><div class="ov-bar-track ov-bar-sm"><div class="ov-bar-fill" data-bw="${t.completionRate}" style="background:${trackColor(t.track)}"></div></div></div>`
    ).join('')}</div></div>`;
}

export function topStudents(list) {
  const medals = ['🥇','🥈','🥉'];
  return `<div class="ov-card"><h3 class="ov-title">أفضل 10 طلاب</h3>
    <p class="ov-desc">الطلاب الحاصلون على أعلى مجموع نقاط من المهام المقبولة</p>
    <div class="ov-student-list">${list.slice(0,10).map((s,i) =>
      `<div class="ov-student-row ${i<3?'ov-top3':''}">
        <span class="ov-rank">${i<3?medals[i]:'#'+(i+1)}</span>
        <div class="ov-avatar" style="background:linear-gradient(135deg,${i<3?'#E8C26D,#FFA726':'var(--color-primary-light),var(--color-primary)'})">${s.name.charAt(0)}</div>
        <div class="ov-student-info"><b>${s.name}</b><small>${s.tasksCompleted} مهمة · ${s.avgGradePercent}% معدل</small></div>
        <span class="ov-points">${s.totalPoints} 🌟</span>
      </div>`).join('')}</div></div>`;
}

export function adminBars(admins) {
  const max = Math.max(...admins.map(a => a.reviewCount), 1);
  return `<div class="ov-card"><h3 class="ov-title">أداء المشرفين</h3>
    <p class="ov-desc">عدد التسليمات التي راجعها كل مشرف ومتوسط الدرجات التي منحها</p>
    <div class="ov-bars-list">${admins.map(a =>
      `<div><div class="ov-bar-row-head"><b>${a.name}</b><small>${a.reviewCount} مراجعة · قبول ${a.approvalRate}% · متوسط ${a.avgGradeGiven}</small></div>
      <div class="ov-bar-track"><div class="ov-bar-fill ov-bar-gold" data-bw="${a.reviewCount/max*100}"></div></div></div>`
    ).join('')}</div></div>`;
}

export function funFacts(f, mostImproved, mostConsistent) {
  const facts = [
    ['🏅', `أكثر طالب تسليماً: <b>${f.mostActiveStudent.name}</b> (${f.mostActiveStudent.count})`],
    ['📅', `أكثر يوم نشاطاً: <b>${f.busiestDay.date}</b> (${f.busiestDay.count} تسليم)`],
    ['🌙', `<b>${f.nightSubmissionPercent}%</b> من التسليمات تمت ليلاً`],
    ['⚡', `المشرف الأنشط: <b>${f.mostActiveAdmin.name}</b> (${f.mostActiveAdmin.reviewCount} مراجعة)`],
  ];
  if (mostImproved) facts.push(['📈', `الأكثر تطوراً: <b>${mostImproved.name}</b> (+${mostImproved.improvement}%)`]);
  if (mostConsistent) facts.push(['🎯', `الأكثر التزاماً: <b>${mostConsistent.name}</b> (${mostConsistent.completionPercent}%)`]);
  return `<div class="ov-facts-grid">${facts.map(([icon, text]) =>
    `<div class="ov-card ov-fact-card"><span class="ov-fact-icon">${icon}</span><span>${text}</span></div>`
  ).join('')}</div>`;
}

export function tiers(t, total) {
  const items = [
    ['الكل', t.all, '#5CC481'], ['75%+', t.high, '#51ADAD'], ['50-74%', t.mid, '#E8C26D'],
    ['25-49%', t.low, '#FFA726'], ['<25%', t.minimal, '#EF4444'], ['0%', t.zero, '#6B7280'],
  ];
  // Build conic gradient
  let segments = [], pctAcc = 0;
  items.forEach(([, count, color]) => {
    const pct = total > 0 ? (count / total * 100) : 0;
    segments.push(`${color} ${pctAcc}% ${pctAcc + pct}%`);
    pctAcc += pct;
  });
  return `<div class="ov-card"><h3 class="ov-title">توزيع مستوى المشاركة</h3>
    <p class="ov-desc">تصنيف الطلاب حسب نسبة المهام التي أكملوها من إجمالي المهام</p>
    <div class="ov-donut-wrap" style="justify-content:center">
      <div class="ov-donut" style="background:conic-gradient(${segments.join(',')})">
        <div class="ov-donut-center">${total}</div>
      </div>
      <div class="ov-donut-legend">
        ${items.map(([label, count, color]) =>
          `<span><i style="background:${color}"></i>${label}: ${count} (${total > 0 ? (count/total*100).toFixed(0) : 0}%)</span>`
        ).join('')}
      </div>
    </div>
  </div>`;
}

// Removed: deadlineChart

export function gradingDist(bins) {
  const max = Math.max(...bins.map(b => b.count), 1);
  return `<div class="ov-card"><h3 class="ov-title">توزيع الدرجات</h3>
    <p class="ov-desc">عدد التسليمات في كل شريحة درجات — يوضح توزيع مستوى الأداء العام</p>
    <div class="ov-grade-chart">${bins.map(b => {
      const h = max > 0 ? Math.max(b.count / max * 70, b.count > 0 ? 3 : 0) : 0;
      return `<div class="ov-grade-col">
        <span class="ov-grade-count">${b.count}</span>
        <div class="ov-grade-bar-wrap"><div class="ov-grade-bar" data-gradeH="${h}" style="height:0;background:linear-gradient(to top,#E8C26D,#FFA726)"></div></div>
        <span class="ov-grade-label">${b.bin}</span>
      </div>`;
    }).join('')}</div></div>`;
}

export function trackComparison(tracks) {
  if (!tracks.length) return '';
  return `<div class="ov-card"><h3 class="ov-title">مقارنة المسارات</h3>
    <p class="ov-desc">مقارنة أداء كل مسار من حيث عدد المهام والتسليمات ونسب المشاركة والقبول</p>
    <div class="ov-track-table"><table><thead><tr><th>المسار</th><th>المهام</th><th>التسليم</th><th>القبول</th><th>الدرجة</th></tr></thead>
    <tbody>${tracks.map(t =>
      `<tr><td><span class="ov-track-badge" style="background:${trackColor(t.track)}22;color:${trackColor(t.track)};border:1px solid ${trackColor(t.track)}44">${t.track}</span></td>
      <td>${t.taskCount}</td><td>${t.submissionCount}</td><td>${t.approvalRate}%</td><td>${t.totalPoints}</td></tr>`
    ).join('')}</tbody></table></div></div>`;
}

export function dropoutList(dropouts) {
  if (!dropouts.length) return '';
  return `<div class="ov-card"><h3 class="ov-title">⚠️ طلاب انقطعوا عن التسليم (${dropouts.length})</h3>
    <p class="ov-desc">طلاب سلّموا في بداية البرنامج لكنهم توقفوا قبل نهايته</p>
    <div class="ov-scroll-area">${dropouts.map(d =>
      `<div class="ov-dropout-row"><b>${d.name}</b><small>آخر تسليم: ${d.lastSub} · ${d.tasksCompleted} مهمة</small></div>`
    ).join('')}</div></div>`;
}

export function summaryCard(summary, recs) {
  const gc = { 'A+':'#5CC481','A':'#5CC481','B':'#51ADAD','C':'#FFA726','D':'#EF4444' };
  const c = gc[summary.scoreGrade] || '#5CC481';
  return `<div class="ov-card ov-summary-card" style="border-top:4px solid ${c}">
    <div class="ov-summary-head">
      <div class="ov-grade-circle" style="border-color:${c};color:${c}">${summary.scoreGrade}</div>
      <div><h3 style="margin:0">ملخص البرنامج</h3><small>تقييم عام: ${summary.scorePercent}%</small></div>
    </div>
    <p class="ov-summary-text">${summary.text}</p>
    ${recs.length ? `<h4 class="ov-title" style="margin-top:20px">توصيات</h4>
    <div class="ov-recs">${recs.map(r =>
      `<div class="ov-rec ov-rec-${r.type}">${r.type==='positive'?'✅':'⚠️'} ${r.text}</div>`
    ).join('')}</div>` : ''}
  </div>`;
}
