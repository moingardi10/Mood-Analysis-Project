// Auth protection - add to all protected pages
let supabase = window.sb;
if (!supabase) {
    console.error('Supabase not initialized in auth-check.');
}

async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        console.log('Not authenticated, redirecting...');
        window.location.href = 'signpage.html';
        return null;
    }
    
    return user;
}

// Auto-check on page load
let currentUser = null;
checkAuth().then(user => {
    if (user) {
        currentUser = user;
        console.log('✅ User authenticated:', user.email);
    }
});