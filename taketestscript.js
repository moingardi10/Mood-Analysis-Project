// Dummy dataset of 20 questions (Replace with your actual dataset later)
const questions = [
    {
        id: 1,
        question: "How often do you feel happy and content with your life?",
        category: "emotional_wellbeing",
        options: [
            { value: 5, label: "Always", description: "I feel happy and content most of the time" },
            { value: 4, label: "Often", description: "I frequently feel positive and satisfied" },
            { value: 3, label: "Sometimes", description: "My happiness varies throughout the week" },
            { value: 2, label: "Rarely", description: "I occasionally feel content" },
            { value: 1, label: "Never", description: "I struggle to feel happy or satisfied" }
        ]
    },
    {
        id: 2,
        question: "How well do you handle stress in your daily life?",
        category: "stress_management",
        options: [
            { value: 5, label: "Very Well", description: "I manage stress effectively and stay calm" },
            { value: 4, label: "Well", description: "I handle most stressful situations adequately" },
            { value: 3, label: "Moderately", description: "Stress affects me but I can cope" },
            { value: 2, label: "Poorly", description: "Stress often overwhelms me" },
            { value: 1, label: "Very Poorly", description: "I struggle significantly with stress" }
        ]
    },
    {
        id: 3,
        question: "How energetic do you feel throughout the day?",
        category: "energy_level",
        options: [
            { value: 5, label: "Very Energetic", description: "I have abundant energy all day long" },
            { value: 4, label: "Energetic", description: "I feel good energy most of the day" },
            { value: 3, label: "Moderate Energy", description: "My energy fluctuates during the day" },
            { value: 2, label: "Low Energy", description: "I often feel tired and drained" },
            { value: 1, label: "Exhausted", description: "I constantly feel fatigued" }
        ]
    },
    {
        id: 4,
        question: "How satisfied are you with your sleep quality?",
        category: "sleep_quality",
        options: [
            { value: 5, label: "Excellent", description: "I sleep deeply and wake up refreshed" },
            { value: 4, label: "Good", description: "I generally sleep well" },
            { value: 3, label: "Fair", description: "My sleep is inconsistent" },
            { value: 2, label: "Poor", description: "I struggle to get quality sleep" },
            { value: 1, label: "Very Poor", description: "I have severe sleep problems" }
        ]
    },
    {
        id: 5,
        question: "How often do you feel anxious or worried?",
        category: "anxiety_level",
        options: [
            { value: 1, label: "Always", description: "Anxiety dominates my daily life" },
            { value: 2, label: "Often", description: "I frequently feel anxious" },
            { value: 3, label: "Sometimes", description: "Occasional anxiety that I can manage" },
            { value: 4, label: "Rarely", description: "Anxiety is uncommon for me" },
            { value: 5, label: "Never", description: "I feel calm and relaxed" }
        ]
    },
    {
        id: 6,
        question: "How confident do you feel in your abilities?",
        category: "self_confidence",
        options: [
            { value: 5, label: "Very Confident", description: "I believe strongly in myself" },
            { value: 4, label: "Confident", description: "I trust my abilities" },
            { value: 3, label: "Somewhat Confident", description: "My confidence varies" },
            { value: 2, label: "Not Very Confident", description: "I often doubt myself" },
            { value: 1, label: "Not Confident", description: "I struggle with self-doubt" }
        ]
    },
    {
        id: 7,
        question: "How connected do you feel to others?",
        category: "social_connection",
        options: [
            { value: 5, label: "Very Connected", description: "I have strong, meaningful relationships" },
            { value: 4, label: "Connected", description: "I feel good about my relationships" },
            { value: 3, label: "Somewhat Connected", description: "I have some connections but want more" },
            { value: 2, label: "Disconnected", description: "I often feel isolated" },
            { value: 1, label: "Very Disconnected", description: "I feel very lonely" }
        ]
    },
    {
        id: 8,
        question: "How motivated are you to achieve your goals?",
        category: "motivation",
        options: [
            { value: 5, label: "Highly Motivated", description: "I'm driven and focused on my goals" },
            { value: 4, label: "Motivated", description: "I actively work toward my goals" },
            { value: 3, label: "Somewhat Motivated", description: "My motivation fluctuates" },
            { value: 2, label: "Unmotivated", description: "I struggle to stay motivated" },
            { value: 1, label: "Very Unmotivated", description: "I find it hard to care about goals" }
        ]
    },
    {
        id: 9,
        question: "How often do you engage in activities you enjoy?",
        category: "life_satisfaction",
        options: [
            { value: 5, label: "Daily", description: "I make time for enjoyable activities every day" },
            { value: 4, label: "Several Times a Week", description: "I regularly do things I love" },
            { value: 3, label: "Weekly", description: "I occasionally enjoy my hobbies" },
            { value: 2, label: "Rarely", description: "I seldom have time for enjoyment" },
            { value: 1, label: "Never", description: "I don't engage in enjoyable activities" }
        ]
    },
    {
        id: 10,
        question: "How well do you cope with changes or unexpected events?",
        category: "resilience",
        options: [
            { value: 5, label: "Very Well", description: "I adapt easily to change" },
            { value: 4, label: "Well", description: "I handle change reasonably well" },
            { value: 3, label: "Moderately", description: "Change is challenging but manageable" },
            { value: 2, label: "Poorly", description: "Change is very difficult for me" },
            { value: 1, label: "Very Poorly", description: "Change severely impacts me" }
        ]
    },
    {
        id: 11,
        question: "How satisfied are you with your work or daily activities?",
        category: "work_satisfaction",
        options: [
            { value: 5, label: "Very Satisfied", description: "I find my work fulfilling and meaningful" },
            { value: 4, label: "Satisfied", description: "I'm generally happy with what I do" },
            { value: 3, label: "Neutral", description: "My work is okay, neither good nor bad" },
            { value: 2, label: "Dissatisfied", description: "I'm unhappy with my current situation" },
            { value: 1, label: "Very Dissatisfied", description: "I'm very unhappy with what I do" }
        ]
    },
    {
        id: 12,
        question: "How often do you experience mood swings?",
        category: "emotional_stability",
        options: [
            { value: 1, label: "Very Frequently", description: "My mood changes constantly" },
            { value: 2, label: "Frequently", description: "I have regular mood fluctuations" },
            { value: 3, label: "Sometimes", description: "Occasional mood changes" },
            { value: 4, label: "Rarely", description: "My mood is generally stable" },
            { value: 5, label: "Never", description: "I maintain emotional balance" }
        ]
    },
    {
        id: 13,
        question: "How comfortable are you expressing your emotions?",
        category: "emotional_expression",
        options: [
            { value: 5, label: "Very Comfortable", description: "I freely express how I feel" },
            { value: 4, label: "Comfortable", description: "I can express emotions when needed" },
            { value: 3, label: "Somewhat Comfortable", description: "I express some emotions" },
            { value: 2, label: "Uncomfortable", description: "I struggle to share my feelings" },
            { value: 1, label: "Very Uncomfortable", description: "I cannot express my emotions" }
        ]
    },
    {
        id: 14,
        question: "How optimistic do you feel about your future?",
        category: "optimism",
        options: [
            { value: 5, label: "Very Optimistic", description: "I'm excited about what's ahead" },
            { value: 4, label: "Optimistic", description: "I have positive expectations" },
            { value: 3, label: "Neutral", description: "I'm uncertain about the future" },
            { value: 2, label: "Pessimistic", description: "I worry about what's coming" },
            { value: 1, label: "Very Pessimistic", description: "I feel hopeless about the future" }
        ]
    },
    {
        id: 15,
        question: "How often do you feel physically healthy and well?",
        category: "physical_health",
        options: [
            { value: 5, label: "Always", description: "I feel physically great" },
            { value: 4, label: "Often", description: "I'm usually in good health" },
            { value: 3, label: "Sometimes", description: "My health varies" },
            { value: 2, label: "Rarely", description: "I often don't feel well" },
            { value: 1, label: "Never", description: "I consistently feel unwell" }
        ]
    },
    {
        id: 16,
        question: "How well do you maintain a work-life balance?",
        category: "life_balance",
        options: [
            { value: 5, label: "Excellent Balance", description: "I balance work and personal life well" },
            { value: 4, label: "Good Balance", description: "I manage both areas adequately" },
            { value: 3, label: "Fair Balance", description: "Balance is challenging" },
            { value: 2, label: "Poor Balance", description: "One area dominates my life" },
            { value: 1, label: "No Balance", description: "I have no work-life balance" }
        ]
    },
    {
        id: 17,
        question: "How often do you feel grateful for things in your life?",
        category: "gratitude",
        options: [
            { value: 5, label: "Daily", description: "I regularly appreciate what I have" },
            { value: 4, label: "Often", description: "I frequently feel grateful" },
            { value: 3, label: "Sometimes", description: "I occasionally feel thankful" },
            { value: 2, label: "Rarely", description: "Gratitude is uncommon for me" },
            { value: 1, label: "Never", description: "I struggle to feel grateful" }
        ]
    },
    {
        id: 18,
        question: "How effectively do you communicate with others?",
        category: "communication",
        options: [
            { value: 5, label: "Very Effectively", description: "I communicate clearly and well" },
            { value: 4, label: "Effectively", description: "I generally communicate well" },
            { value: 3, label: "Moderately", description: "My communication is adequate" },
            { value: 2, label: "Ineffectively", description: "I struggle with communication" },
            { value: 1, label: "Very Ineffectively", description: "Communication is very difficult" }
        ]
    },
    {
        id: 19,
        question: "How satisfied are you with your personal growth?",
        category: "personal_growth",
        options: [
            { value: 5, label: "Very Satisfied", description: "I'm constantly growing and learning" },
            { value: 4, label: "Satisfied", description: "I'm making good progress" },
            { value: 3, label: "Neutral", description: "Growth is happening but slow" },
            { value: 2, label: "Dissatisfied", description: "I feel stagnant" },
            { value: 1, label: "Very Dissatisfied", description: "I'm not growing at all" }
        ]
    },
    {
        id: 20,
        question: "Overall, how would you rate your current mental wellbeing?",
        category: "overall_wellbeing",
        options: [
            { value: 5, label: "Excellent", description: "I'm in a great mental state" },
            { value: 4, label: "Good", description: "My mental health is solid" },
            { value: 3, label: "Fair", description: "I'm doing okay mentally" },
            { value: 2, label: "Poor", description: "I'm struggling mentally" },
            { value: 1, label: "Very Poor", description: "My mental health needs help" }
        ]
    },
    {
        id: 21,
        question: "I was able to clearly identify why I was feeling the way I did.",
        category: "Thoughts, Body, and Experiences",
        options: [
            { value: 5, label: "Extremely", description: "I could clearly identify why I was feeling this way" },
            { value: 4, label: "Quite a bit", description: "I could mostly identify why I was feeling this way" },
            { value: 3, label: "Moderately", description: "I could somewhat identify why I was feeling this way" },
            { value: 2, label: "A little", description: "I could barely identify why I was feeling this way" },
            { value: 1, label: "Very slightly or not at all", description: "I could not identify why I was feeling this way" }
        ]
    },
    {
        id: 22,
        question: "I noticed physical sensations (such as tension, fatigue, or a racing heart) related to my emotions.",
        category: "Thoughts, Body, and Experiences",
        options: [
            {
                value: 5, label: "Extremely", description: "I strongly noticed physical sensations related to my emotions"
            },
            { value: 4, label: "Quite a bit", description: "I clearly noticed physical sensations related to my emotions" },
            { value: 3, label: "Moderately", description: "I somewhat noticed physical sensations related to my emotions" },
            { value: 2, label: "A little", description: "I slightly noticed physical sensations related to my emotions" },
            { value: 1, label: "Very slightly or not at all", description: "I did not notice physical sensations related to my emotions" }
        ]
    },
    {
        id: 23,
        question: "I felt misunderstood or unheard by others.",
        category: "Thoughts, Body, and Experiences",
        options: [
            {
                value: 5, label: "Extremely", description: "I felt extremely misunderstood or unheard by others"
            },
            { value: 4, label: "Quite a bit", description: "I felt very misunderstood or unheard by others" },
            { value: 3, label: "Moderately", description: "I felt moderately misunderstood or unheard by others" },
            { value: 2, label: "A little", description: "I felt slightly misunderstood or unheard by others" },
            { value: 1, label: "Very slightly or not at all", description: "I did not feel misunderstood or unheard by others" }
        ]
    },
    {
        id: 24,
        question: "I found myself repeatedly thinking about the same worries or problems.",
        category: "Thoughts, Body, and Experiences",
        options: [
            { value: 5, label: "Extremely", description: "I kept repeatedly thinking about the same worries or problems" },
            { value: 4, label: "Quite a bit", description: "I often repeatedly thought about the same worries or problems" },
            { value: 3, label: "Moderately", description: "I sometimes repeatedly thought about the same worries or problems" },
            { value: 2, label: "A little", description: "I rarely repeatedly thought about the same worries or problems" },
            { value: 1, label: "Very slightly or not at all", description: "I did not repeatedly think about the same worries or problems" }
        ]
    },
    {
        id: 25,
        question: "I felt safe, secure, and at ease in my environment.",
        category: "Thoughts, Body, and Experiences",
        options: [
            { value: 5, label: "Extremely", description: "I felt completely safe, secure, and at ease in my environment" },
            { value: 4, label: "Quite a bit", description: "I felt mostly safe, secure, and at ease in my environment" },
            { value: 3, label: "Moderately", description: "I felt somewhat safe, secure, and at ease in my environment" },
            { value: 2, label: "A little", description: "I felt slightly safe, secure, and at ease in my environment" },
            { value: 1, label: "Very slightly or not at all", description: "I did not feel safe, secure, or at ease in my environment" }
        ]
    },
    {
        id: 26,
        question: "How would you rate your sleep quality last night?",
        category: "Daily Well-Being",
        options: [
            { value: 5, label: "Extremely", description: "My sleep quality was excellent last night" },
            { value: 4, label: "Quite a bit", description: "My sleep quality was very good last night" },
            { value: 3, label: "Moderately", description: "My sleep quality was fair last night" },
            { value: 2, label: "A little", description: "My sleep quality was poor last night" },
            { value: 1, label: "Very slightly or not at all", description: "My sleep quality was very poor last night" }
        ]
    },
    {
        id: 27,
        question: "How stressed did you feel today?",
        category: "Daily Well-Being",
        options: [
            { value: 5, label: "Extremely", description: "I felt extremely stressed today" },
            { value: 4, label: "Quite a bit", description: "I felt very stressed today" },
            { value: 3, label: "Moderately", description: "I felt moderately stressed today" },
            { value: 2, label: "A little", description: "I felt slightly stressed today" },
            { value: 1, label: "Very slightly or not at all", description: "I did not feel stressed today" }
        ]
    },
    {
        id: 28,
        question: "How connected did you feel to other people today?",
        category: "Daily Well-Being",
        options: [
            { value: 5, label: "Extremely", description: "I felt very connected to other people today" },
            { value: 4, label: "Quite a bit", description: "I felt quite connected to other people today" },
            { value: 3, label: "Moderately", description: "I felt somewhat connected to other people today" },
            { value: 2, label: "A little", description: "I felt slightly connected to other people today" },
            { value: 1, label: "Very slightly or not at all", description: "I did not feel connected to other people today" }
        ]
    },
    {
        id: 29,
        question: "How would you rate your ability to concentrate and focus today?",
        category: "Daily Well-Being",
        options: [
            { value: 5, label: "Extremely", description: "My ability to concentrate and focus was excellent today" },
            { value: 4, label: "Quite a bit", description: "My ability to concentrate and focus was very good today" },
            { value: 3, label: "Moderately", description: "My ability to concentrate and focus was fair today" },
            { value: 2, label: "A little", description: "My ability to concentrate and focus was poor today" },
            { value: 1, label: "Very slightly or not at all", description: "My ability to concentrate and focus was very poor today" }
        ]
    },
    {
        id: 30,
        question: "To what extent were you bothered by physical fatigue or body discomfort today?",
        category: "Daily Well-Being",
        options: [
            { value: 5, label: "Extremely", description: "I was extremely bothered by physical fatigue or body discomfort today" },
            { value: 4, label: "Quite a bit", description: "I was very bothered by physical fatigue or body discomfort today" },
            { value: 3, label: "Moderately", description: "I was moderately bothered by physical fatigue or body discomfort today" },
            { value: 2, label: "A little", description: "I was slightly bothered by physical fatigue or body discomfort today" },
            { value: 1, label: "Very slightly or not at all", description: "I was not bothered by physical fatigue or body discomfort today" }
        ]
    }

];

// State management
let currentQuestionIndex = 0;
let answers = [];
let testStartTime = new Date();

// Initialize test
function initializeTest() {
    // Initialize answers array with null values
    answers = new Array(questions.length).fill(null);
    loadQuestion(0);
}

// Load a specific question
function loadQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];

    // Update progress
    updateProgress();

    // Update question display
    document.getElementById('questionNumber').textContent = `Question ${index + 1} of ${questions.length}`;
    document.getElementById('questionText').textContent = question.question;

    // Create options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, optionIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'scale-option';
        if (answers[index] === option.value) {
            optionDiv.classList.add('selected');
        }

        optionDiv.innerHTML = `
                    <div class="option-radio"></div>
                    <div class="option-content">
                        <div class="option-label">${option.label}</div>
                        <div class="option-description">${option.description}</div>
                    </div>
                    <div class="option-value">${option.value}</div>
                `;

        optionDiv.onclick = () => selectOption(index, option.value, optionDiv);
        optionsContainer.appendChild(optionDiv);
    });

    // Update navigation buttons
    updateNavigationButtons();

    // Animate card
    const card = document.getElementById('testContainer');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'slideInUp 0.6s ease-out';
    }, 10);
}

// Select an option
function selectOption(questionIndex, value, selectedDiv) {
    // Record answer
    answers[questionIndex] = value;

    // Update UI
    const allOptions = document.querySelectorAll('.scale-option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    selectedDiv.classList.add('selected');

    // Enable next button
    updateNavigationButtons();

    // Auto-advance after short delay (optional)
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            nextQuestion();
        }
    }, 500);
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Previous button
    prevBtn.disabled = currentQuestionIndex === 0;

    // Next button
    const hasAnswer = answers[currentQuestionIndex] !== null;
    nextBtn.disabled = !hasAnswer;

    // Change text on last question
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = 'Finish Test 🎉';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

// Next question
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        // Test complete
        finishTest();
    }
}

//Link test with Logged user
const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
    alert("User has not logged in!");
}

// Finish test and show results
function finishTest() {
    // Calculate results
    const totalScore = answers.reduce((sum, val) => sum + val, 0);
    const averageScore = (totalScore / questions.length).toFixed(1);
    const maxScore = questions.length * 5;
    const percentageScore = ((totalScore / maxScore) * 100).toFixed(0);

    // Categorize results
    let emotionalState, stressLevel, energyLevel, wellbeing;

    if (averageScore >= 4.5) {
        emotionalState = "Excellent";
        stressLevel = "Low";
        energyLevel = "High";
        wellbeing = "Great";
    } else if (averageScore >= 3.5) {
        emotionalState = "Good";
        stressLevel = "Moderate";
        energyLevel = "Good";
        wellbeing = "Good";
    } else if (averageScore >= 2.5) {
        emotionalState = "Fair";
        stressLevel = "Moderate";
        energyLevel = "Fair";
        wellbeing = "Fair";
    } else if (averageScore >= 1.5) {
        emotionalState = "Poor";
        stressLevel = "High";
        energyLevel = "Low";
        wellbeing = "Needs Attention";
    } else {
        emotionalState = "Critical";
        stressLevel = "Very High";
        energyLevel = "Very Low";
        wellbeing = "Needs Help";
    }

    // Calculate test duration
    const testEndTime = new Date();
    const duration = Math.round((testEndTime - testStartTime) / 1000 / 60); // minutes

    // Display results
    document.getElementById('testContainer').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';

    document.getElementById('totalScore').textContent = averageScore;
    document.getElementById('emotionalState').textContent = emotionalState;
    document.getElementById('stressLevel').textContent = stressLevel;
    document.getElementById('energyLevel').textContent = energyLevel;
    document.getElementById('wellbeing').textContent = wellbeing;

    // Create responses summary
    const summaryHTML = `
                <p class="mb-2">✓ Completed ${questions.length} questions</p>
                <p class="mb-2">✓ Total Score: ${totalScore}/${maxScore} (${percentageScore}%)</p>
                <p class="mb-2">✓ Time Taken: ${duration} minutes</p>
                <p class="mb-2">✓ Test Date: ${new Date().toLocaleDateString()}</p>
            `;
    document.getElementById('responsesSummary').innerHTML = summaryHTML;

    // Save results to localStorage (for persistence)
    const testResults = {
        userId: user.email,
        date: new Date().toISOString(),
        answers: answers,

        metrices: {
            totalScore,
            averageScore: Number(averageScore),
            emotionalState,
            stressLevel,
            energyLevel,
            wellbeing
        },

        duration
    };

    // Store in localStorage
    const key = `moodHistory_${user.email}`;
    let history = JSON.parse(localStorage.getItem(key) || '[]');
    history.push(testResults);
    // Save using centralized data manager
    MoodFlowData.tests.save(testResults);
    MoodFlowData.achievements.checkAndUnlock();

    console.log('Test Results:', testResults);
}

// Exit modal functions
function showExitModal() {
    document.getElementById('exitModal').classList.add('show');
}

function closeExitModal() {
    document.getElementById('exitModal').classList.remove('show');
}

function exitTest() {
    if (confirm('Are you sure? Your progress will be lost.')) {
        window.location.href = 'user-homepage.html';
    }
}

// Results page functions
function viewDetailedReport() {
    alert('Detailed report page would open here with comprehensive analysis, graphs, and recommendations.');
    // In production: window.location.href = 'detailed-report.html';
}

function retakeTest() {
    if (confirm('Start a new test? Your previous results are saved in your history.')) {
        location.reload();
    }
}

// Close modal on background click
document.getElementById('exitModal').addEventListener('click', function (e) {
    if (e.target === this) {
        this.classList.remove('show');
    }
});

// Initialize on page load
window.addEventListener('load', initializeTest);

// Prevent accidental page refresh
window.addEventListener('beforeunload', function (e) {
    if (currentQuestionIndex < questions.length - 1 && answers.some(a => a !== null)) {
        e.preventDefault();
        e.returnValue = '';
    }
});