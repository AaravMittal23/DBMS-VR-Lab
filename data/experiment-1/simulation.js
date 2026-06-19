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
          
          <div style="display: flex; flex-direction: column; gap: 16px; align-items: center; background: var(--card); padding: 24px; border-radius: 8px;">
            
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
        
        <div class="card" style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; color: var(--primary);">Goal Tasks</h3>
            <button onclick="resetSimulation()" class="sim-btn" style="background: var(--muted); color: white; padding: 4px 8px; font-size: 12px;">Reset</button>
          </div>
          <p style="font-size: 14px; color: var(--muted); margin-bottom: 12px;">Complete these tasks in the terminal below.</p>
          <ul id="sim-task-list" style="list-style: none; padding: 0; margin: 0;">
            <li id="task-1" style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><span class="task-icon">⏳</span> 1. Connect to MySQL engine</li>
            <li id="task-2" style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px; color: var(--muted);"><span class="task-icon">⏳</span> 2. Create database 'lab_sandbox'</li>
            <li id="task-3" style="margin-bottom: 0px; display: flex; align-items: center; gap: 8px; color: var(--muted);"><span class="task-icon">⏳</span> 3. List all databases to verify</li>
          </ul>
        </div>

        <div class="card sticky-result">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Terminal Sandbox</h2>
            <div id="visual-state" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; display: none;">
              💾 Databases: <span id="db-count">4</span>
            </div>
          </div>
          
          <div style="background: #1e293b; color: #10b981; font-family: monospace; padding: 16px; border-radius: 8px; min-height: 250px; overflow-y: auto;" id="terminal-output">
            <p style="margin: 0; color: #94a3b8;">$ Waiting for user input...</p>
          </div>
          
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <div style="flex: 1;">
              <textarea id="terminal-input" rows="1" placeholder="Type a command (e.g., mysql -u root -p)" style="width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 4px; font-family: monospace;" onkeypress="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); executeTerminalCommand(); }"></textarea>
            </div>
            <button onclick="executeTerminalCommand()" style="background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; height: fit-content;">Run</button>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button onclick="insertCommand('mysql -u root -p')" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">mysql -u root -p</button>
            <button onclick="insertCommand('CREATE DATABASE lab_sandbox;')" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">CREATE DATABASE</button>
            <button onclick="insertCommand('SHOW DATABASES;')" style="background: var(--bg-color); border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">SHOW DATABASES</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal1" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal1') closeGuide1()">
      <div style="background: var(--card); border-radius: 8px; max-width: 600px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
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
          <p>In the terminal simulator, complete the tasks listed to set up your environment.</p>
        </div>
      </div>
    </div>
    
    <!-- Quiz Modal -->
    <div id="quizModal1" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal1') closeQuiz1()">
      <div style="background: var(--card); border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz1()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz1Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

window.simState = {
  connected: false,
  tasks: [false, false, false]
};

window.insertCommand = function(cmd) {
  if(window.sqlEditor) {
    window.sqlEditor.setValue(cmd);
  } else {
    document.getElementById('terminal-input').value = cmd;
  }
};

window.resetSimulation = function() {
  window.simState.connected = false;
  window.simState.tasks = [false, false, false];
  document.getElementById('terminal-output').innerHTML = '<p style="margin: 0; color: #94a3b8;">$ Waiting for user input...</p>';
  document.getElementById('visual-state').style.display = 'none';
  if(window.DB) window.DB.resetDatabase();
  if(window.sqlEditor) window.sqlEditor.setValue('');
  updateTaskUI();
};

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

function updateTaskUI() {
  for(let i = 0; i < 3; i++) {
    const taskLi = document.getElementById('task-' + (i+1));
    if (!taskLi) continue;
    const icon = taskLi.querySelector('.task-icon');
    if (window.simState.tasks[i]) {
      icon.textContent = '✅';
      taskLi.style.color = 'var(--text)';
      taskLi.style.textDecoration = 'line-through';
    } else {
      icon.textContent = '⏳';
      // Highlight current task
      if (i === 0 || window.simState.tasks[i-1]) {
        taskLi.style.color = 'var(--text)';
        taskLi.style.fontWeight = 'bold';
      } else {
        taskLi.style.color = 'var(--muted)';
        taskLi.style.fontWeight = 'normal';
      }
      taskLi.style.textDecoration = 'none';
    }
  }
}

window.executeTerminalCommand = function() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const cmd = window.sqlEditor ? window.sqlEditor.getValue().trim() : input.value.trim();
  if (!cmd) return;
  
  const line = document.createElement('p');
  line.style.margin = '4px 0';
  line.style.color = 'white';
  line.textContent = (window.simState.connected ? 'mysql> ' : '$ ') + cmd;
  output.appendChild(line);
  
  const res = document.createElement('div');
  res.style.margin = '0 0 12px 0';
  res.style.color = '#94a3b8';

  const cmdLower = cmd.toLowerCase();
  
  // Intelligent hint system
  let hint = '';
  if (cmdLower === 'mysql' || cmdLower === 'mysql -u root') {
    hint = "Hint: To connect, use 'mysql -u root -p' to prompt for a password.";
  } else if (cmdLower.includes('create database') && !cmdLower.endsWith(';')) {
    hint = "Hint: SQL statements must end with a semicolon (;).";
  } else if (cmdLower.includes('show database') && !cmdLower.includes('databases')) {
    hint = "Hint: The command is plural: SHOW DATABASES;";
  }

  if (hint) {
    res.style.color = '#f59e0b'; // warning color
    res.innerHTML = `⚠️ ${hint}`;
  } 
  else if (cmdLower.startsWith('mysql -u root -p')) {
    window.simState.connected = true;
    window.simState.tasks[0] = true;
    res.innerHTML = 'Enter password: <br>Welcome to the MySQL monitor.  Commands end with ; or \\g.<br>Server version: 8.0.32 MySQL Community Server';
    if(window.DB) window.DB.resetDatabase();
  } 
  else if (!window.simState.connected) {
    res.style.color = '#ef4444';
    res.textContent = "ERROR 2002 (HY000): Can't connect to local MySQL server through socket (Not connected)";
  } 
  else {
    // Pass to SQL engine
    const queryResult = window.DB ? window.DB.executeQuery(cmd) : 'Query executed (simulation mode).';
    res.innerHTML = queryResult;
    
    // Check tasks
    if (cmdLower.includes('create database lab_sandbox;')) {
      if (!queryResult.includes('ERROR')) {
        window.simState.tasks[1] = true;
        document.getElementById('visual-state').style.display = 'block';
        document.getElementById('db-count').textContent = '5';
      }
    } else if (cmdLower.includes('show databases;')) {
      if (window.simState.tasks[1]) {
        window.simState.tasks[2] = true;
      }
    }
  }
  
  output.appendChild(res);
  input.value = '';
  if(window.sqlEditor) window.sqlEditor.setValue('');
  output.scrollTop = output.scrollHeight;
  
  updateTaskUI();
};

// Guide and Quiz logic for Exp 1
window.openGuide1 = function() { document.getElementById('guideModal1').style.display = 'flex'; };
window.closeGuide1 = function() { document.getElementById('guideModal1').style.display = 'none'; };

const quiz1Questions = [
  { question: "Which schema provides Logical Data Independence?", options: ["External Schema", "Conceptual Schema", "Internal Schema", "All of the above"], correct: 1, explanation: "The Conceptual Schema provides logical data independence by separating user views from the physical structure." },
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
  let html = `<p style="margin-top: 0; font-size: 16px; font-weight: 500;">${question.question}</p>`;
  html += '<div style="margin: 20px 0;">';
  question.options.forEach((option, index) => {
    html += `<button onclick="checkAnswer1(${index}, ${question.correct}, '${question.explanation.replace(/'/g, "\\'")}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: var(--card); border-radius: 6px; text-align: left; cursor: pointer;">${option}</button>`;
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
  let html = `<div style="background: ${resultColor}20; border-left: 4px solid ${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">`;
  html += `<p style="color: ${resultColor}; font-weight: 600; margin: 0 0 8px 0;">${resultMessage}</p>`;
  html += `<p style="margin: 0; color: var(--text);">${explanation}</p></div>`;
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
  window.simState = { connected: false, tasks: [false, false, false] };
  updateTaskUI();
};