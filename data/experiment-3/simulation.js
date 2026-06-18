window.sim3_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>

    <div class="card" style="margin-bottom: 24px;">
      <h2 style="margin-top: 0;">Data Manipulation Language (DML) Simulator</h2>
      <p style="color: var(--muted); margin-bottom: 0;">
        Use DML commands to modify data within the table. Try executing commands like <code>INSERT INTO</code>, <code>UPDATE</code>, and <code>DELETE FROM</code>.
      </p>
    </div>

    <div class="simulation-layout">
      <div class="simulation-left" style="flex: 1;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">DML Console</h2>
            <button onclick="openGuide3()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
          
          <div style="background: #1e293b; color: #f8fafc; font-family: monospace; padding: 16px; border-radius: 8px;">
            <textarea id="dml-input" rows="4" style="width: 100%; background: transparent; color: #10b981; border: none; outline: none; resize: none; font-family: monospace; font-size: 14px;" placeholder="INSERT INTO Students (ID, Name, Major) VALUES (4, 'David', 'Physics');"></textarea>
          </div>
          
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button onclick="executeDML()" style="background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; flex: 1;">Execute Command</button>
            <button onclick="resetDML()" style="background: var(--muted); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Reset Data</button>
          </div>
          
          <div id="dml-output" style="margin-top: 16px; padding: 12px; border-radius: 4px; display: none; font-family: monospace; font-size: 13px;"></div>
          
          <div style="margin-top: 24px;">
            <h3 style="margin-top: 0; font-size: 14px; color: var(--muted);">Quick Examples:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button onclick="loadDMLExample(0)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">INSERT</button>
              <button onclick="loadDMLExample(1)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">UPDATE</button>
              <button onclick="loadDMLExample(2)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">DELETE</button>
              <button onclick="loadDMLExample(3)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">SELECT</button>
            </div>
          </div>
        </div>
      </div>

      <div class="simulation-right" style="flex: 1;">
        <div class="card sticky-result">
          <h2>Students Table</h2>
          <div class="simulation-result">
            <table class="simulation-table" id="dmlTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Major</th>
                </tr>
              </thead>
              <tbody id="dmlTableBody">
              </tbody>
            </table>
          </div>
          <div id="select-result" style="display:none; margin-top: 20px;">
            <h3 style="margin-top: 0;">Query Result</h3>
            <div class="simulation-result" id="select-output"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal3" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal3') closeGuide3()">
      <div style="background: white; border-radius: 8px; max-width: 600px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0;">📖 DML Guide</h2>
          <button onclick="closeGuide3()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div style="color: var(--text);">
          <p>Data Manipulation Language commands modify the data inside the tables.</p>
          <ul>
            <li><strong>INSERT:</strong> Adds new rows. <code>INSERT INTO table (col) VALUES (val);</code></li>
            <li><strong>UPDATE:</strong> Modifies existing rows. Always use WHERE! <code>UPDATE table SET col = val WHERE id = 1;</code></li>
            <li><strong>DELETE:</strong> Removes existing rows. <code>DELETE FROM table WHERE id = 1;</code></li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Quiz Modal -->
    <div id="quizModal3" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal3') closeQuiz3()">
      <div style="background: white; border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz3()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz3Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

let dmlData = [];
const initialDmlData = [
  { id: 1, name: 'Alice', major: 'Computer Science' },
  { id: 2, name: 'Bob', major: 'Mathematics' },
  { id: 3, name: 'Charlie', major: 'Physics' }
];

const dmlExamples = [
  "INSERT INTO Students (ID, Name, Major) VALUES (4, 'David', 'Chemistry');",
  "UPDATE Students SET Major = 'Software Engineering' WHERE ID = 1;",
  "DELETE FROM Students WHERE ID = 2;",
  "SELECT * FROM Students;"
];

window.loadDMLExample = function(index) {
  document.getElementById('dml-input').value = dmlExamples[index];
};

window.renderDMLTable = function(highlightId = null) {
  const tbody = document.getElementById('dmlTableBody');
  tbody.innerHTML = '';
  dmlData.forEach(row => {
    const tr = document.createElement('tr');
    if (row.id == highlightId) {
      tr.style.backgroundColor = '#fef08a';
      tr.style.transition = 'background-color 0.5s';
      setTimeout(() => { tr.style.backgroundColor = ''; }, 1500);
    }
    tr.innerHTML = `<td>${row.id}</td><td>${row.name}</td><td>${row.major}</td>`;
    tbody.appendChild(tr);
  });
};

window.executeDML = function() {
  const input = document.getElementById('dml-input').value.trim();
  const out = document.getElementById('dml-output');
  const selRes = document.getElementById('select-result');
  out.style.display = 'block';
  selRes.style.display = 'none';
  
  if (!input) {
    out.style.background = '#fee2e2'; out.style.color = '#ef4444';
    out.textContent = 'Error: Empty command.';
    return;
  }

  const uInput = input.toUpperCase().replace(/\\n/g, ' ');
  
  try {
    if (uInput.startsWith('INSERT INTO')) {
      const match = input.match(/VALUES\s*\\((.+)\\)/i);
      if (match) {
        const vals = match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
        const newRow = { id: parseInt(vals[0]), name: vals[1], major: vals[2] };
        if (dmlData.find(r => r.id === newRow.id)) throw new Error("Primary Key Violation: ID " + newRow.id + " already exists.");
        dmlData.push(newRow);
        out.style.background = '#dcfce7'; out.style.color = '#16a34a';
        out.textContent = 'Query OK, 1 row inserted.';
        renderDMLTable(newRow.id);
      } else {
        throw new Error("Syntax Error in INSERT statement.");
      }
    } 
    else if (uInput.startsWith('UPDATE')) {
      const setMatch = input.match(/SET\s+(\\w+)\s*=\s*(['"\\w]+)/i);
      const whereMatch = input.match(/WHERE\s+(\\w+)\s*=\s*(['"\\w]+)/i);
      
      if (!whereMatch) throw new Error("Safe Update Mode: You must use a WHERE clause.");
      if (setMatch) {
        const colToUpdate = setMatch[1].toLowerCase();
        const newVal = setMatch[2].replace(/['"]/g, '');
        const whereCol = whereMatch[1].toLowerCase();
        const whereVal = whereMatch[2].replace(/['"]/g, '');
        
        let affected = 0;
        let lastId = null;
        dmlData.forEach(row => {
          if (row[whereCol] == whereVal) {
            row[colToUpdate] = newVal;
            affected++;
            lastId = row.id;
          }
        });
        out.style.background = '#dcfce7'; out.style.color = '#16a34a';
        out.textContent = 'Query OK, ' + affected + ' rows updated.';
        renderDMLTable(lastId);
      } else {
        throw new Error("Syntax Error in UPDATE statement.");
      }
    }
    else if (uInput.startsWith('DELETE FROM')) {
      const whereMatch = input.match(/WHERE\s+(\\w+)\s*=\s*(['"\\w]+)/i);
      if (!whereMatch) throw new Error("Safe Update Mode: You must use a WHERE clause.");
      
      const whereCol = whereMatch[1].toLowerCase();
      const whereVal = whereMatch[2].replace(/['"]/g, '');
      
      const initialLen = dmlData.length;
      dmlData = dmlData.filter(row => row[whereCol] != whereVal);
      const affected = initialLen - dmlData.length;
      
      out.style.background = '#dcfce7'; out.style.color = '#16a34a';
      out.textContent = 'Query OK, ' + affected + ' rows deleted.';
      renderDMLTable();
    }
    else if (uInput.startsWith('SELECT')) {
      out.style.background = '#dcfce7'; out.style.color = '#16a34a';
      out.textContent = 'Query OK.';
      selRes.style.display = 'block';
      let html = '<table class="simulation-table"><thead><tr><th>ID</th><th>Name</th><th>Major</th></tr></thead><tbody>';
      dmlData.forEach(row => {
        html += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.major}</td></tr>`;
      });
      html += '</tbody></table>';
      document.getElementById('select-output').innerHTML = html;
    }
    else {
      throw new Error("Command not supported in this DML simulator.");
    }
  } catch (err) {
    out.style.background = '#fee2e2'; out.style.color = '#ef4444';
    out.textContent = 'ERROR: ' + err.message;
  }
};

window.resetDML = function() {
  dmlData = JSON.parse(JSON.stringify(initialDmlData));
  document.getElementById('dml-input').value = '';
  document.getElementById('dml-output').style.display = 'none';
  document.getElementById('select-result').style.display = 'none';
  renderDMLTable();
};

window.openGuide3 = function() { document.getElementById('guideModal3').style.display = 'flex'; };
window.closeGuide3 = function() { document.getElementById('guideModal3').style.display = 'none'; };

const quiz3Questions = [
  { question: "Which command adds new records?", options: ["ADD", "CREATE", "INSERT", "APPEND"], correct: 2, explanation: "INSERT INTO is the correct syntax for adding new rows." },
  { question: "Why is the WHERE clause critical in UPDATE and DELETE?", options: ["It is not critical", "It prevents modifying all rows", "It speeds up the query", "It sorts the data"], correct: 1, explanation: "Without a WHERE clause, UPDATE/DELETE will modify or delete ALL records in the table." }
];

let quiz3Timer = null;
window.startQuiz3Timer = function() {
  const randomDelay = Math.random() * 8000 + 15000;
  quiz3Timer = setTimeout(() => {
    if (Math.random() > 0.4) {
      const q = quiz3Questions[Math.floor(Math.random() * quiz3Questions.length)];
      displayQuiz3(q);
    }
    window.startQuiz3Timer();
  }, randomDelay);
};

window.displayQuiz3 = function(question) {
  const content = document.getElementById('quiz3Content');
  if (!content) return;
  let html = `<p style="margin-top: 0; font-size: 16px; font-weight: 500;">${question.question}</p>`;
  html += '<div style="margin: 20px 0;">';
  question.options.forEach((option, index) => {
    html += `<button onclick="checkAnswer3(${index}, ${question.correct}, '${question.explanation}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: white; border-radius: 6px; text-align: left; cursor: pointer;">${option}</button>`;
  });
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal3').style.display = 'flex';
};

window.checkAnswer3 = function(selected, correct, explanation) {
  const content = document.getElementById('quiz3Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  let html = `<div style="background: ${resultColor}20; border-left: 4px solid ${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">`;
  html += `<p style="color: ${resultColor}; font-weight: 600; margin: 0 0 8px 0;">${resultMessage}</p>`;
  html += `<p style="margin: 0; color: var(--text);">${explanation}</p></div>`;
  html += '<button onclick="closeQuiz3()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 16px;">Got it!</button>';
  content.innerHTML = html;
};

window.closeQuiz3 = function() {
  const modal = document.getElementById('quizModal3');
  if (modal) modal.style.display = 'none';
};

window.initQuiz3 = function() {
  if (window.quiz3Timer) clearTimeout(window.quiz3Timer);
  window.startQuiz3Timer();
  resetDML();
};

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('dml-input')) {
    window.startQuiz3Timer();
    resetDML();
  }
});