// GLOBAL HELPERS
function getUsersFromStorage() {
    return JSON.parse(localStorage.getItem('usersDB')) || [];
}

function saveUsersToStorage(users) {
    localStorage.setItem('usersDB', JSON.stringify(users));
}

function setLoggedInUser(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
}

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

// TOGGLE PASSWORD
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

// EMAIL VALIDATION
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validIcon = document.getElementById('emailValidIcon');

    if (emailRegex.test(input.value)) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        validIcon.textContent = '✓';
        validIcon.style.color = '#22C55E';
        validIcon.classList.add('show');
    } else {
        input.classList.remove('valid');

        if (input.value.length > 0) {
            input.classList.add('invalid');
            validIcon.textContent = '✗';
            validIcon.style.color = '#EF4444';
            validIcon.classList.add('show');
        } else {
            validIcon.classList.remove('show');
        }
    }
}

// SIGN IN HANDLE
function handleSignIn(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;
    const signInBtn = document.getElementById('signInBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');

    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }

    // Loading state
    signInBtn.disabled = true;
    signInBtn.innerHTML = 'Signing In<span class="spinner"></span>';

    setTimeout(() => {
        const users = getUsersFromStorage();

        const foundUser = users.find(
            u => u.email === email && u.password === password
        );

        if (!foundUser) {
            showError('Invalid email or password');
            signInBtn.disabled = false;
            signInBtn.innerHTML = 'Sign In';
            return;
        }

        // SUCCESS LOGIN
        successMessage.classList.add('show');

        setLoggedInUser(foundUser);

        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('userEmail', email);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('userEmail');
        }

        setTimeout(() => {
            window.location.href = "user-homepage.html";
        }, 1200);

    }, 1000);
}

// ERROR MESSAGE
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    errorText.textContent = message;
    errorMessage.classList.add('show');

    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// // SOCIAL LOGIN (DEMO)
// function signInWithGoogle() {
//     alert('Google OAuth will be added in backend version');
// }

// function signInWithApple() {
//     alert('Apple OAuth will be added in backend version');
// }

// AUTO FILL + AUTO LOGIN

window.addEventListener('load', () => {
    // preload demo users if not present
    if (!localStorage.getItem('usersDB')) {
        fetch('users.json')
            .then(r => r.json())
            .then(data => saveUsersToStorage(data))
            .catch(() => console.log('users.json not found (ok for prod)'));
    }

    const rememberMe = localStorage.getItem('rememberMe');
    const userEmail = localStorage.getItem('userEmail');

    if (rememberMe === 'true' && userEmail) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('rememberMe');

        if (emailInput && rememberCheckbox) {
            emailInput.value = userEmail;
            rememberCheckbox.checked = true;
            validateEmail(emailInput);
        }
    }
});

// INPUT CLEANUP
document.getElementById('email').addEventListener('input', function () {
    this.classList.remove('invalid');
});

document.getElementById('password').addEventListener('input', function () {
    this.classList.remove('invalid');
});

// ENTER KEY SUBMIT
document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const signInForm = document.getElementById('signInForm');
        if (document.activeElement.tagName !== 'BUTTON') {
            signInForm.dispatchEvent(new Event('submit'));
        }
    }
});

// PAGE TOGGLE CREATE FREE
function showSignup(e) {
    if (e) e.preventDefault();

    const loginBox = document.getElementById('loginContainer');
    const signupBox = document.getElementById('signupContainer');

    if (loginBox) loginBox.style.display = 'none';
    if (signupBox) signupBox.style.display = 'block';
}

function showLogin(e) {
    if (e) e.preventDefault();

    const loginBox = document.getElementById('loginContainer');
    const signupBox = document.getElementById('signupContainer');

    if (loginBox) loginBox.style.display = 'block';
    if (signupBox) signupBox.style.display = 'none';
}

// USERS DB LOCAL JSON SAVE
function getUsersDB() {
    return JSON.parse(localStorage.getItem('usersDB')) || [];
}

function saveUsersDB(users) {
    localStorage.setItem('usersDB', JSON.stringify(users));
}

// SIGNUP HANDLER
function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value.trim();

    const errorBox = document.getElementById('signupError');
    const errorText = document.getElementById('signupErrorText');

    errorBox.classList.remove('show');

    // validations
    if (!name || !email || !password) {
        signupError('Please fill all fields');
        return;
    }

    if (password.length < 6) {
        signupError('Password must be at least 6 characters');
        return;
    }

    const users = getUsersDB();

    // duplicate email check
    const exists = users.some(u => u.email === email);

    if (exists) {
        signupError('Email already registered');
        return;
    }

    // create user object
    const newUser = {
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsersDB(users);

    // auto login after signup
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));

    alert('Account created successfully!');

    window.location.href = "user-homepage.html";
}

function showSignup(e) {
    e.preventDefault();
    loginContainer.classList.add("hidden");
    signupContainer.classList.remove("hidden");
}

function showLogin(e) {
    e.preventDefault();
    signupContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
}

// SIGNUP ERROR
function signupError(msg) {
    const errorBox = document.getElementById('signupError');
    const errorText = document.getElementById('signupErrorText');

    errorText.textContent = msg;
    errorBox.classList.add('show');
}