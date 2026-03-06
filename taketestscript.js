const questions = [
    {
                id: 1,
                question: "I felt interested in what I was doing.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I was fully interested and engaged in what I was doing" },
                    { value: 4, label: "Quite a bit", description: "I was very interested most of the time" },
                    { value: 3, label: "Moderately", description:  "I felt somewhat interested in my activities" },
                    { value: 2, label: "A little", description: "I rarely felt interested in what I was doing" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel interested in my activities" }
                ]
            },


{
                id: 2,
                question: "I felt distressed or emotionally uncomfortable.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: " I felt extremely distressed or emotionally uncomfortable" },
                    { value: 4, label: "Quite a bit", description: "I felt very distressed or emotionally uncomfortable" },
                    { value: 3, label: "Moderately", description:   "I felt moderately distressed or emotionally uncomfortable"},
                    { value: 2, label: "A little", description:  "I felt slightly distressed or emotionally uncomfortable" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel distressed or emotionally uncomfortable" }
                ]
            },

{
                id: 3,
                question: "I felt excited.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely excited" },
                    { value: 4, label: "Quite a bit", description:   "I felt very excited" },
                    { value: 3, label: "Moderately", description:   "I felt moderately excited"},
                    { value: 2, label: "A little", description:  "I felt slightly excited" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel excited" }
                ]
            },

{
                id: 4,
                question: "I felt upset.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely upset" },
                    { value: 4, label: "Quite a bit", description:   "I felt very upset" },
                    { value: 3, label: "Moderately", description:   "I felt moderately upset"},
                    { value: 2, label: "A little", description:  "I felt slightly upset" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel upset" }
                ]
            },

{
                id: 5,
                question: "I felt strong or capable.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely strong or capable" },
                    { value: 4, label: "Quite a bit", description:   "I felt very strong or capable" },
                    { value: 3, label: "Moderately", description:   "I felt moderately strong or capable"},
                    { value: 2, label: "A little", description:  "I felt slightly strong or capable" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel strong or capable" }
                ]
            },

{
                id: 6,
                question: "I felt guilty.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely guilty" },
                    { value: 4, label: "Quite a bit", description:   "I felt very guilty" },
                    { value: 3, label: "Moderately", description:   "I felt moderately guilty"},
                    { value: 2, label: "A little", description:  "I felt slightly guilty" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel guilty" }
                ]
            },

{
                id: 7,
                question: "I felt scared.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely scared" },
                    { value: 4, label: "Quite a bit", description:   "I felt very scared" },
                    { value: 3, label: "Moderately", description:   "I felt moderately scared"},
                    { value: 2, label: "A little", description:  "I felt slightly scared" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel scared" }
                ]
            },
{
                id: 8,
                question: "I felt hostile or angry toward others.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely hostile or angry toward others" },
                    { value: 4, label: "Quite a bit", description:   "I felt very hostile or angry toward others" },
                    { value: 3, label: "Moderately", description:   "I felt moderately hostile or angry toward others"},
                    { value: 2, label: "A little", description:  "I felt slightly hostile or angry toward others" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel hostile or angry toward others" }
                ]
            },
{
                id: 9,
                question: "I felt enthusiastic.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely enthusiastic" },
                    { value: 4, label: "Quite a bit", description:   "I felt very enthusiastic" },
                    { value: 3, label: "Moderately", description:   "I felt moderately enthusiastic"},
                    { value: 2, label: "A little", description:  "I felt slightly enthusiastic" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel enthusiastic" }
                ]
            },
{
                id: 10,
                question: "I felt proud of myself.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely proud of myself" },
                    { value: 4, label: "Quite a bit", description:   "I felt very proud of myself" },
                    { value: 3, label: "Moderately", description:   "I felt moderately proud of myself"},
                    { value: 2, label: "A little", description:  "I felt slightly proud of myself" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel proud of myself" }
                ]
            },
{
                id: 11,
                question: "I felt irritable or easily annoyed",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely irritable or easily annoyed" },
                    { value: 4, label: "Quite a bit", description:   "I felt very irritable or easily annoyed" },
                    { value: 3, label: "Moderately", description:   "I felt moderately irritable or easily annoyed"},
                    { value: 2, label: "A little", description:  "I felt slightly irritable or easily annoyed" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel irritable or easily annoyed" }
                ]
            },


{
                id: 12,
                question: "I felt alert and mentally awake.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely alert and mentally awake" },
                    { value: 4, label: "Quite a bit", description:   "I felt very alert and mentally awake" },
                    { value: 3, label: "Moderately", description:   "I felt moderately alert and mentally awake"},
                    { value: 2, label: "A little", description:  "I felt slightly alert and mentally awake" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel alert and mentally awake" }
                ]
            },
{
                id: 13,
                question: "I felt ashamed.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely ashamed" },
                    { value: 4, label: "Quite a bit", description:   "I felt very ashamed" },
                    { value: 3, label: "Moderately", description:   "I felt moderately ashamed"},
                    { value: 2, label: "A little", description:  "I felt slightly ashamed" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel ashamed" }
                ]
            },
{
                id: 14,
                question: "I felt inspired or motivated.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely inspired or motivated" },
                    { value: 4, label: "Quite a bit", description:   "I felt very inspired or motivated" },
                    { value: 3, label: "Moderately", description:   "I felt moderately inspired or motivated"},
                    { value: 2, label: "A little", description:  "I felt slightly inspired or motivated" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel inspired or motivated" }
                ]
            },
{
                id: 15,
                question: "I felt nervous or anxious.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely nervous or anxious" },
                    { value: 4, label: "Quite a bit", description:   "I felt very nervous or anxious" },
                    { value: 3, label: "Moderately", description:   "I felt moderately nervous or anxious"},
                    { value: 2, label: "A little", description:  "I felt slightly nervous or anxious" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel nervous or anxious" }
                ]
            },
{
                id: 16,
                question: "I felt determined to get things done.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely determined to get things done" },
                    { value: 4, label: "Quite a bit", description:   "I felt very determined to get things done" },
                    { value: 3, label: "Moderately", description:   "I felt moderately determined to get things done"},
                    { value: 2, label: "A little", description:  "I felt slightly determined to get things done" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel determined to get things done" }
                ]
            },
{
                id: 17,
                question: "I felt attentive and focused.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely attentive and focused" },
                    { value: 4, label: "Quite a bit", description:   "I felt very attentive and focused" },
                    { value: 3, label: "Moderately", description:   "I felt moderately attentive and focused"},
                    { value: 2, label: "A little", description:  "I felt slightly attentive and focused" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel attentive and focused" }
                ]
            },
{
                id: 18,
                question: "I felt jittery or physically restless.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely jittery or physically restless" },
                    { value: 4, label: "Quite a bit", description:   "I felt very jittery or physically restless" },
                    { value: 3, label: "Moderately", description:   "I felt moderately jittery or physically restless"},
                    { value: 2, label: "A little", description:  "I felt slightly jittery or physically restless" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel jittery or physically restless" }
                ]
            },
{
                id: 19,
                question: "I felt active and energetic.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely active and energetic" },
                    { value: 4, label: "Quite a bit", description:   "I felt very active and energetic" },
                    { value: 3, label: "Moderately", description:   "I felt moderately active and energetic"},
                    { value: 2, label: "A little", description:  "I felt slightly active and energetic" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel active and energetic" }
                ]
            },
{
                id: 20,
                question: "I felt afraid.",
                category: "How You Felt Emotionally",
                options: [
                    { value: 5, label: "Extremely", description: "I felt extremely afraid" },
                    { value: 4, label: "Quite a bit", description:   "I felt very afraid" },
                    { value: 3, label: "Moderately", description:   "I felt moderately afraid"},
                    { value: 2, label: "A little", description:  "I felt slightly afraid" },
                    { value: 1, label: "Very slightly or not at all", description:  "I did not feel afraid" }
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