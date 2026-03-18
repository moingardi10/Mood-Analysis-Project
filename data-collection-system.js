/**
 * ============================================
 * MoodLens - ADVANCED DATA COLLECTION SYSTEM
 * ============================================
 * Collects detailed test responses from multiple users
 * Stores everything for research and analysis
 */

const DataCollectionSystem = {

    // ========================
    // SESSION MANAGEMENT
    // ========================
    session: {
        // Generate unique session ID for each user/teacher
        generateSessionId: function () {
            return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        // Start new session for a user
        startSession: function (userData) {
            const sessionId = this.generateSessionId();
            const session = {
                sessionId: sessionId,
                userData: userData,
                startTime: new Date().toISOString(),
                userAgent: navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };

            // TODO: Save session to Supabase or server-side state
            this.currentSession = session;
            return sessionId;
        },

        getCurrentSession: function () {
            // TODO: Read session from Supabase if needed
            return this.currentSession || null;
        }
    },

    // ========================
    // DETAILED RESPONSE STORAGE
    // ========================
    responses: {
        // Store each individual question response with metadata
        recordResponse: function (questionData) {
            const responses = this.getAll();

            const responseRecord = {
                responseId: 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                sessionId: DataCollectionSystem.session.getCurrentSession()?.sessionId,
                timestamp: new Date().toISOString(),
                questionId: questionData.questionId,
                questionText: questionData.questionText,
                questionCategory: questionData.category,
                selectedOption: questionData.selectedOption,
                optionValue: questionData.optionValue,
                optionLabel: questionData.optionLabel,
                timeSpentSeconds: questionData.timeSpent,
                questionIndex: questionData.questionIndex
            };

            responses.push(responseRecord);
            this._responses = responses;

            return responseRecord;
        },

        getAll: function () {
            // TODO: Use Supabase responses table
            return this._responses || [];
        },

        getBySession: function (sessionId) {
            return this.getAll().filter(r => r.sessionId === sessionId);
        }
    },

    // ========================
    // COMPLETE TEST STORAGE
    // ========================
    tests: {
        // Store complete test with all details
        saveCompleteTest: function (testData) {
            const allTests = this.getAll();

            const session = DataCollectionSystem.session.getCurrentSession();

            const completeTest = {
                // Identification
                testId: 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                sessionId: session?.sessionId,

                // User Information
                userInfo: {
                    userId: testData.userId || session?.userData?.userId,
                    userName: testData.userName || session?.userData?.name,
                    userEmail: testData.userEmail || session?.userData?.email,
                    userRole: testData.userRole || session?.userData?.role || 'teacher',
                    department: testData.department || session?.userData?.department,
                    institution: testData.institution || session?.userData?.institution,
                    age: testData.age || session?.userData?.age,
                    gender: testData.gender || session?.userData?.gender
                },

                // Test Timing
                timing: {
                    startTime: testData.startTime,
                    endTime: testData.endTime,
                    totalDurationSeconds: testData.durationSeconds,
                    totalDurationMinutes: Math.round(testData.durationSeconds / 60),
                    dateCompleted: new Date().toISOString(),
                    dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
                    timeOfDay: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                },

                // All Answers (Complete Question-by-Question)
                // answers: testData.answers.map((answer, index) => ({
                //     questionNumber: index + 1,
                //     questionId: testData.questions[index].id,
                //     questionText: testData.questions[index].question,
                //     category: testData.questions[index].category,
                //     selectedValue: answer,
                //     selectedOption: testData.questions[index].options.find(o => o.value === answer),
                //     timeSpentOnQuestion: testData.timePerQuestion ? testData.timePerQuestion[index] : null
                // })),
                answers: Object.fromEntries(
                    testData.answers.map((answer, index) => [
                        "Q" + (index + 1),
                        {
                            questionNumber: index + 1,
                            questionId: testData.questions[index].id,
                            questionText: testData.questions[index].question,
                            category: testData.questions[index].category,
                            selectedValue: answer,
                            selectedOption: testData.questions[index].options.find(o => o.value === answer),
                            timeSpentOnQuestion: testData.timePerQuestion ? testData.timePerQuestion[index] : null
                        }
                    ])
                ),

                // Calculated Scores
                scores: {
                    totalScore: testData.totalScore,
                    averageScore: testData.averageScore,
                    percentageScore: ((testData.totalScore / (testData.answers.length * 5)) * 100).toFixed(1),

                    // Category-wise scores
                    categoryScores: this.calculateCategoryScores(testData.answers, testData.questions)
                },

                // Analysis Results
                analysis: {
                    emotionalState: testData.emotionalState,
                    stressLevel: testData.stressLevel,
                    energyLevel: testData.energyLevel,
                    wellbeing: testData.wellbeing,
                    moodClassification: this.classifyMood(testData.averageScore)
                },

                // Device & Browser Info
                metadata: {
                    userAgent: navigator.userAgent,
                    browser: this.getBrowserInfo(),
                    device: this.getDeviceInfo(),
                    screenSize: `${window.screen.width}x${window.screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    language: navigator.language
                },

                // Status
                status: 'COMPLETED',
                version: '1.0'
            };

            allTests.push(completeTest);
            this._researchData = allTests;

            console.log('✓ Test data saved for research:', completeTest.testId);
            return completeTest;
        },

        getAll: function () {
            // TODO: Use Supabase research test storage instead
            return this._researchData || [];
        },

        getByUser: function (userId) {
            return this.getAll().filter(t => t.userInfo.userId === userId);
        },

        getByDateRange: function (startDate, endDate) {
            const tests = this.getAll();
            return tests.filter(t => {
                const testDate = new Date(t.timing.dateCompleted);
                return testDate >= new Date(startDate) && testDate <= new Date(endDate);
            });
        },

        calculateCategoryScores: function (answers, questions) {
            const categories = {};

            questions.forEach((q, index) => {
                const category = q.category;
                if (!categories[category]) {
                    categories[category] = {
                        totalScore: 0,
                        count: 0,
                        questions: []
                    };
                }

                categories[category].totalScore += answers[index];
                categories[category].count += 1;
                categories[category].questions.push({
                    questionId: q.id,
                    questionText: q.question,
                    score: answers[index]
                });
            });

            // Calculate averages
            Object.keys(categories).forEach(cat => {
                categories[cat].average = (categories[cat].totalScore / categories[cat].count).toFixed(2);
            });

            return categories;
        },

        classifyMood: function (score) {
            if (score >= 8) return 'Very Positive';
            if (score >= 6.5) return 'Positive';
            if (score >= 5) return 'Neutral';
            if (score >= 3.5) return 'Somewhat Negative';
            return 'Negative';
        },

        getBrowserInfo: function () {
            const ua = navigator.userAgent;
            if (ua.indexOf('Chrome') > -1) return 'Chrome';
            if (ua.indexOf('Firefox') > -1) return 'Firefox';
            if (ua.indexOf('Safari') > -1) return 'Safari';
            if (ua.indexOf('Edge') > -1) return 'Edge';
            return 'Other';
        },

        getDeviceInfo: function () {
            const ua = navigator.userAgent;
            if (/mobile/i.test(ua)) return 'Mobile';
            if (/tablet/i.test(ua)) return 'Tablet';
            return 'Desktop';
        }
    },

    // ========================
    // DATA EXPORT FUNCTIONS
    // ========================
    export: {
        // Export all data as JSON (for backup/analysis)
        exportAllJSON: function () {
            const allData = {
                exportInfo: {
                    exportDate: new Date().toISOString(),
                    totalTests: DataCollectionSystem.tests.getAll().length,
                    totalResponses: DataCollectionSystem.responses.getAll().length,
                    dataVersion: '1.0'
                },
                tests: DataCollectionSystem.tests.getAll(),
                responses: DataCollectionSystem.responses.getAll()
            };

            return JSON.stringify(allData, null, 2);
        },

        // Export as CSV for Excel/Google Sheets analysis
        exportTestsCSV: function () {
            const tests = DataCollectionSystem.tests.getAll();

            if (tests.length === 0) {
                return 'No data to export';
            }

            // Headers
            let csv = 'Test ID,Session ID,User ID,User Name,Email,Role,Department,Institution,Age,Gender,';
            csv += 'Date Completed,Day of Week,Time of Day,Duration (minutes),';
            csv += 'Total Score,Average Score,Percentage Score,';
            csv += 'Emotional State,Stress Level,Energy Level,Wellbeing,Mood Classification,';
            csv += 'Browser,Device,Timezone\n';

            // Data rows
            tests.forEach(test => {
                csv += `"${test.testId}",`;
                csv += `"${test.sessionId}",`;
                csv += `"${test.userInfo.userId || 'N/A'}",`;
                csv += `"${test.userInfo.userName || 'N/A'}",`;
                csv += `"${test.userInfo.userEmail || 'N/A'}",`;
                csv += `"${test.userInfo.userRole || 'N/A'}",`;
                csv += `"${test.userInfo.department || 'N/A'}",`;
                csv += `"${test.userInfo.institution || 'N/A'}",`;
                csv += `"${test.userInfo.age || 'N/A'}",`;
                csv += `"${test.userInfo.gender || 'N/A'}",`;
                csv += `"${test.timing.dateCompleted}",`;
                csv += `"${test.timing.dayOfWeek}",`;
                csv += `"${test.timing.timeOfDay}",`;
                csv += `${test.timing.totalDurationMinutes},`;
                csv += `${test.scores.totalScore},`;
                csv += `${test.scores.averageScore},`;
                csv += `${test.scores.percentageScore},`;
                csv += `"${test.analysis.emotionalState}",`;
                csv += `"${test.analysis.stressLevel}",`;
                csv += `"${test.analysis.energyLevel}",`;
                csv += `"${test.analysis.wellbeing}",`;
                csv += `"${test.analysis.moodClassification}",`;
                csv += `"${test.metadata.browser}",`;
                csv += `"${test.metadata.device}",`;
                csv += `"${test.metadata.timezone}"\n`;
            });

            return csv;
        },

        // Export detailed responses (question-by-question)
        exportDetailedResponsesCSV: function () {
            const tests = DataCollectionSystem.tests.getAll();

            if (tests.length === 0) {
                return 'No data to export';
            }

            // Headers
            let csv = 'Test ID,User ID,User Name,Email,Role,Institution,Question Number,Question ID,Question Text,Category,';
            csv += 'Selected Option Number,Selected Value,Selected Label,Selected Description,Date Completed\n';

            // Data rows
            tests.forEach(test => {
                Object.values(test.answers).forEach(answer => {
                    csv += `"${test.testId}",`;
                    csv += `"${test.userInfo.userId || 'N/A'}",`;
                    csv += `"${test.userInfo.userName || 'N/A'}",`;
                    csv += `"${test.userInfo.userEmail || 'N/A'}",`;
                    csv += `"${test.userInfo.userRole || 'N/A'}",`;
                    csv += `"${test.userInfo.institution || 'N/A'}",`;
                    csv += `Q${answer.questionNumber},`;
                    csv += `"${answer.questionId}",`;
                    csv += `"${answer.questionText.replace(/"/g, '""')}",`;
                    csv += `"${answer.category}",`;
                    csv += `Option ${answer.selectedValue},`;
                    csv += `${answer.selectedValue},`;
                    csv += `"${answer.selectedOption?.label || 'N/A'}",`;
                    csv += `"${answer.selectedOption?.description?.replace(/"/g, '""') || 'N/A'}",`;
                    csv += `"${test.timing.dateCompleted}"\n`;
                });
            });

            return csv;
        },

        // Export simple Q&A format (EXACTLY what you asked for: Q1→3, Q2→1, etc.)
        exportSimpleQAFormat: function () {
            const tests = DataCollectionSystem.tests.getAll();

            if (tests.length === 0) {
                return 'No data to export';
            }

            // Headers - Q1, Q2, Q3... Q20
            let csv = 'Test ID,User Name,Email,Role,Institution,Date,';
            const maxQuestions = 20; // Assuming 20 questions
            for (let i = 1; i <= maxQuestions; i++) {
                csv += `Q${i},`;
            }
            csv += 'Total Score,Average Score\n';

            // Data rows
            tests.forEach(test => {
                csv += `"${test.testId}",`;
                csv += `"${test.userInfo.userName || 'N/A'}",`;
                csv += `"${test.userInfo.userEmail || 'N/A'}",`;
                csv += `"${test.userInfo.userRole || 'N/A'}",`;
                csv += `"${test.userInfo.institution || 'N/A'}",`;
                csv += `"${new Date(test.timing.dateCompleted).toLocaleDateString()}",`;

                // Add each answer (Q1→3, Q2→1, etc.)
                for (let i = 1; i <= maxQuestions; i++) {
                    const answer = test.answers["Q" + i];
                    csv += answer ? `${answer.selectedValue},` : 'N/A,';
                }

                csv += `${test.scores.totalScore},`;
                csv += `${test.scores.averageScore}\n`;
            });

            return csv;
        },

        // Export category analysis
        exportCategoryAnalysisCSV: function () {
            const tests = DataCollectionSystem.tests.getAll();

            if (tests.length === 0) {
                return 'No data to export';
            }

            let csv = 'Test ID,User ID,User Name,Category,Average Score,Total Score,Question Count,Date\n';

            tests.forEach(test => {
                Object.keys(test.scores.categoryScores).forEach(category => {
                    const catData = test.scores.categoryScores[category];
                    csv += `"${test.testId}",`;
                    csv += `"${test.userInfo.userId || 'N/A'}",`;
                    csv += `"${test.userInfo.userName || 'N/A'}",`;
                    csv += `"${category}",`;
                    csv += `${catData.average},`;
                    csv += `${catData.totalScore},`;
                    csv += `${catData.count},`;
                    csv += `"${test.timing.dateCompleted}"\n`;
                });
            });

            return csv;
        },

        // Download file helper
        downloadFile: function (content, filename, type) {
            const blob = new Blob([content], { type: type });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        },

        // Easy download functions
        downloadAllData: function () {
            const json = this.exportAllJSON();
            const timestamp = new Date().toISOString().split('T')[0];
            this.downloadFile(json, `MoodLens-complete-data-${timestamp}.json`, 'application/json');
            alert('✓ Complete data exported as JSON');
        },

        downloadTestSummary: function () {
            const csv = this.exportTestsCSV();
            const timestamp = new Date().toISOString().split('T')[0];
            this.downloadFile(csv, `MoodLens-test-summary-${timestamp}.csv`, 'text/csv');
            alert('✓ Test summary exported as CSV');
        },

        downloadDetailedResponses: function () {
            const csv = this.exportDetailedResponsesCSV();
            const timestamp = new Date().toISOString().split('T')[0];
            this.downloadFile(csv, `MoodLens-detailed-responses-${timestamp}.csv`, 'text/csv');
            alert('✓ Detailed responses exported as CSV');
        },

        downloadSimpleQA: function () {
            const csv = this.exportSimpleQAFormat();
            const timestamp = new Date().toISOString().split('T')[0];
            this.downloadFile(csv, `MoodLens-simple-qa-${timestamp}.csv`, 'text/csv');
            alert('✓ Simple Q&A format exported (Q1→3, Q2→1, etc.)');
        },

        downloadCategoryAnalysis: function () {
            const csv = this.exportCategoryAnalysisCSV();
            const timestamp = new Date().toISOString().split('T')[0];
            this.downloadFile(csv, `MoodLens-category-analysis-${timestamp}.csv`, 'text/csv');
            alert('✓ Category analysis exported as CSV');
        },

        // Export everything at once
        downloadAllFormats: function () {
            this.downloadAllData();
            setTimeout(() => this.downloadTestSummary(), 500);
            setTimeout(() => this.downloadDetailedResponses(), 1000);
            setTimeout(() => this.downloadSimpleQA(), 1500);
            setTimeout(() => this.downloadCategoryAnalysis(), 2000);

            setTimeout(() => {
                alert(`✓ All data exported!\n\nFiles downloaded:\n- Complete JSON backup\n- Test summary CSV\n- Detailed responses CSV\n- Simple Q&A format CSV (Q1→3, Q2→1...)\n- Category analysis CSV`);
            }, 2500);
        }
    },

    // ========================
    // STATISTICS & REPORTING
    // ========================
    stats: {
        getTotalTests: function () {
            return DataCollectionSystem.tests.getAll().length;
        },

        getTotalUsers: function () {
            const tests = DataCollectionSystem.tests.getAll();
            const uniqueUsers = new Set(tests.map(t => t.userInfo.userId).filter(id => id));
            return uniqueUsers.size;
        },

        getAverageCompletionTime: function () {
            const tests = DataCollectionSystem.tests.getAll();
            if (tests.length === 0) return 0;

            const totalMinutes = tests.reduce((sum, t) => sum + t.timing.totalDurationMinutes, 0);
            return (totalMinutes / tests.length).toFixed(1);
        },

        getOverallAverageScore: function () {
            const tests = DataCollectionSystem.tests.getAll();
            if (tests.length === 0) return 0;

            const totalScore = tests.reduce((sum, t) => sum + parseFloat(t.scores.averageScore), 0);
            return (totalScore / tests.length).toFixed(2);
        },

        getMoodDistribution: function () {
            const tests = DataCollectionSystem.tests.getAll();
            const distribution = {
                'Very Positive': 0,
                'Positive': 0,
                'Neutral': 0,
                'Somewhat Negative': 0,
                'Negative': 0
            };

            tests.forEach(t => {
                const mood = t.analysis.moodClassification;
                if (distribution.hasOwnProperty(mood)) {
                    distribution[mood]++;
                }
            });

            return distribution;
        }
    },

    // ========================
    // DATA MANAGEMENT
    // ========================
    management: {
        // Clear all research data (with confirmation)
        clearAllData: function () {
            const count = DataCollectionSystem.tests.getAll().length;

            if (confirm(`⚠️ WARNING: This will permanently delete all ${count} test records.\n\nAre you sure? This cannot be undone!`)) {
                if (confirm('FINAL CONFIRMATION: Delete all research data?')) {
                    this._researchData = [];
                    this.responses._responses = [];
                    this.session.currentSession = null;
                    alert('✓ All research data has been cleared');
                    return true;
                }
            }
            return false;
        },

        // Import data from JSON file
        importData: function (jsonData) {
            try {
                const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

                if (data.tests && Array.isArray(data.tests)) {
                    this._researchData = data.tests;
                    alert(`✓ Imported ${data.tests.length} test records`);
                    return true;
                }
            } catch (error) {
                alert('✗ Error importing data: ' + error.message);
                return false;
            }
        },

        // Get storage size
        getStorageSize: function () {
            // Data is now in-memory and not persisted to localStorage
            return 'N/A';
        }
    }
};

// Make globally available
window.DataCollectionSystem = DataCollectionSystem;

console.log('✓ Data Collection System Loaded');
console.log('Total Collected Tests:', DataCollectionSystem.stats.getTotalTests());
console.log('Total Unique Users:', DataCollectionSystem.stats.getTotalUsers());
console.log('Storage Used:', DataCollectionSystem.management.getStorageSize());
