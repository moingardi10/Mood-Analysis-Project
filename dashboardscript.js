/**
 * dashboardscript.js — MoodLens Dashboard (Full)
 * Fixes: stat cards, date filter, refresh buttons, radar chart,
 *        PDF (no blank pages), history page, reports page
 */

const API_BASE = 'http://localhost:5000';
const API_KEY  = 'mood_flow_model_key';

// Chart instances — kept so we can destroy & redraw on refresh/filter
const charts = {};
let currentFilter = '30days';
let allTests = [], allWeeks = [], currentUser = null;

// ═══════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════
window.addEventListener('load', async () => {
    const sb = window.sb;
    if (!sb) { window.location.href = 'signpage.html'; return; }
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) { window.location.href = 'signpage.html'; return; }
    currentUser = user;

    // Load all data once
    const [{ data: tests }, { data: weeks }] = await Promise.all([
        sb.from('test_results').select('*').eq('user_id', user.id).order('created_at'),
        sb.from('test_responses').select('*').eq('user_id', user.id).order('week')
    ]);
    allTests = tests || [];
    allWeeks = weeks || [];

    renderAll();
    loadWeekProgress();
    loadInsights();
    await checkAndRenderReport(user.id, user.email);
});

// ═══════════════════════════════════════════════════════════
// DATE FILTER
// ═══════════════════════════════════════════════════════════
function setDateFilter(period) {
    currentFilter = period;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event?.target?.classList.add('active');
    renderAll();
}

function getFilteredTests() {
    const now = new Date();
    const cutoffs = { '7days':7, '30days':30, '90days':90, 'year':365 };
    const days = cutoffs[currentFilter];
    if (!days) return allTests; // 'all'
    const cutoff = new Date(now - days * 864e5);
    return allTests.filter(t => new Date(t.created_at) >= cutoff);
}

// ═══════════════════════════════════════════════════════════
// RENDER ALL
// ═══════════════════════════════════════════════════════════
function renderAll() {
    const filtered = getFilteredTests();
    renderStatCards(filtered);
    renderCharts(filtered);
    renderHistoryTable(filtered);
}

// ═══════════════════════════════════════════════════════════
// STAT CARDS — real data, no fake numbers
// ═══════════════════════════════════════════════════════════
function renderStatCards(tests) {
    const el = id => document.getElementById(id);

    // Average mood
    const avg = tests.length
        ? (tests.reduce((s,t)=>s+parseFloat(t.average_score),0)/tests.length).toFixed(2)
        : '—';
    if (el('avgMood')) { el('avgMood').textContent = avg; el('avgMood').classList.add('loaded'); }

    // Total tests
    if (el('totalTests')) { el('totalTests').textContent = tests.length; el('totalTests').classList.add('loaded'); }

    // Avg stress (from test_responses lifestyle data)
    const stressVals = allWeeks.map(w => w.responses?.Daily_Stress).filter(v=>v!=null);
    const avgStress = stressVals.length
        ? (stressVals.reduce((s,v)=>s+v,0)/stressVals.length).toFixed(1)
        : '—';
    if (el('avgStress')) { el('avgStress').textContent = avgStress; el('avgStress').classList.add('loaded'); }

    // Completion rate (weeks completed / 4)
    const rate = allWeeks.length ? Math.round((allWeeks.length/4)*100)+'%' : '0%';
    if (el('completionRate')) { el('completionRate').textContent = rate; el('completionRate').classList.add('loaded'); }

    // Trend indicators
    setTrend('avgMood',      tests, 'average_score',  true);
    setTrend('totalTests',   tests, null,              true);
}

function setTrend(cardId, tests, field, higherBetter) {
    const card = document.getElementById(cardId)?.closest('.stat-card');
    if (!card) return;
    const ind = card.querySelector('.trend-indicator');
    if (!ind || tests.length < 2 || !field) { if(ind) ind.style.display='none'; return; }
    const half = Math.floor(tests.length/2);
    const first = tests.slice(0,half), last = tests.slice(half);
    const avg = arr => arr.reduce((s,t)=>s+parseFloat(t[field]),0)/arr.length;
    const delta = ((avg(last)-avg(first))/avg(first)*100).toFixed(0);
    const up = delta >= 0;
    ind.textContent = `${up?'↑':'↓'} ${Math.abs(delta)}%`;
    ind.className = `trend-indicator ${(up===higherBetter)?'trend-up':'trend-down'}`;
    ind.style.display = '';
}

// ═══════════════════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════════════════
function destroyChart(id) {
    if (charts[id]) { try { charts[id].destroy(); } catch(e){} delete charts[id]; }
}

function refreshChart(id) {
    destroyChart(id);
    renderCharts(getFilteredTests(), id);
}

async function renderCharts(tests, only=null) {
    const sb = window.sb;
    const grid = '#1e293b', tick = '#64748b';
    const base = { responsive:true, maintainAspectRatio:true,
        plugins:{ legend:{ labels:{ color:'#94a3b8', font:{size:11} } } } };

    // 1. Sentiment / PA-NA trend
    if (!only || only==='sentimentChart') {
        const ctx = document.getElementById('sentimentChart');
        if (ctx && window.Chart) {
            destroyChart('sentimentChart');
            const labels = tests.map(t=>new Date(t.created_at).toLocaleDateString([],{month:'short',day:'numeric'}));
            const scores = tests.map(t=>parseFloat(t.average_score));
            charts['sentimentChart'] = new Chart(ctx, {
                type:'line',
                data:{ labels, datasets:[{
                    label:'Mood Score', data:scores,
                    borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.1)',
                    tension:0.4, fill:true, pointRadius:5, pointBackgroundColor:'#3b82f6'
                }]},
                options:{...base, scales:{
                    x:{ticks:{color:tick},grid:{color:grid}},
                    y:{min:1,max:5,ticks:{color:tick},grid:{color:grid}}
                }}
            });
        }
    }

    // 2. Mood distribution pie
    if (!only || only==='moodPieChart') {
        const ctx = document.getElementById('moodPieChart');
        if (ctx && window.Chart && tests.length) {
            destroyChart('moodPieChart');
            const counts = {};
            tests.forEach(t=>{ const k=t.emotional_state||'Other'; counts[k]=(counts[k]||0)+1; });
            charts['moodPieChart'] = new Chart(ctx, {
                type:'doughnut',
                data:{ labels:Object.keys(counts), datasets:[{
                    data:Object.values(counts),
                    backgroundColor:['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
                }]},
                options:base
            });
        }
    }

    // 3. Historical PA vs NA bar
    if (!only || only==='historicalChart') {
        const ctx = document.getElementById('historicalChart');
        if (ctx && window.Chart && allWeeks.length) {
            destroyChart('historicalChart');
            charts['historicalChart'] = new Chart(ctx, {
                type:'bar',
                data:{
                    labels: allWeeks.map(w=>`Week ${w.week}`),
                    datasets:[
                        { label:'Positive Affect', data:allWeeks.map(w=>+(w.pa_score||0).toFixed(3)),
                          backgroundColor:'rgba(59,130,246,0.7)', borderRadius:6 },
                        { label:'Negative Affect', data:allWeeks.map(w=>+(w.na_score||0).toFixed(3)),
                          backgroundColor:'rgba(239,68,68,0.7)', borderRadius:6 }
                    ]
                },
                options:{...base, scales:{
                    x:{ticks:{color:tick},grid:{color:grid}},
                    y:{min:0,max:1,ticks:{color:tick},grid:{color:grid}}
                }}
            });
        }
    }

    // 4. Radar — category breakdown from latest test (fetch real category_scores)
    if (!only || only==='radarChart') {
        const ctx = document.getElementById('radarChart');
        if (ctx && window.Chart) {
            destroyChart('radarChart');
            if (tests.length) {
                // Get latest test_id
                const latest = tests[tests.length-1];
                const { data: cats } = await window.sb
                    .from('category_scores')
                    .select('category_name, average_score')
                    .eq('test_id', latest.test_id);

                if (cats && cats.length) {
                    charts['radarChart'] = new Chart(ctx, {
                        type:'radar',
                        data:{
                            labels: cats.map(c=>c.category_name),
                            datasets:[{
                                label:'Latest Test',
                                data: cats.map(c=>parseFloat(c.average_score)),
                                borderColor:'#3b82f6',
                                backgroundColor:'rgba(59,130,246,0.15)',
                                pointBackgroundColor:'#3b82f6'
                            }]
                        },
                        options:{...base, scales:{ r:{
                            min:0, max:5,
                            ticks:{color:tick, stepSize:1, backdropColor:'transparent'},
                            grid:{color:grid},
                            pointLabels:{color:'#94a3b8', font:{size:11}}
                        }}}
                    });
                } else {
                    // Show message if no category data
                    ctx.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#64748b;font-size:13px;">
                        No category data yet.<br>Complete a test to see breakdown.</div>`;
                }
            }
        }
    }

    // 5. Activity by day of week
    if (!only || only==='activityChart') {
        const ctx = document.getElementById('activityChart');
        if (ctx && window.Chart && tests.length) {
            destroyChart('activityChart');
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const counts = new Array(7).fill(0);
            tests.forEach(t=>{ counts[new Date(t.created_at).getDay()]++; });
            charts['activityChart'] = new Chart(ctx, {
                type:'bar',
                data:{ labels:days, datasets:[{
                    label:'Tests taken', data:counts,
                    backgroundColor:'rgba(139,92,246,0.7)', borderRadius:6
                }]},
                options:{...base, scales:{
                    x:{ticks:{color:tick},grid:{color:grid}},
                    y:{ticks:{color:tick,stepSize:1},grid:{color:grid}}
                }}
            });
        }
    }
}

// ═══════════════════════════════════════════════════════════
// HISTORY TABLE
// ═══════════════════════════════════════════════════════════
function renderHistoryTable(tests) {
    const tbody = document.getElementById('testHistoryTable');
    if (!tbody) return;
    if (!tests.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:#64748b;">No tests in this period</td></tr>`;
        return;
    }
    const lc = l => l==='Stable'?'#10b981':l==='Unstable'?'#ef4444':'#f59e0b';
    tbody.innerHTML = [...tests].reverse().map(t => {
        const d = new Date(t.created_at);
        return `<tr>
            <td>${d.toLocaleDateString()}</td>
            <td>${d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</td>
            <td>${parseFloat(t.average_score).toFixed(2)}/5</td>
            <td>${t.emotional_state||'—'}</td>
            <td>${t.stress_level||'—'}</td>
            <td>${t.duration_seconds ? Math.round(t.duration_seconds/60)+'m' : '—'}</td>
            <td><span style="color:${lc(t.mood_classification)};font-weight:600;">${t.mood_classification||'—'}</span></td>
        </tr>`;
    }).join('');
}

// ═══════════════════════════════════════════════════════════
// WEEK PROGRESS
// ═══════════════════════════════════════════════════════════
function loadWeekProgress() {
    const container = document.getElementById('weekProgress');
    if (!container) return;
    const colorMap = { Stable:'#10b981', Moderate:'#f59e0b', Unstable:'#ef4444' };
    container.innerHTML = `
        <div style="font-weight:600;color:#e2e8f0;margin-bottom:12px;">4-Week Progress (${allWeeks.length}/4)</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${[1,2,3,4].map(w=>{
                const wd = allWeeks.find(r=>r.week===w);
                const col = wd ? (colorMap[wd.prediction_label]||'#3b82f6') : '#374151';
                return `<div style="flex:1;min-width:80px;background:${wd?'#1e3a5f':'#1a2035'};
                    border:2px solid ${wd?col:'#374151'};border-radius:10px;padding:10px;text-align:center;">
                    <div>${wd?'✅':w===allWeeks.length+1?'🔵':'⚪'}</div>
                    <div style="color:#94a3b8;font-size:11px;margin-top:3px;">Week ${w}</div>
                    ${wd?`<div style="color:${col};font-weight:700;font-size:11px;margin-top:2px;">${wd.prediction_label}</div>`:''}
                </div>`;
            }).join('')}
        </div>
        ${allWeeks.length < 4
            ? `<div style="margin-top:8px;font-size:13px;color:#94a3b8;text-align:center;">
                <a href="take-test.html" style="color:#60a5fa;text-decoration:underline;">Take Week ${allWeeks.length+1} →</a></div>`
            : `<div style="margin-top:8px;font-size:13px;text-align:center;color:#10b981;font-weight:600;">
                🎉 All done! <a href="#moodlensReport" style="color:#60a5fa;text-decoration:underline;">View report ↓</a></div>`}
    `;
}

// ═══════════════════════════════════════════════════════════
// AI INSIGHTS — real, not fake
// ═══════════════════════════════════════════════════════════
function loadInsights() {
    const container = document.querySelector('.insight-card')?.closest('.card');
    if (!container || !allWeeks.length) return;

    const latest = allWeeks[allWeeks.length-1];
    const r = latest?.responses || {};
    const stress = r.Daily_Stress, sleep = r.Sleep_Quality, rum = r.Rumination;
    const pa = latest.pa_score, na = latest.na_score;

    const insights = [];

    if (allWeeks.length >= 2) {
        const trend = allWeeks[allWeeks.length-1].pa_score > allWeeks[0].pa_score ? 'improved' : 'declined';
        insights.push({ icon:'🎯', title:'Mood Trend', text:`Your positive affect has ${trend} from Week 1 to Week ${allWeeks.length}. ${trend==='improved'?'Keep up what is working!':'Consider what changed and try to address it.'}` });
    }
    if (stress >= 4) {
        insights.push({ icon:'⚠️', title:'High Stress Detected', text:`Your latest stress level was ${stress}/5. Try short breathing exercises or a walk to help reset your nervous system.` });
    } else if (stress && stress <= 2) {
        insights.push({ icon:'✅', title:'Low Stress', text:`Your stress level was ${stress}/5 — that's excellent. Low stress creates space for positive emotions to flourish.` });
    }
    if (sleep && sleep <= 2) {
        insights.push({ icon:'😴', title:'Sleep Needs Attention', text:`Sleep quality was ${sleep}/5. Poor sleep is one of the strongest predictors of negative mood — a consistent sleep schedule helps significantly.` });
    }
    if (allTests.length >= 3) {
        insights.push({ icon:'🏆', title:`${allTests.length} Tests Completed!`, text:`You've taken ${allTests.length} mood assessments. Consistency is the foundation of self-awareness — every test makes your report more accurate.` });
    }
    if (!insights.length) {
        insights.push({ icon:'💡', title:'Keep Going', text:'Complete more tests to unlock personalised AI insights about your emotional patterns.' });
    }

    const insightHTML = insights.map(i=>`
        <div class="insight-card">
            <div class="flex items-start gap-3">
                <span class="text-3xl">${i.icon}</span>
                <div><h4 class="font-bold text-lg mb-2">${i.title}</h4>
                <p class="text-gray-300">${i.text}</p></div>
            </div>
        </div>`).join('');

    const title = container.querySelector('h3');
    if (title) title.insertAdjacentHTML('afterend', insightHTML);
    container.querySelectorAll('.insight-card:not(:last-of-type)').forEach((el,i)=>{ if(i>=insights.length) el.remove(); });
    // Replace all old insight cards
    container.querySelectorAll('.insight-card').forEach(el=>el.remove());
    title.insertAdjacentHTML('afterend', insightHTML);
}

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════
function toggleExportMenu() {
    document.getElementById('exportMenu')?.classList.toggle('show');
}

async function exportData(type) {
    document.getElementById('exportMenu')?.classList.remove('show');
    if (type === 'csv') {
        const rows = [['Date','Time','Score','Emotional State','Stress','ML Label']];
        allTests.forEach(t => {
            const d = new Date(t.created_at);
            rows.push([d.toLocaleDateString(), d.toLocaleTimeString(), t.average_score, t.emotional_state, t.stress_level, t.mood_classification]);
        });
        const csv = rows.map(r=>r.join(',')).join('\n');
        download('MoodLens-export.csv', csv, 'text/csv');
    } else if (type === 'json') {
        download('MoodLens-export.json', JSON.stringify({tests:allTests,weeks:allWeeks},null,2), 'application/json');
    } else if (type === 'pdf') {
        downloadClientPDF();
    }
}

function download(filename, content, mime) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content],{type:mime}));
    a.download = filename; a.click();
}

// ═══════════════════════════════════════════════════════════
// PDF — capture charts as images first, then generate
// ═══════════════════════════════════════════════════════════
async function downloadClientPDF() {
    if (typeof html2pdf === 'undefined') {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(s);
        await new Promise(r=>s.onload=r);
    }

    // Capture chart images before building PDF
    const chartImgs = {};
    ['sentimentChart','moodPieChart','historicalChart','radarChart'].forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) chartImgs[id] = canvas.toDataURL('image/png');
    });

    const user = currentUser;
    const avg  = allTests.length ? (allTests.reduce((s,t)=>s+parseFloat(t.average_score),0)/allTests.length).toFixed(2) : '—';

    const pdfContent = document.createElement('div');
    pdfContent.style.cssText = 'font-family:Arial,sans-serif;padding:24px;background:white;color:#111;';
    pdfContent.innerHTML = `
        <div style="text-align:center;border-bottom:3px solid #3b82f6;padding-bottom:16px;margin-bottom:24px;">
            <h1 style="margin:0;color:#1e40af;font-size:24px;">MoodLens — Analytics Report</h1>
            <p style="color:#555;margin:4px 0 0;">${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</p>
        </div>

        <div style="display:flex;gap:12px;margin-bottom:24px;">
            <div style="flex:1;padding:12px;border:1px solid #e5e7eb;border-radius:8px;">
                <div style="font-size:11px;color:#666;">User</div>
                <div style="font-weight:700;margin-top:4px;">${user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</div>
                <div style="font-size:12px;color:#555;">${user?.email||''}</div>
            </div>
            <div style="flex:1;padding:12px;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
                <div style="font-size:11px;color:#666;">Avg Mood</div>
                <div style="font-size:22px;font-weight:700;color:#3b82f6;margin-top:4px;">${avg}/5</div>
            </div>
            <div style="flex:1;padding:12px;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
                <div style="font-size:11px;color:#666;">Total Tests</div>
                <div style="font-size:22px;font-weight:700;color:#3b82f6;margin-top:4px;">${allTests.length}</div>
            </div>
            <div style="flex:1;padding:12px;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
                <div style="font-size:11px;color:#666;">Weeks Done</div>
                <div style="font-size:22px;font-weight:700;color:#3b82f6;margin-top:4px;">${allWeeks.length}/4</div>
            </div>
        </div>

        <h2 style="color:#1e40af;font-size:16px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin-bottom:12px;">Weekly Overview</h2>
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px;">
            <thead><tr style="background:#eff6ff;">
                <th style="padding:8px;text-align:left;border:1px solid #e5e7eb;">Week</th>
                <th style="padding:8px;text-align:center;border:1px solid #e5e7eb;">PA Score</th>
                <th style="padding:8px;text-align:center;border:1px solid #e5e7eb;">NA Score</th>
                <th style="padding:8px;text-align:center;border:1px solid #e5e7eb;">Balance</th>
                <th style="padding:8px;text-align:center;border:1px solid #e5e7eb;">ML Label</th>
            </tr></thead>
            <tbody>${allWeeks.map(w=>`<tr>
                <td style="padding:7px;border:1px solid #e5e7eb;">Week ${w.week}</td>
                <td style="padding:7px;border:1px solid #e5e7eb;text-align:center;">${(w.pa_score||0).toFixed(3)}</td>
                <td style="padding:7px;border:1px solid #e5e7eb;text-align:center;">${(w.na_score||0).toFixed(3)}</td>
                <td style="padding:7px;border:1px solid #e5e7eb;text-align:center;">${((w.pa_score||0)-(w.na_score||0)).toFixed(3)}</td>
                <td style="padding:7px;border:1px solid #e5e7eb;text-align:center;font-weight:700;
                    color:${w.prediction_label==='Stable'?'#059669':w.prediction_label==='Unstable'?'#dc2626':'#d97706'}">
                    ${w.prediction_label||'—'}</td>
            </tr>`).join('')||'<tr><td colspan="5" style="text-align:center;padding:12px;color:#888;">No weekly data</td></tr>'}</tbody>
        </table>

        <h2 style="color:#1e40af;font-size:16px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin-bottom:12px;">Charts</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
            ${Object.entries(chartImgs).map(([id,src])=>`
            <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px;">
                <div style="font-size:11px;color:#666;margin-bottom:6px;">${
                    {sentimentChart:'Mood Score Trend',moodPieChart:'Emotional State Distribution',
                     historicalChart:'PA vs NA by Week',radarChart:'Category Breakdown'}[id]||id}</div>
                <img src="${src}" style="width:100%;max-height:180px;object-fit:contain;" />
            </div>`).join('')}
        </div>

        <h2 style="color:#1e40af;font-size:16px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin-bottom:12px;">Recent Tests</h2>
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px;">
            <thead><tr style="background:#eff6ff;">
                <th style="padding:7px;text-align:left;border:1px solid #e5e7eb;">Date</th>
                <th style="padding:7px;text-align:center;border:1px solid #e5e7eb;">Score</th>
                <th style="padding:7px;text-align:left;border:1px solid #e5e7eb;">Emotional State</th>
                <th style="padding:7px;text-align:left;border:1px solid #e5e7eb;">ML Label</th>
            </tr></thead>
            <tbody>${[...allTests].reverse().slice(0,10).map(t=>{
                const d=new Date(t.created_at);
                return `<tr>
                    <td style="padding:7px;border:1px solid #e5e7eb;">${d.toLocaleDateString()} ${d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</td>
                    <td style="padding:7px;border:1px solid #e5e7eb;text-align:center;">${parseFloat(t.average_score).toFixed(2)}/5</td>
                    <td style="padding:7px;border:1px solid #e5e7eb;">${t.emotional_state||'—'}</td>
                    <td style="padding:7px;border:1px solid #e5e7eb;font-weight:700;">${t.mood_classification||'—'}</td>
                </tr>`;}).join('')||'<tr><td colspan="4" style="text-align:center;padding:12px;color:#888;">No tests yet</td></tr>'}
            </tbody>
        </table>

        <div style="margin-top:16px;padding:12px;background:#eff6ff;border-radius:8px;font-size:11px;color:#555;text-align:center;">
            Generated by MoodLens · For personal wellness awareness only · Not a clinical diagnosis
        </div>
    `;

    html2pdf().set({
        margin:[10,10,10,10],
        filename:`MoodLens-dashboard-${new Date().toISOString().slice(0,10)}.pdf`,
        image:{type:'jpeg',quality:0.95},
        html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},
        jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},
        pagebreak:{mode:['avoid-all','css']}
    }).from(pdfContent).save();
}

// ═══════════════════════════════════════════════════════════
// MOODLENS REPORT (after week 4)
// ═══════════════════════════════════════════════════════════
async function checkAndRenderReport(userId, userEmail) {
    if (allWeeks.length < 4) return;

    let section = document.getElementById('moodlensReport');
    if (!section) {
        section = document.createElement('div');
        section.id = 'moodlensReport';
        section.style.cssText = 'margin:20px 0;';
        document.querySelector('main.main-content')?.appendChild(section);
    }

    section.innerHTML = `
        <style>
            .rpt{background:#131a2b;border:1px solid #1e3a5f;border-radius:12px;padding:20px;margin-bottom:16px;}
            .rpt h3{color:#3b82f6;font-size:15px;font-weight:700;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #1e3a5f;}
            .rpt-tbl{width:100%;border-collapse:collapse;font-size:13px;}
            .rpt-tbl th{background:#1e3a5f;color:#e2e8f0;padding:8px 10px;text-align:left;}
            .rpt-tbl td{padding:7px 10px;color:#94a3b8;border-bottom:1px solid #1a2035;}
            .rpt-tbl tr:nth-child(even) td{background:#0f1623;}
            .rpt-note{background:#0d2137;border-left:3px solid #3b82f6;padding:10px 14px;border-radius:6px;color:#7dd3fc;font-style:italic;font-size:13px;margin-top:10px;}
            .met{display:inline-block;background:#1e3a5f;border-radius:10px;padding:14px 20px;text-align:center;margin:6px;}
            .met-v{font-size:22px;font-weight:700;color:#60a5fa;}
            .met-l{font-size:11px;color:#94a3b8;margin-top:4px;}
            .pat{border-left:3px solid #3b82f6;padding:10px 14px;background:#0f1623;border-radius:6px;margin-bottom:8px;color:#cbd5e1;font-size:13px;line-height:1.6;}
        </style>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px;">
            <h2 style="color:#e2e8f0;font-size:20px;font-weight:700;margin:0;">📊 MoodLens 4-Week Report</h2>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button onclick="downloadClientPDF()" style="background:#3b82f6;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:600;">📄 Download PDF</button>
                <button onclick="downloadFlaskPDF('${userId}')" style="background:#10b981;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:600;">🤖 ML Report (Flask)</button>
            </div>
        </div>
        <div id="reportBody">⏳ Building report...</div>
    `;
    renderReport(allWeeks, userId);
}

function renderReport(weekData, userId) {
    const el = document.getElementById('reportBody');
    if (!el) return;
    const sc = v => v!=null?(v-1)/4:0;
    const avg = arr=>{ const v=arr.filter(x=>x!=null); return v.length?v.reduce((s,x)=>s+x,0)/v.length:0; };
    const PA_COLS=['Q1_Interested','Q3_Excited','Q5_Strong','Q9_Enthusiastic','Q10_Proud','Q12_Alert','Q14_Inspired','Q16_Determined','Q17_Attentive','Q19_Active'];
    const NA_COLS=['Q2_Distressed','Q4_Upset','Q7_Scared','Q8_Hostile','Q11_Irritable','Q15_Nervous','Q18_Jittery','Q20_Afraid'];
    const NA_DISP=['Q2_Distressed','Q4_Upset','Q6_Guilty','Q7_Scared','Q8_Hostile','Q11_Irritable','Q13_Ashamed','Q15_Nervous','Q18_Jittery','Q20_Afraid'];
    const MODEL_F=['Q1_Interested','Q2_Distressed','Q4_Upset','Q7_Scared','Q9_Enthusiastic','Q11_Irritable','Q15_Nervous','Q18_Jittery','Focus_Ability'];

    const weeks = weekData.map(w=>{ const r=w.responses||{}; const pa=avg(PA_COLS.map(c=>sc(r[c]))); const na=avg(NA_COLS.map(c=>sc(r[c]))); return {week:w.week,pa:+pa.toFixed(4),na:+na.toFixed(4),bal:+(pa-na).toFixed(4),label:w.prediction_label||'Pending',shap:w.shap_values||{},r}; });
    const paS=weeks.map(w=>w.pa),naS=weeks.map(w=>w.na),bals=weeks.map(w=>w.bal);
    const avgPA=+avg(paS).toFixed(4),avgNA=+avg(naS).toFixed(4),avgBal=+(avgPA-avgNA).toFixed(4);
    const balDelta=bals[3]-bals[0], trend=balDelta>0.10?'Improving':balDelta<-0.10?'Declining':'Stable';
    const labels=weeks.map(w=>w.label);
    const balTxt=avgBal>0.05?'Positive balance — overall positive mood state.':avgBal<-0.05?'Negative balance — emotional strain detected.':'Balanced — stable emotional state.';
    const vi=+stdDev(bals).toFixed(4), stCount=labels.filter(l=>l==='Stable').length;
    const stabTxt=vi<0.30?'Low variability — mood remained stable.':vi<0.60?'Moderate variability — some fluctuation observed.':'High variability — significant mood fluctuation detected.';

    const dimAvg=(cols,rArr)=>{ const out={}; cols.forEach(c=>{ out[c.replace(/^Q\d+_/,'')]=+avg(rArr.map(r=>sc(r[c]))).toFixed(3); }); return out; };
    const paDims=dimAvg(PA_COLS,weeks.map(w=>w.r)), naDims=dimAvg(NA_DISP,weeks.map(w=>w.r));
    const COG={'Emotional Clarity':'Q21_Emotional_Clarity','Somatic Awareness':'Somatic_Awareness','Rumination':'Rumination','Psychological Safety':'Psychological_Safety','Social Connection':'Social_Connection'};
    const LF={'Sleep Quality':'Sleep_Quality','Stress Level':'Daily_Stress','Focus Ability':'Focus_Ability','Physical Fatigue':'Physical_Fatigue'};
    const cogAvg={},lfAvg={};
    Object.entries(COG).forEach(([k,c])=>{ const v=avg(weeks.map(w=>w.r[c]!=null?sc(w.r[c]):null).filter(x=>x!=null)); if(!isNaN(v)&&v>0) cogAvg[k]=+v.toFixed(3); });
    Object.entries(LF).forEach(([k,c])=>{ const v=avg(weeks.map(w=>w.r[c]!=null?sc(w.r[c]):null).filter(x=>x!=null)); if(!isNaN(v)&&v>0) lfAvg[k]=+v.toFixed(3); });
    const PM={Joy:['Q9_Enthusiastic','Q3_Excited'],Trust:['Q1_Interested','Q17_Attentive'],Fear:['Q7_Scared','Q15_Nervous'],Surprise:['Q18_Jittery'],Sadness:['Q2_Distressed','Q4_Upset'],Disgust:['Q8_Hostile','Q13_Ashamed'],Anger:['Q11_Irritable','Q8_Hostile'],Anticipation:['Q16_Determined','Q14_Inspired']};
    const plutchik={};
    Object.entries(PM).forEach(([em,cols])=>{ plutchik[em]=+avg(weeks.map(w=>avg(cols.map(c=>sc(w.r[c]))))).toFixed(3); });
    const shapAvg={};
    MODEL_F.forEach(f=>{ shapAvg[f]=+avg(weeks.map(w=>Math.abs(w.shap[f]||0))).toFixed(6); });
    const top3=Object.entries(shapAvg).sort((a,b)=>b[1]-a[1]).slice(0,3);
    const paDelta=paS[3]-paS[0], top2PA=Object.entries(paDims).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);
    const top2NA=Object.entries(naDims).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);
    const paInterp=(paDelta>0.05?'Positive affect increased gradually.':paDelta<-0.05?'Positive affect showed a decreasing trend.':'Positive affect remained consistent.')+` Highest: ${top2PA.join(', ')}.`;
    const naInterp=((naS[3]-naS[0])<-0.05?'Negative affect eased across the period.':'Negative affect was consistent or rising.')+` Dominant: ${top2NA.join(', ')}.`;
    const traj=labels[0]!==labels[3]?`progressed from ${labels[0]} in Week 1 to ${labels[3]} by Week 4`:labels.every(l=>l===labels[0])?`remained consistently ${labels[0]} across all four weeks`:`fluctuated (${labels.join(' → ')})`;
    const topLF=Object.entries(lfAvg).sort((a,b)=>b[1]-a[1])[0]?.[0]||'—';
    const assess=trend==='Improving'?'genuine improvement':trend==='Declining'?'deterioration':'a stable state';
    const summary=`Over the four-week period, mood ${traj}. ${paDelta>0.05?'Positive affect increased':'Positive affect held steady'} while ${(naS[3]-naS[0])<-0.05?'negative affect declined':'negative affect remained present'}. The primary ML driver was ${top3[0][0].replace(/Q\d+_/,'').replace(/_/g,' ')}. ${topLF} was the strongest lifestyle factor. Overall: ${assess}.`;
    const patterns=buildPatterns(weeks,lfAvg,cogAvg,paS,naS,bals,labels);

    el.innerHTML = `
        <div class="rpt"><h3>1. User Information</h3>
        <table class="rpt-tbl"><tr><td>Report Period</td><td>Week 1 → Week 4</td></tr><tr><td>Total Entries</td><td>4</td></tr><tr><td>Model</td><td>XGBoost (Primary) + Random Forest (Parallel)</td></tr><tr><td>Questionnaire</td><td>Unified Mood Scale (30 items)</td></tr></table></div>

        <div class="rpt"><h3>2. Overall Mood Summary</h3>
        <div style="text-align:center;margin-bottom:12px;">
            <div class="met"><div class="met-v">${avgPA.toFixed(3)}</div><div class="met-l">Avg PA</div></div>
            <div class="met"><div class="met-v">${avgNA.toFixed(3)}</div><div class="met-l">Avg NA</div></div>
            <div class="met"><div class="met-v" style="color:${avgBal>=0?'#10b981':'#ef4444'}">${avgBal>0?'+':''}${avgBal.toFixed(3)}</div><div class="met-l">Balance</div></div>
            <div class="met"><div class="met-v" style="color:${trend==='Improving'?'#10b981':trend==='Declining'?'#ef4444':'#f59e0b'}">${trend}</div><div class="met-l">Trend</div></div>
        </div><div class="rpt-note">${balTxt} | Trend: ${trend}</div></div>

        <div class="rpt"><h3>3. Weekly Mood Trend</h3>
        <table class="rpt-tbl"><thead><tr><th>Week</th><th>PA</th><th>NA</th><th>Balance</th><th>Label</th></tr></thead>
        <tbody>${weeks.map(w=>`<tr><td>Week ${w.week}</td><td>${w.pa.toFixed(3)}</td><td>${w.na.toFixed(3)}</td>
            <td style="color:${w.bal>=0?'#10b981':'#ef4444'}">${w.bal>0?'+':''}${w.bal.toFixed(3)}</td>
            <td style="color:${w.label==='Stable'?'#10b981':w.label==='Unstable'?'#ef4444':'#f59e0b'};font-weight:700">${w.label}</td></tr>`).join('')}</tbody></table>
        <canvas id="rptPANA" width="600" height="200" style="margin-top:16px;"></canvas>
        <canvas id="rptStab" width="600" height="130" style="margin-top:12px;"></canvas></div>

        <div class="rpt"><h3>4. Emotional Dimensions</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div><div style="color:#60a5fa;font-weight:600;margin-bottom:8px;">Positive Affect</div>
            <table class="rpt-tbl"><thead><tr><th>Item</th><th>Score</th></tr></thead><tbody>${Object.entries(paDims).map(([k,v])=>`<tr><td>${k}</td><td>${v.toFixed(3)}</td></tr>`).join('')}</tbody></table></div>
            <div><div style="color:#f87171;font-weight:600;margin-bottom:8px;">Negative Affect</div>
            <table class="rpt-tbl"><thead><tr><th>Item</th><th>Score</th></tr></thead><tbody>${Object.entries(naDims).map(([k,v])=>`<tr><td>${k}</td><td>${v.toFixed(3)}</td></tr>`).join('')}</tbody></table></div>
        </div>
        <div class="rpt-note">${paInterp}</div><div class="rpt-note">${naInterp}</div></div>

        <div class="rpt"><h3>5. Cognitive Indicators</h3>
        <table class="rpt-tbl"><thead><tr><th>Indicator</th><th>Score</th><th>Level</th></tr></thead>
        <tbody>${Object.entries(cogAvg).map(([k,v])=>`<tr><td>${k}</td><td>${v.toFixed(3)}</td><td style="color:${v>0.6?'#10b981':v<0.4?'#ef4444':'#f59e0b'}">${v>0.6?'High':v<0.4?'Low':'Moderate'}</td></tr>`).join('')}</tbody></table></div>

        <div class="rpt"><h3>6. Lifestyle Factors</h3>
        <table class="rpt-tbl"><thead><tr><th>Factor</th><th>Score</th><th>Level</th></tr></thead>
        <tbody>${Object.entries(lfAvg).map(([k,v])=>`<tr><td>${k}</td><td>${v.toFixed(3)}</td><td style="color:${k==='Stress Level'?(v>0.6?'#ef4444':v<0.4?'#10b981':'#f59e0b'):(v>0.6?'#10b981':v<0.4?'#ef4444':'#f59e0b')}">${v>0.6?'High':v<0.4?'Low':'Moderate'}</td></tr>`).join('')}</tbody></table>
        <div class="rpt-note">${lfAvg['Stress Level']>lfAvg['Sleep Quality']?'Stress was the strongest lifestyle predictor.':'Sleep quality was the dominant lifestyle factor.'}</div></div>

        <div class="rpt"><h3>7. Emotional Profile (Plutchik Wheel)</h3>
        <canvas id="rptPlutchik" width="340" height="340" style="display:block;margin:0 auto;"></canvas>
        <div class="rpt-note">Dominant: ${Object.entries(plutchik).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]).join(' & ')}. Lowest: ${Object.entries(plutchik).sort((a,b)=>a[1]-b[1]).slice(0,2).map(x=>x[0]).join(' & ')}.</div></div>

        <div class="rpt"><h3>8. Stability Analysis</h3>
        <table class="rpt-tbl">
            <tr><td>Variability Index</td><td>${vi.toFixed(3)} (${vi<0.30?'Low':vi<0.60?'Moderate':'High'})</td></tr>
            <tr><td>Stability Score</td><td>${(stCount/4).toFixed(2)} (${stCount}/4 stable weeks)</td></tr>
            <tr><td>Label Distribution</td><td>${['Stable','Moderate','Unstable'].filter(l=>labels.includes(l)).map(l=>`${l} × ${labels.filter(x=>x===l).length}`).join(' | ')}</td></tr>
        </table><div class="rpt-note">${stabTxt}${labels[0]==='Unstable'&&labels[3]==='Stable'?' Positive trajectory — mood stabilised over the period.':''}</div></div>

        <div class="rpt"><h3>9. SHAP Feature Importance</h3>
        ${Object.entries(shapAvg).sort((a,b)=>b[1]-a[1]).map(([f,v])=>`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="width:130px;font-size:12px;color:#94a3b8;text-align:right;">${f.replace(/Q\d+_/,'')}</div>
            <div style="flex:1;background:#1a2035;border-radius:4px;height:12px;">
                <div style="width:${Math.min(v/0.12*100,100)}%;height:100%;border-radius:4px;background:${v>0.05?'#ef4444':'#3b82f6'};"></div>
            </div>
            <div style="width:55px;font-size:12px;color:#94a3b8;">${v.toFixed(4)}</div>
        </div>`).join('')}
        <div class="rpt-note">${top3[0][0].replace(/Q\d+_/,'')}, ${top3[1][0].replace(/Q\d+_/,'')}, and ${top3[2][0].replace(/Q\d+_/,'')} were the strongest predictors.</div></div>

        <div class="rpt"><h3>10. Observed Patterns</h3>
        ${patterns.map(p=>`<div class="pat">• ${p}</div>`).join('')}</div>

        <div class="rpt"><h3>11. Final Summary</h3>
        <p style="color:#cbd5e1;line-height:1.8;font-size:14px;">${summary}</p>
        <div style="margin-top:12px;padding:10px;background:#0d2137;border-radius:8px;color:#7dd3fc;font-size:12px;font-style:italic;">
            For personal wellness awareness only. Not a clinical diagnosis. Consult a professional for medical advice.</div></div>
    `;

    setTimeout(()=>{ drawPANA(weeks); drawStab(weeks); drawPlutchik(plutchik); }, 100);
}

function buildPatterns(weeks,lf,cog,paS,naS,bals,labels) {
    const p=[], pct=v=>Math.round(v*100);
    const stress=lf['Stress Level'], sleep=lf['Sleep Quality'], rum=cog['Rumination'], sc=cog['Social Connection'];
    const hiStress=weeks.filter(w=>(w.r['Daily_Stress']||0)>3).map(w=>'W'+w.week);
    p.push(hiStress.length>=2?`Higher stress in ${hiStress.join(', ')} corresponded with elevated negative affect.`:stress!=null?`Stress averaged ${pct(stress)}% across four weeks.`:'Stress data not available.');
    const goodSleep=weeks.filter(w=>(w.r['Sleep_Quality']||0)>=3).map(w=>'W'+w.week);
    p.push(goodSleep.length>=2?`Better sleep in ${goodSleep.join(', ')} was associated with higher positive affect.`:sleep!=null&&sleep<0.4?`Sleep averaged only ${pct(sleep)}% — improving sleep would boost mood.`:'Sleep quality was moderate.');
    const ecW1=weeks[0].r['Q21_Emotional_Clarity'],ecW4=weeks[3].r['Q21_Emotional_Clarity'];
    p.push(ecW1!=null&&ecW4!=null?ecW4>ecW1?`Emotional clarity improved from Week 1 (${ecW1}) to Week 4 (${ecW4}).`:ecW4<ecW1?`Emotional clarity declined (${ecW1} → ${ecW4}).`:`Emotional clarity was consistent at ${ecW1}/5.`:'Emotional clarity data not available.');
    p.push(sc!=null?sc>0.65?`Social connection was high (${pct(sc)}%) — a strong protective factor.`:sc<0.4?`Social connection was low (${pct(sc)}%) — this amplifies negative mood.`:`Social connection averaged ${pct(sc)}%.`:'Social connection not available.');
    const rW1=weeks[0].r['Rumination'],rW4=weeks[3].r['Rumination'];
    p.push(rW1!=null&&rW4!=null?rW4<rW1?`Rumination decreased from ${rW1} to ${rW4} by Week 4 — fewer negative thought loops.`:rW4>rW1?`Rumination increased (${rW1} → ${rW4}).`:`Rumination was stable at ${rW1}/5.`:rum!=null?`Rumination averaged ${pct(rum)}%.`:'Rumination data not available.');
    return p;
}

function stdDev(arr) { const n=arr.length; if(!n) return 0; const m=arr.reduce((s,v)=>s+v,0)/n; return Math.sqrt(arr.reduce((s,v)=>s+(v-m)**2,0)/n); }

// Canvas charts for report
function drawPANA(weeks) {
    const canvas=document.getElementById('rptPANA'); if(!canvas) return;
    const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height,pad={t:20,r:20,b:40,l:50};
    const gW=W-pad.l-pad.r,gH=H-pad.t-pad.b;
    ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
    const yS=v=>pad.t+gH*(1-v), xS=i=>pad.l+i*(gW/3);
    [0,0.25,0.5,0.75,1].forEach(v=>{ ctx.strokeStyle='#1e3a5f';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad.l,yS(v));ctx.lineTo(W-pad.r,yS(v));ctx.stroke();ctx.fillStyle='#475569';ctx.font='11px sans-serif';ctx.fillText(v.toFixed(2),2,yS(v)+4); });
    weeks.forEach((w,i)=>{ ctx.fillStyle='#64748b';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(`W${w.week}`,xS(i),H-8); });
    function line(data,color,dash=[]){ ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.setLineDash(dash);data.forEach((v,i)=>i===0?ctx.moveTo(xS(i),yS(v)):ctx.lineTo(xS(i),yS(v)));ctx.stroke();ctx.setLineDash([]);data.forEach((v,i)=>{ ctx.beginPath();ctx.arc(xS(i),yS(v),5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill(); }); }
    line(weeks.map(w=>w.pa),'#3b82f6'); line(weeks.map(w=>w.na),'#ef4444'); line(weeks.map(w=>w.bal),'#10b981',[5,3]);
    ctx.font='12px sans-serif';ctx.textAlign='left';
    [['#3b82f6','PA'],[60,'#ef4444','NA'],[120,'#10b981','Balance']].forEach((x,i)=>{ const [col,lbl]=typeof x[0]==='number'?[x[1],x[2]]:[x[0],x[1]]; const ox=pad.l+(i*70); ctx.fillStyle=col;ctx.fillRect(ox,H-30,14,10);ctx.fillStyle='#94a3b8';ctx.fillText(lbl,ox+18,H-22); });
}
function drawStab(weeks) {
    const canvas=document.getElementById('rptStab'); if(!canvas) return;
    const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
    ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
    const cm={Stable:'#10b981',Moderate:'#f59e0b',Unstable:'#ef4444',Pending:'#6b7280'};
    const vm={Stable:1,Moderate:0.67,Unstable:0.33,Pending:0.5};
    const bw=80,gap=(W-weeks.length*bw)/(weeks.length+1);
    weeks.forEach((w,i)=>{ const x=gap+i*(bw+gap),col=cm[w.label]||'#6b7280',h=(vm[w.label]||0.5)*(H-40),y=H-25-h; ctx.fillStyle=col;ctx.fillRect(x,y,bw,h);ctx.fillStyle='#e2e8f0';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText(w.label,x+bw/2,y-6);ctx.fillStyle='#94a3b8';ctx.font='12px sans-serif';ctx.fillText(`Week ${w.week}`,x+bw/2,H-8); });
}
function drawPlutchik(scores) {
    const canvas=document.getElementById('rptPlutchik'); if(!canvas) return;
    const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
    ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
    const ems=Object.keys(scores),cx=W/2,cy=H/2,maxR=Math.min(W,H)/2-40,N=ems.length;
    const colors=['#fbbf24','#84cc16','#34d399','#38bdf8','#818cf8','#c084fc','#f87171','#fb923c'];
    [0.25,0.5,0.75,1].forEach(r=>{ ctx.beginPath();ctx.strokeStyle='#1e3a5f';ctx.lineWidth=1;ems.forEach((_,i)=>{ const a=(i/N)*Math.PI*2-Math.PI/2,x=cx+Math.cos(a)*maxR*r,y=cy+Math.sin(a)*maxR*r;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });ctx.closePath();ctx.stroke(); });
    ctx.beginPath();ems.forEach((em,i)=>{ const a=(i/N)*Math.PI*2-Math.PI/2,r=scores[em]*maxR*0.9+10;i===0?ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r):ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); });ctx.closePath();ctx.fillStyle='rgba(59,130,246,0.2)';ctx.fill();ctx.strokeStyle='#3b82f6';ctx.lineWidth=2;ctx.stroke();
    ems.forEach((em,i)=>{ const a=(i/N)*Math.PI*2-Math.PI/2,r=scores[em]*maxR*0.9+10;ctx.beginPath();ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,5,0,Math.PI*2);ctx.fillStyle=colors[i];ctx.fill();ctx.fillStyle='#e2e8f0';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText(em,cx+Math.cos(a)*(maxR+24),cy+Math.sin(a)*(maxR+24)); });
}

async function downloadFlaskPDF(userId) {
    const btn = event?.target; if(btn){btn.textContent='⏳ Generating...';btn.disabled=true;}
    try {
        const { data:{user} } = await window.sb.auth.getUser();
        const payload = { weeks: allWeeks.map(w=>({ userId:user.email, date:w.submitted_at, answers:w.responses })) };
        const resp = await fetch(`${API_BASE}/predict_report_weekly`,{ method:'POST', headers:{'Content-Type':'application/json','x-api-key':API_KEY}, body:JSON.stringify(payload) });
        if(!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob=await resp.blob(),a=document.createElement('a');
        a.href=URL.createObjectURL(blob); a.download=`moodlens-ml-${new Date().toISOString().slice(0,10)}.pdf`; a.click(); URL.revokeObjectURL(a.href);
    } catch(e) { alert('Flask error: '+e.message+'\n\nMake sure Flask is running on localhost:5000'); }
    finally { if(btn){btn.textContent='🤖 ML Report (Flask)';btn.disabled=false;} }
}

function handleLogout() { if(!confirm('Log out?')) return; window.sb?.auth.signOut(); window.location.href='signpage.html'; }
function toggleSidebar() { document.getElementById('sidebar')?.classList.toggle('mobile-open'); }
function toggleProfileMenu() { window.location.href='profile-page.html'; }
