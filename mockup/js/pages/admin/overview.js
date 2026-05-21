import * as C from './overviewCharts.js';

export function AdminOverview() {
  return `
  <style>
    #ov-root{max-width:1200px;margin:0 auto}
    .ov-hero-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
    .ov-card{background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px;padding:22px;transition:transform .2s,box-shadow .2s}
    .ov-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.06)}
    .ov-hero-card{padding:16px 14px;text-align:center}
    .ov-hero-icon{font-size:1.4rem;display:block;margin-bottom:4px}
    .ov-counter{font-size:1.5rem;font-weight:800;color:var(--text-primary);margin-bottom:2px}
    .ov-hero-label{font-size:.75rem;color:var(--text-secondary);font-weight:600}
    .ov-title{margin:0 0 4px;font-size:1.05rem;font-weight:700;color:var(--text-primary)}
    .ov-desc{margin:0 0 14px;font-size:.78rem;color:var(--text-tertiary);line-height:1.4}
    .ov-g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;align-items:start}
    .ov-g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;align-items:start}
    .ov-full{margin-bottom:20px}
    .ov-donut-wrap{display:flex;align-items:center;gap:20px;flex-wrap:wrap}
    .ov-donut{width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .ov-donut-center{width:72px;height:72px;border-radius:50%;background:var(--bg-surface);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800}
    .ov-donut-legend{display:flex;flex-direction:column;gap:6px;font-size:.8rem;font-weight:600}
    .ov-donut-legend i{display:inline-block;width:11px;height:11px;border-radius:3px;margin-left:5px;vertical-align:middle}
    .ov-legend-row{display:flex;gap:12px;margin-top:10px;font-size:.75rem;color:var(--text-tertiary);flex-wrap:wrap}
    .ov-bars-list{display:flex;flex-direction:column;gap:8px}
    .ov-bar-row{display:flex;align-items:center;gap:8px}
    .ov-bar-label{font-size:.78rem;font-weight:600;color:var(--text-secondary);flex-shrink:0;width:50px;text-align:left}
    .ov-bar-track{flex:1;background:var(--bg-surface-hover);border-radius:5px;height:18px;overflow:hidden}
    .ov-bar-sm{height:7px}
    .ov-bar-fill{height:100%;border-radius:5px;width:0;transition:width 1s cubic-bezier(.23,1,.32,1)}
    .ov-bar-gold{background:linear-gradient(90deg,#E8C26D,#FFA726)}
    .ov-bar-num{font-size:.75rem;font-weight:700;color:var(--text-secondary);min-width:30px;text-align:center;flex-shrink:0}
    .ov-bar-row-head{display:flex;justify-content:space-between;margin-bottom:4px}
    .ov-bar-row-head b{font-size:.85rem} .ov-bar-row-head small{font-size:.72rem;color:var(--text-tertiary)}
    .ov-task-bar-item{margin-bottom:1px}
    .ov-task-bar-head{display:flex;justify-content:space-between;margin-bottom:2px}
    .ov-task-bar-name{font-size:.78rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70%}
    .ov-scroll-area{max-height:340px;overflow-y:auto;padding-left:4px}
    .ov-student-list{display:flex;flex-direction:column;gap:4px}
    .ov-student-row{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border-color);border-radius:10px;transition:transform .15s}
    .ov-student-row:hover{transform:translateX(-3px)}
    .ov-top3{background:rgba(232,194,109,.04);border-color:rgba(232,194,109,.18)}
    .ov-rank{width:26px;text-align:center;font-size:.9rem}
    .ov-avatar{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.75rem;flex-shrink:0}
    .ov-student-info{flex:1;min-width:0;line-height:1.2} .ov-student-info b{font-size:.85rem;display:block} .ov-student-info small{font-size:.7rem;color:var(--text-tertiary)}
    .ov-points{font-weight:800;color:var(--color-primary-light);font-size:.95rem;white-space:nowrap}
    .ov-facts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
    .ov-fact-card{padding:14px 16px;display:flex;align-items:center;gap:10px;border-right:3px solid var(--color-primary)}
    .ov-fact-icon{font-size:1.4rem;flex-shrink:0}
    .ov-fact-card span:last-child{font-size:.82rem;font-weight:500;line-height:1.4}
    .ov-track-table{overflow-x:auto} .ov-track-table table{width:100%;border-collapse:collapse;text-align:center;font-size:.82rem}
    .ov-track-table th{padding:8px 10px;font-weight:600;color:var(--text-secondary);border-bottom:1px solid var(--border-color)}
    .ov-track-table td{padding:8px 10px;border-bottom:1px solid var(--border-color)}
    .ov-track-badge{padding:2px 8px;border-radius:10px;font-size:.72rem;font-weight:700;white-space:nowrap}
    .ov-dropout-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-color)}
    .ov-dropout-row small{font-size:.72rem;color:var(--text-tertiary)}
    .ov-summary-card{padding:24px}
    .ov-summary-head{display:flex;align-items:center;gap:14px;margin-bottom:14px}
    .ov-grade-circle{width:56px;height:56px;border-radius:50%;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:900;flex-shrink:0}
    .ov-summary-text{font-size:.92rem;line-height:1.8;color:var(--text-secondary);margin:0 0 4px}
    .ov-recs{display:flex;flex-direction:column;gap:6px}
    .ov-rec{padding:8px 12px;border-radius:8px;font-size:.82rem;font-weight:500;line-height:1.5;border-right:3px solid}
    .ov-rec-positive{background:rgba(92,196,129,.06);border-color:#5CC481}
    .ov-rec-warning{background:rgba(255,167,38,.06);border-color:#FFA726}
    .ov-heat-month-grid{display:flex;gap:6px}
    .ov-heat-days-col{display:flex;flex-direction:column;gap:3px}
    .ov-heat-days-col span{height:38px;display:flex;align-items:center;font-size:.65rem;color:var(--text-tertiary);font-weight:600}
    .ov-heat-weeks{display:flex;gap:3px;flex:1;justify-content:center;flex-wrap:wrap}
    .ov-heat-week{display:flex;flex-direction:column;gap:3px}
    .ov-hm-cell2{width:38px;height:38px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:crosshair;transition:transform .12s;position:relative}
    .ov-hm-cell2:hover{transform:scale(1.15);box-shadow:0 3px 10px rgba(0,0,0,.12);z-index:2}
    .ov-hm-day{font-size:.65rem;font-weight:700;color:var(--text-secondary);pointer-events:none}
    .ov-hm-empty2{background:transparent !important;cursor:default}
    .ov-hm-empty2:hover{transform:none;box-shadow:none}
    .ov-heatmap-legend{display:flex;gap:3px;align-items:center;margin-top:12px;font-size:.68rem;color:var(--text-tertiary)}
    .ov-heatmap-legend div{width:14px;height:14px;border-radius:3px}
    .ov-nav-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px}
    .ov-nav-arrows{display:flex;align-items:center;gap:6px}
    .ov-nav-btn{width:30px;height:30px;border-radius:6px;border:1px solid var(--border-color);background:var(--bg-surface-hover);cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;transition:background .15s;color:var(--text-primary)}
    .ov-nav-btn:hover{background:var(--color-primary);color:white}
    .ov-nav-label{font-size:.85rem;font-weight:700;color:var(--text-primary);min-width:120px;text-align:center}
    .ov-toggle-group{display:flex;border:1px solid var(--border-color);border-radius:6px;overflow:hidden}
    .ov-toggle{padding:5px 14px;border:none;background:var(--bg-surface-hover);cursor:pointer;font-size:.78rem;font-weight:600;color:var(--text-secondary);transition:all .15s;font-family:inherit}
    .ov-toggle.active{background:var(--color-primary);color:white}
    .ov-nav-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .ov-subs-nav-chart{display:flex;align-items:flex-end;gap:4px;padding-top:6px}
    .ov-subs-nav-chart.ov-month-mode{gap:1px}
    .ov-snav-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:0}
    .ov-snav-count{font-size:.65rem;font-weight:700;color:var(--text-secondary)}
    .ov-snav-bar-wrap{height:120px;width:100%;display:flex;align-items:flex-end}
    .ov-snav-bar{width:100%;border-radius:3px 3px 0 0;min-height:2px;transition:height .5s cubic-bezier(.23,1,.32,1)}
    .ov-snav-label{font-size:.65rem;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
    .ov-snav-sub{font-size:.55rem;color:var(--text-tertiary)}
    .ov-month-mode .ov-snav-count{font-size:.5rem}
    .ov-month-mode .ov-snav-label{font-size:.5rem}
    .ov-grade-chart{display:flex;align-items:flex-end;gap:6px}
    .ov-grade-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px}
    .ov-grade-count{font-size:.65rem;font-weight:700;color:var(--text-secondary)}
    .ov-grade-bar-wrap{height:70px;width:100%;display:flex;align-items:flex-end}
    .ov-grade-bar{width:100%;border-radius:3px 3px 0 0;height:0;transition:height .8s cubic-bezier(.23,1,.32,1);min-height:2px}
    .ov-grade-label{font-size:.55rem;color:var(--text-tertiary);white-space:nowrap}
    .ov-stacked-bar{display:flex;height:22px;border-radius:6px;overflow:hidden;margin-bottom:10px}
    @media(max-width:900px){
      .ov-g2,.ov-g3{grid-template-columns:1fr}
      .ov-facts-grid{grid-template-columns:1fr}
      .ov-nav-header{flex-direction:column;align-items:flex-start}
    }
    @media(max-width:600px){
      #ov-root{padding:0 4px; overflow-x:hidden; width:100%; box-sizing:border-box}
      #ov-root * { box-sizing:border-box }
      
      /* Swipeable Horizontal Lists */
      .ov-swipeable{
        display:flex; flex-wrap:nowrap; overflow-x:auto; scroll-snap-type:x mandatory;
        gap:10px; margin:0 -4px 16px; padding:0 4px 10px; -webkit-overflow-scrolling:touch;
        scrollbar-width:none;
      }
      .ov-swipeable::-webkit-scrollbar{display:none}
      
      .ov-hero-grid{
        display:flex; flex-wrap:nowrap; overflow-x:auto; scroll-snap-type:x mandatory;
        gap:10px; margin:0 -4px 16px; padding:0 4px 10px; -webkit-overflow-scrolling:touch;
        scrollbar-width:none;
      }
      .ov-hero-grid::-webkit-scrollbar{display:none}
      .ov-hero-card{
        flex:0 0 140px; scroll-snap-align:start; padding:16px 12px;
      }
      .ov-hero-icon{font-size:1.3rem; margin-bottom:4px}
      .ov-counter{font-size:1.35rem; margin-bottom:2px}
      .ov-hero-label{font-size:.75rem}

      .ov-facts-grid{
        display:flex; flex-wrap:nowrap; overflow-x:auto; scroll-snap-type:x mandatory;
        gap:10px; margin:0 -4px 16px; padding:0 4px 10px; -webkit-overflow-scrolling:touch;
        scrollbar-width:none;
      }
      .ov-facts-grid::-webkit-scrollbar{display:none}
      .ov-fact-card{
        flex:0 0 260px; scroll-snap-align:start; padding:14px 16px; border-right-width:3px; gap:10px;
      }
      .ov-fact-icon{font-size:1.3rem}
      .ov-fact-card span:last-child{font-size:.8rem; line-height:1.4}

      /* FIX for cards expanding off-screen: min-width 0 and max-width 100% force it to stay in screen and wrap text */
      .ov-card{padding:16px 14px; border-radius:12px; border:1px solid rgba(0,0,0,0.06); box-shadow:0 2px 10px rgba(0,0,0,0.02); min-width:0; max-width:100%}
      .ov-title{font-size:.95rem; margin-bottom:4px; white-space:normal}
      .ov-desc{font-size:.72rem; margin-bottom:14px; line-height:1.4; white-space:normal; word-wrap:break-word}
      
      .ov-section{margin-bottom:14px !important; min-width:0; max-width:100%}
      .ov-g2,.ov-g3{gap:14px; margin-bottom:14px; min-width:0; max-width:100%}
      .ov-full{margin-bottom:14px; min-width:0; max-width:100%}
      
      .ov-donut-wrap{flex-direction:row; align-items:center; justify-content:space-evenly; gap:10px}
      .ov-donut{width:100px; height:100px}
      .ov-donut-center{width:60px; height:60px; font-size:1rem}
      .ov-donut-legend{font-size:.75rem; gap:6px}
      .ov-legend-row{font-size:.7rem; justify-content:center}
      
      .ov-hm-cell2{width:32px; height:32px}
      .ov-hm-day{font-size:.55rem}
      .ov-heat-days-col span{height:32px; font-size:.55rem}
      
      .ov-nav-header{gap:10px; margin-bottom:12px; width:100%}
      .ov-nav-btn{width:30px; height:30px; font-size:.8rem}
      .ov-nav-label{font-size:.8rem; min-width:auto; flex:1; text-align:center}
      .ov-toggle{padding:5px 12px; font-size:.75rem}
      .ov-nav-controls{width:100%; justify-content:space-between}
      
      .ov-snav-bar-wrap{height:90px}
      
      /* Make Monthly chart NOT scrollable, compress bars natively */
      .ov-subs-nav-chart.ov-month-mode {
        overflow-x:visible; padding-bottom:0; justify-content:space-between; width:100%; gap:1px;
      }
      .ov-subs-nav-chart.ov-month-mode .ov-snav-col {
        flex: 1; min-width: 0;
      }
      .ov-month-mode .ov-snav-count, .ov-month-mode .ov-snav-label { font-size:.45rem; }
      
      .ov-grade-bar-wrap{height:60px}
      .ov-grade-chart{gap:1px; justify-content:space-between}
      .ov-grade-label{font-size:.45rem; white-space:nowrap; transform:scale(0.9)}
      
      .ov-bar-track{height:14px}
      .ov-bar-label{font-size:.7rem; width:45px}
      .ov-bar-num{font-size:.7rem}
      
      .ov-bar-row-head{flex-wrap:nowrap; align-items:center; gap:4px}
      .ov-bar-row-head b{font-size:.65rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1}
      .ov-bar-row-head small{font-size:.58rem; white-space:nowrap; flex-shrink:0}
      
      /* Allow task names to wrap natively, no ellipsis */
      .ov-task-bar-name{font-size:.65rem; white-space:normal; overflow:visible; text-overflow:clip; max-width:100%; line-height:1.3}
      
      .ov-student-row{padding:8px 10px; border-radius:8px}
      .ov-rank{font-size:.8rem}
      .ov-points{font-size:.85rem}
      
      .ov-dropout-row{padding:6px 0; flex-wrap:nowrap; align-items:center; gap:4px}
      .ov-dropout-row b{font-size:.65rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1}
      .ov-dropout-row small{font-size:.58rem; white-space:nowrap; flex-shrink:0}
      
      /* Remove vertical inner scrolling entirely on mobile, let the page scroll naturally */
      .ov-scroll-area{max-height:none !important; overflow-y:visible !important; padding-right:0 !important}
      
      /* Make track table NOT scrollable, natively fit */
      .ov-track-table{overflow-x:hidden; width:100%; padding-bottom:0}
      .ov-track-table table{font-size:.6rem; min-width:0; width:100%}
      .ov-track-table th, .ov-track-table td{padding:4px 2px; text-align:center; white-space:nowrap}
      .ov-track-table th:first-child, .ov-track-table td:first-child{text-align:right; width:40%; white-space:normal}
      .ov-track-badge{font-size:.55rem; padding:2px 4px; white-space:normal; display:inline-block; line-height:1.2; word-wrap:break-word}
      
      .ov-summary-card{padding:16px}
      .ov-summary-head{flex-direction:column; align-items:flex-start; gap:12px}
      .ov-grade-circle{width:48px; height:48px; font-size:1.15rem}
      .ov-summary-text{font-size:.82rem}
      .ov-rec{font-size:.75rem; padding:8px 10px}
    }
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    .ov-section{animation:fadeIn .5s ease both}
    .ov-section:nth-child(2){animation-delay:.05s}
    .ov-section:nth-child(3){animation-delay:.1s}
    .ov-section:nth-child(4){animation-delay:.15s}
    .ov-section:nth-child(5){animation-delay:.2s}
  </style>
  <div id="ov-root">
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px">
      <div style="width:48px;height:48px;border-radius:var(--radius-md);background:rgba(92,196,129,.12);color:var(--color-primary);display:flex;align-items:center;justify-content:center;border:1px solid rgba(92,196,129,.25);font-size:1.3rem">📊</div>
      <div><h1 style="margin:0;font-size:1.8rem">نظرة عامة</h1>
      <p style="margin:2px 0 0;color:var(--text-secondary);font-size:.9rem">تحليلات شاملة لأداء البرنامج</p></div>
    </div>
    <div id="ov-loading" style="text-align:center;padding:60px;color:var(--text-secondary)">
      <div style="font-size:1.8rem;margin-bottom:12px;animation:pulse 1.5s infinite">⏳</div><p>جاري تحميل التحليلات...</p>
    </div>
    <div id="ov-content" style="display:none"></div>
  </div>`;
}

AdminOverview.attachEvents = async () => {
  const loading = document.getElementById('ov-loading');
  const content = document.getElementById('ov-content');
  if (!content) return;
  try {
    const res = await fetch('/api/analytics/overview');
    if (!res.ok) throw new Error(res.status);
    const d = await res.json();
    content.innerHTML = `
      <div class="ov-section">${C.heroCards(d.hero)}</div>
      <div class="ov-section">${C.funFacts(d.funFacts, d.mostImproved, d.mostConsistent)}</div>
      <div class="ov-section">${C.heatmap(d.submissionsByDate, d.hero.programStart, d.hero.programEnd)}</div>
      <div class="ov-section ov-g2">
        ${C.donutChart(d.statusDistribution)}
        ${C.submissionsNavigator(d.submissionsByDate)}
      </div>
      <div class="ov-section ov-g2">
        ${C.dayChart(d.submissionsByDayOfWeek)}
        ${C.gradingDist(d.gradingDistribution)}
      </div>
      <div class="ov-section ov-g2">
        ${C.taskBars(d.taskStats)}
        ${C.tiers(d.completionTiers, d.hero.totalStudents)}
      </div>
      <div class="ov-section ov-full">${C.trackComparison(d.trackStats)}</div>
      <div class="ov-section ov-g2">
        ${C.topStudents(d.studentStats)}
        ${C.adminBars(d.adminStats)}
      </div>
      <div class="ov-section ov-full">${C.dropoutList(d.dropouts || [])}</div>
      <div class="ov-section ov-full">${C.summaryCard(d.programSummary, d.recommendations)}</div>
    `;
    loading.style.display = 'none';
    content.style.display = 'block';
    content.querySelectorAll('.ov-counter').forEach(el => C.animateCounter(el, parseFloat(el.dataset.target)));
    C.animateBars(content);
    C.attachHeatmap();
    C.attachSubsNavigator();

    // Extreme Auto-scroll animation hint for swipeable elements
    setTimeout(() => {
      const swipeables = content.querySelectorAll('.ov-hero-grid, .ov-facts-grid');
      swipeables.forEach(el => {
        el.scrollBy({ left: -250, behavior: 'smooth' }); // Aggressive scroll to ensure it's noticed
        setTimeout(() => {
          el.scrollBy({ left: 250, behavior: 'smooth' });
        }, 1500); // Hold it there for 1.5s
      });
    }, 800);

  } catch (err) {
    console.error('Overview error:', err);
    loading.innerHTML = '<div style="font-size:1.8rem;margin-bottom:12px">⚠️</div><p>تعذر تحميل التحليلات</p>';
  }
};
