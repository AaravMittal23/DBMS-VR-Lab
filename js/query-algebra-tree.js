/**
 * Interactive Relational Algebra Tree Visualizer
 * Renders query execution trees with interactive operators
 */

class RelationalAlgebraTree {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      width: options.width || 800,
      height: options.height || 400,
      nodeRadius: options.nodeRadius || 30,
      verticalGap: options.verticalGap || 100,
      horizontalGap: options.horizontalGap || 60,
      ...options
    };
    this.tree = null;
    this.selectedNode = null;
    this.nodeDetails = {};
  }

  /**
   * Parse SQL query into an algebra tree structure
   */
  parseQuery(sql) {
    const upperSQL = sql.toUpperCase().trim();
    
    const tree = {
      id: 'root-' + Date.now(),
      operator: '⟲ SELECT',
      label: 'PROJECTION',
      tables: [],
      children: [],
      metadata: { sql: sql }
    };

    // Check for JOINs
    if (upperSQL.includes('JOIN')) {
      const joinNode = {
        id: 'join-' + Date.now(),
        operator: '⋈',
        label: this._extractJoinType(upperSQL),
        tables: [],
        children: [],
        metadata: { type: 'join' }
      };
      tree.children.push(joinNode);

      // Add table nodes
      const tables = this._extractTables(upperSQL);
      tables.forEach((table, idx) => {
        const tableNode = {
          id: 'table-' + idx + '-' + Date.now(),
          operator: '📋',
          label: 'TABLE: ' + table.toUpperCase(),
          tables: [table],
          children: [],
          metadata: { type: 'table', name: table }
        };
        joinNode.children.push(tableNode);
      });
    } else if (upperSQL.includes('GROUP BY')) {
      // Aggregation node
      const aggNode = {
        id: 'agg-' + Date.now(),
        operator: 'Γ',
        label: 'AGGREGATION',
        tables: [],
        children: [],
        metadata: { type: 'aggregation' }
      };
      tree.children.push(aggNode);
    }

    // Check for WHERE clause (Selection)
    if (upperSQL.includes('WHERE')) {
      const selNode = {
        id: 'sel-' + Date.now(),
        operator: 'σ',
        label: 'SELECTION',
        tables: [],
        children: tree.children.length > 0 ? tree.children : [],
        metadata: { type: 'selection', condition: this._extractWhereClause(upperSQL) }
      };
      if (tree.children.length === 0) {
        tree.children = [selNode];
      } else {
        tree.children = [selNode];
      }
    }

    this.tree = tree;
    return tree;
  }

  /**
   * Extract table names from SQL
   */
  _extractTables(sql) {
    const fromMatch = sql.match(/FROM\s+(\w+)/);
    const joinMatch = sql.matchAll(/JOIN\s+(\w+)/g);
    
    const tables = [];
    if (fromMatch) tables.push(fromMatch[1]);
    for (const match of joinMatch) {
      tables.push(match[1]);
    }
    return [...new Set(tables)]; // Remove duplicates
  }

  /**
   * Extract JOIN type
   */
  _extractJoinType(sql) {
    if (sql.includes('INNER JOIN')) return 'INNER JOIN';
    if (sql.includes('LEFT JOIN')) return 'LEFT JOIN';
    if (sql.includes('RIGHT JOIN')) return 'RIGHT JOIN';
    if (sql.includes('FULL OUTER')) return 'FULL OUTER JOIN';
    return 'JOIN';
  }

  /**
   * Extract WHERE clause
   */
  _extractWhereClause(sql) {
    const match = sql.match(/WHERE\s+(.+?)(?:GROUP BY|ORDER BY|;|$)/i);
    return match ? match[1].trim() : '';
  }

  /**
   * Render the tree to SVG
   */
  render() {
    if (!this.tree) return;

    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.options.width);
    svg.setAttribute('height', this.options.height);
    svg.setAttribute('style', 'border: 1px solid var(--border); border-radius: 8px; background: var(--card);');

    // Calculate positions
    const positions = this._calculatePositions(this.tree);

    // Draw connections first
    positions.forEach(pos => {
      if (pos.parent) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', pos.parent.x);
        line.setAttribute('y1', pos.parent.y);
        line.setAttribute('x2', pos.x);
        line.setAttribute('y2', pos.y);
        line.setAttribute('stroke', 'var(--border)');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
      }
    });

    // Draw nodes
    positions.forEach(pos => {
      this._drawNode(svg, pos);
    });

    container.appendChild(svg);
  }

  /**
   * Calculate node positions (simple tree layout)
   */
  _calculatePositions(node, x = null, y = null, xOffset = 0) {
    if (x === null) x = this.options.width / 2;
    if (y === null) y = 40;

    const positions = [{
      node: node,
      x: x,
      y: y,
      parent: null
    }];

    if (node.children && node.children.length > 0) {
      const childWidth = (this.options.width - 100) / node.children.length;
      const startX = (this.options.width / 2) - ((node.children.length - 1) * childWidth) / 2;

      node.children.forEach((child, idx) => {
        const childX = startX + (idx * childWidth);
        const childPositions = this._calculatePositions(
          child,
          childX,
          y + this.options.verticalGap,
          xOffset
        );
        
        childPositions[0].parent = { x, y };
        positions.push(...childPositions);
      });
    }

    return positions;
  }

  /**
   * Draw a single node
   */
  _drawNode(svg, pos) {
    const { node, x, y } = pos;
    const r = this.options.nodeRadius;

    // Color based on operator type
    let color = '#3b82f6'; // default blue
    if (node.operator.includes('σ')) color = '#10b981'; // green for selection
    if (node.operator.includes('⟲')) color = '#f59e0b'; // orange for projection
    if (node.operator.includes('⋈')) color = '#8b5cf6'; // purple for join
    if (node.operator.includes('📋')) color = '#ec4899'; // pink for table
    if (node.operator.includes('Γ')) color = '#06b6d4'; // cyan for aggregation

    // Circle background
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', color + '20');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('cursor', 'pointer');
    circle.setAttribute('data-node-id', node.id);

    circle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectNode(node, x, y);
    });

    svg.appendChild(circle);

    // Operator text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '20px');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', color);
    text.setAttribute('pointer-events', 'none');
    text.textContent = node.operator;

    svg.appendChild(text);

    // Label below
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y + r + 18);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '12px');
    label.setAttribute('fill', 'var(--text)');
    label.setAttribute('pointer-events', 'none');
    label.textContent = node.label;

    svg.appendChild(label);
  }

  /**
   * Select a node and show details
   */
  selectNode(node, x, y) {
    this.selectedNode = node;
    this._showNodeDetails(node);
  }

  /**
   * Show intermediate results for a node
   */
  _showNodeDetails(node) {
    const detailsEl = document.getElementById(this.containerId + '-details');
    if (!detailsEl) return;

    let html = `<div style="padding: 16px; background: var(--card); border-radius: 8px; border-left: 4px solid #3b82f6;">`;
    html += `<h3 style="margin-top: 0;">${node.label}</h3>`;
    html += `<p style="color: var(--muted); font-size: 14px; margin: 8px 0;">Operator: <code>${node.operator}</code></p>`;

    if (node.metadata.type === 'join') {
      html += `<p><strong>Join Type:</strong> ${node.metadata.label || 'INNER JOIN'}</p>`;
      html += `<p style="font-size: 12px; color: var(--muted);">This operator combines rows from two tables based on a join condition.</p>`;
    } else if (node.metadata.type === 'selection') {
      html += `<p><strong>Condition:</strong> <code>${node.metadata.condition}</code></p>`;
      html += `<p style="font-size: 12px; color: var(--muted);">Filters rows that satisfy the WHERE condition.</p>`;
    } else if (node.metadata.type === 'aggregation') {
      html += `<p style="font-size: 12px; color: var(--muted);">Groups rows and applies aggregate functions (COUNT, SUM, AVG, etc.)</p>`;
    } else if (node.metadata.type === 'table') {
      html += `<p><strong>Source:</strong> ${node.metadata.name.toUpperCase()}</p>`;
      html += `<p style="font-size: 12px; color: var(--muted);">Base relation from the database.</p>`;
    }

    html += `</div>`;
    detailsEl.innerHTML = html;
  }

  /**
   * Simulate intermediate table output for a node
   */
  getIntermediateResults(node, data) {
    // This would process the actual data through the operator
    // For now, return mock results
    return {
      operator: node.operator,
      rows: 4,
      sample: [
        { id: 1, name: 'Alice', dept: 'Engineering' },
        { id: 2, name: 'Bob', dept: 'HR' }
      ]
    };
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.RelationalAlgebraTree = RelationalAlgebraTree;
}
