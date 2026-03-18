/**
 * taketestscript.js — MoodLens Test Engine
 */

const questions = [
    { id: 1, question: "I felt interested in what I was doing.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I was fully interested and engaged" }, { value: 4, label: "Quite a bit", description: "I was very interested most of the time" }, { value: 3, label: "Moderately", description: "I felt somewhat interested" }, { value: 2, label: "A little", description: "I rarely felt interested" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel interested" }] },
    { id: 2, question: "I felt distressed or emotionally uncomfortable.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely distressed" }, { value: 4, label: "Quite a bit", description: "I felt very distressed" }, { value: 3, label: "Moderately", description: "I felt moderately distressed" }, { value: 2, label: "A little", description: "I felt slightly distressed" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel distressed" }] },
    { id: 3, question: "I felt excited.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely excited" }, { value: 4, label: "Quite a bit", description: "I felt very excited" }, { value: 3, label: "Moderately", description: "I felt moderately excited" }, { value: 2, label: "A little", description: "I felt slightly excited" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel excited" }] },
    { id: 4, question: "I felt upset.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely upset" }, { value: 4, label: "Quite a bit", description: "I felt very upset" }, { value: 3, label: "Moderately", description: "I felt moderately upset" }, { value: 2, label: "A little", description: "I felt slightly upset" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel upset" }] },
    { id: 5, question: "I felt strong or capable.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely strong" }, { value: 4, label: "Quite a bit", description: "I felt very strong" }, { value: 3, label: "Moderately", description: "I felt moderately strong" }, { value: 2, label: "A little", description: "I felt slightly strong" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel strong" }] },
    { id: 6, question: "I felt guilty.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely guilty" }, { value: 4, label: "Quite a bit", description: "I felt very guilty" }, { value: 3, label: "Moderately", description: "I felt moderately guilty" }, { value: 2, label: "A little", description: "I felt slightly guilty" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel guilty" }] },
    { id: 7, question: "I felt scared.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely scared" }, { value: 4, label: "Quite a bit", description: "I felt very scared" }, { value: 3, label: "Moderately", description: "I felt moderately scared" }, { value: 2, label: "A little", description: "I felt slightly scared" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel scared" }] },
    { id: 8, question: "I felt hostile or angry toward others.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely hostile" }, { value: 4, label: "Quite a bit", description: "I felt very hostile" }, { value: 3, label: "Moderately", description: "I felt moderately hostile" }, { value: 2, label: "A little", description: "I felt slightly hostile" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel hostile" }] },
    { id: 9, question: "I felt enthusiastic.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely enthusiastic" }, { value: 4, label: "Quite a bit", description: "I felt very enthusiastic" }, { value: 3, label: "Moderately", description: "I felt moderately enthusiastic" }, { value: 2, label: "A little", description: "I felt slightly enthusiastic" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel enthusiastic" }] },
    { id: 10, question: "I felt proud of myself.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely proud" }, { value: 4, label: "Quite a bit", description: "I felt very proud" }, { value: 3, label: "Moderately", description: "I felt moderately proud" }, { value: 2, label: "A little", description: "I felt slightly proud" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel proud" }] },
    { id: 11, question: "I felt irritable or easily annoyed.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely irritable" }, { value: 4, label: "Quite a bit", description: "I felt very irritable" }, { value: 3, label: "Moderately", description: "I felt moderately irritable" }, { value: 2, label: "A little", description: "I felt slightly irritable" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel irritable" }] },
    { id: 12, question: "I felt alert and mentally awake.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely alert" }, { value: 4, label: "Quite a bit", description: "I felt very alert" }, { value: 3, label: "Moderately", description: "I felt moderately alert" }, { value: 2, label: "A little", description: "I felt slightly alert" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel alert" }] },
    { id: 13, question: "I felt ashamed.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely ashamed" }, { value: 4, label: "Quite a bit", description: "I felt very ashamed" }, { value: 3, label: "Moderately", description: "I felt moderately ashamed" }, { value: 2, label: "A little", description: "I felt slightly ashamed" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel ashamed" }] },
    { id: 14, question: "I felt inspired or motivated.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely inspired" }, { value: 4, label: "Quite a bit", description: "I felt very inspired" }, { value: 3, label: "Moderately", description: "I felt moderately inspired" }, { value: 2, label: "A little", description: "I felt slightly inspired" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel inspired" }] },
    { id: 15, question: "I felt nervous or anxious.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely nervous" }, { value: 4, label: "Quite a bit", description: "I felt very nervous" }, { value: 3, label: "Moderately", description: "I felt moderately nervous" }, { value: 2, label: "A little", description: "I felt slightly nervous" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel nervous" }] },
    { id: 16, question: "I felt determined to get things done.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely determined" }, { value: 4, label: "Quite a bit", description: "I felt very determined" }, { value: 3, label: "Moderately", description: "I felt moderately determined" }, { value: 2, label: "A little", description: "I felt slightly determined" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel determined" }] },
    { id: 17, question: "I felt attentive and focused.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely attentive" }, { value: 4, label: "Quite a bit", description: "I felt very attentive" }, { value: 3, label: "Moderately", description: "I felt moderately attentive" }, { value: 2, label: "A little", description: "I felt slightly attentive" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel attentive" }] },
    { id: 18, question: "I felt jittery or physically restless.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely jittery" }, { value: 4, label: "Quite a bit", description: "I felt very jittery" }, { value: 3, label: "Moderately", description: "I felt moderately jittery" }, { value: 2, label: "A little", description: "I felt slightly jittery" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel jittery" }] },
    { id: 19, question: "I felt active and energetic.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely active" }, { value: 4, label: "Quite a bit", description: "I felt very active" }, { value: 3, label: "Moderately", description: "I felt moderately active" }, { value: 2, label: "A little", description: "I felt slightly active" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel active" }] },
    { id: 20, question: "I felt afraid.", category: "How You Felt Emotionally", options: [{ value: 5, label: "Extremely", description: "I felt extremely afraid" }, { value: 4, label: "Quite a bit", description: "I felt very afraid" }, { value: 3, label: "Moderately", description: "I felt moderately afraid" }, { value: 2, label: "A little", description: "I felt slightly afraid" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel afraid" }] },
    { id: 21, question: "I was able to clearly identify why I was feeling the way I did.", category: "Thoughts, Body, and Experiences", options: [{ value: 5, label: "Extremely", description: "I could clearly identify my feelings" }, { value: 4, label: "Quite a bit", description: "I could mostly identify my feelings" }, { value: 3, label: "Moderately", description: "I could somewhat identify my feelings" }, { value: 2, label: "A little", description: "I could barely identify my feelings" }, { value: 1, label: "Very slightly or not at all", description: "I could not identify my feelings" }] },
    { id: 22, question: "I noticed physical sensations related to my emotions.", category: "Thoughts, Body, and Experiences", options: [{ value: 5, label: "Extremely", description: "I strongly noticed physical sensations" }, { value: 4, label: "Quite a bit", description: "I clearly noticed physical sensations" }, { value: 3, label: "Moderately", description: "I somewhat noticed physical sensations" }, { value: 2, label: "A little", description: "I slightly noticed physical sensations" }, { value: 1, label: "Very slightly or not at all", description: "I did not notice physical sensations" }] },
    { id: 23, question: "I felt misunderstood or unheard by others.", category: "Thoughts, Body, and Experiences", options: [{ value: 5, label: "Extremely", description: "I felt extremely misunderstood" }, { value: 4, label: "Quite a bit", description: "I felt very misunderstood" }, { value: 3, label: "Moderately", description: "I felt moderately misunderstood" }, { value: 2, label: "A little", description: "I felt slightly misunderstood" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel misunderstood" }] },
    { id: 24, question: "I found myself repeatedly thinking about the same worries.", category: "Thoughts, Body, and Experiences", options: [{ value: 5, label: "Extremely", description: "I kept repeatedly thinking about worries" }, { value: 4, label: "Quite a bit", description: "I often thought about the same worries" }, { value: 3, label: "Moderately", description: "I sometimes thought about the same worries" }, { value: 2, label: "A little", description: "I rarely thought about the same worries" }, { value: 1, label: "Very slightly or not at all", description: "I did not repeatedly think about worries" }] },
    { id: 25, question: "I felt safe, secure, and at ease in my environment.", category: "Thoughts, Body, and Experiences", options: [{ value: 5, label: "Extremely", description: "I felt completely safe and secure" }, { value: 4, label: "Quite a bit", description: "I felt mostly safe and secure" }, { value: 3, label: "Moderately", description: "I felt somewhat safe and secure" }, { value: 2, label: "A little", description: "I felt slightly safe and secure" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel safe or secure" }] },
    { id: 26, question: "How would you rate your sleep quality last night?", category: "Daily Well-Being", options: [{ value: 5, label: "Excellent", description: "My sleep quality was excellent" }, { value: 4, label: "Very good", description: "My sleep quality was very good" }, { value: 3, label: "Fair", description: "My sleep quality was fair" }, { value: 2, label: "Poor", description: "My sleep quality was poor" }, { value: 1, label: "Very poor", description: "My sleep quality was very poor" }] },
    { id: 27, question: "How stressed did you feel today?", category: "Daily Well-Being", options: [{ value: 5, label: "Extremely", description: "I felt extremely stressed" }, { value: 4, label: "Quite a bit", description: "I felt very stressed" }, { value: 3, label: "Moderately", description: "I felt moderately stressed" }, { value: 2, label: "A little", description: "I felt slightly stressed" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel stressed" }] },
    { id: 28, question: "How connected did you feel to other people today?", category: "Daily Well-Being", options: [{ value: 5, label: "Extremely", description: "I felt very connected to others" }, { value: 4, label: "Quite a bit", description: "I felt quite connected to others" }, { value: 3, label: "Moderately", description: "I felt somewhat connected to others" }, { value: 2, label: "A little", description: "I felt slightly connected to others" }, { value: 1, label: "Very slightly or not at all", description: "I did not feel connected to others" }] },
    { id: 29, question: "How would you rate your ability to concentrate and focus today?", category: "Daily Well-Being", options: [{ value: 5, label: "Excellent", description: "My focus was excellent" }, { value: 4, label: "Very good", description: "My focus was very good" }, { value: 3, label: "Fair", description: "My focus was fair" }, { value: 2, label: "Poor", description: "My focus was poor" }, { value: 1, label: "Very poor", description: "My focus was very poor" }] },
    { id: 30, question: "To what extent were you bothered by physical fatigue today?", category: "Daily Well-Being", options: [{ value: 5, label: "Extremely", description: "I was extremely bothered by fatigue" }, { value: 4, label: "Quite a bit", description: "I was very bothered by fatigue" }, { value: 3, label: "Moderately", description: "I was moderately bothered by fatigue" }, { value: 2, label: "A little", description: "I was slightly bothered by fatigue" }, { value: 1, label: "Very slightly or not at all", description: "I was not bothered by fatigue" }] }
];

let currentQuestionIndex = 0;
let answers = [];
let testStartTime = new Date();
let currentWeekNumber = 1;

const API_BASE = 'https://moodflow-api.onrender.com';
const API_KEY = 'mood_flow_model_key';

function initializeTest() {
    answers = new Array(questions.length).fill(null);
    loadQuestion(0);
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    updateProgress();
    document.getElementById('questionNumber').textContent = `Question ${index + 1} of ${questions.length}`;
    document.getElementById('questionText').textContent = question.question;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'scale-option';
        if (answers[index] === option.value) optionDiv.classList.add('selected');
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

    updateNavigationButtons();
    const card = document.getElementById('testContainer');
    if (card) { card.style.animation = 'none'; setTimeout(() => { card.style.animation = 'slideInUp 0.6s ease-out'; }, 10); }
}

function selectOption(questionIndex, value, selectedDiv) {
    answers[questionIndex] = value;
    document.querySelectorAll('.scale-option').forEach(opt => opt.classList.remove('selected'));
    selectedDiv.classList.add('selected');
    updateNavigationButtons();
    setTimeout(() => { if (currentQuestionIndex < questions.length - 1) nextQuestion(); }, 500);
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const pb = document.getElementById('progressBar');
    const cq = document.getElementById('currentQuestion');
    const pp = document.getElementById('progressPercent');
    if (pb) pb.style.width = progress + '%';
    if (cq) cq.textContent = currentQuestionIndex + 1;
    if (pp) pp.textContent = Math.round(progress) + '%';
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = answers[currentQuestionIndex] === null;
    nextBtn.textContent = (currentQuestionIndex === questions.length - 1) ? 'Finish Test 🎉' : 'Next →';
}

function previousQuestion() { if (currentQuestionIndex > 0) loadQuestion(currentQuestionIndex - 1); }
function nextQuestion() { if (currentQuestionIndex < questions.length - 1) { loadQuestion(currentQuestionIndex + 1); } else { finishTest(); } }

function buildResponsesFromAnswers() {
    return {
        Q1_Interested: Q1 = answers[0], Q2_Distressed: answers[1], Q3_Excited: answers[2],
        Q4_Upset: answers[3], Q5_Strong: answers[4], Q6_Guilty: answers[5],
        Q7_Scared: answers[6], Q8_Hostile: answers[7], Q9_Enthusiastic: answers[8],
        Q10_Proud: answers[9], Q11_Irritable: answers[10], Q12_Alert: answers[11],
        Q13_Ashamed: answers[12], Q14_Inspired: answers[13], Q15_Nervous: answers[14],
        Q16_Determined: answers[15], Q17_Attentive: answers[16], Q18_Jittery: answers[17],
        Q19_Active: answers[18], Q20_Afraid: answers[19],
        Q21_Emotional_Clarity: answers[20],
        Somatic_Awareness: answers[21],
        Q23_Misunderstood: answers[22],
        Rumination: answers[23],
        Psychological_Safety: answers[24],
        Q26_Sleep_Quality: answers[25], Q27_Daily_Stress: answers[26],
        Q28_Social_Connection: answers[27], Q29_Focus_Ability: answers[28],
        Q30_Physical_Fatigue: answers[29],
        Sleep_Quality: answers[25], Daily_Stress: answers[26],
        Social_Connection: answers[27], Focus_Ability: answers[28],
        Physical_Fatigue: answers[29]
    };
}

async function callPredictAPI(responses) {
    try {
        const resp = await fetch(`${API_BASE}/predict_all`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
            body: JSON.stringify({ answers: responses })
        });
        if (!resp.ok) return null;
        return await resp.json();
    } catch (err) {
        console.error('[API] predict_all error:', err);
        return null;
    }
}

async function finishTest() {
    if (answers.some(a => a === null || a === undefined)) {
        alert('Please answer all questions before finishing.');
        return;
    }
    const sb = window.sb;
    if (!sb) { alert('Connection error. Please refresh.'); return; }

    const endTime = new Date();
    const duration = Math.round((endTime - testStartTime) / 1000);
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) { nextBtn.disabled = true; nextBtn.textContent = 'Saving... ⏳'; }

    try {
        const { data: { user }, error: authErr } = await sb.auth.getUser();
        if (authErr || !user) { window.location.href = 'signpage.html'; return; }

        const responses = buildResponsesFromAnswers();

        const { data: existing } = await sb.from('test_responses').select('week').eq('user_id', user.id);
        const completedWeeks = existing ? existing.map(r => r.week) : [];
        currentWeekNumber = 1;
        for (let w = 1; w <= 4; w++) { if (!completedWeeks.includes(w)) { currentWeekNumber = w; break; } }

        if (completedWeeks.length >= 4) {
            alert('You have already completed all 4 weeks! Check your dashboard for the full report.');
            window.location.href = 'user-homepage.html';
            return;
        }

        let predictionLabel = 'Pending', predictionConf = null, shapValues = null, debateResult = null;
        const apiResult = await callPredictAPI(responses);
        if (apiResult && apiResult.status === 'success') {
            predictionLabel = apiResult.predictions.XGBoost_ModelB.label;
            debateResult = apiResult.predictions;
        } else {
            predictionLabel = fallbackPredict(responses);
        }
        shapValues = computeSimpleShap(responses);

        const paScore = computePAScore(responses);
        const naScore = computeNAScore(responses);

        const { error: insertErr } = await sb.from('test_responses').upsert([{
            user_id: user.id, week: currentWeekNumber, responses, prediction_label: predictionLabel,
            prediction_confidence: predictionConf, shap_values: shapValues, pa_score: paScore,
            na_score: naScore, debate_result: debateResult, submitted_at: new Date().toISOString()
        }], { onConflict: 'user_id,week' });
        if (insertErr) throw insertErr;

        const totalScore = answers.reduce((s, v) => s + v, 0);
        const averageScore = (totalScore / answers.length).toFixed(2);
        const pctScore = ((totalScore / (answers.length * 5)) * 100).toFixed(1);
        const emotState = getEmotionalState(parseFloat(averageScore));

        const { data: testResult } = await sb.from('test_results').insert([{
            user_id: user.id, test_start_time: testStartTime.toISOString(),
            test_end_time: endTime.toISOString(), duration_seconds: duration,
            total_score: totalScore, average_score: parseFloat(averageScore),
            percentage_score: parseFloat(pctScore), emotional_state: emotState.state,
            stress_level: emotState.stress, energy_level: emotState.energy,
            wellbeing: emotState.wellbeing, mood_classification: predictionLabel,
            browser: getBrowserInfo(), device: getDeviceInfo(),
            screen_size: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language, status: 'COMPLETED'
        }]).select().single();

        if (testResult) {
            const answersData = answers.map((answer, idx) => ({
                test_id: testResult.test_id, question_number: idx + 1,
                question_id: questions[idx].id, question_text: questions[idx].question,
                category: questions[idx].category, selected_value: answer,
                selected_label: questions[idx].options.find(o => o.value === answer)?.label || '',
                selected_description: questions[idx].options.find(o => o.value === answer)?.description || ''
            }));
            await sb.from('test_answers').insert(answersData);

            const cats = {};
            questions.forEach((q, idx) => {
                if (!cats[q.category]) cats[q.category] = { total: 0, count: 0 };
                cats[q.category].total += answers[idx]; cats[q.category].count += 1;
            });
            const catData = Object.entries(cats).map(([name, d]) => ({
                test_id: testResult.test_id, category_name: name,
                total_score: d.total, question_count: d.count,
                average_score: (d.total / d.count).toFixed(2)
            }));
            await sb.from('category_scores').insert(catData);
        }

        try { await sb.rpc('update_user_streak', { p_user_id: user.id }); } catch (e) { console.warn('Streak skipped:', e); }
        console.log(`✅ Week ${currentWeekNumber} saved. Label: ${predictionLabel}`);
        showResults(averageScore, emotState.state, emotState.stress, emotState.energy, emotState.wellbeing, predictionLabel, currentWeekNumber);

    } catch (err) {
        console.error('[finishTest]', err);
        if (nextBtn) { nextBtn.disabled = false; nextBtn.textContent = 'Finish Test 🎉'; }
        alert('Error saving: ' + (err.message || 'Please try again.'));
    }
}

function showResults(avg, emotState, stress, energy, wellbeing, predLabel, weekNum) {
    const resultsContainer = document.getElementById('resultsContainer');
    const testContainer = document.getElementById('testContainer');
    if (!resultsContainer || !testContainer) return;
    const el = id => document.getElementById(id);
    if (el('totalScore')) el('totalScore').textContent = `${avg}/5`;
    if (el('emotionalState')) el('emotionalState').textContent = emotState;
    if (el('stressLevel')) el('stressLevel').textContent = stress;
    if (el('energyLevel')) el('energyLevel').textContent = energy;
    if (el('wellbeing')) el('wellbeing').textContent = wellbeing;
    if (el('weekNumber')) el('weekNumber').textContent = `Week ${weekNum} of 4`;
    if (el('mlPrediction')) el('mlPrediction').textContent = predLabel;
    testContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    if (weekNum === 4) {
        const rb = el('viewReportBtn');
        if (rb) rb.style.display = 'inline-block';
    }
}

function computePAScore(r) {
    const cols = ['Q1_Interested', 'Q3_Excited', 'Q5_Strong', 'Q9_Enthusiastic', 'Q10_Proud', 'Q12_Alert', 'Q14_Inspired', 'Q16_Determined', 'Q17_Attentive', 'Q19_Active'];
    const vals = cols.map(c => r[c]).filter(v => v != null);
    if (!vals.length) return 0;
    return parseFloat((vals.reduce((s, v) => s + ((v - 1) / 4), 0) / vals.length).toFixed(4));
}

function computeNAScore(r) {
    const cols = ['Q2_Distressed', 'Q4_Upset', 'Q7_Scared', 'Q8_Hostile', 'Q11_Irritable', 'Q15_Nervous', 'Q18_Jittery', 'Q20_Afraid'];
    const vals = cols.map(c => r[c]).filter(v => v != null);
    if (!vals.length) return 0;
    return parseFloat((vals.reduce((s, v) => s + ((v - 1) / 4), 0) / vals.length).toFixed(4));
}

function computeSimpleShap(r) {
    const feats = ['Q1_Interested', 'Q2_Distressed', 'Q4_Upset', 'Q7_Scared', 'Q9_Enthusiastic', 'Q11_Irritable', 'Q15_Nervous', 'Q18_Jittery', 'Focus_Ability'];
    const out = {};
    feats.forEach(f => {
        const raw = r[f] || r['Q29_Focus_Ability'] || 3;
        const sc = (raw - 1) / 4;
        out[f] = parseFloat((Math.abs(sc - 0.5) * 0.15).toFixed(6));
    });
    return out;
}

function fallbackPredict(r) {
    const bal = computePAScore(r) - computeNAScore(r);
    if (bal > 0.2) return 'Stable';
    if (bal < -0.2) return 'Unstable';
    return 'Moderate';
}

function getEmotionalState(avg) {
    if (avg >= 4) return { state: 'Positive', stress: 'Low', energy: 'High', wellbeing: 'Excellent' };
    if (avg >= 3) return { state: 'Neutral', stress: 'Moderate', energy: 'Moderate', wellbeing: 'Good' };
    if (avg >= 2) return { state: 'Somewhat Negative', stress: 'Moderate', energy: 'Low', wellbeing: 'Fair' };
    return { state: 'Negative', stress: 'High', energy: 'Very Low', wellbeing: 'Needs Attention' };
}

function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome'; if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari'; if (ua.includes('Edge')) return 'Edge';
    return 'Other';
}
function getDeviceInfo() {
    if (/mobile/i.test(navigator.userAgent)) return 'Mobile';
    if (/tablet/i.test(navigator.userAgent)) return 'Tablet';
    return 'Desktop';
}

function showExitModal() { const m = document.getElementById('exitModal'); if (m) m.classList.add('show'); }
function closeExitModal() { const m = document.getElementById('exitModal'); if (m) m.classList.remove('show'); }
function exitTest() { if (confirm('Are you sure? Progress will be lost.')) window.location.href = 'user-homepage.html'; }
function viewDetailedReport() { window.location.href = 'user-homepage.html#report'; }
function retakeTest() { if (confirm('Start new test? Previous results are saved.')) location.reload(); }

async function checkAuth() {
    const sb = window.sb;
    if (!sb) { window.location.href = 'signpage.html'; return null; }
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) { window.location.href = 'signpage.html'; return null; }
    return user;
}

document.addEventListener('DOMContentLoaded', () => {
    const exitModal = document.getElementById('exitModal');
    if (exitModal) exitModal.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('show'); });
});

window.addEventListener('load', async () => {
    const user = await checkAuth();
    if (!user) return;
    initializeTest();
});

window.addEventListener('beforeunload', function (e) {
    if (currentQuestionIndex < questions.length - 1 && answers.some(a => a !== null)) {
        e.preventDefault(); e.returnValue = '';
    }
});
