/**
 * State Manager for DBMS Virtual Lab
 * Handles saving and retrieving progress from localStorage.
 */
const StateManager = {
  STATE_KEY: 'dbms_vr_lab_state',

  getState: function() {
    try {
      const stateStr = localStorage.getItem(this.STATE_KEY);
      if (stateStr) {
        return JSON.parse(stateStr);
      }
    } catch (e) {
      console.error("Error reading state:", e);
    }
    // Default state structure
    return {
      experiments: {}, // { expId: { pretest: score, posttest: score, completed: boolean } }
      theme: 'light',
      tourSeen: false
    };
  },

  saveState: function(state) {
    try {
      localStorage.setItem(this.STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Error saving state:", e);
    }
  },

  updateScore: function(expId, testType, score, total) {
    const state = this.getState();
    if (!state.experiments[expId]) {
      state.experiments[expId] = { pretest: null, posttest: null, completed: false };
    }
    state.experiments[expId][testType] = { score, total };
    
    // Mark experiment as completed if both tests are done (or at least posttest)
    if (state.experiments[expId].posttest) {
      state.experiments[expId].completed = true;
    }
    
    this.saveState(state);
  },

  isExperimentCompleted: function(expId) {
    const state = this.getState();
    return state.experiments[expId] && state.experiments[expId].completed === true;
  },
  
  getExperimentScore: function(expId, testType) {
    const state = this.getState();
    return state.experiments[expId] ? state.experiments[expId][testType] : null;
  },
  
  getTotalCompleted: function() {
    const state = this.getState();
    let count = 0;
    for (let i = 1; i <= 10; i++) {
      if (state.experiments[i] && state.experiments[i].completed) {
        count++;
      }
    }
    return count;
  },

  getTheme: function() {
    return this.getState().theme;
  },

  setTheme: function(theme) {
    const state = this.getState();
    state.theme = theme;
    this.saveState(state);
  },

  hasSeenTour: function() {
    return this.getState().tourSeen;
  },

  markTourSeen: function() {
    const state = this.getState();
    state.tourSeen = true;
    this.saveState(state);
  },

  exportResults: function() {
    const state = this.getState();
    let csv = "Experiment,Pre-Test Score,Post-Test Score,Completed\n";
    for (let i = 1; i <= 10; i++) {
      const exp = state.experiments[i];
      if (exp) {
        const pre = exp.pretest ? `${exp.pretest.score}/${exp.pretest.total}` : 'N/A';
        const post = exp.posttest ? `${exp.posttest.score}/${exp.posttest.total}` : 'N/A';
        const comp = exp.completed ? 'Yes' : 'No';
        csv += `Experiment ${i},${pre},${post},${comp}\n`;
      } else {
        csv += `Experiment ${i},N/A,N/A,No\n`;
      }
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dbms_lab_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};

window.StateManager = StateManager;
