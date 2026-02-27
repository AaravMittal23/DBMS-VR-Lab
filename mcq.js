/**
 * MCQ answer-checking logic (shared across all experiments).
 */
window.checkAnswer = function(button, isCorrect) {
  const questionBox = button.closest('.question');
  const result = questionBox.querySelector('.result');

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
  } else {
    button.style.backgroundColor = '#dc2626';
    button.style.color = 'white';
    result.textContent = 'Incorrect Answer ❌ The correct answer is highlighted in green.';
    result.style.color = '#dc2626';
  }
};

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
