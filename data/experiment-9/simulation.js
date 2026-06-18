window.sim9_renderSimulation = function() {
  return `
    <span class="badge">Interactive Simulation</span>

    <div class="card" style="margin-bottom: 24px;">
      <h2 style="margin-top: 0;">Transaction & ACID Simulator</h2>
      <p style="color: var(--muted); margin-bottom: 0;">
        Explore Database Transactions by simulating a Bank Transfer. Use <code>START TRANSACTION</code>, <code>COMMIT</code>, and <code>ROLLBACK</code> to observe Atomicity and Consistency.
      </p>
    </div>

    <div class="simulation-layout">
      <div class="simulation-left" style="flex: 1;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0;">Transaction Console</h2>
            <button onclick="openGuide9()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
          
          <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <button id="btn-start" onclick="transact('START')" style="background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold;">START TRANSACTION</button>
          </div>
          
          <div id="tx-controls" style="display: none; flex-direction: column; gap: 12px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 16px;">
            <p style="margin: 0; font-weight: bold; color: #0284c7;">Active Transaction ID: #TXN-8472</p>
            <p style="margin: 0; font-size: 13px; color: var(--muted);">Step 1: Deduct $500 from Alice (Acc 1)</p>
            <button id="btn-update1" onclick="transact('UPDATE1')" style="background: #e2e8f0; color: var(--text); border: 1px solid var(--border); padding: 8px; border-radius: 4px; cursor: pointer; text-align: left; font-family: monospace;">UPDATE Accounts SET Balance = Balance - 500 WHERE ID = 1;</button>
            
            <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--muted);">Step 2: Add $500 to Bob (Acc 2)</p>
            <button id="btn-update2" onclick="transact('UPDATE2')" disabled style="background: #f1f5f9; color: #94a3b8; border: 1px dashed var(--border); padding: 8px; border-radius: 4px; cursor: not-allowed; text-align: left; font-family: monospace;">UPDATE Accounts SET Balance = Balance + 500 WHERE ID = 2;</button>
            
            <div style="display: flex; gap: 8px; margin-top: 16px;">
              <button id="btn-commit" onclick="transact('COMMIT')" disabled style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: not-allowed; flex: 1; opacity: 0.5;">COMMIT</button>
              <button id="btn-rollback" onclick="transact('ROLLBACK')" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; flex: 1;">ROLLBACK / CRASH</button>
            </div>
          </div>
          
          <div id="tx-log" style="background: #1e293b; color: #10b981; font-family: monospace; padding: 16px; border-radius: 8px; min-height: 150px; font-size: 13px; overflow-y: auto;">
            > System ready. Waiting for transaction...
          </div>
        </div>
      </div>

      <div class="simulation-right" style="flex: 1;">
        <div class="card sticky-result">
          <h2 style="margin-top: 0;">Bank Accounts Table</h2>
          <div style="display: flex; justify-content: center; gap: 32px; margin-top: 24px;">
            
            <!-- Alice's Account -->
            <div style="text-align: center; background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 24px; width: 150px; position: relative;">
              <div style="font-size: 48px; margin-bottom: 8px;">👩</div>
              <h3 style="margin: 0 0 4px 0;">Alice (ID: 1)</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: var(--primary);" id="bal-alice">$1000</p>
              <div id="lock-alice" style="display: none; position: absolute; top: -10px; right: -10px; background: #f59e0b; color: white; border-radius: 50%; width: 24px; height: 24px; font-size: 12px; line-height: 24px; text-align: center;" title="Row Locked">🔒</div>
            </div>

            <!-- Transfer Arrow -->
            <div style="display: flex; align-items: center; justify-content: center;">
              <div id="arrow-container" style="font-size: 24px; color: #cbd5e1; transition: color 0.3s;">➔</div>
            </div>

            <!-- Bob's Account -->
            <div style="text-align: center; background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 24px; width: 150px; position: relative;">
              <div style="font-size: 48px; margin-bottom: 8px;">👨</div>
              <h3 style="margin: 0 0 4px 0;">Bob (ID: 2)</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: var(--primary);" id="bal-bob">$500</p>
              <div id="lock-bob" style="display: none; position: absolute; top: -10px; right: -10px; background: #f59e0b; color: white; border-radius: 50%; width: 24px; height: 24px; font-size: 12px; line-height: 24px; text-align: center;" title="Row Locked">🔒</div>
            </div>
            
          </div>
          
          <div id="tx-status-banner" style="margin-top: 24px; padding: 12px; border-radius: 4px; text-align: center; font-weight: bold; display: none;"></div>
        </div>
      </div>
    </div>

    <!-- Guide Modal -->
    <div id="guideModal9" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" onclick="if(event.target.id==='guideModal9') closeGuide9()">
      <div style="background: white; border-radius: 8px; max-width: 600px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0;">📖 Transactions Guide</h2>
          <button onclick="closeGuide9()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div style="color: var(--text);">
          <p>Transactions group multiple SQL statements into a single atomic unit.</p>
          <ul>
            <li><strong>Atomicity:</strong> All or nothing. If a transfer fails halfway, the entire transaction is rolled back so no money is lost.</li>
            <li><strong>COMMIT:</strong> Permanently saves the changes made during the transaction.</li>
            <li><strong>ROLLBACK:</strong> Reverts the database state to what it was before the transaction started. Try clicking "ROLLBACK / CRASH" after deducting money from Alice but before adding it to Bob!</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Quiz Modal -->
    <div id="quizModal9" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;" onclick="if(event.target.id==='quizModal9') closeQuiz9()">
      <div style="background: white; border-radius: 8px; max-width: 500px; padding: 32px; box-shadow: 0 20px 25px rgba(0,0,0,0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: var(--primary);">❓ Quick Quiz</h2>
          <button onclick="closeQuiz9()" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px;">✕</button>
        </div>
        <div id="quiz9Content" style="color: var(--text);"></div>
      </div>
    </div>
  `;
};

let txState = 'IDLE'; // IDLE, STARTED, PARTIAL, COMPLETED
let initialAlice = 1000;
let initialBob = 500;
let currentAlice = 1000;
let currentBob = 500;

window.logTX = function(msg, color = '#10b981') {
  const log = document.getElementById('tx-log');
  log.innerHTML += `<br><span style="color:${color}">> ${msg}</span>`;
  log.scrollTop = log.scrollHeight;
};

window.updateUI = function() {
  document.getElementById('bal-alice').textContent = '$' + currentAlice;
  document.getElementById('bal-bob').textContent = '$' + currentBob;
  
  const startBtn = document.getElementById('btn-start');
  const controls = document.getElementById('tx-controls');
  const u1 = document.getElementById('btn-update1');
  const u2 = document.getElementById('btn-update2');
  const commit = document.getElementById('btn-commit');
  const arrow = document.getElementById('arrow-container');
  const lockA = document.getElementById('lock-alice');
  const lockB = document.getElementById('lock-bob');
  const banner = document.getElementById('tx-status-banner');
  
  if (txState === 'IDLE') {
    startBtn.style.display = 'block';
    controls.style.display = 'none';
    arrow.style.color = '#cbd5e1';
    lockA.style.display = 'none';
    lockB.style.display = 'none';
    u1.style.background = '#e2e8f0'; u1.style.color = 'var(--text)'; u1.style.cursor = 'pointer'; u1.disabled = false;
    u2.style.background = '#f1f5f9'; u2.style.color = '#94a3b8'; u2.style.cursor = 'not-allowed'; u2.disabled = true;
    commit.style.opacity = '0.5'; commit.style.cursor = 'not-allowed'; commit.disabled = true;
  } 
  else if (txState === 'STARTED') {
    startBtn.style.display = 'none';
    controls.style.display = 'flex';
    banner.style.display = 'none';
  }
  else if (txState === 'PARTIAL') {
    u1.style.background = '#dcfce7'; u1.style.color = '#16a34a'; u1.disabled = true; u1.style.cursor = 'default';
    u2.style.background = '#e2e8f0'; u2.style.color = 'var(--text)'; u2.style.cursor = 'pointer'; u2.disabled = false;
    lockA.style.display = 'block';
    arrow.style.color = '#f59e0b';
    banner.style.display = 'block';
    banner.style.background = '#fef3c7'; banner.style.color = '#d97706';
    banner.textContent = '⚠️ Database Inconsistent State (Alice deducted, Bob not credited yet)';
  }
  else if (txState === 'COMPLETED') {
    u2.style.background = '#dcfce7'; u2.style.color = '#16a34a'; u2.disabled = true; u2.style.cursor = 'default';
    lockB.style.display = 'block';
    arrow.style.color = '#10b981';
    commit.style.opacity = '1'; commit.style.cursor = 'pointer'; commit.disabled = false;
    banner.style.display = 'block';
    banner.style.background = '#e0e7ff'; banner.style.color = '#4338ca';
    banner.textContent = '✅ Transfer logically complete. Waiting for COMMIT.';
  }
};

window.transact = function(action) {
  const banner = document.getElementById('tx-status-banner');
  
  if (action === 'START') {
    txState = 'STARTED';
    initialAlice = currentAlice;
    initialBob = currentBob;
    document.getElementById('tx-log').innerHTML = '<span style="color:#10b981">> START TRANSACTION;</span>';
    updateUI();
  } 
  else if (action === 'UPDATE1') {
    txState = 'PARTIAL';
    currentAlice -= 500;
    logTX('UPDATE Accounts SET Balance = Balance - 500 WHERE ID = 1;');
    logTX('Row locked. Alice balance updated (uncommitted).', '#f59e0b');
    updateUI();
  }
  else if (action === 'UPDATE2') {
    txState = 'COMPLETED';
    currentBob += 500;
    logTX('UPDATE Accounts SET Balance = Balance + 500 WHERE ID = 2;');
    logTX('Row locked. Bob balance updated (uncommitted).', '#f59e0b');
    updateUI();
  }
  else if (action === 'COMMIT') {
    logTX('COMMIT;');
    logTX('Transaction successfully committed to disk. Locks released.', '#3b82f6');
    txState = 'IDLE';
    banner.style.display = 'block';
    banner.style.background = '#dcfce7'; banner.style.color = '#16a34a';
    banner.textContent = '💾 COMMIT successful. Data is durable.';
    setTimeout(() => { if(txState==='IDLE') banner.style.display='none'; }, 3000);
    updateUI();
  }
  else if (action === 'ROLLBACK') {
    logTX('ROLLBACK; (or System Crash detected)', '#ef4444');
    currentAlice = initialAlice;
    currentBob = initialBob;
    logTX('Changes reverted. Atomicity preserved.', '#ef4444');
    txState = 'IDLE';
    banner.style.display = 'block';
    banner.style.background = '#fee2e2'; banner.style.color = '#ef4444';
    banner.textContent = '↩️ ROLLBACK successful. Data reverted to initial state.';
    setTimeout(() => { if(txState==='IDLE') banner.style.display='none'; }, 3000);
    updateUI();
  }
};

window.openGuide9 = function() { document.getElementById('guideModal9').style.display = 'flex'; };
window.closeGuide9 = function() { document.getElementById('guideModal9').style.display = 'none'; };

const quiz9Questions = [
  { question: "If the system crashes during Step 2 of the transfer, what happens?", options: ["Alice loses money", "Bob gets money anyway", "The database automatically rolls back"], correct: 2, explanation: "Atomicity ensures the partial transaction is rolled back upon recovery." },
  { question: "Which command makes changes permanently visible to other users?", options: ["SAVE", "COMMIT", "WRITE", "FLUSH"], correct: 1, explanation: "COMMIT finalizes the transaction, releasing locks and saving data." }
];

let quiz9Timer = null;
window.startQuiz9Timer = function() {
  const randomDelay = Math.random() * 8000 + 15000;
  quiz9Timer = setTimeout(() => {
    if (Math.random() > 0.4) {
      const q = quiz9Questions[Math.floor(Math.random() * quiz9Questions.length)];
      displayQuiz9(q);
    }
    window.startQuiz9Timer();
  }, randomDelay);
};

window.displayQuiz9 = function(question) {
  const content = document.getElementById('quiz9Content');
  if (!content) return;
  let html = `<p style="margin-top: 0; font-size: 16px; font-weight: 500;">${question.question}</p>`;
  html += '<div style="margin: 20px 0;">';
  question.options.forEach((option, index) => {
    html += `<button onclick="checkAnswer9(${index}, ${question.correct}, '${question.explanation}')" style="display: block; width: 100%; padding: 12px; margin: 10px 0; border: 2px solid var(--border); background: white; border-radius: 6px; text-align: left; cursor: pointer;">${option}</button>`;
  });
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('quizModal9').style.display = 'flex';
};

window.checkAnswer9 = function(selected, correct, explanation) {
  const content = document.getElementById('quiz9Content');
  const isCorrect = selected === correct;
  const resultColor = isCorrect ? '#10b981' : '#dc2626';
  const resultMessage = isCorrect ? '✓ Correct!' : '✗ Incorrect';
  let html = `<div style="background: ${resultColor}20; border-left: 4px solid ${resultColor}; padding: 16px; border-radius: 6px; margin-bottom: 16px;">`;
  html += `<p style="color: ${resultColor}; font-weight: 600; margin: 0 0 8px 0;">${resultMessage}</p>`;
  html += `<p style="margin: 0; color: var(--text);">${explanation}</p></div>`;
  html += '<button onclick="closeQuiz9()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 16px;">Got it!</button>';
  content.innerHTML = html;
};

window.closeQuiz9 = function() {
  const modal = document.getElementById('quizModal9');
  if (modal) modal.style.display = 'none';
};

window.initQuiz9 = function() {
  if (window.quiz9Timer) clearTimeout(window.quiz9Timer);
  window.startQuiz9Timer();
  txState = 'IDLE';
  currentAlice = 1000;
  currentBob = 500;
  updateUI();
};

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('btn-start')) {
    window.startQuiz9Timer();
    updateUI();
  }
});