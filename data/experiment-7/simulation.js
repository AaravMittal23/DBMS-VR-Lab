/**
 * Simulation for Experiment 3: Database Normalization
 * Step-through from unnormalized → 1NF → 2NF → 3NF
 *
 * IMPORTANT: Uses window.sim7_renderSimulation (not window.sim5_renderSimulation)
 * so it does not collide with experiment-2's simulation when both scripts
 * are cached by the browser in the same session.
 */

window.sim7_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2 style="margin:0">Database Normalization Simulation</h2>
        <button onclick="openGuide7()" style="background:var(--accent);color:white;padding:8px 16px;border:none;border-radius:4px;cursor:pointer;font-weight:600">📖 Guide</button>
      </div>
      <p style="color:var(--muted);margin-bottom:16px">
        Follow the steps below to understand how to normalize a database relation using functional dependencies.
      </p>
      <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
        <button onclick="sim7_showStep(0)" id="sim7_step0Btn" class="step-button active">Original Relation</button>
        <button onclick="sim7_showStep(1)" id="sim7_step1Btn" class="step-button">Step 1: 1NF</button>
        <button onclick="sim7_showStep(2)" id="sim7_step2Btn" class="step-button">Step 2: 2NF</button>
        <button onclick="sim7_showStep(3)" id="sim7_step3Btn" class="step-button">Step 3: 3NF</button>
      </div>
    </div>

    <!-- Step 0: Original -->
    <div id="sim7_step0" class="simulation-step">
      <div class="card">
        <h2>Original Unnormalized Relation</h2>
        <div class="card" style="background:#fff5f5;border-left:4px solid #dc2626">
          <h3>Student_Course Relation (Unnormalized)</h3>
          <div class="simulation-result">
            <table class="simulation-table">
              <thead><tr><th>student_id</th><th>student_name</th><th>dept_id</th><th>dept_name</th><th>course_id</th><th>course_name</th><th>instructor</th><th>grade</th></tr></thead>
              <tbody>
                <tr><td>S001</td><td>John Doe</td><td>D01</td><td>Computer Science</td><td>C001</td><td>Database Systems</td><td>Dr. Smith</td><td>A</td></tr>
                <tr><td>S001</td><td>John Doe</td><td>D01</td><td>Computer Science</td><td>C002</td><td>Data Structures</td><td>Dr. Johnson</td><td>B</td></tr>
                <tr><td>S002</td><td>Jane Smith</td><td>D01</td><td>Computer Science</td><td>C001</td><td>Database Systems</td><td>Dr. Smith</td><td>A</td></tr>
                <tr><td>S003</td><td>Bob Wilson</td><td>D02</td><td>Mathematics</td><td>C003</td><td>Calculus</td><td>Dr. Brown</td><td>B</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card" style="margin-top:20px">
          <h3>Functional Dependencies Identified:</h3>
          <div style="background:#f8fafc;padding:16px;border-radius:8px;font-family:monospace">
            <div>student_id → student_name, dept_id</div>
            <div>dept_id → dept_name</div>
            <div>course_id → course_name, instructor</div>
            <div>student_id, course_id → grade</div>
          </div>
        </div>
        <div class="card" style="margin-top:20px;background:var(--yellow-light)">
          <h3>Problems Identified:</h3>
          <ul>
            <li><strong>Data Redundancy:</strong> Student name and dept info is repeated for each enrollment</li>
            <li><strong>Update Anomaly:</strong> Changing a student's name requires updating multiple rows</li>
            <li><strong>Insertion Anomaly:</strong> Cannot add a new department without a student</li>
            <li><strong>Deletion Anomaly:</strong> Deleting a student's last enrollment may lose dept info</li>
            <li><strong>Partial Dependency:</strong> student_name depends only on student_id (part of composite key)</li>
            <li><strong>Transitive Dependency:</strong> dept_name depends on dept_id, which depends on student_id</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Step 1: 1NF -->
    <div id="sim7_step1" class="simulation-step" style="display:none">
      <div class="card">
        <h2>Step 1: First Normal Form (1NF)</h2>
        <p style="color:var(--muted);margin-bottom:20px">All attributes already contain atomic values. The relation is in 1NF. Primary Key: (student_id, course_id)</p>
        <div class="card" style="background:#fff5f5;border-left:4px solid #f59e0b">
          <div class="simulation-result">
            <table class="simulation-table">
              <thead><tr><th>student_id PK</th><th>student_name</th><th>dept_id</th><th>dept_name</th><th>course_id PK</th><th>course_name</th><th>instructor</th><th>grade</th></tr></thead>
              <tbody>
                <tr><td>S001</td><td>John Doe</td><td>D01</td><td>Computer Science</td><td>C001</td><td>Database Systems</td><td>Dr. Smith</td><td>A</td></tr>
                <tr><td>S001</td><td>John Doe</td><td>D01</td><td>Computer Science</td><td>C002</td><td>Data Structures</td><td>Dr. Johnson</td><td>B</td></tr>
                <tr><td>S002</td><td>Jane Smith</td><td>D01</td><td>Computer Science</td><td>C001</td><td>Database Systems</td><td>Dr. Smith</td><td>A</td></tr>
                <tr><td>S003</td><td>Bob Wilson</td><td>D02</td><td>Mathematics</td><td>C003</td><td>Calculus</td><td>Dr. Brown</td><td>B</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card" style="margin-top:20px;background:var(--yellow-light)">
          <p>✓ All attributes contain atomic values<br>✓ No repeating groups<br>✓ Relation is in 1NF<br><br>
          <strong>Note:</strong> Still has redundancy and anomalies — proceed to 2NF.</p>
        </div>
      </div>
    </div>

    <!-- Step 2: 2NF -->
    <div id="sim7_step2" class="simulation-step" style="display:none">
      <div class="card">
        <h2>Step 2: Second Normal Form (2NF)</h2>
        <p style="color:var(--muted);margin-bottom:20px">Eliminate partial dependencies. student_name and dept_id depend only on student_id.</p>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px">
          <div class="card" style="background:#f0fdf4;border-left:4px solid #10b981">
            <h3>Enrollment (2NF) — PK: (student_id, course_id)</h3>
            <div class="simulation-result">
              <table class="simulation-table">
                <thead><tr><th>student_id PK+FK</th><th>course_id PK+FK</th><th>grade</th></tr></thead>
                <tbody><tr><td>S001</td><td>C001</td><td>A</td></tr><tr><td>S001</td><td>C002</td><td>B</td></tr><tr><td>S002</td><td>C001</td><td>A</td></tr><tr><td>S003</td><td>C003</td><td>B</td></tr></tbody>
              </table>
            </div>
          </div>
          <div class="card" style="background:#f0fdf4;border-left:4px solid #10b981">
            <h3>Student (2NF) — PK: student_id</h3>
            <div class="simulation-result">
              <table class="simulation-table">
                <thead><tr><th>student_id PK</th><th>student_name</th><th>dept_id FK</th><th>dept_name</th></tr></thead>
                <tbody><tr><td>S001</td><td>John Doe</td><td>D01</td><td>Computer Science</td></tr><tr><td>S002</td><td>Jane Smith</td><td>D01</td><td>Computer Science</td></tr><tr><td>S003</td><td>Bob Wilson</td><td>D02</td><td>Mathematics</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card" style="margin-top:20px;background:#fef3c7;border-left:4px solid #f59e0b">
          <h3>⚠️ Still Not Fully Normalized</h3>
          <p>Student relation has a <strong>transitive dependency</strong>: student_id → dept_id → dept_name. Violates 3NF.</p>
        </div>
      </div>
    </div>

    <!-- Step 3: 3NF -->
    <div id="sim7_step3" class="simulation-step" style="display:none">
      <div class="card">
        <h2>Step 3: Third Normal Form (3NF)</h2>
        <p style="color:var(--muted);margin-bottom:20px">Eliminate transitive dependencies by separating Department information.</p>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px">
          ${[
            { title:'Enrollment (3NF)', pk:'(student_id, course_id)', headers:['student_id PK+FK','course_id PK+FK','grade'], rows:[['S001','C001','A'],['S001','C002','B'],['S002','C001','A'],['S003','C003','B']] },
            { title:'Student (3NF)', pk:'student_id', headers:['student_id PK','student_name','dept_id FK'], rows:[['S001','John Doe','D01'],['S002','Jane Smith','D01'],['S003','Bob Wilson','D02']] },
            { title:'Department (3NF)', pk:'dept_id', headers:['dept_id PK','dept_name'], rows:[['D01','Computer Science'],['D02','Mathematics']] },
            { title:'Course (3NF)', pk:'course_id', headers:['course_id PK','course_name','instructor'], rows:[['C001','Database Systems','Dr. Smith'],['C002','Data Structures','Dr. Johnson'],['C003','Calculus','Dr. Brown']] }
          ].map(t => `
            <div class="card" style="background:#ecfdf5;border-left:4px solid #10b981">
              <h3>${t.title}</h3>
              <p style="font-size:13px;color:var(--muted)">PK: ${t.pk}</p>
              <div class="simulation-result">
                <table class="simulation-table">
                  <thead><tr>${t.headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
                  <tbody>${t.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
              </div>
            </div>`).join('')}
        </div>
        <div class="card" style="margin-top:20px;background:#d1fae5;border-left:4px solid #10b981">
          <h3>✓ Normalization Complete (3NF)</h3>
          <ul>
            <li>✓ All relations are in 3NF</li>
            <li>✓ No partial or transitive dependencies</li>
            <li>✓ Data redundancy eliminated</li>
            <li>✓ Anomalies removed</li>
            <li>✓ Lossless decomposition achieved</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal7" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center" onclick="if(event.target.id==='guideModal7') closeGuide7()">
      <div style="background:white;border-radius:8px;max-width:650px;max-height:80vh;overflow-y:auto;padding:32px;box-shadow:0 20px 25px rgba(0,0,0,0.15)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
          <h2 style="margin:0">📖 Database Normalization Guide</h2>
          <button onclick="closeGuide7()" style="background:none;border:none;font-size:24px;cursor:pointer;padding:0;width:32px;height:32px">✕</button>
        </div>
        
        <div style="color:var(--text)">
          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Functional Dependency (FD)</h3>
            <p><strong>Definition:</strong> Relationship between attributes where the value of one attribute determines the value of another</p>
            <p><strong>Notation:</strong> A → B (A determines B)</p>
            <p><strong>Example:</strong> student_id → student_name (knowing student_id tells you the student_name)</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">First Normal Form (1NF)</h3>
            <p><strong>Requirement:</strong> All attribute values must be atomic (indivisible)</p>
            <p><strong>Eliminates:</strong> Repeating groups and multi-valued attributes</p>
            <p><strong>Example:</strong> Cannot have a 'courses' attribute with multiple values; must separate into multiple rows</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Partial Dependency</h3>
            <p><strong>Definition:</strong> Non-key attribute depends on only part of a composite primary key</p>
            <p><strong>Example:</strong> In (student_id, course_id), if student_name depends only on student_id → Partial dependency</p>
            <p><strong>Problem:</strong> Causes update anomalies and redundancy</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Second Normal Form (2NF)</h3>
            <p><strong>Requirement:</strong> Must be in 1NF AND no partial dependencies</p>
            <p><strong>Solution:</strong> Separate tables so non-key attributes depend on the entire primary key</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Transitive Dependency</h3>
            <p><strong>Definition:</strong> Non-key attribute A → B → C, where A determines C indirectly through B</p>
            <p><strong>Example:</strong> student_id → dept_id → dept_name</p>
            <p><strong>Problem:</strong> Causes data redundancy and update anomalies</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Third Normal Form (3NF)</h3>
            <p><strong>Requirement:</strong> Must be in 2NF AND no transitive dependencies</p>
            <p><strong>Solution:</strong> Move dependent attributes to separate tables</p>
          </div>

          <div style="background:var(--yellow-light);padding:16px;border-radius:8px;margin-top:20px">
            <h4 style="margin-top:0">💡 Normalization Goals</h4>
            <ul style="margin-bottom:0">
              <li>Eliminate data redundancy</li>
              <li>Reduce update, insertion, and deletion anomalies</li>
              <li>Maintain data integrity through functional dependencies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Modal -->
    <div id="quizModal3" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1001;align-items:center;justify-content:center" onclick="if(event.target.id==='quizModal3') closeQuiz7()">
      <div style="background:white;border-radius:8px;max-width:500px;padding:32px;box-shadow:0 20px 25px rgba(0,0,0,0.15)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <h2 style="margin:0;color:var(--primary)">❓ Quick Quiz</h2>
          <button onclick="closeQuiz7()" style="background:none;border:none;font-size:24px;cursor:pointer;padding:0;width:32px;height:32px">✕</button>
        </div>
        <div id="quiz7Content" style="color:var(--text)"></div>
      </div>
    </div>`;
};

window.sim7_showStep = function(n) {
  [0,1,2,3].forEach(i => {
    const el  = document.getElementById(`sim7_step${i}`);
    const btn = document.getElementById(`sim7_step${i}Btn`);
    if (el)  el.style.display  = i === n ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', i === n);
  });
};

window.openGuide7 = function() {
  const modal = document.getElementById('guideModal7');
  if (modal) {
    modal.style.display = 'flex';
  }
};

window.closeGuide7 = function() {
  const modal = document.getElementById('guideModal7');
  if (modal) {
    modal.style.display = 'none';
  }
};

// Quiz Questions for Experiment 3
const quiz7Questions = [
  {
    question: "What does a functional dependency A → B mean?",
    options: ["A depends on B", "B depends on A", "A and B are the same", "A is a foreign key"],
    correct: 1,
    explanation: "A → B means that the value of A determines the value of B. If you know A, you can determine B."
  },
  {
    question: "What is a partial dependency?",
    options: ["When a non-key attribute depends on only part of a composite key", "When a key is partially null", "When a table is incomplete", "When data is partially updated"],
    correct: 0,
    explanation: "A partial dependency occurs when a non-key attribute depends on only part of a composite primary key, violating 2NF."
  },
  {
    question: "What is the main goal of database normalization?",
    options: ["Increase performance", "Reduce data redundancy and anomalies", "Add more tables", "Use more storage"],
    correct: 1,
    explanation: "Normalization aims to eliminate data redundancy, reduce update/insertion/deletion anomalies, and maintain data integrity."
  }
];

let quiz7Timer = null;

function startQuiz7Timer() {
  const randomDelay = Math.random() * 8000 + 15000; // 15-23 seconds
  console.log('Quiz7 Timer started, will show quiz in', Math.round(randomDelay/1000), 'seconds');
  quiz7Timer = setTimeout(() => {
    showRandomQuiz7();
    startQuiz7Timer();
  }, randomDelay);
}

function showRandomQuiz7() {
  if (Math.random() > 0.4) { // 60% chance to show quiz
    const randomIndex = Math.floor(Math.random() * quiz7Questions.length);
    const question = quiz7Questions[randomIndex];
    displayQuiz7(question);
  }
}

function displayQuiz7(question) {
  console.log('Displaying Quiz7:', question.question);
  const content = document.getElementById('quiz7Content');
  if (!content) return;
  
  let html = `<p style="margin-top:0;font-size:16px;font-weight:500">${question.question}</p>`;
  html += '<div style="margin:20px 0">';
  
  question.options.forEach((option, index) => {
    const isCorrect = index === question.correct;
    html += `<button onclick="checkAnswer3(${index},${question.correct},'${question.explanation}')" style="display:block;width:100%;padding:12px;margin:10px 0;border:2px solid var(--border);background:white;border-radius:6px;text-align:left;cursor:pointer;transition:all 0.2s">${option}</button>`;
  });
  
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal3').style.display = 'flex';
}

function checkAnswer3(selected, correct, explanation) {
  const content = document.getElementById('quiz7Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  
  let html = `<div style="background:${resultColor}20;border-left:4px solid ${resultColor};padding:16px;border-radius:6px;margin-bottom:16px">`;
  html += `<p style="color:${resultColor};font-weight:600;margin:0 0 8px 0">${resultMessage}</p>`;
  html += `<p style="margin:0;color:var(--text)">${explanation}</p>`;
  html += '</div>';
  html += '<button onclick="closeQuiz7()" style="width:100%;padding:12px;background:var(--primary);color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;margin-top:16px">Got it!</button>';
  
  content.innerHTML = html;
}

function closeQuiz7() {
  const modal = document.getElementById('quizModal3');
  if (modal) modal.style.display = 'none';
}

// Initialize quiz for Experiment 3 (called from app.js after DOM is ready)
window.initQuiz7 = function() {
  if (document.getElementById('sim7_step0')) {
    // Start quiz timer for this session
    if (window.quiz7Timer) clearTimeout(window.quiz7Timer);
    startQuiz7Timer();
  }
};
