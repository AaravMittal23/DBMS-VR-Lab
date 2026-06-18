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
            <h2 style="margin: 0;">Transactions</h2>
            <button onclick="openGuide10()" style="background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">📖 Guide</button>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Transaction A -->
            <div style="border: 2px solid #3b82f6; border-radius: 8px; padding: 16px; background: #eff6ff;">
              <h3 style="margin-top: 0; color: #1d4ed8;">Transaction A</h3>
              <div style="display: flex; gap: 8px;">
                <button onclick="window.sim10_lock('A', 'R1')" class="sim-btn" style="flex:1; background: #3b82f6; color: white;">Lock Resource 1</button>
                <button onclick="window.sim10_lock('A', 'R2')" class="sim-btn" style="flex:1; background: #3b82f6; color: white;">Lock Resource 2</button>
              </div>
              <div style="margin-top: 8px;">
                <button onclick="window.sim10_unlock('A')" class="sim-btn" style="width: 100%; background: white; color: #1d4ed8; border: 1px solid #3b82f6;">Release All & Commit</button>
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
                <button onclick="window.sim10_unlock('B')" class="sim-btn" style="width: 100%; background: white; color: #b91c1c; border: 1px solid #ef4444;">Release All & Commit</button>
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
            <div id="res-R1" style="width: 120px; height: 120px; border: 3px dashed #cbd5e1; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; transition: all 0.3s;">
              <h3 style="margin: 0;">Resource 1</h3>
              <span id="lock-R1" style="font-size: 12px; margin-top: 4px; font-weight: bold; color: #64748b;">UNLOCKED</span>
            </div>

            <!-- Resource 2 -->
            <div id="res-R2" style="width: 120px; height: 120px; border: 3px dashed #cbd5e1; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; transition: all 0.3s;">
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
    <div id="guide10-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content" style="max-width: 600px;">
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

window.openGuide10 = function() { document.getElementById('guide10-modal').style.display = 'flex'; };
window.closeGuide10 = function() { document.getElementById('guide10-modal').style.display = 'none'; };

// Auto-quiz system
window.initQuiz10 = function() {
  if (window.quizTimer) clearTimeout(window.quizTimer);
  window.quizTimer = setTimeout(() => {
    const q10 = {
      q: "Which property ensures that a transaction is never left in a partially complete state?",
      opts: ["Atomicity", "Consistency", "Isolation", "Durability"],
      ans: 0,
      exp: "Atomicity ensures 'all or nothing' execution."
    };
    if (window.showPopQuiz) window.showPopQuiz(q10);
  }, Math.random() * 20000 + 15000);
};
