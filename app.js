/**
 * App — main controller for the DBMS Virtual Lab SPA.
 * Coordinates routing, data fetching, and rendering.
 */

const PAGE_TITLES = {
  introduction: 'Introduction',
  aim:          'Aim',
  theory:       'Theory',
  pretest:      'Pre-Test',
  procedure:    'Procedure',
  simulation:   'Simulation',
  posttest:     'Post-Test',
  references:   'References',
  feedback:     'Feedback'
};

const NAV_PAGES = Object.keys(PAGE_TITLES);

// Cache for loaded JSON so we don't re-fetch on every navigation
const cache = {};

// Track the currently loaded simulation script tag.
// We load ONE experiment simulation script at a time to avoid any
// possibility of cross-experiment global collisions across refreshes.
let simScriptEl = null;
let simScriptExpId = null;

class App {
  constructor() {
    window.appInstance = this;
    this.router = new Router(route => this.handleRoute(route));
    this.init();
  }

  async init() {
    // Initialize Dark Mode
    if (window.StateManager && window.StateManager.getTheme() === 'dark') {
      document.body.classList.add('dark-theme');
      document.getElementById('theme-toggle').textContent = '☀️';
    }
    // Theme toggle delegation
    document.body.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('#theme-toggle');
      if (toggleBtn) {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        document.querySelectorAll('#theme-toggle').forEach(btn => btn.textContent = isDark ? '☀️' : '🌙');
        if (window.StateManager) window.StateManager.setTheme(isDark ? 'dark' : 'light');
        
        if (window.sqlEditor) {
          window.sqlEditor.setOption("theme", isDark ? "dracula" : "default");
        }
      }
    });

    // A11y: Close modals on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        for (let i = 1; i <= 10; i++) {
          const guide = document.getElementById(`guideModal${i}`);
          if (guide && guide.style.display !== 'none') guide.style.display = 'none';
          
          const quiz = document.getElementById(`quizModal${i}`);
          if (quiz && quiz.style.display !== 'none') quiz.style.display = 'none';
        }
      }
    });

    await this.handleRoute(this.router.current());
  }

  /* ------------------------------------------------------------------ */
  /* Routing                                                              */
  /* ------------------------------------------------------------------ */

  async handleRoute(route) {
    // Clean up any running quiz timers from previous simulations
    for (let i = 1; i <= 10; i++) {
      if (window[`quiz${i}Timer`]) clearTimeout(window[`quiz${i}Timer`]);
      const modal = document.getElementById(`quizModal${i}`);
      if (modal) modal.style.display = 'none';
      const guide = document.getElementById(`guideModal${i}`);
      if (guide) guide.style.display = 'none';
    }
    
    if (window.sqlEditor) {
      window.sqlEditor.toTextArea();
      window.sqlEditor = null;
    }

    if (route.view === 'home') {
      this.renderHome();
    } else if (route.view === 'sandbox') {
      this.renderSandbox();
    } else if (route.view === 'er-builder') {
      this.renderERBuilder();
    } else {
      await this.renderExperimentPage(route.expId, route.page);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Home page                                                            */
  /* ------------------------------------------------------------------ */

  async renderHome() {
    const metas = await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => this.fetchJSON(`data/experiment-${id}/meta.json`)));
    
    const completedCount = window.StateManager ? window.StateManager.getTotalCompleted() : 0;
    const progressHtml = window.StateManager ? `
      <div class="card" style="text-align: center; background: var(--accent-light); border: 1px solid var(--accent);">
        <h2>Your Progress</h2>
        <p style="font-size: 18px; margin: 8px 0;"><strong>${completedCount} / 10</strong> Experiments Completed</p>
        ${completedCount === 10 ? `<button onclick="window.StateManager.exportResults()" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 12px;">🏆 Export Results (CSV)</button>` : ''}
      </div>
    ` : '';

    document.getElementById('sidebar').innerHTML = this.buildSidebar(null, null);
    document.getElementById('header').innerHTML  = this.buildHeader('DBMS Virtual Laboratory', 'Welcome to the Database Management Systems Virtual Lab');
    document.getElementById('main').innerHTML = `
      <span class="badge">Welcome</span>
      <div class="card">
        <h2>Welcome to DBMS Virtual Lab</h2>
        <p>This virtual lab platform helps students understand and practice various concepts in database
        management systems through interactive simulations and hands-on experiments.</p>
      </div>
      ${progressHtml}
      <div class="grid">
        ${metas.map(m => `
          <div class="card">
            <span class="badge" style="font-size:12px">${m.badge}</span>
            <h3 style="margin-top:12px">Experiment ${m.id}: ${m.shortTitle}</h3>
            <p>${m.description}</p>
            <a href="#/experiment/${m.id}/introduction"
               style="display:inline-block;margin-top:12px;color:var(--secondary);font-weight:600;text-decoration:none">
               Start Experiment →
            </a>
          </div>`).join('')}
      </div>
      <div class="card">
        <h2>How to Use This Virtual Lab</h2>
        <ol>
          <li><strong>Select an Experiment</strong> from the cards above</li>
          <li><strong>Start with the Aim</strong> — understand the objectives</li>
          <li><strong>Read the Theory</strong> — learn the fundamental concepts</li>
          <li><strong>Take the Pre-Test</strong> — assess your prior knowledge</li>
          <li><strong>Follow the Procedure</strong> — step through the experiment</li>
          <li><strong>Try the Simulation</strong> — practice interactively</li>
          <li><strong>Take the Post-Test</strong> — evaluate your understanding</li>
          <li><strong>Provide Feedback</strong> — share your thoughts</li>
        </ol>
      </div>`;

    document.title = 'DBMS Virtual Lab | Home';
    this.wireNav();
  }

  renderSandbox() {
    document.getElementById('sidebar').innerHTML = this.buildSidebar(null, 'sandbox');
    document.getElementById('header').innerHTML  = this.buildHeader('Personal Project Sandbox', 'A completely freeform SQLite environment');
    
    document.getElementById('main').innerHTML = `
      <span class="badge" style="background: var(--imperial-blue); color: white;">Personal Project Sandbox</span>
      
      <div style="display: flex; gap: 16px; margin-top: 24px; flex-wrap: wrap;">
        
        <div class="card" style="flex: 2; min-width: 400px; padding: 0;">
          <div style="background: var(--bg-color); padding: 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: var(--text);">SQL Editor</strong>
            <div>
              <button onclick="window.sandboxRun()" style="background: var(--primary); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 8px;">▶ Run Query</button>
              <button onclick="window.sandboxClear()" style="background: transparent; color: var(--text); border: 1px solid var(--border); padding: 6px 12px; border-radius: 4px; cursor: pointer;">Clear Output</button>
            </div>
          </div>
          <div style="height: 250px; border-bottom: 1px solid var(--border);">
            <textarea id="sandbox-input"></textarea>
          </div>
          <div style="padding: 16px; background: #1e1e1e; min-height: 200px; color: #a3a3a3; font-family: monospace; overflow-y: auto;" id="sandbox-output">
            $ Ready. Type your SQL query above and click Run.
          </div>
        </div>

        <div class="card" style="flex: 1; min-width: 300px; height: fit-content;">
          <h3 style="margin-top: 0;">Project Schema</h3>
          <p style="font-size: 13px; color: var(--muted); margin-bottom: 16px;">Tables and columns in your sandbox will appear here.</p>
          <div id="sandbox-schema-viewer" style="max-height: 400px; overflow-y: auto;">
            <em style="color: var(--muted);">No tables created yet.</em>
          </div>
          
          <div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 16px;">
            <h4 style="margin-top:0;">Data Management</h4>
            <button onclick="window.sandboxExport()" style="width: 100%; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg); color: var(--text); cursor: pointer;">💾 Export Database (.sqlite)</button>
            <p style="font-size: 11px; color: var(--muted);">Note: Import functionality coming soon.</p>
          </div>
        </div>

      </div>
    `;

    // Initialize CodeMirror for the Sandbox
    setTimeout(() => {
      window.sandboxEditor = CodeMirror.fromTextArea(document.getElementById('sandbox-input'), {
        mode: "text/x-mysql",
        theme: document.body.classList.contains('dark-theme') ? "dracula" : "default",
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true
      });
      
      // Setup window functions for the sandbox
      window.sandboxRun = function() {
        const input = window.sandboxEditor.getValue().trim();
        const output = document.getElementById('sandbox-output');
        if (!input) return;
        
        const timestamp = new Date().toLocaleTimeString();
        output.innerHTML = `<div style="margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 8px;">
          <div style="color: #60a5fa; margin-bottom: 4px;">[${timestamp}] ${input}</div>
          ${window.DB.executeQuery(input)}
        </div>` + output.innerHTML;
        
        window.sandboxRenderSchema();
      };
      
      window.sandboxClear = function() {
        document.getElementById('sandbox-output').innerHTML = '$ Ready.';
      };

      window.sandboxExport = function() {
        if (!window.DB || !window.DB.isReady) return;
        const data = window.DB.db.export();
        const blob = new Blob([data], { type: "application/x-sqlite3" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "my_project.sqlite";
        a.click();
      };

      window.sandboxRenderSchema = function() {
        const viewer = document.getElementById('sandbox-schema-viewer');
        const schema = window.DB ? window.DB.getSchema() : {};
        
        if (Object.keys(schema).length === 0) {
          viewer.innerHTML = '<em style="color: var(--muted);">No tables created yet.</em>';
          return;
        }
        
        let html = '';
        for (const [tableName, tableData] of Object.entries(schema)) {
          html += `<div style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden; margin-bottom: 12px; font-size: 14px;">
            <div style="background: var(--bg-color); padding: 8px 12px; border-bottom: 1px solid var(--border); font-weight: bold; color: var(--primary);">
              🗄️ ${tableName}
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>`;
          tableData.columns.forEach(col => {
            html += `<tr>
              <td style="padding: 6px 12px; border-bottom: 1px solid var(--border); color: var(--text);">${col.name}</td>
              <td style="padding: 6px 12px; border-bottom: 1px solid var(--border); color: var(--muted); font-family: monospace;">${col.type}</td>
            </tr>`;
          });
          html += `</tbody></table></div>`;
        }
        viewer.innerHTML = html;
      };
      
      // Render initial schema if any
      window.sandboxRenderSchema();
      
    }, 100);

    this.wireNav();
    window.scrollTo(0, 0);
  }

  renderERBuilder() {
    document.getElementById('sidebar').innerHTML = this.buildSidebar(null, 'er-builder');
    document.getElementById('header').innerHTML  = this.buildHeader('ER Diagram Builder', 'Design your database visually and generate SQL');
    
    document.getElementById('main').innerHTML = `
      <span class="badge" style="background: var(--imperial-blue); color: white;">ER Builder</span>
      
      <div style="display: flex; gap: 16px; margin-top: 24px;">
        <!-- Toolbox -->
        <div class="card" style="width: 250px; flex-shrink: 0;">
          <h3 style="margin-bottom: 16px;">Toolbox</h3>
          <button onclick="window.erBuilder.addEntity()" class="sim-btn" style="width: 100%; margin-bottom: 12px; background: var(--imperial-blue); color: white;">+ Add Entity</button>
          <button onclick="window.erBuilder.clearCanvas()" class="sim-btn" style="width: 100%; margin-bottom: 12px; background: var(--muted); color: white;">Clear Canvas</button>
          <hr style="border: none; border-top: 1px solid var(--border); margin: 16px 0;">
          <button onclick="window.erBuilder.generateSQL()" class="sim-btn" style="width: 100%; background: var(--primary); color: white; font-size: 16px; padding: 12px;">⚡ Generate SQL</button>
        </div>
        
        <!-- Canvas -->
        <div class="card" id="er-canvas" style="flex-grow: 1; min-height: 600px; position: relative; background: var(--bg-color); background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; overflow: hidden;">
          <!-- Entities will be appended here -->
        </div>
      </div>
      
      <!-- SQL Output Modal -->
      <div id="er-sql-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
        <div class="card" style="width: 600px; max-width: 90%; position: relative;">
          <h2>Generated SQL</h2>
          <p style="color: var(--muted); margin-bottom: 16px;">Copy this code or run it in the Sandbox!</p>
          <pre id="er-sql-output" style="max-height: 400px; overflow-y: auto; background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px;"></pre>
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
            <button onclick="document.getElementById('er-sql-modal').style.display='none'" class="sim-btn" style="background: var(--muted); color: white;">Close</button>
            <button onclick="window.erBuilder.copySQL()" class="sim-btn" style="background: var(--primary); color: white;">Copy to Clipboard</button>
          </div>
        </div>
      </div>
    `;

    if (!window.erBuilderInit) {
      window.erBuilderInit = true;
      window.erBuilder = {
        entityCount: 0,
        isDragging: false,
        currentDrag: null,
        offset: { x: 0, y: 0 },
        
        addEntity() {
          this.entityCount++;
          const id = 'entity-' + this.entityCount;
          const el = document.createElement('div');
          el.id = id;
          el.className = 'er-entity card';
          el.style.position = 'absolute';
          el.style.left = '50px';
          el.style.top = '50px';
          el.style.width = '200px';
          el.style.padding = '0';
          el.style.cursor = 'move';
          el.style.border = '2px solid var(--imperial-blue)';
          el.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          
          el.innerHTML = `
            <div style="background: var(--imperial-blue); color: white; padding: 8px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
              <input type="text" value="Table_${this.entityCount}" class="er-table-name" style="background: transparent; border: none; color: white; font-weight: bold; outline: none; width: 140px;">
              <button onclick="this.closest('.er-entity').remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">&times;</button>
            </div>
            <div class="er-attributes" style="padding: 8px; background: var(--card);">
              <div style="display: flex; gap: 4px; margin-bottom: 4px;">
                <input type="text" value="id" class="er-attr-name" style="width: 80px; padding: 4px; border: 1px solid var(--border); border-radius: 4px; font-size: 12px;">
                <select class="er-attr-type" style="width: 80px; padding: 4px; border: 1px solid var(--border); border-radius: 4px; font-size: 12px;">
                  <option value="INT PRIMARY KEY">INT PK</option>
                  <option value="VARCHAR(255)">VARCHAR</option>
                  <option value="INT">INT</option>
                </select>
              </div>
            </div>
            <button onclick="window.erBuilder.addAttribute('${id}')" style="width: 100%; border: none; border-top: 1px solid var(--border); background: var(--bg-color); padding: 6px; cursor: pointer; color: var(--muted); font-size: 12px;">+ Add Attribute</button>
          `;
          
          el.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') return;
            this.isDragging = true;
            this.currentDrag = el;
            this.offset.x = e.clientX - el.offsetLeft;
            this.offset.y = e.clientY - el.offsetTop;
            el.style.zIndex = 1000;
          });
          
          document.getElementById('er-canvas').appendChild(el);
        },
        
        addAttribute(entityId) {
          const attrContainer = document.querySelector('#' + entityId + ' .er-attributes');
          const div = document.createElement('div');
          div.style.display = 'flex';
          div.style.gap = '4px';
          div.style.marginBottom = '4px';
          div.innerHTML = `
            <input type="text" placeholder="name" class="er-attr-name" style="width: 80px; padding: 4px; border: 1px solid var(--border); border-radius: 4px; font-size: 12px;">
            <select class="er-attr-type" style="width: 80px; padding: 4px; border: 1px solid var(--border); border-radius: 4px; font-size: 12px;">
              <option value="VARCHAR(255)">VARCHAR</option>
              <option value="INT">INT</option>
              <option value="DATE">DATE</option>
            </select>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--muted); cursor: pointer;">&times;</button>
          `;
          attrContainer.appendChild(div);
        },
        
        clearCanvas() {
          if(confirm('Are you sure you want to clear the canvas?')) {
            document.getElementById('er-canvas').innerHTML = '';
            this.entityCount = 0;
          }
        },
        
        generateSQL() {
          const entities = document.querySelectorAll('.er-entity');
          if (entities.length === 0) {
            alert('Please add at least one entity to the canvas!');
            return;
          }
          
          let sql = '-- Generated from ER Builder\n\n';
          entities.forEach(ent => {
            const tableName = ent.querySelector('.er-table-name').value;
            sql += `CREATE TABLE ${tableName} (\n`;
            
            const attrs = ent.querySelectorAll('.er-attributes > div');
            const colDefs = [];
            attrs.forEach(attr => {
              const name = attr.querySelector('.er-attr-name').value;
              const type = attr.querySelector('.er-attr-type').value;
              if (name) {
                colDefs.push(`    ${name} ${type}`);
              }
            });
            
            sql += colDefs.join(',\n') + '\n);\n\n';
          });
          
          document.getElementById('er-sql-output').textContent = sql;
          document.getElementById('er-sql-modal').style.display = 'flex';
        },
        
        copySQL() {
          const sql = document.getElementById('er-sql-output').textContent;
          navigator.clipboard.writeText(sql);
          alert('Copied to clipboard!');
        }
      };
      
      document.addEventListener('mousemove', (e) => {
        if (window.erBuilder && window.erBuilder.isDragging && window.erBuilder.currentDrag) {
          const el = window.erBuilder.currentDrag;
          
          let newX = e.clientX - window.erBuilder.offset.x;
          let newY = e.clientY - window.erBuilder.offset.y;
          
          el.style.left = newX + 'px';
          el.style.top = newY + 'px';
        }
      });
      
      document.addEventListener('mouseup', () => {
        if (window.erBuilder) {
          window.erBuilder.isDragging = false;
          if (window.erBuilder.currentDrag) {
            window.erBuilder.currentDrag.style.zIndex = '';
            window.erBuilder.currentDrag = null;
          }
        }
      });
    }
    this.wireNav();
    window.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------------ */
  /* Experiment page                                                      */
  /* ------------------------------------------------------------------ */

  async renderExperimentPage(expId, page) {
    const meta = await this.fetchJSON(`data/experiment-${expId}/meta.json`);

    document.getElementById('sidebar').innerHTML = this.buildSidebar(expId, page);
    document.getElementById('header').innerHTML  = this.buildHeader(
      'DBMS Virtual Laboratory',
      `Experiment ${expId}: ${meta.title}`
    );

    let html = '';

    if (page === 'simulation') {
      html = await this.renderSimulation(expId);
      // Set innerHTML for simulation
      document.getElementById('main').innerHTML = html;
      document.title = `DBMS Virtual Lab | ${PAGE_TITLES[page] || page}`;
      window.scrollTo(0, 0);
      this.wireNav();
      
      // Initialize quiz timer and CodeMirror AFTER DOM is ready
      setTimeout(() => {
        const initFn = window[`initQuiz${expId}`];
        if (typeof initFn === 'function') {
          initFn();
          console.log(`✓ Quiz${expId} initialized successfully`);
        }
        
        // Initialize CodeMirror if the editor exists
        const sqlInput = document.getElementById('ddl-input') || document.getElementById('dml-input') || document.getElementById('terminal-input');
        if (sqlInput) {
          if (window.CodeMirror) {
            console.log('CodeMirror found, initializing on', sqlInput.id);
            const isDark = document.body.classList.contains('dark-theme');
            try {
              window.sqlEditor = CodeMirror.fromTextArea(sqlInput, {
                mode: 'text/x-sql',
                theme: isDark ? 'dracula' : 'default',
                lineNumbers: true,
                viewportMargin: Infinity
              });
              
              // Ensure CodeMirror updates the underlying textarea when executing commands
              window.sqlEditor.on('change', function(cm) {
                sqlInput.value = cm.getValue();
              });
            } catch (err) {
              console.error('CodeMirror init failed:', err);
            }
          } else {
            console.error('CodeMirror script not loaded!');
          }
        }
      }, 100);
      return;
    } else if (page === 'introduction') {
      html = Renderer.introduction(meta);
    } else if (page === 'aim') {
      const data = await this.fetchJSON(`data/experiment-${expId}/aim.json`);
      html = Renderer.aim(data);
    } else if (page === 'theory') {
      const data = await this.fetchJSON(`data/experiment-${expId}/theory.json`);
      html = Renderer.theory(data, 'theory', expId);
    } else if (page === 'pretest') {
      const data = await this.fetchJSON(`data/experiment-${expId}/pretest.json`);
      html = Renderer.mcq(data, 'pretest', expId);
    } else if (page === 'posttest') {
      const data = await this.fetchJSON(`data/experiment-${expId}/posttest.json`);
      html = Renderer.mcq(data, 'posttest', expId);
    } else if (page === 'procedure') {
      const data = await this.fetchJSON(`data/experiment-${expId}/procedure.json`);
      html = Renderer.procedure(data);
    } else if (page === 'references') {
      const data = await this.fetchJSON(`data/experiment-${expId}/references.json`);
      html = Renderer.references(data);
    } else if (page === 'feedback') {
      html = Renderer.feedback();
    }

    const mainEl = document.getElementById('main');
    mainEl.innerHTML = html;
    
    // Execute any script tags injected via innerHTML
    const scripts = mainEl.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    document.title = `DBMS Virtual Lab | ${PAGE_TITLES[page] || page}`;
    window.scrollTo(0, 0);
    this.wireNav();

    if (page === 'introduction') {
      setTimeout(() => {
        if (window.StateManager && !window.StateManager.hasSeenTour()) {
          if (typeof window.startTour === 'function') {
            window.startTour();
            window.StateManager.markTourSeen();
          }
        }
      }, 500);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Simulation loader                                                    */
  /* ------------------------------------------------------------------ */

  async renderSimulation(expId) {
    // Always load the simulation script for the requested experiment.
    // This keeps Go Live / reload behavior consistent and prevents any
    // "last loaded wins" issues if a browser keeps older scripts around.
    if (simScriptEl) {
      simScriptEl.remove();
      simScriptEl = null;
      simScriptExpId = null;
    }

    simScriptEl = await this.loadScript(`data/experiment-${expId}/simulation.js`);
    simScriptExpId = expId;

    // Call the experiment-specific render function
    const renderFn = window[`sim${expId}_renderSimulation`];

    if (typeof renderFn === 'function') {
      return renderFn();
    }

    // Fallback: experiment 1 uses the generic name from the original build
    if (String(expId) === '5' && typeof window.renderSimulation === 'function') {
      return window.renderSimulation();
    }

    return '<p style="color:#dc2626">Simulation could not be loaded.</p>';
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src + '?v=' + Date.now(); // bust cache on first load
      s.onload  = () => resolve(s);
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Data fetching with cache                                             */
  /* ------------------------------------------------------------------ */

  async fetchJSON(path) {
    if (cache[path]) return cache[path];
    const res = await fetch(path + '?v=' + Date.now());
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const data = await res.json();
    cache[path] = data;
    return data;
  }

  /* ------------------------------------------------------------------ */
  /* HTML builders                                                        */
  /* ------------------------------------------------------------------ */


  buildSidebar(currentExpId, currentPage) {
    const EXP_TITLES = [
      "",
      "DBMS Architecture",
      "DDL Commands",
      "DML Commands",
      "Joins & Subqueries",
      "Aggregate Functions",
      "ER Diagrams",
      "Normalization",
      "Views & Indexes",
      "Transactions & ACID",
      "Concurrency & Deadlocks"
    ];
    
    const pages = [
      { id: 'introduction', label: 'Introduction' },
      { id: 'aim', label: 'Aim' },
      { id: 'theory', label: 'Theory' },
      { id: 'pretest', label: 'Pre-Test' },
      { id: 'procedure', label: 'Procedure' },
      { id: 'simulation', label: 'Simulation' },
      { id: 'posttest', label: 'Post-Test' },
      { id: 'references', label: 'References' },
      { id: 'feedback', label: 'Feedback' }
    ];

    let html = `
      <div class="sidebar-header">
        <h2>DBMS Virtual Lab</h2>
        <p>Department of Computer Science</p>
      </div>
      <nav>
        <a href="#/home" class="${!currentExpId && currentPage !== 'sandbox' && currentPage !== 'er-builder' ? 'active' : ''}">🏠 Home</a>
        
        <div style="margin: 16px 0 8px 16px; font-size: 11px; font-weight: bold; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Creative Tools</div>
        <a href="#/sandbox" class="${currentPage === 'sandbox' ? 'active' : ''}">🛠️ Personal Project Sandbox</a>
        <a href="#/er-builder" class="${currentPage === 'er-builder' ? 'active' : ''}">📊 ER Diagram Builder</a>
        
        <div style="margin: 16px 0 8px 16px; font-size: 11px; font-weight: bold; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Experiments</div>
    `;

    for (let i = 1; i <= 10; i++) {
      const isExpanded = String(currentExpId) === String(i);
      const isCompleted = window.StateManager ? window.StateManager.isExperimentCompleted(i) : false;
      const checkmark = isCompleted ? ' <span style="color: #16a34a;" title="Completed">✅</span>' : '';
      
      html += `
        <div style="border-bottom: 1px solid var(--border);">
          <a href="#/experiment/${i}/introduction" 
             style="display: flex; justify-content: space-between; font-weight: ${isExpanded ? 'bold' : 'normal'}; background: ${isExpanded ? 'var(--yellow-light)' : 'transparent'};">
            <span style="font-size: 13px;">Exp ${i}: ${EXP_TITLES[i]}</span>
            <span>${isExpanded ? '▼' : '▶'} ${checkmark}</span>
          </a>
      `;

      if (isExpanded) {
        html += `<div style="padding-left: 16px; background: var(--card); border-bottom: 1px solid var(--border);">`;
        pages.forEach(p => {
          const activeClass = currentPage === p.id ? 'active' : '';
          html += `<a href="#/experiment/${i}/${p.id}" class="${activeClass}" style="font-size: 13px; padding: 8px 16px;">${p.label}</a>`;
        });
        html += `</div>`;
      }
      html += `</div>`;
    }

    html += `</nav>`;
    return html;
  }

  buildHeader(title, subtitle) {
    return `
      <div class="header-left">
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      <div class="header-right" style="display: flex; align-items: center; gap: 16px;">
        <div style="text-align: right;">
          <img src="images/srm-logo.png" alt="SRM Institute of Science and Technology" style="height: 50px; width: auto; background: rgba(255, 255, 255, 0.9); padding: 4px; border-radius: 8px;">
        </div>
        <button id="theme-toggle" class="theme-btn" aria-label="Toggle dark mode">${document.body.classList.contains('dark-theme') ? '☀️' : '🌙'}</button>
      </div>`;
  }

  wireNav() {
    // Hash links handle themselves natively — hook available for future enhancements
  }
}

// Boot the app
new App();
