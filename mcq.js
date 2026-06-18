/**
 * MCQ answer-checking logic (shared across all experiments).
 */
window.checkAnswer = function(button, isCorrect) {
  const questionBox = button.closest('.question');
  const result = questionBox.querySelector('.result');
  
  // Prevent answering again
  if (questionBox.dataset.answered) return;
  questionBox.dataset.answered = 'true';

  // Disable all buttons and highlight correct answer
  questionBox.querySelectorAll('button').forEach(btn => {
    btn.disabled = true;
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('true')) {
      btn.style.backgroundColor = '#16a34a';
      btn.style.color = 'white';
    }
  });

  if (isCorrect) {
    button.style.backgroundColor = '#16a34a';
    button.style.color = 'white';
    result.textContent = 'Correct Answer ✅';
    result.style.color = '#16a34a';
    questionBox.dataset.correct = 'true';
  } else {
    button.style.backgroundColor = '#dc2626';
    button.style.color = 'white';
    result.textContent = 'Incorrect Answer ❌ The correct answer is highlighted in green.';
    result.style.color = '#dc2626';
    questionBox.dataset.correct = 'false';
  }
  
  checkTestCompletion(questionBox);
};

function checkTestCompletion(questionBox) {
  const expId = questionBox.dataset.expId;
  const testType = questionBox.dataset.testType;
  const total = parseInt(questionBox.dataset.total, 10);
  
  if (!expId || !testType) return;
  
  // Count how many are answered
  const allQuestions = document.querySelectorAll('.question');
  let answeredCount = 0;
  let correctCount = 0;
  
  allQuestions.forEach(q => {
    if (q.dataset.answered === 'true') {
      answeredCount++;
      if (q.dataset.correct === 'true') correctCount++;
    }
  });
  
  if (answeredCount === total) {
    // Save to state
    if (window.StateManager) {
      window.StateManager.updateScore(expId, testType, correctCount, total);
    }
    
    // Show summary card
    const summaryCard = document.getElementById('mcq-summary');
    const scoreSpan = document.getElementById('mcq-score');
    if (summaryCard && scoreSpan) {
      scoreSpan.textContent = correctCount;
      summaryCard.style.display = 'block';
      summaryCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Re-render sidebar to show checkmark if needed
    if (window.appInstance) {
      document.getElementById('sidebar').innerHTML = window.appInstance.buildSidebar(expId, testType);
    }
  }
}

/**
 * Feedback form word counter.
 */
window.countFeedbackWords = function() {
  const textarea = document.getElementById('fbText');
  const counter = document.getElementById('wordCount');
  if (!textarea || !counter) return;
  const words = textarea.value.trim() === '' ? [] : textarea.value.trim().split(/\s+/);
  counter.textContent = `Words: ${words.length} / 50`;
  counter.classList.toggle('warning', words.length > 50);
  if (words.length > 50) counter.textContent += ' (Exceeded limit!)';
};

/**
 * Feedback form submission handler.
 */
window.handleFeedbackSubmit = function(e) {
  e.preventDefault();
  const text = document.getElementById('fbText').value.trim();
  const words = text === '' ? [] : text.split(/\s+/);
  if (words.length === 0) { alert('Please enter your feedback.'); return; }
  if (words.length > 50) { alert(`Please limit your feedback to 50 words. Currently: ${words.length} words.`); return; }
  document.getElementById('successMessage').style.display = 'block';
  document.getElementById('feedbackForm').reset();
  document.getElementById('wordCount').textContent = 'Words: 0 / 50';
  document.getElementById('wordCount').classList.remove('warning');
  document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};
