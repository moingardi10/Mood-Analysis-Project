// Motivational Quotes
const quotes = [
    {
        text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
        author: "Nido Qubein"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        text: "Everything you've ever wanted is on the other side of fear.",
        author: "George Addair"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "Hardships often prepare ordinary people for an extraordinary destiny.",
        author: "C.S. Lewis"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    }
];

let currentQuoteIndex = 0;

function loadRealData() {
    // Get current user ID
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user ? user.email : null;
    
    if (!userId) {
        console.log('No user logged in');
        return;
    }
    
    // Get cached stats for this user
    const cachedStats = MoodFlowData.userStatsCache.getStats(userId);
    
    // Use cached stats, or calculate if not cached
    const weeklyTests = cachedStats?.weeklyTests || 0;
    const streak = cachedStats?.streak || 0;
    const avgMood = cachedStats?.avgMood || '0.0';
    const totalTests = cachedStats?.totalTests || 0;
    
    // Update the stat cards
    document.querySelectorAll('.stat-number')[0].textContent = weeklyTests;
    document.querySelectorAll('.stat-number')[1].textContent = streak;
    document.querySelectorAll('.stat-number')[2].textContent = avgMood;
    document.querySelectorAll('.stat-number')[3].textContent = totalTests;
    
    // Load recent moods
    loadRecentMoods();
    
    // Update calendar
    loadCalendarData();
}

function loadRecentMoods() {
    // Get current user ID
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user ? user.email : null;
    
    if (!userId) {
        return;
    }
    
    // Get tests for current user only
    const allTests = MoodFlowData.tests.getAll();
    const userTests = allTests.filter(t => t.userId === userId);
    const recentTests = userTests.slice(-5).reverse();
    
    const moodTimeline = document.querySelector('.mood-timeline');
    if (moodTimeline && recentTests.length > 0) {
        moodTimeline.innerHTML = recentTests.map(test => {
            const date = new Date(test.date);
            const score = test.metrices?.averageScore || test.averageScore || '0';
            const emotionalState = test.metrices?.emotionalState || test.emotionalState || 'Completed';
            return `
                <div class="mood-entry">
                    <div class="mood-icon">😊</div>
                    <div class="flex-1">
                        <div class="font-semibold">${emotionalState}</div>
                        <div class="text-sm text-gray-400">${date.toLocaleDateString()}</div>
                        <div class="text-sm">Score: ${score}/10</div>
                    </div>
                </div>
            `;
        }).join('');
    } else if (moodTimeline) {
        moodTimeline.innerHTML = '<p class="text-center text-gray-400">No tests yet. Take your first test!</p>';
    }
}

function generateDynamicCalendar() {
    // Get current user ID
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user ? user.email : null;
    
    if (!userId) {
        return;
    }
    
    // Get current date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Get test dates for current user only
    const allTests = MoodFlowData.tests.getAll();
    const userTests = allTests.filter(t => t.userId === userId);
    const testDates = userTests.map(test => {
        const date = new Date(test.date);
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        };
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Create calendar HTML
    let calendarHTML = '';
    
    // Days of week headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        calendarHTML += `<div class="calendar-header">${day}</div>`;
    });
    
    // Previous month's days (greyed out)
    for (let i = firstDay - 1; i >= 0; i--) {
        calendarHTML += `<div class="calendar-day inactive">${daysInPrevMonth - i}</div>`;
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const hasTest = testDates.some(d => 
            d.year === currentYear && 
            d.month === currentMonth && 
            d.day === day
        );
        
        const className = hasTest ? 'calendar-day active has-test' : 'calendar-day active';
        calendarHTML += `<div class="${className}">${day}</div>`;
    }
    
    // Next month's days (greyed out)
    const totalCells = firstDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let day = 1; day <= remainingCells; day++) {
        calendarHTML += `<div class="calendar-day inactive">${day}</div>`;
    }
    
    // Update calendar container
    const calendarContainer = document.querySelector('.calendar');
    if (calendarContainer) {
        calendarContainer.innerHTML = calendarHTML;
    }
    
    // Update month/year header
    const monthYearElement = document.getElementById('calendarMonthYear');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    if (monthYearElement) {
        monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    // Add click handlers to calendar days
    addCalendarDayClickHandlers();
}

function addCalendarDayClickHandlers() {
    document.querySelectorAll('.calendar-day:not(.inactive)').forEach(day => {
        day.addEventListener('click', function() {
            const dayNumber = parseInt(this.textContent);
            const hasTest = this.classList.contains('has-test');
            
            if (hasTest) {
                alert(`Test taken on this day. View details in History.`);
            } else {
                alert(`No test recorded for this day.`);
            }
        });
    });
}

function loadCalendarData() {
    generateDynamicCalendar();
}

// Call this when page loads
window.addEventListener('load', loadRealData);

function changeQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    const quote = quotes[currentQuoteIndex];

    const quoteElement = document.getElementById('quoteText');
    quoteElement.style.opacity = '0';

    setTimeout(() => {
        quoteElement.innerHTML = quote.text;
        quoteElement.nextElementSibling.innerHTML = `<span class="text-gray-400 font-mono text-sm">— ${quote.author}</span>`;
        quoteElement.style.transition = 'opacity 0.5s ease';
        quoteElement.style.opacity = '1';
    }, 300);
}

//Welcome with User name
window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (user && document.getElementById('welcomeUser')) {
        document.getElementById('welcomeUser').textContent =
            `Welcome, ${user.name} 👋`;
    }
});


// Countdown Timer
function updateCountdown() {
    // Set target date (7 days from now for demo)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(14, 32, 45);

    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Toggle Profile Menu (placeholder)
function toggleProfileMenu() {
    // alert('Profile menu would open here. Features:\n- View Profile\n- Settings\n- Subscription\n- Logout');
    window.location.href = "profile-page.html";
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('mobile-open');
        }
    }
});

// Add smooth scroll for navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function (e) {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        // Add active class to clicked item
        this.classList.add('active');

        // Close sidebar on mobile after click
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('mobile-open');
        }
    });
});
