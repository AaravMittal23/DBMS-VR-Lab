window.sim8_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>

    <div class="card" style="margin-bottom: 24px;">
      <h2 style="margin-top: 0;">Views & Indexes Simulator</h2>
      <p style="color: var(--muted); margin-bottom: 0;">
        Create virtual tables using <code>VIEWS</code> and explore how <code>INDEXES</code> optimize data retrieval by observing simulated execution times.
      </p>
    </div>

    <div class="simulation-layout">
      <div class="simulation-left" style="flex: 1;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Execution Console</h2>
            <button onclick="openGuide8()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
          
          <div style="background: #1e293b; color: #f8fafc; font-family: monospace; padding: 16px; border-radius: 8px;">
            <textarea id="vi-input" rows="4" style="width: 100%; background: transparent; color: #10b981; border: none; outline: none; resize: none; font-family: monospace; font-size: 14px;" placeholder="CREATE VIEW HighEarners AS
SELECT * FROM Employees WHERE Salary > 70000;"></textarea>
          </div>
          
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button onclick="executeVI()" style="background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; flex: 1;">Execute</button>
            <button onclick="resetVI()" style="background: var(--muted); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Reset Schema</button>
          </div>
          
          <div id="vi-output" style="margin-top: 16px; padding: 12px; border-radius: 4px; display: none; font-family: monospace; font-size: 13px;"></div>
          
          <div style="margin-top: 24px;">
            <h3 style="margin-top: 0; font-size: 14px; color: var(--muted);">Quick Examples:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button onclick="loadVIExample(0)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">SELECT (Unindexed)</button>
              <button onclick="loadVIExample(1)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">CREATE INDEX</button>
              <button onclick="loadVIExample(0)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">SELECT (Indexed)</button>
              <button onclick="loadVIExample(2)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">CREATE VIEW</button>
              <button onclick="loadVIExample(3)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">SELECT FROM VIEW</button>
            </div>
          </div>
        </div>
      </div>

      <div class="simulation-right" style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
        <div class="card sticky-result" style="margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Performance Monitor</h2>
            <div id="perf-status" style="font-size: 12px; font-weight: bold; background: #fee2e2; color: #ef4444; padding: 4px 8px; border-radius: 12px;">UNINDEXED (FULL SCAN)</div>
          </div>
          
          <div style="height: 20px; background: #e2e8f0; border-radius: 10px; overflow: hidden; position: relative;">
            <div id="perf-bar" style="height: 100%; width: 0%; background: #3b82f6; transition: width 0.1s linear;"></div>
          </div>
          <p id="perf-text" style="text-align: right; margin: 4px 0 0 0; font-family: monospace; color: var(--muted);">0ms</p>
        </div>

        <div class="card">
          <h2 style="margin-top: 0;">Result / Schema State</h2>
          <div class="simulation-result" id="vi-result-area">
            <p style="color: var(--muted); text-align: center; padding: 20px;">Run a query to see the results.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal8" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal8') closeGuide8()">
      <div style="background: var(--card); border-radius: 8px; max-width: 600px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0;">📖 Views & Indexes Guide</h2>
          <button onclick="closeGuide8()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div style="color: var(--text);">
          <p>This simulation explores performance optimization and data abstraction.</p>
          <ul>
            <li><strong>Indexes:</strong> Running a search on an unindexed column performs a Full Table Scan (slow). Creating an index on that column changes it to an Indexed Lookup (fast).</li>
            <li><strong>Views:</strong> Allow you to encapsulate complex queries into a virtual table. You can then <code>SELECT * FROM ViewName</code> directly.</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Quiz Modal -->
    <div id="quizModal8" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal8') closeQuiz8()">
      <div style="background: var(--card); border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz8()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz8Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

let hasIndex = false;
let hasView = false;

const viExamples = [
  "SELECT * FROM Employees WHERE Salary > 70000;",
  "CREATE INDEX idx_salary ON Employees (Salary);",
  "CREATE VIEW HighEarners AS SELECT * FROM Employees WHERE Salary > 70000;",
  "SELECT * FROM HighEarners;"
];

window.loadVIExample = function(index) {
  document.getElementById('vi-input').value = viExamples[index];
};

window.executeVI = function() {
  const input = document.getElementById('vi-input').value.trim();
  const out = document.getElementById('vi-output');
  const resultArea = document.getElementById('vi-result-area');
  out.style.display = 'block';
  
  if (!input) {
    out.style.background = '#fee2e2'; out.style.color = '#ef4444';
    out.textContent = 'Error: Empty command.';
    return;
  }

  const uInput = input.toUpperCase().replace(/\n/g, ' ');
  
  try {
    if (uInput.includes('CREATE INDEX')) {
      hasIndex = true;
      document.getElementById('perf-status').textContent = 'INDEX CREATED (B-TREE LOOKUP READY)';
      document.getElementById('perf-status').style.background = '#dcfce7';
      document.getElementById('perf-status').style.color = '#16a34a';
      out.style.background = '#dcfce7'; out.style.color = '#16a34a';
      out.textContent = 'Query OK, 0 rows affected. Index created.';
      resultArea.innerHTML = '<p style="color: var(--muted); text-align: center;">Index idx_salary created successfully.</p>';
    }
    else if (uInput.includes('CREATE VIEW')) {
      hasView = true;
      out.style.background = '#dcfce7'; out.style.color = '#16a34a';
      out.textContent = 'Query OK, 0 rows affected. View created.';
      resultArea.innerHTML = '<p style="color: var(--muted); text-align: center;">View HighEarners created successfully.</p>';
    }
    else if (uInput.includes('SELECT')) {
      if (uInput.includes('HIGHEARNERS') && !hasView) {
        throw new Error("View 'HighEarners' does not exist.");
      }
      
      out.style.background = '#dcfce7'; out.style.color = '#16a34a';
      out.textContent = 'Executing query...';
      
      const bar = document.getElementById('perf-bar');
      const text = document.getElementById('perf-text');
      bar.style.width = '0%';
      bar.style.transition = 'none';
      
      // Simulate performance difference
      setTimeout(() => {
        const timeToTake = hasIndex ? 50 : 800; // ms
        bar.style.transition = `width ${timeToTake}ms linear`;
        bar.style.width = '100%';
        
        let start = Date.now();
        let interval = setInterval(() => {
          let elapsed = Date.now() - start;
          if (elapsed >= timeToTake) {
            elapsed = timeToTake;
            clearInterval(interval);
            out.textContent = `Query OK. Execution time: ${timeToTake}ms.`;
            resultArea.innerHTML = `
              <table class="simulation-table">
                <thead><tr><th>EmpID</th><th>Name</th><th>Salary</th></tr></thead>
                <tbody>
                  <tr><td>4</td><td>David</td><td>$80k</td></tr>
                  <tr><td>5</td><td>Eve</td><td>$90k</td></tr>
                </tbody>
              </table>
            `;
          }
          text.textContent = elapsed + 'ms';
        }, 10);
      }, 50);
    }
    else {
      throw new Error("Query not supported in this simulator.");
    }
  } catch (err) {
    out.style.background = '#fee2e2'; out.style.color = '#ef4444';
    out.textContent = 'ERROR: ' + err.message;
  }
};

window.resetVI = function() {
  hasIndex = false;
  hasView = false;
  document.getElementById('perf-status').textContent = 'UNINDEXED (FULL SCAN)';
  document.getElementById('perf-status').style.background = '#fee2e2';
  document.getElementById('perf-status').style.color = '#ef4444';
  document.getElementById('perf-bar').style.width = '0%';
  document.getElementById('perf-text').textContent = '0ms';
  document.getElementById('vi-output').style.display = 'none';
  document.getElementById('vi-result-area').innerHTML = '<p style="color: var(--muted); text-align: center; padding: 20px;">Run a query to see the results.</p>';
};

window.openGuide8 = function() { document.getElementById('guideModal8').style.display = 'flex'; };
window.closeGuide8 = function() { document.getElementById('guideModal8').style.display = 'none'; };

const quiz8Questions = [
  { question: "What is the primary benefit of creating an index?", options: ["Saves disk space", "Reduces execution time for SELECT queries", "Speeds up INSERT queries automatically"], correct: 1, explanation: "Indexes speed up data retrieval (SELECT) but can slow down INSERT/UPDATE operations." },
  { question: "Does a View store data physically on disk?", options: ["Yes", "No, it's just a saved SQL query"], correct: 1, explanation: "A View is a virtual table created dynamically by executing the underlying query." }
];

let quiz8Timer = null;
window.startQuiz8Timer = function() {
  const randomDelay = Math.random() * 8000 + 15000;
  quiz8Timer = setTimeout(() => {
    if (Math.random() > 0.4) {
      const q = quiz8Questions[Math.floor(Math.random() * quiz8Questions.length)];
      displayQuiz8(q);
    }
    window.startQuiz8Timer();
  }, randomDelay);
};

window.displayQuiz8 = function(question) {
  const content = document.getElementById('quiz8Content');
  if (!content) return;
  let html = `<p style="margin-top: 0; font-size: 16px; font-weight: 500;">${question.question}</p>`;
  html += '<div style="margin: 20px 0;">';
  question.options.forEach((option, index) => {
    html += `<button onclick="checkAnswer8(${index}, ${question.correct}, '${question.explanation}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: var(--card); border-radius: 6px; text-align: left; cursor: pointer;">${option}</button>`;
  });
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal8').style.display = 'flex';
};

window.checkAnswer8 = function(selected, correct, explanation) {
  const content = document.getElementById('quiz8Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  let html = `<div style="background: ${resultColor}20; border-left: 4px solid ${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">`;
  html += `<p style="color: ${resultColor}; font-weight: 600; margin: 0 0 8px 0;">${resultMessage}</p>`;
  html += `<p style="margin: 0; color: var(--text);">${explanation}</p></div>`;
  html += '<button onclick="closeQuiz8()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 16px;">Got it!</button>';
  content.innerHTML = html;
};

window.closeQuiz8 = function() {
  const modal = document.getElementById('quizModal8');
  if (modal) modal.style.display = 'none';
};

window.initQuiz8 = function() {
  if (window.quiz8Timer) clearTimeout(window.quiz8Timer);
  window.startQuiz8Timer();
  resetVI();
};

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('vi-input')) {
    window.startQuiz8Timer();
    resetVI();
  }
});