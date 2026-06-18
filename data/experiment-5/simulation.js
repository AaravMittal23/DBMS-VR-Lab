window.sim5_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>

    <div class="card">
      <h2>Sample Data: Employees Table</h2>
      <p style="color: var(--muted); margin-bottom: 16px;">
        The following table contains sample employee data. Use the query builder below to experiment with aggregate functions and grouping operations.
      </p>
      
      <div class="simulation-result">
        <table class="simulation-table" id="dataTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody id="dataTableBody">
          </tbody>
        </table>
      </div>
    </div>

    <div class="simulation-layout">
      <div class="simulation-left">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Query Builder</h2>
            <button onclick="openGuide5()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
          
          <div class="simulation-controls">
            <label for="queryType">Select Query Type:</label>
            <select id="queryType">
              <option value="count">COUNT - Count employees</option>
              <option value="countGroup">COUNT with GROUP BY - Count per department</option>
              <option value="sum">SUM - Total salary</option>
              <option value="sumGroup">SUM with GROUP BY - Total salary per department</option>
              <option value="avg">AVG - Average salary</option>
              <option value="avgGroup">AVG with GROUP BY - Average salary per department</option>
              <option value="minMax">MIN/MAX - Min and Max salary</option>
              <option value="minMaxGroup">MIN/MAX with GROUP BY - Min/Max per department</option>
              <option value="having">HAVING - Departments with count > 2</option>
              <option value="complex">Complex - Multiple aggregates with HAVING</option>
            </select>
            
            <label for="customQuery" style="margin-top: 16px;">Or write custom SQL:</label>
            <textarea id="customQuery" rows="4" placeholder="SELECT department, COUNT(*) FROM employees GROUP BY department;"></textarea>
            
            <button onclick="executeQuery()" style="margin-top: 12px;">Execute Query</button>
            <button onclick="resetQuery()" style="background: var(--muted);">Reset</button>
          </div>
        </div>

        <div class="card">
          <h2>Query Examples</h2>
          <div class="grid">
            <div class="card">
              <h3>Basic COUNT</h3>
              <pre>SELECT COUNT(*) 
FROM employees;</pre>
              <button onclick="runExample('SELECT COUNT(*) AS total FROM employees;')" style="margin-top: 8px; width: 100%;">Run Example</button>
            </div>
            
            <div class="card">
              <h3>COUNT with GROUP BY</h3>
              <pre>SELECT department, 
       COUNT(*) AS count
FROM employees 
GROUP BY department;</pre>
              <button onclick="runExample('SELECT department, COUNT(*) AS count FROM employees GROUP BY department;')" style="margin-top: 8px; width: 100%;">Run Example</button>
            </div>
            
            <div class="card">
              <h3>AVG with GROUP BY</h3>
              <pre>SELECT department, 
       AVG(salary) AS avg_salary
FROM employees 
GROUP BY department;</pre>
              <button onclick="runExample('SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department;')" style="margin-top: 8px; width: 100%;">Run Example</button>
            </div>
            
            <div class="card">
              <h3>HAVING Clause</h3>
              <pre>SELECT department, 
       COUNT(*) AS count
FROM employees 
GROUP BY department 
HAVING COUNT(*) > 2;</pre>
              <button onclick="runExample('SELECT department, COUNT(*) AS count FROM employees GROUP BY department HAVING COUNT(*) > 2;')" style="margin-top: 8px; width: 100%;">Run Example</button>
            </div>
          </div>
        </div>
      </div>

      <div class="simulation-right">
        <div class="card sticky-result">
          <h2>Query Result</h2>
          <div class="simulation-result" id="resultArea">
            <p style="color: var(--muted); text-align: center; padding: 20px;">
              Select a query type or write a custom query and click "Execute Query" to see results.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal5" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal5') closeGuide5()">
      <div style="background: var(--card); border-radius: 8px; max-width: 600px; max-height: 80vh; overflow-y: auto; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0;">📖 SQL Aggregate Functions Guide</h2>
          <button onclick="closeGuide5()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        
        <div style="color: var(--text);">
          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); margin-top: 0;">COUNT</h3>
            <p><strong>Purpose:</strong> Counts the number of rows or non-null values in a column.</p>
            <code style="background: #f0f0f0; padding: 8px; border-radius: 4px; display: block; font-size: 12px;">SELECT COUNT(*) FROM employees;</code>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); margin-top: 0;">SUM</h3>
            <p><strong>Purpose:</strong> Adds up all values in a numeric column.</p>
            <code style="background: #f0f0f0; padding: 8px; border-radius: 4px; display: block; font-size: 12px;">SELECT SUM(salary) FROM employees;</code>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); margin-top: 0;">AVG</h3>
            <p><strong>Purpose:</strong> Calculates the average (mean) of numeric values.</p>
            <code style="background: #f0f0f0; padding: 8px; border-radius: 4px; display: block; font-size: 12px;">SELECT AVG(salary) FROM employees;</code>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); margin-top: 0;">MIN / MAX</h3>
            <p><strong>Purpose:</strong> Find the smallest or largest value in a column.</p>
            <code style="background: #f0f0f0; padding: 8px; border-radius: 4px; display: block; font-size: 12px;">SELECT MIN(salary), MAX(salary) FROM employees;</code>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); margin-top: 0;">GROUP BY</h3>
            <p><strong>Purpose:</strong> Groups rows with the same values in specified columns and applies aggregate functions to each group.</p>
            <code style="background: #f0f0f0; padding: 8px; border-radius: 4px; display: block; font-size: 12px;">SELECT department, COUNT(*) FROM employees GROUP BY department;</code>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary); margin-top: 0;">HAVING</h3>
            <p><strong>Purpose:</strong> Filters groups based on aggregate function conditions (like WHERE but for grouped data).</p>
            <code style="background: #f0f0f0; padding: 8px; border-radius: 4px; display: block; font-size: 12px;">SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 2;</code>
          </div>

          <div style="background: var(--yellow-light); padding: 16px; border-radius: 8px; margin-top: 20px;">
            <h4 style="margin-top: 0;">💡 Tip</h4>
            <p style="margin-bottom: 0;">Always use GROUP BY when combining aggregate functions with non-aggregated columns. For example, if you want to count employees by department, both department and COUNT(*) should be selected.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Modal -->
    <div id="quizModal5" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal5') closeQuiz5()">
      <div style="background: var(--card); border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz5()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz5Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

// Port of inline script from old Experiment-1 simulation
const employees = [
  { id: 1, name: 'John Doe', department: 'IT', salary: 75000, age: 28 },
  { id: 2, name: 'Jane Smith', department: 'HR', salary: 60000, age: 32 },
  { id: 3, name: 'Bob Johnson', department: 'IT', salary: 80000, age: 35 },
  { id: 4, name: 'Alice Williams', department: 'Finance', salary: 70000, age: 29 },
  { id: 5, name: 'Charlie Brown', department: 'IT', salary: 72000, age: 26 },
  { id: 6, name: 'Diana Prince', department: 'HR', salary: 65000, age: 31 },
  { id: 7, name: 'Edward Lee', department: 'Sales', salary: 55000, age: 27 },
  { id: 8, name: 'Fiona Green', department: 'Finance', salary: 68000, age: 33 },
  { id: 9, name: 'George White', department: 'Sales', salary: 58000, age: 30 },
  { id: 10, name: 'Helen Black', department: 'IT', salary: 78000, age: 34 },
  { id: 11, name: 'Ivan Gray', department: 'HR', salary: 62000, age: 28 },
  { id: 12, name: 'Julia Red', department: 'Sales', salary: 56000, age: 25 }
];

// Quiz Questions for Experiment 1
const quiz5Questions = [
  {
    question: "Which SQL function is used to count the total number of rows?",
    options: ["COUNT(*)", "SUM(*)", "TOTAL(*)", "ROWS()"],
    correct: 0,
    explanation: "COUNT(*) counts all rows in a table, including rows with NULL values."
  },
  {
    question: "What clause is required when using aggregate functions with non-aggregated columns?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    correct: 2,
    explanation: "GROUP BY groups rows by the specified columns so aggregates can be applied to each group."
  },
  {
    question: "What does the HAVING clause do?",
    options: ["Filters rows before grouping", "Filters columns", "Filters groups after aggregation", "Orders the results"],
    correct: 2,
    explanation: "HAVING filters groups based on aggregate function conditions, similar to WHERE but for GROUP BY."
  }
];

let quiz5Timer = null;

function startQuiz5Timer() {
  const randomDelay = Math.random() * 8000 + 15000; // 15-23 seconds
  console.log('Quiz5 Timer started, will show quiz in', Math.round(randomDelay/1000), 'seconds');
  quiz5Timer = setTimeout(() => {
    showRandomQuiz5();
    startQuiz5Timer(); // Restart timer for next quiz
  }, randomDelay);
}

function showRandomQuiz5() {
  if (Math.random() > 0.4) { // 60% chance to show quiz
    const randomIndex = Math.floor(Math.random() * quiz5Questions.length);
    const question = quiz5Questions[randomIndex];
    displayQuiz5(question);
  }
}

function displayQuiz5(question) {
  console.log('Displaying Quiz5:', question.question);
  const content = document.getElementById('quiz5Content');
  if (!content) return;
  
  let html = `<p style="margin-top: 0; font-size: 16px; font-weight: 500;">${question.question}</p>`;
  html += '<div style="margin: 20px 0;">';
  
  question.options.forEach((option, index) => {
    const isCorrect = index === question.correct;
    html += `<button onclick="checkAnswer5(${index}, ${question.correct}, '${question.explanation}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: var(--card); border-radius: 6px; text-align: left; cursor: pointer; transition: all 0.2s;">${option}</button>`;
  });
  
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal5').style.display = 'flex';
}

function checkAnswer5(selected, correct, explanation) {
  const content = document.getElementById('quiz5Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  
  let html = `<div style="background: ${resultColor}20; border-left: 4px solid ${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">`;
  html += `<p style="color: ${resultColor}; font-weight: 600; margin: 0 0 8px 0;">${resultMessage}</p>`;
  html += `<p style="margin: 0; color: var(--text);">${explanation}</p>`;
  html += '</div>';
  html += '<button onclick="closeQuiz5()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 16px;">Got it!</button>';
  
  content.innerHTML = html;
}

function closeQuiz5() {
  const modal = document.getElementById('quizModal5');
  if (modal) modal.style.display = 'none';
}


function openGuide5() {
  const modal = document.getElementById('guideModal5');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeGuide5() {
  const modal = document.getElementById('guideModal5');
  if (modal) {
    modal.style.display = 'none';
  }
}

function initDataTable() {
  const tbody = document.getElementById('dataTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  employees.forEach(emp => {
    const row = tbody.insertRow();
    row.insertCell(0).textContent = emp.id;
    row.insertCell(1).textContent = emp.name;
    row.insertCell(2).textContent = emp.department;
    row.insertCell(3).textContent = '$' + emp.salary.toLocaleString();
    row.insertCell(4).textContent = emp.age;
  });
}

function updateQueryBuilder() {
  const select = document.getElementById('queryType');
  const textarea = document.getElementById('customQuery');
  if (!select || !textarea) return;
  const queryType = select.value;
  const queries = {
    'count': 'SELECT COUNT(*) AS total FROM employees;',
    'countGroup': 'SELECT department, COUNT(*) AS count FROM employees GROUP BY department;',
    'sum': 'SELECT SUM(salary) AS total_salary FROM employees;',
    'sumGroup': 'SELECT department, SUM(salary) AS total_salary FROM employees GROUP BY department;',
    'avg': 'SELECT AVG(salary) AS avg_salary FROM employees;',
    'avgGroup': 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department;',
    'minMax': 'SELECT MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees;',
    'minMaxGroup': 'SELECT department, MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees GROUP BY department;',
    'having': 'SELECT department, COUNT(*) AS count FROM employees GROUP BY department HAVING COUNT(*) > 2;',
    'complex': 'SELECT department, COUNT(*) AS count, AVG(salary) AS avg_salary, SUM(salary) AS total FROM employees GROUP BY department HAVING COUNT(*) > 2 ORDER BY avg_salary DESC;'
  };
  textarea.value = queries[queryType] || '';
}

function executeQuery() {
  const textarea = document.getElementById('customQuery');
  const resultArea = document.getElementById('resultArea');
  if (!textarea || !resultArea) return;

  const query = textarea.value.trim().toUpperCase();
  if (!query) {
    resultArea.innerHTML = '<p style="color: #dc2626;">Please enter a query.</p>';
    return;
  }

  let result;

  if (query.includes('COUNT(*)') && !query.includes('GROUP BY')) {
    result = executeCount();
  } else if (query.includes('COUNT') && query.includes('GROUP BY')) {
    result = executeCountGroupBy();
  } else if (query.includes('SUM(SALARY)') && !query.includes('GROUP BY')) {
    result = executeSum();
  } else if (query.includes('SUM(SALARY)') && query.includes('GROUP BY')) {
    result = executeSumGroupBy();
  } else if (query.includes('AVG(SALARY)') && !query.includes('GROUP BY')) {
    result = executeAvg();
  } else if (query.includes('AVG(SALARY)') && query.includes('GROUP BY')) {
    result = executeAvgGroupBy();
  } else if (query.includes('MIN(SALARY)') && query.includes('MAX(SALARY)') && !query.includes('GROUP BY')) {
    result = executeMinMax();
  } else if (query.includes('MIN(SALARY)') && query.includes('MAX(SALARY)') && query.includes('GROUP BY')) {
    result = executeMinMaxGroupBy();
  } else if (query.includes('HAVING') && !query.includes('AVG(') && !query.includes('SUM(')) {
    result = executeHaving();
  } else if (query.includes('GROUP BY') && query.includes('HAVING')) {
    result = executeComplex();
  } else {
    resultArea.innerHTML = '<p style="color: #dc2626;">Query not supported. Please use the query builder or try the examples.</p>';
    return;
  }

  displayResult(result);
}

function executeCount() {
  return [{ total: employees.length }];
}

function executeCountGroupBy() {
  const groups = {};
  employees.forEach(emp => {
    groups[emp.department] = (groups[emp.department] || 0) + 1;
  });
  return Object.entries(groups).map(([department, count]) => ({ department, count }));
}

function executeSum() {
  const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
  return [{ total_salary: total }];
}

function executeSumGroupBy() {
  const groups = {};
  employees.forEach(emp => {
    groups[emp.department] = (groups[emp.department] || 0) + emp.salary;
  });
  return Object.entries(groups).map(([department, total_salary]) => ({ department, total_salary }));
}

function executeAvg() {
  const avg = employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length;
  return [{ avg_salary: Math.round(avg) }];
}

function executeAvgGroupBy() {
  const groups = {};
  employees.forEach(emp => {
    if (!groups[emp.department]) {
      groups[emp.department] = { sum: 0, count: 0 };
    }
    groups[emp.department].sum += emp.salary;
    groups[emp.department].count++;
  });
  return Object.entries(groups).map(([department, data]) => ({
    department,
    avg_salary: Math.round(data.sum / data.count)
  }));
}

function executeMinMax() {
  const salaries = employees.map(emp => emp.salary);
  return [{ min_salary: Math.min(...salaries), max_salary: Math.max(...salaries) }];
}

function executeMinMaxGroupBy() {
  const groups = {};
  employees.forEach(emp => {
    if (!groups[emp.department]) {
      groups[emp.department] = [];
    }
    groups[emp.department].push(emp.salary);
  });
  return Object.entries(groups).map(([department, salaries]) => ({
    department,
    min_salary: Math.min(...salaries),
    max_salary: Math.max(...salaries)
  }));
}

function executeHaving() {
  const groups = {};
  employees.forEach(emp => {
    groups[emp.department] = (groups[emp.department] || 0) + 1;
  });
  return Object.entries(groups)
    .filter(([_, count]) => count > 2)
    .map(([department, count]) => ({ department, count }));
}

function executeComplex() {
  const groups = {};
  employees.forEach(emp => {
    if (!groups[emp.department]) {
      groups[emp.department] = { sum: 0, count: 0 };
    }
    groups[emp.department].sum += emp.salary;
    groups[emp.department].count++;
  });

  let result = Object.entries(groups)
    .filter(([_, data]) => data.count > 2)
    .map(([department, data]) => ({
      department,
      count: data.count,
      avg_salary: Math.round(data.sum / data.count),
      total: data.sum
    }));

  const textarea = document.getElementById('customQuery');
  if (textarea && textarea.value.toUpperCase().includes('ORDER BY')) {
    result.sort((a, b) => b.avg_salary - a.avg_salary);
  }

  return result;
}

function displayResult(result) {
  const resultArea = document.getElementById('resultArea');
  if (!resultArea) return;

  if (!result || result.length === 0) {
    resultArea.innerHTML = '<p style="color: var(--muted);">No results found.</p>';
    return;
  }

  const keys = Object.keys(result[0]);
  let html = '<table class="simulation-table"><thead><tr>';
  keys.forEach(key => {
    html += `<th>${key.replace(/_/g, ' ').toUpperCase()}</th>`;
  });
  html += '</tr></thead><tbody>';

  result.forEach(row => {
    html += '<tr>';
    keys.forEach(key => {
      let value = row[key];
      if (typeof value === 'number' && (key.includes('salary') || key.includes('total'))) {
        value = '$' + value.toLocaleString();
      }
      html += `<td>${value}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  resultArea.innerHTML = html;
}

function resetQuery() {
  const textarea = document.getElementById('customQuery');
  const select = document.getElementById('queryType');
  const resultArea = document.getElementById('resultArea');
  if (textarea) textarea.value = '';
  if (select) select.value = 'count';
  if (resultArea) {
    resultArea.innerHTML = '<p style="color: var(--muted); text-align: center; padding: 20px;">Select a query type or write a custom query and click "Execute Query" to see results.</p>';
  }
}

function runExample(query) {
  const textarea = document.getElementById('customQuery');
  if (!textarea) return;
  textarea.value = query;
  executeQuery();
}

// Initialize quiz for Experiment 1 (called from app.js after DOM is ready)
window.initQuiz5 = function() {
  if (document.getElementById('dataTableBody')) {
    initDataTable();
    // Start quiz timer for this session
    if (window.quiz5Timer) clearTimeout(window.quiz5Timer);
    startQuiz5Timer();
  }
};

// Initialize once the SPA has injected this simulation content
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('dataTableBody')) {
    initDataTable();
    startQuiz5Timer();
  }
});
