/**
 * Simulation for Experiment 2: ER Diagram Design & Relational Mapping
 * Step-through visualizer: Entities → Relationships → Relational Schema
 *
 * IMPORTANT: Uses window.sim2_renderSimulation (not window.renderSimulation)
 * so it does not collide with experiment-3's simulation when both scripts
 * are cached by the browser in the same session.
 */

window.sim2_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2 style="margin:0">ER Diagram Design Simulation</h2>
        <button onclick="openGuide2()" style="background:var(--accent);color:white;padding:8px 16px;border:none;border-radius:4px;cursor:pointer;font-weight:600">📖 Guide</button>
      </div>
      <p style="color:var(--muted);margin-bottom:16px">
        Follow the steps below to understand how to design an ER diagram and map it to a relational schema.
        This simulation uses a University Management System as an example.
      </p>
      <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
        <button onclick="sim2_showStep(1)" id="sim2_step1Btn" class="step-button active">Step 1: Entities &amp; Attributes</button>
        <button onclick="sim2_showStep(2)" id="sim2_step2Btn" class="step-button">Step 2: Relationships</button>
        <button onclick="sim2_showStep(3)" id="sim2_step3Btn" class="step-button">Step 3: Relational Mapping</button>
      </div>
    </div>

    <!-- Step 1 -->
    <div id="sim2_step1" class="simulation-step">
      <div class="card">
        <h2>Step 1: Entities and Attributes</h2>
        <p style="color:var(--muted);margin-bottom:20px">Entities are rectangles. Attributes describe each entity. Primary keys are underlined.</p>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
          ${[
            { name:'Student', attrs:['<u>student_id</u> (Primary Key)','name','email','date_of_birth','address'] },
            { name:'Course',  attrs:['<u>course_id</u> (Primary Key)','title','credits','description'] },
            { name:'Department', attrs:['<u>dept_id</u> (Primary Key)','dept_name','location','budget'] }
          ].map(e => `
            <div class="card" style="background:#f8fafc;border:2px solid var(--primary)">
              <h3 style="color:var(--primary);text-align:center;padding:12px;background:white;border-radius:8px;margin-bottom:12px">${e.name}</h3>
              ${e.attrs.map(a => `<div style="margin-bottom:8px">${a}</div>`).join('')}
            </div>`).join('')}
        </div>
        <div class="card" style="margin-top:20px;background:var(--yellow-light)">
          <h3>Key Points</h3>
          <ul>
            <li>Each entity represents a real-world object</li>
            <li>Attributes describe properties of each entity</li>
            <li>Primary keys (underlined) uniquely identify each instance</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Step 2 -->
    <div id="sim2_step2" class="simulation-step" style="display:none">
      <div class="card">
        <h2>Step 2: Relationships</h2>
        <p style="color:var(--muted);margin-bottom:20px">Relationships connect entities. Cardinality (1:1, 1:N, M:N) is shown on the connecting lines.</p>
        <div class="card" style="background:#f8fafc;padding:24px">
          ${[
            { left:'Student', rel:'ENROLLS', card:'M : N', right:'Course' },
            { left:'Department', rel:'OFFERS', card:'1 : N', right:'Course' },
            { left:'Department', rel:'HAS', card:'1 : N', right:'Student' }
          ].map(r => `
            <div style="display:flex;align-items:center;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid var(--border)">
              <div class="entity-box"><div class="entity-header">${r.left}</div></div>
              <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
                <div style="padding:8px 16px;background:var(--accent);color:white;border-radius:8px;font-weight:600">${r.rel}</div>
                <div style="font-size:14px;color:var(--muted)">${r.card}</div>
              </div>
              <div class="entity-box"><div class="entity-header">${r.right}</div></div>
            </div>`).join('')}
        </div>
        <div class="card" style="margin-top:20px;background:var(--yellow-light)">
          <h3>Relationship Types</h3>
          <ul>
            <li><strong>ENROLLS (M:N):</strong> Many students enroll in many courses — needs a separate table</li>
            <li><strong>OFFERS (1:N):</strong> One department offers many courses — foreign key in Course</li>
            <li><strong>HAS (1:N):</strong> One department has many students — foreign key in Student</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Step 3 -->
    <div id="sim2_step3" class="simulation-step" style="display:none">
      <div class="card">
        <h2>Step 3: Relational Mapping</h2>
        <p style="color:var(--muted);margin-bottom:20px">Each entity becomes a table. Relationships are represented using foreign keys or separate tables.</p>
        ${[
          {
            title:'Student Table',
            note:'Foreign key dept_id represents the 1:N relationship with Department.',
            headers:['student_id PK','name','email','date_of_birth','address','dept_id FK'],
            rows:[['S001','John Doe','john@univ.edu','2000-05-15','123 Main St','D01'],['S002','Jane Smith','jane@univ.edu','2001-08-22','456 Oak Ave','D01']]
          },
          {
            title:'Course Table',
            note:'Foreign key dept_id represents the 1:N relationship (Department OFFERS Course).',
            headers:['course_id PK','title','credits','description','dept_id FK'],
            rows:[['C001','Database Systems','3','Introduction to DBMS','D01'],['C002','Data Structures','4','Algorithms and structures','D01']]
          },
          {
            title:'Department Table',
            note:'Strong entity → Table. No foreign keys (it\'s on the "1" side).',
            headers:['dept_id PK','dept_name','location','budget'],
            rows:[['D01','Computer Science','Building A','500000'],['D02','Mathematics','Building B','300000']]
          },
          {
            title:'Enrollment Table (M:N Relationship)',
            note:'M:N relationships → Separate table. Composite primary key: (student_id, course_id).',
            headers:['student_id FK+PK','course_id FK+PK','grade','semester'],
            rows:[['S001','C001','A','Fall 2024'],['S001','C002','B','Fall 2024'],['S002','C001','A','Spring 2025']]
          }
        ].map(t => `
          <div class="card" style="margin-bottom:16px">
            <h3>${t.title}</h3>
            <div class="simulation-result">
              <table class="simulation-table">
                <thead><tr>${t.headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${t.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
              </table>
            </div>
            <p style="margin-top:12px;color:var(--muted);font-size:14px"><strong>Mapping Rule:</strong> ${t.note}</p>
          </div>`).join('')}
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal2" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center" onclick="if(event.target.id==='guideModal2') closeGuide2()">
      <div style="background:white;border-radius:8px;max-width:650px;max-height:80vh;overflow-y:auto;padding:32px;box-shadow:0 20px 25px rgba(0,0,0,0.15)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
          <h2 style="margin:0">📖 ER Diagram & Relational Mapping Guide</h2>
          <button onclick="closeGuide2()" style="background:none;border:none;font-size:24px;cursor:pointer;padding:0;width:32px;height:32px">✕</button>
        </div>
        
        <div style="color:var(--text)">
          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Entity</h3>
            <p><strong>Definition:</strong> A real-world object (e.g., Student, Course, Department)</p>
            <p><strong>Symbol:</strong> Rectangle</p>
            <p><strong>Example:</strong> A 'Student' entity represents all students in the system</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Attribute</h3>
            <p><strong>Definition:</strong> A property or characteristic of an entity</p>
            <p><strong>Example:</strong> Student has attributes: student_id, name, email, date_of_birth, address</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Primary Key (PK)</h3>
            <p><strong>Definition:</strong> An attribute that uniquely identifies each instance of an entity (shown underlined)</p>
            <p><strong>Example:</strong> student_id uniquely identifies each student</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Relationship</h3>
            <p><strong>Definition:</strong> A connection between two entities (shown with a diamond and connecting lines)</p>
            <p><strong>Example:</strong> ENROLLS connects Student to Course</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Cardinality</h3>
            <p><strong>1:1 (One-to-One):</strong> One instance of Entity A relates to one instance of Entity B</p>
            <p><strong>1:N (One-to-Many):</strong> One instance of Entity A relates to many instances of Entity B</p>
            <p><strong>M:N (Many-to-Many):</strong> Many instances of Entity A relate to many instances of Entity B</p>
          </div>

          <div style="margin-bottom:20px">
            <h3 style="color:var(--primary);margin-top:0">Foreign Key (FK)</h3>
            <p><strong>Definition:</strong> An attribute in one table that refers to the primary key of another table</p>
            <p><strong>Purpose:</strong> Establishes relationships between tables in the relational model</p>
          </div>

          <div style="background:var(--yellow-light);padding:16px;border-radius:8px;margin-top:20px">
            <h4 style="margin-top:0">💡 Key Points</h4>
            <ul style="margin-bottom:0">
              <li>1:1 and 1:N relationships: Add foreign key to the "many" side</li>
              <li>M:N relationships: Create a separate junction table with composite primary key</li>
              <li>Each entity becomes a table in the relational database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Modal -->
    <div id="quizModal2" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1001;align-items:center;justify-content:center" onclick="if(event.target.id==='quizModal2') closeQuiz2()">
      <div style="background:white;border-radius:8px;max-width:500px;padding:32px;box-shadow:0 20px 25px rgba(0,0,0,0.15)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <h2 style="margin:0;color:var(--primary)">❓ Quick Quiz</h2>
          <button onclick="closeQuiz2()" style="background:none;border:none;font-size:24px;cursor:pointer;padding:0;width:32px;height:32px">✕</button>
        </div>
        <div id="quiz2Content" style="color:var(--text)"></div>
      </div>
    </div>`;
};

window.sim2_showStep = function(n) {
  [1,2,3].forEach(i => {
    const el  = document.getElementById(`sim2_step${i}`);
    const btn = document.getElementById(`sim2_step${i}Btn`);
    if (el)  el.style.display  = i === n ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', i === n);
  });
};

window.openGuide2 = function() {
  const modal = document.getElementById('guideModal2');
  if (modal) {
    modal.style.display = 'flex';
  }
};

window.closeGuide2 = function() {
  const modal = document.getElementById('guideModal2');
  if (modal) {
    modal.style.display = 'none';
  }
};

// Quiz Questions for Experiment 2
const quiz2Questions = [
  {
    question: "In an ER diagram, which relationship cardinality means one entity instance relates to many instances of another entity?",
    options: ["1:1", "1:N", "M:N", "N:M"],
    correct: 1,
    explanation: "1:N (One-to-Many) means one instance on the left side relates to many on the right side."
  },
  {
    question: "For an M:N relationship in ER diagrams, how is it represented in the relational model?",
    options: ["Add foreign key in one table", "Create a separate junction table", "Merge the entities", "Use a single table"],
    correct: 1,
    explanation: "M:N relationships require a separate junction/bridge table with composite primary keys from both entities."
  },
  {
    question: "What is a primary key in an entity?",
    options: ["Any attribute", "An attribute that uniquely identifies each instance", "The first attribute listed", "An optional attribute"],
    correct: 1,
    explanation: "A primary key is an attribute (or set of attributes) that uniquely identifies each instance of an entity."
  }
];

let quiz2Timer = null;

function startQuiz2Timer() {
  const randomDelay = Math.random() * 8000 + 15000; // 15-23 seconds
  console.log('Quiz2 Timer started, will show quiz in', Math.round(randomDelay/1000), 'seconds');
  quiz2Timer = setTimeout(() => {
    showRandomQuiz2();
    startQuiz2Timer();
  }, randomDelay);
}

function showRandomQuiz2() {
  if (Math.random() > 0.4) { // 60% chance to show quiz
    const randomIndex = Math.floor(Math.random() * quiz2Questions.length);
    const question = quiz2Questions[randomIndex];
    displayQuiz2(question);
  }
}

function displayQuiz2(question) {
  console.log('Displaying Quiz2:', question.question);
  const content = document.getElementById('quiz2Content');
  if (!content) return;
  
  let html = `<p style="margin-top:0;font-size:16px;font-weight:500">${question.question}</p>`;
  html += '<div style="margin:20px 0">';
  
  question.options.forEach((option, index) => {
    const isCorrect = index === question.correct;
    html += `<button onclick="checkAnswer2(${index},${question.correct},'${question.explanation}')" style="display:block;width:100%;padding:12px;margin:10px 0;border:2px solid var(--border);background:white;border-radius:6px;text-align:left;cursor:pointer;transition:all 0.2s">${option}</button>`;
  });
  
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal2').style.display = 'flex';
}

function checkAnswer2(selected, correct, explanation) {
  const content = document.getElementById('quiz2Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  
  let html = `<div style="background:${resultColor}20;border-left:4px solid ${resultColor};padding:16px;border-radius:6px;margin-bottom:16px">`;
  html += `<p style="color:${resultColor};font-weight:600;margin:0 0 8px 0">${resultMessage}</p>`;
  html += `<p style="margin:0;color:var(--text)">${explanation}</p>`;
  html += '</div>';
  html += '<button onclick="closeQuiz2()" style="width:100%;padding:12px;background:var(--primary);color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;margin-top:16px">Got it!</button>';
  
  content.innerHTML = html;
}

function closeQuiz2() {
  const modal = document.getElementById('quizModal2');
  if (modal) modal.style.display = 'none';
}

// Initialize quiz for Experiment 2 (called from app.js after DOM is ready)
window.initQuiz2 = function() {
  if (document.getElementById('sim2_step1')) {
    // Start quiz timer for this session
    if (window.quiz2Timer) clearTimeout(window.quiz2Timer);
    startQuiz2Timer();
  }
};
