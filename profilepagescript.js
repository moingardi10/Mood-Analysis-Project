/**
 * profilepagescript.js — MoodLens Profile (Full Rewrite)
 * All data real from Supabase. No fake stats.
 */

window.addEventListener('load', async () => {
    const sb = window.sb;
    if (!sb) { window.location.href = 'signpage.html'; return; }
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) { window.location.href = 'signpage.html'; return; }

    loadProfileData(user);
});

async function loadProfileData(user) {
    const sb = window.sb;

    // Fill name/email immediately from auth
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    setEl('userName',  name);
    setEl('userEmail', user.email);
    setEl('fullName',  name, 'value');
    setEl('email',     user.email, 'value');

    // Update avatar initials
    const av = document.querySelector('.profile-avatar-large');
    if (av) { const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2); av.childNodes[0].textContent = initials; }

    try {
        // Load from users table (extra profile fields)
        const { data: profile } = await sb.from('users').select('*').eq('id', user.id).single();
        if (profile) {
            if (profile.name) setEl('fullName', profile.name, 'value');
        }

        // Stats
        const [{ count: totalTests }, { data: streak }, { data: tests }, { data: weeks }] = await Promise.all([
            sb.from('test_results').select('*',{count:'only',head:true}).eq('user_id', user.id),
            sb.from('user_streaks').select('current_streak_days,longest_streak_days').eq('user_id', user.id).single(),
            sb.from('test_results').select('average_score,created_at').eq('user_id', user.id).order('created_at'),
            sb.from('test_responses').select('week,prediction_label').eq('user_id', user.id)
        ]);

        const avgMood = tests?.length
            ? (tests.reduce((s,t)=>s+parseFloat(t.average_score),0)/tests.length).toFixed(1) : '0.0';

        // Days active = days between first test and now
        const daysActive = tests?.length
            ? Math.ceil((new Date()-new Date(tests[0].created_at))/(1000*60*60*24)) : 0;

        // Update stat grid
        const statNums = document.querySelectorAll('.stat-number');
        if (statNums[0]) statNums[0].textContent = totalTests || 0;
        if (statNums[1]) statNums[1].textContent = streak?.current_streak_days || 0;
        if (statNums[2]) statNums[2].textContent = avgMood;
        if (statNums[3]) statNums[3].textContent = daysActive;

        // Member since
        const memberEl = document.querySelector('.member-since, [data-member-since]');
        if (memberEl && tests?.length) {
            const joined = new Date(user.created_at||tests[0].created_at);
            memberEl.textContent = `Member since ${joined.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})} · ${daysActive} days of emotional growth`;
        }

        // Delete modal — update with real stats
        const deleteList = document.querySelector('#deleteModal ul');
        if (deleteList) {
            deleteList.innerHTML = `
                <li>• ${totalTests||0} mood test results</li>
                <li>• ${daysActive} days of tracked data</li>
                <li>• ${weeks?.length||0}/4 weekly responses</li>
                <li>• All reports and insights</li>`;
        }

    } catch(e) { console.error('[Profile]', e); }
}

function setEl(id, val, prop='textContent') {
    const el = document.getElementById(id);
    if (el) el[prop] = val;
}

// ── Save personal info ────────────────────────────────────
async function savePersonalInfo(event) {
    event.preventDefault();
    const sb = window.sb;
    const btn = event.target.querySelector('[type="submit"]');
    if (btn) { btn.textContent = 'Saving...'; btn.disabled = true; }

    try {
        const { data: { user } } = await sb.auth.getUser();
        const name = document.getElementById('fullName')?.value?.trim();

        if (name) {
            await sb.from('users').update({ name }).eq('id', user.id);
            await sb.auth.updateUser({ data: { full_name: name } });
        }

        if (btn) { btn.textContent = '✅ Saved!'; setTimeout(()=>{ btn.textContent='Save Changes'; btn.disabled=false; }, 2000); }
        else alert('✅ Profile updated successfully!');

    } catch(e) {
        console.error(e);
        if (btn) { btn.textContent = 'Save Changes'; btn.disabled = false; }
        alert('Error saving: ' + e.message);
    }
}

// ── Change Password ───────────────────────────────────────
async function changePassword(event) {
    event.preventDefault();
    const sb = window.sb;
    const inputs = event.target.querySelectorAll('input[type="password"]');
    const newPw  = inputs[1]?.value;
    const confPw = inputs[2]?.value;

    if (newPw !== confPw) { alert('Passwords do not match!'); return; }
    if (newPw.length < 6) { alert('Password must be at least 6 characters.'); return; }

    try {
        const { error } = await sb.auth.updateUser({ password: newPw });
        if (error) throw error;
        alert('✅ Password changed successfully!');
        closeModal('passwordModal');
        event.target.reset();
    } catch(e) { alert('Error: ' + e.message); }
}

// ── Export Data ───────────────────────────────────────────
async function exportData() {
    const sb = window.sb;
    try {
        const { data:{user} } = await sb.auth.getUser();
        const [{ data: tests }, { data: weeks }, { data: profile }] = await Promise.all([
            sb.from('test_results').select('*').eq('user_id', user.id),
            sb.from('test_responses').select('*').eq('user_id', user.id),
            sb.from('users').select('*').eq('id', user.id).single()
        ]);
        const exportObj = {
            exportDate: new Date().toISOString(),
            profile: { name: profile?.name, email: user.email, id: user.id },
            testResults: tests || [],
            weeklyResponses: weeks || []
        };
        const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `MoodLens-export-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        alert('✅ Your data has been exported successfully!');
    } catch(e) { alert('Export error: ' + e.message); }
}

// ── Delete Account ────────────────────────────────────────
async function confirmDelete() {
    const confirmText = document.getElementById('deleteConfirm')?.value;
    if (confirmText !== 'DELETE') { alert('Please type "DELETE" to confirm.'); return; }
    if (!confirm('FINAL WARNING: This permanently deletes all your data. Continue?')) return;

    const sb = window.sb;
    try {
        const { data:{user} } = await sb.auth.getUser();
        // Delete user data
        await sb.from('test_responses').delete().eq('user_id', user.id);
        await sb.from('test_results').delete().eq('user_id', user.id);
        await sb.from('user_streaks').delete().eq('user_id', user.id);
        await sb.from('users').delete().eq('id', user.id);
        await sb.auth.signOut();
        alert('Your account has been deleted. We are sorry to see you go!');
        window.location.href = 'signpage.html';
    } catch(e) { alert('Error deleting account: ' + e.message); }
}

// ── Google Calendar Reminder ──────────────────────────────
async function addToGoogleCalendar() {
    const sb = window.sb;
    const { data: latest } = await sb.from('test_responses')
        .select('submitted_at,week').eq('user_id', (await sb.auth.getUser()).data.user.id)
        .order('week', {ascending:false}).limit(1).single();

    const nextDate = latest
        ? new Date(new Date(latest.submitted_at).getTime() + 7*24*60*60*1000)
        : new Date(Date.now() + 7*24*60*60*1000);

    const weekNum = latest ? Math.min(latest.week + 1, 4) : 1;
    const pad = n => String(n).padStart(2,'0');
    const fmt = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T090000`;
    const end  = new Date(nextDate); end.setHours(9,30,0,0);
    const start = new Date(nextDate); start.setHours(9,0,0,0);

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE`
        + `&text=${encodeURIComponent(`MoodLens — Week ${weekNum} Test`)}`
        + `&dates=${fmt(start)}/${fmt(end)}`
        + `&details=${encodeURIComponent('Time for your weekly MoodLens mood assessment. Takes about 5 minutes.')}`
        + `&sf=true&output=xml`;

    window.open(url, '_blank');
}

// ── Modals ────────────────────────────────────────────────
function showDeleteModal()   { document.getElementById('deleteModal')?.classList.add('show'); }
function showPasswordModal() { document.getElementById('passwordModal')?.classList.add('show'); }
function closeModal(id)      { document.getElementById(id)?.classList.remove('show'); }

document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('show'); });
});

// ── Logout ────────────────────────────────────────────────
async function handleLogout() {
    if (!confirm('Are you sure you want to log out?')) return;
    await window.sb?.auth.signOut().catch(console.error);
    window.location.href = 'signpage.html';
}

function toggleSidebar() { document.getElementById('sidebar')?.classList.toggle('mobile-open'); }
function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) alert('Avatar upload coming soon! For now your initials are shown.');
}
