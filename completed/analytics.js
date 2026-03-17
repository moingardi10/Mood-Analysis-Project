//GETTING USER MOOD HISTORY
function getUserMoodHistory(){
    // TODO: Replace with Supabase query from moodflow_tests/moods table
    return [];
}

//MOOD CALCULATING
function calculateOverallMood(history) {
  if (!history.length) return 0;

  const avg =
    history.reduce((sum, h) => sum + h.metrics.averageScore, 0) /
    history.length;

  return Number(avg.toFixed(2));
}

//MOOD STABILITY CALCULATING
function calculateStability(history) {
  if (history.length < 2) return 100;

  const values = history.map(h => h.metrics.averageScore);

  const mean = values.reduce((a,b)=>a+b,0)/values.length;

  const variance =
    values.reduce((s,v)=>s+(v-mean)**2,0)/values.length;

  const std = Math.sqrt(variance);

  return Math.max(0, Math.min(100, 100 - std * 25));
}

//RENDERING TOP CONTENTS
const history = getUserMoodHistory();

document.getElementById('avgMood').textContent =
  calculateOverallMood(history);

document.getElementById('stabilityScore').textContent =
  Math.round(calculateStability(history));
  