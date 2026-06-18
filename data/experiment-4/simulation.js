window.sim4_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>

    <div class="card" style="margin-bottom: 24px;">
      <h2 style="margin-top: 0;">Joins & Subqueries Simulator</h2>
      <p style="color: var(--muted); margin-bottom: 0;">
        Explore how <code>JOIN</code> operations merge data from multiple tables and how Subqueries can be used for nested data retrieval.
      </p>
    </div>

    <div class="simulation-layout">
      <div class="simulation-left" style="flex: 1;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Query Console</h2>
            <button onclick="openGuide4()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
          
          <div style="background: #1e293b; color: #f8fafc; font-family: monospace; padding: 16px; border-radius: 8px;">
            <textarea id="join-input" rows="5" style="width: 100%; background: transparent; color: #10b981; border: none; outline: none; resize: none; font-family: monospace; font-size: 14px;" placeholder="SELECT E.Name, D.DeptName 
FROM Employees E
INNER JOIN Departments D ON E.DeptID = D.DeptID;"></textarea>
          </div>
          
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button onclick="executeJoin()" style="background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; flex: 1;">Execute Query</button>
          </div>
          
          <div id="join-output" style="margin-top: 16px; padding: 12px; border-radius: 4px; display: none; font-family: monospace; font-size: 13px;"></div>
          
          <div style="margin-top: 24px;">
            <h3 style="margin-top: 0; font-size: 14px; color: var(--muted);">Quick Examples:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button onclick="loadJoinExample(0)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">INNER JOIN</button>
              <button onclick="loadJoinExample(1)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">LEFT JOIN</button>
              <button onclick="loadJoinExample(2)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">RIGHT JOIN</button>
              <button onclick="loadJoinExample(3)" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">SUBQUERY (MAX)</button>
            </div>
          </div>
        </div>
      </div>

      <div class="simulation-right" style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px;">
          <div class="card" style="flex: 1; padding: 16px; overflow-x: auto;">
            <h3 style="margin-top: 0; font-size: 14px; color: var(--primary);">Employees Table</h3>
            <table class="simulation-table" style="font-size: 12px;">
              <thead><tr><th>EmpID</th><th>Name</th><th>DeptID</th><th>Salary</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Alice</td><td>101</td><td>$60k</td></tr>
                <tr><td>2</td><td>Bob</td><td>102</td><td>$70k</td></tr>
                <tr><td>3</td><td>Charlie</td><td>NULL</td><td>$50k</td></tr>
                <tr><td>4</td><td>David</td><td>101</td><td>$80k</td></tr>
              </tbody>
            </table>
          </div>
          <div class="card" style="flex: 1; padding: 16px; overflow-x: auto;">
            <h3 style="margin-top: 0; font-size: 14px; color: var(--primary);">Departments Table</h3>
            <table class="simulation-table" style="font-size: 12px;">
              <thead><tr><th>DeptID</th><th>DeptName</th></tr></thead>
              <tbody>
                <tr><td>101</td><td>Engineering</td></tr>
                <tr><td>102</td><td>HR</td></tr>
                <tr><td>103</td><td>Marketing</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card sticky-result">
          <h2 style="margin-top: 0;">Query Result</h2>
          <div class="simulation-result" id="join-result-area">
            <p style="color: var(--muted); text-align: center; padding: 20px;">Run a query to see the joined results.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal4" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal4') closeGuide4()">
      <div style="background: var(--card); border-radius: 8px; max-width: 600px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0;">📖 Joins & Subqueries Guide</h2>
          <button onclick="closeGuide4()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div style="color: var(--text);">
          <p>Joins combine records from two or more tables based on a related column.</p>
          <ul>
            <li><strong>INNER JOIN:</strong> Returns records that have matching values in BOTH tables.</li>
            <li><strong>LEFT JOIN:</strong> Returns all records from the left table, and the matched records from the right table.</li>
            <li><strong>RIGHT JOIN:</strong> Returns all records from the right table, and the matched records from the left table.</li>
            <li><strong>Subquery:</strong> A query nested inside another query (e.g. <code>WHERE Salary = (SELECT MAX(Salary) FROM Employees)</code>).</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Quiz Modal -->
    <div id="quizModal4" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal4') closeQuiz4()">
      <div style="background: var(--card); border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz4()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz4Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

const employeesTable = [
  { EmpID: 1, Name: 'Alice', DeptID: 101, Salary: 60000 },
  { EmpID: 2, Name: 'Bob', DeptID: 102, Salary: 70000 },
  { EmpID: 3, Name: 'Charlie', DeptID: null, Salary: 50000 },
  { EmpID: 4, Name: 'David', DeptID: 101, Salary: 80000 }
];

const departmentsTable = [
  { DeptID: 101, DeptName: 'Engineering' },
  { DeptID: 102, DeptName: 'HR' },
  { DeptID: 103, DeptName: 'Marketing' }
];

const joinExamples = [
  "SELECT E.Name, D.DeptName\nFROM Employees E\nINNER JOIN Departments D ON E.DeptID = D.DeptID;",
  "SELECT E.Name, D.DeptName\nFROM Employees E\nLEFT JOIN Departments D ON E.DeptID = D.DeptID;",
  "SELECT E.Name, D.DeptName\nFROM Employees E\nRIGHT JOIN Departments D ON E.DeptID = D.DeptID;",
  "SELECT Name, Salary\nFROM Employees\nWHERE Salary = (SELECT MAX(Salary) FROM Employees);"
];

window.loadJoinExample = function(index) {
  document.getElementById('join-input').value = joinExamples[index];
};

window.executeJoin = function() {
  const input = document.getElementById('join-input').value.trim();
  const out = document.getElementById('join-output');
  const resultArea = document.getElementById('join-result-area');
  out.style.display = 'block';
  
  if (!input) {
    out.style.background = '#fee2e2'; out.style.color = '#ef4444';
    out.textContent = 'Error: Empty command.';
    return;
  }

  const uInput = input.toUpperCase().replace(/\n/g, ' ');
  let results = [];
  
  try {
    if (uInput.includes('INNER JOIN')) {
      employeesTable.forEach(emp => {
        departmentsTable.forEach(dept => {
          if (emp.DeptID === dept.DeptID) results.push({ Name: emp.Name, DeptName: dept.DeptName });
        });
      });
      out.textContent = 'Query OK. INNER JOIN executed.';
    } 
    else if (uInput.includes('LEFT JOIN')) {
      employeesTable.forEach(emp => {
        let matched = false;
        departmentsTable.forEach(dept => {
          if (emp.DeptID === dept.DeptID) {
            results.push({ Name: emp.Name, DeptName: dept.DeptName });
            matched = true;
          }
        });
        if (!matched) results.push({ Name: emp.Name, DeptName: 'NULL' });
      });
      out.textContent = 'Query OK. LEFT JOIN executed.';
    }
    else if (uInput.includes('RIGHT JOIN')) {
      departmentsTable.forEach(dept => {
        let matched = false;
        employeesTable.forEach(emp => {
          if (emp.DeptID === dept.DeptID) {
            results.push({ Name: emp.Name, DeptName: dept.DeptName });
            matched = true;
          }
        });
        if (!matched) results.push({ Name: 'NULL', DeptName: dept.DeptName });
      });
      out.textContent = 'Query OK. RIGHT JOIN executed.';
    }
    else if (uInput.includes('SUBQUERY') || uInput.includes('(SELECT')) {
      let maxSalary = Math.max(...employeesTable.map(e => e.Salary));
      results = employeesTable.filter(e => e.Salary === maxSalary).map(e => ({ Name: e.Name, Salary: '$' + (e.Salary/1000) + 'k' }));
      out.textContent = 'Query OK. Nested Subquery executed.';
    }
    else {
      throw new Error("Query type not fully supported in this simple simulation. Try the examples.");
    }
    
    out.style.background = '#dcfce7'; out.style.color = '#16a34a';
    
    if (results.length === 0) {
      resultArea.innerHTML = '<p style="color: var(--muted); text-align: center;">No results found.</p>';
      return;
    }
    
    const keys = Object.keys(results[0]);
    let html = '<table class="simulation-table"><thead><tr>';
    keys.forEach(key => { html += `<th>${key}</th>`; });
    html += '</tr></thead><tbody>';
    results.forEach(row => {
      html += '<tr>';
      keys.forEach(key => {
        let val = row[key];
        if (val === 'NULL') html += `<td style="color: var(--muted); font-style: italic;">NULL</td>`;
        else html += `<td>${val}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    resultArea.innerHTML = html;
    
  } catch (err) {
    out.style.background = '#fee2e2'; out.style.color = '#ef4444';
    out.textContent = 'ERROR: ' + err.message;
  }
};

window.openGuide4 = function() { document.getElementById('guideModal4').style.display = 'flex'; };
window.closeGuide4 = function() { document.getElementById('guideModal4').style.display = 'none'; };

const quiz4Questions = [
  { question: "If Charlie has a NULL DeptID, will he appear in an INNER JOIN?", options: ["Yes", "No"], correct: 1, explanation: "INNER JOIN requires a matching value in both tables. Since NULL does not match, Charlie is excluded." },
  { question: "Which JOIN includes all departments even if they have no employees?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN (if Departments is the right table)"], correct: 2, explanation: "RIGHT JOIN includes all records from the right table regardless of matches." }
];

let quiz4Timer = null;
window.startQuiz4Timer = function() {
  const randomDelay = Math.random() * 8000 + 15000;
  quiz4Timer = setTimeout(() => {
    if (Math.random() > 0.4) {
      const q = quiz4Questions[Math.floor(Math.random() * quiz4Questions.length)];
      displayQuiz4(q);
    }
    window.startQuiz4Timer();
  }, randomDelay);
};

window.displayQuiz4 = function(question) {
  const content = document.getElementById('quiz4Content');
  if (!content) return;
  let html = `<p style="margin-top: 0; font-size: 16px; font-weight: 500;">${question.question}</p>`;
  html += '<div style="margin: 20px 0;">';
  question.options.forEach((option, index) => {
    html += `<button onclick="checkAnswer4(${index}, ${question.correct}, '${question.explanation}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: var(--card); border-radius: 6px; text-align: left; cursor: pointer;">${option}</button>`;
  });
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal4').style.display = 'flex';
};

window.checkAnswer4 = function(selected, correct, explanation) {
  const content = document.getElementById('quiz4Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  let html = `<div style="background: ${resultColor}20; border-left: 4px solid ${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">`;
  html += `<p style="color: ${resultColor}; font-weight: 600; margin: 0 0 8px 0;">${resultMessage}</p>`;
  html += `<p style="margin: 0; color: var(--text);">${explanation}</p></div>`;
  html += '<button onclick="closeQuiz4()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 16px;">Got it!</button>';
  content.innerHTML = html;
};

window.closeQuiz4 = function() {
  const modal = document.getElementById('quizModal4');
  if (modal) modal.style.display = 'none';
};

window.initQuiz4 = function() {
  if (window.quiz4Timer) clearTimeout(window.quiz4Timer);
  window.startQuiz4Timer();
};

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('join-input')) {
    window.startQuiz4Timer();
  }
});