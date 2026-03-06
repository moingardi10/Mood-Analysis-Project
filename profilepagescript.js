// Modal Functions
function showLogoutModal() {
    document.getElementById('logoutModal').classList.add('show');
}

function showCancelModal() {
    document.getElementById('cancelModal').classList.add('show');
}

function showDeleteModal() {
    document.getElementById('deleteModal').classList.add('show');
}

function showPasswordModal() {
    document.getElementById('passwordModal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function getPersonalInfoDB() {
    return JSON.parse(localStorage.getItem('personalInfoDB')) || [];
}

function savePersonalInfoDB(data) {
    localStorage.setItem('personalInfoDB', JSON.stringify(data));
}

// Close modal on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
});

//Welcome with User name
window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (user && document.getElementById('userName')) {
        document.getElementById('userName').textContent =
            `${user.name}`;
    }

    if (user && document.getElementById('userEmail')) {
        document.getElementById('userEmail').textContent =
            `${user.email}`;
    }
});


// Handle Logout
function handleLogout() {
    // Clear user session
    localStorage.removeItem('userToken');
    localStorage.removeItem('rememberMe');

    // Show confirmation
    alert('You have been logged out successfully!');

    // Redirect to sign-in page
    window.location.href = 'signpage.html';
}

// Save Personal Info
function savePersonalInfo(event) {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    const formData = {
        userEmail: user?.email || null, // link to user
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        location: document.getElementById('location').value,
        bio: document.getElementById('bio').value,
        updatedAt: new Date().toISOString()
    };

    // get existing JSON array
    let db = getPersonalInfoDB();
    if (!Array.isArray(db)) db = [];

    // check if user already exists → update instead of duplicate
    const index = db.findIndex(item => item.userEmail === formData.userEmail);

    if (index !== -1) {
        db[index] = formData; // update existing
    } else {
        db.push(formData); // add new object
    }

    // save back
    savePersonalInfoDB(db);

    console.log('Saved to personalInfoDB:', db);

    alert(' Profile updated successfully!');
}

window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    const db = getPersonalInfoDB();
    if (!Array.isArray(db)) return;

    const profile = db.find(p => p.userEmail === user.email);
    if (!profile) return;

    document.getElementById('fullName').value = profile.fullName || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('dob').value = profile.dob || '';
    document.getElementById('location').value = profile.location || '';
    document.getElementById('bio').value = profile.bio || '';
});

// Handle Avatar Change
function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // In production, upload to server
            console.log('Avatar uploaded:', e.target.result);
            alert(' Avatar updated! (In production, this would upload to server)');
        };
        reader.readAsDataURL(file);
    }
}

// Change Password
function changePassword(event) {
    event.preventDefault();

    const form = event.target;
    const newPassword = form.querySelector('input[placeholder="Enter new password"]').value;
    const confirmPassword = form.querySelector('input[placeholder="Confirm new password"]').value;

    if (newPassword !== confirmPassword) {
        alert(' Passwords do not match!');
        return;
    }

    // Simulate API call
    console.log('Changing password...');

    setTimeout(() => {
        alert('Password changed successfully!');
        closeModal('passwordModal');
        form.reset();
    }, 500);
}

// Confirm Cancel Subscription
function confirmCancel() {
    if (confirm('Are you absolutely sure? This will downgrade you to the free plan.')) {
        console.log('Canceling subscription...');
        alert('✓ Subscription canceled. You\'ll have access until March 15, 2026.');
        closeModal('cancelModal');
    }
}

// Confirm Delete Account
function confirmDelete() {
    const confirmText = document.getElementById('deleteConfirm').value;

    if (confirmText !== 'DELETE') {
        alert(' Please type "DELETE" to confirm account deletion.');
        return;
    }

    if (confirm('FINAL WARNING: This will permanently delete all your data. Continue?')) {
        console.log('Deleting account...');

        // Simulate API call
        setTimeout(() => {
            alert('Your account has been deleted. We\'re sorry to see you go!');
            window.location.href = 'mood-analysis-homepage.html';
        }, 1000);
    }
}

// Export Data
function exportData() {
    console.log('Exporting user data...');

    // Simulate data export
    const userData = {
        profile: {
            name: 'Alex Morgan',
            email: 'alex.morgan@email.com',
            memberSince: 'September 15, 2023'
        },
        stats: {
            testsTaken: 47,
            dayStreak: 12,
            avgMood: 8.2,
            daysActive: 156
        },
        subscription: {
            plan: 'Pro',
            status: 'Active'
        }
    };

    // Create downloadable file
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'moodflow-data-export.json';
    link.click();

    alert('✓ Your data has been exported successfully!');
}

// Toggle sidebar on mobile
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('mobile-open');
}

// Navigation active state
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function (e) {
        if (!this.href.includes('html')) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// PAGE TOGGLE (ngIf style)
function showSignup() {
    document.querySelector('.form-container').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'block';
}

function showLogin() {
    document.querySelector('.form-container').style.display = 'block';
    document.getElementById('signupContainer').style.display = 'none';
}

// USERS DB (local JSON)
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

// PAGE TOGGLE (ngIf style)
function showSignup() {
    document.querySelector('.form-container').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'block';
}

function showLogin() {
    document.querySelector('.form-container').style.display = 'block';
    document.getElementById('signupContainer').style.display = 'none';
}

// USERS DB (local JSON)
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


