// MCQ answer checking (shared logic)
/*window.checkAnswer = function (button, isCorrect) {
    const questionBox = button.closest(".question");
    const result = questionBox.querySelector(".result");
  
    const buttons = questionBox.querySelectorAll("button");
    buttons.forEach(btn => {
      btn.disabled = true;
      if (btn.getAttribute("onclick") && btn.getAttribute("onclick").includes("true")) {
        btn.style.backgroundColor = "#16a34a";
        btn.style.color = "white";
      }
    });
  
    if (isCorrect) {
      button.style.backgroundColor = "#16a34a";
      button.style.color = "white";
      result.textContent = "Correct Answer ✅";
      result.style.color = "#16a34a";
    } else {
      button.style.backgroundColor = "#dc2626";
      button.style.color = "white";
      result.textContent = "Incorrect Answer ❌ The correct answer is highlighted in green.";
      result.style.color = "#dc2626";
    }
  }*/

  window.checkAnswer = function (button, isCorrect) {
    const questionBox = button.closest(".question");
    const result = questionBox.querySelector(".result");
  
    const buttons = questionBox.querySelectorAll("button");
    buttons.forEach(btn => {
      btn.disabled = true;
  
      if (
        btn.getAttribute("onclick") &&
        btn.getAttribute("onclick").includes("true")
      ) {
        btn.style.backgroundColor = "#16a34a";
        btn.style.color = "white";
      }
    });
  
    if (isCorrect) {
      result.textContent = "Correct Answer ✅";
      result.style.color = "#16a34a";
    } else {
      result.textContent =
        "Incorrect Answer ❌ The correct answer is highlighted in green.";
      result.style.color = "#dc2626";
    }
  };