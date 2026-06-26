window.sim10_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>

    <div class="card" style="margin-bottom: 24px;">
      <h2 style="margin-top: 0;">Concurrency Control & Deadlock Simulator</h2>
      <p style="color: var(--muted); margin-bottom: 0;">
        Simulate two transactions attempting to acquire exclusive locks on two resources. 
        Observe how a deadlock occurs when both transactions wait for locks held by each other.
      </p>
    </div>

    <div class="simulation-layout">
      <!-- Left side: Controls -->
      <div class="simulation-left" style="flex: 1;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Preset Schedules</h2>
            <button onclick="openGuide10()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
           
          <select id="scheduleSelector" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 4px; background: var(--card); color: var(--text); margin-bottom: 16px;" onchange="window.sim10_loadSchedule(this.value)">
            <option value="">-- Select a Concurrency Anomaly --</option>
            <option value="dirtyRead">Dirty Read (Uncommitted Data)</option>
            <option value="deadlock">Deadlock Scenario</option>
            <option value="nonRepeatableRead">Non-Repeatable Read</option>
            <option value="serializableExecution">Serializable Execution (Correct)</option>
          </select>
           
          <div id="sim10-timeline-container" style="margin-bottom: 16px; padding: 12px; background: var(--bg-color); border-radius: 8px; border: 1px solid var(--border); display: none;">
            <h3 style="margin-top: 0; font-size: 14px;">Transaction Timeline</h3>
            <div id="sim10-timeline-view" style="overflow-x: auto;"></div>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <button onclick="window.sim10_prevStep()" class="sim-btn" style="flex: 1; padding: 8px; background: var(--card); border: 1px solid var(--border); border-radius: 4px; cursor: pointer;">◀ Previous</button>
              <button onclick="window.sim10_nextStep()" class="sim-btn" style="flex: 1; padding: 8px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">Next ▶</button>
            </div>
          </div>
           
          <div class="card">
            <h3 style="margin-top: 0; font-size: 16px;">Manual Simulation</h3>
          
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Transaction A -->
            <div style="border: 2px solid #3b82f6; border-radius: 8px; padding: 16px; background: #eff6ff;">
              <h3 style="margin-top: 0; color: #1d4ed8;">Transaction A</h3>
              <div style="display: flex; gap: 8px;">
                <button onclick="window.sim10_lock('A', 'R1')" class="sim-btn" style="flex:1; background: #3b82f6; color: white;">Lock Resource 1</button>
                <button onclick="window.sim10_lock('A', 'R2')" class="sim-btn" style="flex:1; background: #3b82f6; color: white;">Lock Resource 2</button>
              </div>
              <div style="margin-top: 8px;">
                <button onclick="window.sim10_unlock('A')" class="sim-btn" style="width: 100%; background: var(--card); color: #1d4ed8; border: 1px solid #3b82f6;">Release All & Commit</button>
              </div>
            </div>

            <!-- Transaction B -->
            <div style="border: 2px solid #ef4444; border-radius: 8px; padding: 16px; background: #fef2f2;">
              <h3 style="margin-top: 0; color: #b91c1c;">Transaction B</h3>
              <div style="display: flex; gap: 8px;">
                <button onclick="window.sim10_lock('B', 'R2')" class="sim-btn" style="flex:1; background: #ef4444; color: white;">Lock Resource 2</button>
                <button onclick="window.sim10_lock('B', 'R1')" class="sim-btn" style="flex:1; background: #ef4444; color: white;">Lock Resource 1</button>
              </div>
              <div style="margin-top: 8px;">
                <button onclick="window.sim10_unlock('B')" class="sim-btn" style="width: 100%; background: var(--card); color: #b91c1c; border: 1px solid #ef4444;">Release All & Commit</button>
              </div>
            </div>

            <button onclick="window.sim10_reset()" class="sim-btn" style="background: var(--text-color); color: white;">Reset Simulator</button>
          </div>
        </div>
      </div>

      <!-- Right side: Resource visualization and Logs -->
      <div class="simulation-right" style="flex: 1;">
        <div class="card" style="margin-bottom: 24px;">
          <h2 style="margin-top: 0;">Resources State</h2>
          <div style="display: flex; gap: 16px; justify-content: center; padding: 20px 0;">
            <!-- Resource 1 -->
            <div id="res-R1" style="width: 120px; height: 120px; border: 3px dashed #cbd5e1; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--card); transition: all 0.3s;">
              <h3 style="margin: 0;">Resource 1</h3>
              <span id="lock-R1" style="font-size: 12px; margin-top: 4px; font-weight: bold; color: #64748b;">UNLOCKED</span>
            </div>

            <!-- Resource 2 -->
            <div id="res-R2" style="width: 120px; height: 120px; border: 3px dashed #cbd5e1; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--card); transition: all 0.3s;">
              <h3 style="margin: 0;">Resource 2</h3>
              <span id="lock-R2" style="font-size: 12px; margin-top: 4px; font-weight: bold; color: #64748b;">UNLOCKED</span>
            </div>
          </div>
          
          <div id="deadlock-alert" style="display: none; padding: 16px; background: #fee2e2; border-left: 4px solid #ef4444; border-radius: 4px; margin-top: 16px;">
            <h3 style="margin: 0; color: #b91c1c;">⚠️ DEADLOCK DETECTED!</h3>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #7f1d1d;">
              Tx A is waiting for R2 (held by Tx B) AND Tx B is waiting for R1 (held by Tx A). Both are blocked forever.
            </p>
          </div>
        </div>

        <div class="card">
          <h2 style="margin-top: 0;">Transaction Log</h2>
          <div id="tx-log" style="background: #1e293b; color: #38bdf8; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 14px; height: 150px; overflow-y: auto; white-space: pre-wrap;">System initialized. Waiting for transactions...</div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div id="guideModal10" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal10') closeGuide10()">
      <div class="modal-content" style="background: var(--card); border-radius: 8px; max-width: 600px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="margin: 0;">Deadlock Simulator Guide</h2>
          <button onclick="closeGuide10()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="line-height: 1.6;">
          <p><strong>How to create a deadlock:</strong></p>
          <ol>
            <li>Have Transaction A acquire a lock on <strong>Resource 1</strong>.</li>
            <li>Have Transaction B acquire a lock on <strong>Resource 2</strong>.</li>
            <li>Now tell Transaction A to lock <strong>Resource 2</strong> (it will wait).</li>
            <li>Tell Transaction B to lock <strong>Resource 1</strong> (it will wait).</li>
          </ol>
          <p>This creates a circular dependency, leading to a <strong>Deadlock</strong>!</p>
        </div>
      </div>
    </div>

    <!-- Quiz Modal -->
    <div id="quizModal10" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal10') closeQuiz10()">
      <div style="background: var(--card); border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz10()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz10Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

// State
window.sim10_locks = {
  'R1': null, // null, 'A', or 'B'
  'R2': null
};
window.sim10_waiting = {
  'A': null,
  'B': null
};

window.sim10_log = function(msg) {
  const logDiv = document.getElementById('tx-log');
  if (logDiv) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    logDiv.innerHTML += `\n[${time}] ${msg}`;
    logDiv.scrollTop = logDiv.scrollHeight;
  }
};

window.sim10_updateUI = function() {
  const colors = {
    'A': { border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8', name: 'Locked by Tx A' },
    'B': { border: '#ef4444', bg: '#fef2f2', text: '#b91c1c', name: 'Locked by Tx B' },
    'null': { border: '#cbd5e1', bg: '#f8fafc', text: '#64748b', name: 'UNLOCKED' }
  };

  ['R1', 'R2'].forEach(res => {
    const owner = window.sim10_locks[res];
    const el = document.getElementById('res-' + res);
    const textEl = document.getElementById('lock-' + res);
    if (el && textEl) {
      const state = colors[String(owner)];
      el.style.borderColor = state.border;
      el.style.backgroundColor = state.bg;
      el.style.borderStyle = owner ? 'solid' : 'dashed';
      textEl.style.color = state.text;
      textEl.innerText = state.name;
    }
  });

  // Check deadlock
  if (window.sim10_waiting['A'] && window.sim10_waiting['B']) {
    const aWait = window.sim10_waiting['A'];
    const bWait = window.sim10_waiting['B'];
    if (window.sim10_locks[aWait] === 'B' && window.sim10_locks[bWait] === 'A') {
      document.getElementById('deadlock-alert').style.display = 'block';
      window.sim10_log("ERROR: Circular wait detected. DEADLOCK occurred.");
    }
  } else {
    document.getElementById('deadlock-alert').style.display = 'none';
  }
};

window.sim10_lock = function(tx, res) {
  // If already waiting, block clicks
  if (window.sim10_waiting[tx]) {
    window.sim10_log(`Tx ${tx} is blocked waiting for ${window.sim10_waiting[tx]}.`);
    return;
  }

  // If already holds it
  if (window.sim10_locks[res] === tx) {
    window.sim10_log(`Tx ${tx} already holds lock on ${res}.`);
    return;
  }

  // Try to acquire
  if (window.sim10_locks[res] === null) {
    window.sim10_locks[res] = tx;
    window.sim10_log(`Tx ${tx} successfully acquired Exclusive Lock on ${res}.`);
    window.sim10_updateUI();
  } else {
    // Wait
    window.sim10_waiting[tx] = res;
    window.sim10_log(`Tx ${tx} attempts to lock ${res} but it's held by Tx ${window.sim10_locks[res]}. Tx ${tx} is now WAITING.`);
    window.sim10_updateUI();
  }
};

window.sim10_unlock = function(tx) {
  let released = false;
  ['R1', 'R2'].forEach(res => {
    if (window.sim10_locks[res] === tx) {
      window.sim10_locks[res] = null;
      released = true;
      window.sim10_log(`Tx ${tx} released lock on ${res}.`);
      
      // Check if other tx is waiting for this resource
      const otherTx = tx === 'A' ? 'B' : 'A';
      if (window.sim10_waiting[otherTx] === res) {
        window.sim10_waiting[otherTx] = null;
        window.sim10_locks[res] = otherTx; // grant lock
        window.sim10_log(`Tx ${otherTx} was waiting and now acquired lock on ${res}.`);
      }
    }
  });

  if (window.sim10_waiting[tx]) {
    window.sim10_waiting[tx] = null;
  }

  if (released) {
    window.sim10_log(`Tx ${tx} committed successfully.`);
  } else {
    window.sim10_log(`Tx ${tx} holds no locks. Committed.`);
  }
  window.sim10_updateUI();
};

window.sim10_reset = function() {
  window.sim10_locks = { 'R1': null, 'R2': null };
  window.sim10_waiting = { 'A': null, 'B': null };
  const logDiv = document.getElementById('tx-log');
  if (logDiv) logDiv.innerHTML = 'System reset. Waiting for transactions...';
  window.sim10_updateUI();
};

window.openGuide10 = function() { document.getElementById('guideModal10').style.display = 'flex'; };
window.closeGuide10 = function() { document.getElementById('guideModal10').style.display = 'none'; };

// Auto-quiz system
const quiz10Questions = [
  { question: "Which property ensures that a transaction is never left in a partially complete state?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], correct: 0, explanation: "Atomicity ensures 'all or nothing' execution." },
  { question: "What causes a deadlock?", options: ["High CPU usage", "A circular wait for resources", "Missing indexes", "Too many users"], correct: 1, explanation: "A deadlock occurs when two or more transactions form a circular dependency while waiting for locks." }
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
  let html = `<p style="margin-top: 0; font-size: 16px; font-weight: 500;">${question.question}</p>`;
  html += '<div style="margin: 20px 0;">';
  question.options.forEach((option, index) => {
    html += `<button onclick="checkAnswer10(${index}, ${question.correct}, '${question.explanation}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: var(--card); border-radius: 6px; text-align: left; cursor: pointer;">${option}</button>`;
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
  let html = `<div style="background: ${resultColor}20; border-left: 4px solid ${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">`;
  html += `<p style="color: ${resultColor}; font-weight: 600; margin: 0 0 8px 0;">${resultMessage}</p>`;
  html += `<p style="margin: 0; color: var(--text);">${explanation}</p></div>`;
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
};

// Schedule-based simulation functions
window.sim10_currentSchedule = null;
window.sim10_scheduleStep = 0;

window.sim10_loadSchedule = function(scheduleType) {
  if (!scheduleType) {
    document.getElementById('sim10-timeline-container').style.display = 'none';
    return;
  }

  if (typeof window.ConcurrencyTimeline !== 'undefined') {
    const timeline = new window.ConcurrencyTimeline('sim10-timeline-view');
    timeline.loadSchedule(scheduleType);
    window.sim10_currentSchedule = timeline;
    window.sim10_scheduleStep = 0;
    
    document.getElementById('sim10-timeline-container').style.display = 'block';
    window.sim10_log(`Loaded ${scheduleType} schedule. Click 'Next' to step through operations.`);
    window.sim10_renderScheduleTimeline();
  }
};

window.sim10_nextStep = function() {
  if (!window.sim10_currentSchedule) return;
  
  const result = window.sim10_currentSchedule.executeNextStep();
  if (result.complete) {
    window.sim10_log('Schedule execution complete!');
    return;
  }
  
  window.sim10_scheduleStep++;
  window.sim10_log(`[Step ${result.step + 1}] ${result.transaction}: ${result.operation} on ${result.resource}`);
  window.sim10_renderScheduleTimeline();
};

window.sim10_prevStep = function() {
  if (window.sim10_scheduleStep > 0) {
    window.sim10_scheduleStep--;
    window.sim10_log(`Stepped back to step ${window.sim10_scheduleStep}`);
  }
};

window.sim10_renderScheduleTimeline = function() {
  if (!window.sim10_currentSchedule) return;
  
  const timeline = window.sim10_currentSchedule;
  const container = document.getElementById('sim10-timeline-view');
  
  // Render simple timeline
  container.innerHTML = timeline.renderTimeline();
};

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('quiz10Content')) {
    window.startQuiz10Timer();
  }
});
