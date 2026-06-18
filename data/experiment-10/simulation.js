window.sim10_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>

    <div class="card" style="margin-bottom: 24px;">
      <h2 style="margin-top: 0;">Database Normalisation Simulator</h2>
      <p style="color: var(--muted); margin-bottom: 0;">
        Decompose a poorly structured, unnormalized table into 1NF, 2NF, and 3NF to eliminate data redundancy and insertion/deletion anomalies.
      </p>
    </div>

    <div class="simulation-layout">
      <div class="simulation-left" style="flex: 1;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Normalisation Stages</h2>
            <button onclick="openGuide10()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <button onclick="setNormStage('UNF')" id="btn-unf" style="padding: 16px; text-align: left; background: var(--bg-color); border: 2px solid var(--primary); border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between; align-items: center;">
              <span>Unnormalized Form (UNF)</span>
              <span style="font-size: 12px; font-weight: normal; background: var(--primary); color: white; padding: 2px 8px; border-radius: 12px;">Start</span>
            </button>
            
            <button onclick="setNormStage('1NF')" id="btn-1nf" style="padding: 16px; text-align: left; background: white; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
              First Normal Form (1NF)
              <div style="font-size: 12px; font-weight: normal; color: var(--muted); margin-top: 4px;">Atomic values, no repeating groups.</div>
            </button>
            
            <button onclick="setNormStage('2NF')" id="btn-2nf" style="padding: 16px; text-align: left; background: white; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
              Second Normal Form (2NF)
              <div style="font-size: 12px; font-weight: normal; color: var(--muted); margin-top: 4px;">No partial dependencies.</div>
            </button>
            
            <button onclick="setNormStage('3NF')" id="btn-3nf" style="padding: 16px; text-align: left; background: white; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
              Third Normal Form (3NF)
              <div style="font-size: 12px; font-weight: normal; color: var(--muted); margin-top: 4px;">No transitive dependencies.</div>
            </button>
          </div>
          
          <div id="norm-explanation" style="margin-top: 24px; padding: 16px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 8px;">
            <h4 style="margin-top: 0; color: #0369a1;">UNF Issues</h4>
            <p style="margin: 0; font-size: 14px; color: #0c4a6e;">The initial table contains multiple values in the "Subjects" column (Repeating Groups). This violates 1NF.</p>
          </div>
        </div>
      </div>

      <div class="simulation-right" style="flex: 2;">
        <div class="card sticky-result">
          <h2 style="margin-top: 0;">Database Schema</h2>
          <div id="schema-display" style="display: flex; flex-wrap: wrap; gap: 24px;">
            <!-- Tables will be injected here -->
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal10" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal10') closeGuide10()">
      <div style="background: white; border-radius: 8px; max-width: 600px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0;">📖 Normalisation Guide</h2>
          <button onclick="closeGuide10()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div style="color: var(--text);">
          <p>Normalisation is the process of organizing data to reduce redundancy.</p>
          <ul>
            <li><strong>1NF:</strong> Ensure each cell holds a single (atomic) value.</li>
            <li><strong>2NF:</strong> Must be in 1NF. Remove Partial Dependencies (non-key attributes depending on only part of a composite primary key).</li>
            <li><strong>3NF:</strong> Must be in 2NF. Remove Transitive Dependencies (non-key attributes depending on other non-key attributes).</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Quiz Modal -->
    <div id="quizModal10" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal10') closeQuiz10()">
      <div style="background: white; border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz10()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz10Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

const normStages = {
  UNF: {
    title: "UNF Issues",
    desc: "The initial table contains multiple values in the 'Subjects' column (Repeating Groups). This violates 1NF.",
    tables: [
      {
        name: "StudentReport",
        cols: ["StudentID", "StudentName", "Department", "DeptHead", "Subjects"],
        rows: [
          ["S1", "Alice", "CS", "Dr. Smith", "DB, OS"],
          ["S2", "Bob", "IT", "Dr. Jones", "DB"],
          ["S3", "Charlie", "CS", "Dr. Smith", "OS, Net"]
        ]
      }
    ]
  },
  '1NF': {
    title: "1NF Applied",
    desc: "Repeating groups are removed by creating multiple rows. Now each cell is atomic. However, we have a Composite Key (StudentID, Subject). Department and DeptHead depend only on StudentID, not the whole key (Partial Dependency).",
    tables: [
      {
        name: "StudentReport_1NF",
        cols: ["StudentID (PK)", "Subject (PK)", "StudentName", "Department", "DeptHead"],
        rows: [
          ["S1", "DB", "Alice", "CS", "Dr. Smith"],
          ["S1", "OS", "Alice", "CS", "Dr. Smith"],
          ["S2", "DB", "Bob", "IT", "Dr. Jones"],
          ["S3", "OS", "Charlie", "CS", "Dr. Smith"],
          ["S3", "Net", "Charlie", "CS", "Dr. Smith"]
        ]
      }
    ]
  },
  '2NF': {
    title: "2NF Applied",
    desc: "Partial dependencies are removed. The table is split. But DeptHead depends on Department, not StudentID. This is a Transitive Dependency.",
    tables: [
      {
        name: "StudentEnrollment",
        cols: ["StudentID (PK)", "Subject (PK)"],
        rows: [
          ["S1", "DB"], ["S1", "OS"], ["S2", "DB"], ["S3", "OS"], ["S3", "Net"]
        ]
      },
      {
        name: "StudentInfo",
        cols: ["StudentID (PK)", "StudentName", "Department", "DeptHead"],
        rows: [
          ["S1", "Alice", "CS", "Dr. Smith"],
          ["S2", "Bob", "IT", "Dr. Jones"],
          ["S3", "Charlie", "CS", "Dr. Smith"]
        ]
      }
    ]
  },
  '3NF': {
    title: "3NF Applied",
    desc: "Transitive dependencies are removed. Department information is moved to its own table. The schema is now fully normalised and anomalies are prevented.",
    tables: [
      {
        name: "StudentEnrollment",
        cols: ["StudentID (PK)", "Subject (PK)"],
        rows: [
          ["S1", "DB"], ["S1", "OS"], ["S2", "DB"], ["S3", "OS"], ["S3", "Net"]
        ]
      },
      {
        name: "Students",
        cols: ["StudentID (PK)", "StudentName", "DeptID (FK)"],
        rows: [
          ["S1", "Alice", "CS"],
          ["S2", "Bob", "IT"],
          ["S3", "Charlie", "CS"]
        ]
      },
      {
        name: "Departments",
        cols: ["DeptID (PK)", "DeptHead"],
        rows: [
          ["CS", "Dr. Smith"],
          ["IT", "Dr. Jones"]
        ]
      }
    ]
  }
};

window.setNormStage = function(stage) {
  ['btn-unf', 'btn-1nf', 'btn-2nf', 'btn-3nf'].forEach(id => {
    const el = document.getElementById(id);
    el.style.border = '1px solid var(--border)';
    el.style.background = 'white';
  });
  
  const activeBtn = document.getElementById('btn-' + stage.toLowerCase());
  activeBtn.style.border = '2px solid var(--primary)';
  activeBtn.style.background = 'var(--bg-color)';
  
  const exp = document.getElementById('norm-explanation');
  const data = normStages[stage];
  
  exp.innerHTML = `
    <h4 style="margin-top: 0; color: #0369a1;">${data.title}</h4>
    <p style="margin: 0; font-size: 14px; color: #0c4a6e;">${data.desc}</p>
  `;
  
  const display = document.getElementById('schema-display');
  let html = '';
  
  data.tables.forEach(table => {
    html += `
      <div style="flex: 1; min-width: 300px; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="background: var(--primary); color: white; padding: 8px 16px; font-weight: bold; font-size: 14px;">
          🗄️ ${table.name}
        </div>
        <div style="overflow-x: auto;">
          <table class="simulation-table" style="margin: 0; font-size: 12px; border: none; width: 100%;">
            <thead><tr>${table.cols.map(c => `<th style="border-top: none;">${c}</th>`).join('')}</tr></thead>
            <tbody>${table.rows.map(r => `<tr>${r.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    `;
  });
  
  display.innerHTML = html;
};

window.openGuide10 = function() { document.getElementById('guideModal10').style.display = 'flex'; };
window.closeGuide10 = function() { document.getElementById('guideModal10').style.display = 'none'; };

const quiz10Questions = [
  { question: "What violates 1NF?", options: ["Composite Keys", "Foreign Keys", "Repeating Groups/Multi-valued attributes"], correct: 2, explanation: "1NF strictly forbids multi-valued attributes in a single cell." },
  { question: "To achieve 3NF, what dependency must be removed?", options: ["Partial Dependency", "Transitive Dependency", "Functional Dependency"], correct: 1, explanation: "3NF requires the removal of transitive dependencies (when a non-key attribute depends on another non-key attribute)." }
];

let quiz10Timer = null;
window.startQuiz10Timer = function() {
  const randomDelay = Math.random() * 8000 + 15000;
  quiz10Timer = setTimeout(() => {
    if (Math.random() > 0.4) {
      const q = quiz10Questions[Math.floor(Math.random() * quiz10Questions.length)];
      displayQuiz10(q);
    }
    window.startQuiz10Timer();
  }, randomDelay);
};

window.displayQuiz10 = function(question) {
  const content = document.getElementById('quiz10Content');
  if (!content) return;
  let html = \`<p style="margin-top: 0; font-size: 16px; font-weight: 500;">\${question.question}</p>\`;
  html += '<div style="margin: 20px 0;">';
  question.options.forEach((option, index) => {
    html += \`<button onclick="checkAnswer10(\${index}, \${question.correct}, '\${question.explanation}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: white; border-radius: 6px; text-align: left; cursor: pointer;">\${option}</button>\`;
  });
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal10').style.display = 'flex';
};

window.checkAnswer10 = function(selected, correct, explanation) {
  const content = document.getElementById('quiz10Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  let html = \`<div style="background: \${resultColor}20; border-left: 4px solid \${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">\`;
  html += \`<p style="color: \${resultColor}; font-weight: 600; margin: 0 0 8px 0;">\${resultMessage}</p>\`;
  html += \`<p style="margin: 0; color: var(--text);">\${explanation}</p></div>\`;
  html += '<button onclick="closeQuiz10()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 16px;">Got it!</button>';
  content.innerHTML = html;
};

window.closeQuiz10 = function() {
  const modal = document.getElementById('quizModal10');
  if (modal) modal.style.display = 'none';
};

window.initQuiz10 = function() {
  if (window.quiz10Timer) clearTimeout(window.quiz10Timer);
  window.startQuiz10Timer();
  setNormStage('UNF');
};

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('btn-unf')) {
    window.startQuiz10Timer();
    setNormStage('UNF');
  }
});