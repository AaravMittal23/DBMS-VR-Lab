window.sim1_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>

    <div class="simulation-layout">
      <div class="simulation-left" style="flex: 1;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Three-Schema Architecture</h2>
            <button onclick="openGuide1()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
          <p style="color: var(--muted); margin-bottom: 20px;">Click on the layers to learn more about them.</p>
          
          <div style="display: flex; flex-direction: column; gap: 16px; align-items: center; background: #f8fafc; padding: 24px; border-radius: 8px;">
            
            <div id="layer-external" onclick="selectLayer('external')" style="width: 100%; max-width: 300px; background: #e0f2fe; border: 2px solid #0284c7; padding: 20px; border-radius: 8px; text-align: center; cursor: pointer; transition: transform 0.2s;">
              <h3 style="margin: 0; color: #0284c7;">External Level</h3>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #0369a1;">User Views</p>
            </div>
            
            <div style="width: 2px; height: 30px; background: #94a3b8;"></div>
            
            <div id="layer-conceptual" onclick="selectLayer('conceptual')" style="width: 100%; max-width: 300px; background: #dcfce7; border: 2px solid #16a34a; padding: 20px; border-radius: 8px; text-align: center; cursor: pointer; transition: transform 0.2s;">
              <h3 style="margin: 0; color: #16a34a;">Conceptual Level</h3>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #15803d;">Logical Schema</p>
            </div>

            <div style="width: 2px; height: 30px; background: #94a3b8;"></div>
            
            <div id="layer-internal" onclick="selectLayer('internal')" style="width: 100%; max-width: 300px; background: #fef08a; border: 2px solid #ca8a04; padding: 20px; border-radius: 8px; text-align: center; cursor: pointer; transition: transform 0.2s;">
              <h3 style="margin: 0; color: #ca8a04;">Internal Level</h3>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #a16207;">Physical Storage</p>
            </div>
            
          </div>
          
          <div id="layer-description" style="margin-top: 24px; padding: 16px; background: var(--bg-color); border-radius: 8px; border-left: 4px solid var(--muted); min-height: 100px;">
            <p style="margin: 0; color: var(--text);">Select a layer above to view its details.</p>
          </div>
        </div>
      </div>

      <div class="simulation-right" style="flex: 1;">
        <div class="card sticky-result">
          <h2>Database Environment Setup</h2>
          <p style="color: var(--muted); margin-bottom: 16px;">Simulate connecting to the database engine via the terminal.</p>
          
          <div style="background: #1e293b; color: #10b981; font-family: monospace; padding: 16px; border-radius: 8px; min-height: 250px; overflow-y: auto;" id="terminal-output">
            <p style="margin: 0; color: #94a3b8;">$ Waiting for user input...</p>
          </div>
          
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <input type="text" id="terminal-input" placeholder="Type a command (e.g., mysql -u root -p)" style="flex: 1; padding: 8px; border: 1px solid var(--border); border-radius: 4px; font-family: monospace;" onkeypress="if(event.key === 'Enter') executeTerminalCommand()">
            <button onclick="executeTerminalCommand()" style="background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Run</button>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button onclick="document.getElementById('terminal-input').value = 'mysql -u root -p'; executeTerminalCommand();" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">mysql -u root -p</button>
            <button onclick="document.getElementById('terminal-input').value = 'CREATE DATABASE lab_sandbox;'; executeTerminalCommand();" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">CREATE DATABASE</button>
            <button onclick="document.getElementById('terminal-input').value = 'SHOW DATABASES;'; executeTerminalCommand();" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">SHOW DATABASES</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal1" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal1') closeGuide1()">
      <div style="background: white; border-radius: 8px; max-width: 600px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0;">📖 Architecture & Setup Guide</h2>
          <button onclick="closeGuide1()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div style="color: var(--text);">
          <p>This experiment helps you understand the Three-Schema Architecture.</p>
          <ul>
            <li><strong>External Level:</strong> How individual users see the data (e.g., a student portal vs faculty portal).</li>
            <li><strong>Conceptual Level:</strong> The logical structure of all tables and relationships in the database.</li>
            <li><strong>Internal Level:</strong> How data is physically stored on disk (B-Trees, Hash files).</li>
          </ul>
          <p>In the terminal simulator, try connecting to the database using <code>mysql -u root -p</code>, then execute standard SQL commands like <code>CREATE DATABASE</code> and <code>SHOW DATABASES</code> to set up your environment.</p>
        </div>
      </div>
    </div>
    
    <!-- Quiz Modal -->
    <div id="quizModal1" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal1') closeQuiz1()">
      <div style="background: white; border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz1()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz1Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

let isConnected = false;
let databases = ['information_schema', 'mysql', 'performance_schema', 'sys'];

window.selectLayer = function(layer) {
  const desc = document.getElementById('layer-description');
  const details = {
    'external': '<strong>External Level (User Views):</strong> The highest level of database abstraction where only those portions of the database of concern to a user or application program are included. It provides logical data independence.',
    'conceptual': '<strong>Conceptual Level (Logical Schema):</strong> Describes what data is stored in the entire database and what the relationships are among those data. It hides the details of physical storage structures.',
    'internal': '<strong>Internal Level (Physical Storage):</strong> The lowest level of abstraction. It describes how the data is actually stored on the storage medium, detailing data structures and access paths (like indexes).'
  };
  
  document.querySelectorAll('[id^="layer-"]').forEach(el => {
    if (el.id !== 'layer-description') {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = 'none';
    }
  });
  
  const selected = document.getElementById('layer-' + layer);
  selected.style.transform = 'scale(1.05)';
  selected.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
  
  desc.innerHTML = '<p style="margin: 0; color: var(--text); font-size: 15px; line-height: 1.5;">' + details[layer] + '</p>';
  desc.style.borderLeftColor = selected.style.borderColor;
};

window.executeTerminalCommand = function() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const cmd = input.value.trim();
  if (!cmd) return;
  
  const line = document.createElement('p');
  line.style.margin = '4px 0';
  line.style.color = 'white';
  line.textContent = '$ ' + cmd;
  output.appendChild(line);
  
  const res = document.createElement('p');
  res.style.margin = '0 0 12px 0';
  res.style.color = '#94a3b8';
  
  if (cmd.startsWith('mysql -u')) {
    isConnected = true;
    res.innerHTML = 'Enter password: <br>Welcome to the MySQL monitor.  Commands end with ; or \\g.<br>Server version: 8.0.32 MySQL Community Server<br><br>mysql>';
  } else if (!isConnected) {
    res.textContent = 'Command not found or you must connect to mysql first.';
  } else {
    if (cmd.toUpperCase().startsWith('CREATE DATABASE')) {
      const dbName = cmd.split(' ')[2]?.replace(';', '');
      if (dbName) {
        if (!databases.includes(dbName)) {
          databases.push(dbName);
          res.textContent = 'Query OK, 1 row affected (0.01 sec)';
        } else {
          res.style.color = '#ef4444';
          res.textContent = 'ERROR 1007 (HY000): Can\\'t create database \\'' + dbName + '\\'; database exists';
        }
      } else {
        res.style.color = '#ef4444';
        res.textContent = 'ERROR 1064 (42000): You have an error in your SQL syntax.';
      }
    } else if (cmd.toUpperCase().startsWith('SHOW DATABASES')) {
      let tbl = '<table style="border-collapse: collapse; margin-top: 8px;"><tr><th style="border: 1px solid #475569; padding: 4px 12px; text-align: left; color: white;">Database</th></tr>';
      databases.forEach(db => {
        tbl += '<tr><td style="border: 1px solid #475569; padding: 4px 12px; color: #10b981;">' + db + '</td></tr>';
      });
      tbl += '</table><p style="margin-top:4px;">' + databases.length + ' rows in set (0.00 sec)</p>';
      res.innerHTML = tbl;
    } else {
      res.style.color = '#ef4444';
      res.textContent = 'ERROR: Command not supported in this simulation.';
    }
    res.innerHTML += '<br><br>mysql>';
  }
  
  output.appendChild(res);
  input.value = '';
  output.scrollTop = output.scrollHeight;
};

// Guide and Quiz logic for Exp 1
window.openGuide1 = function() { document.getElementById('guideModal1').style.display = 'flex'; };
window.closeGuide1 = function() { document.getElementById('guideModal1').style.display = 'none'; };

const quiz1Questions = [
  { question: "Which schema provides Logical Data Independence?", options: ["External Schema", "Conceptual Schema", "Internal Schema", "All of the above"], correct: 0, explanation: "The External Schema provides logical data independence by separating user views from the conceptual structure." },
  { question: "Which command lists all existing databases?", options: ["LIST DATABASES;", "SHOW DATABASES;", "DISPLAY DATABASES;", "GET DATABASES;"], correct: 1, explanation: "SHOW DATABASES; is the standard SQL command to list databases." }
];

let quiz1Timer = null;
window.startQuiz1Timer = function() {
  const randomDelay = Math.random() * 8000 + 15000;
  quiz1Timer = setTimeout(() => {
    if (Math.random() > 0.4) {
      const q = quiz1Questions[Math.floor(Math.random() * quiz1Questions.length)];
      displayQuiz1(q);
    }
    window.startQuiz1Timer();
  }, randomDelay);
};

window.displayQuiz1 = function(question) {
  const content = document.getElementById('quiz1Content');
  if (!content) return;
  let html = \`<p style="margin-top: 0; font-size: 16px; font-weight: 500;">\${question.question}</p>\`;
  html += '<div style="margin: 20px 0;">';
  question.options.forEach((option, index) => {
    html += \`<button onclick="checkAnswer1(\${index}, \${question.correct}, '\${question.explanation}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: white; border-radius: 6px; text-align: left; cursor: pointer;">\${option}</button>\`;
  });
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal1').style.display = 'flex';
};

window.checkAnswer1 = function(selected, correct, explanation) {
  const content = document.getElementById('quiz1Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  let html = \`<div style="background: \${resultColor}20; border-left: 4px solid \${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">\`;
  html += \`<p style="color: \${resultColor}; font-weight: 600; margin: 0 0 8px 0;">\${resultMessage}</p>\`;
  html += \`<p style="margin: 0; color: var(--text);">\${explanation}</p></div>\`;
  html += '<button onclick="closeQuiz1()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 16px;">Got it!</button>';
  content.innerHTML = html;
};

window.closeQuiz1 = function() {
  const modal = document.getElementById('quizModal1');
  if (modal) modal.style.display = 'none';
};

window.initQuiz1 = function() {
  if (window.quiz1Timer) clearTimeout(window.quiz1Timer);
  window.startQuiz1Timer();
};

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('terminal-input')) {
    window.startQuiz1Timer();
  }
});