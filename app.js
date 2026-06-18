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
    document.getElementById('theme-toggle').addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
      if (window.StateManager) window.StateManager.setTheme(isDark ? 'dark' : 'light');
      
      if (window.sqlEditor) {
        window.sqlEditor.setOption("theme", isDark ? "dracula" : "default");
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
        if (sqlInput && window.CodeMirror) {
          const isDark = document.body.classList.contains('dark-theme');
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
      html = Renderer.theory(data);
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

    document.getElementById('main').innerHTML = html;
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
        <a href="#/home" class="${!currentExpId ? 'active' : ''}">🏠 Home</a>
    `;

    for (let i = 1; i <= 10; i++) {
      const isExpanded = String(currentExpId) === String(i);
      const isCompleted = window.StateManager ? window.StateManager.isExperimentCompleted(i) : false;
      const checkmark = isCompleted ? ' <span style="color: #16a34a;" title="Completed">✅</span>' : '';
      
      html += `
        <div style="border-bottom: 1px solid var(--border);">
          <a href="#/experiment/${i}/introduction" 
             style="display: flex; justify-content: space-between; font-weight: ${isExpanded ? 'bold' : 'normal'}; background: ${isExpanded ? 'var(--yellow-light)' : 'transparent'};">
            <span>Exp ${i}</span>
            <span>${isExpanded ? '▼' : '▶'} ${checkmark}</span>
          </a>
      `;

      if (isExpanded) {
        html += `<div style="padding-left: 16px; background: #fdfdfd;">`;
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
      <div class="header-right">
        <img src="images/srm-logo.png" alt="SRM Institute of Science and Technology" style="height: 60px; width: auto;">
      </img>`;
  }

  wireNav() {
    // Hash links handle themselves natively — hook available for future enhancements
  }
}

// Boot the app
new App();
