/**
 * Interactive B+ Tree Index Visualizer
 * Simulates B+ tree operations with animations
 */

class BPlusTree {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.order = options.order || 3; // Branching factor
    this.nodes = {};
    this.nodeCount = 0;
    this.root = null;
    this.animationSpeed = options.animationSpeed || 300;
    this.insertedValues = [];

    // Create root
    this._createNode(true);
  }

  /**
   * Create a new tree node
   */
  _createNode(isLeaf = false) {
    const nodeId = 'node-' + (this.nodeCount++);
    this.nodes[nodeId] = {
      id: nodeId,
      keys: [],
      children: [],
      isLeaf: isLeaf,
      parent: null,
      x: 0,
      y: 0
    };
    if (!this.root) {
      this.root = nodeId;
    }
    return nodeId;
  }

  /**
   * Insert a value into the tree
   */
  insert(value) {
    if (this.insertedValues.includes(value)) {
      return { success: false, message: `Value ${value} already exists` };
    }

    this.insertedValues.push(value);
    const result = this._insertRecursive(this.root, value);
    
    // Check if root needs to split
    const rootNode = this.nodes[this.root];
    if (rootNode.keys.length > this.order - 1) {
      this._splitRoot();
    }

    return result;
  }

  /**
   * Recursive insertion
   */
  _insertRecursive(nodeId, value) {
    const node = this.nodes[nodeId];
    
    if (node.isLeaf) {
      // Insert into leaf
      node.keys.push(value);
      node.keys.sort((a, b) => a - b);
      
      if (node.keys.length > this.order - 1) {
        return this._splitNode(nodeId);
      }
      return { success: true, message: `Inserted ${value}`, path: [nodeId] };
    }

    // Find appropriate child
    let childIndex = 0;
    for (let i = 0; i < node.keys.length; i++) {
      if (value > node.keys[i]) {
        childIndex = i + 1;
      }
    }

    if (childIndex >= node.children.length) {
      // Create child if needed
      const newChildId = this._createNode(true);
      node.children.push(newChildId);
      this.nodes[newChildId].parent = nodeId;
    }

    return this._insertRecursive(node.children[childIndex], value);
  }

  /**
   * Split a node when it's full
   */
  _splitNode(nodeId) {
    const node = this.nodes[nodeId];
    const midpoint = Math.floor(node.keys.length / 2);
    
    // Create new sibling
    const siblingId = this._createNode(node.isLeaf);
    const sibling = this.nodes[siblingId];
    
    // Split keys
    sibling.keys = node.keys.splice(midpoint);
    
    if (!node.isLeaf) {
      sibling.children = node.children.splice(midpoint + 1);
      sibling.children.forEach(childId => {
        this.nodes[childId].parent = siblingId;
      });
    }

    // Update parent
    if (node.parent) {
      const parent = this.nodes[node.parent];
      const promoteKey = node.keys[node.keys.length - 1];
      
      parent.keys.push(promoteKey);
      parent.keys.sort((a, b) => a - b);
      
      const idx = parent.keys.indexOf(promoteKey);
      parent.children.splice(idx + 1, 0, siblingId);
      sibling.parent = node.parent;
      
      if (parent.keys.length > this.order - 1) {
        return this._splitNode(node.parent);
      }
    }

    return { success: true, message: `Node split at key ${node.keys[node.keys.length - 1]}`, split: true };
  }

  /**
   * Split root
   */
  _splitRoot() {
    const oldRoot = this.root;
    const oldRootNode = this.nodes[oldRoot];
    
    const newRoot = this._createNode(false);
    const newRootNode = this.nodes[newRoot];
    
    const newChild = this._createNode(oldRootNode.isLeaf);
    const newChildNode = this.nodes[newChild];
    
    const midpoint = Math.floor(oldRootNode.keys.length / 2);
    const promoteKey = oldRootNode.keys[midpoint];
    
    newRootNode.keys = [promoteKey];
    newRootNode.children = [oldRoot, newChild];
    
    newChildNode.keys = oldRootNode.keys.splice(midpoint + 1);
    newChildNode.isLeaf = oldRootNode.isLeaf;
    
    if (!oldRootNode.isLeaf) {
      newChildNode.children = oldRootNode.children.splice(midpoint + 1);
      newChildNode.children.forEach(childId => {
        this.nodes[childId].parent = newChild;
      });
    }
    
    oldRootNode.parent = newRoot;
    newChildNode.parent = newRoot;
    
    this.root = newRoot;
  }

  /**
   * Render the tree to an SVG
   */
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('style', 'border: 1px solid var(--border); border-radius: 8px; background: var(--card);');

    // Calculate positions
    this._calculatePositions(this.root, 200, 30, 150);

    // Draw edges first
    this._drawEdges(svg, this.root);

    // Draw nodes
    this._drawNodes(svg, this.root);

    container.appendChild(svg);
  }

  /**
   * Calculate node positions (breadth-first)
   */
  _calculatePositions(nodeId, x, y, horizontalGap) {
    const node = this.nodes[nodeId];
    node.x = x;
    node.y = y;

    if (node.children && node.children.length > 0) {
      const childWidth = (node.children.length * horizontalGap * 2) / 2;
      const startX = x - childWidth / 2;
      
      node.children.forEach((childId, idx) => {
        const childX = startX + (idx * childWidth / node.children.length);
        this._calculatePositions(childId, childX, y + 80, horizontalGap * 0.7);
      });
    }
  }

  /**
   * Draw edges between nodes
   */
  _drawEdges(svg, nodeId) {
    const node = this.nodes[nodeId];
    
    if (node.children) {
      node.children.forEach(childId => {
        const child = this.nodes[childId];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y + 25);
        line.setAttribute('x2', child.x);
        line.setAttribute('y2', child.y - 25);
        line.setAttribute('stroke', 'var(--border)');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
        
        this._drawEdges(svg, childId);
      });
    }
  }

  /**
   * Draw nodes
   */
  _drawNodes(svg, nodeId) {
    const node = this.nodes[nodeId];
    const keyCount = node.keys.length;
    const width = Math.max(60, keyCount * 25 + 10);
    const height = 50;
    const x = node.x;
    const y = node.y;

    // Node background
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x - width / 2);
    rect.setAttribute('y', y - height / 2);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', node.isLeaf ? '#ecfdf5' : '#eff6ff');
    rect.setAttribute('stroke', node.isLeaf ? '#10b981' : '#3b82f6');
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('rx', '4');
    svg.appendChild(rect);

    // Keys
    const keySpacing = width / (keyCount + 1);
    node.keys.forEach((key, idx) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x - width / 2 + keySpacing * (idx + 1));
      text.setAttribute('y', y + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12px');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#1f2937');
      text.textContent = key;
      svg.appendChild(text);
    });

    // Label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y - 30);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '11px');
    label.setAttribute('fill', 'var(--muted)');
    label.textContent = node.isLeaf ? 'LEAF' : 'INTERNAL';
    svg.appendChild(label);

    // Recursively draw children
    if (node.children) {
      node.children.forEach(childId => {
        this._drawNodes(svg, childId);
      });
    }
  }

  /**
   * Search for a value
   */
  search(value) {
    const path = [];
    let found = false;
    
    const searchRecursive = (nodeId) => {
      const node = this.nodes[nodeId];
      path.push(nodeId);
      
      if (node.keys.includes(value)) {
        found = true;
        return;
      }
      
      if (!node.isLeaf) {
        let childIndex = 0;
        for (let i = 0; i < node.keys.length; i++) {
          if (value > node.keys[i]) {
            childIndex = i + 1;
          }
        }
        if (childIndex < node.children.length) {
          searchRecursive(node.children[childIndex]);
        }
      }
    };

    searchRecursive(this.root);
    return { found, path, steps: path.length };
  }

  /**
   * Get statistics
   */
  getStats() {
    const stats = {
      nodeCount: Object.keys(this.nodes).length,
      leafCount: Object.values(this.nodes).filter(n => n.isLeaf).length,
      internalCount: Object.values(this.nodes).filter(n => !n.isLeaf).length,
      maxKeys: Math.max(...Object.values(this.nodes).map(n => n.keys.length)),
      insertedValues: this.insertedValues.length
    };
    return stats;
  }

  /**
   * Clear the tree
   */
  clear() {
    this.nodes = {};
    this.nodeCount = 0;
    this.insertedValues = [];
    this._createNode(true);
  }
}

if (typeof window !== 'undefined') {
  window.BPlusTree = BPlusTree;
}
