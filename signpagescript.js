/**
 * signpagescript.js — MoodFlow Auth
 */

function togglePassword() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.textContent = '👁️‍🗨️';
    } else {
        passwordField.type = 'password';
        eyeIcon.textContent = '👁️';
    }
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validIcon = document.getElementById('emailValidIcon');
    if (emailRegex.test(input.value)) {
        input.classList.remove('invalid'); input.classList.add('valid');
        validIcon.textContent = '✓'; validIcon.style.color = '#22C55E'; validIcon.classList.add('show');
    } else {
        input.classList.remove('valid');
        if (input.value.length > 0) {
            input.classList.add('invalid');
            validIcon.textContent = '✗'; validIcon.style.color = '#EF4444'; validIcon.classList.add('show');
        } else { validIcon.classList.remove('show'); }
    }
}

async function handleSignIn(event) {
    event.preventDefault();
    const sb = window.sb;
    if (!sb) { showError('Connection error. Please refresh.'); return; }
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!email || !password) { showError('Please enter email and password.'); return; }

    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { showError(error.message || 'Invalid email or password.'); return; }
    if (!data?.user) { showError('Sign-in failed. Please try again.'); return; }
    window.location.href = 'user-homepage.html';
}

async function handleSignup(event) {
    event.preventDefault();
    const sb = window.sb;
    if (!sb) { signupError('Connection error. Please refresh.'); return; }

    const name     = document.getElementById('signupName')?.value.trim()     || '';
    const email    = document.getElementById('signupEmail')?.value.trim()    || '';
    const password = document.getElementById('signupPassword')?.value.trim() || '';

    if (!name || !email || !password) { signupError('Please fill all fields'); return; }
    if (password.length < 6) { signupError('Password must be at least 6 characters'); return; }

    try {
        const { data, error } = await sb.auth.signUp({
            email, password,
            options: { data: { full_name: name } }
        });
        if (error) throw error;

        if (data.user) {
            await sb.from('users').upsert({ id: data.user.id, email, name }).catch(() => {});
        }

        alert('Account created! Please check your email to verify your account.');
        showLogin();
    } catch (err) {
        signupError(err.message || 'Signup failed');
    }
}

function showSignup(e) {
    if (e) e.preventDefault();
    document.getElementById('loginContainer')?.classList.add('hidden');
    document.getElementById('signupContainer')?.classList.remove('hidden');
}

function showLogin(e) {
    if (e) e.preventDefault();
    document.getElementById('signupContainer')?.classList.add('hidden');
    document.getElementById('loginContainer')?.classList.remove('hidden');
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText    = document.getElementById('errorText');
    if (!errorMessage || !errorText) { alert(message); return; }
    errorText.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => errorMessage.classList.remove('show'), 5000);
}

function signupError(msg) {
    const errorBox  = document.getElementById('signupError');
    const errorText = document.getElementById('signupErrorText');
    if (!errorBox || !errorText) { alert(msg); return; }
    errorText.textContent = msg;
    errorBox.classList.add('show');
}

function signInWithGoogle() { alert('Google sign-in not currently implemented.'); }
function signInWithApple()  { alert('Apple sign-in not currently implemented.'); }

document.addEventListener('DOMContentLoaded', () => {
    const emailField    = document.getElementById('email');
    const passwordField = document.getElementById('password');
    if (emailField)    emailField.addEventListener('input', function() { this.classList.remove('invalid'); });
    if (passwordField) passwordField.addEventListener('input', function() { this.classList.remove('invalid'); });

    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const signInForm = document.getElementById('signInForm');
            if (signInForm && document.activeElement.tagName !== 'BUTTON') {
                signInForm.dispatchEvent(new Event('submit'));
            }
        }
    });
});
