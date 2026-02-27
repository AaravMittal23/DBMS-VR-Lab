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
    this.router = new Router(route => this.handleRoute(route));
    this.init();
  }

  async init() {
    await this.handleRoute(this.router.current());
  }

  /* ------------------------------------------------------------------ */
  /* Routing                                                              */
  /* ------------------------------------------------------------------ */

  async handleRoute(route) {
    // Clean up any running quiz timers from previous simulations
    if (window.quiz1Timer) clearTimeout(window.quiz1Timer);
    if (window.quiz2Timer) clearTimeout(window.quiz2Timer);
    if (window.quiz3Timer) clearTimeout(window.quiz3Timer);
    // Close any open quiz modals
    if (document.getElementById('quizModal1')) document.getElementById('quizModal1').style.display = 'none';
    if (document.getElementById('quizModal2')) document.getElementById('quizModal2').style.display = 'none';
    if (document.getElementById('quizModal3')) document.getElementById('quizModal3').style.display = 'none';

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
    const metas = await Promise.all([1,2,3].map(id => this.fetchJSON(`data/experiment-${id}/meta.json`)));

    document.getElementById('sidebar').innerHTML = this.buildSidebar(null, null);
    document.getElementById('header').innerHTML  = this.buildHeader('DBMS Virtual Laboratory', 'Welcome to the Database Management Systems Virtual Lab');
    document.getElementById('main').innerHTML = `
      <span class="badge">Welcome</span>
      <div class="card">
        <h2>Welcome to DBMS Virtual Lab</h2>
        <p>This virtual lab platform helps students understand and practice various concepts in database
        management systems through interactive simulations and hands-on experiments.</p>
      </div>
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
      
      // Initialize quiz timer AFTER DOM is ready
      setTimeout(() => {
        const initFn = window[`initQuiz${expId}`];
        if (typeof initFn === 'function') {
          initFn();
          console.log(`✓ Quiz${expId} initialized successfully`);
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
      html = Renderer.mcq(data, 'pretest');
    } else if (page === 'posttest') {
      const data = await this.fetchJSON(`data/experiment-${expId}/posttest.json`);
      html = Renderer.mcq(data, 'posttest');
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
    if (String(expId) === '1' && typeof window.renderSimulation === 'function') {
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
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const data = await res.json();
    cache[path] = data;
    return data;
  }

  /* ------------------------------------------------------------------ */
  /* HTML builders                                                        */
  /* ------------------------------------------------------------------ */

  buildSidebar(expId, activePage) {
    const homeLink = `<a href="#/" class="${!expId ? 'active' : ''}">🏠 Lab Home</a>`;

    if (!expId) {
      return `
        <div class="sidebar-header">
          <h2>DBMS Virtual Lab</h2>
          <p>Navigation</p>
        </div>
        <nav>${homeLink}</nav>`;
    }

    const expLinks = NAV_PAGES.map(p => `
      <a href="#/experiment/${expId}/${p}" class="${p === activePage ? 'active' : ''}">
        ${PAGE_TITLES[p]}
      </a>`).join('');

    return `
      <div class="sidebar-header">
        <h2>DBMS Virtual Lab</h2>
        <p>Experiment ${expId}</p>
      </div>
      <nav>
        ${homeLink}
        <div class="sidebar-divider"></div>
        ${expLinks}
      </nav>`;
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
