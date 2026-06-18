/**
 * Renderer — converts JSON data into HTML strings for each page type.
 */
const Renderer = {

  aim(data) {
    return `
      <span class="badge">Aim</span>
      <div class="card">
        <h2>Objective</h2>
        <p>${data.objective}</p>
      </div>
      <div class="card">
        <h2>Learning Objectives</h2>
        <ul>${data.learningObjectives.map(o => `<li>${o}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h2>Expected Outcomes</h2>
        <p>Upon completion of this experiment, students will be able to:</p>
        <ul>${data.expectedOutcomes.map(o => `<li>${o}</li>`).join('')}</ul>
      </div>`;
  },

  theory(data) {
    const sections = data.sections.map(s => `
      <div class="card">
        <h3>${s.title}</h3>
        <p>${s.content}</p>
        ${s.code ? `<pre>${escHtml(s.code)}</pre>` : ''}
      </div>`).join('');

    const having = data.havingClause ? `
      <div class="card">
        <h2>${data.havingClause.title}</h2>
        <p>${data.havingClause.content}</p>
        <pre>${escHtml(data.havingClause.code)}</pre>
      </div>` : '';

    const whereVsHaving = data.whereVsHaving ? `
      <div class="card">
        <h2>${data.whereVsHaving.title}</h2>
        <ul>${data.whereVsHaving.points.map(p =>
          `<li><strong>${p.clause}:</strong> ${p.description}</li>`).join('')}
        </ul>
      </div>` : '';

    const mappingRules = data.mappingRules ? `
      <div class="card">
        <h2>${data.mappingRules.title}</h2>
        <p>${data.mappingRules.content}</p>
        <ul>${data.mappingRules.rules.map(r =>
          `<li><strong>${r.term}:</strong> ${r.description}</li>`).join('')}
        </ul>
      </div>` : '';

    const fdSection = data.functionalDependencies ? `
      <div class="card">
        <h2>${data.functionalDependencies.title}</h2>
        <p>${data.functionalDependencies.content}</p>
        <pre>${escHtml(data.functionalDependencies.code)}</pre>
        <ul>${data.functionalDependencies.keyTerms.map(t =>
          `<li><strong>${t.term}:</strong> ${t.description}</li>`).join('')}
        </ul>
      </div>` : '';

    const anomalies = data.anomalies ? `
      <div class="card">
        <h2>${data.anomalies.title}</h2>
        <p>${data.anomalies.content}</p>
        <ul>${data.anomalies.types.map(t =>
          `<li><strong>${t.name}:</strong> ${t.description}</li>`).join('')}
        </ul>
      </div>` : '';

    const example = data.practicalExample ? `
      <div class="card">
        <h2>${data.practicalExample.title}</h2>
        <p>${data.practicalExample.description}</p>
        <pre>${escHtml(data.practicalExample.code)}</pre>
      </div>` : '';

    const realWorld = data.realWorldApplication ? `
      <div class="card" style="background: linear-gradient(to right, rgba(59, 130, 246, 0.05), transparent); border-left: 4px solid var(--imperial-blue); margin-bottom: 24px;">
        <h2 style="display: flex; align-items: center; gap: 8px; color: var(--imperial-blue);">
          🌍 Real-World Application: ${data.realWorldApplication.title}
        </h2>
        <p style="font-size: 16px; line-height: 1.6;">${data.realWorldApplication.scenario}</p>
      </div>` : '';

    return `
      <span class="badge">Theory</span>
      <div class="card">
        <h2>Introduction</h2>
        <p>${data.introduction}</p>
      </div>
      
      ${realWorld}
      
      ${String(expId) === '4' ? this.joinVisualizer() : ''}
      ${String(expId) === '5' ? this.groupByVisualizer() : ''}
      ${String(expId) === '8' ? this.indexRaceVisualizer() : ''}
      ${String(expId) === '9' ? this.bankTransferVisualizer() : ''}

      ${fdSection}
      <div class="grid">${sections}</div>
      ${having}${whereVsHaving}${mappingRules}${anomalies}${example}`;
  },

  joinVisualizer() {
    return `
      <div class="card" style="margin-top: 24px; text-align: center; background: var(--bg); border: 2px solid var(--border);">
        <h2 style="margin-bottom: 16px;">Interactive Join Visualizer</h2>
        <p style="color: var(--muted); margin-bottom: 24px;">Click the buttons below to see how different SQL Joins combine data from two tables.</p>
        
        <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; flex-wrap: wrap;">
          <button onclick="window.animateJoin('inner')" class="sim-btn" style="background: var(--imperial-blue); color: white;">INNER JOIN</button>
          <button onclick="window.animateJoin('left')" class="sim-btn" style="background: var(--french-blue); color: white;">LEFT JOIN</button>
          <button onclick="window.animateJoin('right')" class="sim-btn" style="background: var(--teal); color: white;">RIGHT JOIN</button>
          <button onclick="window.animateJoin('full')" class="sim-btn" style="background: var(--accent); color: white;">FULL OUTER JOIN</button>
        </div>

        <div style="position: relative; width: 300px; height: 200px; margin: 0 auto;">
          <!-- Table A Circle -->
          <div id="circle-a" style="position: absolute; left: 0; top: 0; width: 180px; height: 180px; border-radius: 50%; border: 3px solid #3b82f6; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: flex-start; padding-left: 20px; transition: all 0.5s ease;">
            <strong style="color: #3b82f6; font-size: 18px;">Table A</strong>
          </div>
          
          <!-- Table B Circle -->
          <div id="circle-b" style="position: absolute; right: 0; top: 0; width: 180px; height: 180px; border-radius: 50%; border: 3px solid #f59e0b; background: rgba(245, 158, 11, 0.1); display: flex; align-items: center; justify-content: flex-end; padding-right: 20px; transition: all 0.5s ease;">
            <strong style="color: #f59e0b; font-size: 18px;">Table B</strong>
          </div>
          
          <!-- Intersection (Hidden initially) -->
          <div id="circle-intersection" style="position: absolute; left: 80px; top: 0; width: 140px; height: 180px; border-radius: 50%; background: transparent; transition: all 0.5s ease; clip-path: ellipse(40px 90px at 70px 90px);"></div>
        </div>
        
        <p id="join-desc" style="margin-top: 24px; font-weight: bold; min-height: 40px;"></p>
        
        <script>
          window.animateJoin = function(type) {
            const a = document.getElementById('circle-a');
            const b = document.getElementById('circle-b');
            const inter = document.getElementById('circle-intersection');
            const desc = document.getElementById('join-desc');
            
            // Reset colors
            a.style.background = 'rgba(59, 130, 246, 0.1)';
            b.style.background = 'rgba(245, 158, 11, 0.1)';
            inter.style.background = 'transparent';

            if (type === 'inner') {
              inter.style.background = '#10b981';
              desc.innerHTML = "<strong>INNER JOIN:</strong> Only returns the overlapping records (matches in both tables).";
            } else if (type === 'left') {
              a.style.background = 'rgba(59, 130, 246, 0.6)';
              inter.style.background = 'rgba(59, 130, 246, 0.6)';
              desc.innerHTML = "<strong>LEFT JOIN:</strong> Returns ALL records from Table A, plus matched records from Table B.";
            } else if (type === 'right') {
              b.style.background = 'rgba(245, 158, 11, 0.6)';
              inter.style.background = 'rgba(245, 158, 11, 0.6)';
              desc.innerHTML = "<strong>RIGHT JOIN:</strong> Returns ALL records from Table B, plus matched records from Table A.";
            } else if (type === 'full') {
              a.style.background = 'rgba(59, 130, 246, 0.6)';
              b.style.background = 'rgba(245, 158, 11, 0.6)';
              inter.style.background = '#10b981';
              desc.innerHTML = "<strong>FULL OUTER JOIN:</strong> Returns ALL records from both tables, matching where possible.";
            }
          };
        </script>
      </div>
    `;
  },

  groupByVisualizer() {
    return `
      <div class="card" style="margin-top: 24px; text-align: center; background: var(--bg); border: 2px solid var(--border);">
        <h2 style="margin-bottom: 16px;">Interactive GROUP BY Visualizer</h2>
        <p style="color: var(--muted); margin-bottom: 24px;">Watch how individual rows are bucketed together and aggregated.</p>
        
        <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 32px;">
          <button onclick="window.animateGroupBy('reset')" class="sim-btn" style="background: var(--muted); color: white;">1. Reset Data</button>
          <button onclick="window.animateGroupBy('group')" class="sim-btn" style="background: var(--imperial-blue); color: white;">2. GROUP BY Dept</button>
          <button onclick="window.animateGroupBy('aggregate')" class="sim-btn" style="background: var(--accent); color: white;">3. COUNT()</button>
        </div>

        <div style="position: relative; width: 100%; height: 250px; border: 1px dashed var(--border); border-radius: 8px; overflow: hidden; background: var(--card);">
          <!-- Buckets -->
          <div id="gb-bucket-hr" style="position: absolute; left: 10%; bottom: 10px; width: 120px; height: 180px; border: 2px solid #3b82f6; border-radius: 8px; opacity: 0; transition: opacity 0.5s;">
            <div style="background: #3b82f6; color: white; font-weight: bold; padding: 4px;">HR Dept</div>
          </div>
          <div id="gb-bucket-it" style="position: absolute; left: 40%; bottom: 10px; width: 120px; height: 180px; border: 2px solid #f59e0b; border-radius: 8px; opacity: 0; transition: opacity 0.5s;">
            <div style="background: #f59e0b; color: white; font-weight: bold; padding: 4px;">IT Dept</div>
          </div>
          <div id="gb-bucket-sales" style="position: absolute; left: 70%; bottom: 10px; width: 120px; height: 180px; border: 2px solid #10b981; border-radius: 8px; opacity: 0; transition: opacity 0.5s;">
            <div style="background: #10b981; color: white; font-weight: bold; padding: 4px;">Sales Dept</div>
          </div>
          
          <!-- Rows -->
          <div class="gb-row" id="gb-row-1" data-dept="hr" style="position: absolute; left: 10%; top: 20px; background: #bfdbfe; color: #1e3a8a; padding: 4px 8px; border-radius: 4px; transition: all 1s ease;">Alice (HR)</div>
          <div class="gb-row" id="gb-row-2" data-dept="it" style="position: absolute; left: 30%; top: 20px; background: #fde68a; color: #78350f; padding: 4px 8px; border-radius: 4px; transition: all 1s ease;">Bob (IT)</div>
          <div class="gb-row" id="gb-row-3" data-dept="sales" style="position: absolute; left: 50%; top: 20px; background: #a7f3d0; color: #064e3b; padding: 4px 8px; border-radius: 4px; transition: all 1s ease;">Charlie (Sales)</div>
          <div class="gb-row" id="gb-row-4" data-dept="hr" style="position: absolute; left: 70%; top: 20px; background: #bfdbfe; color: #1e3a8a; padding: 4px 8px; border-radius: 4px; transition: all 1s ease;">David (HR)</div>
          <div class="gb-row" id="gb-row-5" data-dept="it" style="position: absolute; left: 85%; top: 20px; background: #fde68a; color: #78350f; padding: 4px 8px; border-radius: 4px; transition: all 1s ease;">Eve (IT)</div>
          
          <!-- Aggregate Results (Hidden initially) -->
          <div class="gb-agg" id="gb-agg-hr" style="position: absolute; left: 10%; bottom: 80px; width: 120px; text-align: center; font-size: 24px; font-weight: bold; color: #1e3a8a; opacity: 0; transition: opacity 0.5s;">COUNT: 2</div>
          <div class="gb-agg" id="gb-agg-it" style="position: absolute; left: 40%; bottom: 80px; width: 120px; text-align: center; font-size: 24px; font-weight: bold; color: #78350f; opacity: 0; transition: opacity 0.5s;">COUNT: 2</div>
          <div class="gb-agg" id="gb-agg-sales" style="position: absolute; left: 70%; bottom: 80px; width: 120px; text-align: center; font-size: 24px; font-weight: bold; color: #064e3b; opacity: 0; transition: opacity 0.5s;">COUNT: 1</div>
        </div>
        
        <script>
          window.animateGroupBy = function(step) {
            const rows = [
              { id: 'gb-row-1', startLeft: '10%', dept: 'hr', groupLeft: '15%', groupTop: '100px' },
              { id: 'gb-row-2', startLeft: '30%', dept: 'it', groupLeft: '45%', groupTop: '100px' },
              { id: 'gb-row-3', startLeft: '50%', dept: 'sales', groupLeft: '75%', groupTop: '100px' },
              { id: 'gb-row-4', startLeft: '70%', dept: 'hr', groupLeft: '15%', groupTop: '140px' },
              { id: 'gb-row-5', startLeft: '85%', dept: 'it', groupLeft: '45%', groupTop: '140px' }
            ];
            
            if (step === 'reset') {
              rows.forEach(r => {
                const el = document.getElementById(r.id);
                el.style.left = r.startLeft;
                el.style.top = '20px';
                el.style.opacity = '1';
                el.style.transform = 'scale(1)';
              });
              document.getElementById('gb-bucket-hr').style.opacity = '0';
              document.getElementById('gb-bucket-it').style.opacity = '0';
              document.getElementById('gb-bucket-sales').style.opacity = '0';
              
              document.querySelectorAll('.gb-agg').forEach(el => el.style.opacity = '0');
            } else if (step === 'group') {
              document.getElementById('gb-bucket-hr').style.opacity = '1';
              document.getElementById('gb-bucket-it').style.opacity = '1';
              document.getElementById('gb-bucket-sales').style.opacity = '1';
              
              rows.forEach(r => {
                const el = document.getElementById(r.id);
                el.style.left = r.groupLeft;
                el.style.top = r.groupTop;
                el.style.opacity = '1';
                el.style.transform = 'scale(1)';
              });
              document.querySelectorAll('.gb-agg').forEach(el => el.style.opacity = '0');
            } else if (step === 'aggregate') {
              rows.forEach(r => {
                const el = document.getElementById(r.id);
                el.style.opacity = '0';
                el.style.transform = 'scale(0)';
              });
              setTimeout(() => {
                document.querySelectorAll('.gb-agg').forEach(el => el.style.opacity = '1');
              }, 500);
            }
          };
        </script>
      </div>
    `;
  },

  indexRaceVisualizer() {
    return `
      <div class="card" style="margin-top: 24px; text-align: center; background: var(--bg); border: 2px solid var(--border);">
        <h2 style="margin-bottom: 16px;">The Great Scan Race: Full Table vs. Index Scan</h2>
        <p style="color: var(--muted); margin-bottom: 24px;">Finding ID = 75 in a database of 100 records.</p>
        
        <button onclick="window.startRace()" class="sim-btn" style="background: var(--primary); color: white; margin-bottom: 24px; font-size: 16px; padding: 10px 24px;">🏁 Start Race</button>

        <!-- Full Table Scan Track -->
        <div style="margin-bottom: 24px; text-align: left;">
          <strong style="color: #ef4444;">🐌 Full Table Scan (No Index): O(N)</strong>
          <div style="background: var(--card); border: 1px solid var(--border); height: 40px; border-radius: 20px; margin-top: 8px; position: relative; overflow: hidden;">
            <div id="race-bar-full" style="background: #ef4444; height: 100%; width: 0%; transition: width linear;"></div>
            <span style="position: absolute; right: 16px; top: 10px; font-family: monospace; color: var(--muted);">100 checks</span>
          </div>
        </div>

        <!-- Index Scan Track -->
        <div style="text-align: left;">
          <strong style="color: #10b981;">🚀 B-Tree Index Scan: O(log N)</strong>
          <div style="background: var(--card); border: 1px solid var(--border); height: 40px; border-radius: 20px; margin-top: 8px; position: relative; overflow: hidden;">
            <div id="race-bar-index" style="background: #10b981; height: 100%; width: 0%; transition: width ease-out;"></div>
            <span style="position: absolute; right: 16px; top: 10px; font-family: monospace; color: var(--muted);">~7 checks</span>
          </div>
        </div>
        
        <script>
          window.startRace = function() {
            const fullBar = document.getElementById('race-bar-full');
            const indexBar = document.getElementById('race-bar-index');
            
            // Reset
            fullBar.style.transition = 'none';
            indexBar.style.transition = 'none';
            fullBar.style.width = '0%';
            indexBar.style.width = '0%';
            
            // Reflow
            void fullBar.offsetWidth;
            
            // Animate
            fullBar.style.transition = 'width 4s linear';
            indexBar.style.transition = 'width 0.5s ease-out';
            
            fullBar.style.width = '100%';
            indexBar.style.width = '100%';
          };
        </script>
      </div>
    `;
  },

  bankTransferVisualizer() {
    return `
      <div class="card" style="margin-top: 24px; text-align: center; background: var(--bg); border: 2px solid var(--border);">
        <h2 style="margin-bottom: 16px;">ACID Simulator: The Bank Transfer (Atomicity)</h2>
        <p style="color: var(--muted); margin-bottom: 24px;">Transfer $50 from Account A to Account B.</p>
        
        <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 32px; align-items: center;">
          <div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 20px; width: 120px; background: var(--card);">
            <h3 style="margin: 0 0 12px 0;">Acc A</h3>
            <div id="bank-acc-a" style="font-size: 28px; font-weight: bold; color: #3b82f6;">$100</div>
          </div>
          
          <div style="font-size: 32px; color: var(--muted);">➡️</div>
          
          <div style="border: 2px solid #10b981; border-radius: 12px; padding: 20px; width: 120px; background: var(--card);">
            <h3 style="margin: 0 0 12px 0;">Acc B</h3>
            <div id="bank-acc-b" style="font-size: 28px; font-weight: bold; color: #10b981;">$100</div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 16px;">
          <button onclick="window.simBank(true)" class="sim-btn" style="background: var(--imperial-blue); color: white;">Transfer (Success)</button>
          <button onclick="window.simBank(false)" class="sim-btn" style="background: #ef4444; color: white;">Transfer (Server Crash!)</button>
          <button onclick="window.simBankReset()" class="sim-btn" style="background: var(--muted); color: white;">Reset</button>
        </div>
        
        <div id="bank-log" style="font-family: monospace; text-align: left; background: #1e1e1e; color: #a3a3a3; padding: 12px; border-radius: 6px; min-height: 80px;">
          > Waiting to start transaction...
        </div>

        <script>
          window.simBankReset = function() {
            document.getElementById('bank-acc-a').textContent = '$100';
            document.getElementById('bank-acc-b').textContent = '$100';
            document.getElementById('bank-log').innerHTML = '> Accounts reset to $100.';
          };
          
          window.simBank = function(success) {
            const accA = document.getElementById('bank-acc-a');
            const accB = document.getElementById('bank-acc-b');
            const log = document.getElementById('bank-log');
            
            // Initial state is $100
            if (accA.textContent !== '$100') window.simBankReset();
            
            log.innerHTML = '> BEGIN TRANSACTION;<br>> UPDATE Accounts SET balance = balance - 50 WHERE id = A;';
            accA.textContent = '$50';
            
            setTimeout(() => {
              if (success) {
                log.innerHTML += '<br>> UPDATE Accounts SET balance = balance + 50 WHERE id = B;';
                accB.textContent = '$150';
                setTimeout(() => {
                  log.innerHTML += '<br>> COMMIT;<br><span style="color: #10b981;">> Transaction Successful!</span>';
                }, 800);
              } else {
                log.innerHTML += '<br><span style="color: #ef4444;">> FATAL ERROR: Server crashed before updating Account B!</span>';
                setTimeout(() => {
                  log.innerHTML += '<br>> ROLLBACK;<br>> Restoring original values to maintain ATOMICITY (all or nothing).';
                  accA.textContent = '$100';
                }, 1500);
              }
            }, 1000);
          };
        </script>
      </div>
    `;
  },

  mcq(data, type, expId) {
    const label = type === 'pretest' ? 'Pre-Test' : 'Post-Test';
    const totalQuestions = data.questions.length;
    const questions = data.questions.map((q, i) => `
      <div class="card question" data-question="${i}" data-exp-id="${expId}" data-test-type="${type}" data-total="${totalQuestions}">
        <p><strong>${i + 1}. ${q.question}</strong></p>
        ${q.options.map((opt, j) => `
          <button onclick="checkAnswer(this, ${j === q.correctIndex})">${String.fromCharCode(65+j)}) ${opt}</button>
        `).join('')}
        <p class="result"></p>
      </div>`).join('');
    
    const summaryCard = `
      <div class="card" id="mcq-summary" style="display: none; text-align: center; margin-top: 24px;">
        <h2>Test Completed!</h2>
        <p style="font-size: 18px;">Your score: <strong id="mcq-score">0</strong> / ${totalQuestions}</p>
        <button onclick="window.location.hash='#/experiment/${expId}/${type === 'pretest' ? 'procedure' : 'feedback'}'" class="sim-btn" style="background: var(--primary); color: white; margin-top: 16px;">Continue</button>
      </div>
    `;

    return `
      <span class="badge">${label}</span>
      <p style="margin-bottom:24px;color:var(--muted);">${data.instructions}</p>
      ${questions}
      ${summaryCard}`;
  },

  procedure(data) {
    // Generate an interactive carousel instead of a static list
    const numSteps = data.steps.length;
    
    let html = `
      <span class="badge">Procedure</span>
      <div class="card" style="position: relative; overflow: hidden; min-height: 400px; padding-bottom: 80px;">
        <h2>Interactive Procedure Walkthrough</h2>
        <p style="color:var(--muted);margin-bottom:24px">${data.introduction}</p>
        
        <div id="procedure-carousel" style="display: flex; transition: transform 0.3s ease;">
    `;
    
    data.steps.forEach((s, i) => {
      html += `
          <div class="procedure-step" style="min-width: 100%; box-sizing: border-box; padding: 0 20px;">
            <h3 style="color: var(--primary); margin-bottom: 12px; font-size: 20px;"><span style="display:inline-block; background: var(--bg); color: var(--text); border-radius: 50%; width: 32px; height: 32px; text-align: center; line-height: 32px; margin-right: 8px;">${i+1}</span>${s.title}</h3>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">${s.content}</p>
            ${s.subpoints ? `<ul style="margin-top:8px; line-height: 1.5; padding-left: 20px; font-size: 15px;">${s.subpoints.map(p => `<li style="margin-bottom:6px;">${p}</li>`).join('')}</ul>` : ''}
            ${s.code ? `<pre style="font-size: 15px; margin-top: 16px;">${escHtml(s.code)}</pre>` : ''}
          </div>
      `;
    });
    
    html += `
        </div>
        
        <!-- Controls -->
        <div style="position: absolute; bottom: 24px; left: 24px; right: 24px; display: flex; justify-content: space-between; align-items: center;">
          <button id="proc-prev-btn" onclick="window.procedureManager.prev()" style="padding: 10px 20px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg); color: var(--text); cursor: pointer; font-weight: bold; opacity: 0.5; pointer-events: none;">&larr; Previous</button>
          
          <div style="display: flex; gap: 6px;">
            ${data.steps.map((_, i) => `<div class="proc-dot" id="proc-dot-${i}" style="width: 10px; height: 10px; border-radius: 50%; background: ${i === 0 ? 'var(--primary)' : 'var(--border)'}; transition: 0.2s;"></div>`).join('')}
          </div>
          
          <button id="proc-next-btn" onclick="window.procedureManager.next()" style="padding: 10px 20px; border-radius: 6px; border: none; background: var(--primary); color: white; cursor: pointer; font-weight: bold;">Next Step &rarr;</button>
        </div>
      </div>
      
      <div class="card" id="expected-outcomes-card" style="display: none; animation: fadeIn 0.5s;">
        <h2 style="color: #10b981;">🎉 Expected Outcomes Reached</h2>
        <ul style="line-height: 1.6; font-size: 15px; margin-top: 16px;">${data.expectedOutcomes.map(o => `<li style="margin-bottom: 8px;">${o}</li>`).join('')}</ul>
      </div>
      
      <script>
        // Inline manager for the procedure logic
        window.procedureManager = {
          currentStep: 0,
          totalSteps: ${numSteps},
          
          updateUI() {
            const carousel = document.getElementById('procedure-carousel');
            const prevBtn = document.getElementById('proc-prev-btn');
            const nextBtn = document.getElementById('proc-next-btn');
            const outcomesCard = document.getElementById('expected-outcomes-card');
            
            // Move carousel
            carousel.style.transform = 'translateX(-' + (this.currentStep * 100) + '%)';
            
            // Update dots
            for (let i = 0; i < this.totalSteps; i++) {
              document.getElementById('proc-dot-' + i).style.background = (i === this.currentStep) ? 'var(--primary)' : 'var(--border)';
            }
            
            // Prev button state
            if (this.currentStep === 0) {
              prevBtn.style.opacity = '0.5';
              prevBtn.style.pointerEvents = 'none';
            } else {
              prevBtn.style.opacity = '1';
              prevBtn.style.pointerEvents = 'auto';
            }
            
            // Next button state
            if (this.currentStep === this.totalSteps - 1) {
              nextBtn.innerHTML = 'Finish';
              outcomesCard.style.display = 'block';
            } else {
              nextBtn.innerHTML = 'Next Step &rarr;';
              outcomesCard.style.display = 'none';
            }
          },
          
          next() {
            if (this.currentStep < this.totalSteps - 1) {
              this.currentStep++;
              this.updateUI();
            } else {
              // Proceed to simulation
              const hash = window.location.hash;
              const nextHash = hash.replace('procedure', 'simulation');
              window.location.hash = nextHash;
            }
          },
          
          prev() {
            if (this.currentStep > 0) {
              this.currentStep--;
              this.updateUI();
            }
          }
        };
      </script>
    `;
    
    return html;
  },

  references(data) {
    const list = data.references.map(r => `
      <li>
        <strong>${r.title}</strong><br>
        ${r.source}
        ${r.url ? `<br><a href="${r.url}" target="_blank">${r.url}</a>` : ''}
      </li>`).join('');

    return `
      <span class="badge">References</span>
      <div class="card">
        <h2>References and Sources</h2>
        <ul class="reference-list">${list}</ul>
      </div>
      <div class="card">
        <h2>Acknowledgments</h2>
        <p>${data.acknowledgment}</p>
        <p style="margin-top:16px;color:var(--muted)"><em>Last Updated: 2026</em></p>
      </div>`;
  },

  feedback() {
    return `
      <span class="badge">Feedback</span>
      <div class="card">
        <h2>Share Your Feedback</h2>
        <p style="color:var(--muted);margin-bottom:24px">
          We value your opinion! Please share your thoughts about this virtual lab experiment.
          Your feedback helps us improve the learning experience.
        </p>
        <form id="feedbackForm" onsubmit="handleFeedbackSubmit(event)">
          <label for="fbName">Your Name:</label>
          <input type="text" id="fbName" placeholder="Enter your name" required>
          <label for="fbText">Your Feedback (Maximum 50 words):</label>
          <textarea id="fbText" placeholder="Please share your feedback here..." required
            oninput="countFeedbackWords()" maxlength="2000"></textarea>
          <div id="wordCount" class="word-count">Words: 0 / 50</div>
          <button type="submit">Submit Feedback</button>
        </form>
        <div id="successMessage" style="display:none;margin-top:20px;padding:16px;
          background:#d1fae5;border-radius:8px;color:#065f46;border-left:4px solid #10b981">
          <strong>Thank you!</strong> Your feedback has been submitted successfully.
        </div>
      </div>`;
  },

  introduction(meta) {
    return `
      <span class="badge">Welcome</span>
      <div class="card">
        <h2>Introduction</h2>
        <p>Welcome to the Database Management Systems Virtual Laboratory. This virtual lab is designed to help
        students understand and practice <strong>${meta.title}</strong>.
        Through this interactive platform, you will ${meta.description}</p>
      </div>
      <div class="card">
        <h2>How to Use This Virtual Lab</h2>
        <ol>
          <li><strong>Start with the Aim:</strong> Understand the objectives of the experiment</li>
          <li><strong>Read the Theory:</strong> Learn the fundamental concepts and syntax</li>
          <li><strong>Take the Pre-Test:</strong> Assess your prior knowledge</li>
          <li><strong>Follow the Procedure:</strong> Step through the experiment systematically</li>
          <li><strong>Try the Simulation:</strong> Practice with interactive examples</li>
          <li><strong>Take the Post-Test:</strong> Evaluate your understanding</li>
          <li><strong>Check References:</strong> Explore additional resources</li>
          <li><strong>Provide Feedback:</strong> Share your thoughts and suggestions</li>
        </ol>
      </div>
      <div class="grid">
        <div class="card">
          <h3>📋 Aim</h3>
          <p>Understand the purpose and objectives of this experiment.</p>
          <a href="#/experiment/${meta.id}/aim" style="display:inline-block;margin-top:12px;color:var(--secondary);font-weight:600;text-decoration:none">Learn More →</a>
        </div>
        <div class="card">
          <h3>📚 Theory</h3>
          <p>Learn the fundamental concepts with detailed explanations and examples.</p>
          <a href="#/experiment/${meta.id}/theory" style="display:inline-block;margin-top:12px;color:var(--secondary);font-weight:600;text-decoration:none">Learn More →</a>
        </div>
        <div class="card">
          <h3>🧪 Simulation</h3>
          <p>Interactive simulation to visualize and practice key concepts.</p>
          <a href="#/experiment/${meta.id}/simulation" style="display:inline-block;margin-top:12px;color:var(--secondary);font-weight:600;text-decoration:none">Try Simulation →</a>
        </div>
        <div class="card">
          <h3>📝 Procedure</h3>
          <p>Step-by-step procedure to perform the experiment.</p>
          <a href="#/experiment/${meta.id}/procedure" style="display:inline-block;margin-top:12px;color:var(--secondary);font-weight:600;text-decoration:none">View Procedure →</a>
        </div>
      </div>`;
  }
};

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
