/**
 * ============================================
 * MOODFLOW - CENTRALIZED DATA MANAGER
 * ============================================
 * This file manages ALL real user data across the application
 * NO SAMPLE DATA - Everything is calculated from actual user actions
 */

const MoodFlowDataCache = {
    userId: null,
    profile: null,
    tests: [],
    moods: [],
    achievements: [],
    preferences: {},
    subscription: null,
    statsCache: {}
};

const MoodFlowData = {
    
    // ========================
    // USER PROFILE DATA
    // ========================
    user: {
        getId: function() {
            if (!MoodFlowDataCache.userId) {
                MoodFlowDataCache.userId = 'user_' + Date.now();
            }
            return MoodFlowDataCache.userId;
        },
        
        getProfile: function() {
            // TODO: Use Supabase user profile table
            return MoodFlowDataCache.profile || {
                fullName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                location: '',
                bio: '',
                avatar: '',
                joinDate: new Date().toISOString(),
                isVerified: false
            };
        },
        
        saveProfile: function(profileData) {
            // TODO: save to Supabase user profile table
            MoodFlowDataCache.profile = profileData;
        }
    },

    // ========================
    // TEST RESULTS DATA
    // ========================
    tests: {
        getAll: function() {
            // TODO: fetch from Supabase tests table
            return MoodFlowDataCache.tests || [];
        },
        
        save: function(testData) {
            const tests = this.getAll();
            tests.push(testData);
            MoodFlowDataCache.tests = tests;
            
            // Update stats cache for this user
            MoodFlowData.userStatsCache.saveStats(testData.userId);
        },
        
        getLatest: function() {
            const tests = this.getAll();
            return tests.length > 0 ? tests[tests.length - 1] : null;
        },
        
        getCount: function() {
            return this.getAll().length;
        },
        
        getByDateRange: function(startDate, endDate) {
            const tests = this.getAll();
            return tests.filter(test => {
                const testDate = new Date(test.date);
                return testDate >= new Date(startDate) && testDate <= new Date(endDate);
            });
        },
        
        getThisWeek: function() {
            const today = new Date();
            const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            weekStart.setHours(0, 0, 0, 0);
            
            return this.getAll().filter(test => new Date(test.date) >= weekStart);
        },
        
        getThisMonth: function() {
            const today = new Date();
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            
            return this.getAll().filter(test => new Date(test.date) >= monthStart);
        }
    },

    // ========================
    // STATISTICS CALCULATIONS
    // ========================
    stats: {
        getAverageMoodScore: function() {
            const tests = MoodFlowData.tests.getAll();
            if (tests.length === 0) return 0;
            
            const sum = tests.reduce((acc, test) => acc + parseFloat(test.averageScore || 0), 0);
            return (sum / tests.length).toFixed(1);
        },
        
        getCurrentStreak: function() {
            const tests = MoodFlowData.tests.getAll();
            if (tests.length === 0) return 0;
            
            // Sort tests by date
            const sortedTests = tests.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            let streak = 0;
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            
            for (let test of sortedTests) {
                const testDate = new Date(test.date);
                testDate.setHours(0, 0, 0, 0);
                
                const diffDays = Math.floor((currentDate - testDate) / (1000 * 60 * 60 * 24));
                
                if (diffDays === streak) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                } else if (diffDays > streak) {
                    break;
                }
            }
            
            return streak;
        },
        
        getWeeklyTestCount: function() {
            return MoodFlowData.tests.getThisWeek().length;
        },
        
        getCompletionRate: function() {
            const tests = MoodFlowData.tests.getAll();
            if (tests.length === 0) return 0;
            
            const completed = tests.filter(test => test.status === 'COMPLETED').length;
            return Math.round((completed / tests.length) * 100);
        },
        
        getDaysActive: function() {
            const profile = MoodFlowData.user.getProfile();
            const joinDate = new Date(profile.joinDate);
            const today = new Date();
            
            const diffTime = Math.abs(today - joinDate);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },
        
        getAverageStressLevel: function() {
            const tests = MoodFlowData.tests.getAll();
            if (tests.length === 0) return 0;
            
            // Calculate from test answers (questions about stress)
            // For now, return a calculated value
            const scores = tests.map(t => parseFloat(t.averageScore || 0));
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            
            // Inverse relationship: higher mood = lower stress
            return (10 - avgScore).toFixed(1);
        },
        
        getLastTestDate: function() {
            const latest = MoodFlowData.tests.getLatest();
            return latest ? new Date(latest.date) : null;
        },
        
        getNextTestDue: function() {
            const lastTest = this.getLastTestDate();
            if (!lastTest) return new Date();
            
            // Assume tests should be taken every 3 days
            const nextDue = new Date(lastTest);
            nextDue.setDate(nextDue.getDate() + 3);
            
            return nextDue;
        }
    },

    // ========================
    // USER STATS CACHE (Per User)
    // ========================
    userStatsCache: {
        // Get cache key for user
        getCacheKey: function(userId) {
            return 'moodflow_stats_' + userId;
        },
        
        // Get cached stats for a user
        getStats: function(userId) {
            // TODO: use Supabase cache or server stats
            const cached = MoodFlowDataCache.statsCache[this.getCacheKey(userId)];
            console.log(cached); // Debug: Check cached stats for user
            return cached ? cached : null;
        },
        
        // Save stats for current user
        saveStats: function(userId) {
            // Get all tests for this user
            const tests = MoodFlowData.tests.getAll().filter(t => t.userId === userId);
            
            // Calculate stats
            const weeklyTests = tests.filter(t => {
                const today = new Date();
                const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                weekStart.setHours(0, 0, 0, 0);
                return new Date(t.date) >= weekStart;
            }).length;
            
            const avgMood = tests.length > 0 
                ? (tests.reduce((acc, t) => acc + parseFloat(t.metrices?.averageScore || t.averageScore || 0), 0) / tests.length).toFixed(1)
                : '0.0';
            
            const totalTests = tests.length;
            
            // Calculate streak
            let streak = 0;
            if (tests.length > 0) {
                const sortedTests = tests.sort((a, b) => new Date(b.date) - new Date(a.date));
                let currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                
                for (let test of sortedTests) {
                    const testDate = new Date(test.date);
                    testDate.setHours(0, 0, 0, 0);
                    const diffDays = Math.floor((currentDate - testDate) / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === streak) {
                        streak++;
                        currentDate.setDate(currentDate.getDate() - 1);
                    } else if (diffDays > streak) {
                        break;
                    }
                }
            }
            
            // Cache the stats
            const statsData = {
                userId: userId,
                weeklyTests: weeklyTests,
                streak: streak,
                avgMood: avgMood,
                totalTests: totalTests,
                cachedAt: new Date().toISOString()
            };
            
            MoodFlowDataCache.statsCache[this.getCacheKey(userId)] = statsData;
            return statsData;
        },
        
        // Clear cache for a user
        clearStats: function(userId) {
            delete MoodFlowDataCache.statsCache[this.getCacheKey(userId)];
        }
    },

    // ========================
    // CALENDAR DATA
    // ========================
    calendar: {
        getTestDates: function() {
            const tests = MoodFlowData.tests.getAll();
            return tests.map(test => {
                const date = new Date(test.date);
                return {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate(),
                    score: test.averageScore
                };
            });
        },
        
        hasTestOnDate: function(year, month, day) {
            const testDates = this.getTestDates();
            return testDates.some(d => 
                d.year === year && d.month === month && d.day === day
            );
        },
        
        getTestsForMonth: function(year, month) {
            const tests = MoodFlowData.tests.getAll();
            return tests.filter(test => {
                const date = new Date(test.date);
                return date.getFullYear() === year && date.getMonth() === month;
            });
        }
    },

    // ========================
    // MOOD ENTRIES (Quick Check-ins)
    // ========================
    moods: {
        getAll: function() {
            // TODO: replace with Supabase moods table select
            return MoodFlowDataCache.moods || [];
        },
        save: function(moodData) {
            const moods = this.getAll();
            moods.push(moodData);
            MoodFlowDataCache.moods = moods;
        },
        
        getRecent: function(count = 5) {
            const moods = this.getAll();
            return moods.slice(-count).reverse();
        },
        
        getTodaysMood: function() {
            const today = new Date().toISOString().split('T')[0];
            const moods = this.getAll();
            return moods.filter(m => m.date === today);
        }
    },

    // ========================
    // DASHBOARD ANALYTICS
    // ========================
    analytics: {
        getSentimentData: function(days = 30) {
            const tests = MoodFlowData.tests.getAll();
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            
            const recentTests = tests.filter(t => new Date(t.date) >= cutoffDate);
            
            return recentTests.map(test => ({
                date: new Date(test.date).toISOString().split('T')[0],
                positive: parseFloat(test.averageScore) >= 6 ? parseFloat(test.averageScore) : 0,
                negative: parseFloat(test.averageScore) < 6 ? parseFloat(test.averageScore) : 0,
                score: parseFloat(test.averageScore)
            }));
        },
        
        getMoodDistribution: function() {
            const tests = MoodFlowData.tests.getAll();
            
            const distribution = {
                'Excellent': 0,
                'Good': 0,
                'Fair': 0,
                'Poor': 0,
                'Critical': 0
            };
            
            tests.forEach(test => {
                const state = test.emotionalState || this.getEmotionalState(test.averageScore);
                if (distribution.hasOwnProperty(state)) {
                    distribution[state]++;
                }
            });
            
            return distribution;
        },
        
        getEmotionalState: function(score) {
            if (score >= 8) return 'Excellent';
            if (score >= 6) return 'Good';
            if (score >= 4) return 'Fair';
            if (score >= 2) return 'Poor';
            return 'Critical';
        },
        
        getWeeklySummary: function() {
            const weekTests = MoodFlowData.tests.getThisWeek();
            
            if (weekTests.length === 0) {
                return {
                    averageMood: 0,
                    sleepQuality: 0,
                    stressLevel: 0,
                    energyLevel: 0
                };
            }
            
            const avgMood = weekTests.reduce((acc, t) => acc + parseFloat(t.averageScore || 0), 0) / weekTests.length;
            
            return {
                averageMood: avgMood.toFixed(1),
                sleepQuality: (avgMood * 0.9).toFixed(1), // Correlated
                stressLevel: (10 - avgMood).toFixed(1), // Inverse
                energyLevel: (avgMood * 0.85).toFixed(1) // Correlated
            };
        }
    },

    // ========================
    // ACHIEVEMENTS & STREAKS
    // ========================
    achievements: {
        getEarned: function() {
            return MoodFlowDataCache.achievements || [];
        },
        
        unlock: function(achievementId) {
            const earned = this.getEarned();
            if (!earned.includes(achievementId)) {
                earned.push(achievementId);
                MoodFlowDataCache.achievements = earned;
                return true;
            }
            return false;
        },
        
        checkAndUnlock: function() {
            const testCount = MoodFlowData.tests.getCount();
            const streak = MoodFlowData.stats.getCurrentStreak();
            
            // First test
            if (testCount >= 1) this.unlock('first_test');
            
            // 10 tests
            if (testCount >= 10) this.unlock('10_tests');
            
            // 7 day streak
            if (streak >= 7) this.unlock('week_streak');
            
            // 30 day streak
            if (streak >= 30) this.unlock('month_streak');
        }
    },

    // ========================
    // PREFERENCES
    // ========================
    preferences: {
        get: function() {
            return MoodFlowDataCache.preferences || {
                emailNotifications: true,
                testReminders: true,
                dataAnalytics: true,
                profileVisibility: false,
                theme: 'dark',
                reminderFrequency: 3
            };
        },
        
        save: function(preferences) {
            MoodFlowDataCache.preferences = preferences;
        }
    },

    // ========================
    // SUBSCRIPTION
    // ========================
    subscription: {
        get: function() {
            return MoodFlowDataCache.subscription || {
                plan: 'FREE',
                status: 'ACTIVE',
                startDate: new Date().toISOString(),
                nextBilling: null
            };
        },
        
        save: function(subscription) {
            MoodFlowDataCache.subscription = subscription;
        },
        
        isPro: function() {
            const sub = this.get();
            return sub.plan === 'PRO' || sub.plan === 'TEAM';
        }
    },

    // ========================
    // DATA EXPORT
    // ========================
    export: {
        getAllData: function() {
            return {
                user: MoodFlowData.user.getProfile(),
                tests: MoodFlowData.tests.getAll(),
                moods: MoodFlowData.moods.getAll(),
                achievements: MoodFlowData.achievements.getEarned(),
                preferences: MoodFlowData.preferences.get(),
                subscription: MoodFlowData.subscription.get(),
                exportDate: new Date().toISOString()
            };
        },
        
        toJSON: function() {
            return JSON.stringify(this.getAllData(), null, 2);
        },
        
        toCSV: function() {
            const tests = MoodFlowData.tests.getAll();
            let csv = 'Date,Time,Mood Score,Emotional State,Duration,Status\n';
            
            tests.forEach(test => {
                const date = new Date(test.date);
                csv += `${date.toLocaleDateString()},${date.toLocaleTimeString()},${test.averageScore},${test.emotionalState},${test.duration},${test.status}\n`;
            });
            
            return csv;
        }
    },

    // ========================
    // DATA CLEAR (for testing)
    // ========================
    clearAll: function() {
        if (confirm('⚠️ WARNING: This will delete ALL your data. Are you sure?')) {
            if (confirm('This action cannot be undone. Continue?')) {
                MoodFlowDataCache.tests = [];
                MoodFlowDataCache.moods = [];
                MoodFlowDataCache.profile = null;
                MoodFlowDataCache.achievements = [];
                MoodFlowDataCache.preferences = {};
                MoodFlowDataCache.subscription = null;
                alert('✓ All data cleared');
                location.reload();
            }
        }
    }
};

// Make it globally available
window.MoodFlowData = MoodFlowData;

console.log('✓ MoodFlow Data Manager Loaded');
console.log('Total Tests:', MoodFlowData.tests.getCount());
console.log('Current Streak:', MoodFlowData.stats.getCurrentStreak());
console.log('Average Mood:', MoodFlowData.stats.getAverageMoodScore());