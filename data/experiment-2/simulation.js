window.sim2_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>

    <div class="card" style="margin-bottom: 24px;">
      <h2 style="margin-top: 0;">Data Definition Language (DDL) Simulator</h2>
      <p style="color: var(--muted); margin-bottom: 0;">
        Use DDL commands to define and modify the schema of your database tables. Try executing commands like <code>CREATE TABLE</code>, <code>ALTER TABLE</code>, and <code>DROP TABLE</code>.
      </p>
    </div>

    <div class="simulation-layout">
      <div class="simulation-left" style="flex: 1;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">DDL Console</h2>
            <button onclick="openGuide2()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
          
          <div style="background: #1e293b; color: #f8fafc; font-family: monospace; padding: 16px; border-radius: 8px;">
            <textarea id="ddl-input" rows="6" style="width: 100%; background: transparent; color: #10b981; border: none; outline: none; resize: none; font-family: monospace; font-size: 14px;" placeholder="CREATE TABLE Employees (
  ID INT PRIMARY KEY,
  Name VARCHAR(50)
);"></textarea>
          </div>
          
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button onclick="executeDDL()" style="background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; flex: 1;">Execute Command</button>
            <button onclick="resetDDL()" style="background: var(--muted); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Reset All</button>
          </div>
          
          <div id="ddl-output" style="margin-top: 16px; padding: 12px; border-radius: 4px; display: none; font-family: monospace; font-size: 13px;"></div>
          
          <div style="margin-top: 24px;">
            <h3 style="margin-top: 0; font-size: 14px; color: var(--muted);">Quick Examples:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button onclick="loadDDLExample(0)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">CREATE TABLE</button>
              <button onclick="loadDDLExample(1)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">ALTER TABLE ADD</button>
              <button onclick="loadDDLExample(2)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">TRUNCATE TABLE</button>
              <button onclick="loadDDLExample(3)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">DROP TABLE</button>
            </div>
          </div>
        </div>
      </div>

      <div class="simulation-right" style="flex: 1;">
        <div class="card sticky-result">
          <h2>Current Database Schema</h2>
          <div id="schema-viewer" style="display: flex; flex-direction: column; gap: 16px;">
            <p style="color: var(--muted); text-align: center; padding: 40px 0;">No tables exist in the database. Run a CREATE TABLE command.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal2" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal2') closeGuide2()">
      <div style="background: var(--card); border-radius: 8px; max-width: 600px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0;">📖 DDL Guide</h2>
          <button onclick="closeGuide2()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div style="color: var(--text);">
          <p>Data Definition Language commands modify the schema structure, not the data itself.</p>
          <ul>
            <li><strong>CREATE TABLE:</strong> Defines a new table. Requires columns and data types.</li>
            <li><strong>ALTER TABLE:</strong> Modifies an existing table (e.g., adding a column).</li>
            <li><strong>TRUNCATE TABLE:</strong> Deletes all data inside the table, but leaves the structure intact.</li>
            <li><strong>DROP TABLE:</strong> Completely destroys the table structure.</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Quiz Modal -->
    <div id="quizModal2" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal2') closeQuiz2()">
      <div style="background: var(--card); border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz2()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz2Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

let dbSchema = {};

const ddlExamples = [
  "CREATE TABLE Employees (\n  EmpID INT PRIMARY KEY,\n  Name VARCHAR(50),\n  Salary DECIMAL(10,2)\n);",
  "ALTER TABLE Employees ADD Department VARCHAR(30);",
  "TRUNCATE TABLE Employees;",
  "DROP TABLE Employees;"
];

window.loadDDLExample = function(index) {
  if (window.sqlEditor) {
    window.sqlEditor.setValue(ddlExamples[index]);
  } else {
    document.getElementById('ddl-input').value = ddlExamples[index];
  }
};

window.executeDDL = function() {
  const input = window.sqlEditor ? window.sqlEditor.getValue().trim() : document.getElementById('ddl-input').value.trim();
  const out = document.getElementById('ddl-output');
  out.style.display = 'block';
  
  if (!input) {
    out.style.background = '#fee2e2'; out.style.color = '#ef4444';
    out.textContent = 'Error: Empty command.';
    return;
  }
  
  const resultHtml = window.DB.executeQuery(input);
  out.style.background = 'transparent';
  out.style.color = 'inherit';
  out.innerHTML = resultHtml;
  
  renderSchema();
};

window.renderSchema = function() {
  const viewer = document.getElementById('schema-viewer');
  const schema = window.DB ? window.DB.getSchema() : {};
  
  if (Object.keys(schema).length === 0) {
    viewer.innerHTML = '<p style="color: var(--muted); text-align: center; padding: 40px 0;">No tables exist in the database. Run a CREATE TABLE command.</p>';
    return;
  }
  
  let html = '';
  for (const [tableName, tableData] of Object.entries(schema)) {
    html += `<div style="border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
      <div style="background: var(--bg-color); padding: 12px 16px; border-bottom: 1px solid var(--border); font-weight: bold; color: var(--primary);">
        🗄️ ${tableName}
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>`;
    tableData.columns.forEach(col => {
      html += `<tr>
        <td style="padding: 8px 16px; border-bottom: 1px solid var(--border); color: var(--text);">${col.name}</td>
        <td style="padding: 8px 16px; border-bottom: 1px solid var(--border); color: var(--muted); font-family: monospace;">${col.type}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
  }
  viewer.innerHTML = html;
};

window.resetDDL = function() {
  if (window.DB) window.DB.resetDatabase();
  if (window.sqlEditor) window.sqlEditor.setValue('');
  document.getElementById('ddl-input').value = '';
  document.getElementById('ddl-output').style.display = 'none';
  renderSchema();
};

window.openGuide2 = function() { document.getElementById('guideModal2').style.display = 'flex'; };
window.closeGuide2 = function() { document.getElementById('guideModal2').style.display = 'none'; };

const quiz2Questions = [
  { question: "Which command deletes the entire table structure?", options: ["DELETE TABLE", "TRUNCATE TABLE", "DROP TABLE", "REMOVE TABLE"], correct: 2, explanation: "DROP completely removes the table structure from the database schema." },
  { question: "What is DDL used for?", options: ["Querying data", "Defining schemas", "Managing transactions", "Controlling permissions"], correct: 1, explanation: "DDL (Data Definition Language) is used for defining and modifying schema structures." }
];

let quiz2Timer = null;
window.startQuiz2Timer = function() {
  const randomDelay = Math.random() * 8000 + 15000;
  quiz2Timer = setTimeout(() => {
    if (Math.random() > 0.4) {
      const q = quiz2Questions[Math.floor(Math.random() * quiz2Questions.length)];
      displayQuiz2(q);
    }
    window.startQuiz2Timer();
  }, randomDelay);
};

window.displayQuiz2 = function(question) {
  const content = document.getElementById('quiz2Content');
  if (!content) return;
  let html = `<p style="margin-top: 0; font-size: 16px; font-weight: 500;">${question.question}</p>`;
  html += '<div style="margin: 20px 0;">';
  question.options.forEach((option, index) => {
    html += `<button onclick="checkAnswer2(${index}, ${question.correct}, '${question.explanation}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: var(--card); border-radius: 6px; text-align: left; cursor: pointer;">${option}</button>`;
  });
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal2').style.display = 'flex';
};

window.checkAnswer2 = function(selected, correct, explanation) {
  const content = document.getElementById('quiz2Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  let html = `<div style="background: ${resultColor}20; border-left: 4px solid ${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">`;
  html += `<p style="color: ${resultColor}; font-weight: 600; margin: 0 0 8px 0;">${resultMessage}</p>`;
  html += `<p style="margin: 0; color: var(--text);">${explanation}</p></div>`;
  html += '<button onclick="closeQuiz2()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 16px;">Got it!</button>';
  content.innerHTML = html;
};

window.closeQuiz2 = function() {
  const modal = document.getElementById('quizModal2');
  if (modal) modal.style.display = 'none';
};

window.initQuiz2 = function() {
  if (window.quiz2Timer) clearTimeout(window.quiz2Timer);
  window.startQuiz2Timer();
  renderSchema();
};

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('ddl-input')) {
    window.startQuiz2Timer();
  }
});