/**
 * userhomepagescript.js — MoodFlow Home
 * No fake data. All stats hidden until Supabase responds.
 */

const quotes = [
    { text:"Your present circumstances don't determine where you can go; they merely determine where you start.", author:"Nido Qubein" },
    { text:"The only way to do great work is to love what you do.", author:"Steve Jobs" },
    { text:"Believe you can and you're halfway there.", author:"Theodore Roosevelt" },
    { text:"It does not matter how slowly you go as long as you do not stop.", author:"Confucius" },
    { text:"Everything you've ever wanted is on the other side of fear.", author:"George Addair" },
    { text:"Success is not final, failure is not fatal: it is the courage to continue that counts.", author:"Winston Churchill" },
    { text:"Hardships often prepare ordinary people for an extraordinary destiny.", author:"C.S. Lewis" },
    { text:"The future belongs to those who believe in the beauty of their dreams.", author:"Eleanor Roosevelt" }
];

let currentQuoteIndex = 0;
let countdownInterval  = null;

// ═══════════════════════════════════════════════════════════
// BOOT — auth first, then load everything
// ═══════════════════════════════════════════════════════════
window.addEventListener('load', async () => {
    const sb = window.sb;
    if (!sb) { window.location.href = 'signpage.html'; return; }

    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) { window.location.href = 'signpage.html'; return; }

    // Set user info immediately (no DB call needed)
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const el = id => document.getElementById(id);
    if (el('welcomeUser'))  el('welcomeUser').textContent  = `Welcome, ${name} 👋`;
    if (el('userName'))     el('userName').textContent     = name;
    if (el('userAvatar'))   el('userAvatar').textContent   = name.slice(0,2).toUpperCase();

    // Load everything in parallel
    await Promise.all([
        loadStats(user.id),
        loadWeekProgress(user.id),
        loadRecentTests(user.id),
        loadWeeklySummary(user.id),
        loadCalendar(user.id)
    ]);
});

// ═══════════════════════════════════════════════════════════
// STATS — reveal numbers only after real data arrives
// ═══════════════════════════════════════════════════════════
async function loadStats(userId) {
    const sb = window.sb;
    try {
        const [{ data: weeks }, { data: streak }, { data: tests }, { count: total }] = await Promise.all([
            sb.from('test_responses').select('week').eq('user_id', userId),
            sb.from('user_streaks').select('current_streak_days').eq('user_id', userId).single(),
            sb.from('test_results').select('average_score').eq('user_id', userId),
            sb.from('test_results').select('*', { count:'only', head:true }).eq('user_id', userId)
        ]);

        const weeksCount  = weeks?.length || 0;
        const streakDays  = streak?.current_streak_days || 0;
        const avgMood     = tests?.length
            ? (tests.reduce((s,t)=>s+parseFloat(t.average_score),0)/tests.length).toFixed(1) : '0.0';
        const totalTests  = total || 0;

        setStatCard('statWeeks',      weeksCount,          `${weeksCount}/4 weeks`,     (weeksCount/4)*100);
        setStatCard('statStreak',     streakDays,          'days in a row 🔥',          Math.min(streakDays/30*100,100));
        setStatCard('statMood',       avgMood,             'out of 5.0',                parseFloat(avgMood)/5*100);
        setStatCard('statTotal',      totalTests,          'since joining',             Math.min(totalTests/20*100,100));

        // Timer — based on real last submission
        const { data: lastWeek } = await sb.from('test_responses')
            .select('submitted_at, week').eq('user_id', userId)
            .order('week', { ascending: false }).limit(1).single();

        setupTimer(lastWeek, weeksCount);

    } catch(e) { console.error('[Stats]', e); }
}

function setStatCard(numId, value, label, barPct) {
    const num = document.getElementById(numId);
    const lbl = document.getElementById(numId + 'Label');
    const bar = document.getElementById(numId + 'Bar');
    if (num) { num.textContent = value; num.classList.add('loaded'); }
    if (lbl) lbl.textContent = label;
    if (bar) bar.style.width = Math.min(Math.max(barPct,0),100) + '%';
}

// ═══════════════════════════════════════════════════════════
// COUNTDOWN TIMER — real logic based on last test date
// ═══════════════════════════════════════════════════════════
function setupTimer(lastWeek, weeksCompleted) {
    const title  = document.getElementById('nextTestTitle');
    const action = document.getElementById('nextTestAction');

    if (weeksCompleted >= 4) {
        // All done — show report link instead
        if (title)  title.textContent  = '🎉 All 4 Weeks Complete!';
        ['days','hours','minutes','seconds'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '✅';
        });
        if (action) action.innerHTML = `<a href="dashboard.html#moodlensReport" class="btn btn-primary">View Your Full Report 📊</a>`;
        return;
    }

    if (!lastWeek) {
        // Never taken a test — show Take Test now
        if (title) title.textContent = '🚀 Ready for Week 1!';
        ['days','hours','minutes','seconds'].forEach(id => {
            const el = document.getElementById(id); if (el) el.textContent = '0';
        });
        if (action) action.innerHTML = `<button class="btn btn-primary" onclick="window.location.href='take-test.html'">Start Week 1 Now 📝</button>`;
        return;
    }

    // 7 days after last submission
    const lastDate = new Date(lastWeek.submitted_at);
    const target   = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now      = new Date();

    if (now >= target) {
        // Available now
        if (title) title.textContent = `✅ Week ${weeksCompleted + 1} Available Now!`;
        ['days','hours','minutes','seconds'].forEach(id => {
            const el = document.getElementById(id); if (el) el.textContent = '0';
        });
        if (action) action.innerHTML = `<button class="btn btn-primary" onclick="window.location.href='take-test.html'">Take Week ${weeksCompleted+1} Now 📝</button>`;
        return;
    }

    // Countdown to target
    if (title) title.textContent = `Week ${weeksCompleted + 1} Available In`;
    if (countdownInterval) clearInterval(countdownInterval);

    function tick() {
        const diff = target - new Date();
        if (diff <= 0) { clearInterval(countdownInterval); setupTimer(lastWeek, weeksCompleted); return; }
        document.getElementById('days').textContent    = Math.floor(diff/(1000*60*60*24));
        document.getElementById('hours').textContent   = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
        document.getElementById('minutes').textContent = Math.floor((diff%(1000*60*60))/(1000*60));
        document.getElementById('seconds').textContent = Math.floor((diff%(1000*60))/1000);
    }
    tick();
    countdownInterval = setInterval(tick, 1000);
}

// ═══════════════════════════════════════════════════════════
// WEEK PROGRESS
// ═══════════════════════════════════════════════════════════
async function loadWeekProgress(userId) {
    const sb = window.sb;
    const { data: weekData } = await sb.from('test_responses')
        .select('week, prediction_label, submitted_at').eq('user_id', userId).order('week');

    const completed = weekData || [];
    const badge = document.getElementById('weekBadge');
    if (badge) badge.textContent = `${completed.length}/4`;

    const container = document.getElementById('weekProgressContainer');
    if (!container) return;

    const colorMap = { Stable:'#10b981', Moderate:'#f59e0b', Unstable:'#ef4444', Pending:'#6b7280' };

    container.innerHTML = `
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${[1,2,3,4].map(w => {
                const wd   = completed.find(r => r.week === w);
                const done = !!wd;
                const col  = done ? (colorMap[wd.prediction_label] || '#3b82f6') : '#374151';
                const isNext = w === completed.length + 1 && !done;
                return `<div style="flex:1;min-width:90px;background:${done?'#1e3a5f':'#1a2035'};
                    border:2px solid ${done?col:isNext?'#3b82f6':'#374151'};
                    border-radius:10px;padding:12px;text-align:center;transition:all 0.3s;">
                    <div style="font-size:20px;">${done?'✅':isNext?'🔵':'⚪'}</div>
                    <div style="color:#94a3b8;font-size:11px;margin-top:3px;">Week ${w}</div>
                    ${done?`<div style="color:${col};font-weight:700;font-size:12px;margin-top:3px;">${wd.prediction_label}</div>`:''}
                    ${isNext?`<div style="color:#60a5fa;font-size:11px;margin-top:3px;">Next</div>`:''}
                </div>`;
            }).join('')}
        </div>
        ${completed.length < 4
            ? `<div style="margin-top:10px;color:#94a3b8;font-size:13px;text-align:center;">
                <a href="take-test.html" style="color:#60a5fa;text-decoration:underline;font-weight:600;">
                    Take Week ${completed.length+1} →</a></div>`
            : `<div style="margin-top:10px;padding:8px;background:#1e3a5f;border-radius:8px;text-align:center;color:#60a5fa;font-size:13px;font-weight:600;">
                🎉 All done! <a href="dashboard.html#moodlensReport" style="color:#10b981;text-decoration:underline;">View full report →</a></div>`
        }`;
}

// ═══════════════════════════════════════════════════════════
// RECENT TESTS
// ═══════════════════════════════════════════════════════════
async function loadRecentTests(userId) {
    const sb = window.sb;
    const { data: tests } = await sb.from('test_results')
        .select('*').eq('user_id', userId)
        .order('created_at', { ascending: false }).limit(5);

    const timeline = document.getElementById('moodTimeline');
    if (!timeline) return;

    if (!tests || tests.length === 0) {
        timeline.innerHTML = `<div style="text-align:center;color:#94a3b8;padding:24px;">
            <div style="font-size:32px;margin-bottom:8px;">📝</div>
            <p>No tests yet.</p>
            <p style="font-size:13px;margin-top:4px;">Take your first test to see your mood history!</p>
        </div>`;
        return;
    }

    const emoji = s => s>=4?'😊':s>=3?'😌':s>=2?'😐':'😔';
    const badge = s => s>='4'?['Excellent','badge-success']:s>='3'?['Good','badge-success']:s>='2'?['Fair','badge-warning']:['Needs Attention','badge-warning'];

    timeline.innerHTML = tests.map(t => {
        const d    = new Date(t.created_at);
        const sc   = parseFloat(t.average_score);
        const [bl, bc] = badge(sc);
        return `<div class="mood-entry">
            <div class="mood-icon">${emoji(sc)}</div>
            <div class="flex-1">
                <div class="font-semibold">${t.emotional_state || 'Completed'} · <span style="color:${t.mood_classification==='Stable'?'#10b981':t.mood_classification==='Unstable'?'#ef4444':'#f59e0b'};font-size:13px;">${t.mood_classification||''}</span></div>
                <div class="text-sm text-gray-400">${d.toLocaleDateString()} at ${d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                <div class="text-sm text-gray-500 mt-1">Score: ${sc.toFixed(1)}/5</div>
            </div>
            <span class="badge ${bc}">${bl}</span>
        </div>`;
    }).join('');
}

// ═══════════════════════════════════════════════════════════
// WEEKLY SUMMARY (real data from latest week)
// ═══════════════════════════════════════════════════════════
async function loadWeeklySummary(userId) {
    const sb  = window.sb;
    const box = document.getElementById('weeklySummary');
    if (!box) return;

    const { data: latest } = await sb.from('test_responses')
        .select('*').eq('user_id', userId)
        .order('week', { ascending: false }).limit(1).single();

    if (!latest) {
        box.innerHTML = `<p style="color:#94a3b8;font-size:13px;text-align:center;padding:12px;">Take your first test to see your summary.</p>`;
        return;
    }

    const r    = latest.responses || {};
    const sc   = v => v != null ? ((v-1)/4)*100 : null;
    const sleep  = sc(r['Sleep_Quality']);
    const stress = sc(r['Daily_Stress']);
    const pa     = latest.pa_score != null ? +(latest.pa_score*100).toFixed(0) : null;
    const na     = latest.na_score != null ? +(latest.na_score*100).toFixed(0) : null;

    function bar(label, value, color='#3b82f6') {
        if (value === null) return '';
        return `<div>
            <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">${label}</span>
                <span class="font-semibold">${value}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${value}%;background:${color};"></div>
            </div>
        </div>`;
    }

    const labelColor = latest.prediction_label==='Stable'?'#10b981':latest.prediction_label==='Unstable'?'#ef4444':'#f59e0b';

    box.innerHTML = `
        <div style="margin-bottom:12px;padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
            <span style="color:#94a3b8;font-size:13px;">Week ${latest.week} · ML Label</span>
            <span style="color:${labelColor};font-weight:700;font-size:15px;">${latest.prediction_label || '—'}</span>
        </div>
        <div class="space-y-4">
            ${bar('Positive Affect', pa, '#3b82f6')}
            ${bar('Negative Affect', na, '#ef4444')}
            ${bar('Sleep Quality',   sleep != null ? Math.round(sleep) : null, '#10b981')}
            ${bar('Stress Level',    stress != null ? Math.round(stress) : null, stress>60?'#ef4444':'#f59e0b')}
        </div>
        <div class="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
            <div class="flex items-start gap-2">
                <span>💡</span>
                <p class="text-sm text-gray-300">${getInsight(latest)}</p>
            </div>
        </div>`;
}

function getInsight(week) {
    const r = week.responses || {};
    const stress = r['Daily_Stress'] || 3;
    const sleep  = r['Sleep_Quality'] || 3;
    const rum    = r['Rumination'] || 3;
    if (stress >= 4) return 'Your stress was high this week. Try short breathing exercises between tasks.';
    if (sleep <= 2)  return 'Sleep quality was low. Consistent sleep times can dramatically improve mood.';
    if (rum >= 4)    return 'Rumination was elevated. A 5-minute journalling session can help break the cycle.';
    if (week.prediction_label === 'Stable') return 'Great week emotionally! Keep the habits that worked.';
    return 'Every week of data makes your report more accurate. Keep going!';
}

// ═══════════════════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════════════════
async function loadCalendar(userId) {
    const sb = window.sb;
    const { data: tests } = await sb.from('test_results').select('created_at').eq('user_id', userId);
    const testDates = (tests||[]).map(t => { const d=new Date(t.created_at); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; });

    const today = new Date();
    const year  = today.getFullYear(), month = today.getMonth();
    const first = new Date(year, month, 1).getDay();
    const days  = new Date(year, month+1, 0).getDate();
    const prev  = new Date(year, month, 0).getDate();
    const months= ['January','February','March','April','May','June','July','August','September','October','November','December'];

    const mYr = document.getElementById('calendarMonthYear');
    if (mYr) mYr.textContent = `${months[month]} ${year}`;

    let html = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="calendar-header">${d}</div>`).join('');
    for (let i=first-1;i>=0;i--) html += `<div class="calendar-day inactive">${prev-i}</div>`;
    for (let d=1;d<=days;d++) {
        const isToday   = d===today.getDate();
        const hasTest   = testDates.includes(`${year}-${month}-${d}`);
        const cls = `calendar-day active${hasTest?' has-test':''}${isToday?' today':''}`;
        html += `<div class="${cls}" style="${isToday?'border:2px solid #3b82f6;':''}">${d}</div>`;
    }
    const total = first+days, rem = total%7===0?0:7-(total%7);
    for (let d=1;d<=rem;d++) html += `<div class="calendar-day inactive">${d}</div>`;

    const cal = document.getElementById('calendarGrid');
    if (cal) cal.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════
// QUOTE
// ═══════════════════════════════════════════════════════════
function changeQuote() {
    currentQuoteIndex = (currentQuoteIndex+1) % quotes.length;
    const q = quotes[currentQuoteIndex];
    const el = document.getElementById('quoteText');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
        el.innerHTML = q.text;
        const auth = el.closest('.quote-card')?.querySelector('.text-right span');
        if (auth) auth.textContent = `— ${q.author}`;
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '1';
    }, 300);
}

// ═══════════════════════════════════════════════════════════
// NAV / AUTH
// ═══════════════════════════════════════════════════════════
function toggleSidebar()    { document.getElementById('sidebar')?.classList.toggle('mobile-open'); }
function toggleProfileMenu(){ window.location.href = 'profile-page.html'; }

async function handleLogout() {
    if (!confirm('Are you sure you want to log out?')) return;
    await window.sb?.auth.signOut().catch(console.error);
    window.location.href = 'signpage.html';
}

document.addEventListener('click', e => {
    const sb = document.getElementById('sidebar'), mt = document.querySelector('.mobile-menu-toggle');
    if (window.innerWidth<=1024 && sb && mt && !sb.contains(e.target) && !mt.contains(e.target))
        sb.classList.remove('mobile-open');
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
        this.classList.add('active');
        if (window.innerWidth<=1024) document.getElementById('sidebar')?.classList.remove('mobile-open');
    });
});
