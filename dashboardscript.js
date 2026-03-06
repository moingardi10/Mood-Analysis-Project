// DATA MANAGEMENT SYSTEM
// Global data store (This will be replaced with your actual dataset)
let dashboardData = {
    currentFilter: '30days',
    stats: {
        avgMood: 8.2,
        totalTests: 47,
        avgStress: 3.4,
        completionRate: 94
    },
    // Sample data structure - replace with your actual data
    rawTestData: [
        { date: '2026-02-20', time: '10:30', moodScore: 8.5, emotionalState: 'Happy', stressLevel: 3, duration: 5 },
        { date: '2026-02-19', time: '14:15', moodScore: 7.8, emotionalState: 'Calm', stressLevel: 4, duration: 6 },
        { date: '2026-02-18', time: '09:00', moodScore: 9.1, emotionalState: 'Excellent', stressLevel: 2, duration: 5 },
        { date: '2026-02-17', time: '16:45', moodScore: 6.5, emotionalState: 'Neutral', stressLevel: 5, duration: 7 },
        { date: '2026-02-16', time: '11:20', moodScore: 8.0, emotionalState: 'Good', stressLevel: 3, duration: 5 },
    ]
};

// Chart instances
let charts = {};

// INITIALIZATION
window.addEventListener('load', function () {
    initializeDashboard();
});

function initializeDashboard() {
    // Load data from localStorage (from test results)
    loadStoredData();

    // Initialize all charts
    initializeCharts();

    // Populate test history table
    populateTestHistory();

    // Update stats
    updateStatCards();
}

// DATA LOADING FUNCTIONS
// function loadStoredData() {
//     // Load test results from localStorage
//     const storedTests = localStorage.getItem('moodflowTests');
//     if (storedTests) {
//         const tests = JSON.parse(storedTests);

//         // Convert stored tests to dashboard format
//         dashboardData.rawTestData = tests.map(test => ({
//             date: new Date(test.date).toISOString().split('T')[0],
//             time: new Date(test.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
//             moodScore: test.averageScore,
//             emotionalState: test.emotionalState,
//             stressLevel: test.stressLevel,
//             duration: test.duration,
//             answers: test.answers
//         }));

//         // Update stats based on loaded data
//         calculateStats();
//     }
// }
function loadStoredData() {
    // Load only tests for the currently logged-in user (persisted in localStorage)
    const loggedUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Fallback to global tests if no logged-in user found
    let tests = [];
    try {
        tests = (MoodFlowData && MoodFlowData.tests && MoodFlowData.tests.getAll()) ? MoodFlowData.tests.getAll() : [];
    } catch (e) {
        console.warn('Error loading tests from MoodFlowData:', e);
        tests = [];
    }

    if (loggedUser && loggedUser.email) {
        tests = tests.filter(t => t.userId === loggedUser.email);
    }

    console.log(`📊 Dashboard: Loaded ${tests.length} tests for user ${loggedUser?.email || 'no user'}`);

    if (tests.length > 0) {
        dashboardData.rawTestData = tests.map((test, idx) => {
            // Extract mood score with priority: metrices > top level > 0
            let moodScore = 0;
            if (test.metrices && test.metrices.averageScore) {
                moodScore = parseFloat(test.metrices.averageScore);
            } else if (test.averageScore) {
                moodScore = parseFloat(test.averageScore);
            } else if (test.score) {
                moodScore = parseFloat(test.score);
            }
            
            console.log(`  Test ${idx}: date=${test.date}, moodScore=${moodScore}, state=${test.emotionalState || test.metrices?.emotionalState}`);
            
            return {
                date: new Date(test.date).toISOString().split('T')[0],
                time: new Date(test.date).toLocaleTimeString(),
                moodScore: moodScore || 0,
                emotionalState: (test.metrices && test.metrices.emotionalState) || test.emotionalState || 'Good',
                stressLevel: test.metrices && test.metrices.stressLevel !== undefined ? Math.round(test.metrices.stressLevel) : Math.round(10 - (moodScore || 0)),
                duration: test.duration || 0,
                raw: test
            };
        });

        console.log(`  Raw data after mapping:`, dashboardData.rawTestData);
        calculateStats();
        console.log(`  Stats calculated:`, dashboardData.stats);
    } else {
        // No data for this user - show empty state
        dashboardData.rawTestData = [];
        dashboardData.stats = {
            avgMood: 0,
            totalTests: 0,
            avgStress: 0,
            completionRate: 0
        };
    }
}

function calculateStats() {
    const data = filterDataByPeriod(dashboardData.rawTestData, dashboardData.currentFilter);

    if (data.length > 0) {
        dashboardData.stats.avgMood = (data.reduce((sum, t) => sum + t.moodScore, 0) / data.length).toFixed(1);
        dashboardData.stats.totalTests = data.length;
        dashboardData.stats.avgStress = (data.reduce((sum, t) => sum + (t.stressLevel || 3), 0) / data.length).toFixed(1);
        dashboardData.stats.completionRate = 94; // Calculate based on your logic
    }
}

function filterDataByPeriod(data, period) {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
        case '7days':
            startDate.setDate(now.getDate() - 7);
            break;
        case '30days':
            startDate.setDate(now.getDate() - 30);
            break;
        case '90days':
            startDate.setDate(now.getDate() - 90);
            break;
        case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        case 'all':
            return data;
    }

    return data.filter(item => new Date(item.date) >= startDate);
}

// CHART INITIALIZATION
function initializeCharts() {
    createSentimentChart();
    createMoodPieChart();
    createHistoricalChart();
    createRadarChart();
    createActivityChart();
}

// Sentiment Analysis Line Chart
function createSentimentChart() {
    const ctx = document.getElementById('sentimentChart').getContext('2d');

    // Generate data based on filtered period
    const data = filterDataByPeriod(dashboardData.rawTestData, dashboardData.currentFilter);
    let labels = data.map(d => d.date);

    // Calculate positive/negative sentiment
    let positiveScores = data.map(d => d.moodScore >= 4 ? d.moodScore : 0);
    let negativeScores = data.map(d => d.moodScore < 4 ? d.moodScore : 0);

    // Fallback when no data
    if (!data || data.length === 0) {
        labels = ['No Data'];
        positiveScores = [0];
        negativeScores = [0];
    }

    charts.sentimentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Positive Sentiment',
                data: positiveScores,
                borderColor: '#22C55E',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Negative Sentiment',
                data: negativeScores,
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#F8F9FF' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { color: '#F8F9FF' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#F8F9FF' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Mood Distribution Pie Chart
function createMoodPieChart() {
    const ctx = document.getElementById('moodPieChart').getContext('2d');

    const data = filterDataByPeriod(dashboardData.rawTestData, dashboardData.currentFilter);

    // Count mood types
    const moodCounts = {
        'Excellent': 0,
        'Happy': 0,
        'Good': 0,
        'Calm': 0,
        'Neutral': 0,
        'Sad': 0,
        'Anxious': 0
    };

    data.forEach(d => {
        if (moodCounts.hasOwnProperty(d.emotionalState)) {
            moodCounts[d.emotionalState]++;
        }
    });

    // If no data, show a single "No Data" slice
    const hasAny = Object.values(moodCounts).some(v => v > 0);
    if (!hasAny) {
        Object.keys(moodCounts).forEach(k => moodCounts[k] = 0);
        // replace with a single label to indicate empty state
        charts.moodPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['No Data'],
                datasets: [{ data: [1], backgroundColor: ['#4B5563'], borderWidth: 0 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        return;
    }

    charts.moodPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(moodCounts),
            datasets: [{
                data: Object.values(moodCounts),
                backgroundColor: [
                    '#22C55E',
                    '#86EFAC',
                    '#00D9FF',
                    '#67E8F9',
                    '#F59E0B',
                    '#8B5CF6',
                    '#EF4444'
                ],
                borderWidth: 2,
                borderColor: '#0F0F23'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#F8F9FF',
                        padding: 15
                    }
                }
            }
        }
    });
}

// Historical Bar Chart
function createHistoricalChart() {
    const ctx = document.getElementById('historicalChart').getContext('2d');

    const data = filterDataByPeriod(dashboardData.rawTestData, dashboardData.currentFilter);
    const labels = data.map(d => d.date);
    const scores = data.map(d => d.moodScore);

    // Fallback when no data
    const finalLabels = (labels.length === 0) ? ['No Data'] : labels;
    const finalScores = (scores.length === 0) ? [0] : scores;

    charts.historicalChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood Score',
                        data: finalScores,
                backgroundColor: scores.map(score => {
                    if (score >= 8) return 'rgba(34, 197, 94, 0.8)';
                    if (score >= 6) return 'rgba(0, 217, 255, 0.8)';
                    if (score >= 4) return 'rgba(245, 158, 11, 0.8)';
                    return 'rgba(239, 68, 68, 0.8)';
                }),
                borderColor: scores.map(score => {
                    if (score >= 8) return '#22C55E';
                    if (score >= 6) return '#00D9FF';
                    if (score >= 4) return '#F59E0B';
                    return '#EF4444';
                }),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#F8F9FF' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { color: '#F8F9FF' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#F8F9FF' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Category Radar Chart
function createRadarChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');

    // Build radar values from analytics where possible (dynamic). If no data, show "No Data" placeholder.
    const filtered = filterDataByPeriod(dashboardData.rawTestData, dashboardData.currentFilter);

    let labels = ['Emotional Wellbeing', 'Stress Management', 'Energy Level', 'Sleep Quality', 'Social Connection', 'Motivation'];
    let datasetValues = [];

    if (filtered && filtered.length > 0) {
        // Prefer analytics helper if available
        const weekly = (MoodFlowData && MoodFlowData.analytics) ? MoodFlowData.analytics.getWeeklySummary() : null;

        const avgMood = weekly ? parseFloat(weekly.averageMood) : parseFloat(dashboardData.stats.avgMood) || 0;
        const stress = weekly ? parseFloat(weekly.stressLevel) : (10 - avgMood);
        const energy = weekly ? parseFloat(weekly.energyLevel) : (avgMood * 0.85);
        const sleep = weekly ? parseFloat(weekly.sleepQuality) : (avgMood * 0.9);

        // Social Connection & Motivation are not directly captured; attempt to derive or mark as 0
        const social = 0; // N/A until more granular data
        const motivation = 0; // N/A

        datasetValues = [
            Number(avgMood.toFixed(1)),
            Number(stress.toFixed(1)),
            Number(energy.toFixed(1)),
            Number(sleep.toFixed(1)),
            social,
            motivation
        ];
    } else {
        // No data: show a single-point placeholder by using small values and adjust labels
        labels = ['No Data'];
        datasetValues = [0];
    }

    charts.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: filtered && filtered.length > 0 ? 'Current Period' : 'No Data',
                data: datasetValues,
                borderColor: '#FF6B9D',
                backgroundColor: 'rgba(255, 107, 157, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#F8F9FF' } }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { color: '#F8F9FF', backdropColor: 'transparent' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#F8F9FF' }
                }
            }
        }
    });
}

// Activity Doughnut Chart
function createActivityChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    // Build counts per weekday from user's test data
    const data = filterDataByPeriod(dashboardData.rawTestData, dashboardData.currentFilter);
    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    data.forEach(d => {
        const dt = new Date(d.date);
        const day = dt.getDay();
        counts[day] = (counts[day] || 0) + 1;
    });

    // Fallback when no data
    const hasAny = counts.some(c => c > 0);
    const finalLabels = hasAny ? labels : ['No Data'];
    const finalData = hasAny ? counts : [1];
    const bg = hasAny ? ['#FF6B9D','#FFA500','#00D9FF','#22C55E','#F59E0B','#8B5CF6','#EF4444'] : ['#9CA3AF'];

    charts.activityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: finalLabels,
            datasets: [{ data: finalData, backgroundColor: bg, borderWidth: 2, borderColor: '#0F0F23' }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { color: '#F8F9FF', padding: 15 } } }
        }
    });
}

// UI UPDATE FUNCTIONS
function updateStatCards() {
    const hasTests = dashboardData.stats && dashboardData.stats.totalTests > 0;

    document.getElementById('avgMood').textContent = hasTests ? dashboardData.stats.avgMood : 'N/A';
    document.getElementById('totalTests').textContent = hasTests ? dashboardData.stats.totalTests : '0';
    document.getElementById('avgStress').textContent = hasTests ? dashboardData.stats.avgStress : 'N/A';
    document.getElementById('completionRate').textContent = hasTests ? (dashboardData.stats.completionRate + '%') : 'N/A';
}

function populateTestHistory() {
    const tbody = document.getElementById('testHistoryTable');
    const data = filterDataByPeriod(dashboardData.rawTestData, dashboardData.currentFilter).slice(0, 10);
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:1rem; color:#9CA3AF;">No test data available</td>
            </tr>`;
        return;
    }

    tbody.innerHTML = data.map(test => `
                <tr>
                    <td>${test.date}</td>
                    <td>${test.time}</td>
                    <td><strong>${test.moodScore}</strong>/10</td>
                    <td><span style="color: ${getMoodColor(test.moodScore)}">${test.emotionalState}</span></td>
                    <td>${getStressLevelText(test.stressLevel)}</td>
                    <td>${test.duration} min</td>
                    <td>
                        <button class="btn-secondary text-xs px-2 py-1" onclick="viewTestDetails('${test.date}')">
                            View Details
                        </button>
                    </td>
                </tr>
            `).join('');
}

function getMoodColor(score) {
    if (score >= 8) return '#22C55E';
    if (score >= 6) return '#00D9FF';
    if (score >= 4) return '#F59E0B';
    return '#EF4444';
}

function getStressLevelText(level) {
    const levels = {
        1: 'Very Low',
        2: 'Low',
        3: 'Moderate',
        4: 'High',
        5: 'Very High'
    };
    return levels[level] || 'Moderate';
}

// FILTER FUNCTIONS
function setDateFilter(period) {
    dashboardData.currentFilter = period;

    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Recalculate stats
    calculateStats();
    updateStatCards();

    // Refresh all charts
    refreshAllCharts();

    // Update table
    populateTestHistory();
}

function refreshAllCharts() {
    // Destroy existing charts
    Object.values(charts).forEach(chart => chart.destroy());

    // Recreate all charts with new data
    initializeCharts();
}

function refreshChart(chartName) {
    if (charts[chartName]) {
        charts[chartName].destroy();
    }

    switch (chartName) {
        case 'sentimentChart':
            createSentimentChart();
            break;
        case 'moodPieChart':
            createMoodPieChart();
            break;
        case 'historicalChart':
            createHistoricalChart();
            break;
    }
}

// EXPORT FUNCTIONS
function toggleExportMenu() {
    const menu = document.getElementById('exportMenu');
    menu.classList.toggle('show');
}

function exportData(format) {
    const data = filterDataByPeriod(dashboardData.rawTestData, dashboardData.currentFilter);

    switch (format) {
        case 'csv':
            exportToCSV(data);
            break;
        case 'json':
            exportToJSON(data);
            break;
        case 'pdf':
            exportReportPDF(data);
            break;
    }

    toggleExportMenu();
}

function exportReportPDF() {
    const element = document.getElementById('reportPDF');

    if (!element) {
        alert("Report element not found!");
        return;
    }

    if (typeof html2pdf === "undefined") {
        alert("PDF library not loaded!");
        return;
    }

    // Helper: generate a tiny SVG placeholder as data URI
    function svgPlaceholder(text, w = 600, h = 300) {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><rect width='100%' height='100%' fill='#F3F4F6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6B7280' font-family='Arial' font-size='18'>${text}</text></svg>`;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    // Helper: get base64 image from chart or placeholder
    function getChartImageEl(chartInstance, placeholderText) {
        const img = document.createElement('img');
        img.style.width = '100%';
        img.style.maxHeight = '300px';
        img.style.objectFit = 'contain';

        try {
            if (chartInstance && typeof chartInstance.toBase64Image === 'function') {
                img.src = chartInstance.toBase64Image();
            } else {
                img.src = svgPlaceholder(placeholderText);
            }
        } catch (e) {
            img.src = svgPlaceholder(placeholderText);
        }

        return img;
    }

    // populate metadata and summary
    const loggedUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const profile = (window.MoodFlowData && MoodFlowData.user && MoodFlowData.user.getProfile()) || {};

    document.getElementById('pdfDate').textContent = new Date().toLocaleString();
    document.getElementById('pdfUserName').textContent = loggedUser.name || profile.fullName || loggedUser.email || 'Unknown User';
    document.getElementById('pdfUserEmail').textContent = loggedUser.email || profile.email || '';

    const hasTests = dashboardData.stats && dashboardData.stats.totalTests > 0;
    document.getElementById('pdfAvgMood').textContent = hasTests ? dashboardData.stats.avgMood : 'N/A';
    document.getElementById('pdfTotalTests').textContent = hasTests ? dashboardData.stats.totalTests : '0';
    document.getElementById('pdfAvgStress').textContent = hasTests ? dashboardData.stats.avgStress : 'N/A';

    // Put chart images into the placeholders
    const imgSent = getChartImageEl(charts.sentimentChart, 'No Sentiment Data');
    const imgPie = getChartImageEl(charts.moodPieChart, 'No Mood Distribution');
    const imgHist = getChartImageEl(charts.historicalChart, 'No Historical Data');
    const imgRadar = getChartImageEl(charts.radarChart, 'No Category Data');

    const elSent = document.getElementById('pdfSentimentChart');
    const elPie = document.getElementById('pdfMoodPieChart');
    const elHist = document.getElementById('pdfHistoricalChart');
    const elRadar = document.getElementById('pdfRadarChart');

    // replace elements (they are <img> tags in template)
    if (elSent) elSent.replaceWith(imgSent);
    if (elPie) elPie.replaceWith(imgPie);
    if (elHist) elHist.replaceWith(imgHist);
    if (elRadar) elRadar.replaceWith(imgRadar);

    // Populate recent test rows
    const tableBody = document.getElementById('pdfTestTable');
    const data = filterDataByPeriod(dashboardData.rawTestData, dashboardData.currentFilter).slice(0, 20);
    tableBody.innerHTML = '';

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="padding:8px; color:#6B7280;">No test data available</td></tr>`;
    } else {
        data.forEach(t => {
            const tr = document.createElement('tr');
            const stressDisplay = t.stressLevel !== undefined && t.stressLevel !== null ? t.stressLevel : 'N/A';
            tr.innerHTML = `
                <td style="padding:6px; border-bottom:1px solid #eee;">${t.date}</td>
                <td style="padding:6px; border-bottom:1px solid #eee;">${t.time}</td>
                <td style="padding:6px; border-bottom:1px solid #eee; text-align:right;">${t.moodScore}</td>
                <td style="padding:6px; border-bottom:1px solid #eee;">${t.emotionalState}</td>
                <td style="padding:6px; border-bottom:1px solid #eee; text-align:right;">${stressDisplay}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Generate simple AI insights (basic heuristics)
    const insightsEl = document.getElementById('pdfInsights');
    insightsEl.innerHTML = '';
    if (!hasTests) {
        insightsEl.textContent = 'No insights available — take tests to generate personalized insights.';
    } else {
        const avg = parseFloat(dashboardData.stats.avgMood) || 0;
        const stress = parseFloat(dashboardData.stats.avgStress) || (10 - avg);
        const insights = [];
        if (avg >= 8) insights.push('Overall mood is excellent in the selected period. Keep up the good routine.');
        if (avg >= 6 && avg < 8) insights.push('Overall mood is good. Consider small improvements like consistent sleep or exercise.');
        if (avg < 6) insights.push('Average mood is below desired levels. Consider daily check-ins and professional support if needed.');
        if (stress >= 6) insights.push('Stress levels are elevated — try breathing exercises or scheduled breaks.');
        if (dashboardData.rawTestData.length >= 7) insights.push('You have consistent data — trends are more reliable.');

        insights.forEach(i => {
            const p = document.createElement('p');
            p.style.margin = '6px 0';
            p.textContent = '• ' + i;
            insightsEl.appendChild(p);
        });
    }

    // Force display the element to ensure proper rendering
    element.style.display = 'block';
    element.style.visibility = 'visible';

    // Wait for images to load before exporting
    const imgs = element.querySelectorAll('img');
    console.log(`Found ${imgs.length} images to load`);
    
    const imgPromises = Array.from(imgs).map((img, idx) => new Promise(res => {
        console.log(`Image ${idx}: src=${img.src?.substring(0, 50)}...`);
        if (!img.src) {
            console.warn(`Image ${idx} has no src`);
            return res();
        }
        if (img.complete) {
            console.log(`Image ${idx} already complete`);
            return res();
        }
        
        const timeout = setTimeout(() => {
            console.warn(`Image ${idx} load timeout`);
            res();
        }, 3000);
        
        img.onload = () => {
            clearTimeout(timeout);
            console.log(`Image ${idx} loaded`);
            res();
        };
        img.onerror = (err) => {
            clearTimeout(timeout);
            console.warn(`Image ${idx} failed to load:`, err);
            res();
        };
    }));

    Promise.all(imgPromises).then(async () => {
        console.log('All images loaded, proceeding with export');
        
        // Wait a moment for DOM to stabilize
        await new Promise(r => setTimeout(r, 800));

        // Create a container positioned off-screen (invisible to user but still rendered)
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '210mm';
        container.style.zIndex = '99999';
        container.style.background = 'white';
        container.style.visibility = 'visible';
        
        // Clone the element for export
        const clone = element.cloneNode(true);
        clone.style.display = 'block';
        clone.style.visibility = 'visible';
        clone.style.position = 'relative';
        clone.style.width = '100%';
        container.appendChild(clone);
        document.body.appendChild(container);

        console.log('Container added to DOM, waiting for render...');
        
        // Wait for the clone to render in the DOM
        await new Promise(r => setTimeout(r, 1000));

        // Ensure fonts are ready (best-effort)
        if (document.fonts && document.fonts.ready) {
            try { await document.fonts.ready; } catch (e) { console.warn('Font loading failed', e); }
        }

        console.log('Starting PDF export...');
        
        // Perform export from the clone which is now visible
        try {
            await html2pdf().set({
                margin: 10,
                filename: 'MoodFlow_Report.pdf',
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: true
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).from(clone).save();
            
            console.log('PDF export successful!');
        } catch (err) {
            console.error('PDF export failed', err);
            alert('PDF export failed: ' + (err && err.message ? err.message : err));
        } finally {
            // Remove the visible container
            try { document.body.removeChild(container); } catch (e) {}
            
            // Hide original element again
            element.style.display = 'none';
        }
    });
}

function exportToCSV(data) {
    const headers = ['Date', 'Time', 'Mood Score', 'Emotional State', 'Stress Level', 'Duration'];
    const rows = data.map(d => [d.date, d.time, d.moodScore, d.emotionalState, d.stressLevel, d.duration]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.join(',') + '\n';
    });

    downloadFile(csv, 'moodflow-data.csv', 'text/csv');
}

function exportToJSON(data) {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'moodflow-data.json', 'application/json');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// DATA INTEGRATION API
/**
 * This function allows you to integrate your own dataset
 * Call this function with your data array to update the dashboard
 * 
 * Expected data format:
 * [
 *   {
 *     date: '2026-02-20',
 *     time: '10:30',
 *     moodScore: 8.5,
 *     emotionalState: 'Happy',
 *     stressLevel: 3,
 *     duration: 5,
 *     answers: [...]  // Optional: full test answers
 *   }
 * ]
 */
function integrateCustomData(customDataArray) {
    // Validate data format
    if (!Array.isArray(customDataArray)) {
        console.error('Data must be an array');
        return false;
    }

    // Update dashboard data
    dashboardData.rawTestData = customDataArray;

    // Recalculate everything
    calculateStats();
    updateStatCards();
    refreshAllCharts();
    populateTestHistory();

    console.log('✓ Data integrated successfully!');
    alert('✓ Your data has been integrated and the dashboard has been updated!');

    return true;
}

// Make it globally accessible for easy testing
window.integrateCustomData = integrateCustomData;


// UTILITY FUNCTIONS
function viewTestDetails(date) {
    // alert(`Detailed view for test on ${date} would open here.\nThis would show all question responses, insights, and recommendations.`);
    window.location.href = `test-details.html?date=${date}`;
}

// Close export menu when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('.export-menu')) {
        document.getElementById('exportMenu').classList.remove('show');
    }
});

// Navigation
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
      if (!this.href.includes('html')) {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
});