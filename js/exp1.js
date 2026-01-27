/* function checkAnswer(button, isCorrect) {
  const questionBox = button.closest(".question");
  const result = questionBox.querySelector(".result");

  // Disable all buttons for this question
  const buttons = questionBox.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    // Check if this button has the correct answer
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('true)')) {
      btn.style.backgroundColor = "#16a34a"; // green for correct answer
      btn.style.color = "white";
    }
  });

  if (isCorrect) {
    button.style.backgroundColor = "#16a34a"; // green
    button.style.color = "white";
    result.textContent = "Correct Answer ✅";
    result.style.color = "#16a34a";
  } else {
    button.style.backgroundColor = "#dc2626"; // red
    button.style.color = "white";
    result.textContent = "Incorrect Answer ❌ The correct answer is highlighted in green.";
    result.style.color = "#dc2626";
  }
} */