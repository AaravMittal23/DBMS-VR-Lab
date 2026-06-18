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

    return `
      <span class="badge">Theory</span>
      <div class="card">
        <h2>Introduction</h2>
        <p>${data.introduction}</p>
      </div>
      ${fdSection}
      <div class="grid">${sections}</div>
      ${having}${whereVsHaving}${mappingRules}${anomalies}${example}`;
  },

  mcq(data, type) {
    const label = type === 'pretest' ? 'Pre-Test' : 'Post-Test';
    const questions = data.questions.map((q, i) => `
      <div class="card question" data-question="${i}">
        <p><strong>${i + 1}. ${q.question}</strong></p>
        ${q.options.map((opt, j) => `
          <button onclick="checkAnswer(this, ${j === q.correctIndex})">${String.fromCharCode(65+j)}) ${opt}</button>
        `).join('')}
        <p class="result"></p>
      </div>`).join('');

    return `
      <span class="badge">${label}</span>
      <p style="margin-bottom:24px;color:var(--muted);">${data.instructions}</p>
      ${questions}`;
  },

  procedure(data) {
    const steps = data.steps.map((s, i) => `
      <li>
        <strong>${s.title}</strong><br>
        ${s.content}
        ${s.subpoints ? `<ul style="margin-top:8px">${s.subpoints.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
        ${s.code ? `<pre>${escHtml(s.code)}</pre>` : ''}
      </li>`).join('');

    return `
      <span class="badge">Procedure</span>
      <div class="card">
        <h2>Step-by-Step Procedure</h2>
        <p style="color:var(--muted);margin-bottom:24px">${data.introduction}</p>
        <ol>${steps}</ol>
      </div>
      <div class="card">
        <h2>Expected Outcomes</h2>
        <ul>${data.expectedOutcomes.map(o => `<li>${o}</li>`).join('')}</ul>
      </div>`;
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
