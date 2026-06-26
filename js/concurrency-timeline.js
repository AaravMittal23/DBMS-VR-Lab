/**
 * Concurrency Control Timeline & Locking Sandbox
 * Visualizes transaction schedules, locks, and deadlocks
 */

class ConcurrencyTimeline {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.transactions = [];
    this.resources = {};
    this.locks = {};
    this.schedule = [];
    this.currentStep = 0;
    this.deadlockDetected = false;
    
    this.options = {
      width: options.width || 900,
      height: options.height || 300,
      cellHeight: 60,
      cellWidth: 100,
      ...options
    };
  }

  /**
   * Add a transaction
   */
  addTransaction(id, name, color = '#3b82f6') {
    this.transactions.push({
      id: id,
      name: name,
      color: color,
      operations: [],
      status: 'waiting',
      locks: []
    });
  }

  /**
   * Add an operation to a transaction
   */
  addOperation(transactionId, operation, resourceId) {
    const tx = this.transactions.find(t => t.id === transactionId);
    if (tx) {
      tx.operations.push({
        type: operation, // 'READ', 'WRITE', 'LOCK', 'UNLOCK', 'COMMIT', 'ROLLBACK'
        resource: resourceId,
        timestamp: tx.operations.length,
        status: 'pending'
      });
    }
  }

  /**
   * Add a resource
   */
  addResource(id, name) {
    this.resources[id] = {
      id: id,
      name: name,
      owner: null,
      waitingFor: []
    };
  }

  /**
   * Load predefined schedule (e.g., Dirty Read, Deadlock)
   */
  loadSchedule(scheduleType) {
    this.transactions = [];
    this.schedule = [];
    
    switch(scheduleType) {
      case 'dirtyRead':
        this.transactions = [
          { id: 'T1', name: 'Transaction 1', color: '#3b82f6', operations: [], status: 'running', locks: [] },
          { id: 'T2', name: 'Transaction 2', color: '#ef4444', operations: [], status: 'running', locks: [] }
        ];
        this.schedule = [
          { tx: 'T1', op: 'WRITE', resource: 'X', lockType: 'X', description: 'T1 writes to X (exclusive lock)' },
          { tx: 'T2', op: 'READ', resource: 'X', lockType: 'S', description: 'T2 reads X before T1 commits (dirty read!)' },
          { tx: 'T1', op: 'ROLLBACK', resource: 'X', description: 'T1 rolls back - X is reverted' },
          { tx: 'T2', op: 'COMMIT', resource: 'X', description: 'T2 commits with stale data' }
        ];
        break;
        
      case 'deadlock':
        this.transactions = [
          { id: 'T1', name: 'Transaction 1', color: '#3b82f6', operations: [], status: 'running', locks: [] },
          { id: 'T2', name: 'Transaction 2', color: '#ef4444', operations: [], status: 'running', locks: [] }
        ];
        this.schedule = [
          { tx: 'T1', op: 'LOCK', resource: 'R1', lockType: 'X', description: 'T1 locks R1 (exclusive)' },
          { tx: 'T2', op: 'LOCK', resource: 'R2', lockType: 'X', description: 'T2 locks R2 (exclusive)' },
          { tx: 'T1', op: 'LOCK', resource: 'R2', lockType: 'X', description: 'T1 tries to lock R2 (blocked by T2)' },
          { tx: 'T2', op: 'LOCK', resource: 'R1', lockType: 'X', description: 'T2 tries to lock R1 (blocked by T1)' },
          { tx: 'SYSTEM', op: 'DEADLOCK', resource: 'R1,R2', description: '⚠️ DEADLOCK DETECTED!' }
        ];
        break;
        
      case 'nonRepeatableRead':
        this.transactions = [
          { id: 'T1', name: 'Transaction 1', color: '#3b82f6', operations: [], status: 'running', locks: [] },
          { id: 'T2', name: 'Transaction 2', color: '#ef4444', operations: [], status: 'running', locks: [] }
        ];
        this.schedule = [
          { tx: 'T1', op: 'READ', resource: 'A', lockType: 'S', description: 'T1 reads A = 100' },
          { tx: 'T2', op: 'WRITE', resource: 'A', lockType: 'X', description: 'T2 updates A to 200' },
          { tx: 'T2', op: 'COMMIT', resource: 'A', description: 'T2 commits' },
          { tx: 'T1', op: 'READ', resource: 'A', lockType: 'S', description: 'T1 reads A again = 200 (non-repeatable!)' },
          { tx: 'T1', op: 'COMMIT', resource: 'A', description: 'T1 commits' }
        ];
        break;

      case 'serializableExecution':
        this.transactions = [
          { id: 'T1', name: 'Transaction 1', color: '#3b82f6', operations: [], status: 'running', locks: [] },
          { id: 'T2', name: 'Transaction 2', color: '#ef4444', operations: [], status: 'running', locks: [] }
        ];
        this.schedule = [
          { tx: 'T1', op: 'LOCK', resource: 'A', lockType: 'S', description: 'T1 locks A (shared)' },
          { tx: 'T1', op: 'READ', resource: 'A', lockType: 'S', description: 'T1 reads A' },
          { tx: 'T1', op: 'LOCK', resource: 'A', lockType: 'X', description: 'T1 upgrades to exclusive lock' },
          { tx: 'T1', op: 'WRITE', resource: 'A', lockType: 'X', description: 'T1 writes to A' },
          { tx: 'T1', op: 'UNLOCK', resource: 'A', description: 'T1 releases lock on A' },
          { tx: 'T1', op: 'COMMIT', resource: 'A', description: 'T1 commits' },
          { tx: 'T2', op: 'LOCK', resource: 'A', lockType: 'S', description: 'T2 can now lock A' },
          { tx: 'T2', op: 'READ', resource: 'A', lockType: 'S', description: 'T2 reads A (committed value)' },
          { tx: 'T2', op: 'COMMIT', resource: 'A', description: 'T2 commits - serializable!' }
        ];
        break;
    }
    
    this.currentStep = 0;
  }

  /**
   * Execute next step in the schedule
   */
  executeNextStep() {
    if (this.currentStep >= this.schedule.length) {
      return { complete: true };
    }

    const step = this.schedule[this.currentStep];
    const result = this._executeOperation(step);
    
    this.currentStep++;
    return result;
  }

  /**
   * Execute an operation
   */
  _executeOperation(step) {
    const { tx, op, resource, lockType, description } = step;

    const result = {
      step: this.currentStep,
      transaction: tx,
      operation: op,
      resource: resource,
      description: description,
      success: true,
      message: description,
      locks: {},
      deadlock: false
    };

    if (tx === 'SYSTEM') {
      if (op === 'DEADLOCK') {
        this.deadlockDetected = true;
        result.deadlock = true;
      }
      return result;
    }

    const transaction = this.transactions.find(t => t.id === tx);
    if (!transaction) return result;

    switch(op) {
      case 'LOCK':
        result.locks = this._acquireLock(tx, resource, lockType);
        if (!result.locks) {
          result.success = false;
          result.message = `${tx} cannot acquire lock on ${resource}`;
        } else {
          transaction.locks.push({ resource, lockType });
        }
        break;

      case 'READ':
      case 'WRITE':
        // Implicitly holds lock
        break;

      case 'UNLOCK':
        this._releaseLock(tx, resource);
        transaction.locks = transaction.locks.filter(l => l.resource !== resource);
        break;

      case 'COMMIT':
        this._releaseLock(tx, resource);
        transaction.status = 'committed';
        transaction.locks = [];
        break;

      case 'ROLLBACK':
        transaction.status = 'rolled_back';
        transaction.locks = [];
        break;
    }

    // Update locks state
    result.locks = this._getLockState();

    return result;
  }

  /**
   * Acquire a lock
   */
  _acquireLock(txId, resourceId, lockType) {
    const resource = this.resources[resourceId];
    if (!resource) {
      this.resources[resourceId] = {
        id: resourceId,
        name: resourceId,
        owner: null,
        waitingFor: []
      };
    }

    const res = this.resources[resourceId];

    if (!res.owner) {
      res.owner = { tx: txId, lockType: lockType };
      return true;
    }

    // Shared locks can coexist
    if (lockType === 'S' && res.owner.lockType === 'S') {
      return true;
    }

    // Exclusive locks conflict with everything
    res.waitingFor.push({ tx: txId, lockType: lockType });
    return false;
  }

  /**
   * Release a lock
   */
  _releaseLock(txId, resourceId) {
    const resource = this.resources[resourceId];
    if (!resource) return;

    if (resource.owner && resource.owner.tx === txId) {
      resource.owner = null;
      
      // Grant lock to first waiting transaction
      if (resource.waitingFor.length > 0) {
        const waiter = resource.waitingFor.shift();
        resource.owner = waiter;
      }
    }
  }

  /**
   * Get current lock state
   */
  _getLockState() {
    const state = {};
    Object.entries(this.resources).forEach(([id, resource]) => {
      state[id] = {
        owner: resource.owner ? resource.owner.tx : null,
        lockType: resource.owner ? resource.owner.lockType : null,
        waiting: resource.waitingFor
      };
    });
    return state;
  }

  /**
   * Render timeline visualization
   */
  renderTimeline() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = '';

    const html = this._buildTimelineHTML();
    container.innerHTML = html;
  }

  /**
   * Build timeline HTML
   */
  _buildTimelineHTML() {
    let html = `<div style="overflow-x: auto; padding: 16px 0;">
      <div style="display: inline-flex; gap: 2px;">`;

    // Header with transaction names
    html += `<div style="flex-shrink: 0;">
      <div style="height: 50px; display: flex; align-items: center; font-weight: bold; padding: 0 8px;">Step</div>`;
    
    this.transactions.forEach(tx => {
      html += `<div style="height: 50px; width: ${this.options.cellWidth}px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: ${tx.color};">${tx.name}</div>`;
    });
    
    html += `</div>`;

    // Timeline cells
    this.schedule.forEach((step, idx) => {
      html += `<div style="display: flex; flex-direction: column; border-left: 1px solid var(--border);">
        <div style="height: 50px; width: 60px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--muted); font-size: 12px;">S${idx + 1}</div>`;

      this.transactions.forEach(tx => {
        const isActive = step.tx === tx.id;
        const isCurrent = idx === this.currentStep;
        
        let cellStyle = `height: ${this.options.cellHeight}px; width: ${this.options.cellWidth}px; border-right: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 11px; text-align: center; padding: 4px;`;
        
        if (isActive) {
          if (step.op === 'LOCK' || step.op === 'WRITE') {
            cellStyle += `background: ${tx.color}40; border: 2px solid ${tx.color}; font-weight: bold;`;
          } else if (step.op === 'READ') {
            cellStyle += `background: ${tx.color}20; border: 1px solid ${tx.color};`;
          } else {
            cellStyle += `background: ${tx.color}10; border: 1px solid ${tx.color};`;
          }
          
          if (isCurrent) {
            cellStyle += `box-shadow: inset 0 0 0 2px #fbbf24;`;
          }
        }

        html += `<div style="${cellStyle}">`;
        
        if (isActive) {
          html += `<span style="font-weight: bold;">${step.op}</span><br><span style="font-size: 10px; opacity: 0.7;">${step.resource}</span>`;
        }
        
        html += `</div>`;
      });

      html += `</div>`;
    });

    html += `</div></div>`;

    return html;
  }

  /**
   * Render legend
   */
  renderLegend() {
    const html = `
      <div style="display: flex; gap: 24px; flex-wrap: wrap; font-size: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; background: #3b82f640; border: 2px solid #3b82f6;"></div>
          <span>Exclusive Lock (X)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; background: #3b82f620; border: 1px solid #3b82f6;"></div>
          <span>Shared Lock (S)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; background: #f59e0b40; border: 2px solid #f59e0b;"></div>
          <span>Blocked/Waiting</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; background: #ef444440; border: 2px solid #ef4444;"></div>
          <span>Deadlock</span>
        </div>
      </div>
    `;
    return html;
  }
}

if (typeof window !== 'undefined') {
  window.ConcurrencyTimeline = ConcurrencyTimeline;
}
