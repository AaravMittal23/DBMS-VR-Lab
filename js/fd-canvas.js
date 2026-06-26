/**
 * Functional Dependency & Normalization Canvas
 * Interactive FD diagram and table decomposition simulator
 */

class FunctionalDependencyCanvas {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.attributes = options.attributes || ['A', 'B', 'C', 'D', 'E'];
    this.dependencies = [];
    this.tables = [{ name: 'Original', attributes: this.attributes.slice() }];
    this.decompositions = [];

    this.options = {
      width: options.width || 800,
      height: options.height || 300,
      ...options
    };
  }

  /**
   * Add a functional dependency
   */
  addDependency(from, to) {
    if (!this.dependencies.find(d => d.from === from && d.to === to)) {
      this.dependencies.push({ from: from, to: to });
    }
  }

  /**
   * Remove a functional dependency
   */
  removeDependency(from, to) {
    this.dependencies = this.dependencies.filter(d => !(d.from === from && d.to === to));
  }

  /**
   * Render FD diagram
   */
  renderDiagram() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.options.width);
    svg.setAttribute('height', this.options.height);
    svg.setAttribute('style', 'border: 1px solid var(--border); border-radius: 8px; background: var(--card);');

    // Draw attributes
    const attrPositions = this._calculateAttributePositions();
    
    // Draw dependencies (arrows)
    this.dependencies.forEach(dep => {
      const fromPos = attrPositions[dep.from];
      const toPos = attrPositions[dep.to];
      
      if (fromPos && toPos) {
        this._drawArrow(svg, fromPos.x, fromPos.y, toPos.x, toPos.y, dep.from + ' → ' + dep.to);
      }
    });

    // Draw attribute boxes
    Object.entries(attrPositions).forEach(([attr, pos]) => {
      this._drawAttributeBox(svg, pos.x, pos.y, attr);
    });

    container.appendChild(svg);
  }

  /**
   * Calculate positions for attributes in a circle
   */
  _calculateAttributePositions() {
    const positions = {};
    const centerX = this.options.width / 2;
    const centerY = this.options.height / 2;
    const radius = Math.min(this.options.width, this.options.height) / 3;

    this.attributes.forEach((attr, idx) => {
      const angle = (idx / this.attributes.length) * 2 * Math.PI - Math.PI / 2;
      positions[attr] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    return positions;
  }

  /**
   * Draw arrow between attributes
   */
  _drawArrow(svg, fromX, fromY, toX, toY, label) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Start/end adjustment for circle radius
    const r = 20;
    const fromX2 = fromX + (r / distance) * dx;
    const fromY2 = fromY + (r / distance) * dy;
    const toX2 = toX - (r / distance) * dx;
    const toY2 = toY - (r / distance) * dy;

    // Line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromX2);
    line.setAttribute('y1', fromY2);
    line.setAttribute('x2', toX2);
    line.setAttribute('y2', toY2);
    line.setAttribute('stroke', '#3b82f6');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(line);

    // Arrow marker (define once)
    if (!svg.querySelector('defs')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'arrowhead');
      marker.setAttribute('markerWidth', '10');
      marker.setAttribute('markerHeight', '10');
      marker.setAttribute('refX', '9');
      marker.setAttribute('refY', '3');
      marker.setAttribute('orient', 'auto');
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', '0 0, 10 3, 0 6');
      polygon.setAttribute('fill', '#3b82f6');
      marker.appendChild(polygon);
      defs.appendChild(marker);
      svg.appendChild(defs);
    }
  }

  /**
   * Draw attribute box
   */
  _drawAttributeBox(svg, x, y, label) {
    const size = 40;
    
    // Circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', size / 2);
    circle.setAttribute('fill', '#ecfdf5');
    circle.setAttribute('stroke', '#10b981');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);

    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '16px');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#1f2937');
    text.textContent = label;
    svg.appendChild(text);
  }

  /**
   * Analyze for normal form violations
   */
  analyzeNormalForms() {
    const analysis = {
      isInFirstNF: true,
      isInSecondNF: true,
      isInThirdNF: true,
      issues: [],
      violations: {
        firstNF: [],
        secondNF: [],
        thirdNF: []
      }
    };

    // 1NF: All values must be atomic
    // (Assuming data is atomic, so always true for visualization)

    // 2NF: No partial dependencies (non-key attributes depend on part of key)
    // Check if any non-key attribute depends on a subset of candidate keys
    this.dependencies.forEach(dep => {
      if (dep.from.length < 2 && this._isNonKeyAttribute(dep.to)) {
        // Potential partial dependency in composite key scenario
        analysis.violations.secondNF.push(`${dep.from} → ${dep.to} (partial dependency)`);
        analysis.isInSecondNF = false;
      }
    });

    // 3NF: No transitive dependencies
    // If A → B and B → C, then A → C (transitive)
    this.dependencies.forEach(dep1 => {
      this.dependencies.forEach(dep2 => {
        if (dep1.to === dep2.from && dep1.from !== dep2.to) {
          // Check if this creates a transitive dependency
          const directDep = this.dependencies.find(d => d.from === dep1.from && d.to === dep2.to);
          if (directDep) {
            analysis.violations.thirdNF.push(`${dep1.from} → ${dep1.to} → ${dep2.to} (transitive)`);
            analysis.isInThirdNF = false;
          }
        }
      });
    });

    if (analysis.violations.secondNF.length > 0) {
      analysis.issues.push('Violates 2NF: Has partial dependencies');
    }
    if (analysis.violations.thirdNF.length > 0) {
      analysis.issues.push('Violates 3NF: Has transitive dependencies');
    }

    return analysis;
  }

  /**
   * Check if an attribute is likely a non-key attribute
   */
  _isNonKeyAttribute(attr) {
    return !['ID', 'PRIMARY', 'KEY'].some(k => attr.includes(k));
  }

  /**
   * Simulate table decomposition
   */
  decomposeToNF(targetNF) {
    const decomposition = [];

    if (targetNF === '1NF') {
      // Keep original
      decomposition.push({
        name: 'R (1NF)',
        attributes: this.attributes.slice(),
        primaryKey: this.attributes[0],
        dependencies: this.dependencies.slice()
      });
    } else if (targetNF === '2NF') {
      // Remove partial dependencies
      const grouped = this._groupByDependencies();
      Object.values(grouped).forEach((attrs, idx) => {
        decomposition.push({
          name: `R${idx + 1}`,
          attributes: attrs,
          primaryKey: attrs[0],
          dependencies: this.dependencies.filter(d => 
            attrs.includes(d.from) && attrs.includes(d.to)
          )
        });
      });
    } else if (targetNF === '3NF') {
      // Remove transitive dependencies
      const grouped = this._groupByDependencies();
      Object.values(grouped).forEach((attrs, idx) => {
        decomposition.push({
          name: `R${idx + 1}`,
          attributes: attrs,
          primaryKey: attrs[0],
          dependencies: this.dependencies.filter(d => 
            attrs.includes(d.from) && attrs.includes(d.to)
          )
        });
      });
    }

    this.decompositions = decomposition;
    return decomposition;
  }

  /**
   * Group attributes by dependencies
   */
  _groupByDependencies() {
    const groups = {};
    
    this.dependencies.forEach(dep => {
      const key = dep.from;
      if (!groups[key]) {
        groups[key] = [dep.from];
      }
      if (!groups[key].includes(dep.to)) {
        groups[key].push(dep.to);
      }
    });

    return groups;
  }

  /**
   * Check if decomposition is lossless
   */
  isLosslessDecomposition() {
    // Simplified check: if all primary keys are preserved, it's lossless
    const allPKs = this.decompositions.map(t => t.primaryKey);
    return allPKs.length === new Set(allPKs).size;
  }

  /**
   * Check if decomposition preserves dependencies
   */
  isDependencyPreserving() {
    const covered = [];
    
    this.decompositions.forEach(table => {
      table.dependencies.forEach(dep => {
        covered.push(`${dep.from}→${dep.to}`);
      });
    });

    const original = this.dependencies.map(d => `${d.from}→${d.to}`);
    
    return original.every(dep => covered.includes(dep));
  }
}

if (typeof window !== 'undefined') {
  window.FunctionalDependencyCanvas = FunctionalDependencyCanvas;
}
